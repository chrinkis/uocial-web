import {
  Blockquote,
  CloseButton,
  Group,
  Stack,
  Textarea,
  ActionIcon,
  useMantineTheme,
} from "@mantine/core";
import { IconSend2 } from "@tabler/icons-react";
import { useCreateComment } from "@/queries/app/post/comment";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { getErrorMessage, type LaravelValidationResponse } from "@/utils/error";
import axios from "axios";

export function CommentCreate({
  postId,
  replyTo,
  onClearReply,
}: {
  postId: number | string;
  replyTo?: number | string | null;
  onClearReply?: () => void;
}) {
  const theme = useMantineTheme();
  const form = useForm({
    mode: "controlled",
    initialValues: {
      comment: "",
    },
  });
  const createComment = useCreateComment();

  const handleSubmit = form.onSubmit(async (values) => {
    try {
      const { message } = await createComment.mutateAsync({
        postId,
        comment: values.comment,
        reply_to: replyTo ?? undefined,
      });
      form.reset();
      onClearReply?.();
      notifications.show({
        title: "Success",
        message: message,
      });
    } catch (error) {
      notifications.show({
        title: "Failed to create comment",
        message: getErrorMessage(error),
        color: "red",
      });

      if (!axios.isAxiosError(error) || !error.response) {
        return;
      }

      const data = error.response.data as LaravelValidationResponse | undefined;
      form.setErrors(data?.errors ?? {});
    }
  });

  return (
    <Stack gap="xs" maw={512} w="100%">
      {replyTo && (
        <Group gap="xs">
          <Blockquote
            p={3}
            style={{ fontSize: 14 }}
            styles={{ root: { color: "var(--mantine-color-dimmed)" } }}
            flex={1}
          >
            You are replying to comment !{replyTo}
          </Blockquote>
          <CloseButton onClick={onClearReply} size="md" />
        </Group>
      )}
      <form onSubmit={handleSubmit}>
        <Group gap="xs">
          <Textarea
            placeholder="Write a comment..."
            flex={1}
            autosize
            maxRows={3}
            key={form.key("comment")}
            {...form.getInputProps("comment")}
          />
          <ActionIcon
            type="submit"
            variant="transparent"
            loading={form.submitting}
          >
            <IconSend2 color={theme.colors[theme.primaryColor][5]} />
          </ActionIcon>
        </Group>
      </form>
    </Stack>
  );
}
