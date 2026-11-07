export type DataReportReason = "missing" | "duplicate" | "false_data" | "other";

export interface DepartmentReportDepartment {
  readonly id: number;
  code: string;
  name: string;
}

export interface DepartmentReport {
  readonly id: number;
  reason: DataReportReason;
  comment: string | null;
  /** Absent when the report suggests a new department. */
  department?: DepartmentReportDepartment | null;
  duplicate_of?: DepartmentReportDepartment | null;
  resolved_at: string | null;
  resolved_comment: string | null;
  created_at: string;
}
