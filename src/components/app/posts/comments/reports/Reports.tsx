import { InfiniteScrolling } from "@/components/InfiniteScrolling";
import { Report } from "./Report";
import { SegmentedControl, Stack } from "@mantine/core";
import { useState } from "react";
import type { CommentReport } from "@/models/app/post/CommentReport";
import { useCommentReports } from "@/queries/app/post/comment-report";
import type { Commment } from "@/models/app/post/Comment";

function ReportComponent({ data }: { data: CommentReport }) {
  return <Report commentReport={data} />;
}

export function Reports({ comment }: { comment: Commment }) {
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
        useQuery={useCommentReports}
        queryArgs={[
          comment.post_id,
          comment.id,
          { reviewed: value === "all" ? undefined : false },
        ]}
        Component={ReportComponent}
      />
    </Stack>
  );
}
