import type { ReactNode } from "react";
import { UserProvider } from "./user/Provider";
import { createTheme, MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { BrowserRouter } from "react-router";

import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";

const theme = createTheme({
  primaryColor: "violet",
});

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <MantineProvider defaultColorScheme="auto" theme={theme}>
      <Notifications />
      <UserProvider>
        <BrowserRouter>{children}</BrowserRouter>
      </UserProvider>
    </MantineProvider>
  );
}
