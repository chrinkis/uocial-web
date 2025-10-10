import { SendVerificationEmailButton } from "@/components/auth/SendVerificationEmailButton";
import { getErrorMessage } from "@/utils/error";
import { type ApiResponse } from "@/utils/response";
import {
  Loader,
  Paper,
  Title,
  Text,
  Stack,
  Group,
  Button,
} from "@mantine/core";
import {
  IconRosetteDiscountCheck,
  IconRosetteDiscountCheckOff,
} from "@tabler/icons-react";
import axios from "axios";
import { useSearchParams } from "react-router";
import { useAsync } from "react-use";
import invariant from "tiny-invariant";

export default function Page() {
  const [searchParams] = useSearchParams();
  const urlParam = searchParams.get("url");

  function handleContinueClick() {
    window.location.href = "/";
  }

  const { loading, error, value } = useAsync(async () => {
    if (!urlParam) {
      throw new Error("Invalid url");
    }

    const originUrl = new URL(urlParam);
    if (!originUrl.pathname.startsWith("/api/auth/email/verify")) {
      throw new Error("Invalid Verification URL");
    }

    const targetUrl = originUrl.pathname + originUrl.search;

    return await axios.get<ApiResponse>(decodeURIComponent(targetUrl));
  });

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <Paper withBorder p="lg">
        <Stack>
          <Title order={2} ta="center">
            Something Went Wrong...
          </Title>

          <Group justify="center">
            <IconRosetteDiscountCheckOff size={128} />
          </Group>

          <Text ta="center">{getErrorMessage(error)}</Text>

          <Group justify="center">
            <SendVerificationEmailButton />
          </Group>
        </Stack>
      </Paper>
    );
  }

  invariant(value?.data);

  return (
    <Paper withBorder p="xl" w={250}>
      <Stack>
        <Title order={2} ta="center">
          Done!
        </Title>

        <Group justify="center">
          <IconRosetteDiscountCheck size={128} />
        </Group>

        <Text ta="center">{value.data.message}</Text>

        <Group justify="center">
          <Button onClick={handleContinueClick}>Continue</Button>
        </Group>
      </Stack>
    </Paper>
  );
}
