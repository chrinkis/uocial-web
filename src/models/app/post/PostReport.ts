import type { ReportReviewValue } from "./ReportReview";

export interface PostReport {
  id: number;
  post_id: number;
  comment: string;
  user_review?: ReportReviewValue;
  created_at: string;
  updated_at: string;
}
