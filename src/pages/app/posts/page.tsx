import { Button, Loader, Stack } from "@mantine/core";
import { Post } from "@/components/app/posts/Post";
import { notifications } from "@mantine/notifications";
import { getErrorMessage } from "@/utils/error";
import { usePosts } from "@/queries/app/post/post";

export default function Page() {
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = usePosts();

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    notifications.show({
      title: "Couldn't fetch posts",
      message: getErrorMessage(error),
      color: "red",
    });
  }

  return (
    <Stack align="safe center" w="100%">
      {data?.pages.map((page) =>
        page.data.map((p) => <Post post={p} key={p.id} />),
      )}
      {hasNextPage && (
        <Button
          variant="light"
          onClick={() => void fetchNextPage()}
          loading={isFetchingNextPage}
        >
          Load More
        </Button>
      )}
    </Stack>
  );
}
