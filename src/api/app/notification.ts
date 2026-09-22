import axios from "axios";

export async function fetchUnreadNotificationsCount() {
  const { data } = await axios.get<{ unread_count: number }>(
    "/api/app/notifications/unread-count",
  );

  return data.unread_count;
}
