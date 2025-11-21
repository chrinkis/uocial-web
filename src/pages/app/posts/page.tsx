import { Paper, Stack, Text, useMantineTheme } from "@mantine/core";
import { Post } from "@/components/app/posts/Post";
import { usePost, usePosts } from "@/queries/app/post/post";
import { PostCreate } from "@/components/app/posts/PostCreate";
import { InfiniteScrolling } from "@/components/InfiniteScrolling";
import { useSearchParams } from "react-router";
import invariant from "tiny-invariant";
import { notifications } from "@mantine/notifications";
import { getErrorMessage } from "@/utils/error";
import { IconExclamationCircle } from "@tabler/icons-react";
import { PostSkeleton } from "@/components/app/posts/PostSkeleton";

function SharedPost({ postId }: { postId: number | string }) {
  const theme = useMantineTheme();
  const { data: post, isLoading, error } = usePost(postId);

  if (isLoading) {
    return <PostSkeleton />;
  }

  if (error) {
    notifications.show({
      title: `Couldn't fetch post with id #${String(postId)}`,
      message: getErrorMessage(error),
      color: "red",
    });

    return (
      <Paper withBorder p="md" style={{ borderColor: theme.colors.red[8] }}>
        <Stack align="center">
          <IconExclamationCircle size={40} color={theme.colors.red[8]} />
          <Text>Failed to load the shared post.</Text>
        </Stack>
      </Paper>
    );
  }

  invariant(post);

  return <Post post={post} highlight />;
}

export default function Page() {
  const [searchParams] = useSearchParams();
  const sharedPostId = searchParams.get("postId");

  return (
    <Stack align="safe center" w="100%">
      <PostCreate />

      {sharedPostId && <SharedPost postId={sharedPostId} />}

      <InfiniteScrolling
        useQuery={usePosts}
        name="posts"
        Component={({ data }) => <Post post={data} />}
        loader={<PostSkeleton />}
      />
    </Stack>
  );
}
