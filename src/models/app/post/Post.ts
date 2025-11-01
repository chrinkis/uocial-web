import type { Hashtag } from "../Hashtag";
import type { Commment } from "./Comment";
import type { Label } from "./Label";
import type { Reaction } from "./Reaction";

export interface Post {
  readonly id: number;
  title: string;
  location?: "Rethymno" | "Heraklion";
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
  saved: boolean;
}
