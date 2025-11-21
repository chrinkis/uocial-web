import { Button, Group, Stack, Textarea } from "@mantine/core";
import { useReportPost } from "@/queries/app/post/post";
import { notifications } from "@mantine/notifications";
import { getErrorMessage } from "@/utils/error";
import { useForm } from "@mantine/form";

export function PostReportForm({
  postId,
  onSuccess,
}: {
  postId: number | string;
  onSuccess?: () => void;
}) {
  const reportPost = useReportPost();
  const form = useForm({
    initialValues: {
      comment: "",
    },
  });

  const handleSubmit = form.onSubmit(async (values: { comment: string }) => {
    try {
      const { message } = await reportPost.mutateAsync({
        postId,
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
          description={`Write what is wrong with post #${String(postId)}.`}
          autosize
          minRows={3}
          disabled={reportPost.isPending}
          {...form.getInputProps("comment")}
        />

        <Group justify="right">
          <Button type="submit" loading={reportPost.isPending}>
            Submit
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
