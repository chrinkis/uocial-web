import type { PostReactions } from "./PostReactions";

export interface Commment {
  readonly id: number;
  post_id: number;
  comment: string;
  created_at: string;
  reactions: PostReactions;
  author: {
    pseudonym: string;
    is_current_user: boolean;
    is_post_author: boolean;
  };
  replies: {
    count: number;
  };
  reported_by_the_user: boolean;
}
