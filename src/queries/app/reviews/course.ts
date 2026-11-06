import {
  keepPreviousData,
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query";
import { fetchCourse, fetchCourses } from "@/api/app/reviews/course";

export const COURSE_QUERY_KEYS = {
  list: (departmentId: number | string, instructorIds: number[] = []) =>
    [
      "departments",
      String(departmentId),
      "courses",
      { instructors: instructorIds },
    ] as const,
  detail: (
    departmentId: number | string,
    courseId: number | string,
    instructorIds: number[] = [],
  ) =>
    [
      "departments",
      String(departmentId),
      "courses",
      String(courseId),
      { instructors: instructorIds },
    ] as const,
};

export function useCourses(
  departmentId: number | string,
  instructorIds: number[] = [],
) {
  return useInfiniteQuery({
    queryKey: COURSE_QUERY_KEYS.list(departmentId, instructorIds),
    queryFn: ({ pageParam }) =>
      fetchCourses(departmentId, pageParam, instructorIds),
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
  instructorIds: number[] = [],
) {
  return useQuery({
    queryKey: COURSE_QUERY_KEYS.detail(departmentId, courseId, instructorIds),
    queryFn: () => fetchCourse(departmentId, courseId, instructorIds),
    placeholderData: keepPreviousData,
  });
}
