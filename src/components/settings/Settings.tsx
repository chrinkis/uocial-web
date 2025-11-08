import type { Settings } from "@/models/settings/settings";
import { useSettings } from "@/providers/settings/hook";
import { Switch } from "@mantine/core";

export function Settings() {
  const { settings, setSettings } = useSettings();

  return (
    <Switch
      label="Show YOU/YOURS badge"
      description="The HTTP request will continue to fetch this information, even when it isn’t displayed in the UI."
      checked={settings.showYouBadge}
      onChange={(event) => {
        const showYouBadge = event.currentTarget.checked;
        setSettings((settings) => ({
          ...settings,
          showYouBadge,
        }));
      }}
    />
  );
}
