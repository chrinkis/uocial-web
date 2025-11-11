import { useState, memo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Timestamp } from "@/components/Timestamp";
import type { Commment } from "@/models/app/post/Comment";
import { readablePseudonym } from "@/utils/pseudonym";
import {
  Text,
  Badge,
  Group,
  Avatar,
  Stack,
  Spoiler,
  Paper,
  Popover,
  UnstyledButton,
  Box,
  Tooltip,
} from "@mantine/core";
import { ReactButton } from "./ReactButton";
import { InfiniteScrolling } from "@/components/InfiniteScrolling";
import { useReplies, useReactToComment } from "@/queries/app/post/comment";
import { IconBubblePlus } from "@tabler/icons-react";
import { useSettings } from "@/providers/settings/hook";
import { notifications } from "@mantine/notifications";
import { getErrorMessage } from "@/utils/error";
import type { ReactionValue } from "@/models/app/post/Reaction";

export function CommentHeader({ comment }: { comment: Commment }) {
  const { settings } = useSettings();

  return (
    <Group justify="space-between">
      <Group gap={5} style={{ cursor: "pointer" }}>
        <Popover withArrow arrowSize={12}>
          <Popover.Target>
            <Group gap={5} style={{ cursor: "pointer" }}>
              <Avatar size="sm" variant="light" color="violet" />
              <Text size="sm" c="dimmed" fw={700}>
                {readablePseudonym(comment.author.pseudonym)}
              </Text>
            </Group>
          </Popover.Target>
          <Popover.Dropdown>
            <Text maw={300}>
              This usernmae in this post reffers to the same user. It is picked
              by Uocial and not by the commenter. It may be reused on a
              different post for a different user.
            </Text>
          </Popover.Dropdown>
        </Popover>
        {comment.author.is_post_author && (
          <Popover withArrow arrowSize={12}>
            <Popover.Target>
              <Badge
                size="xs"
                variant="gradient"
                gradient={{ from: "grape", to: "violet", deg: 90 }}
              >
                op
              </Badge>
            </Popover.Target>
            <Popover.Dropdown>
              <Text maw={300}>
                Original Poster: The user who created the post that this comment
                belongs to.
              </Text>
            </Popover.Dropdown>
          </Popover>
        )}
        {settings.showYouBadge && comment.author.is_current_user && (
          <Popover withArrow arrowSize={12}>
            <Popover.Target>
              <Badge
                size="xs"
                variant="gradient"
                gradient={{ from: "grape", to: "violet", deg: 90 }}
              >
                you
              </Badge>
            </Popover.Target>
            <Popover.Dropdown>
              <Text maw={300}>
                You created this comment. You can hide this badge through
                settings.
              </Text>
            </Popover.Dropdown>
          </Popover>
        )}
      </Group>

      <Timestamp date={comment.created_at} />
    </Group>
  );
}

export function CommentBody({ comment }: { comment: Commment }) {
  return (
    <Spoiler
      showLabel="Show more"
      hideLabel="Show less"
      style={{ flex: 1 }}
      maxHeight={50}
      styles={{
        control: {
          textAlign: "right",
          width: "100%",
        },
      }}
    >
      <Text ta="justify">{comment.comment}</Text>
    </Spoiler>
  );
}

export function CommentFooter({
  comment,
  onToggleReplies,
  showReplies,
  onReplyTo,
  onReaction,
  reactionLoading,
}: {
  comment: Commment;
  onToggleReplies?: () => void;
  showReplies?: boolean;
  onReplyTo?: (id: number | string) => void;
  onReaction?: (reaction?: ReactionValue) => Promise<void>;
  reactionLoading?: boolean;
}) {
  function handleReplyTo() {
    onReplyTo?.(comment.id);
  }

  return (
    <Group justify="space-between">
      <Group gap="xs">
        <ReactButton
          reaction="Upvote"
          total={comment.reactions.total.upvotes}
          user={comment.reactions.user?.reaction}
          iconSize={18}
          textSize="sm"
          onClick={onReaction}
          loading={reactionLoading}
        />
        <ReactButton
          reaction="Downvote"
          total={comment.reactions.total.downvotes}
          user={comment.reactions.user?.reaction}
          iconSize={18}
          textSize="sm"
          onClick={onReaction}
          loading={reactionLoading}
        />
        <Tooltip label="Reply to this comment">
          <UnstyledButton onClick={handleReplyTo}>
            <IconBubblePlus size={16} />
          </UnstyledButton>
        </Tooltip>
      </Group>

      <Group gap="xs">
        {comment.replies.count > 0 && (
          <UnstyledButton onClick={onToggleReplies}>
            <Text size="sm" c="dimmed" component="span">
              <AnimatePresence mode="wait">
                <motion.span
                  key={showReplies ? "hide" : "show"}
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  transition={{ duration: 0.15 }}
                  style={{ display: "inline-block" }}
                >
                  {showReplies ? "Hide" : "Show"}
                </motion.span>
              </AnimatePresence>{" "}
              {comment.replies.count}{" "}
              {comment.replies.count === 1 ? "reply" : "replies"}
            </Text>
          </UnstyledButton>
        )}
        <Badge
          size="sm"
          variant="gradient"
          gradient={{ from: "grape", to: "violet", deg: 90 }}
        >
          !{comment.id}
        </Badge>
      </Group>
    </Group>
  );
}

export const Comment = memo(function Comment({
  comment,
  onReplyTo,
}: {
  comment: Commment;
  onReplyTo?: (id: number | string) => void;
}) {
  const [showReplies, setShowReplies] = useState(false);
  const reactToComment = useReactToComment();

  async function handleReaction(reaction?: ReactionValue) {
    try {
      await reactToComment.mutateAsync({
        postId: comment.post_id,
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
    <Stack gap="xs" maw={512} w="98%">
      <Paper withBorder p="xs">
        <Stack gap={5}>
          <CommentHeader comment={comment} />
          <CommentBody comment={comment} />
          <CommentFooter
            comment={comment}
            onToggleReplies={() => {
              setShowReplies(!showReplies);
            }}
            showReplies={showReplies}
            onReplyTo={onReplyTo}
            onReaction={handleReaction}
            reactionLoading={reactToComment.isPending}
          />
        </Stack>
      </Paper>

      <AnimatePresence>
        {showReplies && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            <Box pl="md">
              <InfiniteScrolling
                useQuery={useReplies}
                queryArgs={[comment.post_id, comment.id]}
                name="replies"
                Component={({ data }) => (
                  <Comment comment={data} onReplyTo={onReplyTo} />
                )}
              />
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
    </Stack>
  );
});
