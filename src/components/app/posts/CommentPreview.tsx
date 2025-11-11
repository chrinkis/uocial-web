import { Timestamp } from "@/components/Time";
import type { Commment } from "@/models/app/post/Comment";
import {
  Badge,
  Collapse,
  Group,
  Paper,
  Stack,
  Text,
} from "@mantine/core";
import { useState } from "react";
import { useReactToComment } from "@/queries/app/post/comment";
import { notifications } from "@mantine/notifications";
import { getErrorMessage } from "@/utils/error";
import type { ReactionValue } from "@/models/app/post/Reaction";
import { ReactButton } from "@/components/app/posts/ReactButton";

export function CommentPreview({
  comment,
  postId,
  label,
}: {
  comment: Commment;
  postId: number;
  label?: string;
}) {
  const ICON_SIZE = 18;
  const TEXT_SIZE = "xs";

  const [expanded, setExpanded] = useState(false);
  const reactToComment = useReactToComment();

  function handleClick() {
    setExpanded((clamped) => !clamped);
  }

  async function handleReaction(reaction?: ReactionValue) {
    try {
      await reactToComment.mutateAsync({
        postId,
        commentId: comment.id,
        reaction,
      });
    } catch (error) {
      notifications.show({
        title: "Reaction failed",
        message: getErrorMessage(error),
        color: "red",
      });
    }
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

        <Group wrap="nowrap" align="center">
          <Text
            lineClamp={expanded ? undefined : 2}
            style={{ cursor: "pointer", flex: 1 }}
            onClick={handleClick}
          >
            {comment.comment}
          </Text>

          <Stack gap={expanded ? 10 : 0} align="safe center">
            {expanded ? (
              <>
                <ReactButton
                  reaction="Upvote"
                  total={comment.reactions.total.upvotes}
                  user={comment.reactions.user?.reaction}
                  onClick={handleReaction}
                  loading={reactToComment.isPending}
                  iconSize={ICON_SIZE}
                  textSize={TEXT_SIZE}
                />
                <ReactButton
                  reaction="Downvote"
                  total={comment.reactions.total.downvotes}
                  user={comment.reactions.user?.reaction}
                  onClick={handleReaction}
                  loading={reactToComment.isPending}
                  iconSize={ICON_SIZE}
                  textSize={TEXT_SIZE}
                />
              </>
            ) : (
              <>
                <ReactButton
                  reaction="Upvote"
                  total=""
                  user={comment.reactions.user?.reaction}
                  onClick={handleReaction}
                  loading={reactToComment.isPending}
                  iconSize={ICON_SIZE}
                />
                <ReactButton
                  reaction="Downvote"
                  total=""
                  user={comment.reactions.user?.reaction}
                  onClick={handleReaction}
                  loading={reactToComment.isPending}
                  iconSize={ICON_SIZE}
                />
              </>
            )}
          </Stack>
        </Group>
      </Stack>
    </Paper>
  );
}
