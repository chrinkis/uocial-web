import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  fetchNotifications,
  fetchUnreadNotificationsCount,
  markAllNotificationsRead,
  markNotificationRead,
} from "@/api/app/notification";
import type { Notification } from "@/models/Notification";
import { updateInfiniteQueryItem, type InfiniteQueryData } from "@/utils/cache";

const NOTIFICATION_QUERY_KEYS = {
  list: ["notifications", "list"],
  unreadCount: ["notifications", "unread-count"],
} as const;

export function useUnreadNotificationsCount(enabled: boolean) {
  return useQuery({
    queryKey: NOTIFICATION_QUERY_KEYS.unreadCount,
    queryFn: fetchUnreadNotificationsCount,
    enabled,
    refetchInterval: 30_000,
  });
}

export function useNotifications(enabled: boolean) {
  return useInfiniteQuery({
    queryKey: NOTIFICATION_QUERY_KEYS.list,
    queryFn: ({ pageParam }) => fetchNotifications(pageParam),
    initialPageParam: 1,
    enabled,
    getNextPageParam: (lastResponse) => {
      if (lastResponse.meta.current_page < lastResponse.meta.last_page) {
        return lastResponse.meta.current_page + 1;
      }

      return undefined;
    },
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: number }) => markNotificationRead(id),
    onSuccess: (_, { id }) => {
      queryClient.setQueryData<InfiniteQueryData<Notification>>(
        NOTIFICATION_QUERY_KEYS.list,
        (oldData) => updateInfiniteQueryItem(oldData, id, { read: true }),
      );

      void queryClient.invalidateQueries({
        queryKey: NOTIFICATION_QUERY_KEYS.unreadCount,
      });
    },
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAllNotificationsRead,
    onSuccess: () => {
      queryClient.setQueryData<InfiniteQueryData<Notification>>(
        NOTIFICATION_QUERY_KEYS.list,
        (oldData) =>
          oldData
            ? {
                ...oldData,
                pages: oldData.pages.map((page) => ({
                  ...page,
                  data: page.data.map((notification) => ({
                    ...notification,
                    read: true,
                  })),
                })),
              }
            : oldData,
      );

      void queryClient.invalidateQueries({
        queryKey: NOTIFICATION_QUERY_KEYS.unreadCount,
      });
    },
  });
}
