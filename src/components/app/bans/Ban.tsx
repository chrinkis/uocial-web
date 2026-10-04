import type { Ban as BanModel } from "@/models/app/Ban";
import { useModals } from "@/providers/modals/hook";
import { useSetBanThreadClosed } from "@/queries/app/ban";
import { getErrorMessage } from "@/utils/error";
import { Button, Flex, Group, Paper, Stack, Title } from "@mantine/core";
import { useMatches } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconMessages } from "@tabler/icons-react";
import invariant from "tiny-invariant";
import { BanChat } from "./BanChat";
import { BanInfo, BanStatus } from "./BanInfo";

export function Ban({ ban }: { ban: BanModel }) {
  const modals = useModals();
  const setThreadClosed = useSetBanThreadClosed();
  const fullScreenModal = useMatches({ base: true, xs: false });

  invariant(ban.admin);
  const threadClosed = ban.admin.thread_closed;
  const lifted = ban.admin.lifted_at !== null;

  async function handleToggleThread() {
    try {
      const { message } = await setThreadClosed.mutateAsync({
        banId: ban.id,
        closed: !threadClosed,
      });

      notifications.show({ title: "Success", message });
    } catch (error) {
      notifications.show({
        title: `Failed to ${threadClosed ? "reopen" : "close"} thread`,
        message: getErrorMessage(error),
        color: "red",
      });
    }
  }

  function handleChat() {
    modals.open({
      fullScreen: fullScreenModal,
      size: "min(95%, 720px)",
      title: `Chat of ban #${String(ban.id)}`,
      children: <BanChat banId={ban.id} viewer="moderator" />,
      styles: {
        content: { display: "flex", flexDirection: "column", height: "100%" },
        header: { flexShrink: 0 },
        body: { flex: 1, overflow: "hidden" },
      },
    });
  }

  return (
    <Paper withBorder p="sm" w="100%">
      <Stack>
        <Flex justify="space-between" align="center">
          <Title order={3}>Ban #{ban.id}</Title>
          <BanStatus ban={ban} />
        </Flex>

        <BanInfo ban={ban} />

        <Group grow>
          <Button
            variant="outline"
            color={threadClosed ? "green" : "red"}
            loading={setThreadClosed.isPending}
            disabled={lifted}
            onClick={() => void handleToggleThread()}
          >
            {threadClosed ? "Reopen thread" : "Close thread"}
          </Button>
          <Button leftSection={<IconMessages size={16} />} onClick={handleChat}>
            Chat
          </Button>
        </Group>
      </Stack>
    </Paper>
  );
}
