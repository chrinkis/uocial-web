import { Anchor, Breadcrumbs, Stack, Text, Title } from "@mantine/core";
import { NavLink, useParams } from "react-router";
import invariant from "tiny-invariant";
import { useDepartment } from "@/queries/app/reviews/department";
import { useDepartmentInstructors } from "@/queries/app/reviews/instructor";
import { InfiniteScrolling } from "@/components/InfiniteScrolling";
import { Instructor } from "@/components/app/reviews/Instructor";
import { InstructorSkeleton } from "@/components/app/reviews/InstructorSkeleton";

export default function Page() {
  const { departmentId } = useParams<{ departmentId: string }>();

  invariant(departmentId);

  const { data: department } = useDepartment(departmentId);

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
        <Anchor>instructors</Anchor>
      </Breadcrumbs>

      <Stack gap={2} align="center">
        <Title order={2}>Instructors</Title>
        <Text c="dimmed" size="sm" ta="center">
          Instructors teaching courses in this department.
        </Text>
      </Stack>

      <InfiniteScrolling
        useQuery={useDepartmentInstructors}
        queryArgs={[departmentId]}
        name="instructors"
        Component={({ data }) => <Instructor instructor={data} />}
        Fallback="No instructors found."
        loader={<InstructorSkeleton />}
      />
    </Stack>
  );
}
