import { Paper, Skeleton, Stack, Group } from "@mantine/core";

export function CommentSkeleton() {
  return (
    <Stack gap="xs" maw={512} w="98%">
      <Paper withBorder p="xs">
        <Stack gap={5}>
          {/* Header - Avatar, username, and timestamp */}
          <Group justify="space-between">
            <Group gap={5}>
              <Skeleton height={32} width={32} circle />
              <Skeleton height={16} width={100} />
              <Skeleton height={18} width={40} radius="sm" />
            </Group>
            <Skeleton height={16} width={80} />
          </Group>

          {/* Body - Comment text */}
          <Stack gap="xs">
            <Skeleton height={14} width="100%" />
            <Skeleton height={14} width="85%" />
          </Stack>

          {/* Footer - Reactions and reply button */}
          <Group justify="space-between">
            <Group gap="xs">
              <Skeleton height={24} width={50} radius="md" />
              <Skeleton height={24} width={50} radius="md" />
              <Skeleton height={16} width={16} circle />
            </Group>
            <Group gap="xs">
              <Skeleton height={20} width={40} radius="sm" />
            </Group>
          </Group>
        </Stack>
      </Paper>
    </Stack>
  );
}
