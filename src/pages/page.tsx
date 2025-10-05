import { useUser } from "@/providers/user/hook";
import { Navigate } from "react-router";

export default function Page() {
  const { user } = useUser();

  if (!user) {
    return <Navigate to="/about" replace />;
  }

  return <Navigate to="/app" replace />;
}
