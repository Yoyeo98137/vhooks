import useRequestImplement from './useRequestImplement';
import { useLoadingDelayPlugin } from './plugins';
import type { Service, Options } from './types';

// or unknown[] ?
function useRequest<TData, TParams extends unknown[]>(
  service: Service<TData, TParams>,
  options?: Options<TData, TParams>
) {
  return useRequestImplement<TData, TParams>(service, options, [
    // useDebouncePlugin,
    useLoadingDelayPlugin,
    // usePollingPlugin,
    // useRefreshOnWindowFocusPlugin,
    // useThrottlePlugin,
    // useAutoRunPlugin,
    // useCachePlugin,
    // useRetryPlugin,
  ]);
}

export default useRequest;
