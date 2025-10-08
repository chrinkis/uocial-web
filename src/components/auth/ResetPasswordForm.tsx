import { getErrorMessage, type LaravelValidationResponse } from "@/utils/error";
import { type ApiResponse } from "@/utils/response";
import {
  Title,
  Paper,
  Stack,
  TextInput,
  PasswordInput,
  Group,
  Button,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import axios from "axios";
import { useNavigate } from "react-router";

export interface ResetPasswordFormPropsType {
  token: string;
}

export function ResetPasswordForm({ token }: ResetPasswordFormPropsType) {
  const navigate = useNavigate();
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      email: "",
      password: "",
      password_confirmation: "",
    },
  });

  const handleSubmit = form.onSubmit(async (values) => {
    try {
      const formData = { ...values, token };

      const response = await axios.post<ApiResponse>(
        "/api/auth/password/reset",
        formData,
      );

      notifications.show({
        title: "Success",
        message: response.data.message,
        position: "top-right",
      });

      void navigate("/auth/login");
    } catch (error) {
      notifications.show({
        title: "Password Reset Failed",
        message: getErrorMessage(error),
        color: "red",
        position: "top-right",
      });

      if (!axios.isAxiosError(error) || !error.response) {
        return;
      }

      const data = error.response.data as LaravelValidationResponse | undefined;
      form.setErrors(data?.errors ?? {});
    }
  });

  return (
    <Paper w={280} p="md" withBorder>
      <Stack>
        <Title order={2} ta="center">
          Reset Password
        </Title>

        <form onSubmit={handleSubmit}>
          <Stack>
            <TextInput
              type="email"
              label="email"
              description="Your uoc.gr email"
              placeholder="foo@csd.uoc.gr"
              key={form.key("email")}
              {...form.getInputProps("email")}
              required
            />

            <PasswordInput
              label="New Password"
              key={form.key("password")}
              {...form.getInputProps("password")}
              required
            />

            <PasswordInput
              label="Repeat New Password"
              key={form.key("password_confirmation")}
              {...form.getInputProps("password_confirmation")}
              required
            />

            <Group justify="flex-end">
              <Button type="submit" loading={form.submitting}>
                Update Password
              </Button>
            </Group>
          </Stack>
        </form>
      </Stack>
    </Paper>
  );
}
