import axios from "axios";
import type { PaginatedResponse } from "@/utils/response";
import type { Instructor } from "@/models/app/reviews/Instructor";

export async function fetchDepartmentInstructors(
  departmentId: number | string,
  page: number | string,
) {
  const { data } = await axios.get<PaginatedResponse<Instructor>>(
    `/api/app/departments/${String(departmentId)}/instructors?page=${String(page)}`,
  );

  return data;
}

export async function fetchCourseInstructors(
  departmentId: number | string,
  courseId: number | string,
  page: number | string,
) {
  const { data } = await axios.get<PaginatedResponse<Instructor>>(
    `/api/app/departments/${String(departmentId)}/courses/${String(courseId)}/instructors?page=${String(page)}`,
  );

  return data;
}
