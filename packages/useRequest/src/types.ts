import type { Ref, WatchSource } from 'vue';

// extends unknown[] -> 因为要给 ...args 定义数组类型（类数组）
export type Service<TData, TParams extends any[]> = (
  ...args: TParams
) => Promise<TData>;

export interface Options<TData, TParams extends any[]> {
  /** 手动请求开关 */
  manual?: boolean;

  onBefore?: (params: TParams) => void;
  onSuccess?: (data: TData, params: TParams) => void;
  onError?: (err: Error, params: TParams) => void;
  onFinally?: (params: TParams, data?: TData, err?: Error) => void;

  /** 接收发起自动请求时需要携带的参数 */
  defaultParams?: TParams;

  /** 依赖刷新数组 */
  refreshDeps?: WatchSource<any>[];

  /** 通过设置延迟的毫秒数，可以延迟 loading 变成 true 的时间，有效防止闪烁。 */
  loadingDelay?: number;

  /** 请求等待依赖，当其值为 false 时，请求永远都不会发出 */
  ready?: Ref<boolean>;

  // debounce
  debounceWait?: number;

  // throttle
  throttleWait?: number;
}

export type State<TData, TParams> = {
  loading: Ref<boolean>;
  params: Ref<TParams>;
  data: Ref<TData | undefined>;
  error: Ref<Error | undefined>;
};

export interface Action<TData, TParams extends unknown[]> {
  // runAsync: (...arg: TParams) => Promise<TData>;
  run: (...arg: TParams) => void;
  // cancel: () => void;
  // refresh: () => void;
  // refreshAsync: () => Promise<TData>;
  // mutate: Mutate<TData>;
}

export type Result<TData, TParams extends unknown[]> = State<TData, TParams> &
  Action<TData, TParams>;

export type Plugin<TData, TParams extends any[]> = {
  (
    queryInstance: Service<TData, TParams>,
    options: Options<TData, TParams>
  ): Partial<PluginReturn<TData, TParams>>;
};

export interface PluginReturn<TData, TParams extends any[]> {
  onSuccess: (data: TData, params: TParams) => void;
  onError: (err: Error, params: TParams) => void;
  onFinally: (params: TParams, data?: TData, err?: Error) => void;
}
