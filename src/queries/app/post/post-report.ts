import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { updatePostInAllCaches } from "./cache-utils";
import { fetchPostReports, reportPost } from "@/api/app/post/post-report";

export function usePostReports(
  postId: number,
  params?: { reviewed?: boolean },
) {
  return useInfiniteQuery({
    queryKey: ["post-reports", postId, params],
    queryFn: ({ pageParam }) => fetchPostReports(pageParam, { postId }, params),
    initialPageParam: 1,
    getNextPageParam: (lastResponse) => {
      if (lastResponse.meta.current_page < lastResponse.meta.last_page) {
        return lastResponse.meta.current_page + 1;
      }

      return undefined;
    },
  });
}

export function useReportPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      comment,
      postId,
    }: {
      comment?: string;
      postId: number | string;
    }) => reportPost({ comment, postId }),
    onSuccess: (_, variables) => {
      updatePostInAllCaches(queryClient, Number(variables.postId), {
        reported_by_the_user: true,
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
