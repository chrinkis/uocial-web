import { Group, Stack, Text, Title } from "@mantine/core";
import { useSearchParams } from "react-router";
import { InfiniteScrolling } from "@/components/InfiniteScrolling";
import { Instructor } from "@/components/app/reviews/Instructor";
import { InstructorSkeleton } from "@/components/app/reviews/InstructorSkeleton";
import { LiveSearchInput } from "@/components/LiveSearchInput";
import { useInstructors } from "@/queries/app/reviews/instructor";
import { getSearch, setSearch } from "@/utils/app/reviews/filters";

export default function Page() {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = getSearch(searchParams);

  return (
    <Stack align="safe center" w="100%" h="100%" gap="md">
      <Stack gap={4} align="center">
        <Title order={2}>Instructors</Title>
        <Text c="dimmed" size="sm" ta="center">
          Choose an instructor to browse their courses and reviews.
        </Text>
      </Stack>

      <Group w="90%" maw="50rem" wrap="nowrap" gap="xs">
        <LiveSearchInput
          value={search}
          placeholder="Search instructors"
          onSearch={(next) => {
            setSearchParams((prev) => setSearch(prev, next), { replace: true });
          }}
        />
      </Group>

      <InfiniteScrolling
        useQuery={useInstructors}
        queryArgs={[search]}
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
