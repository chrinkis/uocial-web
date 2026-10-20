import { Badge, Group, Paper, Stack, Text, ThemeIcon } from "@mantine/core";
import { IconChevronRight } from "@tabler/icons-react";
import { NavLink } from "react-router";
import type { Department as DepartmentModel } from "@/models/app/reviews/Department";

export interface DepartmentPropsType {
  department: DepartmentModel;
}

export function Department({ department }: DepartmentPropsType) {
  return (
    <NavLink
      to={`/app/reviews/departments/${String(department.id)}`}
      style={{
        display: "block",
        width: "90%",
        maxWidth: "50rem",
        color: "inherit",
        textDecoration: "none",
      }}
    >
      <Paper withBorder shadow="sm" radius="lg" p="md" w="100%">
        <Group justify="space-between" wrap="nowrap" gap="md">
          <Group gap="md" wrap="nowrap">
            <Badge
              variant="light"
              size="lg"
              radius="md"
              ff="monospace"
              tt="uppercase"
              w={68}
              h={44}
            >
              {department.code}
            </Badge>

            <Stack gap={2}>
              <Text fw={600} lineClamp={2}>
                {department.name}
              </Text>
              <Text size="xs" c="dimmed">
                Department
              </Text>
            </Stack>
          </Group>

          <ThemeIcon variant="light" color="gray" radius="xl" size="md">
            <IconChevronRight size={18} />
          </ThemeIcon>
        </Group>
      </Paper>
    </NavLink>
  );
}
