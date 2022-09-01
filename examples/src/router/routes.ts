import Home from '../Home.vue';
import Basic from '@/packages/useRequest/doc/basic/index.vue';
import LoadingDelay from '@/packages/useRequest/doc/loadingDelay/index.vue';

export const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/useRequest/basic', name: 'requestBasic', component: Basic },
  { path: '/useRequest/loadingDelay', name: 'requestLoadingDelay', component: LoadingDelay },
];
