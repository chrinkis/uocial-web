import { InfiniteScrolling } from "@/components/InfiniteScrolling";
import { useComments } from "@/queries/app/post/comment";
import type { Post } from "@/models/app/post/Post";
import { Comment } from "./Comment";
import { Stack, Box, Text } from "@mantine/core";
import { CommentCreate } from "./CommentCreate";
import { useState, useCallback, useMemo } from "react";
import { IconMessageCircleX } from "@tabler/icons-react";
import { CommentSkeleton } from "./CommentSkeleton";
import { isModerator } from "@/utils/user";
import { useUser } from "@/providers/user/hook";
import { useSettings } from "@/providers/settings/hook";
import invariant from "tiny-invariant";
import type { Commment } from "@/models/app/post/Comment";

interface CommentsProps {
  post: Post;
}

function EmptyCommentList() {
  return (
    <Stack align="center">
      <IconMessageCircleX size={40} color="var(--mantine-color-dimmed)" />
      <Text c="var(--mantine-color-dimmed)">No comments yet</Text>
    </Stack>
  );
}

export function Comments({ post }: CommentsProps) {
  const { user } = useUser();
  const { settings } = useSettings();
  const [replyTo, setReplyTo] = useState<number | string | null>(null);

  const handleReplyTo = useCallback((id: number | string) => {
    setReplyTo(id);
  }, []);

  const handleClearReply = useCallback(() => {
    setReplyTo(null);
  }, []);

  const CommentComponent = useMemo(
    () =>
      ({ data }: { data: Commment }) => (
        <Comment comment={data} onReplyTo={handleReplyTo} />
      ),
    [handleReplyTo],
  );

  invariant(user);

  return (
    <Stack h="100%" justify="space-between" align="center" w="100%">
      <Box style={{ overflow: "auto", flex: 1 }} w="100%">
        <InfiniteScrolling
          name="comments"
          useQuery={useComments}
          queryArgs={[post.id]}
          Component={CommentComponent}
          Fallback={EmptyCommentList}
          loader={<CommentSkeleton />}
          filter={
            isModerator(user) && !settings.moderatorMode
              ? (comment) => !comment.moderation?.is_hidden
              : undefined
          }
        />
      </Box>

      <CommentCreate
        postId={post.id}
        replyTo={replyTo}
        onClearReply={handleClearReply}
      />
    </Stack>
  );
}
