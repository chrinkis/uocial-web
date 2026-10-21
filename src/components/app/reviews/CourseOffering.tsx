import { Badge, Group, Paper, Text, ThemeIcon } from "@mantine/core";
import { IconChevronRight } from "@tabler/icons-react";
import { NavLink } from "react-router";
import type { CourseOffering as CourseOfferingModel } from "@/models/app/reviews/CourseOffering";
import { getInstructorFullName } from "@/utils/app/reviews/instructor";
import { formatTerm } from "@/utils/app/reviews/semester";

export interface CourseOfferingPropsType {
  offering: CourseOfferingModel;
  departmentId: number | string;
}

export function CourseOffering({
  offering,
  departmentId,
}: CourseOfferingPropsType) {
  const instructors = offering.instructors.map(getInstructorFullName);

  return (
    <NavLink
      to={`/app/reviews/departments/${String(departmentId)}/courses/${String(offering.course_id)}/offerings/${String(offering.id)}`}
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
          <Group gap="sm" wrap="nowrap" style={{ minWidth: 0 }}>
            <Badge
              variant="light"
              color={offering.semester === "fall" ? "yellow" : "teal"}
              size="lg"
              radius="md"
              miw={112}
              h={40}
              px="sm"
            >
              {formatTerm(offering)}
            </Badge>

            <Text
              fw={600}
              truncate
              c={instructors.length > 0 ? undefined : "dimmed"}
            >
              {instructors.length > 0
                ? instructors.join(", ")
                : "No instructors listed"}
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
