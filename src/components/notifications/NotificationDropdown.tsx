import { useMemo, useState } from "react";
import {
  ActionIcon,
  Box,
  Button,
  Group,
  Indicator,
  Loader,
  Menu,
  Text,
} from "@mantine/core";
import { useQueryClient } from "@tanstack/react-query";
import { IconBell } from "@tabler/icons-react";
import { useUser } from "@/providers/user/hook";
import {
  useNotifications,
  useUnreadNotificationsCount,
  useMarkAllNotificationsRead,
} from "@/queries/app/notification";
import { InfiniteScrolling } from "@/components/InfiniteScrolling";
import type { Notification } from "@/models/Notification";
import { NotificationItem } from "./NotificationItem";
import { NotificationEmpty } from "./NotificationEmpty";

export function NotificationDropdown() {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const markAllRead = useMarkAllNotificationsRead();
  const [opened, setOpened] = useState(false);
  const { data: unreadCount = 0 } = useUnreadNotificationsCount(Boolean(user));

  function handleOpen() {
    void queryClient.invalidateQueries({ queryKey: ["notifications"] });
  }

  async function handleMarkAllRead() {
    await markAllRead.mutateAsync();
  }

  const NotificationComponent = useMemo(
    () =>
      ({ data }: { data: Notification }) => (
        <NotificationItem
          data={data}
          onSelect={() => {
            setOpened(false);
          }}
        />
      ),
    [],
  );

  return (
    <Menu
      opened={opened}
      onChange={setOpened}
      onOpen={handleOpen}
      position="bottom-end"
      offset={6}
      shadow="md"
      withArrow
      arrowSize={16}
      arrowPosition="center"
    >
      <Menu.Target>
        <Indicator
          disabled={unreadCount === 0}
          label={unreadCount > 99 ? "99+" : unreadCount}
          size={14}
          color="pink"
        >
          <ActionIcon variant="transparent" aria-label="Notifications">
            <IconBell color="var(--mantine-color-body)" />
          </ActionIcon>
        </Indicator>
      </Menu.Target>

      <Menu.Dropdown w="min(460px, 90vw)">
        <Group justify="space-between" px="xs" pt="xs" pb={0}>
          <Text size="sm" fw={600}>
            Notifications
          </Text>

          <Button
            size="compact-xs"
            variant="light"
            disabled={unreadCount === 0}
            loading={markAllRead.isPending}
            onClick={() => void handleMarkAllRead()}
          >
            Mark all as read
          </Button>
        </Group>

        <Box mah={400} style={{ overflowY: "auto" }}>
          <InfiniteScrolling
            name="notifications"
            useQuery={useNotifications}
            queryArgs={[opened]}
            Component={NotificationComponent}
            Fallback={NotificationEmpty}
            loader={<Loader py="xl" />}
            gap="4px"
          />
        </Box>
      </Menu.Dropdown>
    </Menu>
  );
}
