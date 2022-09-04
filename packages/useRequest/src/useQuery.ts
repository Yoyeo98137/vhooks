import { ref } from 'vue';
import type {
  Service,
  Options,
  State,
  RefPluginImpls,
  QueryResult,
  PluginReturn,
} from './types';
import type { UnWrapRefObject } from '@/packages/utils/types';

type batchUpdateParams = State<any, any>;
const batchUpdateRefs = <T extends batchUpdateParams>(oldState: T) => {
  return (newState: Partial<UnWrapRefObject<batchUpdateParams>>) => {
    Object.keys(newState).forEach((key) => {
      oldState[key].value = newState[key];
    });
  };
};

function useQuery<TData, TParams extends unknown[]>(
  service: Service<TData, TParams>,
  options: Options<TData, TParams>,
  initState?: State<TData, TParams>
): QueryResult<TData, TParams> {
  const { onSuccess, onError, onBefore, onFinally } = options;

  const pluginImpls = ref([]) as RefPluginImpls<TData, TParams>;
  const loading = ref(initState?.loading ?? false);
  const params = ref(initState?.params! ?? []);
  const data = ref(initState?.data);
  const error = ref(initState?.error);

  // 大致用来区分请求的时机
  const count = ref(0);

  const setState = batchUpdateRefs({
    loading,
    data,
    error,
    params,
  });

  const notifyPluginHook = (
    event: keyof PluginReturn<TData, TParams>,
    ...rest: any[]
  ) => {
    // [1, 2, 3].filter(Boolean)
    // ---- [1, 2, 3]
    // [true, false, false].filter(Boolean)
    // ---- [true]

    const res = pluginImpls.value
      // @ts-ignore
      .map((install) => install[event]?.(...rest))
      .filter(Boolean);
    return Object.assign({}, ...res);
  };

  // 通过 `currentCount !== count.value` 的判断
  // 可以避免快速点击导致的重复请求问题，因为每次触发新请求 runAsync 都会执行 `count.value += 1`
  // 这就会出现了 请求结束后次数标识 `currentCount`，以及请求之前的次数标识 `count.value` 比对的情况
  const isSameService = (curCount: number) => curCount === count.value;

  const runAsync: (...args: TParams) => Promise<TData> = async (...args) => {
    count.value += 1;
    const currentCount = count.value;

    const { stopNow = false, ...state } = notifyPluginHook('onBefore', args);
    onBefore?.(args);

    // stop request
    if (stopNow) {
      return new Promise(() => {});
    }

    setState({
      loading: true,
      params: args,
      ...state,
    });

    try {
      const serviceContext = () => Promise.resolve(service(...params.value));
      // todo 开启缓存后接收的默认值
      // // replace service
      // let { servicePromise } = this.runPluginHandler(
      //   "onRequest",
      //   this.serviceRef.current,
      //   params
      // );
      let servicePromise: Promise<TData> | null = null;
      if (!servicePromise) {
        servicePromise = serviceContext();
      }

      const res = await servicePromise;

      // prevent run.then when request is canceled
      if (!isSameService(currentCount)) return new Promise(() => {});
      // ! 不能用 `Promise.resolve()` 替换，这需要一个 永远不会结束的 Promise 来避免执行了意外的链式操作

      setState({
        data: res,
        error: undefined,
        loading: false,
      });

      notifyPluginHook('onSuccess', res, params.value);
      onSuccess?.(res, params.value);

      notifyPluginHook('onFinally', params.value, res, undefined);
      onFinally?.(params.value, res, undefined);

      return res;

      // if Error
    } catch (error: any) {
      // prevent run.then when request is canceled
      if (!isSameService(currentCount)) return new Promise(() => {});
      // ! 不能用 `Promise.resolve()` 替换，这需要一个 永远不会结束的 Promise 来避免执行了意外的链式操作

      setState({
        error,
        loading: false,
      });

      notifyPluginHook('onError', error, params.value);
      onError?.(error, params.value);

      notifyPluginHook('onFinally', params.value, undefined, error);
      onFinally?.(params.value, undefined, error);

      throw error;
    }
  };

  // `run` 只是 `runAsync().catch` 的语法糖
  const run = (...args: TParams) => {
    runAsync(...args).catch((error) => {
      if (!onError) {
        console.error(error);
      }
    });
  };

  const cancel = () => {
    count.value += 1;
    setState({
      loading: false,
    });

    notifyPluginHook('onCancel');
  };

  const refresh = () => {
    run(...(params.value || []));
  };

  // 因为要将链式执行提供出去，所以 `refreshAsync` 需要 `return`
  const refreshAsync = () => {
    return runAsync(...(params.value || []));
  };

  return {
    pluginImpls,
    loading,
    params,
    data,
    error,

    runAsync,
    run,
    cancel,
    refresh,
    refreshAsync,

    setState,
  };
}

export default useQuery;
