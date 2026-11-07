import type { DataReportReason } from "@/models/app/reviews/DepartmentReport";

export interface CourseReportDepartment {
  readonly id: number;
  code: string;
  name: string;
}

export interface CourseReportCourse {
  readonly id: number;
  department_id: number;
  code: string;
  name: string;
  department?: CourseReportDepartment | null;
}

export interface CourseReport {
  readonly id: number;
  reason: DataReportReason;
  comment: string | null;
  /** Absent when the report suggests a new course. */
  course?: CourseReportCourse | null;
  /** Present when the report suggests a new course. */
  department?: CourseReportDepartment | null;
  duplicate_of?: CourseReportCourse | null;
  resolved_at: string | null;
  resolved_comment: string | null;
  created_at: string;
}
