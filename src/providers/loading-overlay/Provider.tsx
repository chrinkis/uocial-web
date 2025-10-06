import { useMemo, useState, type ReactNode } from "react";
import { LoadingOverlayContext } from "./Context";
import { LoadingOverlay } from "@mantine/core";

export function LoadingOverlayProvider({ children }: { children: ReactNode }) {
  const [visible, setVisible] = useState(false);

  const contextValue = useMemo(
    () => ({
      show: () => {
        setVisible(true);
      },
      hide: () => {
        setVisible(false);
      },
    }),
    [setVisible],
  );

  return (
    <LoadingOverlayContext value={contextValue}>
      <LoadingOverlay visible={visible} />
      {children}
    </LoadingOverlayContext>
  );
}
