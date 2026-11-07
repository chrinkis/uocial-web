import type { DataReportReason } from "@/models/app/reviews/DepartmentReport";

/** Filter of the moderation lists of data reports. */
export interface ReportFilter {
  resolved: boolean;
  reason?: DataReportReason;
}
