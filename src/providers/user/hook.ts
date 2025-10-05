import { use } from "react";
import { UserContext } from "./Context";

export function useUser() {
  return use(UserContext);
}
