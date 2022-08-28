import { computed, Ref } from 'vue';
import type { Service, BaseOptions, ResultPagination } from '../useRequest';
import { usePagination } from '../usePagination';
import { isFunction } from '../utils/ifType';

interface OptionsTable<TData, TParams extends unknown[]>
  extends BaseOptions<TData, TParams> {
  /** 允许重新定制表格 */
  reRender?: (ele: any, index: any) => void;
}
interface ResultTable<TData, TParams extends unknown[]>
  extends ResultPagination<TData, TParams> {
  tableData: Ref<any[]>;
}

/**
 * useTable
 * @description 通用表格、集成分页 请求
 */
export function useTable<TQuery, TParams extends unknown[]>(
  service: Service<TQuery, TParams>
): ResultTable<TQuery, TParams>;
export function useTable<TQuery, TParams extends unknown[]>(
  service: Service<TQuery, TParams>,
  options: OptionsTable<TQuery, TParams>
): ResultTable<TQuery, TParams>;
export function useTable<TQuery, TParams extends unknown[]>(
  service: Service<TQuery, TParams>,
  options?: OptionsTable<TQuery, TParams>
) {
  const { reRender } = options ?? {};

  // Update table-list
  const tableData: Ref<any[]> = computed(() => {
    let res: any = [];

    if (data.value) {
      const { info = {} } = data as any;
      const { result = [] } = info;

      // 基于我们接口的分页-表格结构，重新处理数据格式
      if (isFunction(reRender)) {
        res = result.map((ele: any, index: any) => reRender?.(ele, index));
      } else res = result;
    }

    return res;
  });
  const { data, ...rest } = usePagination(service, options ?? {});

  return {
    tableData,
    ...rest,
  };
}
