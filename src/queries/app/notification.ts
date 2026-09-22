import { useQuery } from "@tanstack/react-query";
import { fetchUnreadNotificationsCount } from "@/api/app/notification";

export function useUnreadNotificationsCount(enabled: boolean) {
  return useQuery({
    queryKey: ["notifications", "unread-count"],
    queryFn: fetchUnreadNotificationsCount,
    enabled,
    refetchInterval: 30_000,
  });
}
