import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  type DepartmentReportPayload,
  fetchMyDepartmentReports,
  reportDepartment,
  suggestDepartment,
} from "@/api/app/reviews/department-report";

export const DEPARTMENT_REPORT_QUERY_KEYS = {
  mine: () => ["department-reports", "mine"] as const,
};

export function useMyDepartmentReports() {
  return useInfiniteQuery({
    queryKey: DEPARTMENT_REPORT_QUERY_KEYS.mine(),
    queryFn: ({ pageParam }) => fetchMyDepartmentReports(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastResponse) => {
      if (lastResponse.meta.current_page < lastResponse.meta.last_page) {
        return lastResponse.meta.current_page + 1;
      }

      return undefined;
    },
  });
}

export interface CreateDepartmentReportArgs {
  /** Leave empty to suggest a new (missing) department. */
  departmentId?: number | string;
  payload: DepartmentReportPayload;
}

export function useCreateDepartmentReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ departmentId, payload }: CreateDepartmentReportArgs) =>
      departmentId === undefined
        ? suggestDepartment(payload)
        : reportDepartment(departmentId, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: DEPARTMENT_REPORT_QUERY_KEYS.mine(),
      });
    },
  });
}
