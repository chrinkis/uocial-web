import { useState } from "react";
import { Loader, Select, type SelectProps } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import {
  useDepartment,
  useDepartments,
} from "@/queries/app/reviews/department";

export interface DepartmentSelectPropsType
  extends Omit<SelectProps, "data" | "value" | "onChange"> {
  value: string | null;
  onChange: (value: string | null) => void;
  /** Department that must not be offered (e.g. the one being reported). */
  excludeId?: number;
}

export function DepartmentSelect({
  value,
  onChange,
  excludeId,
  ...props
}: DepartmentSelectPropsType) {
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search.trim(), 300);

  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } =
    useDepartments([], debouncedSearch);
  const selected = useDepartment(value ?? "", []);

  // The selected department must stay in `data` even when the current search
  // doesn't return it, otherwise Select loses its label.
  const options = new Map<string, string>();
  if (value !== null && selected.data) {
    options.set(
      String(selected.data.id),
      `${selected.data.code} - ${selected.data.name}`,
    );
  }
  for (const page of data?.pages ?? []) {
    for (const department of page.data) {
      if (department.id !== excludeId) {
        options.set(
          String(department.id),
          `${department.code} - ${department.name}`,
        );
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
      nothingFoundMessage={isFetching ? "Searching..." : "No departments found"}
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
