import type { QueryClient } from "@tanstack/react-query";
import type { Post } from "@/models/app/post/Post";
import type { Commment } from "@/models/app/post/Comment";
import {
  updateInfiniteQueryItem,
  updateInfiniteQueryItemWith,
  addToInfiniteQuery,
  type InfiniteQueryData,
} from "@/utils/cache";

export const POST_QUERY_KEYS = {
  list: (params?: { hashtag?: string }) =>
    params?.hashtag ? (["posts", params] as const) : (["posts"] as const),
  saved: ["posts", "saved"] as const,
  detail: (id: number) => ["posts", String(id)] as const,
  comments: (postId: number) => ["comments", postId] as const,
  replies: (postId: number, commentId: number) =>
    ["replies", postId, commentId] as const,
};

export function updatePostInAllCaches(
  queryClient: QueryClient,
  postId: number,
  updates: Partial<Post>,
): void {
  // Update all post list caches (with and without filters)
  const queries = queryClient.getQueryCache().getAll();
  queries.forEach((query) => {
    const [key] = query.queryKey;
    if (key === "posts" && Array.isArray(query.queryKey)) {
      // Skip saved posts and detail views
      if (
        query.queryKey.length === 1 ||
        (query.queryKey.length === 2 && typeof query.queryKey[1] === "object")
      ) {
        queryClient.setQueryData<InfiniteQueryData<Post>>(
          query.queryKey,
          (oldData) => updateInfiniteQueryItem(oldData, postId, updates),
        );
      }
    }
  });

  // Update saved posts cache
  queryClient.setQueryData<InfiniteQueryData<Post>>(
    POST_QUERY_KEYS.saved,
    (oldData) => updateInfiniteQueryItem(oldData, postId, updates),
  );

  // Update detail cache
  queryClient.setQueryData<Post>(POST_QUERY_KEYS.detail(postId), (oldData) => {
    if (!oldData) return oldData;
    return { ...oldData, ...updates };
  });
}

export function updateCommentInAllCaches(
  queryClient: QueryClient,
  postId: number,
  commentId: number,
  updates: Partial<Commment>,
): void {
  queryClient.setQueryData<InfiniteQueryData<Commment>>(
    POST_QUERY_KEYS.comments(postId),
    (oldData) => updateInfiniteQueryItem(oldData, commentId, updates),
  );

  const queries = queryClient.getQueryCache().getAll();
  queries.forEach((query) => {
    const [key, queryPostId] = query.queryKey;
    if (key === "replies" && queryPostId === postId) {
      queryClient.setQueryData<InfiniteQueryData<Commment>>(
        query.queryKey,
        (oldData) => updateInfiniteQueryItem(oldData, commentId, updates),
      );
    }
  });

  // Update all post list caches with comment changes
  const postQueries = queryClient.getQueryCache().getAll();
  postQueries.forEach((query) => {
    const [key] = query.queryKey;
    if (key === "posts" && Array.isArray(query.queryKey)) {
      // Match post lists (with or without filters) and saved posts
      if (
        query.queryKey.length === 1 ||
        (query.queryKey.length === 2 &&
          (typeof query.queryKey[1] === "object" ||
            query.queryKey[1] === "saved"))
      ) {
        queryClient.setQueryData<InfiniteQueryData<Post>>(
          query.queryKey,
          (oldData) =>
            updateInfiniteQueryItemWith(oldData, postId, (post) => ({
              ...post,
              comments: {
                ...post.comments,
                most_popular: post.comments.most_popular.map((comment) =>
                  comment.id === commentId ? { ...comment, ...updates } : comment,
                ),
                most_recent: post.comments.most_recent.map((comment) =>
                  comment.id === commentId ? { ...comment, ...updates } : comment,
                ),
              },
            })),
        );
      }
    }
  });

  queryClient.setQueryData<Post>(POST_QUERY_KEYS.detail(postId), (oldData) => {
    if (!oldData) return oldData;
    return {
      ...oldData,
      comments: {
        ...oldData.comments,
        most_popular: oldData.comments.most_popular.map((comment) =>
          comment.id === commentId ? { ...comment, ...updates } : comment,
        ),
        most_recent: oldData.comments.most_recent.map((comment) =>
          comment.id === commentId ? { ...comment, ...updates } : comment,
        ),
      },
    };
  });
}

export function incrementPostCommentCount(
  queryClient: QueryClient,
  postId: number,
  delta: number,
  newComment?: Commment,
): void {
  const updater = (post: Post): Post => {
    const mostRecent = newComment
      ? [newComment, ...post.comments.most_recent].slice(
          0,
          post.comments.most_recent.length || 1,
        )
      : post.comments.most_recent;

    return {
      ...post,
      comments: {
        ...post.comments,
        total: post.comments.total + delta,
        most_recent: mostRecent,
      },
    };
  };

  // Update all post list caches
  const queries = queryClient.getQueryCache().getAll();
  queries.forEach((query) => {
    const [key] = query.queryKey;
    if (key === "posts" && Array.isArray(query.queryKey)) {
      // Match post lists (with or without filters) and saved posts
      if (
        query.queryKey.length === 1 ||
        (query.queryKey.length === 2 &&
          (typeof query.queryKey[1] === "object" ||
            query.queryKey[1] === "saved"))
      ) {
        queryClient.setQueryData<InfiniteQueryData<Post>>(
          query.queryKey,
          (oldData) => updateInfiniteQueryItemWith(oldData, postId, updater),
        );
      }
    }
  });

  queryClient.setQueryData<Post>(POST_QUERY_KEYS.detail(postId), (oldData) => {
    if (!oldData) return oldData;
    return updater(oldData);
  });
}

export function incrementCommentReplyCount(
  queryClient: QueryClient,
  postId: number,
  parentCommentId: number,
  delta: number,
): void {
  const updater = (comment: Commment): Commment => ({
    ...comment,
    replies: {
      ...comment.replies,
      count: comment.replies.count + delta,
    },
  });

  queryClient.setQueryData<InfiniteQueryData<Commment>>(
    POST_QUERY_KEYS.comments(postId),
    (oldData) => updateInfiniteQueryItemWith(oldData, parentCommentId, updater),
  );

  const queries = queryClient.getQueryCache().getAll();
  queries.forEach((query) => {
    const [key, queryPostId] = query.queryKey;
    if (key === "replies" && queryPostId === postId) {
      queryClient.setQueryData<InfiniteQueryData<Commment>>(
        query.queryKey,
        (oldData) =>
          updateInfiniteQueryItemWith(oldData, parentCommentId, updater),
      );
    }
  });
}

export function addPostToSavedCache(
  queryClient: QueryClient,
  post: Post,
): void {
  const postWithSavedFlag = { ...post, saved: true };

  queryClient.setQueryData<InfiniteQueryData<Post>>(
    POST_QUERY_KEYS.saved,
    (oldData) => {
      if (!oldData) return oldData;

      const postExists = oldData.pages.some((page) =>
        page.data.some((p) => p.id === post.id),
      );

      if (postExists) {
        return updateInfiniteQueryItem(oldData, post.id, { saved: true });
      }

      return addToInfiniteQuery(oldData, postWithSavedFlag);
    },
  );
}
