import type { BanMessage } from "@/models/app/BanMessage";
import type { PaginatedResponse } from "@/utils/response";
import axios from "axios";

export async function fetchBanMessages(
  page: number | string,
  { banId }: { banId: number | string },
) {
  const { data } = await axios.get<PaginatedResponse<BanMessage>>(
    `/api/app/bans/${String(banId)}/messages?page=${String(page)}`,
  );

  return data;
}

export async function sendBanMessage({
  banId,
  body,
}: {
  banId: number | string;
  body: string;
}) {
  const { data } = await axios.post<{ data: BanMessage }>(
    `/api/app/bans/${String(banId)}/messages`,
    { body },
  );

  return data.data;
}
