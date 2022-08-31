import { ref } from 'vue';
import type {
  Service,
  Options,
  State,
  RefPluginImpls,
  QueryResult,
  PluginReturn,
} from './types';
import type { UnWrapRefObject } from '../../utils/types';

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

  const runAsync = async (...args: TParams) => {
    setState({
      loading: true,
      params: args,

      // todo 通过扩展参数来方便插件内部的赋值？（`onBefore`）
    });

    onBefore?.(args);

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
    } catch (error) {
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

  // `run` 只是 `runAsync` 的 `catch` 语法糖
  const run = (...args: TParams) => {
    runAsync(...args).catch((error) => {
      if (!onError) {
        console.error(error);
      }
    });
  };

  const cancel = () => {
    setState({
      loading: false,
    });

    // this.runPluginHandler('onCancel');
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
  };
}

export default useQuery;
