import { Paper, Skeleton, Stack, Group, Box } from "@mantine/core";

export function PostSkeleton() {
  return (
    <Paper withBorder w="90%" maw="50rem">
      <Box p="md">
        <Stack>
          {/* Title */}
          <Skeleton height={32} />

          {/* Metadata badges and timestamp */}
          <Group justify="space-between" gap="xs" wrap="wrap">
            <Skeleton height={24} width={30} radius="sm" />
            <Skeleton height={16} width={60} />
          </Group>

          {/* Body */}
          <Stack gap="xs">
            <Skeleton height={16} width="100%" />
            <Skeleton height={16} width="100%" />
            <Skeleton height={16} width="64%" />
          </Stack>

          {/* Hashtags */}
          <Group gap="0.5rem">
            <Skeleton height={16} width={30} />
            <Skeleton height={16} width={50} />
            <Skeleton height={16} width={30} />
          </Group>

          {/* Reactions and comments */}
          <Group justify="space-between">
            <Group gap="xs">
              <Skeleton height={24} width={50} radius="md" />
              <Skeleton height={24} width={50} radius="md" />
            </Group>
            <Group gap={2}>
              <Skeleton height={24} width={40} />
            </Group>
          </Group>
        </Stack>
      </Box>
    </Paper>
  );
}
