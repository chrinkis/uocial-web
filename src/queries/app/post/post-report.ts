import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updatePostInAllCaches } from "./cache-utils";
import { reportPost } from "@/api/app/post/post-report";

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
    },
  });
}
