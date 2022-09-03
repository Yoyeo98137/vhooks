<script setup lang="ts">
import { ref } from 'vue';
import { useRequest } from '@/packages';

const userSchool = (id: string) => {
  switch (id) {
    case '1':
      return 'Tsinghua University';
    case '2':
      return 'Beijing University';
    case '3':
      return 'Zhejiang University';
    default:
      return '';
  }
};

async function getUserSchool(userId: string): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(userSchool(userId));
    }, 1000);
  });
}

const options = [
  {
    value: '1',
    label: 'user 1',
  },
  {
    value: '2',
    label: 'user 2',
  },
  {
    value: '3',
    label: 'user 3',
  },
];

// ---------------------- RefreshDeps
const userId = ref('1');
const { data, loading } = useRequest(() => getUserSchool(userId.value), {
  refreshDeps: [userId],
});
</script>

<template>
  <ElCard shadow="never">
    <div class="mb12">依赖刷新</div>

    <ElCard>
      <el-select v-model="userId" placeholder="Select">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <p>School: {{ loading ? 'Loading' : data }}</p>
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
