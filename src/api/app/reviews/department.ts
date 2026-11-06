import axios from "axios";
import type { PaginatedResponse, ResourceResponse } from "@/utils/response";
import type { Department } from "@/models/app/reviews/Department";

export async function fetchDepartments(
  page: number | string,
  instructorIds: number[] = [],
) {
  const { data } = await axios.get<PaginatedResponse<Department>>(
    "/api/app/departments",
    {
      params: {
        page,
        instructors: instructorIds.length > 0 ? instructorIds : undefined,
      },
    },
  );

  return data;
}

export async function fetchDepartment(departmentId: number | string) {
  const { data } = await axios.get<ResourceResponse<Department>>(
    `/api/app/departments/${String(departmentId)}`,
  );

  return data.data;
}
