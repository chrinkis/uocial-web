import { Loader, Stack, Text, Title } from "@mantine/core";
import { Comment } from "./Comment";
import { useTraceComment } from "@/queries/app/post/comment-moderation";
import invariant from "tiny-invariant";
import { IconExclamationCircle } from "@tabler/icons-react";
import { getErrorMessage } from "@/utils/error";

export function CommentTrace({
  postId,
  commentId,
}: {
  commentId: string | number;
  postId: string | number;
}) {
  const query = useTraceComment(postId, commentId);

  if (query.isLoading) {
    return <Loader />;
  }

  if (query.error) {
    return (
      <Stack w="100%" h="100%" align="center">
        <Title order={2}>Something went wrong</Title>
        <IconExclamationCircle size={128} />
        <Text>{getErrorMessage(query.error)}</Text>
      </Stack>
    );
  }

  invariant(query.data);

  return (
    <Stack>
      {query.data.trace.map((comment) => (
        <Comment comment={comment} key={comment.id} />
      ))}
    </Stack>
  );
}
