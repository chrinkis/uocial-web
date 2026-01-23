import type { Commment } from "@/models/app/post/Comment";
import { useSettings } from "@/providers/settings/hook";
import { useUser } from "@/providers/user/hook";
import { isModerator } from "@/utils/user";
import invariant from "tiny-invariant";

export function useGetNumberOfReplies(comment: Commment) {
  const { user } = useUser();
  const { settings } = useSettings();

  if (!user || !isModerator(user) || !settings.moderatorMode) {
    return comment.replies.count;
  }

  invariant(comment.replies.total !== undefined);

  return comment.replies.total;
}
