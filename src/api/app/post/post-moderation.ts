import type { ModerationAction } from "@/models/app/post/ModerationAction";
import axios from "axios";

export async function moderatePost({
  comment,
  postId,
  action,
}: {
  comment?: string;
  postId: number | string;
  action: ModerationAction;
}) {
  const {
    data: { message },
  } = await axios.post<{
    message: string;
  }>(`/api/app/posts/${String(postId)}/moderations`, {
    comment,
    action,
  });

  return {
    message,
  };
}
