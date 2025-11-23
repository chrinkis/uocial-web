import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  fetchComments,
  fetchReplies,
  createComment,
  reactToComment,
  reportComment,
} from "@/api/app/post/comment";
import type { Commment } from "@/models/app/post/Comment";
import type { PaginatedResponse } from "@/utils/response";
import type { Post } from "@/models/app/post/Post";
import type { ReactionValue } from "@/models/app/post/Reaction";

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

        // Update individual post cache - increment total comment count for replies too
        queryClient.setQueryData<Post>(
          ["posts", String(variables.postId)],
          (oldData) => {
            if (!oldData) return oldData;

            return {
              ...oldData,
              comments: {
                ...oldData.comments,
                total: oldData.comments.total + 1,
              },
            };
          },
        );

        // Update posts list cache - increment total comment count for replies too
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

        // Update post's comment count and most_recent in posts cache
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
                        most_recent: [
                          comment,
                          ...post.comments.most_recent,
                        ].slice(0, post.comments.most_recent.length || 1),
                      },
                    }
                  : post,
              ),
            })),
          };
        });

        // Update individual post cache
        queryClient.setQueryData<Post>(
          ["posts", String(variables.postId)],
          (oldData) => {
            if (!oldData) return oldData;

            return {
              ...oldData,
              comments: {
                ...oldData.comments,
                total: oldData.comments.total + 1,
                most_recent: [comment, ...oldData.comments.most_recent].slice(
                  0,
                  oldData.comments.most_recent.length || 1,
                ),
              },
            };
          },
        );
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
      // Update comment reactions in comments cache
      queryClient.setQueryData<{
        pages: PaginatedResponse<Commment>[];
        pageParams: unknown[];
      }>(["comments", variables.postId], (oldData) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            data: page.data.map((comment) =>
              comment.id === variables.commentId
                ? {
                    ...comment,
                    reactions,
                  }
                : comment,
            ),
          })),
        };
      });

      // Update comment reactions in ALL replies caches (for nested comments)
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
                data: page.data.map((comment) =>
                  comment.id === variables.commentId
                    ? {
                        ...comment,
                        reactions,
                      }
                    : comment,
                ),
              })),
            };
          });
        }
      });

      // Update comment reactions in posts cache (for comments preview in posts)
      queryClient.setQueryData<{
        pages: PaginatedResponse<Post>[];
        pageParams: unknown[];
      }>(["posts"], (oldData) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            data: page.data.map((post) => {
              if (post.id === variables.postId) {
                return {
                  ...post,
                  comments: {
                    ...post.comments,
                    most_popular: post.comments.most_popular.map((comment) =>
                      comment.id === variables.commentId
                        ? {
                            ...comment,
                            reactions,
                          }
                        : comment,
                    ),
                    most_recent: post.comments.most_recent.map((comment) =>
                      comment.id === variables.commentId
                        ? {
                            ...comment,
                            reactions,
                          }
                        : comment,
                    ),
                  },
                };
              }
              return post;
            }),
          })),
        };
      });

      // Update comment reactions in individual post cache
      queryClient.setQueryData<Post>(
        ["posts", String(variables.postId)],
        (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            comments: {
              ...oldData.comments,
              most_popular: oldData.comments.most_popular.map((comment) =>
                comment.id === variables.commentId
                  ? {
                      ...comment,
                      reactions,
                    }
                  : comment,
              ),
              most_recent: oldData.comments.most_recent.map((comment) =>
                comment.id === variables.commentId
                  ? {
                      ...comment,
                      reactions,
                    }
                  : comment,
              ),
            },
          };
        },
      );
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
      // Update comment in comments cache
      queryClient.setQueryData<{
        pages: PaginatedResponse<Commment>[];
        pageParams: unknown[];
      }>(["comments", Number(variables.postId)], (oldData) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            data: page.data.map((comment) =>
              comment.id === Number(variables.commentId)
                ? {
                    ...comment,
                    reported_by_the_user: true,
                  }
                : comment,
            ),
          })),
        };
      });

      // Update comment in ALL replies caches
      const queries = queryClient.getQueryCache().getAll();
      queries.forEach((query) => {
        const [key, postId] = query.queryKey;
        if (key === "replies" && postId === Number(variables.postId)) {
          queryClient.setQueryData<{
            pages: PaginatedResponse<Commment>[];
            pageParams: unknown[];
          }>(query.queryKey, (oldData) => {
            if (!oldData) return oldData;

            return {
              ...oldData,
              pages: oldData.pages.map((page) => ({
                ...page,
                data: page.data.map((comment) =>
                  comment.id === Number(variables.commentId)
                    ? {
                        ...comment,
                        reported_by_the_user: true,
                      }
                    : comment,
                ),
              })),
            };
          });
        }
      });

      // Update comment in posts cache (for comments preview in posts)
      queryClient.setQueryData<{
        pages: PaginatedResponse<Post>[];
        pageParams: unknown[];
      }>(["posts"], (oldData) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            data: page.data.map((post) => {
              if (post.id === Number(variables.postId)) {
                return {
                  ...post,
                  comments: {
                    ...post.comments,
                    most_popular: post.comments.most_popular.map((comment) =>
                      comment.id === Number(variables.commentId)
                        ? {
                            ...comment,
                            reported_by_the_user: true,
                          }
                        : comment,
                    ),
                    most_recent: post.comments.most_recent.map((comment) =>
                      comment.id === Number(variables.commentId)
                        ? {
                            ...comment,
                            reported_by_the_user: true,
                          }
                        : comment,
                    ),
                  },
                };
              }
              return post;
            }),
          })),
        };
      });

      // Update comment in individual post cache
      queryClient.setQueryData<Post>(
        ["posts", String(variables.postId)],
        (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            comments: {
              ...oldData.comments,
              most_popular: oldData.comments.most_popular.map((comment) =>
                comment.id === Number(variables.commentId)
                  ? {
                      ...comment,
                      reported_by_the_user: true,
                    }
                  : comment,
              ),
              most_recent: oldData.comments.most_recent.map((comment) =>
                comment.id === Number(variables.commentId)
                  ? {
                      ...comment,
                      reported_by_the_user: true,
                    }
                  : comment,
              ),
            },
          };
        },
      );
    },
  });
}
