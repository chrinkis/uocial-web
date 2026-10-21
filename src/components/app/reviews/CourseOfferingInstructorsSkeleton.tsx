import { Group, Paper, Skeleton, Stack } from "@mantine/core";

export function CourseOfferingInstructorsSkeleton() {
  return (
    <Paper withBorder radius="lg" p="lg" w="90%" maw="50rem">
      <Stack gap="sm">
        <Group justify="center">
          <Skeleton height={20} width={110} radius="sm" />
        </Group>

        {[0, 1, 2].map((index) => (
          <Group key={index} gap="sm" wrap="nowrap">
            <Skeleton height={40} width={40} radius="xl" />
            <Skeleton height={16} width={160} radius="sm" />
          </Group>
        ))}
      </Stack>
    </Paper>
  );
}
