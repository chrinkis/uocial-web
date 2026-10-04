import { BanChat } from "@/components/app/bans/BanChat";
import { BanInfo } from "@/components/app/bans/BanInfo";
import { useUser } from "@/providers/user/hook";
import { Paper, Stack, Text, Title } from "@mantine/core";
import { Navigate } from "react-router";

export default function Page() {
  const { user } = useUser();
  const ban = user?.active_ban;

  if (!ban) {
    return <Navigate to="/app" replace />;
  }

  return (
    <Stack w="100%" maw={720} gap="md">
      <Paper withBorder p="md">
        <Stack>
          <Title order={2}>Your account is banned</Title>
          <BanInfo ban={ban} />
        </Stack>
      </Paper>

      <Paper withBorder p="md">
        <Stack>
          <Title order={3}>Talk to the admins</Title>
          <Text size="sm" c="dimmed">
            If you think this ban is a mistake, tell the admins here. Wait for
            their reply before sending more messages.
          </Text>
          <div style={{ height: "50vh", minHeight: 320 }}>
            <BanChat banId={ban.id} viewer="user" />
          </div>
        </Stack>
      </Paper>
    </Stack>
  );
}
