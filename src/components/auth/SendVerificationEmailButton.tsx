import { useUser } from "@/providers/user/hook";
import { getErrorMessage } from "@/utils/error";
import { type ApiResponse } from "@/utils/response";
import { Button } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import axios from "axios";
import { useState } from "react";

export function SendVerificationEmailButton() {
  const { user } = useUser();
  const [sending, setSending] = useState(false);

  async function handleClick() {
    setSending(true);

    try {
      const response = await axios.post<ApiResponse>(
        "/api/auth/email/resend-verification",
      );

      notifications.show({
        title: "Email Sent!",
        message: response.data.message,
        position: "top-left",
      });
    } catch (error) {
      notifications.show({
        title: "Email was not sent.",
        message: getErrorMessage(error),
        position: "top-left",
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
