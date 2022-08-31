export const useLoadingDelayPlugin = () => {
  return {
    onSuccess: () => {
      console.log('🏄 ---- useLoadingDelayPlugin ---- onSuccess');
    },
  };
};
