import { useState } from "react";
import { Badge, Button, Drawer, Group, Stack } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconFilter } from "@tabler/icons-react";
import { InstructorMultiSelect } from "@/components/app/reviews/InstructorMultiSelect";

export interface DepartmentsFilterPropsType {
  instructorIds: number[];
  onApply: (instructorIds: number[]) => void;
}

export function DepartmentsFilter({
  instructorIds,
  onApply,
}: DepartmentsFilterPropsType) {
  const [opened, { open, close }] = useDisclosure(false);
  const [draft, setDraft] = useState<number[]>(instructorIds);

  return (
    <>
      <Button
        variant="light"
        leftSection={<IconFilter size={16} />}
        rightSection={
          instructorIds.length > 0 ? (
            <Badge size="sm" circle>
              {instructorIds.length}
            </Badge>
          ) : undefined
        }
        onClick={() => {
          setDraft(instructorIds);
          open();
        }}
      >
        Filters
      </Button>

      <Drawer opened={opened} onClose={close} title="Filters" size="md">
        <Stack gap="md">
          <Stack gap={4}>
            <InstructorMultiSelect value={draft} onChange={setDraft} />
          </Stack>

          <Group justify="flex-end" mt="auto">
            <Button
              variant="default"
              onClick={() => {
                setDraft([]);
              }}
              disabled={draft.length === 0}
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
