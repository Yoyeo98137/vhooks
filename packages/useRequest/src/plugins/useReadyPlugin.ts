import { ref, watch } from 'vue';
import type { PluginUnRefs } from '../types';

export const useReadyPlugin: PluginUnRefs<any, any[]> = (
  fetchInstance,
  { ready = ref(true), manual, defaultParams = [] }
) => {
  watch(
    () => ready.value,
    (val) => {
      if (val) {
        if (!manual) fetchInstance.run(...defaultParams);
      }
    }
  );

  return {
    onBefore: () => {
      if (!ready.value) {
        return {
          stopNow: true,
        };
      }
    },
  };
};
