import { useCreatePost } from "@/queries/app/post/post";
import { getErrorMessage, type LaravelValidationResponse } from "@/utils/error";
import {
  Button,
  Group,
  NativeSelect,
  Paper,
  Stack,
  TagsInput,
  Textarea,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import axios from "axios";
import { uniq } from "lodash";

export function CreatePost() {
  const form = useForm({
    mode: "controlled",
    initialValues: {
      title: "",
      location: "Universal",
      body: "",
      hashtags: [] as string[],
    },
    transformValues: (values) => ({
      ...values,
      location: values.location === "Universal" ? null : values.location,
    }),
  });
  const createPost = useCreatePost();

  const handleSubmit = form.onSubmit(async (values) => {
    try {
      const { message } = await createPost.mutateAsync(values);
      form.reset();
      notifications.show({
        title: "Success",
        message: message,
      });
    } catch (error) {
      notifications.show({
        title: "Login failed",
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
    <Paper w="90%" maw="36rem">
      <form onSubmit={handleSubmit}>
        <Stack gap="xs">
          <Group gap="xs">
            <TextInput
              variant="filled"
              placeholder="Title"
              flex={1}
              required
              key={form.key("title")}
              {...form.getInputProps("title")}
            />
            <NativeSelect
              variant="filled"
              data={["Universal", "Rethymno", "Heraklion"]}
              size="xs"
              key={form.key("location")}
              {...form.getInputProps("location")}
            />
          </Group>
          <Textarea
            variant="filled"
            placeholder="Write your thoughts here..."
            w="100%"
            autosize
            minRows={6}
            required
            key={form.key("body")}
            {...form.getInputProps("body")}
          />
          <Group gap="xs">
            <TagsInput
              variant="filled"
              placeholder="Hashtags"
              flex={1}
              splitChars={[" ", "#"]}
              key={form.key("hashtags")}
              value={form.values.hashtags}
              onChange={(value) => {
                const hashtags: string[] = [];
                for (const hashtag of value) {
                  hashtags.push(...hashtag.split("#").filter((h) => h !== ""));
                }
                form.setFieldValue("hashtags", uniq(hashtags));
              }}
              error={form.errors.hashtags}
            />
            <Button type="submit" variant="outline" loading={form.submitting}>
              Post
            </Button>
          </Group>
        </Stack>
      </form>
    </Paper>
  );
}
