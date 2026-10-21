import { useInfiniteQuery } from "@tanstack/react-query";
import {
  fetchCourseInstructors,
  fetchDepartmentInstructors,
} from "@/api/app/reviews/instructor";

export const INSTRUCTOR_QUERY_KEYS = {
  list: (departmentId: number | string) =>
    ["departments", String(departmentId), "instructors"] as const,
  courseList: (departmentId: number | string, courseId: number | string) =>
    [
      "departments",
      String(departmentId),
      "courses",
      String(courseId),
      "instructors",
    ] as const,
};

export function useDepartmentInstructors(departmentId: number | string) {
  return useInfiniteQuery({
    queryKey: INSTRUCTOR_QUERY_KEYS.list(departmentId),
    queryFn: ({ pageParam }) =>
      fetchDepartmentInstructors(departmentId, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastResponse) => {
      if (lastResponse.meta.current_page < lastResponse.meta.last_page) {
        return lastResponse.meta.current_page + 1;
      }

      return undefined;
    },
  });
}

export function useCourseInstructors(
  departmentId: number | string,
  courseId: number | string,
) {
  return useInfiniteQuery({
    queryKey: INSTRUCTOR_QUERY_KEYS.courseList(departmentId, courseId),
    queryFn: ({ pageParam }) =>
      fetchCourseInstructors(departmentId, courseId, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastResponse) => {
      if (lastResponse.meta.current_page < lastResponse.meta.last_page) {
        return lastResponse.meta.current_page + 1;
      }

      return undefined;
    },
  });
}
