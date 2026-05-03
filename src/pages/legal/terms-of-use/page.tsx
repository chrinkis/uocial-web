import { fetchTermsOfUse } from "@/api/legal/terms-of-use";
import { Loader, Stack, Text, Title } from "@mantine/core";
import { useAsync } from "react-use";
import invariant from "tiny-invariant";

export default function Page() {
  const { loading, error, value } = useAsync(
    async () => await fetchTermsOfUse(),
  );

  if (loading || error) {
    return <Loader />;
  }

  invariant(value?.data);

  return (
    <Stack>
      <Title order={2} ta="center">
        Terms of Use {value.data.data.version}
      </Title>

      <Text ta="right">
        {new Date(value.data.data.created_at).toLocaleString()}
      </Text>

      {value.data.data.content.split("\n\n").map((p, i) => (
        <Text ta="justify" key={i}>
          {p}
        </Text>
      ))}
    </Stack>
  );
}
