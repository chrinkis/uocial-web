import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  fetchMyOfferingReports,
  reportOffering,
  suggestOffering,
} from "@/api/app/reviews/offering-report";
import type { DepartmentReportPayload } from "@/api/app/reviews/department-report";

export const OFFERING_REPORT_QUERY_KEYS = {
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
