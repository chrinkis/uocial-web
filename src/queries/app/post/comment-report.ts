import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { updateCommentInAllCaches } from "./cache-utils";
import {
  fetchCommentReports,
  reportComment,
} from "@/api/app/post/comment-report";

export function useCommentReports(
  postId: number,
  commentId: number,
  params?: { reviewed?: boolean },
) {
  return useInfiniteQuery({
    queryKey: ["comment-reports", postId, commentId, params],
    queryFn: ({ pageParam }) =>
      fetchCommentReports(pageParam, { postId, commentId }, params),
    initialPageParam: 1,
    getNextPageParam: (lastResponse) => {
      if (lastResponse.meta.current_page < lastResponse.meta.last_page) {
        return lastResponse.meta.current_page + 1;
      }

      return undefined;
    },
  });
}

export function useReportComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      comment,
      postId,
      commentId,
    }: {
      comment?: string;
      postId: number | string;
      commentId: number | string;
    }) => reportComment({ comment, postId, commentId }),
    onSuccess: (_, variables) => {
      updateCommentInAllCaches(
        queryClient,
        Number(variables.postId),
        Number(variables.commentId),
        { reported_by_the_user: true },
      );
    },
  });
}
