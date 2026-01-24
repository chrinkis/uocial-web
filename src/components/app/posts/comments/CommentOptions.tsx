import type { Commment } from "@/models/app/post/Comment";
import { Button, Group, Text } from "@mantine/core";
import { IconFlag, IconFlagFilled } from "@tabler/icons-react";
import { ReportForm } from "./reports/ReportForm";
import { useModals } from "@/providers/modals/hook";

export function CommentOptions({
  comment,
  onClose,
}: {
  comment: Commment;
  onClose?: () => void;
}) {
  const modals = useModals();

  function handleReportClick() {
    const id = modals.open({
      title: `Reporting comment !${String(comment.id)}`,
      centered: true,
      children: (
        <ReportForm
          postId={comment.post_id}
          commentId={comment.id}
          onSuccess={closeReportModal}
        />
      ),
    });

    function closeReportModal() {
      modals.close(id);
    }

    onClose?.();
  }

  return (
    <Button
      variant="subtle"
      c="red"
      onClick={handleReportClick}
      disabled={comment.reported_by_the_user}
    >
      <Group c="red" align="stretch">
        {comment.reported_by_the_user ? (
          <IconFlagFilled size={20} />
        ) : (
          <IconFlag size={20} />
        )}
        <Text>Report comment !{comment.id}</Text>
      </Group>
    </Button>
  );
}
