import { getErrorMessage, type LaravelValidationResponse } from "@/utils/error";
import {
  Button,
  Group,
  Paper,
  PasswordInput,
  Stack,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import axios from "axios";

export interface RegisterFormPropsType {
  redirect?: string;
}

export function RegisterForm({ redirect = "/" }: RegisterFormPropsType) {
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
    },
  });

  const handleSubmit = form.onSubmit(async (values) => {
    try {
      await axios.post("/api/auth/register", values);
      window.location.href = redirect;
    } catch (error) {
      notifications.show({
        title: "Account Creation Failed",
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
    <Paper maw={280} p="md" withBorder>
      <Stack>
        <Title order={2} ta="center">
          Sign-Up
        </Title>
      </Stack>

      <form onSubmit={handleSubmit}>
        <Stack>
          <TextInput
            label="Username"
            description="How should we call you?"
            placeholder="John Doe"
            key={form.key("name")}
            {...form.getInputProps("name")}
            required
          />

          <TextInput
            type="email"
            label="University Email"
            description="Use your uoc.gr email"
            placeholder="foo@csd.uoc.gr"
            key={form.key("email")}
            {...form.getInputProps("email")}
            required
          />

          <PasswordInput
            label="Password"
            key={form.key("password")}
            {...form.getInputProps("password")}
            required
          />

          <PasswordInput
            label="Confirm Password"
            key={form.key("password_confirmation")}
            {...form.getInputProps("password_confirmation")}
            required
          />

          <Group justify="flex-end">
            <Button type="submit" loading={form.submitting}>
              Create Account
            </Button>
          </Group>
        </Stack>
      </form>
    </Paper>
  );
}
