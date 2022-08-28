import { ClosureReturns } from "./types";

/**
 * 函数防抖：等待 n 秒后再执行该事件，若在 n 秒内被重复触发，则重新计时
 * 使用场景：比如输入框触发搜索请求事件
 *
 * ?防抖存在的问题：
 * 如果用户的操作非常频繁，不等设置的延迟时间结束就继续下次操作，
 * 这时候就会出现一个，用户导致的 操作真空期，在这个真空期内，我们的防抖函数回调一直没有被执行
 * 解决方案也很简单，结合 节流 能力做一个 wait 响应时间的兜底处理
 *
 * 本质上都是对高频率执行代码的优化手段
 */
function debounce<Args extends any[], F extends (...args: Args) => any>(
  fn: F,
  delay = 600,
  immediate = false
): ClosureReturns<Args, F> {
  // step
  // 1 第一次执行时设定一个定时器
  // 2 之后再调用时，如果已经设定过定时器了，就清空之前的定时器，并且重新设定新的定时器
  // 3 如果还有在执行的（没被清理的定时器），当这个定时器计时结束后便触发回调函数
  // 4 判断是否需要 第一次调用就直接触发回调函数
  // PS：补全 ts 接收回调函数的参数类型提示

  // 用于提取函数类型的返回值类型
  // ReturnType<T> 由函数类型 T 的返回值类型构造一个类型
  let timer: ReturnType<typeof setTimeout> | null = null;

  return function (this, ...args) {
    if (timer) clearTimeout(timer);
    // immediate 为 true 表示需要第一次触发后立即执行回调
    // timer 为空则表示当前是首次触发
    if (immediate && !timer) {
      fn.apply(this, args);
      // 保证不会重复进到 立即执行 的逻辑分支
      immediate = false;
      // 且不希望出现 第一次只触发一次调用，但是触发两次回调的情况
      // PS：一次是立即执行，还有一次是定时器触发执行
      return;
    }
    timer = setTimeout(() => {
      // 因为这里的 args 是类数组对象，所以用 apply
      fn.apply(this, args);
    }, delay);
  };
}

export default debounce
