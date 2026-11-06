import {
  keepPreviousData,
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query";
import {
  fetchDepartment,
  fetchDepartments,
} from "@/api/app/reviews/department";

export const DEPARTMENT_QUERY_KEYS = {
  list: (instructorIds: number[] = [], search = "") =>
    ["departments", { instructors: instructorIds, search }] as const,
  detail: (departmentId: number | string, instructorIds: number[] = []) =>
    [
      "departments",
      String(departmentId),
      { instructors: instructorIds },
    ] as const,
};

export function useDepartments(instructorIds: number[] = [], search = "") {
  return useInfiniteQuery({
    queryKey: DEPARTMENT_QUERY_KEYS.list(instructorIds, search),
    queryFn: ({ pageParam }) =>
      fetchDepartments(pageParam, instructorIds, search),
    initialPageParam: 1,
    getNextPageParam: (lastResponse) => {
      if (lastResponse.meta.current_page < lastResponse.meta.last_page) {
        return lastResponse.meta.current_page + 1;
      }

      return undefined;
    },
  });
}

export function useDepartment(
  departmentId: number | string,
  instructorIds: number[] = [],
) {
  return useQuery({
    queryKey: DEPARTMENT_QUERY_KEYS.detail(departmentId, instructorIds),
    queryFn: () => fetchDepartment(departmentId, instructorIds),
    placeholderData: keepPreviousData,
  });
}
