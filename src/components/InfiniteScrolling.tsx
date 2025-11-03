import { Button, Loader, Stack } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { getErrorMessage } from "@/utils/error";
import type {
  UseInfiniteQueryResult,
  InfiniteData,
} from "@tanstack/react-query";
import type { PaginatedResponse } from "@/utils/response";

export function InfiniteScrolling<
  T extends { id: number },
  TArgs extends unknown[],
>({
  useQuery,
  queryArgs,
  name,
  Component,
}: {
  useQuery: (
    ...args: TArgs
  ) => UseInfiniteQueryResult<InfiniteData<PaginatedResponse<T>>>;
  queryArgs?: TArgs;
  name: string;
  Component: React.ComponentType<{ data: T }>;
}) {
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useQuery(...(queryArgs ?? ([] as unknown as TArgs)));

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    notifications.show({
      title: `Couldn't fetch ${name}`,
      message: getErrorMessage(error),
      color: "red",
    });
  }

  return (
    <Stack align="safe center" w="100%">
      {data?.pages.map((page: PaginatedResponse<T>) =>
        page.data.map((data: T) => <Component data={data} key={data.id} />),
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
