import { useUnbanUser } from "@/queries/app/ban";
import { getErrorMessage, type LaravelValidationResponse } from "@/utils/error";
import { Button, NumberInput, Paper, Stack, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import axios from "axios";

export function UnbanUserForm() {
  const unbanUser = useUnbanUser();
  const form = useForm<{ userId: number | string }>({
    mode: "controlled",
    initialValues: { userId: "" },
  });

  const handleSubmit = form.onSubmit(async (values) => {
    try {
      const { message } = await unbanUser.mutateAsync({
        userId: values.userId,
      });

      notifications.show({ title: "Success", message });
      form.reset();
    } catch (error) {
      notifications.show({
        title: "Failed to unban user",
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
          <Title order={3}>Unban user</Title>

          <NumberInput
            label="User ID"
            min={1}
            allowDecimal={false}
            allowNegative={false}
            hideControls
            {...form.getInputProps("userId")}
            required
          />

          <Button type="submit" color="green" loading={form.submitting}>
            Unban
          </Button>
        </Stack>
      </form>
    </Paper>
  );
}
