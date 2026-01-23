import type { ReportReviewValue } from "./ReportReview";

export interface CommentReport {
  id: number;
  comment_id: number;
  post_id: number;
  comment: string;
  user_review?: ReportReviewValue;
  created_at: string;
  updated_at: string;
}
