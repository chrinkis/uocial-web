import {
  ActionIcon,
  Drawer,
  Popover,
  SimpleGrid,
  Stack,
  Text,
  UnstyledButton,
  useMatches,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconLayoutGrid } from "@tabler/icons-react";
import { useLocation, useNavigate } from "react-router";
import { CATEGORIES, getActiveCategory } from "@/utils/categories";
import type { Category } from "@/utils/categories";

interface CategoryTileProps {
  category: Category;
  active: boolean;
  onSelect: (category: Category) => void;
  disabled: boolean;
}

function CategoryTile({
  category,
  active,
  onSelect,
  disabled,
}: CategoryTileProps) {
  const Icon = category.icon;

  return (
    <UnstyledButton
      aria-current={active ? "page" : undefined}
      onClick={() => {
        onSelect(category);
      }}
      p="sm"
      style={{
        borderRadius: "var(--mantine-radius-md)",
        backgroundColor: active
          ? "var(--mantine-primary-color-light)"
          : undefined,
      }}
      disabled={disabled}
      maw="128px"
    >
      <Stack align="center" gap={4}>
        <Icon
          size={32}
          color={
            active
              ? "var(--mantine-primary-color-filled)"
              : disabled
                ? "var(--mantine-color-dimmed)"
                : undefined
          }
        />
        <Text
          size="sm"
          ta="center"
          fw={active ? 600 : undefined}
          c={disabled ? "var(--mantine-color-dimmed)" : undefined}
        >
          {category.title}
        </Text>
      </Stack>
    </UnstyledButton>
  );
}

function CategoryGrid({ onSelect }: { onSelect: () => void }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const activeId = getActiveCategory(pathname)?.id;

  function handleSelect(category: Category) {
    onSelect();
    void navigate(category.path);
  }

  return (
    <SimpleGrid cols={3} spacing="xs">
      {CATEGORIES.map((category) => (
        <CategoryTile
          key={category.id}
          category={category}
          active={category.id === activeId}
          onSelect={handleSelect}
          disabled={!category.enabled}
        />
      ))}
    </SimpleGrid>
  );
}

export function CategorySwitcher() {
  const [opened, { toggle, close }] = useDisclosure(false);
  const isMobile = useMatches({ base: true, xs: false });

  const button = (
    <ActionIcon variant="transparent" aria-label="Categories" onClick={toggle}>
      <IconLayoutGrid color="var(--mantine-color-body)" />
    </ActionIcon>
  );

  if (isMobile) {
    return (
      <>
        {button}
        <Drawer
          opened={opened}
          onClose={close}
          position="bottom"
          title="Categories"
          radius="md"
        >
          <CategoryGrid onSelect={close} />
        </Drawer>
      </>
    );
  }

  return (
    <Popover
      opened={opened}
      onChange={close}
      position="bottom-end"
      shadow="md"
      withArrow
      arrowSize={12}
    >
      <Popover.Target>{button}</Popover.Target>
      <Popover.Dropdown>
        <CategoryGrid onSelect={close} />
      </Popover.Dropdown>
    </Popover>
  );
}
