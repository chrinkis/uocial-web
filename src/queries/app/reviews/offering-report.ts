import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  fetchOfferingReports,
  fetchMyOfferingReports,
  reportOffering,
  resolveOfferingReport,
  suggestOffering,
} from "@/api/app/reviews/offering-report";
import { invalidateModerationCounts } from "@/queries/app/moderation-counts";
import type { ReportFilter } from "@/models/app/reviews/ReportFilter";
import type { DepartmentReportPayload } from "@/api/app/reviews/department-report";

export const OFFERING_REPORT_QUERY_KEYS = {
  all: () => ["offering-reports"] as const,
  list: (filter: ReportFilter) =>
    ["offering-reports", "moderation", filter] as const,
  mine: () => ["offering-reports", "mine"] as const,
};

export function useMyOfferingReports() {
  return useInfiniteQuery({
    queryKey: OFFERING_REPORT_QUERY_KEYS.mine(),
    queryFn: ({ pageParam }) => fetchMyOfferingReports(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastResponse) => {
      if (lastResponse.meta.current_page < lastResponse.meta.last_page) {
        return lastResponse.meta.current_page + 1;
      }

      return undefined;
    },
  });
}

export interface CreateOfferingReportArgs {
  departmentId: number | string;
  courseId: number | string;
  /** Leave empty to suggest a new (missing) offering. */
  offeringId?: number | string;
  payload: DepartmentReportPayload;
}

export function useCreateOfferingReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      departmentId,
      courseId,
      offeringId,
      payload,
    }: CreateOfferingReportArgs) =>
      offeringId === undefined
        ? suggestOffering(departmentId, courseId, payload)
        : reportOffering(departmentId, courseId, offeringId, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: OFFERING_REPORT_QUERY_KEYS.mine(),
      });
    },
  });
}

export function useOfferingReports(filter: ReportFilter) {
  return useInfiniteQuery({
    queryKey: OFFERING_REPORT_QUERY_KEYS.list(filter),
    queryFn: ({ pageParam }) => fetchOfferingReports(pageParam, filter),
    initialPageParam: 1,
    getNextPageParam: (lastResponse) => {
      if (lastResponse.meta.current_page < lastResponse.meta.last_page) {
        return lastResponse.meta.current_page + 1;
      }

      return undefined;
    },
  });
}

export function useResolveOfferingReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      reportId,
      comment,
    }: {
      reportId: number | string;
      comment?: string;
    }) => resolveOfferingReport(reportId, comment),
    onSuccess: async () => {
      // Both the moderation lists and the "My Reports" ones show the status.
      await queryClient.invalidateQueries({
        queryKey: OFFERING_REPORT_QUERY_KEYS.all(),
      });
      invalidateModerationCounts(queryClient);
    },
  });
}
