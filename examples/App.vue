<script setup lang="ts">
import { usePagination, useRequest } from '@/packages';
import { ElMessage } from 'element-plus';
import { reactive } from 'vue';

// ---------------------- 手动触发

const todoHandle = (title: string, subTitle: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        title,
        subTitle,
      });
    }, 1026);
  });
};
const { data, loading, run } = useRequest(todoHandle, {
  manual: true,
});
const handleRun = () => {
  run('runTitle', 'runSubTitle');
};

// ---------------------- 并发控制

const userList = [
  { id: 1, name: 'HuaQiang' },
  { id: 2, name: 'ZhangSan' },
  { id: 3, name: 'MaDongMei' },
];
const handleSRun = (id: number) => {
  sRun(id);
};
const showMessage = (msg: string) => {
  ElMessage({
    message: msg,
    type: 'success',
  });
};
const userStatus = (userId: number) => {
  return new Promise<string>((resolve) => {
    setTimeout(() => {
      const name = userList.find((i) => i.id === userId)?.name;
      resolve(`${name} status update successfully`);
    }, 1000);
  });
};
const { run: sRun, queries: sQueries } = useRequest(userStatus, {
  manual: true,
  queryKey: (id) => String(id),
  onSuccess: (data) => {
    showMessage(data);
  },
});

// ---------------------- 分页测试

const todoPagination = (p2: any) => {
  // console.log('🏄 # todoPagination # p1', p1);
  console.log('🏄 # todoPagination # p2', p2);
  console.log('🏄 # todoPagination # pagination', pagination);

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(p2);
    }, 1026);
  });
};
const testRefVal2 = reactive({
  val2: '',
  msg2: 'this is test msg......',
});
const {
  data: dataPagination,
  loading: loadingPagination,
  pagination,
} = usePagination(todoPagination, {
  manual: true,
  defaultParams: [testRefVal2],
});
</script>

<template>
  <ElMain>
    <ElCard>
      <div>Welcome to vhooks!</div>
    </ElCard>

    <ElCard v-loading="loading" :style="{ marginTop: '10px' }">
      <div>data ---: {{ data || '.................' }}</div>
      <div>loading ---: {{ loading }}</div>
      <ElButton style="margin-top: 10px" type="primary" @click="handleRun"
        >手动发起请求</ElButton
      >
    </ElCard>

    <ElCard :style="{ marginTop: '10px' }">
      <ul>
        <li
          v-for="user in userList"
          :key="user.id"
          style="padding: 4px; width: 50%"
        >
          <div style="display: flex; justify-content: space-between">
            <span>{{ user.name }}</span>
            <ElButton
              :loading="sQueries[user.id] && sQueries[user.id].loading"
              @click="handleSRun(user.id)"
            >
              Update
            </ElButton>
          </div>
        </li>
      </ul>
    </ElCard>

    <ElCard v-loading="loadingPagination" :style="{ marginTop: '10px' }">
      <div>dataPagination: {{ dataPagination || '.............' }}</div>
      <ElInput v-model="testRefVal2.val2" />
      <ElPagination
        v-model:currentPage="pagination.page"
        v-model:pageSize="pagination.pageSize"
        :pageSizes="[10, 20, 30, 40]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="40"
        @sizeChange="pagination.updatePageSize"
        @currentChange="pagination.updatePage"
      />
    </ElCard>
  </ElMain>
</template>

<style scoped></style>
