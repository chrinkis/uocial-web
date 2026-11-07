import { useMemo } from "react";
import {
  Anchor,
  Breadcrumbs,
  Button,
  Group,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { IconFlag } from "@tabler/icons-react";
import { NavLink, useParams, useSearchParams } from "react-router";
import { CourseReportModal } from "@/components/app/reviews/CourseReportModal";
import { useModals } from "@/providers/modals/hook";
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
  getSearch,
  setInstructorFilter,
  setSearch,
} from "@/utils/app/reviews/filters";
import { LiveSearchInput } from "@/components/LiveSearchInput";

export default function Page() {
  const carry = useCarriedFilters();
  const { departmentId } = useParams<{ departmentId: string }>();

  invariant(departmentId);

  const modals = useModals();
  const [searchParams, setSearchParams] = useSearchParams();
  const instructorIds = useMemo(
    () => getInstructorFilter(searchParams),
    [searchParams],
  );

  const search = getSearch(searchParams);

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

          <Group w="90%" maw="32rem" wrap="nowrap" gap="xs">
            <LiveSearchInput
              value={search}
              placeholder="Search courses"
              onSearch={(next) => {
                setSearchParams((prev) => setSearch(prev, next), {
                  replace: true,
                });
              }}
            />
            <CoursesFilter
              departmentId={departmentId}
              value={{ instructorIds }}
              onApply={(filter) => {
                setSearchParams(
                  (prev) => setInstructorFilter(prev, filter.instructorIds),
                  { replace: true },
                );
              }}
            />
          </Group>

          <Button
            variant="subtle"
            size="compact-sm"
            leftSection={<IconFlag size={14} />}
            onClick={() => {
              modals.open({
                title: "Report a missing course",
                children: <CourseReportModal departmentId={department.id} />,
                centered: true,
              });
            }}
          >
            Can't find your course?
          </Button>

          <InfiniteScrolling
            useQuery={useCourses}
            queryArgs={[departmentId, instructorIds, search]}
            name="courses"
            Component={({ data }) => <Course course={data} />}
            Fallback={
              instructorIds.length > 0 || search !== ""
                ? "No courses found for the current search and filters."
                : "No courses found."
            }
            loader={<CourseSkeleton />}
          />
        </Stack>
      )}
    </Stack>
  );
}
