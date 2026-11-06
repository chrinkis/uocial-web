import { useMemo } from "react";
import { Stack, Text, Title } from "@mantine/core";
import { useSearchParams } from "react-router";
import { InfiniteScrolling } from "@/components/InfiniteScrolling";
import { Department } from "@/components/app/reviews/Department";
import { DepartmentSkeleton } from "@/components/app/reviews/DepartmentSkeleton";
import { DepartmentsFilter } from "@/components/app/reviews/DepartmentsFilter";
import { useDepartments } from "@/queries/app/reviews/department";
import {
  getInstructorFilter,
  setInstructorFilter,
} from "@/utils/app/reviews/filters";

export default function Page() {
  const [searchParams, setSearchParams] = useSearchParams();

  const instructorIds = useMemo(
    () => getInstructorFilter(searchParams),
    [searchParams],
  );

  return (
    <Stack align="safe center" w="100%" h="100%" gap="md">
      <Stack gap={4} align="center">
        <Title order={2}>Departments</Title>
        <Text c="dimmed" size="sm" ta="center">
          Choose a department to browse its course reviews.
        </Text>
      </Stack>

      <DepartmentsFilter
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
        useQuery={useDepartments}
        queryArgs={[instructorIds]}
        name="departments"
        Component={({ data }) => <Department department={data} />}
        Fallback={
          instructorIds.length > 0
            ? "No departments found for the selected instructors."
            : "No departments found."
        }
        loader={<DepartmentSkeleton />}
      />
    </Stack>
  );
}
