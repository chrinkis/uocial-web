import type { CommentReport } from "@/models/app/post/CommentReport";
import type { ReportReviewValue } from "@/models/app/post/ReportReview";
import type { PaginatedResponse } from "@/utils/response";
import axios from "axios";

export async function fetchCommentReports(
  page: number | string,
  { postId, commentId }: { postId: number; commentId: number },
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

  const { data } = await axios.get<PaginatedResponse<CommentReport>>(
    `/api/app/posts/${String(postId)}/comments/${String(commentId)}/reports?${queryParams.toString()}`,
  );

  return data;
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
  }>(`/api/app/posts/${String(postId)}/comments/${String(commentId)}/reports`, {
    comment,
  });

  return {
    message,
  };
}

export async function reviewCommentReport({
  comment,
  postId,
  commentId,
  reportId,
  status,
}: {
  comment?: string;
  commentId: string | number;
  postId: number | string;
  reportId: number | string;
  status?: ReportReviewValue;
}) {
  const {
    data: { message },
  } = await axios.post<{
    message: string;
  }>(
    `/api/app/posts/${String(postId)}/comments/${String(commentId)}/reports/${String(reportId)}/reviews`,
    {
      comment,
      status,
    },
  );

  return {
    message,
  };
}
