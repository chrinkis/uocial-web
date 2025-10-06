import { useUser } from "@/providers/user/hook";
import {
  Flex,
  Group,
  Title,
  useMantineTheme,
  Button,
  UnstyledButton,
  Menu,
} from "@mantine/core";
import { NavLink, useNavigate } from "react-router";
import { Avatar } from "@mantine/core";
import { IconLogout, IconSettings } from "@tabler/icons-react";
import invariant from "tiny-invariant";

function UserMenu() {
  const { user } = useUser();

  invariant(user);

  return (
    <Menu>
      <Menu.Target>
        <UnstyledButton>
          <Avatar bg="var(--mantine-color-body)" size="sm" name={user.name} />
        </UnstyledButton>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item leftSection={<IconSettings size={14} />}>Settings</Menu.Item>
        <Menu.Item leftSection={<IconLogout size={14} />}>Logout</Menu.Item>
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
