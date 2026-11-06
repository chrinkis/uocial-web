export const INSTRUCTORS_FILTER_KEY = "instructors";

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
