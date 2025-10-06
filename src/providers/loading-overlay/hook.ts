import { use } from "react";
import { LoadingOverlayContext } from "./Context";

export function useLoadingOverlay() {
  return use(LoadingOverlayContext);
}
