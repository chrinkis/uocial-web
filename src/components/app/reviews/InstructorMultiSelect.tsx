import { useState } from "react";
import { Loader, MultiSelect } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import {
  useInstructors,
  useInstructorsByIds,
} from "@/queries/app/reviews/instructor";
import { getInstructorFullName } from "@/utils/app/reviews/instructor";

export interface InstructorMultiSelectPropsType {
  value: number[];
  onChange: (value: number[]) => void;
}

export function InstructorMultiSelect({
  value,
  onChange,
}: InstructorMultiSelectPropsType) {
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search.trim(), 300);

  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } =
    useInstructors(debouncedSearch);
  const selected = useInstructorsByIds(value);

  // Selected instructors must stay in `data` even when the current search
  // doesn't return them, otherwise MultiSelect drops their pills.
  const options = new Map<string, string>();
  selected.forEach((query, index) => {
    if (query.data) {
      options.set(String(value[index]), getInstructorFullName(query.data));
    }
  });
  for (const page of data?.pages ?? []) {
    for (const instructor of page.data) {
      options.set(String(instructor.id), getInstructorFullName(instructor));
    }
  }

  return (
    <MultiSelect
      label="Instructors"
      placeholder={value.length === 0 ? "Search instructors" : undefined}
      data={Array.from(options, ([optionValue, label]) => ({
        value: optionValue,
        label,
      }))}
      value={value.map(String)}
      onChange={(ids) => {
        onChange(ids.map(Number));
      }}
      searchable
      clearable
      hidePickedOptions
      searchValue={search}
      onSearchChange={setSearch}
      // The API already searches, so don't filter again on the client.
      filter={({ options: all }) => all}
      nothingFoundMessage={isFetching ? "Searching..." : "No instructors found"}
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
