import { Button, Group, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useNavigate } from "react-router";

export function SearchForm({ onSuccess }: { onSuccess?: () => void }) {
  const navigate = useNavigate();

  const form = useForm({
    mode: "controlled",
    initialValues: {
      query: "",
    },
  });

  function getStrippedQuery() {
    return form.values.query.trim().replace(/^#/, "").trim();
  }

  const handleSearch = form.onSubmit((values) => {
    const trimmed = values.query.trim();

    if (!trimmed) {
      form.setFieldError("query", "Enter a search term.");
      return;
    }

    const minLength = /^\d+$/.test(trimmed) ? 1 : 2;
    if (trimmed.length < minLength) {
      form.setFieldError(
        "query",
        `Enter at least ${String(minLength)} character${minLength > 1 ? "s" : ""}.`,
      );
      return;
    }

    if (trimmed.length > 100) {
      form.setFieldError("query", "Search term is too long.");
      return;
    }

    void navigate(`/app/posts/search?q=${encodeURIComponent(trimmed)}`);
    onSuccess?.();
  });

  const isValidHashtag = /^#?[^#]+$/.test(form.values.query.trim());

  function handleHashtag() {
    if (!isValidHashtag) {
      form.setFieldError(
        "query",
        "Hashtag can only have a single # at the start.",
      );
      return;
    }

    const stripped = getStrippedQuery();
    void navigate(
      `/app/posts/hashtags?hashtag=${encodeURIComponent(stripped)}`,
    );
    onSuccess?.();
  }

  const isValidPostId = /^\d+$/.test(getStrippedQuery());

  function handlePost() {
    const stripped = getStrippedQuery();

    if (!stripped) {
      form.setFieldError("query", "Enter a post id.");
      return;
    }

    if (!/^\d+$/.test(stripped)) {
      form.setFieldError("query", "Post id must be a number.");
      return;
    }

    void navigate(`/app/posts?postId=${encodeURIComponent(stripped)}`);
    onSuccess?.();
  }

  return (
    <form onSubmit={handleSearch}>
      <Stack>
        <TextInput
          variant="filled"
          autoFocus
          maxLength={100}
          placeholder="Search posts, #hashtag, or post number"
          {...form.getInputProps("query")}
        />

        <Stack gap="xs">
          <Button type="submit">Search</Button>
          <Group grow gap="xs">
            <Button
              type="button"
              variant="outline"
              disabled={!isValidHashtag}
              onClick={handleHashtag}
            >
              Search Hashtag
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={!isValidPostId}
              onClick={handlePost}
            >
              Search Post ID
            </Button>
          </Group>
        </Stack>
      </Stack>
    </form>
  );
}
