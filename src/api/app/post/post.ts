import axios from "axios";
import type { PaginatedResponse } from "@/utils/response";
import type { Post } from "@/models/app/post/Post";
import type { ReactionValue } from "@/models/app/post/Reaction";
import type { PostReactions } from "@/models/app/post/PostReactions";

export async function fetchPosts(page: number | string) {
  const { data } = await axios.get<PaginatedResponse<Post>>(
    `/api/app/posts?page=${String(page)}`,
  );

  return data;
}

export async function fetchPost(postId: number | string) {
  const { data } = await axios.get<Post>(`/api/app/posts/${String(postId)}`);

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
