<script setup lang="ts">
import { ref } from 'vue';
import { useRequest } from '@/packages';
import Mock from 'mockjs';

async function getEmail(search?: string): Promise<string[]> {
  console.log('debounce getEmail', search);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(Mock.mock({ 'data|5': ['@email'] }).data);
    }, 300);
  });
}

// ---------------------- 防抖
const value = ref('');
const { data, loading, run } = useRequest(getEmail, {
  debounceWait: 300,
  // debounceWait: 1000,
  manual: true,
});
</script>

<template>
  <ElCard shadow="never">
    <div class="mb12">防抖</div>
    <ElCard>
      <ElRow>
        <ElCol :span="6">
          <el-input
            v-model="value"
            placeholder="Please input"
            @input="run(value)"
          />
        </ElCol>
      </ElRow>

      <p v-if="loading">loading...</p>
      <ul v-else v-for="(item, index) in data || []">
        <li :key="index">{{ item }}</li>
      </ul>
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
