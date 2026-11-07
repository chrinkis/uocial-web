import { useState } from "react";
import { Tabs } from "@mantine/core";
import { InfiniteScrolling } from "@/components/InfiniteScrolling";
import type { Department } from "@/models/app/reviews/Department";
import { useMyDepartmentReports } from "@/queries/app/reviews/department-report";
import { DepartmentReportForm } from "./DepartmentReportForm";
import { DepartmentReportItem } from "./DepartmentReportItem";
import { DepartmentReportSkeleton } from "./DepartmentReportSkeleton";

export interface DepartmentReportModalPropsType {
  /** The reported department. Leave empty to suggest a missing one. */
  department?: Department;
}

export function DepartmentReportModal({
  department,
}: DepartmentReportModalPropsType) {
  const [tab, setTab] = useState<string | null>("new");

  return (
    <Tabs value={tab} onChange={setTab} keepMounted={false}>
      <Tabs.List grow mb="md">
        <Tabs.Tab value="new">New</Tabs.Tab>
        <Tabs.Tab value="mine">My Reports</Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="new">
        <DepartmentReportForm
          department={department}
          onSuccess={() => {
            setTab("mine");
          }}
        />
      </Tabs.Panel>

      <Tabs.Panel value="mine">
        <InfiniteScrolling
          useQuery={useMyDepartmentReports}
          queryArgs={[]}
          name="reports"
          Component={DepartmentReportItem}
          Fallback="You haven't submitted any reports."
          loader={<DepartmentReportSkeleton />}
        />
      </Tabs.Panel>
    </Tabs>
  );
}
