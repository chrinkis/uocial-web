import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchCourseOfferings } from "@/api/app/reviews/offering";

export const OFFERING_QUERY_KEYS = {
  list: (departmentId: number | string, courseId: number | string) =>
    [
      "departments",
      String(departmentId),
      "courses",
      String(courseId),
      "offerings",
    ] as const,
};

export function useCourseOfferings(
  departmentId: number | string,
  courseId: number | string,
) {
  return useInfiniteQuery({
    queryKey: OFFERING_QUERY_KEYS.list(departmentId, courseId),
    queryFn: ({ pageParam }) =>
      fetchCourseOfferings(departmentId, courseId, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastResponse) => {
      if (lastResponse.meta.current_page < lastResponse.meta.last_page) {
        return lastResponse.meta.current_page + 1;
      }

      return undefined;
    },
  });
}
