import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  banUser,
  closeBanThread,
  fetchBans,
  fetchUserBans,
  reopenBanThread,
  unbanUser,
  type FetchBansParams,
} from "@/api/app/ban";
import type { Ban } from "@/models/app/Ban";
import {
  updateInfiniteQueryItemWith,
  type InfiniteQueryData,
} from "@/utils/cache";
import { invalidateModerationCounts } from "./moderation-counts";

export const BAN_QUERY_KEYS = {
  all: ["bans"] as const,
  list: (params?: FetchBansParams) => ["bans", "list", params] as const,
  user: (userId: number | string) => ["bans", "user", String(userId)] as const,
};

export function useBans(params?: FetchBansParams) {
  return useInfiniteQuery({
    queryKey: BAN_QUERY_KEYS.list(params),
    queryFn: ({ pageParam }) => fetchBans(pageParam, params),
    initialPageParam: 1,
    getNextPageParam: (lastResponse) => {
      if (lastResponse.meta.current_page < lastResponse.meta.last_page) {
        return lastResponse.meta.current_page + 1;
      }

      return undefined;
    },
  });
}

export function useUserBans(userId: number | string) {
  return useInfiniteQuery({
    queryKey: BAN_QUERY_KEYS.user(userId),
    queryFn: ({ pageParam }) => fetchUserBans(pageParam, { userId }),
    initialPageParam: 1,
    getNextPageParam: (lastResponse) => {
      if (lastResponse.meta.current_page < lastResponse.meta.last_page) {
        return lastResponse.meta.current_page + 1;
      }

      return undefined;
    },
  });
}

export function useBanUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: banUser,
    onSuccess: () => {
      invalidateModerationCounts(queryClient);
      void queryClient.invalidateQueries({ queryKey: BAN_QUERY_KEYS.all });
    },
  });
}

export function useUnbanUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: unbanUser,
    onSuccess: () => {
      invalidateModerationCounts(queryClient);
      void queryClient.invalidateQueries({ queryKey: BAN_QUERY_KEYS.all });
    },
  });
}

export function useSetBanThreadClosed() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      banId,
      closed,
    }: {
      banId: number | string;
      closed: boolean;
    }) => (closed ? closeBanThread({ banId }) : reopenBanThread({ banId })),
    onSuccess: (_, variables) => {
      invalidateModerationCounts(queryClient);

      const banId = Number(variables.banId);

      queryClient
        .getQueryCache()
        .findAll({ queryKey: BAN_QUERY_KEYS.all })
        .forEach((query) => {
          queryClient.setQueryData<InfiniteQueryData<Ban>>(
            query.queryKey,
            (oldData) =>
              updateInfiniteQueryItemWith(oldData, banId, (ban) =>
                ban.admin
                  ? {
                      ...ban,
                      admin: { ...ban.admin, thread_closed: variables.closed },
                    }
                  : ban,
              ),
          );
        });

      // Keep the item visible so the action can be undone; lists refresh later.
      void queryClient.invalidateQueries({
        queryKey: BAN_QUERY_KEYS.all,
        refetchType: "none",
      });
    },
  });
}
