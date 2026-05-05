import { register } from "@/api/user/auth";
import { getErrorMessage, type LaravelValidationResponse } from "@/utils/error";
import { validatePassword } from "@/utils/password";
import {
  Anchor,
  Button,
  Checkbox,
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
import { NavLink } from "react-router";
import { useRef } from "react";
import Altcha from "./Altcha";

export interface RegisterFormPropsType {
  redirect?: string;
}

export function RegisterForm({ redirect = "/" }: RegisterFormPropsType) {
  const altchaRef = useRef<{ value: string | null }>(null);

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
      accepted_terms_of_use: false,
      accepted_privacy_policy: false,
    },
    validate: {
      password: (value, values) => {
        return validatePassword(value, [values.email, values.name]);
      },
    },
    validateInputOnChange: true,
  });

  const handleSubmit = form.onSubmit(async (values) => {
    try {
      await register({ ...values, altcha: altchaRef.current?.value });
      window.location.href = redirect;
    } catch (error) {
      notifications.show({
        title: "Account Creation Failed",
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
            description="Use a unique, new  password"
            key={form.key("password")}
            minLength={12}
            {...form.getInputProps("password")}
            required
          />

          <PasswordInput
            label="Confirm Password"
            key={form.key("password_confirmation")}
            {...form.getInputProps("password_confirmation")}
            required
          />

          <Altcha ref={altchaRef} />

          <Stack gap="xs">
            <Checkbox
              label={
                <>
                  I accept{" "}
                  <Anchor component={NavLink} to="/legal/terms-of-use">
                    Terms of Use
                  </Anchor>
                  .
                </>
              }
              key={form.key("accepted_terms_of_use")}
              {...form.getInputProps("accepted_terms_of_use", { type: "checkbox" })}
              required
            />

            <Checkbox
              label={
                <>
                  I accept{" "}
                  <Anchor component={NavLink} to="/legal/privacy-policy">
                    Privacy Policy
                  </Anchor>{" "}
                  terms.
                </>
              }
              key={form.key("accepted_privacy_policy")}
              {...form.getInputProps("accepted_privacy_policy", { type: "checkbox" })}
              required
            />
          </Stack>

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
