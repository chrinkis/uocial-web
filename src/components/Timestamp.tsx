import { useState, useEffect } from "react";
import { Group, Tooltip, Text } from "@mantine/core";
import { IconClock } from "@tabler/icons-react";
import { format, formatDistanceToNow } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

export function Timestamp({ date }: { date: string }) {
  const [relativeTime, setRelativeTime] = useState(() =>
    formatDistanceToNow(date, { addSuffix: true }),
  );

  useEffect(() => {
    const intervalId = setInterval(() => {
      setRelativeTime(formatDistanceToNow(date, { addSuffix: true }));
    }, 7500);

    return () => {
      clearInterval(intervalId);
    };
  }, [date]);

  return (
    <Group gap={3} wrap="nowrap">
      <IconClock color="var(--mantine-color-dimmed)" size="1rem" />
      <Tooltip
        label={format(date, "PP·p")}
        events={{ touch: true, hover: true, focus: false }}
      >
        <Text c="dimmed" size="xs" component="div">
          <AnimatePresence mode="wait">
            <motion.span
              key={relativeTime}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              style={{ display: "inline-block" }}
            >
              {relativeTime}
            </motion.span>
          </AnimatePresence>
        </Text>
      </Tooltip>
    </Group>
  );
}
