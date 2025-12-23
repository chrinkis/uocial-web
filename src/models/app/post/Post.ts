import type { Hashtag } from "../Hashtag";
import type { Commment } from "./Comment";
import type { PostReactions } from "./PostReactions";

export interface Post {
  readonly id: number;
  title: string;
  location?: "Rethymno" | "Heraklion";
  is_official: boolean;
  body: string;
  created_at: string;
  hashtags: Hashtag[];
  reactions: PostReactions;
  comments: {
    total: number;
    most_popular: Commment[];
    most_recent: Commment[];
  };
  saved: boolean;
  author: {
    is_current_user: boolean;
  };
  reported_by_the_user: boolean;
  moderation?: {
    is_hidden: boolean;
    is_auto_hidden: boolean;
    reports: {
      total: number;
    };
  };
}
