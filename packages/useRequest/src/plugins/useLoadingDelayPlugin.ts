import type { PluginUnRefs } from '../types';
import type { Nullable, Timeout } from '@/packages/utils/types';

export const useLoadingDelayPlugin: PluginUnRefs<any, any[]> = (
  fetchInstance,
  { loadingDelay }
) => {
  if (!loadingDelay) return {};

  let delayTimer: Nullable<Timeout> = null;
  const cancelTimeout = () => {
    if (delayTimer) {
      clearTimeout(delayTimer);
    }
  };

  return {
    onBefore: () => {
      cancelTimeout();

      delayTimer = setTimeout(() => {
        fetchInstance.setState({
          loading: true,
        });
      }, loadingDelay);

      return {
        loading: false,
      };
    },
    onFinally: () => {
      cancelTimeout();
    },
    onCancel: () => {
      cancelTimeout();
    },
  };
};
