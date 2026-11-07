import axios from "axios";
import type { ReportFilter } from "@/models/app/reviews/ReportFilter";
import type { PaginatedResponse, ResourceResponse } from "@/utils/response";
import type { CourseOfferingReport } from "@/models/app/reviews/CourseOfferingReport";
import type { DepartmentReportPayload } from "@/api/app/reviews/department-report";

function offeringsUrl(
  departmentId: number | string,
  courseId: number | string,
) {
  return `/api/app/departments/${String(departmentId)}/courses/${String(courseId)}/offerings`;
}

export async function fetchMyOfferingReports(page: number | string) {
  const { data } = await axios.get<PaginatedResponse<CourseOfferingReport>>(
    "/api/app/reports/offerings",
    { params: { page } },
  );

  return data;
}

/** Report an existing offering (duplicate, false data or other). */
export async function reportOffering(
  departmentId: number | string,
  courseId: number | string,
  offeringId: number | string,
  payload: DepartmentReportPayload,
) {
  const { data } = await axios.post<ResourceResponse<CourseOfferingReport>>(
    `${offeringsUrl(departmentId, courseId)}/${String(offeringId)}/reports`,
    payload,
  );

  return data.data;
}

/** Suggest an offering that is missing from a course. */
export async function suggestOffering(
  departmentId: number | string,
  courseId: number | string,
  payload: DepartmentReportPayload,
) {
  const { data } = await axios.post<ResourceResponse<CourseOfferingReport>>(
    `${offeringsUrl(departmentId, courseId)}/reports`,
    payload,
  );

  return data.data;
}

/** Moderation: the reports of all the users. */
export async function fetchOfferingReports(
  page: number | string,
  filter: ReportFilter,
) {
  const { data } = await axios.get<PaginatedResponse<CourseOfferingReport>>(
    "/api/app/admin/reports/offerings",
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
export async function resolveOfferingReport(
  reportId: number | string,
  comment?: string,
) {
  const { data } = await axios.post<ResourceResponse<CourseOfferingReport>>(
    `/api/app/admin/reports/offerings/${String(reportId)}/resolve`,
    { comment },
  );

  return data.data;
}
