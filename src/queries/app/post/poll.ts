import { useMutation, useQueryClient } from "@tanstack/react-query";
import { unvotePoll, votePoll } from "@/api/app/post/poll";
import { updatePostInAllCachesWith } from "./cache-utils";

interface VotePollParams {
  postId: number | string;
  pollId: number | string;
  optionId: number | string;
}

export function useVotePoll() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, pollId, optionId }: VotePollParams) =>
      votePoll({ postId, pollId, optionId }),
    onSuccess: ({ poll }, variables) => {
      updatePostInAllCachesWith(
        queryClient,
        Number(variables.postId),
        (post) => ({
          ...post,
          poll,
        }),
      );
    },
  });
}

export function useUnvotePoll() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, pollId, optionId }: VotePollParams) =>
      unvotePoll({ postId, pollId, optionId }),
    onSuccess: ({ poll }, variables) => {
      updatePostInAllCachesWith(
        queryClient,
        Number(variables.postId),
        (post) => ({
          ...post,
          poll,
        }),
      );
    },
  });
}
