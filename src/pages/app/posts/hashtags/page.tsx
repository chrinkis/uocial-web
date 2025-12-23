import { Anchor, Breadcrumbs, Stack } from "@mantine/core";
import { Post } from "@/components/app/posts/Post";
import { usePosts } from "@/queries/app/post/post";
import { InfiniteScrolling } from "@/components/InfiniteScrolling";
import { PostSkeleton } from "@/components/app/posts/PostSkeleton";
import { NavLink, useParams } from "react-router";

export default function Page() {
  const { hashtag } = useParams();

  return (
    <Stack align="safe center" w="100%">
      <Breadcrumbs>
        <Anchor component={NavLink} to="/app/posts">
          posts
        </Anchor>
        <Anchor component={NavLink} to="">
          #{hashtag}
        </Anchor>
      </Breadcrumbs>

      <InfiniteScrolling
        useQuery={usePosts}
        queryArgs={[{ hashtag }]}
        name="posts"
        Component={({ data }) => <Post post={data} />}
        loader={<PostSkeleton />}
      />
    </Stack>
  );
}
