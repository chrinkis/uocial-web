import { Timestamp } from "@/components/Timestamp";
import type { PostReport } from "@/models/app/post/PostReport";
import type { ReportReviewValue } from "@/models/app/post/ReportReview";
import { useModals } from "@/providers/modals/hook";
import { Paper, Stack, Title, Text, Flex, Group, Button } from "@mantine/core";
import { ReportReviewForm } from "./ReportReviewForm";

export function Report({ postReport }: { postReport: PostReport }) {
  const modals = useModals();

  function handleClick(value?: ReportReviewValue) {
    const modalId = modals.open({
      title: `Review of Report ${String(postReport.id)}`,
      children: (
        <ReportReviewForm
          postId={postReport.post_id}
          reportId={postReport.id}
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
          <Title order={3}>{postReport.id}</Title>
          <Timestamp date={postReport.created_at} />
        </Flex>

        <Text>{postReport.comment}</Text>

        <Group>
          {postReport.user_review === "valid" ? (
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
          {postReport.user_review === "invalid" ? (
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
