import { Group, Paper, Skeleton, Stack } from "@mantine/core";

export function CourseLastOfferingSkeleton() {
  return (
    <Paper withBorder radius="lg" p="lg" w="90%" maw="50rem">
      <Stack gap="sm">
        <Group justify="center" gap="xs">
          <Skeleton height={20} width={120} radius="sm" />
          <Skeleton height={24} width={24} radius="xl" />
        </Group>

        <Skeleton height={14} width={220} radius="sm" mx="auto" />
      </Stack>
    </Paper>
  );
}
