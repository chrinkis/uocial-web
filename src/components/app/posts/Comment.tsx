import { useState, memo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Timestamp } from "@/components/Time";
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
import { useReplies } from "@/queries/app/post/comment";
import { IconBubblePlus } from "@tabler/icons-react";

export function CommentHeader({ comment }: { comment: Commment }) {
  return (
    <Group justify="space-between">
      <Popover withArrow arrowSize={12}>
        <Popover.Target>
          <Group gap={5} style={{ cursor: "pointer" }}>
            <Avatar size="sm" variant="light" color="violet" />
            <Text size="sm" c="dimmed" fw={700}>
              {readablePseudonym(comment.author.pseudonym)}
            </Text>
            {comment.author.is_post_author && (
              <Badge
                size="xs"
                variant="gradient"
                gradient={{ from: "grape", to: "violet", deg: 90 }}
              >
                op
              </Badge>
            )}
          </Group>
        </Popover.Target>
        <Popover.Dropdown>
          <Text maw={300}>
            This usernmae in this post reffers to the same user. It is picked by
            Uocial and not by the commenter. It may be reused on a different
            post for a different user.
          </Text>
        </Popover.Dropdown>
      </Popover>

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
}: {
  comment: Commment;
  onToggleReplies?: () => void;
  showReplies?: boolean;
  onReplyTo?: (id: number | string) => void;
}) {
  function handleReplyTo() {
    onReplyTo?.(comment.id);
  }

  return (
    <Group justify="space-between">
      <Group gap="xs">
        <ReactButton
          reaction="Upvote"
          total={comment.reactions.upvotes}
          user={comment.reactions.user?.reaction}
          iconSize={18}
          textSize="sm"
        />
        <ReactButton
          reaction="Downvote"
          total={comment.reactions.downvotes}
          user={comment.reactions.user?.reaction}
          iconSize={18}
          textSize="sm"
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

  return (
    <Stack gap="xs" maw={512} w="98%">
      <Paper withBorder p="xs">
        <Stack gap={5}>
          <CommentHeader comment={comment} />
          <CommentBody comment={comment} />
          <CommentFooter
            comment={comment}
            onToggleReplies={() => setShowReplies(!showReplies)}
            showReplies={showReplies}
            onReplyTo={onReplyTo}
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
