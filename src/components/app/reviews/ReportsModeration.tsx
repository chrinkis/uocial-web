import { useState } from "react";
import { Select, Stack, Tabs } from "@mantine/core";
import type {
  InfiniteData,
  UseInfiniteQueryResult,
} from "@tanstack/react-query";
import { InfiniteScrolling } from "@/components/InfiniteScrolling";
import type { DataReportReason } from "@/models/app/reviews/DepartmentReport";
import type { ReportFilter } from "@/models/app/reviews/ReportFilter";
import type { PaginatedResponse } from "@/utils/response";
import { DepartmentReportSkeleton } from "./DepartmentReportSkeleton";

const REASON_OPTIONS: { value: DataReportReason; label: string }[] = [
  { value: "missing", label: "Missing" },
  { value: "duplicate", label: "Duplicate" },
  { value: "false_data", label: "False data" },
  { value: "other", label: "Other" },
];

export interface ReportsModerationPropsType<T extends { id: number }> {
  /** What the reports are about, e.g. "department". */
  name: string;
  useReports: (
    filter: ReportFilter,
  ) => UseInfiniteQueryResult<InfiniteData<PaginatedResponse<T>>>;
  /** Renders a report. */
  Component: React.ComponentType<{ data: T }>;
}

export function ReportsModeration<T extends { id: number }>({
  name,
  useReports,
  Component,
}: ReportsModerationPropsType<T>) {
  const [reason, setReason] = useState<DataReportReason | null>(null);

  return (
    <Tabs defaultValue="pending" w="100%" keepMounted={false}>
      <Tabs.List justify="center" mb="lg">
        <Tabs.Tab value="pending">Pending</Tabs.Tab>
        <Tabs.Tab value="resolved">Resolved</Tabs.Tab>
      </Tabs.List>

      <Stack maw={720} mx="auto" gap="md">
        <Select
          aria-label="Reason"
          placeholder="All reasons"
          clearable
          data={REASON_OPTIONS}
          value={reason}
          onChange={(value) => {
            setReason(value);
          }}
        />

        <Tabs.Panel value="pending">
          <InfiniteScrolling
            useQuery={useReports}
            queryArgs={[{ resolved: false, reason: reason ?? undefined }]}
            name={`${name} reports`}
            Component={Component}
            Fallback={`No pending ${name} reports.`}
            loader={<DepartmentReportSkeleton />}
            gap="sm"
          />
        </Tabs.Panel>

        <Tabs.Panel value="resolved">
          <InfiniteScrolling
            useQuery={useReports}
            queryArgs={[{ resolved: true, reason: reason ?? undefined }]}
            name={`${name} reports`}
            Component={Component}
            Fallback={`No resolved ${name} reports.`}
            loader={<DepartmentReportSkeleton />}
            gap="sm"
          />
        </Tabs.Panel>
      </Stack>
    </Tabs>
  );
}
