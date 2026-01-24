import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  fetchArbitaryComments,
  fetchComments,
  fetchReplies,
  createComment,
  reactToComment,
} from "@/api/app/post/comment";
import type { fetchCommentParams } from "@/api/app/post/comment";
import type { Commment } from "@/models/app/post/Comment";
import type { ReactionValue } from "@/models/app/post/Reaction";
import { addToInfiniteQuery, type InfiniteQueryData } from "@/utils/cache";
import {
  POST_QUERY_KEYS,
  updateCommentInAllCaches,
  incrementPostCommentCount,
  incrementCommentReplyCount,
} from "./cache-utils";
import { reportComment } from "@/api/app/post/comment-report";

export function useComments(postId: number) {
  return useInfiniteQuery({
    queryKey: ["comments", postId],
    queryFn: ({ pageParam }) => fetchComments(pageParam, { postId }),
    initialPageParam: 1,
    getNextPageParam: (lastResponse) => {
      if (lastResponse.meta.current_page < lastResponse.meta.last_page) {
        return lastResponse.meta.current_page + 1;
      }

      return undefined;
    },
  });
}

export function useArbitaryComments(params: fetchCommentParams = {}) {
  return useInfiniteQuery({
    queryKey: ["comments", "arbitrary", params],
    queryFn: ({ pageParam }) => fetchArbitaryComments(pageParam, params),
    initialPageParam: 1,
    getNextPageParam: (lastResponse) => {
      if (lastResponse.meta.current_page < lastResponse.meta.last_page) {
        return lastResponse.meta.current_page + 1;
      }

      return undefined;
    },
  });
}

export function useReplies(postId: number, commentId: number) {
  return useInfiniteQuery({
    queryKey: ["replies", postId, commentId],
    queryFn: ({ pageParam }) => fetchReplies(pageParam, { postId, commentId }),
    initialPageParam: 1,
    getNextPageParam: (lastResponse) => {
      if (lastResponse.meta.current_page < lastResponse.meta.last_page) {
        return lastResponse.meta.current_page + 1;
      }

      return undefined;
    },
  });
}

export function useCreateComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      postId,
      comment,
      reply_to,
    }: {
      postId: number | string;
      comment: string;
      reply_to?: number | string;
    }) => createComment({ postId, comment, reply_to }),
    onSuccess: ({ comment }, variables) => {
      const postId =
        typeof variables.postId === "number"
          ? variables.postId
          : Number(variables.postId);

      void queryClient.invalidateQueries({
        queryKey: ["comments", "arbitrary"],
      });

      // Invalidate trace queries for this post's comments
      void queryClient.invalidateQueries({
        queryKey: ["comment", "trace", String(postId)],
        predicate: (query) => {
          return (
            query.queryKey[0] === "comment" &&
            query.queryKey[1] === "trace" &&
            String(query.queryKey[2]) === String(postId)
          );
        },
      });

      if (variables.reply_to) {
        const replyToId =
          typeof variables.reply_to === "number"
            ? variables.reply_to
            : Number(variables.reply_to);

        queryClient.setQueryData<InfiniteQueryData<Commment>>(
          POST_QUERY_KEYS.replies(postId, replyToId),
          (oldData) => addToInfiniteQuery(oldData, comment),
        );

        incrementCommentReplyCount(queryClient, postId, replyToId, 1);
        incrementPostCommentCount(queryClient, postId, 1);
      } else {
        queryClient.setQueryData<InfiniteQueryData<Commment>>(
          POST_QUERY_KEYS.comments(postId),
          (oldData) => addToInfiniteQuery(oldData, comment),
        );

        incrementPostCommentCount(queryClient, postId, 1, comment);
      }
    },
  });
}

export function useReactToComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      reaction,
      postId,
      commentId,
    }: {
      reaction?: ReactionValue;
      postId: number;
      commentId: number;
    }) => reactToComment({ reaction, postId, commentId }),
    onSuccess: ({ reactions }, variables) => {
      void queryClient.invalidateQueries({
        queryKey: ["comments", "arbitrary"],
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

      updateCommentInAllCaches(
        queryClient,
        variables.postId,
        variables.commentId,
        {
          reactions,
        },
      );
    },
  });
}
