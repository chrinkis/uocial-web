import { use } from "react";
import { ModalsContext } from "./Context";

export function useModals() {
  return use(ModalsContext);
}
