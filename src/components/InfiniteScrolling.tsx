import { useEffect, useState } from "react";
import {
  Button,
  Loader,
  Stack,
  type MantineSpacing,
  Text,
  Group,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { getErrorMessage } from "@/utils/error";
import type {
  UseInfiniteQueryResult,
  InfiniteData,
} from "@tanstack/react-query";
import type { PaginatedResponse } from "@/utils/response";
import type { ComponentType, ReactElement } from "react";
import { IconMoodEmpty } from "@tabler/icons-react";

export function InfiniteScrolling<
  T extends { id: number },
  TArgs extends unknown[],
>({
  useQuery,
  queryArgs,
  name,
  Component,
  Fallback,
  loader = <Loader />,
  filter,
  gap,
  reversed = false,
}: {
  useQuery: (
    ...args: TArgs
  ) => UseInfiniteQueryResult<InfiniteData<PaginatedResponse<T>>>;
  queryArgs?: TArgs;
  name: string;
  Component: React.ComponentType<{ data: T }>;
  Fallback: ComponentType | string;
  loader?: ReactElement;
  filter?: (element: T) => boolean;
  gap?: MantineSpacing;
  /**
   * Renders the newest elements at the bottom. Expects the query to return the
   * newest elements first. "Load More" is shown at the top, for older ones.
   */
  reversed?: boolean;
}) {
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useQuery(...(queryArgs ?? ([] as unknown as TArgs)));

  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    // Double requestAnimationFrame ensures loader is painted before heavy render
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setShouldRender(true);
      });
    });
  }, []);

  if (isLoading || !shouldRender) {
    return (
      <Stack align="safe center" w="100%" h="100%" gap={gap}>
        {loader}
      </Stack>
    );
  }

  if (error) {
    notifications.show({
      title: `Couldn't fetch ${name}`,
      message: getErrorMessage(error),
      color: "red",
    });
  }

  const displayPages = filter
    ? data?.pages.map((page) => ({ ...page, data: page.data.filter(filter) }))
    : data?.pages;

  if (!displayPages?.some((page) => page.data.length > 0)) {
    switch (typeof Fallback) {
      case "string":
        return (
          <Group align="center" gap="xs" p="md">
            <IconMoodEmpty color="var(--mantine-color-dimmed)" />
            <Text c="dimmed">{Fallback}</Text>
          </Group>
        );
      default:
        return <Fallback />;
    }
  }

  const elements = displayPages.flatMap((page) => page.data);
  if (reversed) {
    elements.reverse();
  }

  const loadMore = hasNextPage && (
    <Button
      variant="light"
      onClick={() => void fetchNextPage()}
      loading={isFetchingNextPage}
    >
      Load More
    </Button>
  );

  return (
    <Stack align="safe center" w="100%" gap={gap}>
      {reversed && loadMore}
      {elements.map((data: T) => (
        <Component data={data} key={data.id} />
      ))}
      {!reversed && loadMore}
    </Stack>
  );
}
