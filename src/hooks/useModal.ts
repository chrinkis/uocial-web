import { modals } from "@mantine/modals";
import { useCallback } from "react";

export function useModal() {
  return useCallback((props: Parameters<typeof modals.open>[0]) => {
    let shouldNavigateBack = true;

    function handleBack() {
      shouldNavigateBack = false;
      modals.close(modalId);
    }

    const modalId = modals.open({
      ...props,
      onClose: () => {
        const historyState = window.history.state as {
          modalOpen?: boolean;
        } | null;

        if (shouldNavigateBack && historyState?.modalOpen) {
          shouldNavigateBack = false;
          window.removeEventListener("popstate", handleBack);
          window.history.back();
        }

        props.onClose?.();
      },
    });

    window.history.pushState({ modalOpen: true }, "");

    window.addEventListener("popstate", handleBack, { once: true });

    return modalId;
  }, []);
}
