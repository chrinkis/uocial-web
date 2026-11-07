import axios from "axios";
import type { PaginatedResponse, ResourceResponse } from "@/utils/response";
import type {
  DataReportReason,
  DepartmentReport,
} from "@/models/app/reviews/DepartmentReport";

export interface DepartmentReportPayload {
  reason: DataReportReason;
  comment?: string;
  duplicate_of_id?: number;
}

export async function fetchMyDepartmentReports(page: number | string) {
  const { data } = await axios.get<PaginatedResponse<DepartmentReport>>(
    "/api/app/reports/departments",
    { params: { page } },
  );

  return data;
}

/** Report an existing department (duplicate, false data or other). */
export async function reportDepartment(
  departmentId: number | string,
  payload: DepartmentReportPayload,
) {
  const { data } = await axios.post<ResourceResponse<DepartmentReport>>(
    `/api/app/departments/${String(departmentId)}/reports`,
    payload,
  );

  return data.data;
}

/** Suggest a department that is missing. */
export async function suggestDepartment(payload: DepartmentReportPayload) {
  const { data } = await axios.post<ResourceResponse<DepartmentReport>>(
    "/api/app/departments/reports",
    payload,
  );

  return data.data;
}
