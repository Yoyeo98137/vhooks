import { onMounted } from 'vue';
import useQuery from './useQuery';
import type { Service, Options, Plugin, Result } from './types';

function useRequestImplement<TData, TParams extends any[]>(
  service: Service<TData, TParams>,
  options: Options<TData, TParams> = {},
  plugins: Plugin<TData, TParams>[] = []
): Result<TData, TParams> {
  const { manual = false, defaultParams = [] } = options;

  const queryInstance = useQuery(service, options);
  queryInstance.pluginImpls.value = plugins.map((plugin) =>
    plugin(queryInstance, options)
  );

  // 默认的自动请求
  onMounted(() => {
    if (!manual) {
      // `queryInstance.params` 配合缓存下的默认执行
      const runParams = queryInstance.params.value || defaultParams;
      queryInstance.run(...runParams);
    }
  });

  return {
    loading: queryInstance.loading,
    params: queryInstance.params,
    data: queryInstance.data,
    error: queryInstance.error,

    // 用一层 context 包裹确实更有助于区分吧（state、action）
    runAsync: queryInstance.runAsync,
    run: queryInstance.run,
    cancel: queryInstance.cancel,
    refreshAsync: queryInstance.refreshAsync,
    refresh: queryInstance.refresh,
  };
}

export default useRequestImplement;
