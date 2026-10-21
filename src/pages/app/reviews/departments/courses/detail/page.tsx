import {
  Anchor,
  Breadcrumbs,
  Group,
  Paper,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { IconChevronRight } from "@tabler/icons-react";
import { NavLink, useParams } from "react-router";
import invariant from "tiny-invariant";
import { useDepartment } from "@/queries/app/reviews/department";
import { useCourse } from "@/queries/app/reviews/course";
import { CourseHeader } from "@/components/app/reviews/CourseHeader";
import { CourseHeaderSkeleton } from "@/components/app/reviews/CourseHeaderSkeleton";
import { CourseOfferingsBar } from "@/components/app/reviews/CourseOfferingsBar";
import { CourseSemesterSkeleton } from "@/components/app/reviews/CourseSemesterSkeleton";
import { CourseLastOfferingSkeleton } from "@/components/app/reviews/CourseLastOfferingSkeleton";
import { getInstructorFullName } from "@/utils/app/reviews/instructor";
import { formatTerm } from "@/utils/app/reviews/semester";

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
          <CourseLastOfferingSkeleton />
          <CourseSemesterSkeleton />
        </>
      ) : course ? (
        <>
          <CourseHeader course={course} />
          {course.last_offering && (
            <NavLink
              to={`/app/reviews/departments/${departmentId}/courses/${courseId}/offerings/${String(course.last_offering.id)}`}
              style={{
                display: "block",
                width: "90%",
                maxWidth: "50rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              <Paper withBorder shadow="sm" radius="lg" p="lg" w="100%">
                <Stack gap="sm">
                  <Group justify="center" gap="xs">
                    <Title order={4}>Last Offered</Title>
                    <ThemeIcon
                      variant="light"
                      color="gray"
                      radius="xl"
                      size="sm"
                    >
                      <IconChevronRight size={16} />
                    </ThemeIcon>
                  </Group>

                  <Text size="sm" c="dimmed" ta="center">
                    on {formatTerm(course.last_offering)}
                    {course.last_offering.instructors.length > 0 &&
                      ` by ${course.last_offering.instructors.map(getInstructorFullName).join(", ")}`}
                  </Text>
                </Stack>
              </Paper>
            </NavLink>
          )}
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
        </>
      ) : (
        <Text c="dimmed">Course not found.</Text>
      )}
    </Stack>
  );
}
