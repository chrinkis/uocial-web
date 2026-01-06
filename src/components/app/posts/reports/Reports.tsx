import { InfiniteScrolling } from "@/components/InfiniteScrolling";
import type { Post } from "@/models/app/post/Post";
import type { PostReport } from "@/models/app/post/PostReport";
import { usePostReports } from "@/queries/app/post/post-report";
import { Report } from "./Report";
import { SegmentedControl, Stack } from "@mantine/core";
import { useState } from "react";

function ReportComponent({ data }: { data: PostReport }) {
  return <Report postReport={data} />;
}

export function Reports({ post }: { post: Post }) {
  const [value, setValue] = useState("pending-review");

  return (
    <Stack>
      <SegmentedControl
        value={value}
        onChange={setValue}
        data={[
          { label: "Pending Review", value: "pending-review" },
          { label: "All", value: "all" },
        ]}
      />
      <InfiniteScrolling
        name="reports"
        useQuery={usePostReports}
        queryArgs={[post.id, { reviewed: value === "all" ? undefined : false }]}
        Component={ReportComponent}
      />
    </Stack>
  );
}
