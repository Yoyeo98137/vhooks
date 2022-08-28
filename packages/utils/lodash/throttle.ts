import { ClosureReturns } from "./types";

/**
 * 函数节流：在 n 秒内只运行一次，若在 n 秒内重复触发，只有一次生效
 * 使用场景：比如输入框触发关键词补全请求事件
 *
 * ?节流存在的问题：
 * 如果用户的最后一次触发操作，
 * 距离上一次触发操作的时长，不能达到 wait 时长的话，此时用户的状态应该是结束操作触发了
 * 但是此时并没办法触发回调函数的执行，所以存在一个优化点，也就是 兜底逻辑（其实就是补上 防抖 的逻辑）
 *
 * 本质上都是对高频率执行代码的优化手段
 */
function throttle<Args extends any[], F extends (...args: Args) => any>(
  fn: F,
  wait = 600
): ClosureReturns<Args, F> {
  // step
  // 有两种实现方案：时间戳 或者 定时器
  // 时间戳：通过时间戳来判断是否已经到了应该执行回调的时间
  // 记录上一次执行的时间戳，然后每次触发执行回调时，判断当前时间戳距离上一次的间隔是否达到了时间差
  // 如果达到了就执行回调，并且更新上一次执行的时间戳，如此循环
  // 定时器：每次触发回调时，如果已经存在定时器，则不执行回调
  // 直到定时器触发被清理后，再重新设置定时器

  // 记录上一次执行事件，默认 0
  let previous = 0;

  return function (...args) {
    // 获取当前时间，转换为时间戳
    const now = +new Date();

    // 对比执行时间差
    if (now - previous > wait) {
      // 更新上一次执行的时间戳，提供给下一次判断
      previous = now;
      fn.apply(this, args);
    }
  };
}

export default throttle
