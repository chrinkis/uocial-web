import { Stack } from "@mantine/core";
import { Post } from "@/components/app/posts/Post";
import { usePosts } from "@/queries/app/post/post";
import { PostCreate } from "@/components/app/posts/PostCreate";
import { InfiniteScrolling } from "@/components/InfiniteScrolling";
import { useSearchParams } from "react-router";
import { PostSkeleton } from "@/components/app/posts/PostSkeleton";
import { useUser } from "@/providers/user/hook";
import { useSettings } from "@/providers/settings/hook";
import { isModerator } from "@/utils/user";
import invariant from "tiny-invariant";

export default function Page() {
  const [searchParams] = useSearchParams();
  const sharedPostId = searchParams.get("postId");
  const { user } = useUser();
  const {
    settings: { moderatorMode },
  } = useSettings();

  invariant(user);

  return (
    <Stack align="safe center" w="100%">
      <PostCreate />

      {sharedPostId && <Post.type.WithFetcher id={sharedPostId} highlight />}

      <InfiniteScrolling
        useQuery={usePosts}
        name="posts"
        Component={({ data }) => <Post post={data} />}
        loader={<PostSkeleton />}
        filter={
          isModerator(user) && !moderatorMode
            ? (post) => !post.moderation?.is_hidden
            : undefined
        }
      />
    </Stack>
  );
}
