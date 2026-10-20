import {
  Badge,
  Button,
  Group,
  Paper,
  Rating,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { IconChevronRight, IconUsers } from "@tabler/icons-react";
import { NavLink } from "react-router";
import { useState } from "react";
import type { Department } from "@/models/app/reviews/Department";

export interface DepartmentHeaderPropsType {
  department: Department;
}

// FIXME: Replace with the real department rating once the API exposes it.
function generateMockRating() {
  return {
    average: Math.round((3.8 + Math.random() * 1.2) * 10) / 10,
    count: Math.floor(Math.random() * 190) + 10,
  };
}

export function DepartmentHeader({ department }: DepartmentHeaderPropsType) {
  const [{ average, count }] = useState(generateMockRating);

  return (
    <Paper withBorder shadow="sm" radius="lg" p="lg" w="90%" maw="50rem">
      <Group justify="space-between" align="end" wrap="wrap" gap="md">
        <Stack gap="xs">
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

            <Title order={2} size="h3">
              {department.name}
            </Title>
          </Group>

          <Group gap="xs" wrap="wrap">
            <Rating value={average} fractions={2} readOnly size="md" />
            <Text fw={600}>{average.toFixed(1)}</Text>
            <Text size="sm" c="dimmed">
              ({count} reviews)
            </Text>
          </Group>
        </Stack>

        <Button
          component={NavLink}
          to={`/app/reviews/departments/${String(department.id)}/instructors`}
          variant="light"
          leftSection={<IconUsers size={16} />}
          rightSection={<IconChevronRight size={16} />}
          w={{ base: "100%", xs: "auto" }}
        >
          Instructors
        </Button>
      </Group>
    </Paper>
  );
}
