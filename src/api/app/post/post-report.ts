import type { PostReport } from "@/models/app/post/PostReport";
import type { PaginatedResponse } from "@/utils/response";
import axios from "axios";

export async function fetchPostReports(
  page: number | string,
  { postId }: { postId: number },
  params: { reviewed?: boolean } = {},
) {
  const queryParams = new URLSearchParams();
  queryParams.append("page", String(page));
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined) {
      continue;
    }

    queryParams.append(key, String(value));
  }

  const { data } = await axios.get<PaginatedResponse<PostReport>>(
    `/api/app/posts/${String(postId)}/reports?${queryParams.toString()}`,
  );

  return data;
}

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
