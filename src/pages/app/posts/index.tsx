import * as post from "@/models/app/post/Post";
import { Button, Loader, Stack } from "@mantine/core";
import { Post } from "@/components/app/posts/Post";
import { useInfiniteQuery } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";
import { getErrorMessage } from "@/utils/error";

export default function Page() {
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["posts"],
    queryFn: ({ pageParam }) => post.fetchPage(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastResponse) => {
      if (lastResponse.meta.current_page < lastResponse.meta.last_page) {
        return lastResponse.meta.current_page + 1;
      }
      return undefined;
    },
  });

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
