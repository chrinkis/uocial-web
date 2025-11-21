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
  reactToPost,
  reportPost,
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
