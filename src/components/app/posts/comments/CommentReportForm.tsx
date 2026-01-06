import { Button, Group, Stack, Textarea } from "@mantine/core";
import { useReportComment } from "@/queries/app/post/comment";
import { notifications } from "@mantine/notifications";
import { getErrorMessage } from "@/utils/error";
import { useForm } from "@mantine/form";

export function CommentReportForm({
  postId,
  commentId,
  onSuccess,
}: {
  postId: number | string;
  commentId: number | string;
  onSuccess?: () => void;
}) {
  const reportComment = useReportComment();
  const form = useForm({
    initialValues: {
      comment: "",
    },
  });

  const handleSubmit = form.onSubmit(async (values: { comment: string }) => {
    try {
      const { message } = await reportComment.mutateAsync({
        postId,
        commentId,
        comment: values.comment,
      });
      notifications.show({
        title: "Success",
        message,
      });
      onSuccess?.();
    } catch (error) {
      notifications.show({
        title: "Report failed",
        message: getErrorMessage(error),
        color: "red",
      });
    }
  });

  return (
    <form onSubmit={handleSubmit}>
      <Stack>
        <Textarea
          required
          label="Comment"
          description={`Write what is wrong with comment !${String(commentId)}.`}
          autosize
          minRows={3}
          disabled={reportComment.isPending}
          {...form.getInputProps("comment")}
        />

        <Group justify="right">
          <Button type="submit" loading={reportComment.isPending}>
            Submit
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
