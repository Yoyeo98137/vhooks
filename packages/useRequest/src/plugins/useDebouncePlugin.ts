import { ref, watchEffect } from 'vue';
import { debounce } from 'lodash';
import type { DebouncedFunc } from 'lodash';
import type { PluginUnRefs } from '../types';

export const useDebouncePlugin: PluginUnRefs<any, any[]> = (
  fetchInstance,
  { debounceWait }
) => {
  if (!debounceWait) return {};

  const debouncedRef = ref<DebouncedFunc<any>>();
  const originRunRef = ref(fetchInstance.context.runAsync);

  watchEffect((onInvalidate) => {
    // init debounce
    debouncedRef.value = debounce((callback: any) => {
      callback();
    }, debounceWait);
    // todo options

    fetchInstance.context.runAsync = (...args) => {
      return new Promise((resolve, reject) => {
        debouncedRef.value?.(() => {
          originRunRef
            .value(...args)
            .then(resolve)
            .catch(reject);
        });
      });
    };

    onInvalidate(() => {
      debouncedRef.value?.cancel();
      fetchInstance.context.runAsync = originRunRef.value;
    });
  });

  return {
    onCancel() {
      debouncedRef.value?.cancel();
    },
  };
};
