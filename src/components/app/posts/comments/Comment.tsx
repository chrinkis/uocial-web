import { useState, memo, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Timestamp } from "@/components/Timestamp";
import type { Commment as PostComment } from "@/models/app/post/Comment";
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
  Button,
  Textarea,
} from "@mantine/core";
import { ReactButton } from "../ReactButton";
import { InfiniteScrolling } from "@/components/InfiniteScrolling";
import { useReplies, useReactToComment } from "@/queries/app/post/comment";
import { IconBubblePlus } from "@tabler/icons-react";
import { useSettings } from "@/providers/settings/hook";
import { notifications } from "@mantine/notifications";
import { getErrorMessage, type LaravelValidationResponse } from "@/utils/error";
import type { ReactionValue } from "@/models/app/post/Reaction";
import { CommentSkeleton } from "./CommentSkeleton";
import { useModals } from "@/providers/modals/hook";
import { CommentOptions } from "./CommentOptions";
import { isModerator } from "@/utils/user";
import { useUser } from "@/providers/user/hook";
import invariant from "tiny-invariant";
import type { ModerationAction } from "@/models/app/post/ModerationAction";
import { useForm } from "@mantine/form";
import { useGetNumberOfReplies } from "@/utils/app/post/comment";
import { useModerateComment } from "@/queries/app/post/comment-moderation";
import axios from "axios";
import { Reports } from "./reports/Reports";
import { Post } from "../Post";
import { CommentTrace } from "./CommentTrace";

export function CommentHeader({ comment }: { comment: PostComment }) {
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

export function CommentBody({ comment }: { comment: PostComment }) {
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
      <Text ta="justify" style={{ whiteSpace: "pre-line" }}>
        {comment.comment}
      </Text>
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
  comment: PostComment;
  onToggleReplies?: () => void;
  showReplies?: boolean;
  onReplyTo?: (id: number | string) => void;
  onReaction?: (reaction?: ReactionValue) => Promise<void>;
  reactionLoading?: boolean;
}) {
  const numberOfReplies = useGetNumberOfReplies(comment);

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
        {numberOfReplies > 0 && (
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
              {numberOfReplies} {numberOfReplies === 1 ? "reply" : "replies"}
            </Text>
          </UnstyledButton>
        )}

        <Popover withArrow arrowSize={12}>
          <Popover.Target>
            <Badge
              size="sm"
              variant="gradient"
              gradient={{ from: "grape", to: "violet", deg: 90 }}
            >
              !{comment.id}
            </Badge>
          </Popover.Target>
          <Popover.Dropdown>
            <Text maw={300}>Each comment has a unique id.</Text>
          </Popover.Dropdown>
        </Popover>
      </Group>
    </Group>
  );
}

function PostCommentModerationTraceButton({
  comment,
}: {
  comment: PostComment;
}) {
  const modals = useModals();

  function handleClick() {
    modals.open({
      title: `Trace for comment !${String(comment.id)}`,
      children: (
        <CommentTrace commentId={comment.id} postId={comment.post_id} />
      ),
    });
  }

  return (
    <Button bg="blue" onClick={handleClick} size="xs" flex={1}>
      Trace
    </Button>
  );
}

function PostCommentModerationOpenPostButton({
  comment,
}: {
  comment: PostComment;
}) {
  const modals = useModals();

  function handleClick() {
    modals.open({
      title: `Post of comment !${String(comment.id)}`,
      children: <Post.type.WithFetcher id={comment.post_id} w="100%" />,
    });
  }

  return (
    <Button bg="blue" onClick={handleClick} size="xs" flex={1}>
      Open Post
    </Button>
  );
}

function PostCommentModerationReportsButton({
  comment,
}: {
  comment: PostComment;
}) {
  const modals = useModals();

  function handleClick() {
    modals.open({
      centered: true,
      title: `Reports of !${String(comment.id)}`,
      children: <Reports comment={comment} />,
    });
  }

  return (
    <Button bg="orange" fullWidth onClick={handleClick} size="xs">
      Reports ({comment.moderation?.reports.total})
    </Button>
  );
}

