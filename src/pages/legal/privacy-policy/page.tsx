import { fetchPrivacyPolicy } from "@/api/legal/privacy-policy";
import { Loader, Stack, Text, Title, Typography } from "@mantine/core";
import { useAsync } from "react-use";
import invariant from "tiny-invariant";
import Markdown from "react-markdown";

export default function Page() {
  const { loading, error, value } = useAsync(
    async () => await fetchPrivacyPolicy(),
  );

  if (loading || error) {
    return <Loader />;
  }

  invariant(value?.data);

  return (
    <Stack>
      <Title order={1} ta="center">
        Privacy Policy v{value.data.data.version}
      </Title>

      <Text ta="right" fs="italic" td="underline">
        {new Date(value.data.data.created_at).toLocaleString()}
      </Text>

      <Typography>
        <Markdown>{value.data.data.content}</Markdown>
      </Typography>
    </Stack>
  );
}
