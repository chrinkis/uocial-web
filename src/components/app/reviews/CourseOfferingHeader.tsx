import {
  Anchor,
  Badge,
  Group,
  Paper,
  Rating,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { IconChevronRight } from "@tabler/icons-react";
import { NavLink } from "react-router";
import { useState } from "react";
import type { CourseOffering } from "@/models/app/reviews/CourseOffering";
import { generateMockRating } from "@/utils/app/reviews/rating";
import { getYearFor } from "@/utils/app/reviews/semester";

export interface CourseOfferingHeaderPropsType {
  offering: CourseOffering;
  departmentId: number | string;
}

export function CourseOfferingHeader({
  offering,
  departmentId,
}: CourseOfferingHeaderPropsType) {
  const [{ average, count }] = useState(generateMockRating);

  return (
    <Paper withBorder shadow="sm" radius="lg" p="lg" w="90%" maw="50rem">
      <Stack gap="xs">
        <Group gap="md" wrap="nowrap">
          <Badge
            variant="light"
            color={offering.semester === "fall" ? "yellow" : "teal"}
            size="lg"
            radius="md"
            miw={80}
            h={44}
            px="sm"
          >
            {offering.semester}
          </Badge>

          <Title order={2} size="h3">
            {String(getYearFor(offering.year, offering.semester))}
          </Title>
        </Group>

        <Anchor
          component={NavLink}
          to={`/app/reviews/departments/${String(departmentId)}/courses/${String(offering.course_id)}/offerings/${String(offering.id)}/reviews`}
          c="inherit"
          underline="never"
          w="fit-content"
        >
          <Group gap="xs" wrap="wrap">
            <Rating value={average} fractions={2} readOnly size="md" />
            <Text fw={600}>{average.toFixed(1)}</Text>
            <Text size="sm" c="dimmed">
              ({count} reviews)
            </Text>
            <IconChevronRight size={16} color="var(--mantine-color-dimmed)" />
          </Group>
        </Anchor>
      </Stack>
    </Paper>
  );
}
