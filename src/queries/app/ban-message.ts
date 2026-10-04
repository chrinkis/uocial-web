import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { fetchBanMessages, sendBanMessage } from "@/api/app/ban-message";
import { addToInfiniteQuery, type InfiniteQueryData } from "@/utils/cache";
import type { BanMessage } from "@/models/app/BanMessage";
import { BAN_QUERY_KEYS } from "./ban";

export function banMessagesKey(banId: number | string) {
  return ["ban-messages", String(banId)] as const;
}

export function useBanMessages(banId: number | string) {
  return useInfiniteQuery({
    queryKey: banMessagesKey(banId),
    queryFn: ({ pageParam }) => fetchBanMessages(pageParam, { banId }),
    initialPageParam: 1,
    getNextPageParam: (lastResponse) => {
      if (lastResponse.meta.current_page < lastResponse.meta.last_page) {
        return lastResponse.meta.current_page + 1;
      }

      return undefined;
    },
  });
}

export function useSendBanMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sendBanMessage,
    onSuccess: (message, variables) => {
      // Messages are listed newest first, so the new one goes to the front.
      queryClient.setQueryData<InfiniteQueryData<BanMessage>>(
        banMessagesKey(variables.banId),
        (oldData) => addToInfiniteQuery(oldData, message),
      );

      // Whether a ban is pending review depends on who wrote the last message.
      void queryClient.invalidateQueries({
        queryKey: BAN_QUERY_KEYS.all,
        refetchType: "none",
      });
    },
  });
}
