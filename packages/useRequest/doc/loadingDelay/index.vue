<script setup lang="ts">
import { useRequest } from '@/packages';
import Mock from 'mockjs';

function getUsername(): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(Mock.mock('@name'));
    }, 200);
    // }, 660);
  });
}

// ---------------------- Loading Delay
const { data, loading, run } = useRequest(getUsername, {
  // manual: true
});
// !直接调用的写法，会失去 Vue 的响应式
const {
  data: delayData,
  loading: delayLoading,
  run: delayRun,
} = useRequest(getUsername, {
  // manual: true,
  loadingDelay: 300,
});
const trigger = () => {
  run();
  delayRun();
};
</script>

<template>
  <ElCard shadow="never">
    <div class="mb12">Loading Delay</div>
    <ElCard>
      <el-button @click="trigger">run</el-button>
      <div style="margin: 24px 0">
        Username: {{ loading ? 'Loading...' : data }}
      </div>
      <div>
        Username:
        {{ delayLoading ? 'Loading...' : delayData }}
      </div>
    </ElCard>
  </ElCard>
</template>

<style scoped>
.el-card + .el-card {
  margin-top: 28px;
}
.mb12 {
  margin-bottom: 12px;
}
</style>
