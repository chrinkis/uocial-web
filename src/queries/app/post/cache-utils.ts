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
  all: ["posts"] as const,
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
  queryClient.setQueryData<InfiniteQueryData<Post>>(
    POST_QUERY_KEYS.all,
    (oldData) => updateInfiniteQueryItem(oldData, postId, updates),
  );

  queryClient.setQueryData<InfiniteQueryData<Post>>(
    POST_QUERY_KEYS.saved,
    (oldData) => updateInfiniteQueryItem(oldData, postId, updates),
  );

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

  queryClient.setQueryData<InfiniteQueryData<Post>>(
    POST_QUERY_KEYS.all,
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

  queryClient.setQueryData<InfiniteQueryData<Post>>(
    POST_QUERY_KEYS.saved,
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

  queryClient.setQueryData<InfiniteQueryData<Post>>(
    POST_QUERY_KEYS.all,
    (oldData) => updateInfiniteQueryItemWith(oldData, postId, updater),
  );

  queryClient.setQueryData<InfiniteQueryData<Post>>(
    POST_QUERY_KEYS.saved,
    (oldData) => updateInfiniteQueryItemWith(oldData, postId, updater),
  );

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