function PostCommentModerationActionForm({
  postId,
  commentId,
  onSuccess,
  action,
}: {
  postId: number | string;
  commentId: number | string;
  onSuccess?: () => void;
  action: ModerationAction;
}) {
  const moderateComment = useModerateComment();
  const form = useForm({
    mode: "controlled",
    initialValues: {
      comment: action === "hide" ? "" : "Comment doesn't violate any term.",
    },
  });

  const handleSubmit = form.onSubmit(async (values) => {
    try {
      const { message } = await moderateComment.mutateAsync({
        postId,
        commentId,
        comment: values.comment,
        action,
      });

      notifications.show({
        title: "Success",
        message: message,
      });

      onSuccess?.();
    } catch (error) {
      notifications.show({
        title: `Failed to ${action} comment`,
        message: getErrorMessage(error),
        color: "red",
      });

      if (!axios.isAxiosError(error) || !error.response) {
        return;
      }

      const data = error.response.data as LaravelValidationResponse | undefined;
      form.setErrors(data?.errors ?? {});
    }
  });

  return (
    <form onSubmit={handleSubmit}>
      <Stack>
        <Textarea
          minRows={5}
          autosize
          label="Comment"
          description={
            action === "hide"
              ? "Describe what is wrong with this comment."
              : undefined
          }
          placeholder={
            action === "hide"
              ? "Author uses hatefull speech for a University Student."
              : "Comment doesn't violate any term."
          }
          {...form.getInputProps("comment")}
          required
        />

        <Group justify="right">
          <Button type="submit" loading={form.submitting}>
            {action === "hide" ? "Hide" : "Unhide"} comment
          </Button>
        </Group>
      </Stack>
    </form>
  );
}

function PostCommentModerationActionButton({
  comment,
  action,
}: {
  comment: PostComment;
  action: ModerationAction;
}) {
  const modals = useModals();

  function handleHideClick() {
    const modalId = modals.open({
      title: `Hide comment !${String(comment.id)}`,
      children: (
        <PostCommentModerationActionForm
          postId={comment.post_id}
          commentId={comment.id}
          onSuccess={closeModal}
          action={action}
        />
      ),
      centered: true,
    });

    function closeModal() {
      modals.close(modalId);
    }
  }

  return (
    <Button
      bg={action === "hide" ? "red" : "green"}
      flex={1}
      disabled={
        !comment.moderation?.by_system &&
        (action === "hide"
          ? comment.moderation?.is_hidden
          : !comment.moderation?.is_hidden)
      }
      onClick={handleHideClick}
      size="xs"
    >
      {action === "hide" ? "Hide" : "Unhide"}
    </Button>
  );
}

function PostCommentModeration({ comment }: { comment: PostComment }) {
  return (
    <Stack gap="xs">
      <Group gap="xs">
        <PostCommentModerationOpenPostButton comment={comment} />
        <PostCommentModerationTraceButton comment={comment} />
      </Group>

      {comment.moderation?.reports.total ? (
        <PostCommentModerationReportsButton comment={comment} />
      ) : undefined}

      <Group gap="xs">
        <PostCommentModerationActionButton action="unhide" comment={comment} />
        <PostCommentModerationActionButton action="hide" comment={comment} />
      </Group>
    </Stack>
  );
}

export const Comment = memo(function Comment({
  comment,
  onReplyTo,
}: {
  comment: PostComment;
  onReplyTo?: (id: number | string) => void;
}) {
  const { user } = useUser();
  const { settings } = useSettings();
  const [showReplies, setShowReplies] = useState(false);
  const reactToComment = useReactToComment();
  const modals = useModals();

  function handleContextMenu(e: React.MouseEvent) {
    e.preventDefault();

    const id = modals.open({
      withCloseButton: false,
      centered: true,
      transitionProps: {
        transition: "fade",
        duration: 160,
        timingFunction: "linear",
      },
      children: (
        <CommentOptions comment={comment} onClose={closeOptionsModal} />
      ),
      size: "auto",
    });

    function closeOptionsModal() {
      modals.close(id);
    }
  }

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

  const renderReply = useCallback(
    ({ data }: { data: PostComment }) => (
      <Comment comment={data} onReplyTo={onReplyTo} />
    ),
    [onReplyTo],
  );

  invariant(user);

  return (
    <Stack gap="xs" maw={512} w="98%">
      <Paper withBorder p="xs" onContextMenu={handleContextMenu}>
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

          {isModerator(user) && settings.moderatorMode && (
            <PostCommentModeration comment={comment} />
          )}
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
                Component={renderReply}
                loader={<CommentSkeleton />}
                filter={
                  isModerator(user) && !settings.moderatorMode
                    ? (comment) => !comment.moderation?.is_hidden
                    : undefined
                }
              />
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
    </Stack>
  );
});
