export interface PostPollOption {
  readonly id: number;
  name: string;
  position: number;
  created_at: string;
  total_votes: number;
  user_has_voted: boolean;
}
