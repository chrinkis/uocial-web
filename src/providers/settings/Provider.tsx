import { useEffect, useMemo, useState, type ReactNode } from "react";
import { SettingsContext } from "./Context";
import { getSettings, saveSettings } from "@/utils/storage/settings";

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState(getSettings());

  const contextValue = useMemo(
    () => ({
      settings,
      setSettings,
    }),
    [settings, setSettings],
  );

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  return <SettingsContext value={contextValue}>{children}</SettingsContext>;
}
