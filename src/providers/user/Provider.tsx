import { useCallback, useMemo, type ReactNode } from "react";
import { useAsync } from "react-use";
import { UserContext } from "./Context";
import { useLoadingOverlay } from "@/providers/loading-overlay/hook";
import { notifications } from "@mantine/notifications";
import { getErrorMessage } from "@/utils/error";
import { Loader } from "@mantine/core";
import { fetchUser, logout as logoutAction } from "@/api/user/auth";

export function UserProvider({ children }: { children: ReactNode }) {
  const { show: showLoading, hide: hideLoading } = useLoadingOverlay();

  const { loading, error, value } = useAsync(fetchUser);

  const user = useMemo(
    () => (error ? null : (value?.data.data ?? null)),
    [value?.data.data, error],
  );

  const logout = useCallback(async () => {
    showLoading();

    try {
      await logoutAction();
      window.location.href = "/";
    } catch (error) {
      hideLoading();
      notifications.show({
        title: "Couldn't logout",
        message: getErrorMessage(error),
        color: "red",
      });
    }
  }, [showLoading, hideLoading]);

  const contextValue = useMemo(() => ({ user, logout }), [user, logout]);

  if (loading) {
    return <Loader />;
  }

  return <UserContext value={contextValue}>{children}</UserContext>;
}
