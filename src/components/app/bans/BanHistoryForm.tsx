import { useModals } from "@/providers/modals/hook";
import { Button, NumberInput, Paper, Stack, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { UserBanHistory } from "./BanList";

export function BanHistoryForm() {
  const modals = useModals();
  const form = useForm<{ userId: number | string }>({
    mode: "controlled",
    initialValues: { userId: "" },
  });

  const handleSubmit = form.onSubmit((values) => {
    modals.open({
      title: `Ban history of user ${String(values.userId)}`,
      size: "min(95%, 720px)",
      children: <UserBanHistory userId={values.userId} />,
    });
  });

  return (
    <Paper withBorder p="md" w="100%">
      <form onSubmit={handleSubmit}>
        <Stack>
          <Title order={3}>Ban history</Title>

          <NumberInput
            label="User ID"
            min={1}
            allowDecimal={false}
            allowNegative={false}
            hideControls
            {...form.getInputProps("userId")}
            required
          />

          <Button type="submit">Search</Button>
        </Stack>
      </form>
    </Paper>
  );
}
