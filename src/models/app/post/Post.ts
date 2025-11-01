import type { Hashtag } from "../Hashtag";
import type { Commment } from "./Comment";
import type { Label } from "./Label";
import type { PostReactions } from "./PostReactions";

export interface Post {
  readonly id: number;
  title: string;
  location?: "Rethymno" | "Heraklion";
  body: string;
  created_at: string;
  hashtags: Hashtag[];
  labels: Label[];
  reactions: PostReactions;
  comments: {
    total: number;
    most_popular: Commment[];
    most_recent: Commment[];
  };
  saved: boolean;
}
