import { INITIAL_SETTINGS, type Settings } from "@/models/settings/settings";
import { createContext, type Dispatch, type SetStateAction } from "react";

export interface SettingsContextType {
  settings: Settings;
  setSettings: Dispatch<SetStateAction<Settings>>;
}

export const SettingsContext = createContext<SettingsContextType>({
  settings: INITIAL_SETTINGS,
  setSettings: () => {
    return;
  },
});
