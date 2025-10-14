import axios from "axios";
import type { Hashtag } from "../Hashtag";
import type { Commment } from "./Comment";
import type { Label } from "./Label";
import type { Reaction } from "./Reaction";
import type { PaginatedResponse } from "@/utils/response";

export interface Post {
  readonly id: number;
  title: string;
  body: string;
  created_at: string;
  hashtags: Hashtag[];
  labels: Label[];
  reactions: {
    user: Reaction | null;
    total: {
      upvotes: number;
      downvotes: number;
    };
  };
  comments: {
    total: number;
    most_popular: Commment[];
    most_recent: Commment[];
  };
}

export async function fetchPage(page: number | string) {
  const { data } = await axios.get<PaginatedResponse<Post>>(
    `/api/app/posts?page=${String(page)}`,
  );
  return data;
}
