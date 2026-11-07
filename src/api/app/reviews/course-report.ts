import axios from "axios";
import type { ReportFilter } from "@/models/app/reviews/ReportFilter";
import type { PaginatedResponse, ResourceResponse } from "@/utils/response";
import type { CourseReport } from "@/models/app/reviews/CourseReport";
import type { DepartmentReportPayload } from "@/api/app/reviews/department-report";

export async function fetchMyCourseReports(page: number | string) {
  const { data } = await axios.get<PaginatedResponse<CourseReport>>(
    "/api/app/reports/courses",
    { params: { page } },
  );

  return data;
}

/** Report an existing course (duplicate, false data or other). */
export async function reportCourse(
  departmentId: number | string,
  courseId: number | string,
  payload: DepartmentReportPayload,
) {
  const { data } = await axios.post<ResourceResponse<CourseReport>>(
    `/api/app/departments/${String(departmentId)}/courses/${String(courseId)}/reports`,
    payload,
  );

  return data.data;
}

/** Suggest a course that is missing from a department. */
export async function suggestCourse(
  departmentId: number | string,
  payload: DepartmentReportPayload,
) {
  const { data } = await axios.post<ResourceResponse<CourseReport>>(
    `/api/app/departments/${String(departmentId)}/courses/reports`,
    payload,
  );

  return data.data;
}

/** Moderation: the reports of all the users. */
export async function fetchCourseReports(
  page: number | string,
  filter: ReportFilter,
) {
  const { data } = await axios.get<PaginatedResponse<CourseReport>>(
    "/api/app/admin/reports/courses",
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
export async function resolveCourseReport(
  reportId: number | string,
  comment?: string,
) {
  const { data } = await axios.post<ResourceResponse<CourseReport>>(
    `/api/app/admin/reports/courses/${String(reportId)}/resolve`,
    { comment },
  );

  return data.data;
}
