import type { ModerationAction } from "@/models/app/post/ModerationAction";
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
