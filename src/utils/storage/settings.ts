import { INITIAL_SETTINGS, type Settings } from "@/models/settings/settings";

const STORAGE_KEY = "uocial-settings";

export function getSettings() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return { ...INITIAL_SETTINGS, ...(JSON.parse(stored) as Settings) };
  }

  return { ...INITIAL_SETTINGS };
}

export function saveSettings(settings: Settings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}
