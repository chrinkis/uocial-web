import type { Commment } from "@/models/app/post/Comment";
import type { ModerationAction } from "@/models/app/post/ModerationAction";
import type { ApiResponse } from "@/utils/response";
import axios from "axios";

export async function moderateComment({
  comment,
  postId,
  commentId,
  action,
}: {
  comment?: string;
  postId: number | string;
  commentId: number | string;
  action: ModerationAction;
}) {
  const {
    data: { message },
  } = await axios.post<{
    message: string;
  }>(
    `/api/app/posts/${String(postId)}/comments/${String(commentId)}/moderations`,
    {
      comment,
      action,
    },
  );

  return {
    message,
  };
}

export async function traceComment({
  postId,
  commentId,
}: {
  postId: number | string;
  commentId: number | string;
}) {
  const { data } = await axios.get<ApiResponse & { trace: Commment[] }>(
    `/api/app/posts/${String(postId)}/comments/${String(commentId)}/trace`,
  );

  return data;
}
