import { Timestamp } from "@/components/Timestamp";
import type { PostReport } from "@/models/app/post/PostReport";
import { Paper, Stack, Title, Text, Flex, Group, Button } from "@mantine/core";

export function Report({ postReport }: { postReport: PostReport }) {
  return (
    <Paper withBorder p="sm" w="100%">
      <Stack>
        <Flex justify="space-between">
          <Title order={3}>{postReport.id}</Title>
          <Timestamp date={postReport.created_at} />
        </Flex>

        <Text>{postReport.comment}</Text>

        <Group>
          <Button
            bg="green"
            flex={1}
            disabled={postReport.user_review === "valid"}
          >
            Valid
          </Button>
          <Button
            bg="red"
            flex={1}
            disabled={postReport.user_review === "invalid"}
          >
            Invalid
          </Button>
        </Group>
      </Stack>
    </Paper>
  );
}
