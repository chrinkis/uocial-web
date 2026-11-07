import type { ReactNode } from "react";
import { Badge, Group, Paper, Stack, Text } from "@mantine/core";
import { Timestamp } from "@/components/Timestamp";
import type { CourseReport } from "@/models/app/reviews/CourseReport";
import type { DataReportReason } from "@/models/app/reviews/DepartmentReport";

const REASON_LABELS: Record<DataReportReason, string> = {
  missing: "Missing",
  duplicate: "Duplicate",
  false_data: "False data",
  other: "Other",
};

export interface CourseReportItemPropsType {
  data: CourseReport;
  /** Extra content under the report, e.g. moderation actions. */
  footer?: ReactNode;
}

export function CourseReportItem({ data, footer }: CourseReportItemPropsType) {
  const resolved = data.resolved_at !== null;

  return (
    <Paper withBorder radius="md" p="md" w="100%">
      <Stack gap="xs">
        <Group justify="space-between" wrap="nowrap" align="start">
          <Group gap="xs">
            <Badge variant="light">{REASON_LABELS[data.reason]}</Badge>
            <Badge variant="outline" color={resolved ? "green" : "yellow"}>
              {resolved ? "Resolved" : "Pending"}
            </Badge>
          </Group>
          <Timestamp date={data.created_at} />
        </Group>

        <Text fw={600}>
          {data.course
            ? `${data.course.code} - ${data.course.name}`
            : data.department
              ? `New course in ${data.department.code} - ${data.department.name}`
              : "New course"}
        </Text>

        {data.course?.department && (
          <Text size="sm" c="dimmed">
            Department: {data.course.department.code} -{" "}
            {data.course.department.name}
          </Text>
        )}

        {data.duplicate_of && (
          <Text size="sm" c="dimmed">
            Duplicate of {data.duplicate_of.code} - {data.duplicate_of.name}
            {data.duplicate_of.department &&
              ` (${data.duplicate_of.department.code})`}
          </Text>
        )}

        {data.comment && <Text size="sm">{data.comment}</Text>}

        {data.resolved_comment && (
          <Text size="sm" c="dimmed" fs="italic">
            Resolution: {data.resolved_comment}
          </Text>
        )}

        {footer}
      </Stack>
    </Paper>
  );
}
