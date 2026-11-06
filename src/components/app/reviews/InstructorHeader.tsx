import {
  Avatar,
  Group,
  Paper,
  Rating,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useState } from "react";
import type { Instructor } from "@/models/app/reviews/Instructor";
import { getInstructorFullName } from "@/utils/app/reviews/instructor";
import { generateMockRating } from "@/utils/app/reviews/rating";

export interface InstructorHeaderPropsType {
  instructor: Instructor;
}

export function InstructorHeader({ instructor }: InstructorHeaderPropsType) {
  const [{ average, count }] = useState(generateMockRating);
  const fullName = getInstructorFullName(instructor);

  return (
    <Paper withBorder shadow="sm" radius="lg" p="lg" w="90%" maw="50rem">
      <Stack gap="xs">
        <Group gap="md" wrap="nowrap">
          <Avatar
            name={fullName}
            color="initials"
            radius="md"
            w={44}
            h={44}
            styles={{ root: { flexShrink: 0 } }}
          />

          <Title order={2} size="h3">
            {fullName}
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
    </Paper>
  );
}
