import axios from "axios";
import type { Notification } from "@/models/Notification";
import type { PaginatedResponse } from "@/utils/response";

export async function fetchUnreadNotificationsCount() {
  const { data } = await axios.get<{ unread_count: number }>(
    "/api/app/notifications/unread-count",
  );

  return data.unread_count;
}

export async function fetchNotifications(page: number | string) {
  const { data } = await axios.get<PaginatedResponse<Notification>>(
    `/api/app/notifications?page=${String(page)}`,
  );

  return data;
}

export async function markNotificationRead(id: number) {
  const {
    data: { message },
  } = await axios.post<{ message: string }>(
    `/api/app/notifications/${String(id)}/read`,
  );

  return { message };
}

export async function markAllNotificationsRead() {
  const {
    data: { message },
  } = await axios.post<{ message: string }>("/api/app/notifications/read-all");

  return { message };
}
