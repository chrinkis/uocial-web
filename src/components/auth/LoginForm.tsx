import { getErrorMessage, type LaravelValidationResponse } from "@/utils/error";
import {
  Button,
  Group,
  Paper,
  PasswordInput,
  Stack,
  TextInput,
  Title,
  Anchor,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import axios from "axios";
import { NavLink } from "react-router";

export interface LoginFormPropsType {
  redirect?: string;
}

export function LoginForm({ redirect = "/" }: LoginFormPropsType) {
  const form = useForm({
    mode: "uncontrolled",
    initialValues: { email: "", password: "" },
  });

  const handleSubmit = form.onSubmit(async (values) => {
    try {
      await axios.post("/api/auth/login", values);
      window.location.href = redirect;
    } catch (error) {
      notifications.show({
        title: "Login failed",
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
    <Paper w={280} p="md" withBorder>
      <Stack>
        <Title order={2} ta="center">
          Login
        </Title>

        <form onSubmit={handleSubmit}>
          <Stack>
            <TextInput
              type="email"
              label="University email"
              description="Your email's domain should end with uoc.gr"
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

            <Group justify="flex-end">
              <Anchor
                component={NavLink}
                to="/auth/password/forgot"
                ta="center"
                style={{ flexGrow: 1 }}
                size="sm"
              >
                Forgot your password?
              </Anchor>
              <Button type="submit" loading={form.submitting}>
                Login
              </Button>
            </Group>
          </Stack>
        </form>
      </Stack>
    </Paper>
  );
}
