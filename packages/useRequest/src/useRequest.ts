import { ref, Ref, reactive, computed, watch } from 'vue';
import type {
  Service,
  Queries,
  BaseOptions,
  Config,
  BaseResult,
  UnWrapState,
} from './types';
import { QUERY_DEFAULT_KEY, resolvedPromise } from './tool';
import { useSingleQuery } from './useSingleQuery';

/**
 * todoList
 * - [x] 自动请求、手动请求
 * - [x] 携带参数手动发起请求 run
 * - [x] 携带默认参数重新请求 refresh
 * - [x] 延迟 loadingDelay
 * - [x] 依赖刷新 refreshDeps
 * - [x] 并发请求控制
 * - [x] 请求等待依赖 ready
 *       所谓等待，应该是期望在请求发起之前，先暂停一会，等待某个执行完毕 即返回 true
 *       两个场景：
 *       - 当 manual=false 自动请求模式时，每次 ready 从 false 变为 true 时，都会自动发起请求，会带上参数 options.defaultParams。
 *       - 当 manual=true 手动请求模式时，只要 ready=false，则通过 run/runAsync 触发的请求都不会执行。
 *       - 参考 @ses: https://ahooks.gitee.io/zh-CN/hooks/use-request/ready
 * - [x] 维护响应式参数 params
 * - [x] 节流
 * - [x] 防抖
 * - [x] usePagination 迁移
 * - [x] useTable 迁移
 * - [ ] 文档补充
 */

export function useRequest<TQuery, TParams extends unknown[]>(
  service: Service<TQuery, TParams>
): BaseResult<TQuery, TParams>;
export function useRequest<TQuery, TParams extends unknown[]>(
  service: Service<TQuery, TParams>,
  options: BaseOptions<TQuery, TParams>
): BaseResult<TQuery, TParams>;
export function useRequest<TQuery, TParams extends unknown[]>(
  service: Service<TQuery, TParams>,
  options?: BaseOptions<TQuery, TParams>
) {
  // init Refs.
  const loading = ref(false);
  const data = ref<TQuery>();
  const error = ref<Error>();
  const params = ref() as Ref<TParams>;
  // const params: Ref<TParams | undefined>
  // const params = ref<TParams>()

  // init Options.
  const {
    manual = false,
    // 类型 "never[]" 到类型 "TParams" 的转换可能是错误的，因为两种类型不能充分重叠。
    // 如果这是有意的，请先将表达式转换为 "unknown"。
    // defaultParams = [] as TParams,
    defaultParams = [] as unknown as TParams,
    loadingDelay = 0,
    refreshDeps = [],

    ready = ref(true),

    queryKey,
    ...rest
  } = options ?? {};

  // 用于判断是否为自动请求
  // skip debounce when initail run
  const isAutoRunFlag = ref(false);

  const config = {
    isAutoRunFlag,
    loadingDelay,
    queryKey,
    ...rest,
  } as Config<TQuery, TParams>;

  // 管理当前的请求
  // 解包？
  const queries = reactive<Queries<TQuery, TParams>>({
    [QUERY_DEFAULT_KEY]: reactive(useSingleQuery(service, config)),
    // [QUERY_DEFAULT_KEY]: useSingleQuery(service, config),
  });
  // 为什么需要响应式的变量？因为需要依赖计算属性去更新状态。
  const latestQueryKey = ref(QUERY_DEFAULT_KEY);
  const latestQuery = computed(() => queries[latestQueryKey.value] ?? {});

  // sync Status.
  watch(
    latestQuery,
    (queryData) => {
      // console.log("🏄 #### queryData", queryData)

      loading.value = queryData?.loading;
      data.value = queryData?.data as TQuery;
      error.value = queryData?.error;
      params.value = queryData?.params as TParams;
    },
    {
      deep: true,
      immediate: true,
    }
  );

  /** 记录等待依赖参数 */
  const tempReadyParams = ref() as Ref<TParams>;

  const run = (...args: TParams) => {
    // wait ready state.
    if (!ready.value) {
      tempReadyParams.value = args;
      return resolvedPromise;
    }

    // set Key.
    const newQueryKey = queryKey?.(...args) ?? QUERY_DEFAULT_KEY;
    if (!queries[newQueryKey]) {
      // 这里推入到 queries 时少了外层的 reactive
      // 但是初始化 QUERY_DEFAULT_KEY 时就有，可能就是这层结构导致了 TS 语法问题
      // todo
      /** @ts-ignore */
      queries[newQueryKey] = <UnWrapState<TQuery, TParams>>(
        reactive(useSingleQuery(service, config))
      );
    }
    // Update: latestQueryKey > latestQuery > latestQuery.value.run
    // 否则更新的一直是 queries["QUERY_DEFAULT_KEY"] 对象里面的状态值，而不是某个 queryKey() 识别的状态值
    latestQueryKey.value = newQueryKey;

    // 想象成 queries[xxx].run 就好理解了
    return latestQuery.value.run(...args);
  };

  const refresh = () => latestQuery.value.refresh();

  // init Run.
  // no Mounted，like Created.
  if (!manual) {
    isAutoRunFlag.value = true;
    run(...defaultParams);
    isAutoRunFlag.value = false;
  }

  // 监听等待依赖变化，然后重新发起请求
  watch(ready, (val) => {
    if (val && tempReadyParams.value) {
      latestQuery.value.run(...tempReadyParams.value);
    }
  });
  // @see: https://v3.cn.vuejs.org/api/instance-methods.html#watch
  // @see: https://github.com/AttoJS/vue-request/blob/0df0977c74c83301ad092554642dccb07420f011/src/core/useAsyncQuery.ts#L219
  // 有一个关于 watch 的配置应用 flush: 'sync'
  // vue 的文档是这么介绍的：“这将强制效果始终同步触发。然而，这是低效的，应该很少需要。”
  // 猜测大概是防止异步的 ready 变化导致逻辑错误的处理，在后面补充 asyncRun 的时候再调试

  // 依赖刷新，相当于基于 watch 监听响应式对象的语法糖
  if (refreshDeps.length) {
    watch(refreshDeps, () => {
      !manual && refresh();
    });
  }

  // onUnmounted(() => {
  //   unmountQueries();
  // });

  return {
    loading,
    data,
    error,
    params,
    // todo
    /** @ts-ignore */
    queries,
    run,
    refresh,
  };
}
