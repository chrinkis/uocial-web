import type { ReactNode } from "react";
import { UserProvider } from "./user/Provider";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";

import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <MantineProvider defaultColorScheme="auto">
      <Notifications />
      <UserProvider>{children}</UserProvider>
    </MantineProvider>
  );
}
