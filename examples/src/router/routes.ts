import Home from '../Home.vue';
import Basic from '@/packages/useRequest/doc/basic/index.vue';
import LoadingDelay from '@/packages/useRequest/doc/loadingDelay/index.vue';
import Ready from '@/packages/useRequest/doc/ready/index.vue';
import RefreshDeps from '@/packages/useRequest/doc/refreshDeps/index.vue';
import Debounce from '@/packages/useRequest/doc/debounce/index.vue';

export const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/useRequest/basic', name: 'requestBasic', component: Basic },
  { path: '/useRequest/loadingDelay', name: 'requestLoadingDelay', component: LoadingDelay },
  { path: '/useRequest/ready', name: 'useRequestReady', component: Ready },
  { path: '/useRequest/refreshDeps', name: 'useRequestRefreshDeps', component: RefreshDeps },
  { path: '/useRequest/debounce', name: 'useRequestDebounce', component: Debounce },
];
