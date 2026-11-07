import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  fetchMyCourseReports,
  reportCourse,
  suggestCourse,
} from "@/api/app/reviews/course-report";
import type { DepartmentReportPayload } from "@/api/app/reviews/department-report";

export const COURSE_REPORT_QUERY_KEYS = {
  mine: () => ["course-reports", "mine"] as const,
};

export function useMyCourseReports() {
  return useInfiniteQuery({
    queryKey: COURSE_REPORT_QUERY_KEYS.mine(),
    queryFn: ({ pageParam }) => fetchMyCourseReports(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastResponse) => {
      if (lastResponse.meta.current_page < lastResponse.meta.last_page) {
        return lastResponse.meta.current_page + 1;
      }

      return undefined;
    },
  });
}

export interface CreateCourseReportArgs {
  departmentId: number | string;
  /** Leave empty to suggest a new (missing) course. */
  courseId?: number | string;
  payload: DepartmentReportPayload;
}

export function useCreateCourseReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      departmentId,
      courseId,
      payload,
    }: CreateCourseReportArgs) =>
      courseId === undefined
        ? suggestCourse(departmentId, payload)
        : reportCourse(departmentId, courseId, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: COURSE_REPORT_QUERY_KEYS.mine(),
      });
    },
  });
}
