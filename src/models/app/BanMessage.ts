export type BanMessageSender = "user" | "moderator";

export interface BanMessage {
  readonly id: number;
  body: string;
  sender: BanMessageSender;
  created_at: string;
}
