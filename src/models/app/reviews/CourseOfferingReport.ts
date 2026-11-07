import type { DataReportReason } from "@/models/app/reviews/DepartmentReport";
import type { Term } from "@/models/app/reviews/Term";

export interface CourseOfferingReportDepartment {
  readonly id: number;
  code: string;
  name: string;
}

export interface CourseOfferingReportCourse {
  readonly id: number;
  department_id: number;
  code: string;
  name: string;
  department?: CourseOfferingReportDepartment | null;
}

export interface CourseOfferingReportOffering extends Term {
  readonly id: number;
  course_id: number;
  course?: CourseOfferingReportCourse | null;
}

export interface CourseOfferingReport {
  readonly id: number;
  reason: DataReportReason;
  comment: string | null;
  /** Absent when the report suggests a new offering. */
  offering?: CourseOfferingReportOffering | null;
  /** Present when the report suggests a new offering. */
  course?: CourseOfferingReportCourse | null;
  duplicate_of?: CourseOfferingReportOffering | null;
  resolved_at: string | null;
  resolved_comment: string | null;
  created_at: string;
}
