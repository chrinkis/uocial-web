import type { Commment } from "@/models/app/post/Comment";
import { CommentPreview } from "./CommentPreview";

export function Comment({ comment }: { comment: Commment }) {
  return <CommentPreview comment={comment} />;
}
