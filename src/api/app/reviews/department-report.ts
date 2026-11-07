import axios from "axios";
import type { ReportFilter } from "@/models/app/reviews/ReportFilter";
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

/** Moderation: the reports of all the users. */
export async function fetchDepartmentReports(
  page: number | string,
  filter: ReportFilter,
) {
  const { data } = await axios.get<PaginatedResponse<DepartmentReport>>(
    "/api/app/admin/reports/departments",
    {
      params: {
        page,
        resolved: filter.resolved ? 1 : 0,
        reason: filter.reason,
      },
    },
  );

  return data;
}

/** Moderation: mark a report as resolved. */
export async function resolveDepartmentReport(
  reportId: number | string,
  comment?: string,
) {
  const { data } = await axios.post<ResourceResponse<DepartmentReport>>(
    `/api/app/admin/reports/departments/${String(reportId)}/resolve`,
    { comment },
  );

  return data.data;
}
