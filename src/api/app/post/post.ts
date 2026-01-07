import axios from "axios";
import type { PaginatedResponse } from "@/utils/response";
import type { Post } from "@/models/app/post/Post";
import type { ReactionValue } from "@/models/app/post/Reaction";
import type { PostReactions } from "@/models/app/post/PostReactions";

export interface fetchPostsParams {
  hashtag?: string;
  reported?: boolean;
  pending_review?: boolean;
  pending_reports?: boolean;
}

export async function fetchPosts(
  page: number | string,
  params: fetchPostsParams = {},
) {
  const queryParams = new URLSearchParams();
  queryParams.append("page", String(page));
  for (const [key, value] of Object.entries(params)) {
    queryParams.append(key, String(value));
  }

  const { data } = await axios.get<PaginatedResponse<Post>>(
    `/api/app/posts?${queryParams.toString()}`,
  );

  return data;
}

export async function fetchPost(postId: number | string) {
  const { data } = await axios.get<Post>(`/api/app/posts/${String(postId)}`);

  return data;
}

export async function fetchSavedPosts(page: number | string) {
  const { data } = await axios.get<PaginatedResponse<Post>>(
    `/api/app/posts/saved?page=${String(page)}`,
  );

  return data;
}

export async function createPost(formData: Record<string, unknown>) {
  const {
    data: { post, message },
  } = await axios.post<{ message: string; post: Post }>(
    `/api/app/posts`,
    formData,
  );

  return { message, post };
}

export async function reactToPost({
  reaction,
  postId,
}: {
  reaction?: ReactionValue;
  postId: number;
}) {
  const {
    data: { message, reactions },
  } = await axios.post<{
    message: string;
    reactions: PostReactions;
  }>(`/api/app/posts/${String(postId)}/react`, {
    reaction,
  });

  return {
    message,
    reactions,
  };
}

export async function savePost({ postId }: { postId: number | string }) {
  const {
    data: { message },
  } = await axios.post<{
    message: string;
  }>(`/api/app/posts/${String(postId)}/save`);

  return {
    message,
  };
}

export async function unsavePost({ postId }: { postId: number | string }) {
  const {
    data: { message },
  } = await axios.post<{
    message: string;
  }>(`/api/app/posts/${String(postId)}/unsave`);

  return {
    message,
  };
}
