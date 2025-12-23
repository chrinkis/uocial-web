import type { PaginatedResponse } from "./response";

export interface InfiniteQueryData<T> {
  pages: PaginatedResponse<T>[];
  pageParams: unknown[];
}

export function updateInfiniteQueryItem<T extends { id: number }>(
  oldData: InfiniteQueryData<T> | undefined,
  itemId: number,
  updates: Partial<T>,
): InfiniteQueryData<T> | undefined {
  if (!oldData) return oldData;

  return {
    ...oldData,
    pages: oldData.pages.map((page) => ({
      ...page,
      data: page.data.map((item) =>
        item.id === itemId ? { ...item, ...updates } : item,
      ),
    })),
  };
}

export function updateInfiniteQueryItemWith<T extends { id: number }>(
  oldData: InfiniteQueryData<T> | undefined,
  itemId: number,
  updater: (item: T) => T,
): InfiniteQueryData<T> | undefined {
  if (!oldData) return oldData;

  return {
    ...oldData,
    pages: oldData.pages.map((page) => ({
      ...page,
      data: page.data.map((item) =>
        item.id === itemId ? updater(item) : item,
      ),
    })),
  };
}

export function addToInfiniteQuery<T>(
  oldData: InfiniteQueryData<T> | undefined,
  item: T,
): InfiniteQueryData<T> | undefined {
  if (!oldData) return oldData;

  return {
    ...oldData,
    pages: oldData.pages.map((page, index) =>
      index === 0
        ? {
            ...page,
            data: [item, ...page.data],
          }
        : page,
    ),
  };
}
