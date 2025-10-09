import { Button, Group, Paper, Stack, Text, Title } from "@mantine/core";
import { IconLock, IconMail } from "@tabler/icons-react";
import { useLocation, useNavigate } from "react-router";
import invariant from "tiny-invariant";
import { SendVerificationEmailButton } from "./auth/SendVerificationEmailButton";

export interface LockedPropsType {
  reason: "unauthorized" | "unverified";
}

function LockedAnauthorized() {
  const navigate = useNavigate();
  const location = useLocation();

  function hadnleLogin() {
    void navigate(
      `/auth/login?redirect=${encodeURIComponent(location.pathname)}`,
    );
  }

  function hadnleSignUp() {
    void navigate("/auth/register");
  }

  return (
    <Paper w={330} p="xl" withBorder>
      <Stack>
        <Title order={2} ta="center">
          Locked
        </Title>
        <Group justify="center">
          <IconLock size={128} />
        </Group>
        <Text ta="justify">
          The content in this page is only available for logged in users.
        </Text>
        <Group justify="space-evenly">
          <Button onClick={hadnleLogin}>Login</Button>
          <Button size="md" onClick={hadnleSignUp}>
            Sign-Up
          </Button>
        </Group>
      </Stack>
    </Paper>
  );
}

function LockedUnverified() {
  return (
    <Paper w={330} p="xl" withBorder>
      <Stack>
        <Title order={2} ta="center">
          One step left...
        </Title>
        <Group justify="center">
          <IconMail size={128} />
        </Group>
        <Text ta="justify">
          You can't access this page, until you verify your email. Once you
          verify it, reload this page.
        </Text>
        <Group justify="center">
          <SendVerificationEmailButton />
        </Group>
      </Stack>
    </Paper>
  );
}

export function Locked({ reason }: LockedPropsType) {
  switch (reason) {
    case "unauthorized":
      return <LockedAnauthorized />;
    case "unverified":
      return <LockedUnverified />;
    default:
      invariant(false);
  }
}
