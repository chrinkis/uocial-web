import { useMemo } from "react";
import { Button, Group, Stack, Text, Title } from "@mantine/core";
import { IconFlag } from "@tabler/icons-react";
import { useSearchParams } from "react-router";
import { DepartmentReportModal } from "@/components/app/reviews/DepartmentReportModal";
import { useModals } from "@/providers/modals/hook";
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
  const modals = useModals();

  function handleReportClick() {
    modals.open({
      title: "Report a missing department",
      children: <DepartmentReportModal />,
      centered: true,
    });
  }

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

      <Button
        variant="subtle"
        size="compact-sm"
        leftSection={<IconFlag size={14} />}
        onClick={handleReportClick}
      >
        Can't find your department?
      </Button>

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
