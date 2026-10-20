import axios from "axios";
import type { PaginatedResponse, ResourceResponse } from "@/utils/response";
import type { Course } from "@/models/app/reviews/Course";

export async function fetchCourses(
  departmentId: number | string,
  page: number | string,
) {
  const { data } = await axios.get<PaginatedResponse<Course>>(
    `/api/app/departments/${String(departmentId)}/courses?page=${String(page)}`,
  );

  return data;
}

export async function fetchCourse(
  departmentId: number | string,
  courseId: number | string,
) {
  const { data } = await axios.get<ResourceResponse<Course>>(
    `/api/app/departments/${String(departmentId)}/courses/${String(courseId)}`,
  );

  return data.data;
}
