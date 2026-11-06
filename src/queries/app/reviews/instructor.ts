import { useInfiniteQuery, useQueries, useQuery } from "@tanstack/react-query";
import {
  fetchCourseInstructors,
  fetchDepartmentInstructors,
  fetchInstructor,
  fetchInstructors,
} from "@/api/app/reviews/instructor";

/**
 * Limits which instructors are offered: the ones teaching in the course, in
 * the department, or (when empty) anywhere.
 */
export interface InstructorScope {
  departmentId?: number | string;
  courseId?: number | string;
}

export const INSTRUCTOR_QUERY_KEYS = {
  search: (scope: InstructorScope, search: string) =>
    ["instructors", "search", scope, search] as const,
  detail: (instructorId: number | string) =>
    ["instructors", String(instructorId)] as const,
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

export function useInstructor(instructorId: number | string) {
  return useQuery({
    queryKey: INSTRUCTOR_QUERY_KEYS.detail(instructorId),
    queryFn: () => fetchInstructor(instructorId),
  });
}

export function useInstructors(search = "", scope: InstructorScope = {}) {
  const { departmentId, courseId } = scope;

  return useInfiniteQuery({
    queryKey: INSTRUCTOR_QUERY_KEYS.search({ departmentId, courseId }, search),
    queryFn: ({ pageParam }) => {
      if (departmentId !== undefined && courseId !== undefined) {
        return fetchCourseInstructors(
          departmentId,
          courseId,
          pageParam,
          search,
        );
      }

      if (departmentId !== undefined) {
        return fetchDepartmentInstructors(departmentId, pageParam, search);
      }

      return fetchInstructors(pageParam, search);
    },
    initialPageParam: 1,
    getNextPageParam: (lastResponse) => {
      if (lastResponse.meta.current_page < lastResponse.meta.last_page) {
        return lastResponse.meta.current_page + 1;
      }

      return undefined;
    },
  });
}

export function useInstructorsByIds(instructorIds: number[]) {
  return useQueries({
    queries: instructorIds.map((instructorId) => ({
      queryKey: INSTRUCTOR_QUERY_KEYS.detail(instructorId),
      queryFn: () => fetchInstructor(instructorId),
    })),
  });
}
