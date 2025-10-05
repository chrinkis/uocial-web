import type { ReactNode } from "react";
import { UserProvider } from "./user/Provider";
import { MantineProvider } from "@mantine/core";

import "@mantine/core/styles.css";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <MantineProvider>
      <UserProvider>{children}</UserProvider>
    </MantineProvider>
  );
}
