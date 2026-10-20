import { Anchor, Breadcrumbs, Stack, Text, Title } from "@mantine/core";
import { NavLink, useParams } from "react-router";
import invariant from "tiny-invariant";
import { useDepartment } from "@/queries/app/reviews/department";
import { useCourses } from "@/queries/app/reviews/course";
import { DepartmentHeader } from "@/components/app/reviews/DepartmentHeader";
import { DepartmentHeaderSkeleton } from "@/components/app/reviews/DepartmentHeaderSkeleton";
import { Course } from "@/components/app/reviews/Course";
import { CourseSkeleton } from "@/components/app/reviews/CourseSkeleton";
import { InfiniteScrolling } from "@/components/InfiniteScrolling";

export default function Page() {
  const { departmentId } = useParams<{ departmentId: string }>();

  invariant(departmentId);

  const { data: department, isLoading } = useDepartment(departmentId);

  return (
    <Stack align="safe center" w="100%" h="100%" gap="md">
      <Breadcrumbs>
        <Anchor component={NavLink} to="/app/reviews/departments">
          departments
        </Anchor>
        <Anchor>
          {department ? department.code.toUpperCase() : "department"}
        </Anchor>
      </Breadcrumbs>

      {isLoading ? (
        <DepartmentHeaderSkeleton />
      ) : department ? (
        <DepartmentHeader department={department} />
      ) : (
        <Text c="dimmed">Department not found.</Text>
      )}

      {department && (
        <Stack align="safe center" w="100%" gap="sm">
          <Stack gap={2} align="center">
            <Title order={3}>Courses</Title>
            <Text c="dimmed" size="sm" ta="center">
              Choose a course to see its reviews.
            </Text>
          </Stack>

          <InfiniteScrolling
            useQuery={useCourses}
            queryArgs={[departmentId]}
            name="courses"
            Component={({ data }) => <Course course={data} />}
            Fallback="No courses found."
            loader={<CourseSkeleton />}
          />
        </Stack>
      )}
    </Stack>
  );
}
