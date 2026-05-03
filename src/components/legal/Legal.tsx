import {
  Anchor,
  Button,
  Checkbox,
  Group,
  Paper,
  Stack,
  Title,
} from "@mantine/core";
import { IconGavel } from "@tabler/icons-react";
import axios from "axios";
import type { FormEvent } from "react";
import { NavLink } from "react-router";

export function Legal({
  termsOfUseAccepted,
  privacyPolicyAccepted,
}: {
  termsOfUseAccepted: boolean;
  privacyPolicyAccepted: boolean;
}) {
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!termsOfUseAccepted) {
      await axios.post("/api/legal/terms-of-use/accept");
    }

    if (!privacyPolicyAccepted) {
      await axios.post("/api/legal/privacy-policy/accept");
    }

    window.location.reload();
  }

  return (
    <Paper p="xl" withBorder>
      <form onSubmit={(e) => void handleSubmit(e)}>
        <Stack>
          <Title order={2} ta="center">
            Update to Legal Documents
          </Title>
          <Group justify="center">
            <IconGavel size={128} />
          </Group>

          <Stack gap="xs" align="center">
            <Checkbox
              defaultChecked={termsOfUseAccepted}
              disabled={termsOfUseAccepted}
              label={
                <>
                  I accept{" "}
                  <Anchor component={NavLink} to="/legal/terms-of-use">
                    Terms of Use
                  </Anchor>
                  .
                </>
              }
              required
            />

            <Checkbox
              defaultChecked={privacyPolicyAccepted}
              disabled={privacyPolicyAccepted}
              label={
                <>
                  I accept{" "}
                  <Anchor component={NavLink} to="/legal/privacy-policy">
                    Privacy Policy
                  </Anchor>{" "}
                  terms.
                </>
              }
              required
            />
          </Stack>

          <Group justify="center">
            <Button type="submit">Confirm</Button>
          </Group>
        </Stack>
      </form>
    </Paper>
  );
}
