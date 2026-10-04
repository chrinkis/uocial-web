import { Paper, Skeleton, Stack } from "@mantine/core";

export function BanSkeleton() {
  return (
    <Paper withBorder p="sm" w="100%">
      <Stack>
        <Skeleton height={24} width="40%" />
        <Skeleton height={14} />
        <Skeleton height={14} />
        <Skeleton height={14} width="70%" />
        <Skeleton height={36} />
      </Stack>
    </Paper>
  );
}
