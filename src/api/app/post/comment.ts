import axios from "axios";
import type { PaginatedResponse } from "@/utils/response";
import type { Commment } from "@/models/app/post/Comment";

export async function fetchComment(
  page: number | string,
  { postId }: { postId: number | string },
) {
  const { data } = await axios.get<PaginatedResponse<Commment>>(
    `/api/app/posts/${String(postId)}/comments?page=${String(page)}`,
  );

  return data;
}
