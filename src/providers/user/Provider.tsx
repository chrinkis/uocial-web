import { type User } from "@/models/User";
import axios from "axios";
import { useMemo, type ReactNode } from "react";
import { useAsync } from "react-use";
import { UserContext } from "./Context";

export function UserProvider({ children }: { children: ReactNode }) {
  const { loading, error, value } = useAsync(
    async () => await axios.get<User>("/api/user"),
  );

  const contextValue = useMemo(() => {
    return {
      user: error ? null : (value?.data ?? null),
    };
  }, [value?.data, error]);

  if (loading) {
    return; // FIXME
  }

  return <UserContext value={contextValue}>{children}</UserContext>;
}
