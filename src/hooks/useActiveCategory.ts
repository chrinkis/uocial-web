import { useLocation } from "react-router";
import { getActiveCategory } from "@/utils/categories";

export function useActiveCategory() {
  const { pathname } = useLocation();
  return getActiveCategory(pathname);
}
