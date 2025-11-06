import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchComments, fetchReplies } from "@/api/app/post/comment";

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
