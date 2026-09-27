import type { PostPollOption } from "./PostPollOption";

export interface PostPoll {
  readonly id: number;
  allow_multiple_votes: boolean;
  ends_at: string | null;
  created_at: string;
  total_votes: number;
  options: PostPollOption[];
}
