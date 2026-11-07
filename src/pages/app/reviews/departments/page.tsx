import { useMemo } from "react";
import { Group, Stack, Text, Title } from "@mantine/core";
import { useSearchParams } from "react-router";
import { InfiniteScrolling } from "@/components/InfiniteScrolling";
import { Department } from "@/components/app/reviews/Department";
import { DepartmentSkeleton } from "@/components/app/reviews/DepartmentSkeleton";
import { DepartmentsFilter } from "@/components/app/reviews/DepartmentsFilter";
import { useDepartments } from "@/queries/app/reviews/department";
import {
  getInstructorFilter,
  getSearch,
  setInstructorFilter,
  setSearch,
} from "@/utils/app/reviews/filters";
import { LiveSearchInput } from "@/components/LiveSearchInput";

export default function Page() {
  const [searchParams, setSearchParams] = useSearchParams();

  const instructorIds = useMemo(
    () => getInstructorFilter(searchParams),
    [searchParams],
  );
  const search = getSearch(searchParams);

  return (
    <Stack align="safe center" w="100%" h="100%" gap="md">
      <Stack gap={4} align="center">
        <Title order={2}>Departments</Title>
        <Text c="dimmed" size="sm" ta="center">
          Choose a department to browse its course reviews.
        </Text>
      </Stack>

      <Group w="90%" maw="32rem" wrap="nowrap" gap="xs">
        <LiveSearchInput
          value={search}
          placeholder="Search departments"
          onSearch={(next) => {
            setSearchParams((prev) => setSearch(prev, next), { replace: true });
          }}
        />
        <DepartmentsFilter
          value={{ instructorIds }}
          onApply={(filter) => {
            setSearchParams(
              (prev) => setInstructorFilter(prev, filter.instructorIds),
              { replace: true },
            );
          }}
        />
      </Group>

      <InfiniteScrolling
        useQuery={useDepartments}
        queryArgs={[instructorIds, search]}
        name="departments"
        Component={({ data }) => <Department department={data} />}
        Fallback={
          instructorIds.length > 0 || search !== ""
            ? "No departments found for the current search and filters."
            : "No departments found."
        }
        loader={<DepartmentSkeleton />}
      />
    </Stack>
  );
}
