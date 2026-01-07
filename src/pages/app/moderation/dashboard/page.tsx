import { Post } from "@/components/app/posts/Post";
import { PostSkeleton } from "@/components/app/posts/PostSkeleton";
import { InfiniteScrolling } from "@/components/InfiniteScrolling";
import { usePosts } from "@/queries/app/post/post";
import { Flex, Tabs } from "@mantine/core";

function PostTab() {
  return (
    <Tabs defaultValue="pending-review" maw="100%" keepMounted={false}>
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
          loader={<PostSkeleton />}
        />
      </Tabs.Panel>

      <Tabs.Panel value="pending-reports">
        <InfiniteScrolling
          useQuery={usePosts}
          queryArgs={[{ pending_reports: true }]}
          name="posts"
          Component={({ data }) => <Post post={data} />}
          loader={<PostSkeleton />}
        />
      </Tabs.Panel>

      <Tabs.Panel value="reviewed">
        <InfiniteScrolling
          useQuery={usePosts}
          queryArgs={[{ pending_review: false }]}
          name="posts"
          Component={({ data }) => <Post post={data} />}
          loader={<PostSkeleton />}
        />
      </Tabs.Panel>

      <Tabs.Panel value="reviewed-reports">
        <InfiniteScrolling
          useQuery={usePosts}
          queryArgs={[{ pending_reports: false }]}
          name="posts"
          Component={({ data }) => <Post post={data} />}
          loader={<PostSkeleton />}
        />
      </Tabs.Panel>
    </Tabs>
  );
}

export default function Page() {
  return (
    <Flex flex={1} w="100%" justify="center">
      <Tabs defaultValue="posts" maw="100%" variant="pills" keepMounted={false}>
        <Tabs.List
          justify="center"
          mb="lg"
          style={{ overflowX: "auto", flexWrap: "nowrap" }}
        >
          <Tabs.Tab value="posts">Posts</Tabs.Tab>
          <Tabs.Tab value="comments">Comments</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="posts">
          <PostTab />
        </Tabs.Panel>
      </Tabs>
    </Flex>
  );
}
