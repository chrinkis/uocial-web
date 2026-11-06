import { Avatar, Group, Paper, Stack, Text, ThemeIcon } from "@mantine/core";
import { IconChevronRight } from "@tabler/icons-react";
import { NavLink } from "react-router";
import type { Instructor as InstructorModel } from "@/models/app/reviews/Instructor";
import {
  getInstructorFullName,
  getInstructorStats,
} from "@/utils/app/reviews/instructor";

export interface InstructorPropsType {
  instructor: InstructorModel;
}

export function Instructor({ instructor }: InstructorPropsType) {
  const fullName = getInstructorFullName(instructor);
  const stats = getInstructorStats(instructor);

  return (
    <NavLink
      to={`/app/reviews/instructors/${String(instructor.id)}`}
      style={{
        display: "block",
        width: "90%",
        maxWidth: "50rem",
        color: "inherit",
        textDecoration: "none",
      }}
    >
      <Paper withBorder shadow="sm" radius="lg" p="sm" w="100%">
        <Group justify="space-between" wrap="nowrap" gap="sm">
          <Group gap="sm" wrap="nowrap" style={{ flex: 1, minWidth: 0 }}>
            <Avatar name={fullName} color="initials" radius="xl" size="md" />

            <Stack gap={2} style={{ flex: 1, minWidth: 0 }}>
              <Text fw={600}>{fullName}</Text>

              {stats ? (
                <>
                  <Text size="xs" c="dimmed">
                    {stats.summary}
                  </Text>
                  {stats.lastTaught && (
                    <Text size="xs" c="dimmed">
                      {stats.lastTaught}
                    </Text>
                  )}
                </>
              ) : (
                <Text size="xs" c="dimmed">
                  Instructor
                </Text>
              )}
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
