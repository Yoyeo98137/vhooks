import { watch } from 'vue';
import type { PluginUnRefs } from '../types';

export const useRefreshDepsPlugin: PluginUnRefs<any, any[]> = (
  fetchInstance,
  { refreshDeps = [], refreshDepsAction, manual }
) => {
  if (!refreshDeps?.length) return {};

  watch(refreshDeps, () => {
    if (refreshDepsAction) {
      refreshDepsAction();
    } else {
      !manual && fetchInstance.refresh();
    }
  });

  return {};
};
