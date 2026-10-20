import { Group, Paper, Skeleton, Stack } from "@mantine/core";

export function InstructorSkeleton() {
  return (
    <Paper withBorder radius="lg" p="sm" w="90%" maw="50rem">
      <Group gap="sm" wrap="nowrap">
        <Skeleton height={40} width={40} radius="xl" />

        <Stack gap={4}>
          <Skeleton height={16} width={160} radius="sm" />
          <Skeleton height={12} width={60} radius="sm" />
        </Stack>
      </Group>
    </Paper>
  );
}
