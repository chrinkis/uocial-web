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
  savePost,
  unsavePost,
} from "@/api/app/post/post";
import type { Post } from "@/models/app/post/Post";
import type { ReactionValue } from "@/models/app/post/Reaction";
import { addToInfiniteQuery, type InfiniteQueryData } from "@/utils/cache";
import {
  POST_QUERY_KEYS,
  updatePostInAllCaches,
  addPostToSavedCache,
} from "./cache-utils";
import { reportPost } from "@/api/app/post/post-report";

export function usePosts(params?: { hashtag?: string }) {
  return useInfiniteQuery({
    queryKey: POST_QUERY_KEYS.list(params),
    queryFn: ({ pageParam }) => fetchPosts(pageParam, params),
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
      // Add to the base (unfiltered) list
      queryClient.setQueryData<InfiniteQueryData<Post>>(
        POST_QUERY_KEYS.list(),
        (oldData) => addToInfiniteQuery(oldData, post),
      );

      // Invalidate all hashtag-filtered lists since we don't know which ones the new post belongs to
      queryClient.invalidateQueries({
        queryKey: ["posts"],
        predicate: (query) => {
          // Only invalidate post lists with filters (length > 1), not the base list or saved/detail
          return (
            query.queryKey[0] === "posts" &&
            query.queryKey.length === 2 &&
            typeof query.queryKey[1] === "object" &&
            query.queryKey[1] !== null &&
            !Array.isArray(query.queryKey[1])
          );
        },
      });

      queryClient.setQueryData<Post>(POST_QUERY_KEYS.detail(post.id), post);
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
      updatePostInAllCaches(queryClient, variables.postId, { reactions });
    },
  });
}

export function useSavePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId }: { postId: number | string }) =>
      savePost({ postId }),
    onSuccess: (_, variables) => {
      const postId = Number(variables.postId);

      updatePostInAllCaches(queryClient, postId, { saved: true });

      let savedPost = queryClient.getQueryData<Post>(
        POST_QUERY_KEYS.detail(postId),
      );

      if (!savedPost) {
        const postsData = queryClient.getQueryData<InfiniteQueryData<Post>>(
          POST_QUERY_KEYS.list(),
        );
        if (postsData) {
          for (const page of postsData.pages) {
            const post = page.data.find((p) => p.id === postId);
            if (post) {
              savedPost = post;
              break;
            }
          }
        }
      }

      if (savedPost) {
        addPostToSavedCache(queryClient, savedPost);
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
      updatePostInAllCaches(queryClient, Number(variables.postId), {
        saved: false,
      });
    },
  });
}
