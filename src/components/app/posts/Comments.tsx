import { InfiniteScrolling } from "@/components/InfiniteScrolling";
import { useComments } from "@/queries/app/post/comment";
import type { Post } from "@/models/app/post/Post";
import { Comment } from "./Comment";

interface CommentsProps {
  post: Post;
}

export function Comments({ post }: CommentsProps) {
  return (
    <InfiniteScrolling
      name="comments"
      useQuery={useComments}
      queryArgs={[post.id]}
      Component={({ data }) => <Comment comment={data} />}
    />
  );
}
