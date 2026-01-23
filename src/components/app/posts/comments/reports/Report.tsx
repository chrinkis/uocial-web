import { Timestamp } from "@/components/Timestamp";
import type { ReportReviewValue } from "@/models/app/post/ReportReview";
import { useModals } from "@/providers/modals/hook";
import { Paper, Stack, Title, Text, Flex, Group, Button } from "@mantine/core";
import { ReportReviewForm } from "./ReportReviewForm";
import type { CommentReport } from "@/models/app/post/CommentReport";

export function Report({ commentReport }: { commentReport: CommentReport }) {
  const modals = useModals();

  function handleClick(value?: ReportReviewValue) {
    const modalId = modals.open({
      title: `Review of Report ${String(commentReport.id)}`,
      children: (
        <ReportReviewForm
          postId={commentReport.post_id}
          commentId={commentReport.comment_id}
          reportId={commentReport.id}
          onSuccess={closeModal}
          value={value}
        />
      ),
      centered: true,
    });
    function closeModal() {
      modals.close(modalId);
    }
  }

  return (
    <Paper withBorder p="sm" w="100%">
      <Stack>
        <Flex justify="space-between">
          <Title order={3}>{commentReport.id}</Title>
          <Timestamp date={commentReport.created_at} />
        </Flex>

        <Text>{commentReport.comment}</Text>

        <Group>
          {commentReport.user_review === "valid" ? (
            <Button
              color="green"
              flex={1}
              variant="outline"
              onClick={() => {
                handleClick();
              }}
            >
              Valid
            </Button>
          ) : (
            <Button
              bg="green"
              flex={1}
              onClick={() => {
                handleClick("valid");
              }}
            >
              Valid
            </Button>
          )}
          {commentReport.user_review === "invalid" ? (
            <Button
              color="red"
              flex={1}
              variant="outline"
              onClick={() => {
                handleClick();
              }}
            >
              Invalid
            </Button>
          ) : (
            <Button
              bg="red"
              flex={1}
              onClick={() => {
                handleClick("invalid");
              }}
            >
              Invalid
            </Button>
          )}
        </Group>
      </Stack>
    </Paper>
  );
}
