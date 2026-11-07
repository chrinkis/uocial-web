import axios from "axios";
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
