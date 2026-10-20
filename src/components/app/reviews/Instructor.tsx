import { Avatar, Group, Paper, Stack, Text } from "@mantine/core";
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
    <Paper withBorder shadow="sm" radius="lg" p="sm" w="90%" maw="50rem">
      <Group gap="sm" wrap="nowrap">
        <Avatar name={fullName} color="initials" radius="xl" size="md" />

        <Stack gap={2} style={{ flex: 1, minWidth: 0 }}>
          <Text fw={600}>{fullName}</Text>

          {stats ? (
            <>
              <Text size="xs" c="dimmed">
                {stats.courses}
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
    </Paper>
  );
}
