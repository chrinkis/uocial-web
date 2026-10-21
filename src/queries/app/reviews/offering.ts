import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import {
  fetchCourseOffering,
  fetchCourseOfferings,
} from "@/api/app/reviews/offering";

export const OFFERING_QUERY_KEYS = {
  list: (departmentId: number | string, courseId: number | string) =>
    [
      "departments",
      String(departmentId),
      "courses",
      String(courseId),
      "offerings",
    ] as const,
  detail: (
    departmentId: number | string,
    courseId: number | string,
    offeringId: number | string,
  ) =>
    [
      "departments",
      String(departmentId),
      "courses",
      String(courseId),
      "offerings",
      String(offeringId),
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

export function useCourseOffering(
  departmentId: number | string,
  courseId: number | string,
  offeringId: number | string,
) {
  return useQuery({
    queryKey: OFFERING_QUERY_KEYS.detail(departmentId, courseId, offeringId),
    queryFn: () => fetchCourseOffering(departmentId, courseId, offeringId),
  });
}
