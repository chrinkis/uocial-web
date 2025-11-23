import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type Key,
  type ReactNode,
} from "react";
import { ModalsContext, type ModalsContextTypeOpenArgs } from "./Context";
import { Modal, type ModalProps } from "@mantine/core";
import { omit } from "lodash";

function ModalWrapper({ props }: { props: ModalProps }) {
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    // Double rAF ensures Modal has rendered before transition
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setOpened(true);
      });
    });
  }, []);

  return <Modal {...omit(props, ["key", "opened"])} opened={opened} />;
}

export function ModalsProvider({ children }: { children: ReactNode }) {
  const [modals, setModals] = useState<(ModalProps & { key: Key })[]>([]);
  const nextId = useRef(0);
  const modalStack = useRef<number[]>([]);
  const isClosingProgrammatically = useRef(false);

  useEffect(() => {
    const handlePopState = () => {
      if (modalStack.current.length === 0) {
        return;
      }

      // Get the most recently opened modal
      const modalId = modalStack.current[modalStack.current.length - 1];
      isClosingProgrammatically.current = false;
      setModals((modals) =>
        modals.filter((modalArgs) => {
          const isTarget = modalArgs.key === modalId;
          if (isTarget) {
            modalStack.current = modalStack.current.filter(
              (id) => id !== modalId,
            );
          }
          return !isTarget;
        }),
      );
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  const contextValue = useMemo(
    () => ({
      open: (props: ModalsContextTypeOpenArgs) => {
        const id = nextId.current++;

        setModals((modals) => [
          ...modals,
          {
            opened: false,
            ...props,
            key: id,
            onClose: () => {
              const wasInStack = modalStack.current.includes(id);
              modalStack.current = modalStack.current.filter(
                (stackId) => stackId !== id,
              );

              setModals((modals) =>
                modals.filter((modalArgs) => modalArgs.key !== id),
              );

              // If modal was in stack and we're closing programmatically, go back
              if (wasInStack && isClosingProgrammatically.current) {
                isClosingProgrammatically.current = false;
                window.history.back();
              }

              props.onClose?.();
            },
          },
        ]);

        // Add to stack and push history state
        modalStack.current.push(id);
        window.history.pushState({ modalOpen: true, modalId: id }, "");

        return id;
      },
      close: (id: number) => {
        isClosingProgrammatically.current = true;
        setModals((props) => props.filter((modalArgs) => modalArgs.key !== id));
      },
    }),
    [],
  );

  return (
    <ModalsContext value={contextValue}>
      {children}
      {modals.map((props) => (
        <ModalWrapper key={props.key} props={props} />
      ))}
    </ModalsContext>
  );
}
