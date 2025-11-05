import { Group, Tooltip, Text } from "@mantine/core";
import { IconClock } from "@tabler/icons-react";
import { format, formatDistanceToNow } from "date-fns";

export function Timestamp({ date }: { date: string }) {
  return (
    <Group gap={3} wrap="nowrap">
      <IconClock color="var(--mantine-color-dimmed)" size="1rem" />
      <Tooltip
        label={format(date, "PP·p")}
        events={{ touch: true, hover: true, focus: false }}
      >
        <Text c="dimmed" size="xs">
          {formatDistanceToNow(date, { addSuffix: true })}
        </Text>
      </Tooltip>
    </Group>
  );
}
