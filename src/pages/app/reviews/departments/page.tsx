import { Stack, Text, Title } from "@mantine/core";
import { InfiniteScrolling } from "@/components/InfiniteScrolling";
import { Department } from "@/components/app/reviews/Department";
import { DepartmentSkeleton } from "@/components/app/reviews/DepartmentSkeleton";
import { useDepartments } from "@/queries/app/reviews/department";

export default function Page() {
  return (
    <Stack align="safe center" w="100%" h="100%" gap="md">
      <Stack gap={4} align="center">
        <Title order={2}>Departments</Title>
        <Text c="dimmed" size="sm" ta="center">
          Choose a department to browse its course reviews.
        </Text>
      </Stack>

      <InfiniteScrolling
        useQuery={useDepartments}
        name="departments"
        Component={({ data }) => <Department department={data} />}
        Fallback="No departments found."
        loader={<DepartmentSkeleton />}
      />
    </Stack>
  );
}
