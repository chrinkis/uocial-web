import { useState } from "react";
import { Loader, Select, type SelectProps } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import {
  useCourseOffering,
  useCourseOfferings,
} from "@/queries/app/reviews/offering";
import { formatTerm } from "@/utils/app/reviews/semester";

export interface OfferingSelectPropsType
  extends Omit<SelectProps, "data" | "value" | "onChange"> {
  /** Only offer the offerings of this course. */
  departmentId: number | string;
  courseId: number | string;
  value: string | null;
  onChange: (value: string | null) => void;
  /** Offering that must not be offered (e.g. the one being reported). */
  excludeId?: number;
}

export function OfferingSelect({
  departmentId,
  courseId,
  value,
  onChange,
  excludeId,
  ...props
}: OfferingSelectPropsType) {
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search.trim(), 300);

  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } =
    useCourseOfferings(departmentId, courseId, [], debouncedSearch);
  const selected = useCourseOffering(departmentId, courseId, value ?? "");

  // The selected offering must stay in `data` even when the current search
  // doesn't return it, otherwise Select loses its label.
  const options = new Map<string, string>();
  if (value !== null && selected.data) {
    options.set(String(selected.data.id), formatTerm(selected.data));
  }
  for (const page of data?.pages ?? []) {
    for (const offering of page.data) {
      if (offering.id !== excludeId) {
        options.set(String(offering.id), formatTerm(offering));
      }
    }
  }

  return (
    <Select
      {...props}
      data={Array.from(options, ([optionValue, label]) => ({
        value: optionValue,
        label,
      }))}
      value={value}
      onChange={onChange}
      searchable
      clearable
      searchValue={search}
      onSearchChange={setSearch}
      // The API already searches, so don't filter again on the client.
      filter={({ options: all }) => all}
      nothingFoundMessage={isFetching ? "Searching..." : "No offerings found"}
      rightSection={isFetching ? <Loader size="xs" /> : undefined}
      scrollAreaProps={{
        onBottomReached: () => {
          if (hasNextPage && !isFetchingNextPage) {
            void fetchNextPage();
          }
        },
      }}
    />
  );
}
