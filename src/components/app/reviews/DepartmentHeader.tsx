import { Badge, Group, Paper, Title } from "@mantine/core";
import type { Department } from "@/models/app/reviews/Department";

export interface DepartmentHeaderPropsType {
  department: Department;
}

export function DepartmentHeader({ department }: DepartmentHeaderPropsType) {
  return (
    <Paper withBorder shadow="sm" radius="lg" p="lg" w="90%" maw="50rem">
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
    </Paper>
  );
}
