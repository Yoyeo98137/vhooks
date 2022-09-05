import { ref } from 'vue';
import type { PluginUnRefs } from '../types';
import type { Timeout } from '@/packages/utils/types';

export const useRetryPlugin: PluginUnRefs<any, any[]> = (
  fetchInstance,
  { retryCount, retryInterval }
) => {
  if (!retryCount) return {};

  const timerRef = ref<Timeout>();
  const count = ref(0);
  const clearRetryTimer = () => {
    timerRef.value && clearTimeout(timerRef.value);
  };

  let triggerByRetry = false;

  return {
    onBefore: () => {
      // 在错误请求 `retry` 的过程中，用户仍有可能继续触发新的请求（比如 `run`）
      // 如果发生了这样的情况，理想的情况则是需要，重新执行我们的错误重试逻辑
      // 所以我们需要一个变量，来判断是 用户的意外触发，亦或是 内部的错误重试所触发，这就是 `triggerByRetry` 的作用

      if (!triggerByRetry) {
        count.value = 0;
      }
      triggerByRetry = false;

      clearRetryTimer();
    },
    onSuccess: () => {
      count.value = 0;
    },
    onError: () => {
      count.value += 1;
      if (retryCount === -1 || count.value <= retryCount) {
        // Exponential backoff
        const timeout =
          retryInterval ?? Math.min(1000 * 2 ** count.value, 30000);
        timerRef.value = setTimeout(() => {
          triggerByRetry = true;
          fetchInstance.context.refresh();
        }, timeout);
      } else {
        count.value = 0;
      }
    },
    onCancel: () => {
      count.value = 0;
      clearRetryTimer();
    },
  };
};
