import { ref, isReactive, Ref, toRefs, unref } from 'vue';
import type { Service, Config, SingleQueryResult } from './types';
import { resolvedPromise } from './tool';
import { isNull } from '../../utils/ifType';
import { merge, debounce, throttle } from '../../utils/lodash';

/**
 * 将传入的响应式变量，转成可直接使用的普通变量
 * toRefs：将响应式对象转换为普通对象，其中结果对象的每个 property 都是指向原始对象相应 property 的 ref。
 * unref：如果参数是一个 ref，则返回内部值，否则返回参数本身。这是 val = isRef(val) ? val.value : val 的语法糖函数。
 */
export const unRefParams = (...args: unknown[]) => {
  return args.map((ea) => {
    if (isReactive(ea)) {
      // reactive > toRefs > [ref].value
      const res = Object.entries(toRefs(ea as object)).map((cea) => ({
        [cea[0]]: cea[1].value,
      }));
      // merge Array > Object
      return res.reduce((prev: any, curr: any) => merge(prev, curr));
    } else return unref(ea);
  });
};

export function useSingleQuery<TQuery, TParams extends unknown[]>(
  service: Service<TQuery, TParams>,
  config: Config<TQuery, TParams>
): SingleQueryResult<TQuery, TParams> {
  // init Refs.
  const loading = ref(false);
  const data = ref<TQuery>();
  const error = ref<Error>();
  const params = ref([]) as unknown as Ref<TParams>;

  // init Config.
  const {
    loadingDelay,
    isAutoRunFlag,
    throttleInterval = null,
    debounceInterval = null,
    onBefore,
    onSuccess,
    onError,
    onAfter,
  } = config;

  const delayLoadingTimer = ref();
  /** 统一清理定时器 */
  const clearTimerAll = () => {
    delayLoadingTimer.value && delayLoadingTimer.value();
  };

  const __run = async (...args: TParams) => {
    // init Loading.
    loading.value = !loadingDelay;
    delayLoadingTimer.value = checkDelayLoading();

    // hooks onBefore.
    onBefore?.(args);
    console.log('🏄 # last # __run # args', args);

    return service(...args)
      .then((res) => {
        console.log('🏄 #### service #### res', res);

        data.value = res;
        error.value = undefined;
        // hooks onSuccess.
        onSuccess?.(res, args);
        return resolvedPromise;
      })
      .catch((err) => {
        console.log('🏄 #### service #### err', err);

        data.value = undefined;
        error.value = err;
        // hooks onError.
        onError?.(err, args);
        return resolvedPromise;
      })
      .finally(() => {
        // clear Delay
        delayLoadingTimer.value();
        // reset Loading
        loading.value = false;

        // hooks onAfter.
        onAfter?.(args);
      });
  };

  // 定义 防抖/节流 函数载体
  const debouncedRun =
    !isNull(debounceInterval) && debounce(__run, debounceInterval!);
  const throttledRun =
    !isNull(throttleInterval) && throttle(__run, throttleInterval!);

  const run = (...args: TParams) => {
    // clear.
    clearTimerAll();

    // 接收转换后的普通参数对象
    const transformArgs = unRefParams(...args) as TParams;
    // 保留原始的 args，以供后续计算
    params.value = args;
    console.log('🏄 #### run #### params.value', params.value);
    console.log('🏄 #### run #### transformArgs', transformArgs);

    // initial auto run should not debounce
    if (!isAutoRunFlag.value && debouncedRun) {
      debouncedRun(...transformArgs);
      return resolvedPromise;
    }

    if (throttledRun) {
      throttledRun(...transformArgs);
      return resolvedPromise;
    }

    return __run(...transformArgs);
  };

  const refresh = () => run(...params.value);

  /** 检测是否开启加载延迟 */
  const checkDelayLoading = () => {
    let delayTimer: any;

    if (loadingDelay) {
      delayTimer = setTimeout(() => {
        loading.value = true;
      }, loadingDelay);
    }
    return () => delayTimer && clearTimeout(delayTimer);
  };

  return {
    loading,
    error,
    data,
    params,
    run,
    refresh,
  };
}
