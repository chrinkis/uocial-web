import { Anchor, Breadcrumbs, Stack, Text } from "@mantine/core";
import { NavLink, useSearchParams } from "react-router";
import { Post } from "@/components/app/posts/Post";
import { useSearchPosts } from "@/queries/app/post/post";
import { InfiniteScrolling } from "@/components/InfiniteScrolling";
import { PostSkeleton } from "@/components/app/posts/PostSkeleton";
import { useUser } from "@/providers/user/hook";
import { useSettings } from "@/providers/settings/hook";
import { isModerator } from "@/utils/user";
import invariant from "tiny-invariant";

function NoSearchResults({ q }: { q: string }) {
  return (
    <Stack align="center" gap="xs" p="md">
      <Text c="dimmed">No posts found for &quot;{q}&quot;.</Text>
    </Stack>
  );
}

export default function Page() {
  const [searchParams] = useSearchParams();
  const q = (searchParams.get("q") ?? "").trim();
  const { user } = useUser();
  const {
    settings: { moderatorMode },
  } = useSettings();

  invariant(user);

  console.log(q);

  return (
    <Stack align="safe center" w="100%" h="100%">
      <Breadcrumbs>
        <Anchor component={NavLink} to="/app/posts">
          posts
        </Anchor>
        <Anchor>search</Anchor>
        {!!q && <Anchor>{q}</Anchor>}
      </Breadcrumbs>

      {q ? (
        <InfiniteScrolling
          useQuery={useSearchPosts}
          queryArgs={[
            isModerator(user) && moderatorMode
              ? { q, moderator_mode: moderatorMode }
              : { q },
          ]}
          name="posts"
          Component={({ data }) => <Post post={data} />}
          Fallback={() => <NoSearchResults q={q} />}
          loader={<PostSkeleton />}
        />
      ) : (
        <Text c="dimmed">Enter a search term to see results.</Text>
      )}
    </Stack>
  );
}
