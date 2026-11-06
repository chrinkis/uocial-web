import { Anchor, Breadcrumbs, Group, Stack, Text, Title } from "@mantine/core";
import { NavLink, useParams, useSearchParams } from "react-router";
import { useCarriedFilters } from "@/hooks/useCarriedFilters";
import invariant from "tiny-invariant";
import { useDepartment } from "@/queries/app/reviews/department";
import { useCourse } from "@/queries/app/reviews/course";
import { useCourseInstructors } from "@/queries/app/reviews/instructor";
import { LiveSearchInput } from "@/components/LiveSearchInput";
import { getSearch, setSearch } from "@/utils/app/reviews/filters";
import { InfiniteScrolling } from "@/components/InfiniteScrolling";
import { Instructor } from "@/components/app/reviews/Instructor";
import { InstructorSkeleton } from "@/components/app/reviews/InstructorSkeleton";

export default function Page() {
  const carry = useCarriedFilters();
  const [searchParams, setSearchParams] = useSearchParams();
  const search = getSearch(searchParams);
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
        <Anchor component={NavLink} to={carry("/app/reviews/departments")}>
          departments
        </Anchor>
        <Anchor
          component={NavLink}
          to={carry(`/app/reviews/departments/${departmentId}`)}
        >
          {department ? department.code.toUpperCase() : "department"}
        </Anchor>
        <Anchor
          component={NavLink}
          to={carry(
            `/app/reviews/departments/${departmentId}/courses/${courseId}`,
          )}
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

      <Group w="90%" maw="50rem" wrap="nowrap">
        <LiveSearchInput
          value={search}
          placeholder="Search instructors"
          onSearch={(next) => {
            setSearchParams((prev) => setSearch(prev, next), { replace: true });
          }}
        />
      </Group>

      <InfiniteScrolling
        useQuery={useCourseInstructors}
        queryArgs={[departmentId, courseId, search]}
        name="instructors"
        Component={({ data }) => <Instructor instructor={data} />}
        Fallback={
          search === ""
            ? "No instructors found."
            : "No instructors found for the current search."
        }
        loader={<InstructorSkeleton />}
      />
    </Stack>
  );
}
