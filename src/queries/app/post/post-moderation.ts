import { useMutation, useQueryClient } from "@tanstack/react-query";
import { moderatePost } from "@/api/app/post/post-moderation";
import { updatePostInAllCachesWith } from "./cache-utils";
import type { ModerationAction } from "@/models/app/post/ModerationAction";
import type { Post } from "@/models/app/post/Post";

export function useModeratePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      comment,
      postId,
      action,
    }: {
      comment?: string;
      postId: number | string;
      action: ModerationAction;
    }) => moderatePost({ comment, postId, action }),
    onSuccess: (_, variables) => {
      const postId = Number(variables.postId);

      // Optimistically update all post caches (lists + detail) for instant UI feedback
      updatePostInAllCachesWith(
        queryClient,
        postId,
        (post: Post): Post => ({
          ...post,
          moderation: post.moderation
            ? {
                ...post.moderation,
                is_hidden: variables.action === "hide",
                is_auto_hidden: false,
              }
            : undefined,
        }),
      );

      // Mark all post queries as stale without refetching immediately
      // They'll refetch fresh data when the user navigates to them
      void queryClient.invalidateQueries({
        queryKey: ["posts"],
        refetchType: "none",
      });
    },
  });
}
