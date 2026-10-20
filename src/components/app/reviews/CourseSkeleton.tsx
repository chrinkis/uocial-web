import { Group, Paper, Skeleton } from "@mantine/core";

export function CourseSkeleton() {
  return (
    <Paper withBorder radius="lg" p="sm" w="90%" maw="50rem">
      <Group justify="space-between" wrap="nowrap" gap="md">
        <Group gap="sm" wrap="nowrap">
          <Skeleton height={40} width={96} radius="md" />
          <Skeleton height={18} width={140} radius="sm" />
        </Group>

        <Skeleton height={28} width={28} radius="xl" />
      </Group>
    </Paper>
  );
}
