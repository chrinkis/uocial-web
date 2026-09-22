import { IconBellOff } from "@tabler/icons-react";
import { Stack, Text } from "@mantine/core";

export function NotificationEmpty() {
  return (
    <Stack align="center" gap="xs" p="md">
      <IconBellOff size={40} color="var(--mantine-color-dimmed)" />
      <Text c="var(--mantine-color-dimmed)">No notifications</Text>
    </Stack>
  );
}
