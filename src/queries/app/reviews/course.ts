import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { fetchCourse, fetchCourses } from "@/api/app/reviews/course";

export const COURSE_QUERY_KEYS = {
  list: (departmentId: number | string) =>
    ["departments", String(departmentId), "courses"] as const,
  detail: (departmentId: number | string, courseId: number | string) =>
    ["departments", String(departmentId), "courses", String(courseId)] as const,
};

export function useCourses(departmentId: number | string) {
  return useInfiniteQuery({
    queryKey: COURSE_QUERY_KEYS.list(departmentId),
    queryFn: ({ pageParam }) => fetchCourses(departmentId, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastResponse) => {
      if (lastResponse.meta.current_page < lastResponse.meta.last_page) {
        return lastResponse.meta.current_page + 1;
      }

      return undefined;
    },
  });
}

export function useCourse(
  departmentId: number | string,
  courseId: number | string,
) {
  return useQuery({
    queryKey: COURSE_QUERY_KEYS.detail(departmentId, courseId),
    queryFn: () => fetchCourse(departmentId, courseId),
  });
}
