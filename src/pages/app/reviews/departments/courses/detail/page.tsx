import {
  Anchor,
  Badge,
  Breadcrumbs,
  Group,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { NavLink, useParams } from "react-router";
import invariant from "tiny-invariant";
import { useDepartment } from "@/queries/app/reviews/department";
import { useCourse } from "@/queries/app/reviews/course";
import { CourseSkeleton } from "@/components/app/reviews/CourseSkeleton";

export default function Page() {
  const { departmentId, courseId } = useParams<{
    departmentId: string;
    courseId: string;
  }>();

  invariant(departmentId);
  invariant(courseId);

  const { data: department } = useDepartment(departmentId);
  const { data: course, isLoading } = useCourse(departmentId, courseId);

  return (
    <Stack align="safe center" w="100%" h="100%" gap="md">
      <Breadcrumbs>
        <Anchor component={NavLink} to="/app/reviews/departments">
          departments
        </Anchor>
        <Anchor
          component={NavLink}
          to={`/app/reviews/departments/${departmentId}`}
        >
          {department ? department.code.toUpperCase() : "department"}
        </Anchor>
        <Anchor>{course ? course.code.toUpperCase() : "course"}</Anchor>
      </Breadcrumbs>

      {isLoading ? (
        <CourseSkeleton />
      ) : course ? (
        <Paper withBorder shadow="sm" radius="lg" p="lg" w="90%" maw="50rem">
          <Stack gap="sm">
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

            <Text c="dimmed">
              Course reviews for this course are coming soon.
            </Text>
          </Stack>
        </Paper>
      ) : (
        <Text c="dimmed">Course not found.</Text>
      )}
    </Stack>
  );
}
