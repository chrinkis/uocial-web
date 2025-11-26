import { resendVerificationEmail } from "@/api/user/auth";
import { useUser } from "@/providers/user/hook";
import { getErrorMessage } from "@/utils/error";
import { Button } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useState } from "react";

export function SendVerificationEmailButton() {
  const { user } = useUser();
  const [sending, setSending] = useState(false);

  async function handleClick() {
    setSending(true);

    try {
      const response = await resendVerificationEmail();
      notifications.show({
        title: "Email Sent!",
        message: response.data.message,
      });
    } catch (error) {
      notifications.show({
        title: "Email was not sent.",
        message: getErrorMessage(error),
        color: "red",
      });
    } finally {
      setSending(false);
    }
  }

  return (
    <Button
      onClick={() => void handleClick()}
      loading={sending}
      disabled={!!user?.email_verified_at}
    >
      Resend Email
    </Button>
  );
}
