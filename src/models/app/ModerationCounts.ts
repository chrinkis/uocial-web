export interface ModerationCounts {
  posts_pending_review: number;
  post_comments_pending_review: number;
  posts_pending_reports: number;
  post_comments_pending_reports: number;
  /** Only present for admins. */
  ban_threads_pending_reply?: number;
}
