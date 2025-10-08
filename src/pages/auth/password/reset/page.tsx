import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import { useParams } from "react-router";
import invariant from "tiny-invariant";

export default function Page() {
  const { token } = useParams();

  invariant(token);

  return <ResetPasswordForm token={token} />;
}
