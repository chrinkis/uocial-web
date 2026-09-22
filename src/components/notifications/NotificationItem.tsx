import {
  IconAlertTriangle,
  IconBan,
  IconCheck,
  IconMessageCircle,
  IconMessageCirclePlus,
} from "@tabler/icons-react";
import {
  Group,
  Stack,
  Text,
  UnstyledButton,
  useMantineTheme,
} from "@mantine/core";
import type { ReactNode } from "react";
import type { Notification, NotificationType } from "@/models/Notification";
import { Timestamp } from "@/components/Timestamp";
import { useMarkNotificationRead } from "@/queries/app/notification";

function getMessage(notification: Notification): string {
  const postId = `#${String(notification.post_id)}`;
  const commentPostId = `post ${postId}`;

  const messages: Record<NotificationType, string> = {
    newCommentToPost: `New comment on ${postId}`,
    newCommentToPostComment: `New reply on a comment in ${commentPostId}`,
    postHiddenUntilReview: `${postId} was hidden until review`,
    postHiddenByModerator: `${postId} was hidden by a moderator`,
    postUnhiddenByModerator: `${postId} was unhidden by a moderator`,
    postCommentHiddenUntilReview: `Comment in ${commentPostId} was hidden until review`,
    postCommentHiddenByModerator: `Comment in ${commentPostId} was hidden by a moderator`,
    postCommentUnhiddenByModerator: `Comment in ${commentPostId} was unhidden`,
  };

  return messages[notification.type];
}

function getIcon(notification: Notification) {
  const color =
    notification.type === "postHiddenUntilReview" ||
    notification.type === "postCommentHiddenUntilReview"
      ? "orange"
      : notification.type.includes("Unhidden")
        ? "green"
        : notification.type.endsWith("ByModerator")
          ? "red"
          : notification.type.startsWith("newComment")
            ? "blue"
            : "green";

  let icon: ReactNode;

  switch (true) {
    case notification.type === "newCommentToPost":
      icon = <IconMessageCircle size={18} />;
      break;
    case notification.type === "newCommentToPostComment":
      icon = <IconMessageCirclePlus size={18} />;
      break;
    case notification.type.endsWith("HiddenUntilReview"):
      icon = <IconAlertTriangle size={18} />;
      break;
    case notification.type.endsWith("HiddenByModerator"):
      icon = <IconBan size={18} />;
      break;
    default:
      icon = <IconCheck size={18} />;
  }

  return { icon, color };
}

interface NotificationItemProps {
  data: Notification;
  onSelect?: () => void;
}

export function NotificationItem({ data, onSelect }: NotificationItemProps) {
  const theme = useMantineTheme();
  const markRead = useMarkNotificationRead();
  const isUnread = !data.read;
  const { icon, color } = getIcon(data);

  async function handleClick() {
    if (isUnread) {
      await markRead.mutateAsync({ id: data.id });
    }

    onSelect?.();
  }

  return (
    <UnstyledButton
      w="100%"
      onClick={() => void handleClick()}
      p="xs"
      style={{
        borderRadius: theme.radius.sm,
        backgroundColor: isUnread
          ? `color-mix(in srgb, ${theme.colors[theme.primaryColor][5]} 10%, transparent)`
          : undefined,
      }}
    >
      <Group wrap="nowrap" align="flex-start">
        <div style={{ color: `var(--mantine-color-${color}-6)` }}>{icon}</div>

        <Stack gap={2} flex={1}>
          <Text
            size="sm"
            fw={isUnread ? 600 : 400}
            style={{ whiteSpace: "normal" }}
          >
            {getMessage(data)}
          </Text>

          <Timestamp date={data.created_at} />
        </Stack>
      </Group>
    </UnstyledButton>
  );
}
