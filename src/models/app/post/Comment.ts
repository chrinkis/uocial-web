import type { Reaction } from "./Reaction";

export interface Commment {
  readonly id: number;
  post_id: number;
  comment: string;
  created_at: string;
  reactions: {
    user: Reaction | null;
    upvotes: number;
    downvotes: number;
  };
  author: {
    pseudonym: string;
    is_current_user: boolean;
    is_post_author: boolean;
  };
  replies: {
    count: number;
  };
}
