import { useState } from "react";
import { Loader, Select, type SelectProps } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { useCourse, useCourses } from "@/queries/app/reviews/course";

export interface CourseSelectPropsType
  extends Omit<SelectProps, "data" | "value" | "onChange"> {
  /** Only offer the courses of this department. */
  departmentId: number | string;
  value: string | null;
  onChange: (value: string | null) => void;
  /** Course that must not be offered (e.g. the one being reported). */
  excludeId?: number;
}

export function CourseSelect({
  departmentId,
  value,
  onChange,
  excludeId,
  ...props
}: CourseSelectPropsType) {
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search.trim(), 300);

  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } =
    useCourses(departmentId, [], debouncedSearch);
  const selected = useCourse(departmentId, value ?? "", []);

  // The selected course must stay in `data` even when the current search
  // doesn't return it, otherwise Select loses its label.
  const options = new Map<string, string>();
  if (value !== null && selected.data) {
    options.set(
      String(selected.data.id),
      `${selected.data.code} - ${selected.data.name}`,
    );
  }
  for (const page of data?.pages ?? []) {
    for (const course of page.data) {
      if (course.id !== excludeId) {
        options.set(String(course.id), `${course.code} - ${course.name}`);
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
      nothingFoundMessage={isFetching ? "Searching..." : "No courses found"}
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
