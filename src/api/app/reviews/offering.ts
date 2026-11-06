import axios from "axios";
import type { PaginatedResponse, ResourceResponse } from "@/utils/response";
import type { CourseOffering } from "@/models/app/reviews/CourseOffering";

export async function fetchCourseOfferings(
  departmentId: number | string,
  courseId: number | string,
  page: number | string,
  instructorIds: number[] = [],
  search?: string,
) {
  const { data } = await axios.get<PaginatedResponse<CourseOffering>>(
    `/api/app/departments/${String(departmentId)}/courses/${String(courseId)}/offerings`,
    {
      params: {
        page,
        search: search === "" ? undefined : search,
        instructors: instructorIds.length > 0 ? instructorIds : undefined,
      },
    },
  );

  return data;
}

export async function fetchCourseOffering(
  departmentId: number | string,
  courseId: number | string,
  offeringId: number | string,
) {
  const { data } = await axios.get<ResourceResponse<CourseOffering>>(
    `/api/app/departments/${String(departmentId)}/courses/${String(courseId)}/offerings/${String(offeringId)}`,
  );

  return data.data;
}
