import type { ReactNode } from "react";
import { Badge, Group, Paper, Stack, Text } from "@mantine/core";
import { Timestamp } from "@/components/Timestamp";
import type { CourseOfferingReport } from "@/models/app/reviews/CourseOfferingReport";
import type { DataReportReason } from "@/models/app/reviews/DepartmentReport";
import { formatTerm } from "@/utils/app/reviews/semester";

const REASON_LABELS: Record<DataReportReason, string> = {
  missing: "Missing",
  duplicate: "Duplicate",
  false_data: "False data",
  other: "Other",
};

export interface OfferingReportItemPropsType {
  data: CourseOfferingReport;
  /** Extra content under the report, e.g. moderation actions. */
  footer?: ReactNode;
}

export function OfferingReportItem({
  data,
  footer,
}: OfferingReportItemPropsType) {
  const resolved = data.resolved_at !== null;
  // An existing offering tells its course, a suggestion has the course itself.
  const course = data.offering?.course ?? data.course;

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
          {data.offering ? formatTerm(data.offering) : "New offering"}
        </Text>

        {course && (
          <Text size="sm" c="dimmed">
            Course: {course.code} - {course.name}
            {course.department &&
              ` (${course.department.code} - ${course.department.name})`}
          </Text>
        )}

        {data.duplicate_of && (
          <Text size="sm" c="dimmed">
            Duplicate of {formatTerm(data.duplicate_of)}
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
