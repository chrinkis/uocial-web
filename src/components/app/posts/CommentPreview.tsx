import { Timestamp } from "@/components/Time";
import type { Commment } from "@/models/app/post/Comment";
import {
  Badge,
  Collapse,
  Group,
  Paper,
  Stack,
  Text,
  UnstyledButton,
} from "@mantine/core";
import {
  IconArrowBigDown,
  IconArrowBigDownFilled,
  IconArrowBigUp,
  IconArrowBigUpFilled,
} from "@tabler/icons-react";
import { useState, type MouseEvent } from "react";

export function CommentPreview({
  comment,
  label,
}: {
  comment: Commment;
  label?: string;
}) {
  const ICON_SIZE = 18;
  const TEXT_SIZE = "xs";

  const [expanded, setExpanded] = useState(false);

  function handleClick() {
    setExpanded((clamped) => !clamped);
  }

  function handleUpvoteClick(e: MouseEvent) {
    e.stopPropagation();
  }

  function handleDownvoteClick(e: MouseEvent) {
    e.stopPropagation();
  }

  return (
    <Paper withBorder p="xs" w="100%">
      <Stack gap={2}>
        <Collapse in={expanded} transitionDuration={500}>
          <Group justify="space-between">
            <Group gap={3}>
              <Badge
                size="sm"
                variant="gradient"
                gradient={{ from: "grape", to: "violet", deg: 90 }}
              >
                !{comment.id}
              </Badge>

              {label && (
                <Badge
                  size="sm"
                  variant="gradient"
                  gradient={{ from: "grape", to: "violet", deg: 90 }}
                >
                  {label}
                </Badge>
              )}
            </Group>

            <Timestamp date={comment.created_at} />
          </Group>
        </Collapse>

        <Group wrap="nowrap" align="center" onClick={handleClick}>
          <Text
            lineClamp={expanded ? undefined : 2}
            style={{ cursor: "pointer", flex: 1 }}
          >
            {comment.comment}
          </Text>

          <Stack gap={expanded ? 10 : 0} align="safe center">
            <Stack gap={0} align="safe center">
              {comment.reactions.user?.reaction === "Upvote" ? (
                <UnstyledButton c="violet" onClick={handleUpvoteClick}>
                  <IconArrowBigUpFilled size={ICON_SIZE} />
                </UnstyledButton>
              ) : (
                <UnstyledButton
                  c="var(--mantine-color-dimmed)"
                  onClick={handleUpvoteClick}
                >
                  <IconArrowBigUp size={ICON_SIZE} />
                </UnstyledButton>
              )}

              {expanded && (
                <Text size={TEXT_SIZE} c="var(--mantine-color-dimmed)">
                  {comment.reactions.total.upvotes}
                </Text>
              )}
            </Stack>

            <Stack gap={0} align="safe center">
              {expanded && (
                <Text size={TEXT_SIZE} c="var(--mantine-color-dimmed)">
                  {comment.reactions.total.downvotes}
                </Text>
              )}

              {comment.reactions.user?.reaction === "Downvote" ? (
                <UnstyledButton c="violet" onClick={handleDownvoteClick}>
                  <IconArrowBigDownFilled size={ICON_SIZE} />
                </UnstyledButton>
              ) : (
                <UnstyledButton
                  c="var(--mantine-color-dimmed)"
                  onClick={handleDownvoteClick}
                >
                  <IconArrowBigDown size={ICON_SIZE} />
                </UnstyledButton>
              )}
            </Stack>
          </Stack>
        </Group>
      </Stack>
    </Paper>
  );
}
