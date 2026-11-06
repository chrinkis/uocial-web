import { useState } from "react";
import type { ReactNode } from "react";
import {
  ActionIcon,
  Button,
  Drawer,
  Group,
  Indicator,
  Stack,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconFilter } from "@tabler/icons-react";

export interface FilterDrawerPropsType<T> {
  /** The currently applied filters. */
  value: T;
  /** The filters with nothing selected; used by "Clear". */
  emptyValue: T;
  /** How many filters are active, shown as a badge on the button. */
  activeCount: number;
  onApply: (value: T) => void;
  /** Renders the fields; edits go to a draft until "Apply" is pressed. */
  children: (draft: T, setDraft: (draft: T) => void) => ReactNode;
}

export function FilterDrawer<T>({
  value,
  emptyValue,
  activeCount,
  onApply,
  children,
}: FilterDrawerPropsType<T>) {
  const [opened, { open, close }] = useDisclosure(false);
  const [draft, setDraft] = useState<T>(value);

  return (
    <>
      <Indicator
        disabled={!activeCount}
        label={activeCount}
        size={14}
        color="red"
      >
        <ActionIcon
          variant="light"
          onClick={() => {
            setDraft(value);
            open();
          }}
          size="md"
        >
          <IconFilter size={16} />
        </ActionIcon>
      </Indicator>

      <Drawer opened={opened} onClose={close} title="Filters" size="md">
        <Stack gap="md">
          {children(draft, setDraft)}

          <Group justify="flex-end">
            <Button
              variant="default"
              onClick={() => {
                setDraft(emptyValue);
              }}
            >
              Clear
            </Button>
            <Button
              onClick={() => {
                onApply(draft);
                close();
              }}
            >
              Apply
            </Button>
          </Group>
        </Stack>
      </Drawer>
    </>
  );
}
