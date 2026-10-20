import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import {
  fetchDepartment,
  fetchDepartments,
} from "@/api/app/reviews/department";

export const DEPARTMENT_QUERY_KEYS = {
  list: ["departments"] as const,
  detail: (departmentId: number | string) =>
    ["departments", String(departmentId)] as const,
};

export function useDepartments() {
  return useInfiniteQuery({
    queryKey: DEPARTMENT_QUERY_KEYS.list,
    queryFn: ({ pageParam }) => fetchDepartments(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastResponse) => {
      if (lastResponse.meta.current_page < lastResponse.meta.last_page) {
        return lastResponse.meta.current_page + 1;
      }

      return undefined;
    },
  });
}

export function useDepartment(departmentId: number | string) {
  return useQuery({
    queryKey: DEPARTMENT_QUERY_KEYS.detail(departmentId),
    queryFn: () => fetchDepartment(departmentId),
  });
}
