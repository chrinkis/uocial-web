import axios from "axios";

export async function reportPost({
  comment,
  postId,
}: {
  comment?: string;
  postId: number | string;
}) {
  const {
    data: { message },
  } = await axios.post<{
    message: string;
  }>(`/api/app/posts/${String(postId)}/reports`, {
    comment,
  });

  return {
    message,
  };
}
