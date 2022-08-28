
export interface ClosureReturns<
  // 函数参数体
  Args extends any[],
  // 接收执行的 回调函数 F，然后继承于任意返回值的 箭头函数，并记录录入的参数类型 Args
  F extends (...args: Args) => any
  > {
  // 定义 this 类型，并读取录入的参数类型，
  // 最后输出的 void，表示的是抛出去的 闭包函数的返回值（没有返回值）
  (this: ThisParameterType<F>, ...args: Args & Parameters<F>): void;

  // 使用预定义的 Parameters 可以获取到一个函数的参数类型列表
  // 它主要是通过 infer P 获取到 T 的参数类型列表 P 并返回，如果 T 不是函数则返回 never
  // PS:
  // type Parameters<T extends (...args: any) => any> =
  //   T extends (...args: infer P) => any
  //     ? P
  //     : never

  // PS:
  // type ThisParameterType<T> =
  //   T extends (this: unknown, ...args: any[]) => any
  //     T extends (this: infer U, ...args: any[]) => any
  //     ? U
  //     : unknown

  // TS infer: 表示在 extends 条件语句中待推断的类型变量
  // @see: https://jkchao.github.io/typescript-book-chinese/tips/infer.html
}
