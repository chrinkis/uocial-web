import type { ReportReviewValue } from "@/models/app/post/ReportReview";
import { useReviewPostReport } from "@/queries/app/post/post-report-review";
import { getErrorMessage, type LaravelValidationResponse } from "@/utils/error";
import { Button, Group, Stack, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import axios from "axios";

export function ReportReviewForm({
  postId,
  reportId,
  value,
  onSuccess,
}: {
  postId: string | number;
  reportId: string | number;
  value?: ReportReviewValue;
  onSuccess?: () => void;
}) {
  const reviewPostReport = useReviewPostReport();
  const form = useForm({
    mode: "controlled",
    initialValues: {
      comment:
        value === "invalid"
          ? ""
          : "The report includes at least one term that was violated in the related post.",
    },
  });

  const handleSubmit = form.onSubmit(async (values) => {
    try {
      const { message } = await reviewPostReport.mutateAsync({
        postId,
        reportId,
        comment: values.comment,
        status: value,
      });

      notifications.show({
        title: "Success",
        message: message,
      });

      onSuccess?.();
    } catch (error) {
      notifications.show({
        title: "Failed to review post report",
        message: getErrorMessage(error),
        color: "red",
      });

      if (!axios.isAxiosError(error) || !error.response) {
        return;
      }

      const data = error.response.data as LaravelValidationResponse | undefined;
      form.setErrors(data?.errors ?? {});
    }
  });

  return (
    <form onSubmit={handleSubmit}>
      <Stack>
        {value && (
          <Textarea
            minRows={5}
            autosize
            label="Comment"
            description={
              value === "invalid"
                ? "Describe what is wrong with this report."
                : undefined
            }
            placeholder={
              value === "invalid"
                ? "The report is troll."
                : "The report includes at least one term that was violated in the related post."
            }
            {...form.getInputProps("comment")}
          />
        )}

        <Group justify={value ? "right" : "center"}>
          <Button
            type="submit"
            loading={form.submitting}
            color={value ? undefined : "red"}
          >
            {value ? "Submit Review" : "Delete Review"}
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
