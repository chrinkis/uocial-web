import { Comment } from "@/components/app/posts/comments/Comment";
import { CommentSkeleton } from "@/components/app/posts/comments/CommentSkeleton";
import { Post } from "@/components/app/posts/Post";
import { PostSkeleton } from "@/components/app/posts/PostSkeleton";
import { InfiniteScrolling } from "@/components/InfiniteScrolling";
import { useArbitaryComments } from "@/queries/app/post/comment";
import { usePosts } from "@/queries/app/post/post";
import {
  CourseReportsModeration,
  DepartmentReportsModeration,
  OfferingReportsModeration,
} from "@/components/app/reviews/ModerationReports";
import { useUser } from "@/providers/user/hook";
import { useModerationCounts } from "@/queries/app/moderation-counts";
import { Flex, Indicator, Tabs } from "@mantine/core";
import type { ReactNode } from "react";
import invariant from "tiny-invariant";

function PendingIndicator({
  pending,
  children,
}: {
  pending: number | undefined;
  children: ReactNode;
}) {
  return (
    <Indicator
      disabled={(pending ?? 0) === 0}
      size={8}
      color="red"
      inline
      offset={-4}
    >
      {children}
    </Indicator>
  );
}

function PostTab() {
  return (
    <Tabs defaultValue="pending-review" w="100%" keepMounted={false}>
      <Tabs.List justify="center" mb="lg">
        <Tabs.Tab value="pending-review">Pending Review</Tabs.Tab>
        <Tabs.Tab value="pending-reports">Pending Reports</Tabs.Tab>
        <Tabs.Tab value="reviewed">Reviewed</Tabs.Tab>
        <Tabs.Tab value="reviewed-reports">Reviewed Reports</Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="pending-review">
        <InfiniteScrolling
          useQuery={usePosts}
          queryArgs={[{ pending_review: true }]}
          name="posts"
          Component={({ data }) => <Post post={data} />}
          Fallback="No posts pending review."
          loader={<PostSkeleton />}
        />
      </Tabs.Panel>

      <Tabs.Panel value="pending-reports">
        <InfiniteScrolling
          useQuery={usePosts}
          queryArgs={[{ pending_reports: true }]}
          name="posts"
          Component={({ data }) => <Post post={data} />}
          Fallback="No posts with pending reports."
          loader={<PostSkeleton />}
        />
      </Tabs.Panel>

      <Tabs.Panel value="reviewed">
        <InfiniteScrolling
          useQuery={usePosts}
          queryArgs={[{ pending_review: false }]}
          name="posts"
          Component={({ data }) => <Post post={data} />}
          Fallback="No reviewed posts."
          loader={<PostSkeleton />}
        />
      </Tabs.Panel>

      <Tabs.Panel value="reviewed-reports">
        <InfiniteScrolling
          useQuery={usePosts}
          queryArgs={[{ pending_reports: false }]}
          name="posts"
          Component={({ data }) => <Post post={data} />}
          Fallback="No reviewed reports."
          loader={<PostSkeleton />}
        />
      </Tabs.Panel>
    </Tabs>
  );
}

function CommentTab() {
  return (
    <Tabs defaultValue="pending-review" w="100%" keepMounted={false}>
      <Tabs.List justify="center" mb="lg">
        <Tabs.Tab value="pending-review">Pending Review</Tabs.Tab>
        <Tabs.Tab value="pending-reports">Pending Reports</Tabs.Tab>
        <Tabs.Tab value="reviewed">Reviewed</Tabs.Tab>
        <Tabs.Tab value="reviewed-reports">Reviewed Reports</Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="pending-review">
        <InfiniteScrolling
          useQuery={useArbitaryComments}
          queryArgs={[{ pending_review: true }]}
          name="comments"
          Component={({ data }) => <Comment comment={data} />}
          Fallback="No comments pending review."
          loader={<CommentSkeleton />}
        />
      </Tabs.Panel>

      <Tabs.Panel value="pending-reports">
        <InfiniteScrolling
          useQuery={useArbitaryComments}
          queryArgs={[{ pending_reports: true }]}
          name="comments"
          Component={({ data }) => <Comment comment={data} />}
          Fallback="No comments with pending reports."
          loader={<CommentSkeleton />}
        />
      </Tabs.Panel>

      <Tabs.Panel value="reviewed">
        <InfiniteScrolling
          useQuery={useArbitaryComments}
          queryArgs={[{ pending_review: false }]}
          name="comments"
          Component={({ data }) => <Comment comment={data} />}
          Fallback="No reviewed comments."
          loader={<CommentSkeleton />}
        />
      </Tabs.Panel>

      <Tabs.Panel value="reviewed-reports">
        <InfiniteScrolling
          useQuery={useArbitaryComments}
          queryArgs={[{ pending_reports: false }]}
          name="comments"
          Component={({ data }) => <Comment comment={data} />}
          Fallback="No reviewed reports."
          loader={<CommentSkeleton />}
        />
      </Tabs.Panel>
    </Tabs>
  );
}

export default function Page() {
  const { user } = useUser();

  invariant(user);

  // Shares its cache with the header, so this doesn't add requests.
  const { data: counts } = useModerationCounts(user.active_ban === null);

  return (
    <Flex flex={1} w="100%" justify="center">
      <Tabs defaultValue="posts" w="100%" variant="pills" keepMounted={false}>
        <Tabs.List
          justify="safe center"
          mb="lg"
          style={{ overflowX: "auto", flexWrap: "nowrap" }}
        >
          <Tabs.Tab value="posts">
            <PendingIndicator
              pending={
                counts &&
                counts.posts_pending_review + counts.posts_pending_reports
              }
            >
              Posts
            </PendingIndicator>
          </Tabs.Tab>
          <Tabs.Tab value="comments">
            <PendingIndicator
              pending={
                counts &&
                counts.post_comments_pending_review +
                  counts.post_comments_pending_reports
              }
            >
              Comments
            </PendingIndicator>
          </Tabs.Tab>
          <Tabs.Tab value="departments">
            <PendingIndicator pending={counts?.departments_pending_reports}>
              Departments
            </PendingIndicator>
          </Tabs.Tab>
          <Tabs.Tab value="courses">
            <PendingIndicator pending={counts?.courses_pending_reports}>
              Courses
            </PendingIndicator>
          </Tabs.Tab>
          <Tabs.Tab value="offerings">
            <PendingIndicator
              pending={counts?.course_offerings_pending_reports}
            >
              Offerings
            </PendingIndicator>
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="posts">
          <PostTab />
        </Tabs.Panel>

        <Tabs.Panel value="comments">
          <CommentTab />
        </Tabs.Panel>

        <Tabs.Panel value="departments">
          <DepartmentReportsModeration />
        </Tabs.Panel>

        <Tabs.Panel value="courses">
          <CourseReportsModeration />
        </Tabs.Panel>

        <Tabs.Panel value="offerings">
          <OfferingReportsModeration />
        </Tabs.Panel>
      </Tabs>
    </Flex>
  );
}
