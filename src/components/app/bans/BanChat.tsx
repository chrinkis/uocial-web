import { InfiniteScrolling } from "@/components/InfiniteScrolling";
import { Timestamp } from "@/components/Timestamp";
import type { BanMessage, BanMessageSender } from "@/models/app/BanMessage";
import { useBanMessages, useSendBanMessage } from "@/queries/app/ban-message";
import { getErrorMessage, type LaravelValidationResponse } from "@/utils/error";
import {
  ActionIcon,
  Box,
  Group,
  Paper,
  Stack,
  Text,
  Textarea,
  useMantineTheme,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconMessageCircleOff, IconSend2 } from "@tabler/icons-react";
import axios from "axios";
import { useMemo } from "react";

export interface BanChatPropsType {
  banId: number | string;
  /** Who is looking at the chat. Their messages are shown on the right. */
  viewer: BanMessageSender;
}

function EmptyChat() {
  return (
    <Stack align="center">
      <IconMessageCircleOff size={40} color="var(--mantine-color-dimmed)" />
      <Text c="dimmed">No messages yet</Text>
    </Stack>
  );
}

function Message({
  message,
  viewer,
}: {
  message: BanMessage;
  viewer: BanMessageSender;
}) {
  const own = message.sender === viewer;

  return (
    <Group w="100%" justify={own ? "flex-end" : "flex-start"}>
      <Paper
        withBorder
        p="xs"
        maw="85%"
        bg={own ? "var(--mantine-primary-color-light)" : undefined}
      >
        <Stack gap={4}>
          <Text size="xs" fw={600} c="dimmed">
            {message.sender === "user" ? "User" : "Admins"}
          </Text>
          <Text size="sm" style={{ whiteSpace: "pre-wrap" }}>
            {message.body}
          </Text>
          <Group justify="flex-end">
            <Timestamp date={message.created_at} />
          </Group>
        </Stack>
      </Paper>
    </Group>
  );
}

function MessageForm({ banId }: { banId: number | string }) {
  const theme = useMantineTheme();
  const sendBanMessage = useSendBanMessage();
  const form = useForm({
    mode: "controlled",
    initialValues: { body: "" },
  });

  const handleSubmit = form.onSubmit(async (values) => {
    try {
      await sendBanMessage.mutateAsync({ banId, body: values.body });
      form.reset();
    } catch (error) {
      notifications.show({
        title: "Failed to send message",
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
    <form onSubmit={handleSubmit}>
      <Group gap="xs" align="flex-start">
        <Textarea
          placeholder="Write a message..."
          flex={1}
          autosize
          maxRows={4}
          maxLength={2000}
          {...form.getInputProps("body")}
          required
        />
        <ActionIcon
          type="submit"
          variant="transparent"
          loading={form.submitting}
          mt={6}
          aria-label="Send"
        >
          <IconSend2 color={theme.colors[theme.primaryColor][5]} />
        </ActionIcon>
      </Group>
    </form>
  );
}

export function BanChat({ banId, viewer }: BanChatPropsType) {
  const MessageComponent = useMemo(
    () =>
      ({ data }: { data: BanMessage }) => (
        <Message message={data} viewer={viewer} />
      ),
    [viewer],
  );

  return (
    <Stack h="100%" gap="sm" w="100%">
      {/* column-reverse keeps the newest messages in view at the bottom */}
      <Box
        style={{
          overflowY: "auto",
          flex: 1,
          minHeight: 0,
          display: "flex",
          flexDirection: "column-reverse",
        }}
      >
        <Box w="100%" style={{ flexShrink: 0 }}>
          <InfiniteScrolling
            name="messages"
            useQuery={useBanMessages}
            queryArgs={[banId]}
            Component={MessageComponent}
            Fallback={EmptyChat}
            gap="xs"
            reversed
          />
        </Box>
      </Box>

      <MessageForm banId={banId} />
    </Stack>
  );
}
