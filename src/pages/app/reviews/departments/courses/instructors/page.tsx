import { Anchor, Breadcrumbs, Stack, Text, Title } from "@mantine/core";
import { NavLink, useParams } from "react-router";
import invariant from "tiny-invariant";
import { useDepartment } from "@/queries/app/reviews/department";
import { useCourse } from "@/queries/app/reviews/course";
import { useCourseInstructors } from "@/queries/app/reviews/instructor";
import { InfiniteScrolling } from "@/components/InfiniteScrolling";
import { Instructor } from "@/components/app/reviews/Instructor";
import { InstructorSkeleton } from "@/components/app/reviews/InstructorSkeleton";

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
        <Anchor>instructors</Anchor>
      </Breadcrumbs>

      <Stack gap={2} align="center">
        <Title order={2}>Instructors</Title>
        <Text c="dimmed" size="sm" ta="center">
          Instructors that have taught this course.
        </Text>
      </Stack>

      <InfiniteScrolling
        useQuery={useCourseInstructors}
        queryArgs={[departmentId, courseId]}
        name="instructors"
        Component={({ data }) => <Instructor instructor={data} />}
        Fallback="No instructors found."
        loader={<InstructorSkeleton />}
      />
    </Stack>
  );
}
