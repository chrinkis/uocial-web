import { useSearchParams } from "react-router";
import { withCarriedFilters } from "@/utils/app/reviews/filters";

/**
 * Returns a function that adds the current page's carried filters (see
 * `CARRIED_FILTER_KEYS`) to a path.
 */
export function useCarriedFilters() {
  const [searchParams] = useSearchParams();

  return (path: string) => withCarriedFilters(path, searchParams);
}
