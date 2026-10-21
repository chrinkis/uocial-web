import { Group, Paper, Skeleton, Stack } from "@mantine/core";

export function CourseSemesterSkeleton() {
  return (
    <Paper withBorder radius="lg" p="lg" w="90%" maw="50rem">
      <Stack gap="sm">
        <Group justify="center">
          <Skeleton height={20} width={80} radius="sm" />
        </Group>

        <Skeleton height={12} width="100%" radius="xl" />

        <Group gap="lg" justify="center">
          <Skeleton height={14} width={80} radius="sm" />
          <Skeleton height={14} width={90} radius="sm" />
        </Group>
      </Stack>
    </Paper>
  );
}
