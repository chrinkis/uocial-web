import axios from "axios";
import type { PaginatedResponse } from "@/utils/response";
import type { CourseOffering } from "@/models/app/reviews/CourseOffering";

export async function fetchCourseOfferings(
  departmentId: number | string,
  courseId: number | string,
  page: number | string,
) {
  const { data } = await axios.get<PaginatedResponse<CourseOffering>>(
    `/api/app/departments/${String(departmentId)}/courses/${String(courseId)}/offerings?page=${String(page)}`,
  );

  return data;
}
