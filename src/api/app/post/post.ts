import axios from "axios";
import type { PaginatedResponse } from "@/utils/response";
import type { Post } from "@/models/app/post/Post";

export async function fetchPost(page: number | string) {
  const { data } = await axios.get<PaginatedResponse<Post>>(
    `/api/app/posts?page=${String(page)}`,
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
