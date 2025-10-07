import { Locked } from "@/components/Locked";
import { useUser } from "@/providers/user/hook";
import { Outlet } from "react-router";

export function VerifiedGuard() {
  const { user } = useUser();

  if (!user?.email_verified_at) {
    return <Locked reason="unverified" />;
  }

  return <Outlet />;
}
