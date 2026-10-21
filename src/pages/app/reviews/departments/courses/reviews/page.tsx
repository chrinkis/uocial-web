import { Anchor, Breadcrumbs, Stack, Text, Title } from "@mantine/core";
import { NavLink, useParams } from "react-router";
import invariant from "tiny-invariant";
import { useDepartment } from "@/queries/app/reviews/department";
import { useCourse } from "@/queries/app/reviews/course";

export default function Page() {
  const { departmentId, courseId } = useParams<{
    departmentId: string;
    courseId: string;
  }>();

  invariant(departmentId);
  invariant(courseId);

  const { data: department } = useDepartment(departmentId);
  const { data: course } = useCourse(departmentId, courseId);

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
        <Anchor
          component={NavLink}
          to={`/app/reviews/departments/${departmentId}/courses/${courseId}`}
        >
          {course ? course.code.toUpperCase() : "course"}
        </Anchor>
        <Anchor>reviews</Anchor>
      </Breadcrumbs>

      <Stack gap={2} align="center">
        <Title order={2}>Reviews</Title>
        <Text c="dimmed" size="sm" ta="center">
          Reviews for this course are coming soon.
        </Text>
      </Stack>
    </Stack>
  );
}
