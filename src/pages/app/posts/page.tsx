import { Stack } from "@mantine/core";
import { Post } from "@/components/app/posts/Post";
import { usePosts } from "@/queries/app/post/post";
import { PostCreate } from "@/components/app/posts/PostCreate";
import { InfiniteScrolling } from "@/components/InfiniteScrolling";
import { useSearchParams } from "react-router";
import { PostSkeleton } from "@/components/app/posts/PostSkeleton";

export default function Page() {
  const [searchParams] = useSearchParams();
  const sharedPostId = searchParams.get("postId");

  return (
    <Stack align="safe center" w="100%">
      <PostCreate />

      {sharedPostId && <Post.type.WithFetcher id={sharedPostId} highlight />}

      <InfiniteScrolling
        useQuery={usePosts}
        name="posts"
        Component={({ data }) => <Post post={data} />}
        loader={<PostSkeleton />}
      />
    </Stack>
  );
}
