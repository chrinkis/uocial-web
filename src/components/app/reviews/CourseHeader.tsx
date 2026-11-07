import {
  Anchor,
  Badge,
  Button,
  Group,
  Paper,
  Rating,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { IconChevronRight, IconFlag, IconUsers } from "@tabler/icons-react";
import { NavLink } from "react-router";
import { useCarriedFilters } from "@/hooks/useCarriedFilters";
import { useState } from "react";
import type { Course } from "@/models/app/reviews/Course";
import { useModals } from "@/providers/modals/hook";
import { generateMockRating } from "@/utils/app/reviews/rating";
import { CourseReportModal } from "./CourseReportModal";

export interface CourseHeaderPropsType {
  course: Course;
}

export function CourseHeader({ course }: CourseHeaderPropsType) {
  const carry = useCarriedFilters();
  const [{ average, count }] = useState(generateMockRating);
  const modals = useModals();

  function handleReportClick() {
    modals.open({
      title: `Report ${course.name}`,
      children: (
        <CourseReportModal
          departmentId={course.department_id}
          course={course}
        />
      ),
      centered: true,
    });
  }

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
              miw={96}
              h={44}
              px="sm"
            >
              {course.code}
            </Badge>

            <Title order={2} size="h3">
              {course.name}
            </Title>
          </Group>

          <Anchor
            component={NavLink}
            to={carry(
              `/app/reviews/departments/${String(course.department_id)}/courses/${String(course.id)}/reviews`,
            )}
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

        <Group gap="xs" w={{ base: "100%", xs: "auto" }}>
          <Button
            variant="default"
            leftSection={<IconFlag size={16} />}
            w={{ base: "100%", xs: "auto" }}
            onClick={handleReportClick}
          >
            Report
          </Button>

          <Button
            component={NavLink}
            to={carry(
              `/app/reviews/departments/${String(course.department_id)}/courses/${String(course.id)}/instructors`,
            )}
            variant="light"
            leftSection={<IconUsers size={16} />}
            rightSection={<IconChevronRight size={16} />}
            w={{ base: "100%", xs: "auto" }}
          >
            Instructors ({String(course.instructors_count)})
          </Button>
        </Group>
      </Group>
    </Paper>
  );
}
