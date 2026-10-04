import type { Ban } from "@/models/app/Ban";
import type { ApiResponse, PaginatedResponse } from "@/utils/response";
import axios from "axios";

export interface FetchBansParams {
  pending_review?: boolean;
}

export async function fetchBans(
  page: number | string,
  params: FetchBansParams = {},
) {
  const queryParams = new URLSearchParams();
  queryParams.append("page", String(page));
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined) {
      continue;
    }

    queryParams.append(key, String(value));
  }

  const { data } = await axios.get<PaginatedResponse<Ban>>(
    `/api/app/bans?${queryParams.toString()}`,
  );

  return data;
}

export async function fetchUserBans(
  page: number | string,
  { userId }: { userId: number | string },
) {
  const { data } = await axios.get<PaginatedResponse<Ban>>(
    `/api/app/users/${String(userId)}/bans?page=${String(page)}`,
  );

  return data;
}

export async function banUser({
  userId,
  reason,
  expires_at,
  notes,
}: {
  userId: number | string;
  reason: string;
  expires_at?: string | null;
  notes?: string;
}) {
  const { data } = await axios.post<{ data: Ban }>(
    `/api/app/users/${String(userId)}/bans`,
    { reason, expires_at, notes },
  );

  return data.data;
}

export async function unbanUser({ userId }: { userId: number | string }) {
  const {
    data: { message },
  } = await axios.post<ApiResponse>(`/api/app/users/${String(userId)}/unban`);

  return { message };
}

export async function closeBanThread({ banId }: { banId: number | string }) {
  const {
    data: { message },
  } = await axios.post<ApiResponse>(
    `/api/app/bans/${String(banId)}/thread/close`,
  );

  return { message };
}

export async function reopenBanThread({ banId }: { banId: number | string }) {
  const {
    data: { message },
  } = await axios.post<ApiResponse>(
    `/api/app/bans/${String(banId)}/thread/reopen`,
  );

  return { message };
}
