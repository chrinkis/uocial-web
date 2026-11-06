import { Anchor, Breadcrumbs, Stack, Text } from "@mantine/core";
import { useParams } from "react-router";
import invariant from "tiny-invariant";
import { useInstructor } from "@/queries/app/reviews/instructor";
import { InstructorHeader } from "@/components/app/reviews/InstructorHeader";
import { InstructorHeaderSkeleton } from "@/components/app/reviews/InstructorHeaderSkeleton";
import { getInstructorFullName } from "@/utils/app/reviews/instructor";

export default function Page() {
  const { instructorId } = useParams<{ instructorId: string }>();

  invariant(instructorId);

  const { data: instructor, isLoading } = useInstructor(instructorId);

  return (
    <Stack align="safe center" w="100%" h="100%" gap="md">
      <Breadcrumbs>
        <Anchor>instructors</Anchor>
        <Anchor>
          {instructor ? getInstructorFullName(instructor) : "instructor"}
        </Anchor>
      </Breadcrumbs>

      {isLoading ? (
        <InstructorHeaderSkeleton />
      ) : instructor ? (
        <InstructorHeader instructor={instructor} />
      ) : (
        <Text c="dimmed">Instructor not found.</Text>
      )}
    </Stack>
  );
}
