import { useMutation, useQueryClient } from "@tanstack/react-query";
import { moderateComment } from "@/api/app/post/comment-moderation";
import { updateCommentInAllCachesWith } from "./cache-utils";
import type { ModerationAction } from "@/models/app/post/ModerationAction";
import type { Commment } from "@/models/app/post/Comment";

export function useModerateComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      comment,
      postId,
      commentId,
      action,
    }: {
      comment?: string;
      postId: number | string;
      commentId: number | string;
      action: ModerationAction;
    }) => moderateComment({ comment, postId, commentId, action }),
    onSuccess: (_, variables) => {
      const postId = Number(variables.postId);
      const commentId = Number(variables.commentId);

      // Optimistically update all comment caches (lists + detail) for instant UI feedback
      updateCommentInAllCachesWith(
        queryClient,
        postId,
        commentId,
        (comment: Commment): Commment => ({
          ...comment,
          moderation: comment.moderation
            ? {
                ...comment.moderation,
                is_hidden: variables.action === "hide",
                is_auto_hidden: false,
              }
            : undefined,
        }),
      );

      // Mark all comment queries as stale without refetching immediately
      // They'll refetch fresh data when the user navigates to them
      void queryClient.invalidateQueries({
        queryKey: ["comments"],
        refetchType: "none",
      });
    },
  });
}
