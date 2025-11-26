import { useUser } from "@/providers/user/hook";
import {
  Flex,
  Group,
  Title,
  useMantineTheme,
  Button,
  UnstyledButton,
  Menu,
  Switch,
} from "@mantine/core";
import { NavLink, useNavigate } from "react-router";
import { Avatar } from "@mantine/core";
import {
  IconBookmark,
  IconDeviceDesktopAnalytics,
  IconLogout,
  IconSettings,
} from "@tabler/icons-react";
import invariant from "tiny-invariant";
import { useSettings } from "@/providers/settings/hook";
import { isModerator } from "@/utils/user";

function UserMenu() {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const { settings, setSettings } = useSettings();

  invariant(user);

  async function handleSavedPosts() {
    await navigate("app/posts/saved");
  }

  function handleLogout() {
    void logout();
  }

  async function handleSettings() {
    await navigate("/settings");
  }

  function handleModerationToggle() {
    setSettings((settings) => ({
      ...settings,
      moderatorMode: !settings.moderatorMode,
    }));
  }

  async function handleDashboard() {
    await navigate("/app/moderation/dashboard");
  }

  return (
    <Menu>
      <Menu.Target>
        <UnstyledButton>
          <Avatar bg="var(--mantine-color-body)" size="sm" name={user.name} />
        </UnstyledButton>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>Application</Menu.Label>

        <Menu.Item
          leftSection={<IconBookmark size={14} />}
          onClick={() => void handleSavedPosts()}
        >
          Saved Posts
        </Menu.Item>

        <Menu.Item
          leftSection={<IconSettings size={14} />}
          onClick={() => void handleSettings()}
        >
          Settings
        </Menu.Item>

        {isModerator(user) && (
          <>
            <Menu.Divider />

            <Menu.Label>Moderation</Menu.Label>

            <Menu.Item onClick={handleModerationToggle}>
              <Switch
                size="xs"
                checked={settings.moderatorMode}
                label="Enabled"
                onClick={handleModerationToggle}
              />
            </Menu.Item>

            <Menu.Item
              leftSection={<IconDeviceDesktopAnalytics size={14} />}
              onClick={() => void handleDashboard()}
            >
              Dashboard
            </Menu.Item>
          </>
        )}

        <Menu.Divider />

        <Menu.Item
          leftSection={<IconLogout size={14} />}
          onClick={handleLogout}
        >
          Logout
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}

function AuthMenu() {
  const navigate = useNavigate();

  function handleLogin() {
    void navigate("/auth/login");
  }

  function handleSignUp() {
    void navigate("/auth/register");
  }

  return (
    <Group gap="sm">
      <Button size="xs" onClick={handleLogin}>
        Login
      </Button>
      <Button size="sm" onClick={handleSignUp}>
        Sign-Up
      </Button>
    </Group>
  );
}

function Logo() {
  return (
    <NavLink to="/">
      <Title order={1} size={37} c="var(--mantine-color-body)">
        Uocial
      </Title>
    </NavLink>
  );
}

export function Header() {
  const theme = useMantineTheme();
  const { user } = useUser();

  return (
    <Flex
      w="100%"
      bg={theme.colors[theme.primaryColor][5]}
      pl={8}
      pr={16}
      justify="space-between"
      align="center"
    >
      <Logo />
      {user ? <UserMenu /> : <AuthMenu />}
    </Flex>
  );
}
