import { InfiniteScrolling } from "@/components/InfiniteScrolling";
import { useComments } from "@/queries/app/post/comment";
import type { Post } from "@/models/app/post/Post";
import { Comment } from "./Comment";
import { Stack, Box, Text } from "@mantine/core";
import { CommentCreate } from "./CommentCreate";
import { useState, useCallback, useMemo } from "react";
import { IconMessageCircleX } from "@tabler/icons-react";
import { CommentSkeleton } from "./CommentSkeleton";

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
  const [replyTo, setReplyTo] = useState<number | string | null>(null);

  const handleReplyTo = useCallback((id: number | string) => {
    setReplyTo(id);
  }, []);

  const handleClearReply = useCallback(() => {
    setReplyTo(null);
  }, []);

  const CommentComponent = useMemo(
    () =>
      ({ data }: { data: any }) => (
        <Comment comment={data} onReplyTo={handleReplyTo} />
      ),
    [handleReplyTo],
  );

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
