import { createContext } from "react";

export interface LoadingOverlayContextType {
  show: () => void;
  hide: () => void;
}

export const LoadingOverlayContext = createContext<LoadingOverlayContextType>({
  show: () => {
    return;
  },
  hide: () => {
    return;
  },
});
