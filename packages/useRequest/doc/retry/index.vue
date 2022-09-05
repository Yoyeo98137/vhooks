<script setup lang="ts">
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import { useRequest } from '@/packages';

function editUsername(username: string) {
  console.log('🏄 # editUsername # username', username);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error('Failed to modify username'));
    }, 1000);
  });
}

// ---------------------- 错误重试
const state = ref('');
const { loading, run } = useRequest(editUsername, {
  retryCount: 3,
  // 不设置 `retryInterval` 的情况下，控制错误重试的定时器采取的 delay 是线性增长的计算模式
  retryInterval: 600,
  manual: true,
  onError: (error) => {
    ElMessage({
      message: error.message,
      type: 'error',
    });
  },
});
</script>

<template>
  <ElCard shadow="never">
    <div class="mb12">错误重试</div>
    <ElCard>
      <ElRow>
        <ElCol :span="6">
          <el-input v-model="state" placeholder="Please input" />
        </ElCol>
        <ElCol :span="2" style="margin-left: 16px">
          <ElButton :disabled="loading" @click="run(state)">
            {{ loading ? 'Loading...' : 'Edit' }}
          </ElButton>
        </ElCol>
      </ElRow>
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
