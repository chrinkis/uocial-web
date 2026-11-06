import axios from "axios";
import type { PaginatedResponse, ResourceResponse } from "@/utils/response";
import type { Department } from "@/models/app/reviews/Department";

export async function fetchDepartments(
  page: number | string,
  instructorIds: number[] = [],
  search?: string,
) {
  const { data } = await axios.get<PaginatedResponse<Department>>(
    "/api/app/departments",
    {
      params: {
        page,
        search: search === "" ? undefined : search,
        instructors: instructorIds.length > 0 ? instructorIds : undefined,
      },
    },
  );

  return data;
}

export async function fetchDepartment(
  departmentId: number | string,
  instructorIds: number[] = [],
) {
  const { data } = await axios.get<ResourceResponse<Department>>(
    `/api/app/departments/${String(departmentId)}`,
    {
      params: {
        instructors: instructorIds.length > 0 ? instructorIds : undefined,
      },
    },
  );

  return data.data;
}
