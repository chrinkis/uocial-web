import { useState } from "react";
import { Button, Group, Stack, Textarea } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconCheck } from "@tabler/icons-react";
import { useModals } from "@/providers/modals/hook";
import { getErrorMessage } from "@/utils/error";

function ResolveReportForm({
  onResolve,
  onSuccess,
}: {
  onResolve: (comment?: string) => Promise<unknown>;
  onSuccess: () => void;
}) {
  const [comment, setComment] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    setPending(true);

    try {
      const trimmed = comment.trim();
      await onResolve(trimmed === "" ? undefined : trimmed);
      notifications.show({
        title: "Success",
        message: "The report was resolved.",
      });
      onSuccess();
    } catch (error) {
      notifications.show({
        title: "Resolving failed",
        message: getErrorMessage(error),
        color: "red",
      });
      setPending(false);
    }
  }

  return (
    <form onSubmit={(event) => void handleSubmit(event)}>
      <Stack>
        <Textarea
          label="Comment"
          description="Optional note about how the report was handled."
          autosize
          minRows={3}
          disabled={pending}
          value={comment}
          onChange={(event) => {
            setComment(event.currentTarget.value);
          }}
        />

        <Group justify="right">
          <Button type="submit" loading={pending}>
            Resolve
          </Button>
        </Group>
      </Stack>
    </form>
  );
}

export interface ResolveReportButtonPropsType {
  reportId: number;
  onResolve: (comment?: string) => Promise<unknown>;
}

export function ResolveReportButton({
  reportId,
  onResolve,
}: ResolveReportButtonPropsType) {
  const modals = useModals();

  function handleClick() {
    const modalId = modals.open({
      title: `Resolve report #${String(reportId)}`,
      children: (
        <ResolveReportForm
          onResolve={onResolve}
          onSuccess={() => {
            modals.close(modalId);
          }}
        />
      ),
      centered: true,
    });
  }

  return (
    <Group justify="right">
      <Button
        variant="light"
        color="green"
        leftSection={<IconCheck size={16} />}
        onClick={handleClick}
      >
        Resolve
      </Button>
    </Group>
  );
}
