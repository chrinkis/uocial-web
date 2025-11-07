import { InfiniteScrolling } from "@/components/InfiniteScrolling";
import { useComments } from "@/queries/app/post/comment";
import type { Post } from "@/models/app/post/Post";
import { Comment } from "./Comment";
import { Stack, Box } from "@mantine/core";
import { CommentCreate } from "./CommentCreate";
import { useState, useCallback, useMemo } from "react";

interface CommentsProps {
  post: Post;
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
    <Stack h="100%" justify="space-between">
      <Box style={{ overflow: "auto", flex: 1 }}>
        <InfiniteScrolling
          name="comments"
          useQuery={useComments}
          queryArgs={[post.id]}
          Component={CommentComponent}
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
