import type { CourseOfferingReport } from "@/models/app/reviews/CourseOfferingReport";
import type { CourseReport } from "@/models/app/reviews/CourseReport";
import type { DepartmentReport } from "@/models/app/reviews/DepartmentReport";
import {
  useCourseReports,
  useResolveCourseReport,
} from "@/queries/app/reviews/course-report";
import {
  useDepartmentReports,
  useResolveDepartmentReport,
} from "@/queries/app/reviews/department-report";
import {
  useOfferingReports,
  useResolveOfferingReport,
} from "@/queries/app/reviews/offering-report";
import { CourseReportItem } from "./CourseReportItem";
import { DepartmentReportItem } from "./DepartmentReportItem";
import { OfferingReportItem } from "./OfferingReportItem";
import { ReportsModeration } from "./ReportsModeration";
import { ResolveReportButton } from "./ResolveReportButton";

function ModerationDepartmentReport({ data }: { data: DepartmentReport }) {
  const resolve = useResolveDepartmentReport();

  return (
    <DepartmentReportItem
      data={data}
      footer={
        data.resolved_at === null && (
          <ResolveReportButton
            reportId={data.id}
            onResolve={(comment) =>
              resolve.mutateAsync({ reportId: data.id, comment })
            }
          />
        )
      }
    />
  );
}

function ModerationCourseReport({ data }: { data: CourseReport }) {
  const resolve = useResolveCourseReport();

  return (
    <CourseReportItem
      data={data}
      footer={
        data.resolved_at === null && (
          <ResolveReportButton
            reportId={data.id}
            onResolve={(comment) =>
              resolve.mutateAsync({ reportId: data.id, comment })
            }
          />
        )
      }
    />
  );
}

function ModerationOfferingReport({ data }: { data: CourseOfferingReport }) {
  const resolve = useResolveOfferingReport();

  return (
    <OfferingReportItem
      data={data}
      footer={
        data.resolved_at === null && (
          <ResolveReportButton
            reportId={data.id}
            onResolve={(comment) =>
              resolve.mutateAsync({ reportId: data.id, comment })
            }
          />
        )
      }
    />
  );
}

export function DepartmentReportsModeration() {
  return (
    <ReportsModeration
      name="department"
      useReports={useDepartmentReports}
      Component={ModerationDepartmentReport}
    />
  );
}

export function CourseReportsModeration() {
  return (
    <ReportsModeration
      name="course"
      useReports={useCourseReports}
      Component={ModerationCourseReport}
    />
  );
}

export function OfferingReportsModeration() {
  return (
    <ReportsModeration
      name="offering"
      useReports={useOfferingReports}
      Component={ModerationOfferingReport}
    />
  );
}
