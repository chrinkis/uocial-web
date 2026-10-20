import axios from "axios";
import type { PaginatedResponse } from "@/utils/response";
import type { Department } from "@/models/app/reviews/Department";

export async function fetchDepartments(page: number | string) {
  const { data } = await axios.get<PaginatedResponse<Department>>(
    `/api/app/departments?page=${String(page)}`,
  );

  return data;
}

export async function fetchDepartment(departmentId: number | string) {
  const { data } = await axios.get<{ data: Department }>(
    `/api/app/departments/${String(departmentId)}`,
  );

  return data.data;
}
