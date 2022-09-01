import { createApp } from 'vue';
import './style.css';

// 完整引入 ElementPlus
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';

import router from './src/router';
import App from './App.vue';

const app = createApp(App);

app.use(ElementPlus).use(router).mount('#app');
