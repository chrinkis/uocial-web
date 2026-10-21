import { Anchor, Breadcrumbs, Stack, Text, Title } from "@mantine/core";
import { NavLink, useParams } from "react-router";
import invariant from "tiny-invariant";
import { useDepartment } from "@/queries/app/reviews/department";
import { useCourse } from "@/queries/app/reviews/course";
import { useCourseOffering } from "@/queries/app/reviews/offering";
import { formatTerm } from "@/utils/app/reviews/semester";

export default function Page() {
  const { departmentId, courseId, offeringId } = useParams<{
    departmentId: string;
    courseId: string;
    offeringId: string;
  }>();

  invariant(departmentId);
  invariant(courseId);
  invariant(offeringId);

  const { data: department } = useDepartment(departmentId);
  const { data: course } = useCourse(departmentId, courseId);
  const { data: offering } = useCourseOffering(
    departmentId,
    courseId,
    offeringId,
  );

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
        <Anchor
          component={NavLink}
          to={`/app/reviews/departments/${departmentId}/courses/${courseId}/offerings/${offeringId}`}
        >
          {offering ? formatTerm(offering) : "offering"}
        </Anchor>
        <Anchor>reviews</Anchor>
      </Breadcrumbs>

      <Stack gap={2} align="center">
        <Title order={2}>Reviews</Title>
        <Text c="dimmed" size="sm" ta="center">
          Reviews for this offering are coming soon.
        </Text>
      </Stack>
    </Stack>
  );
}
