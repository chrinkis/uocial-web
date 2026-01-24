import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reviewCommentReport } from "@/api/app/post/comment-report";
import {
  updateInfiniteQueryItemWith,
  type InfiniteQueryData,
} from "@/utils/cache";
import type { CommentReport } from "@/models/app/post/CommentReport";
import type { ReportReviewValue } from "@/models/app/post/ReportReview";

export function useReviewCommentReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      comment,
      postId,
      commentId,
      reportId,
      status,
    }: {
      comment?: string;
      postId: number | string;
      commentId: number | string;
      reportId: number | string;
      status?: ReportReviewValue;
    }) => reviewCommentReport({ comment, postId, commentId, reportId, status }),
    onSuccess: (_, variables) => {
      const postId = Number(variables.postId);
      const commentId = Number(variables.commentId);
      const reportId = Number(variables.reportId);

      const queries = queryClient.getQueryCache().getAll();
      queries.forEach((query) => {
        const [key, queryPostId, queryCommentId] = query.queryKey;
        if (
          key === "comment-reports" &&
          queryPostId === postId &&
          queryCommentId === commentId
        ) {
          queryClient.setQueryData<InfiniteQueryData<CommentReport>>(
            query.queryKey,
            (oldData) =>
              updateInfiniteQueryItemWith(
                oldData,
                reportId,
                (report: CommentReport): CommentReport => ({
                  ...report,
                  user_review: variables.status,
                }),
              ),
          );
        }
      });

      void queryClient.invalidateQueries({
        queryKey: ["comment-reports"],
        refetchType: "none",
      });

      // Invalidate trace for this specific comment
      void queryClient.invalidateQueries({
        queryKey: [
          "comment",
          "trace",
          String(variables.postId),
          String(variables.commentId),
        ],
      });
    },
  });
}
