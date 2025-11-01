import type { Reaction } from "./Reaction";

export interface PostReactions {
  user: Reaction | null;
  total: {
    upvotes: number;
    downvotes: number;
  };
}
