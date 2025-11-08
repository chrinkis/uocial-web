import { use } from "react";
import { SettingsContext } from "./Context";

export function useSettings() {
  return use(SettingsContext);
}
