import { Locked } from "@/components/Locked";
import { useUser } from "@/providers/user/hook";
import { Outlet } from "react-router";

export function LoggedInGuard() {
  const { user } = useUser();

  if (!user) {
    return <Locked reason="unauthorized" />;
  }

  return <Outlet />;
}
