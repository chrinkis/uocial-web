import { LoginForm } from "@/components/auth/LoginForm";
import { useSearchParams } from "react-router";

export default function Page() {
  const [searchParams] = useSearchParams();

  const redirectParam = searchParams.get("redirect");

  return (
    <LoginForm
      redirect={redirectParam ? decodeURIComponent(redirectParam) : undefined}
    />
  );
}
