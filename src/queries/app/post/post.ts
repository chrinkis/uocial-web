import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  createPost,
  fetchPost,
  fetchPosts,
  fetchSavedPosts,
  reactToPost,
  reportPost,
  savePost,
  unsavePost,
} from "@/api/app/post/post";
import type { Post } from "@/models/app/post/Post";
import type { ReactionValue } from "@/models/app/post/Reaction";
import type { PaginatedResponse } from "@/utils/response";

export function usePosts() {
  return useInfiniteQuery({
    queryKey: ["posts"],
    queryFn: ({ pageParam }) => fetchPosts(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastResponse) => {
      if (lastResponse.meta.current_page < lastResponse.meta.last_page) {
        return lastResponse.meta.current_page + 1;
      }

      return undefined;
    },
  });
}

export function useSavedPosts() {
  return useInfiniteQuery({
    queryKey: ["posts", "saved"],
    queryFn: ({ pageParam }) => fetchSavedPosts(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastResponse) => {
      if (lastResponse.meta.current_page < lastResponse.meta.last_page) {
        return lastResponse.meta.current_page + 1;
      }

      return undefined;
    },
  });
}

export function usePost(postId: number | string) {
  return useQuery({
    queryKey: ["posts", String(postId)],
    queryFn: () => fetchPost(postId),
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: Record<string, unknown>) => createPost(formData),
    onSuccess: ({ post }) => {
      queryClient.setQueryData<{
        pages: PaginatedResponse<Post>[];
        pageParams: unknown[];
      }>(["posts"], (oldData) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page, index) =>
            index === 0
              ? {
                  ...page,
                  data: [post, ...page.data],
                }
              : page,
          ),
        };
      });

      // Update individual post cache
      queryClient.setQueryData<Post>(["posts", String(post.id)], post);
    },
  });
}

export function useReactToPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      reaction,
      postId,
    }: {
      reaction?: ReactionValue;
      postId: number;
    }) => reactToPost({ reaction, postId }),
    onSuccess: ({ reactions }, variables) => {
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
                  reactions,
                };
              }
              return post;
            }),
          })),
        };
      });

      // Update saved posts cache
      queryClient.setQueryData<{
        pages: PaginatedResponse<Post>[];
        pageParams: unknown[];
      }>(["posts", "saved"], (oldData) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            data: page.data.map((post) => {
              if (post.id === variables.postId) {
                return {
                  ...post,
                  reactions,
                };
              }
              return post;
            }),
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
            reactions,
          };
        },
      );
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
                  reported_by_the_user: true,
                };
              }
              return post;
            }),
          })),
        };
      });

      // Update saved posts cache
      queryClient.setQueryData<{
        pages: PaginatedResponse<Post>[];
        pageParams: unknown[];
      }>(["posts", "saved"], (oldData) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            data: page.data.map((post) => {
              if (post.id === Number(variables.postId)) {
                return {
                  ...post,
                  reported_by_the_user: true,
                };
              }
              return post;
            }),
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
            reported_by_the_user: true,
          };
        },
      );
    },
  });
}

export function useSavePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId }: { postId: number | string }) =>
      savePost({ postId }),
    onSuccess: (_, variables) => {
      // Get the post from cache to add to saved posts
      let savedPost: Post | undefined;

      // Try to get from individual post cache
      savedPost = queryClient.getQueryData<Post>([
        "posts",
        String(variables.postId),
      ]);

      // If not in individual cache, try to find in posts list
      if (!savedPost) {
        const postsData = queryClient.getQueryData<{
          pages: PaginatedResponse<Post>[];
          pageParams: unknown[];
        }>(["posts"]);

        if (postsData) {
          for (const page of postsData.pages) {
            const post = page.data.find(
              (p) => p.id === Number(variables.postId),
            );
            if (post) {
              savedPost = post;
              break;
            }
          }
        }
      }

      // Update posts cache
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
                  saved: true,
                };
              }
              return post;
            }),
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
            saved: true,
          };
        },
      );

      // Update saved posts cache - add the post to the beginning if not already present
      if (savedPost) {
        queryClient.setQueryData<{
          pages: PaginatedResponse<Post>[];
          pageParams: unknown[];
        }>(["posts", "saved"], (oldData) => {
          if (!oldData) return oldData;

          const postWithSavedFlag = {
            ...savedPost,
            saved: true,
          };

          // Check if post already exists in saved posts
          const postExists = oldData.pages.some((page) =>
            page.data.some((p) => p.id === Number(variables.postId)),
          );

          // If post already exists, just update it; otherwise add to beginning
          if (postExists) {
            return {
              ...oldData,
              pages: oldData.pages.map((page) => ({
                ...page,
                data: page.data.map((p) =>
                  p.id === Number(variables.postId) ? postWithSavedFlag : p,
                ),
              })),
            };
          }

          return {
            ...oldData,
            pages: oldData.pages.map((page, index) =>
              index === 0
                ? {
                    ...page,
                    data: [postWithSavedFlag, ...page.data],
                  }
                : page,
            ),
          };
        });
      }
    },
  });
}

export function useUnsavePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId }: { postId: number | string }) =>
      unsavePost({ postId }),
    onSuccess: (_, variables) => {
      // Update posts cache
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
                  saved: false,
                };
              }
              return post;
            }),
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
            saved: false,
          };
        },
      );

      // Update saved posts cache - mark as unsaved but keep the post visible
      queryClient.setQueryData<{
        pages: PaginatedResponse<Post>[];
        pageParams: unknown[];
      }>(["posts", "saved"], (oldData) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            data: page.data.map((post) => {
              if (post.id === Number(variables.postId)) {
                return {
                  ...post,
                  saved: false,
                };
              }
              return post;
            }),
          })),
        };
      });
    },
  });
}
