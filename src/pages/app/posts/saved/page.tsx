import { Post } from "@/components/app/posts/Post";
import { useSavedPosts } from "@/queries/app/post/post";
import { InfiniteScrolling } from "@/components/InfiniteScrolling";
import { PostSkeleton } from "@/components/app/posts/PostSkeleton";
import { Box, Flex, Stack, Text } from "@mantine/core";
import { IconBookmarkOff } from "@tabler/icons-react";

function Fallback() {
  return (
    <Stack align="center">
      <IconBookmarkOff size={64} />
      <Text>You haven't saved any posts yet.</Text>
    </Stack>
  );
}

function Loader() {
  return (
    <Box w="100%" h="100%">
      <Flex w="100%" justify="center">
        <PostSkeleton />;
      </Flex>
    </Box>
  );
}

export default function Page() {
  return (
    <InfiniteScrolling
      useQuery={useSavedPosts}
      name="saved posts"
      Component={({ data }) => <Post post={data} />}
      loader={<Loader />}
      Fallback={Fallback}
    />
  );
}
