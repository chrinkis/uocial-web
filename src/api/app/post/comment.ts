import axios from "axios";
import type { PaginatedResponse } from "@/utils/response";
import type { Commment } from "@/models/app/post/Comment";
import type { ReactionValue } from "@/models/app/post/Reaction";
import type { PostReactions } from "@/models/app/post/PostReactions";

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

export async function reactToComment({
  reaction,
  postId,
  commentId,
}: {
  reaction?: ReactionValue;
  postId: number;
  commentId: number;
}) {
  const {
    data: { message, reactions },
  } = await axios.post<{
    message: string;
    reactions: PostReactions;
  }>(`/api/app/posts/${String(postId)}/comments/${String(commentId)}/react`, {
    reaction,
  });

  return {
    message,
    reactions,
  };
}

export async function reportComment({
  comment,
  postId,
  commentId,
}: {
  comment?: string;
  postId: number | string;
  commentId: number | string;
}) {
  const {
    data: { message },
  } = await axios.post<{
    message: string;
  }>(`/api/app/posts/${String(postId)}/comments/${String(commentId)}/report`, {
    comment,
  });

  return {
    message,
  };
}
