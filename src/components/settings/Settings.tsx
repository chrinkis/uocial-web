import type { Settings } from "@/models/settings/settings";
import { useSettings } from "@/providers/settings/hook";
import { Switch } from "@mantine/core";

export function Settings() {
  const { settings, setSettings } = useSettings();

  return (
    <Switch
      label="Show YOU/YOURS badge"
      description="The http request will still fetch the information, but it will not be displayed in the ui."
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
