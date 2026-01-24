import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reviewPostReport } from "@/api/app/post/post-report";
import {
  updateInfiniteQueryItemWith,
  type InfiniteQueryData,
} from "@/utils/cache";
import type { PostReport } from "@/models/app/post/PostReport";
import type { ReportReviewValue } from "@/models/app/post/ReportReview";

export function useReviewPostReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      comment,
      postId,
      reportId,
      status,
    }: {
      comment?: string;
      postId: number | string;
      reportId: number | string;
      status?: ReportReviewValue;
    }) => reviewPostReport({ comment, postId, reportId, status }),
    onSuccess: (_, variables) => {
      const postId = Number(variables.postId);
      const reportId = Number(variables.reportId);

      // Optimistically update the report in post-reports cache for instant UI feedback
      const queries = queryClient.getQueryCache().getAll();
      queries.forEach((query) => {
        const [key, queryPostId] = query.queryKey;
        if (key === "post-reports" && queryPostId === postId) {
          queryClient.setQueryData<InfiniteQueryData<PostReport>>(
            query.queryKey,
            (oldData) =>
              updateInfiniteQueryItemWith(
                oldData,
                reportId,
                (report: PostReport): PostReport => ({
                  ...report,
                  user_review: variables.status,
                }),
              ),
          );
        }
      });

      // Mark all post-reports queries as stale without refetching immediately
      // They'll refetch fresh data when the user navigates to them
      void queryClient.invalidateQueries({
        queryKey: ["post-reports"],
        refetchType: "none",
      });

      // Invalidate trace queries for this post's comments
      void queryClient.invalidateQueries({
        queryKey: ["comment", "trace", String(variables.postId)],
        predicate: (query) => {
          return (
            query.queryKey[0] === "comment" &&
            query.queryKey[1] === "trace" &&
            String(query.queryKey[2]) === String(variables.postId)
          );
        },
      });
    },
  });
}
