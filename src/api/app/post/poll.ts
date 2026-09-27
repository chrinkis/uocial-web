import axios from "axios";
import type { PostPoll } from "@/models/app/post/PostPoll";

export async function votePoll({
  postId,
  pollId,
  optionId,
}: {
  postId: number | string;
  pollId: number | string;
  optionId: number | string;
}) {
  const {
    data: { message, poll },
  } = await axios.post<{
    message: string;
    poll: PostPoll;
  }>(
    `/api/app/posts/${String(postId)}/poll/${String(pollId)}/vote/${String(optionId)}`,
  );

  return { message, poll };
}

export async function unvotePoll({
  postId,
  pollId,
  optionId,
}: {
  postId: number | string;
  pollId: number | string;
  optionId: number | string;
}) {
  const {
    data: { message, poll },
  } = await axios.post<{
    message: string;
    poll: PostPoll;
  }>(
    `/api/app/posts/${String(postId)}/poll/${String(pollId)}/unvote/${String(optionId)}`,
  );

  return { message, poll };
}
