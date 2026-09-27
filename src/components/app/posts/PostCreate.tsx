import { useCreatePost } from "@/queries/app/post/post";
import { getErrorMessage, type LaravelValidationResponse } from "@/utils/error";
import {
  ActionIcon,
  Button,
  Checkbox,
  CloseButton,
  Group,
  NativeSelect,
  Paper,
  Stack,
  TagsInput,
  Text,
  Textarea,
  TextInput,
  Tooltip,
} from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconChartBar, IconPlus } from "@tabler/icons-react";
import axios from "axios";
import dayjs from "dayjs";
import { uniq } from "lodash";

const POLL_MIN_OPTIONS = 2;
const POLL_MAX_OPTIONS = 10;

const INITIAL_POLL = {
  options: ["", ""],
  ends_at: null as string | null,
  allow_multiple_votes: false,
};

export function PostCreate() {
  const form = useForm({
    mode: "controlled",
    initialValues: {
      title: "",
      location: "Universal",
      body: "",
      hashtags: [] as string[],
      withPoll: false,
      poll: INITIAL_POLL,
    },
    transformValues: ({ withPoll, poll, ...values }) => ({
      ...values,
      location: values.location === "Universal" ? null : values.location,
      poll: withPoll
        ? {
            ...poll,
            ends_at: poll.ends_at ? dayjs(poll.ends_at).toISOString() : null,
          }
        : null,
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
        title: "Failed to create post",
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

  function handlePollToggle() {
    form.setFieldValue("withPoll", !form.values.withPoll);
    form.setFieldValue("poll", INITIAL_POLL);
  }

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
          {form.values.withPoll && (
            <Paper withBorder p="xs">
              <Stack gap="xs">
                <Group justify="space-between">
                  <Text fw={600} size="sm">
                    Poll
                  </Text>
                  <CloseButton
                    size="sm"
                    aria-label="Remove poll"
                    onClick={handlePollToggle}
                  />
                </Group>

                {form.values.poll.options.map((_, index) => (
                  <TextInput
                    // eslint-disable-next-line react-x/no-array-index-key
                    key={index}
                    variant="filled"
                    placeholder={`Option ${String(index + 1)}`}
                    required
                    {...form.getInputProps(`poll.options.${String(index)}`)}
                    rightSection={
                      index >= POLL_MIN_OPTIONS && (
                        <CloseButton
                          size="sm"
                          aria-label={`Remove option ${String(index + 1)}`}
                          onClick={() => {
                            form.removeListItem("poll.options", index);
                          }}
                        />
                      )
                    }
                  />
                ))}

                {form.errors["poll.options"] && (
                  <Text c="red" size="xs">
                    {form.errors["poll.options"]}
                  </Text>
                )}

                {form.values.poll.options.length < POLL_MAX_OPTIONS && (
                  <Button
                    variant="subtle"
                    size="compact-sm"
                    leftSection={<IconPlus size="1rem" />}
                    style={{ alignSelf: "flex-start" }}
                    onClick={() => {
                      form.insertListItem("poll.options", "");
                    }}
                  >
                    Add option
                  </Button>
                )}

                <DateTimePicker
                  variant="filled"
                  label="Ends at"
                  placeholder="No end date"
                  clearable
                  minDate={new Date()}
                  valueFormat="DD/MM/YYYY HH:mm"
                  {...form.getInputProps("poll.ends_at")}
                />

                <Checkbox
                  label="Allow multiple votes"
                  {...form.getInputProps("poll.allow_multiple_votes", {
                    type: "checkbox",
                  })}
                />
              </Stack>
            </Paper>
          )}
          <Group gap="xs" wrap="nowrap">
            <TagsInput
              variant="filled"
              placeholder="Hashtags"
              flex={1}
              miw={0}
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
            <Tooltip label={form.values.withPoll ? "Remove poll" : "Add poll"}>
              <ActionIcon
                size="input-sm"
                variant={form.values.withPoll ? "filled" : "outline"}
                aria-label={form.values.withPoll ? "Remove poll" : "Add poll"}
                onClick={handlePollToggle}
              >
                <IconChartBar size="1.2rem" />
              </ActionIcon>
            </Tooltip>
            <Button type="submit" variant="outline" loading={form.submitting}>
              Post
            </Button>
          </Group>
        </Stack>
      </form>
    </Paper>
  );
}
