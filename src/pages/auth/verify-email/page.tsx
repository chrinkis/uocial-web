import { Group, Paper, Stack, Text, Title } from "@mantine/core";
import { IconMail } from "@tabler/icons-react";

export default function Page() {
  return (
    <Paper maw={334} p="xl" withBorder>
      <Stack>
        <Title order={2} ta="center">
          Thanks for Signing Up!
        </Title>
        <Group justify="center">
          <IconMail size={128} />
        </Group>
        <Text ta="justify">
          Please check your email and click the verification link to activate
          your account.
        </Text>
      </Stack>
    </Paper>
  );
}
