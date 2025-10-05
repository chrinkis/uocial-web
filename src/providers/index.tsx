import type { ReactNode } from "react";
import { UserProvider } from "./user/Provider";

export function AppProviders({ children }: { children: ReactNode }) {
  return <UserProvider>{children}</UserProvider>;
}
