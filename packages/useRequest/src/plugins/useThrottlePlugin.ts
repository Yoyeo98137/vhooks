import { ref, watchEffect } from 'vue';
import { throttle } from 'lodash';
import type { DebouncedFunc } from 'lodash';
import type { PluginUnRefs } from '../types';

// 组装的思路，等同于防抖场景
export const useThrottlePlugin: PluginUnRefs<any, any[]> = (
  fetchInstance,
  { throttleWait }
) => {
  if (!throttleWait) return {};

  const throttledRef = ref<DebouncedFunc<any>>();
  const originRunRef = ref(fetchInstance.context.runAsync);

  watchEffect((onInvalidate) => {
    throttledRef.value = throttle((callback: any) => {
      callback();
    }, throttleWait);
    // todo options

    fetchInstance.context.runAsync = (...args) => {
      return new Promise((resolve, reject) => {
        throttledRef.value?.(() => {
          originRunRef
            .value(...args)
            .then(resolve)
            .catch(reject);
        });
      });
    };

    onInvalidate(() => {
      throttledRef.value?.cancel();
      fetchInstance.context.runAsync = originRunRef.value;
    });
  });

  return {
    onCancel() {
      throttledRef.value?.cancel();
    },
  };
};
