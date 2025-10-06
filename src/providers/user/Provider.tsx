import { type User } from "@/models/User";
import axios from "axios";
import { useCallback, useMemo, type ReactNode } from "react";
import { useAsync } from "react-use";
import { UserContext } from "./Context";
import { useLoadingOverlay } from "@/providers/loading-overlay/hook";
import { notifications } from "@mantine/notifications";
import { getErrorMessage } from "@/utils/error";

export function UserProvider({ children }: { children: ReactNode }) {
  const { show: showLoading, hide: hideLoading } = useLoadingOverlay();

  const { loading, error, value } = useAsync(
    async () => await axios.get<User>("/api/user"),
  );

  const user = useMemo(
    () => (error ? null : (value?.data ?? null)),
    [value?.data, error],
  );

  const logout = useCallback(async () => {
    showLoading();

    try {
      await axios.post("api/auth/logout");
      window.location.href = "/";
    } catch (error) {
      notifications.show({
        title: "Couldn't logout",
        message: getErrorMessage(error),
        color: "red",
        position: "top-right",
      });
    }

    hideLoading();
  }, [showLoading, hideLoading]);

  const contextValue = useMemo(() => ({ user, logout }), [user, logout]);

  if (loading) {
    return; // FIXME
  }

  return <UserContext value={contextValue}>{children}</UserContext>;
}
