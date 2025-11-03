import type { ReactNode } from "react";
import { UserProvider } from "./user/Provider";
import { createTheme, MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { BrowserRouter } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import { LoadingOverlayProvider } from "./loading-overlay/Provider";
import "@mantine/carousel/styles.css";
import { ModalsProvider } from "@mantine/modals";

const theme = createTheme({
  primaryColor: "violet",
});

const queryClient = new QueryClient();

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <MantineProvider defaultColorScheme="auto" theme={theme}>
      <Notifications position="top-center" />
      <QueryClientProvider client={queryClient}>
        <LoadingOverlayProvider>
          <UserProvider>
            <ModalsProvider>
              <BrowserRouter>{children}</BrowserRouter>
            </ModalsProvider>
          </UserProvider>
        </LoadingOverlayProvider>
      </QueryClientProvider>
    </MantineProvider>
  );
}
