export const INSTRUCTORS_FILTER_KEY = "instructors";
export const SEARCH_KEY = "search";

/**
 * Reads a repeated query param (`?key=1&key=2`) as a list of unique integers.
 * Invalid values are ignored.
 */
export function parseIdsParam(searchParams: URLSearchParams, key: string) {
  const ids: number[] = [];

  for (const value of searchParams.getAll(key)) {
    const id = Number(value);

    if (Number.isInteger(id) && id > 0 && !ids.includes(id)) {
      ids.push(id);
    }
  }

  return ids;
}

/**
 * Returns a copy of the params where `key` is replaced by one entry per id.
 */
export function setIdsParam(
  searchParams: URLSearchParams,
  key: string,
  ids: number[],
) {
  const next = new URLSearchParams(searchParams);

  next.delete(key);

  for (const id of ids) {
    next.append(key, String(id));
  }

  return next;
}

export function getInstructorFilter(searchParams: URLSearchParams) {
  return parseIdsParam(searchParams, INSTRUCTORS_FILTER_KEY);
}

export function setInstructorFilter(
  searchParams: URLSearchParams,
  instructorIds: number[],
) {
  return setIdsParam(searchParams, INSTRUCTORS_FILTER_KEY, instructorIds);
}

/** Filters that follow the user while navigating between reviews pages. */
export const CARRIED_FILTER_KEYS = [INSTRUCTORS_FILTER_KEY];

/**
 * Appends the carried filters of `searchParams` to `path`, so a link keeps the
 * filters the user already applied.
 */
export function withCarriedFilters(
  path: string,
  searchParams: URLSearchParams,
) {
  const carried = new URLSearchParams();

  for (const key of CARRIED_FILTER_KEYS) {
    for (const value of searchParams.getAll(key)) {
      carried.append(key, value);
    }
  }

  const query = carried.toString();

  return query === "" ? path : `${path}?${query}`;
}

export function getSearch(searchParams: URLSearchParams) {
  return searchParams.get(SEARCH_KEY)?.trim() ?? "";
}

export function setSearch(searchParams: URLSearchParams, search: string) {
  const next = new URLSearchParams(searchParams);
  const trimmed = search.trim();

  if (trimmed === "") {
    next.delete(SEARCH_KEY);
  } else {
    next.set(SEARCH_KEY, trimmed);
  }

  return next;
}
