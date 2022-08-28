import { reactive } from 'vue';
import type {
  Service,
  BaseOptions,
  ResultPagination,
  PropPaginationPlus,
  TablePageVal,
} from '../useRequest';
import { merge } from '../utils/lodash';
import { useRequest } from '../useRequest';
import { unRefParams } from '../useRequest/src/useSingleQuery';

/**
 * usePagination
 * @description 通用分页、集成 useRequest
 */
export function usePagination<TQuery, TParams extends unknown[]>(
  service: Service<TQuery, TParams>
): ResultPagination<TQuery, TParams>;
export function usePagination<TQuery, TParams extends unknown[]>(
  service: Service<TQuery, TParams>,
  options: BaseOptions<TQuery, TParams>
): ResultPagination<TQuery, TParams>;
export function usePagination<TQuery, TParams extends unknown[]>(
  service: Service<TQuery, TParams>,
  options?: BaseOptions<TQuery, TParams>
) {
  const getMergePaginationParams = (pagination: any) => {
    const otherRes = unRefParams(...cacheParams);
    const [, ...restParams] = params.value as TParams[];
    // todo 扩张参数必须具有元组类型或传递给 rest 参数。ts(2556)
    // @ts-ignore
    const updateParams = merge(...otherRes, pagination);
    const mergePrams = [updateParams, ...restParams] as TParams;

    return mergePrams;
  };
  const updatePage = (page: number) => {
    bindPagination.page = page;

    const upParams = getMergePaginationParams({
      page,
    });
    run(...upParams);
  };
  const updatePageSize = (pageSize: number) => {
    bindPagination.limit = bindPagination.pageSize = pageSize;

    const upParams = getMergePaginationParams({
      pageSize,
      limit: pageSize,
    });
    run(...upParams);
  };
  /** 收到分页切换回调，重新合并参数并发起请求 */
  const updatePagination = (pageInfo: TablePageVal) => {
    // 同步 limit
    pageInfo.limit = pageInfo.pageSize;
    bindPagination.page = pageInfo.page;
    bindPagination.limit = bindPagination.pageSize = pageInfo.pageSize;

    const upParams = getMergePaginationParams(pageInfo);
    run(...upParams);
  };

  // *Init pagination
  const bindPagination: PropPaginationPlus = reactive({
    page: 1,
    pageSize: 10,
    limit: 10,
    total: 0,
    updatePage,
    updatePageSize,
    updatePagination,
  });

  /** 分页请求完成 更新 total */
  const successPagination = (res: any) => {
    // 基于我们接口的分页结构
    const { info = {} } = res;
    const { page = {}, result = [] } = info;
    const { totalCount = result.length } = page;
    bindPagination.total = totalCount;
  };

  const { ...restOptions } = options ?? {};
  // 保留原始的 defaultParams，主要是为了再次拿到里面可能存在的 响应式属性
  const cacheParams = (restOptions.defaultParams ?? []) as TParams;

  // *Merge options
  const finallyOptions = merge(
    {
      // 补充分页参数
      defaultParams: [
        {
          page: 1,
          limit: 10,
        },
      ],
      onSuccess: successPagination,
    },
    restOptions
  );
  console.log('🏄 #### usePagination #### finallyOptions', finallyOptions);

  // usePagination 不支持 queries - queryKey 的使用
  const { run, params, queries, ...rest } = useRequest(service, finallyOptions);

  return {
    run,
    params,
    pagination: bindPagination,
    ...rest,
  };
}
