import axios from "axios";
import type { PaginatedResponse } from "@/utils/response";
import type { Commment } from "@/models/app/post/Comment";

export async function fetchComments(
  page: number | string,
  { postId }: { postId: number | string },
) {
  const { data } = await axios.get<PaginatedResponse<Commment>>(
    `/api/app/posts/${String(postId)}/comments?page=${String(page)}`,
  );

  return data;
}

export async function fetchReplies(
  page: number | string,
  {
    postId,
    commentId,
  }: { postId: number | string; commentId: number | string },
) {
  const { data } = await axios.get<PaginatedResponse<Commment>>(
    `/api/app/posts/${String(postId)}/comments/${String(commentId)}/replies?page=${String(page)}`,
  );

  return data;
}

export async function createComment({
  postId,
  comment,
  reply_to,
}: {
  postId: number | string;
  comment: string;
  reply_to?: number | string;
}) {
  const { data } = await axios.post<{
    message: string;
    comment: Commment;
  }>(`/api/app/posts/${String(postId)}/comments`, {
    comment,
    reply_to,
  });

  return data;
}
