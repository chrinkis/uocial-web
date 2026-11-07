import { invalidateModerationCounts } from "@/queries/app/moderation-counts";
import type { ReportFilter } from "@/models/app/reviews/ReportFilter";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  type DepartmentReportPayload,
  fetchDepartmentReports,
  fetchMyDepartmentReports,
  reportDepartment,
  resolveDepartmentReport,
  suggestDepartment,
} from "@/api/app/reviews/department-report";

export const DEPARTMENT_REPORT_QUERY_KEYS = {
  all: () => ["department-reports"] as const,
  list: (filter: ReportFilter) =>
    ["department-reports", "moderation", filter] as const,
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

export function useDepartmentReports(filter: ReportFilter) {
  return useInfiniteQuery({
    queryKey: DEPARTMENT_REPORT_QUERY_KEYS.list(filter),
    queryFn: ({ pageParam }) => fetchDepartmentReports(pageParam, filter),
    initialPageParam: 1,
    getNextPageParam: (lastResponse) => {
      if (lastResponse.meta.current_page < lastResponse.meta.last_page) {
        return lastResponse.meta.current_page + 1;
      }

      return undefined;
    },
  });
}

export function useResolveDepartmentReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      reportId,
      comment,
    }: {
      reportId: number | string;
      comment?: string;
    }) => resolveDepartmentReport(reportId, comment),
    onSuccess: async () => {
      // Both the moderation lists and the "My Reports" ones show the status.
      await queryClient.invalidateQueries({
        queryKey: DEPARTMENT_REPORT_QUERY_KEYS.all(),
      });
      invalidateModerationCounts(queryClient);
    },
  });
}
