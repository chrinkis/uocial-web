import { modals } from "@mantine/modals";
import { useCallback } from "react";

export function useModal() {
  return useCallback((props: Parameters<typeof modals.open>[0]) => {
    const modalId = modals.open({
      ...props,
      onClose: () => {
        const historyState = window.history.state as {
          modalOpen?: boolean;
        } | null;

        if (historyState?.modalOpen) {
          window.history.back();
        }

        props.onClose?.();
      },
    });

    window.history.pushState({ modalOpen: true }, "");

    function handleBack() {
      modals.close(modalId);
    }

    window.addEventListener("popstate", handleBack, { once: true });

    return modalId;
  }, []);
}
