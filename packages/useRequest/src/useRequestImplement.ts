import useQuery from './useQuery';
import type { Service, Options, Plugin, Result } from './types';
import { onMounted, toRef } from 'vue';

function useRequestImplement<TData, TParams extends any[]>(
  service: Service<TData, TParams>,
  options: Options<TData, TParams> = {},
  plugins: Plugin<TData, TParams>[] = []
): Result<TData, TParams> {
  const { manual = false, defaultParams = [] } = options;

  const queryInstance = useQuery(service, options);
  // 这样貌似也能保证正常的响应式，按理说解构应该是不行的。
  // const { params } = queryInstance;
  const params = toRef(queryInstance, 'params');

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

    run: queryInstance.run,
  };
}

export default useRequestImplement;
