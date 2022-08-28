import type { Ref, WatchSource } from 'vue';

// extends unknown[] -> 因为要给 ...args 定义数组类型（类数组）
export type Service<Q, P extends unknown[]> = (...args: P) => Promise<Q>;

export type BaseOptions<Q, P extends unknown[]> = {
  /** 手动请求开关 */
  manual?: boolean;
  /** 接收发起自动请求时需要携带的参数 */
  defaultParams?: P;
  /** 通过设置延迟的毫秒数，可以延迟 loading 变成 true 的时间，有效防止闪烁。 */
  loadingDelay?: number;
  /** 请求等待依赖，当其值为 false 时，请求永远都不会发出 */
  ready?: Ref<boolean>;

  /** 依赖刷新数组 */
  refreshDeps?: WatchSource<any>[];

  debounceInterval?: number;
  throttleInterval?: number;

  /**
   * 根据 params 去指定当前请求的唯一标识，设置唯一标识之后，
   * 可以用过 queries 来维护不同请求下的响应状态
   */
  queryKey?: (...args: P) => string;

  // Hooks.
  onSuccess?: (data: Q, params: P) => void;
  onError?: (error: Error, params: P) => void;
  onBefore?: (params: P) => void;
  onAfter?: (params: P) => void;
};

export type Config<R, P extends unknown[]> = Omit<
  BaseOptions<R, P>,
  'manual' | 'defaultParams' | 'queryKey'
> & {
  isAutoRunFlag: Ref<boolean>;
};

export interface QueryVar<R, P> {
  loading: Ref<boolean>;
  // todo undefined/unknown
  data: Ref<R | undefined>;
  error: Ref<Error | undefined>;
  params: Ref<P>;
}
export interface QueryStatus<R, P extends unknown[]> extends QueryVar<R, P> {
  /** 携带参数，手动触发请求 */
  run: (...arg: P) => Promise<R | null>;
  /** 使用当前保留的 params 重新发起请求，前提是至少已经保存了一次参数，比如 defaultParams */
  refresh: () => Promise<R | null>;
  // cancel: () => void
}

export type UnRef<T> = T extends Ref<infer V> ? V : T;

export type UnWrapRefObject<T> = {
  [K in keyof T]: UnRef<T[K]>;
};

export interface SingleQueryResult<R, P extends unknown[]>
  extends QueryStatus<R, P> {
  // todo 应该用不上
  // 卸载
  unmount?: () => void;
  // unmount: () => void
}

export type UnWrapState<R, P extends unknown[]> = UnWrapRefObject<
  SingleQueryResult<R, P>
>;

export type Queries<R, P extends unknown[]> = {
  [key: string]: UnWrapState<R, P>;
};

export interface BaseResult<R, P extends unknown[]> extends QueryStatus<R, P> {
  /** 提供并发请求的状态管理 */
  queries: Queries<R, P>;
}

// -----------

/**
 * [page | pageSize | total]
 *
 * @interface TablePageVal
 * @description 要保证 total 的输入来渲染分页、初始化为 0
 */
export interface TablePageVal {
  page: number;
  pageSize: number;
  total?: number;

  /** 补充给后台的识别字段 */
  limit?: number;
}
export interface PropPaginationPlus extends TablePageVal {
  updatePage: (page: number) => void;
  updatePageSize: (pageSize: number) => void;
  updatePagination: (pageInfo: TablePageVal) => void;
}
export interface ResultPagination<TData, TParams extends unknown[]>
  extends BaseResult<TData, TParams> {
  pagination: PropPaginationPlus;
}
