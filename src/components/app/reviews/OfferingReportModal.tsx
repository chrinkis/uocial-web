import { useState } from "react";
import { Tabs } from "@mantine/core";
import { InfiniteScrolling } from "@/components/InfiniteScrolling";
import type { CourseOffering } from "@/models/app/reviews/CourseOffering";
import { useMyOfferingReports } from "@/queries/app/reviews/offering-report";
import { DepartmentReportSkeleton } from "./DepartmentReportSkeleton";
import { OfferingReportForm } from "./OfferingReportForm";
import { OfferingReportItem } from "./OfferingReportItem";

export interface OfferingReportModalPropsType {
  departmentId: number | string;
  courseId: number | string;
  /** The reported offering. Leave empty to suggest a missing one. */
  offering?: CourseOffering;
}

export function OfferingReportModal({
  departmentId,
  courseId,
  offering,
}: OfferingReportModalPropsType) {
  const [tab, setTab] = useState<string | null>("new");

  return (
    <Tabs value={tab} onChange={setTab} keepMounted={false}>
      <Tabs.List grow mb="md">
        <Tabs.Tab value="new">New</Tabs.Tab>
        <Tabs.Tab value="mine">My Reports</Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="new">
        <OfferingReportForm
          departmentId={departmentId}
          courseId={courseId}
          offering={offering}
          onSuccess={() => {
            setTab("mine");
          }}
        />
      </Tabs.Panel>

      <Tabs.Panel value="mine">
        <InfiniteScrolling
          useQuery={useMyOfferingReports}
          queryArgs={[]}
          name="reports"
          Component={OfferingReportItem}
          Fallback="You haven't submitted any reports."
          loader={<DepartmentReportSkeleton />}
        />
      </Tabs.Panel>
    </Tabs>
  );
}
