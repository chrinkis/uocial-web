import { Group, Paper, Skeleton, Stack } from "@mantine/core";

export function CourseOfferingHeaderSkeleton() {
  return (
    <Paper withBorder radius="lg" p="lg" w="90%" maw="50rem">
      <Stack gap="xs">
        <Group gap="md" wrap="nowrap">
          <Skeleton height={44} width={80} radius="md" />
          <Skeleton height={24} width={80} radius="sm" />
        </Group>

        <Group gap="xs">
          <Skeleton height={20} width={120} radius="sm" />
          <Skeleton height={16} width={90} radius="sm" />
        </Group>
      </Stack>
    </Paper>
  );
}
