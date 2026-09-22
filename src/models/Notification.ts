export type NotificationType =
  | "newCommentToPost"
  | "newCommentToPostComment"
  | "postHiddenUntilReview"
  | "postHiddenByModerator"
  | "postUnhiddenByModerator"
  | "postCommentHiddenUntilReview"
  | "postCommentHiddenByModerator"
  | "postCommentUnhiddenByModerator";

export type NotificationReason = "owner" | "follower";

export interface Notification {
  id: number;
  type: NotificationType;
  reason: NotificationReason;
  post_id: number;
  entity_id: number;
  read: boolean;
  created_at: string;
}
