import { useMemo } from "react";
import {
  Anchor,
  Breadcrumbs,
  Button,
  Group,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { IconFlag } from "@tabler/icons-react";
import { NavLink, useParams, useSearchParams } from "react-router";
import { OfferingReportModal } from "@/components/app/reviews/OfferingReportModal";
import { useModals } from "@/providers/modals/hook";
import { useCarriedFilters } from "@/hooks/useCarriedFilters";
import invariant from "tiny-invariant";
import { useDepartment } from "@/queries/app/reviews/department";
import { useCourse } from "@/queries/app/reviews/course";
import { useCourseOfferings } from "@/queries/app/reviews/offering";
import { CourseHeader } from "@/components/app/reviews/CourseHeader";
import { CourseHeaderSkeleton } from "@/components/app/reviews/CourseHeaderSkeleton";
import { CourseOfferingsBar } from "@/components/app/reviews/CourseOfferingsBar";
import { CourseSemesterSkeleton } from "@/components/app/reviews/CourseSemesterSkeleton";
import { CourseOffering } from "@/components/app/reviews/CourseOffering";
import { CourseOfferingSkeleton } from "@/components/app/reviews/CourseOfferingSkeleton";
import { InfiniteScrolling } from "@/components/InfiniteScrolling";
import { OfferingsFilter } from "@/components/app/reviews/OfferingsFilter";
import {
  getInstructorFilter,
  getSearch,
  setInstructorFilter,
  setSearch,
} from "@/utils/app/reviews/filters";
import { LiveSearchInput } from "@/components/LiveSearchInput";

export default function Page() {
  const carry = useCarriedFilters();
  const { departmentId, courseId } = useParams<{
    departmentId: string;
    courseId: string;
  }>();

  invariant(departmentId);
  invariant(courseId);

  const modals = useModals();
  const { data: department } = useDepartment(departmentId);
  const [searchParams, setSearchParams] = useSearchParams();
  const instructorIds = useMemo(
    () => getInstructorFilter(searchParams),
    [searchParams],
  );

  const search = getSearch(searchParams);

  const { data: course, isLoading } = useCourse(
    departmentId,
    courseId,
    instructorIds,
  );

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
        <Anchor>{course ? course.code.toUpperCase() : "course"}</Anchor>
      </Breadcrumbs>

      {isLoading ? (
        <>
          <CourseHeaderSkeleton />
          <CourseSemesterSkeleton />
        </>
      ) : course ? (
        <>
          <CourseHeader course={course} />

          <Paper withBorder shadow="sm" radius="lg" p="lg" w="90%" maw="50rem">
            <Stack gap="sm">
              <Group justify="center">
                <Title order={4}>Semester</Title>
              </Group>

              <CourseOfferingsBar
                fall={course.offerings_by_semester.fall}
                spring={course.offerings_by_semester.spring}
              />
            </Stack>
          </Paper>

          <Stack align="safe center" w="100%" gap="sm">
            <Stack gap={2} align="center">
              <Group gap={6} align="center" justify="center">
                <Title order={3}>Offerings</Title>
                <Text c="dimmed" size="sm">
                  ({String(course.offerings_count)})
                </Text>
              </Group>
              <Text c="dimmed" size="sm" ta="center">
                Pick a term to see its reviews.
              </Text>
            </Stack>

            <Group w="90%" maw="32rem" wrap="nowrap" gap="xs">
              <LiveSearchInput
                value={search}
                placeholder="Search by year or semester"
                onSearch={(next) => {
                  setSearchParams((prev) => setSearch(prev, next), {
                    replace: true,
                  });
                }}
              />
              <OfferingsFilter
                departmentId={departmentId}
                courseId={courseId}
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
                  title: "Report a missing offering",
                  children: (
                    <OfferingReportModal
                      departmentId={departmentId}
                      courseId={courseId}
                    />
                  ),
                  centered: true,
                });
              }}
            >
              Can't find an offering?
            </Button>

            <InfiniteScrolling
              useQuery={useCourseOfferings}
              queryArgs={[departmentId, courseId, instructorIds, search]}
              name="offerings"
              Component={({ data }) => (
                <CourseOffering offering={data} departmentId={departmentId} />
              )}
              Fallback={
                instructorIds.length > 0 || search !== ""
                  ? "No offerings found for the current search and filters."
                  : "No offerings found."
              }
              loader={<CourseOfferingSkeleton />}
            />
          </Stack>
        </>
      ) : (
        <Text c="dimmed">Course not found.</Text>
      )}
    </Stack>
  );
}
