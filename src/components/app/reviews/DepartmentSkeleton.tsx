import { Group, Paper, Skeleton, Stack } from "@mantine/core";

export function DepartmentSkeleton() {
  return (
    <Paper withBorder radius="lg" p="md" w="90%" maw="50rem">
      <Group justify="space-between" wrap="nowrap" gap="md">
        <Group gap="md" wrap="nowrap">
          <Skeleton height={44} width={68} radius="md" />

          <Stack gap={6}>
            <Skeleton height={18} width={140} radius="sm" />
            <Skeleton height={12} width={80} radius="sm" />
          </Stack>
        </Group>

        <Skeleton height={28} width={28} radius="xl" />
      </Group>
    </Paper>
  );
}
