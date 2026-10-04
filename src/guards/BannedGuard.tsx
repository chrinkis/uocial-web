import { useUser } from "@/providers/user/hook";
import { Navigate, Outlet } from "react-router";

export function BannedGuard() {
  const { user } = useUser();

  if (user?.active_ban) {
    return <Navigate to="/app/banned" replace />;
  }

  return <Outlet />;
}
