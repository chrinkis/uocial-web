import { Group, Paper, Skeleton, Stack } from "@mantine/core";

export function CourseHeaderSkeleton() {
  return (
    <Paper withBorder radius="lg" p="lg" w="90%" maw="50rem">
      <Group justify="space-between" align="flex-start" wrap="wrap" gap="md">
        <Stack gap="xs">
          <Group gap="md" wrap="nowrap">
            <Skeleton height={44} width={96} radius="md" />
            <Skeleton height={24} width={180} radius="sm" />
          </Group>

          <Group gap="xs">
            <Skeleton height={20} width={120} radius="sm" />
            <Skeleton height={16} width={90} radius="sm" />
          </Group>
        </Stack>

        <Skeleton height={36} width={140} radius="md" />
      </Group>
    </Paper>
  );
}
