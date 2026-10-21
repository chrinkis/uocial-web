import {
  Anchor,
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
import { useCourseOfferings } from "@/queries/app/reviews/offering";
import { CourseHeader } from "@/components/app/reviews/CourseHeader";
import { CourseHeaderSkeleton } from "@/components/app/reviews/CourseHeaderSkeleton";
import { CourseOfferingsBar } from "@/components/app/reviews/CourseOfferingsBar";
import { CourseSemesterSkeleton } from "@/components/app/reviews/CourseSemesterSkeleton";
import { CourseOffering } from "@/components/app/reviews/CourseOffering";
import { CourseOfferingSkeleton } from "@/components/app/reviews/CourseOfferingSkeleton";
import { InfiniteScrolling } from "@/components/InfiniteScrolling";

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

            <InfiniteScrolling
              useQuery={useCourseOfferings}
              queryArgs={[departmentId, courseId]}
              name="offerings"
              Component={({ data }) => (
                <CourseOffering offering={data} departmentId={departmentId} />
              )}
              Fallback="No offerings found."
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
