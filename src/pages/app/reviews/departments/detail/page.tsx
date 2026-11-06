import { useMemo } from "react";
import { Anchor, Breadcrumbs, Group, Stack, Text, Title } from "@mantine/core";
import { NavLink, useParams, useSearchParams } from "react-router";
import { useCarriedFilters } from "@/hooks/useCarriedFilters";
import invariant from "tiny-invariant";
import { useDepartment } from "@/queries/app/reviews/department";
import { useCourses } from "@/queries/app/reviews/course";
import { DepartmentHeader } from "@/components/app/reviews/DepartmentHeader";
import { DepartmentHeaderSkeleton } from "@/components/app/reviews/DepartmentHeaderSkeleton";
import { Course } from "@/components/app/reviews/Course";
import { CourseSkeleton } from "@/components/app/reviews/CourseSkeleton";
import { InfiniteScrolling } from "@/components/InfiniteScrolling";
import { CoursesFilter } from "@/components/app/reviews/CoursesFilter";
import {
  getInstructorFilter,
  setInstructorFilter,
} from "@/utils/app/reviews/filters";

export default function Page() {
  const carry = useCarriedFilters();
  const { departmentId } = useParams<{ departmentId: string }>();

  invariant(departmentId);

  const [searchParams, setSearchParams] = useSearchParams();
  const instructorIds = useMemo(
    () => getInstructorFilter(searchParams),
    [searchParams],
  );

  const { data: department, isLoading } = useDepartment(
    departmentId,
    instructorIds,
  );

  return (
    <Stack align="safe center" w="100%" h="100%" gap="md">
      <Breadcrumbs>
        <Anchor component={NavLink} to={carry("/app/reviews/departments")}>
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
            <Group gap={6} align="center" justify="center">
              <Title order={3}>Courses</Title>
              <Text c="dimmed" size="sm">
                ({String(department.courses_count)})
              </Text>
            </Group>
            <Text c="dimmed" size="sm" ta="center">
              Choose a course to see its reviews.
            </Text>
          </Stack>

          <CoursesFilter
            departmentId={departmentId}
            value={{ instructorIds }}
            onApply={(filter) => {
              setSearchParams(
                setInstructorFilter(searchParams, filter.instructorIds),
                {
                  replace: true,
                },
              );
            }}
          />

          <InfiniteScrolling
            useQuery={useCourses}
            queryArgs={[departmentId, instructorIds]}
            name="courses"
            Component={({ data }) => <Course course={data} />}
            Fallback={
              instructorIds.length > 0
                ? "No courses found for the selected instructors."
                : "No courses found."
            }
            loader={<CourseSkeleton />}
          />
        </Stack>
      )}
    </Stack>
  );
}
