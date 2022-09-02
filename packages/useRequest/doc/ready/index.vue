<script setup lang="ts">
import { ref } from 'vue';
import { useRequest } from '@/packages';
import Mock from 'mockjs';

function getUsername(): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(Mock.mock('@name'));
    }, 1000);
  });
}

// ---------------------- Ready auto
const ready = ref(false);
const { data, loading } = useRequest(getUsername, {
  ready,
});
const toggle = () => {
  ready.value = !ready.value;
};

// ---------------------- Ready manual
const readyManual = ref(false);
const {
  data: manualData,
  loading: manualLoading,
  run,
} = useRequest(getUsername, {
  manual: true,
  ready: readyManual,
});
const toggleManual = () => {
  readyManual.value = !readyManual.value;
};
</script>

<template>
  <ElCard shadow="never">
    <div class="mb12">Ready</div>
    <div class="mb12">
      useRequest 提供了一个 options.ready 参数，当其值为 false
      时，请求永远都不会发出。
    </div>
    <div class="mb12">
      <div>
        1. 当 manual=false 自动请求模式时，每次 ready 从 false 变为 true
        时，都会自动发起请求，会带上参数 options.defaultParams。
      </div>
      <div>
        2. 当 manual=true 手动请求模式时，只要 ready=false，则通过 run/runAsync
        触发的请求都不会执行。
      </div>
    </div>

    <ElCard>
      <div class="mb12">自动模式</div>
      <span>Ready: {{ ready }}</span>
      <el-button style="margin-left: 12px" @click="toggle"
        >Toggle Ready</el-button
      >
      <div style="margin: 24px 0">
        Username: {{ loading ? 'Loading...' : data }}
      </div>
    </ElCard>

    <ElCard>
      <div class="mb12">手动模式</div>

      <span>Ready Manual: {{ readyManual }}</span>
      <el-button style="margin-left: 12px" @click="toggleManual"
        >Toggle Ready Manual</el-button
      >

      <div style="margin-top: 12px">
        <span>Username: {{ manualLoading ? 'Loading...' : manualData }}</span>
        <el-button
          style="margin-left: 12px"
          :disabled="!readyManual"
          @click="run"
          >Run</el-button
        >
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
