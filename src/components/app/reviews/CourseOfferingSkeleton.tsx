import { Group, Paper, Skeleton } from "@mantine/core";

export function CourseOfferingSkeleton() {
  return (
    <Paper withBorder radius="lg" p="sm" w="90%" maw="50rem">
      <Group justify="space-between" wrap="nowrap" gap="md">
        <Group gap="sm" wrap="nowrap">
          <Skeleton height={40} width={112} radius="md" />
          <Skeleton height={16} width={180} radius="sm" />
        </Group>

        <Skeleton height={28} width={28} radius="xl" />
      </Group>
    </Paper>
  );
}
