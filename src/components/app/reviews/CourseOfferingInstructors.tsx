import {
  Avatar,
  Group,
  Paper,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { IconChevronRight } from "@tabler/icons-react";
import { NavLink } from "react-router";
import type { CourseOffering } from "@/models/app/reviews/CourseOffering";
import { getInstructorFullName } from "@/utils/app/reviews/instructor";

export interface CourseOfferingInstructorsPropsType {
  offering: CourseOffering;
}

export function CourseOfferingInstructors({
  offering,
}: CourseOfferingInstructorsPropsType) {
  return (
    <Paper withBorder shadow="sm" radius="lg" p="lg" w="90%" maw="50rem">
      <Stack gap="sm">
        <Group justify="center" gap={6}>
          <Title order={4}>Instructors</Title>
          <Text c="dimmed" size="sm">
            ({String(offering.instructors.length)})
          </Text>
        </Group>

        {offering.instructors.length === 0 ? (
          <Text c="dimmed" size="sm" ta="center">
            No instructors listed.
          </Text>
        ) : (
          offering.instructors.map((instructor) => {
            const fullName = getInstructorFullName(instructor);

            return (
              <NavLink
                key={instructor.id}
                to={`/app/reviews/instructors/${String(instructor.id)}`}
                style={{ color: "inherit", textDecoration: "none" }}
              >
                <Group justify="space-between" gap="sm" wrap="nowrap">
                  <Group gap="sm" wrap="nowrap" style={{ minWidth: 0 }}>
                    <Avatar
                      name={fullName}
                      color="initials"
                      radius="xl"
                      size="md"
                    />

                    <Text fw={600} truncate>
                      {fullName}
                    </Text>
                  </Group>

                  <ThemeIcon variant="light" color="gray" radius="xl" size="md">
                    <IconChevronRight size={18} />
                  </ThemeIcon>
                </Group>
              </NavLink>
            );
          })
        )}
      </Stack>
    </Paper>
  );
}
