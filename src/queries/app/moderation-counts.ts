import { useQuery, type QueryClient } from "@tanstack/react-query";
import { fetchModerationCounts } from "@/api/app/moderation-counts";

export const MODERATION_COUNTS_QUERY_KEY = ["moderation-counts"] as const;

export function useModerationCounts(enabled: boolean) {
  return useQuery({
    queryKey: MODERATION_COUNTS_QUERY_KEY,
    queryFn: fetchModerationCounts,
    enabled,
    refetchInterval: 30_000,
  });
}

export function invalidateModerationCounts(queryClient: QueryClient) {
  void queryClient.invalidateQueries({
    queryKey: MODERATION_COUNTS_QUERY_KEY,
  });
}
