import { Group, Paper, Skeleton, Stack } from "@mantine/core";

export function DepartmentReportSkeleton() {
  return (
    <Paper withBorder radius="md" p="md" w="100%">
      <Stack gap="xs">
        <Group justify="space-between" wrap="nowrap">
          <Skeleton height={22} width={90} radius="xl" />
          <Skeleton height={14} width={80} radius="sm" />
        </Group>
        <Skeleton height={16} width="60%" radius="sm" />
        <Skeleton height={14} width="90%" radius="sm" />
      </Stack>
    </Paper>
  );
}
