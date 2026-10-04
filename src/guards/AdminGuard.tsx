import { Locked } from "@/components/Locked";
import { useUser } from "@/providers/user/hook";
import { isAdmin } from "@/utils/user";
import { Outlet } from "react-router";

export function AdminGuard() {
  const { user } = useUser();

  if (!user || !isAdmin(user)) {
    return <Locked reason="adminsOnly" />;
  }

  return <Outlet />;
}
