<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();
const jumpPage = (name: string) => {
  router.push({
    name,
  });
};
</script>

<template>
  <ElCard shadow="never">
    <div style="margin-bottom: 12px">Welcome to vhooks!</div>

    <ElButton @click="jumpPage('requestBasic')">基础用法</ElButton>
    <ElButton @click="jumpPage('requestLoadingDelay')">Loading Delay</ElButton>
    <ElButton @click="jumpPage('useRequestReady')">Ready</ElButton>
    <ElButton @click="jumpPage('useRequestRefreshDeps')">依赖刷新</ElButton>
    <ElButton @click="jumpPage('useRequestDebounce')">防抖</ElButton>
  </ElCard>
</template>

<style scoped></style>
