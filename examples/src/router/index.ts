import { createRouter, createWebHashHistory } from 'vue-router'
import { routes } from './routes'

// 创建路由实例并传递 `routes` 配置
export default createRouter({
  // 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
  history: createWebHashHistory(),
  routes, // `routes: routes` 的缩写
})
