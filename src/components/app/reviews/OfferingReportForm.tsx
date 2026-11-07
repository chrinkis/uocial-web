import { Button, Group, Select, Stack, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { isAxiosError } from "axios";
import type { CourseOffering } from "@/models/app/reviews/CourseOffering";
import type { DataReportReason } from "@/models/app/reviews/DepartmentReport";
import { useCreateOfferingReport } from "@/queries/app/reviews/offering-report";
import { getErrorMessage, type LaravelValidationResponse } from "@/utils/error";
import { formatTerm } from "@/utils/app/reviews/semester";
import { OfferingSelect } from "./OfferingSelect";

type ExistingReason = Exclude<DataReportReason, "missing">;

interface FormValues {
  reason: ExistingReason;
  duplicate_of_id: string | null;
  comment: string;
}

const REASON_OPTIONS: { value: ExistingReason; label: string }[] = [
  { value: "false_data", label: "False data" },
  { value: "duplicate", label: "Duplicate" },
  { value: "other", label: "Other" },
];

export interface OfferingReportFormPropsType {
  departmentId: number | string;
  courseId: number | string;
  /** The reported offering. Leave empty to suggest a missing one. */
  offering?: CourseOffering;
  onSuccess?: () => void;
}

export function OfferingReportForm({
  departmentId,
  courseId,
  offering,
  onSuccess,
}: OfferingReportFormPropsType) {
  const createReport = useCreateOfferingReport();
  const isMissing = offering === undefined;
  const form = useForm<FormValues>({
    initialValues: {
      reason: "false_data",
      duplicate_of_id: null,
      comment: "",
    },
    validate: {
      duplicate_of_id: (value, values) =>
        !isMissing && values.reason === "duplicate" && !value
          ? "Select the offering it duplicates"
          : null,
      comment: (value, values) =>
        (isMissing || values.reason !== "duplicate") && value.trim() === ""
          ? "Comment is required"
          : null,
    },
  });

  const isDuplicate = !isMissing && form.values.reason === "duplicate";

  const handleSubmit = form.onSubmit(async (values) => {
    const reason: DataReportReason = isMissing ? "missing" : values.reason;
    const comment = values.comment.trim();

    try {
      await createReport.mutateAsync({
        departmentId,
        courseId,
        offeringId: offering?.id,
        payload: {
          reason,
          comment: comment === "" ? undefined : comment,
          duplicate_of_id:
            isDuplicate && values.duplicate_of_id !== null
              ? Number(values.duplicate_of_id)
              : undefined,
        },
      });
      notifications.show({
        title: "Success",
        message: "Your report was submitted.",
      });
      form.reset();
      onSuccess?.();
    } catch (error) {
      if (isAxiosError<LaravelValidationResponse>(error)) {
        const errors = error.response?.data.errors;
        if (error.response?.status === 422 && errors) {
          form.setErrors(
            Object.fromEntries(
              Object.entries(errors).map(([field, messages]) => [
                field,
                messages.join(" "),
              ]),
            ),
          );
        }
      }

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
        {!isMissing && (
          <Select
            label="Reason"
            allowDeselect={false}
            disabled={createReport.isPending}
            data={REASON_OPTIONS}
            {...form.getInputProps("reason")}
          />
        )}

        {isDuplicate && (
          <OfferingSelect
            label="Duplicate of"
            placeholder="Search by year or semester"
            departmentId={departmentId}
            courseId={courseId}
            excludeId={offering.id}
            disabled={createReport.isPending}
            {...form.getInputProps("duplicate_of_id")}
            value={form.values.duplicate_of_id}
          />
        )}

        <Textarea
          label="Comment"
          description={
            isMissing
              ? "Which offering (year and semester) is missing from the list?"
              : `What is wrong with ${formatTerm(offering)}?`
          }
          required={!isDuplicate}
          autosize
          minRows={3}
          disabled={createReport.isPending}
          {...form.getInputProps("comment")}
        />

        <Group justify="right">
          <Button type="submit" loading={createReport.isPending}>
            Submit
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
