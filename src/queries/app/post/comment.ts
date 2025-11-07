import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  fetchComments,
  fetchReplies,
  createComment,
} from "@/api/app/post/comment";
import type { Commment } from "@/models/app/post/Comment";
import type { PaginatedResponse } from "@/utils/response";
import type { Post } from "@/models/app/post/Post";

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
      if (variables.reply_to) {
        // Update replies query cache - add new reply
        queryClient.setQueryData<{
          pages: PaginatedResponse<Commment>[];
          pageParams: unknown[];
        }>(["replies", variables.postId, variables.reply_to], (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            pages: oldData.pages.map((page, index) =>
              index === 0
                ? {
                    ...page,
                    data: [comment, ...page.data],
                  }
                : page,
            ),
          };
        });

        // Update parent comment's reply count in comments cache
        queryClient.setQueryData<{
          pages: PaginatedResponse<Commment>[];
          pageParams: unknown[];
        }>(["comments", variables.postId], (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              data: page.data.map((c) =>
                c.id === variables.reply_to
                  ? {
                      ...c,
                      replies: {
                        ...c.replies,
                        count: c.replies.count + 1,
                      },
                    }
                  : c,
              ),
            })),
          };
        });

        // Update parent comment's reply count in ALL replies caches (for nested replies)
        const queries = queryClient.getQueryCache().getAll();
        queries.forEach((query) => {
          const [key, postId] = query.queryKey;
          if (key === "replies" && postId === variables.postId) {
            queryClient.setQueryData<{
              pages: PaginatedResponse<Commment>[];
              pageParams: unknown[];
            }>(query.queryKey, (oldData) => {
              if (!oldData) return oldData;

              return {
                ...oldData,
                pages: oldData.pages.map((page) => ({
                  ...page,
                  data: page.data.map((c) =>
                    c.id === variables.reply_to
                      ? {
                          ...c,
                          replies: {
                            ...c.replies,
                            count: c.replies.count + 1,
                          },
                        }
                      : c,
                  ),
                })),
              };
            });
          }
        });
      } else {
        // Update comments query cache
        queryClient.setQueryData<{
          pages: PaginatedResponse<Commment>[];
          pageParams: unknown[];
        }>(["comments", variables.postId], (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            pages: oldData.pages.map((page, index) =>
              index === 0
                ? {
                    ...page,
                    data: [comment, ...page.data],
                  }
                : page,
            ),
          };
        });

        // Update post's comment count in posts cache
        queryClient.setQueryData<{
          pages: PaginatedResponse<Post>[];
          pageParams: unknown[];
        }>(["posts"], (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              data: page.data.map((post) =>
                post.id === variables.postId
                  ? {
                      ...post,
                      comments: {
                        ...post.comments,
                        total: post.comments.total + 1,
                      },
                    }
                  : post,
              ),
            })),
          };
        });
      }
    },
  });
}
