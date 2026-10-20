import { Avatar, Group, Paper, Stack, Text } from "@mantine/core";
import type { Instructor as InstructorModel } from "@/models/app/reviews/Instructor";

export interface InstructorPropsType {
  instructor: InstructorModel;
}

function getFullName(instructor: InstructorModel) {
  return [instructor.first_name, instructor.middle_name, instructor.last_name]
    .filter(Boolean)
    .join(" ");
}

export function Instructor({ instructor }: InstructorPropsType) {
  const fullName = getFullName(instructor);

  return (
    <Paper withBorder shadow="sm" radius="lg" p="sm" w="90%" maw="50rem">
      <Group gap="sm" wrap="nowrap">
        <Avatar name={fullName} color="initials" radius="xl" size="md" />

        <Stack gap={0}>
          <Text fw={600}>{fullName}</Text>
          <Text size="xs" c="dimmed">
            Instructor
          </Text>
        </Stack>
      </Group>
    </Paper>
  );
}
