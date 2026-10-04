export type NotificationType =
  | "newCommentToPost"
  | "newCommentToPostComment"
  | "newOfficialPost"
  | "postHiddenUntilReview"
  | "postHiddenByModerator"
  | "postUnhiddenByModerator"
  | "postCommentHiddenUntilReview"
  | "postCommentHiddenByModerator"
  | "postCommentUnhiddenByModerator";

export type NotificationReason = "owner" | "follower" | "everyone";

export interface Notification {
  id: number;
  type: NotificationType;
  reason: NotificationReason;
  post_id: number;
  entity_id: number;
  read: boolean;
  created_at: string;
}
