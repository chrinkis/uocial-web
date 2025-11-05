import type { ReactionValue } from "@/models/app/post/Reaction";
import {
  Box,
  Group,
  UnstyledButton,
  type MantineSize,
  Text,
} from "@mantine/core";
import {
  IconArrowBigDown,
  IconArrowBigDownFilled,
  IconArrowBigUp,
  IconArrowBigUpFilled,
} from "@tabler/icons-react";
import { AnimatePresence, motion } from "framer-motion";

interface ReactButtonPropsType {
  total: number | string;
  reaction: ReactionValue;
  user?: ReactionValue;
  onClick?: (reaction?: ReactionValue) => Promise<void>;
  loading?: boolean;
  textSize?: MantineSize | number;
  iconSize?: number;
  buttonSize?: MantineSize | number;
}

export function ReactButton({
  total,
  textSize,
  iconSize,
  buttonSize,
  reaction,
  user,
  onClick: handleReaction,
  loading,
}: ReactButtonPropsType) {
  return (
    <Group gap={2} align="stretch">
      <UnstyledButton
        c={user === reaction ? "violet" : undefined}
        onClick={() =>
          void handleReaction?.(user === reaction ? undefined : reaction)
        }
        disabled={loading}
        size={buttonSize}
      >
        <Box style={{ position: "relative", display: "flex" }}>
          {reaction === "Upvote" ? (
            <IconArrowBigUp size={iconSize} />
          ) : (
            <IconArrowBigDown size={iconSize} />
          )}
          <motion.div
            style={{ position: "absolute", top: 0, left: 0 }}
            initial={false}
            animate={{
              opacity: user === reaction ? 1 : 0,
            }}
            transition={{ duration: 0.3 }}
          >
            {reaction === "Upvote" ? (
              <IconArrowBigUpFilled size={iconSize} />
            ) : (
              <IconArrowBigDownFilled size={iconSize} />
            )}
          </motion.div>
        </Box>
      </UnstyledButton>

      <Box style={{ position: "relative", overflow: "hidden" }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={total}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Text size={textSize}>{total}</Text>
          </motion.div>
        </AnimatePresence>
      </Box>
    </Group>
  );
}
