import { getErrorMessage, type LaravelValidationResponse } from "@/utils/error";
import type { ApiResponse } from "@/utils/response";
import {
  Button,
  Group,
  Paper,
  Stack,
  TextInput,
  Title,
  Text,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconCircleCheck } from "@tabler/icons-react";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router";

function Success({ message }: { message: string }) {
  return (
    <Paper w={200} p="md" withBorder>
      <Stack>
        <Title order={2} ta="center">
          Done!
        </Title>

        <Group justify="center">
          <IconCircleCheck size={128} />
        </Group>

        <Text ta="justify">{message}</Text>
      </Stack>
    </Paper>
  );
}

export function ForgotPasswordForm() {
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      email: "",
    },
  });

  const handleSubmit = form.onSubmit(async (values) => {
    try {
      const response = await axios.post<ApiResponse>(
        "/api/auth/password/forgot",
        values,
      );

      setSuccessMessage(response.data.message);
    } catch (error) {
      notifications.show({
        title: "Password Reset Failed",
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

  function handleLoginClick() {
    void navigate("/auth/login");
  }

  if (successMessage) {
    return <Success message={successMessage} />;
  }

  return (
    <Paper w={280} p="md" withBorder>
      <Stack>
        <Title order={2} ta="center">
          Password Reset
        </Title>

        <form onSubmit={handleSubmit}>
          <Stack>
            <TextInput
              type="email"
              label="Email"
              description="Your uoc.gr email"
              placeholder="foo@csd.uoc.gr"
              key={form.key("email")}
              {...form.getInputProps("email")}
              required
            />

            <Group justify="space-between">
              <Button
                disabled={form.submitting}
                size="xs"
                onClick={handleLoginClick}
              >
                Back to Login
              </Button>

              <Button type="submit" loading={form.submitting}>
                Send email
              </Button>
            </Group>
          </Stack>
        </form>
      </Stack>
    </Paper>
  );
}
