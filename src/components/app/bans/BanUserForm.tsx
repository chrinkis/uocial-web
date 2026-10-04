import { useBanUser } from "@/queries/app/ban";
import { getErrorMessage, type LaravelValidationResponse } from "@/utils/error";
import {
  Button,
  NumberInput,
  Paper,
  Stack,
  Textarea,
  Title,
} from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import axios from "axios";
import dayjs from "dayjs";

export function BanUserForm() {
  const banUser = useBanUser();
  const form = useForm<{
    userId: number | string;
    reason: string;
    expires_at: string | null;
    notes: string;
  }>({
    mode: "controlled",
    initialValues: { userId: "", reason: "", expires_at: null, notes: "" },
  });

  const handleSubmit = form.onSubmit(async (values) => {
    try {
      await banUser.mutateAsync({
        userId: values.userId,
        reason: values.reason,
        expires_at: values.expires_at
          ? dayjs(values.expires_at).toISOString()
          : null,
        notes: values.notes || undefined,
      });

      notifications.show({
        title: "Success",
        message: `User ${String(values.userId)} was banned.`,
      });

      form.reset();
    } catch (error) {
      notifications.show({
        title: "Failed to ban user",
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
    <Paper withBorder p="md" w="100%">
      <form onSubmit={handleSubmit}>
        <Stack>
          <Title order={3}>Ban user</Title>

          <NumberInput
            label="User ID"
            min={1}
            allowDecimal={false}
            allowNegative={false}
            hideControls
            {...form.getInputProps("userId")}
            required
          />

          <Textarea
            label="Reason"
            description="The user will see this."
            autosize
            minRows={2}
            {...form.getInputProps("reason")}
            required
          />

          <DateTimePicker
            label="Expires at"
            placeholder="Permanent"
            clearable
            minDate={new Date()}
            valueFormat="DD/MM/YYYY HH:mm"
            {...form.getInputProps("expires_at")}
          />

          <Textarea
            label="Notes"
            description="Only admins will see this."
            autosize
            minRows={2}
            {...form.getInputProps("notes")}
          />

          <Button type="submit" color="red" loading={form.submitting}>
            Ban
          </Button>
        </Stack>
      </form>
    </Paper>
  );
}
