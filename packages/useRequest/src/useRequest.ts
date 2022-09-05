import useRequestImplement from './useRequestImplement';
import {
  useLoadingDelayPlugin,
  useReadyPlugin,
  useRefreshDepsPlugin,
  useDebouncePlugin,
  useThrottlePlugin,
  useRetryPlugin,
} from './plugins';
import type { Service, Options } from './types';

function useRequest<TData, TParams extends unknown[]>(
  service: Service<TData, TParams>,
  options?: Options<TData, TParams>
) {
  const basePlugins = [
    useDebouncePlugin,
    useLoadingDelayPlugin,
    useReadyPlugin,
    useRefreshDepsPlugin,

    // usePollingPlugin,
    // useRefreshOnWindowFocusPlugin,
    useThrottlePlugin,
    // useCachePlugin,
    useRetryPlugin,
  ];

  return useRequestImplement<TData, TParams>(
    service,
    options,
    // @ts-ignore
    [...basePlugins]
  );
}

export default useRequest;
