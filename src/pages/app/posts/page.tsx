import { Stack } from "@mantine/core";
import { Post } from "@/components/app/posts/Post";
import { usePosts } from "@/queries/app/post/post";
import { CreatePost } from "@/components/app/posts/CreatePost";
import { InfiniteScrolling } from "@/components/InfiniteScrolling";

export default function Page() {
  return (
    <Stack align="safe center" w="100%">
      <CreatePost />
      <InfiniteScrolling
        useQuery={usePosts}
        name="posts"
        Component={({ data }) => <Post post={data} />}
      />
    </Stack>
  );
}
