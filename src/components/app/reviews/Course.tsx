import { Badge, Group, Paper, Text, ThemeIcon } from "@mantine/core";
import { IconChevronRight } from "@tabler/icons-react";
import { NavLink } from "react-router";
import type { Course as CourseModel } from "@/models/app/reviews/Course";

export interface CoursePropsType {
  course: CourseModel;
}

export function Course({ course }: CoursePropsType) {
  return (
    <NavLink
      to={`/app/reviews/departments/${String(course.department_id)}/courses/${String(course.id)}`}
      style={{
        display: "block",
        width: "90%",
        maxWidth: "50rem",
        color: "inherit",
        textDecoration: "none",
      }}
    >
      <Paper withBorder shadow="sm" radius="lg" p="sm" w="100%">
        <Group justify="space-between" wrap="nowrap" gap="md">
          <Group gap="sm" wrap="nowrap">
            <Badge
              variant="light"
              size="lg"
              radius="md"
              ff="monospace"
              tt="uppercase"
              miw={96}
              h={40}
              px="sm"
            >
              {course.code}
            </Badge>

            <Text fw={600} lineClamp={2}>
              {course.name}
            </Text>
          </Group>

          <ThemeIcon variant="light" color="gray" radius="xl" size="md">
            <IconChevronRight size={18} />
          </ThemeIcon>
        </Group>
      </Paper>
    </NavLink>
  );
}
