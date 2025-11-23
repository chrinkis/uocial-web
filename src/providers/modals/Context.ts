import type { ModalProps } from "@mantine/core";
import { createContext } from "react";

export type ModalsContextTypeOpenArgs = Partial<Omit<ModalProps, "key">>;

export interface ModalsContextType {
  open: (props: ModalsContextTypeOpenArgs) => number;
  close: (id: number) => void;
}

export const ModalsContext = createContext<ModalsContextType>({
  open: () => {
    return 0;
  },

  close: () => {
    return;
  },
});
