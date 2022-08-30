import { ref } from 'vue';
import type { Service, Options, State, Result } from './types';

function useQuery<TData, TParams extends unknown[]>(
  service: Service<TData, TParams>,
  options: Options<TData, TParams>,
  initState?: State<TData, TParams>
): Result<TData, TParams> {
  const loading = ref(initState?.loading ?? false);
  const params = ref(initState?.params!);
  const data = ref(initState?.data);
  const error = ref(initState?.error);

  const run = (...args: TParams) => {
    console.log('🏄 # 模拟执行 # run # args', args);
    params.value = args;
  };

  return {
    loading,
    params,
    data,
    error,

    run,
  };
}

export default useQuery;
