import { useState } from "react";
import { Tabs } from "@mantine/core";
import { InfiniteScrolling } from "@/components/InfiniteScrolling";
import type { Course } from "@/models/app/reviews/Course";
import { useMyCourseReports } from "@/queries/app/reviews/course-report";
import { CourseReportForm } from "./CourseReportForm";
import { CourseReportItem } from "./CourseReportItem";
import { DepartmentReportSkeleton } from "./DepartmentReportSkeleton";

export interface CourseReportModalPropsType {
  departmentId: number;
  /** The reported course. Leave empty to suggest a missing one. */
  course?: Course;
}

export function CourseReportModal({
  departmentId,
  course,
}: CourseReportModalPropsType) {
  const [tab, setTab] = useState<string | null>("new");

  return (
    <Tabs value={tab} onChange={setTab} keepMounted={false}>
      <Tabs.List grow mb="md">
        <Tabs.Tab value="new">New</Tabs.Tab>
        <Tabs.Tab value="mine">My Reports</Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="new">
        <CourseReportForm
          departmentId={departmentId}
          course={course}
          onSuccess={() => {
            setTab("mine");
          }}
        />
      </Tabs.Panel>

      <Tabs.Panel value="mine">
        <InfiniteScrolling
          useQuery={useMyCourseReports}
          queryArgs={[]}
          name="reports"
          Component={CourseReportItem}
          Fallback="You haven't submitted any reports."
          loader={<DepartmentReportSkeleton />}
        />
      </Tabs.Panel>
    </Tabs>
  );
}
