import { Locked } from "@/components/Locked";
import { useUser } from "@/providers/user/hook";
import { isModerator } from "@/utils/user";
import { Outlet } from "react-router";

export function ModeratorGuard() {
  const { user } = useUser();

  if (!user || !isModerator(user)) {
    return <Locked reason="moderatorsOnly" />;
  }

  return <Outlet />;
}
