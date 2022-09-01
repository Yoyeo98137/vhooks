<script setup lang="ts">
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import { useRequest } from '@/packages';
import Mock from 'mockjs';

// ---------------------- 默认用法
function getUsername(): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(Mock.mock('@name'));
    }, 660);
  });
}
const { data, loading } = useRequest(getUsername);

// ---------------------- 手动触发
function changeUsername(username: string): Promise<{ success: boolean }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true });
    }, 1280);
  });
}
const changeName = ref('');
const { loading: mauLoading, run } = useRequest(changeUsername, {
  manual: true,
  onSuccess: (result, params) => {
    if (result.success) {
      changeName.value = '';
      ElMessage({
        message: `The username was changed to "${params[0]}" !`,
        type: 'success',
      });
    }
  },
});
</script>

<template>
  <ElCard shadow="never">
    <div class="mb12">默认用法</div>
    <ElCard v-loading="loading">
      <div>Username: {{ data }}</div>
    </ElCard>
  </ElCard>

  <ElCard shadow="never">
    <div class="mb12">手动触发</div>
    <ElCard>
      <ElRow>
        <ElCol :span="6">
          <el-input v-model="changeName" placeholder="Please enter username" />
        </ElCol>
        <ElCol :span="2" style="margin-left: 16px">
          <el-button :loading="mauLoading" @click="run(changeName)">{{
            mauLoading ? 'Loading...' : 'Edit'
          }}</el-button>
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
