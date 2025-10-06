import type { User } from "@/models/User";
import { createContext } from "react";

export interface UserContextType {
  user: User | null;
  logout: () => Promise<void>;
}

export const UserContext = createContext<UserContextType>({
  user: null,
  logout: () => Promise.resolve(),
});
