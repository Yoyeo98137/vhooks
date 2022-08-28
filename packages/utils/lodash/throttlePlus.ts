import { ClosureReturns } from "./types";

/**
 * 加强版节流函数，新增能力：
 * 当前触发时间和上次触发的时间差小于时间间隔时，设立一个新的定时器
 * 也就是把 debounce 代码放在小于时间间隔的逻辑里
 */

function throttlePlus<
  Args extends any[],
  F extends (...args: Args) => any
>(fn: F, wait = 600): ClosureReturns<Args, F> {
  // step
  // 在节流的基础上，补充上防抖能力

  // 记录上一次执行事件，默认 0
  let previous = 0,
    timer: ReturnType<typeof setTimeout> | null = null;

  return function (...args) {
    // 获取当前时间，转换为时间戳
    const now = +new Date();

    // 对比执行时间差
    // 时间戳不足时，做一个兜底
    if (now - previous < wait) {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        previous = now;
        fn.apply(this, args);
      }, wait);

      // 超出时间间隔，执行节流能力
    } else {
      // 更新上一次执行的时间戳，提供给下一次判断
      previous = now;
      fn.apply(this, args);
    }
  };
}

export default throttlePlus
