import { FilterDrawer } from "@/components/app/reviews/FilterDrawer";
import { InstructorMultiSelect } from "@/components/app/reviews/InstructorMultiSelect";

export interface DepartmentsFilterValue {
  instructorIds: number[];
}

const EMPTY_DEPARTMENTS_FILTER: DepartmentsFilterValue = {
  instructorIds: [],
};

export interface DepartmentsFilterPropsType {
  value: DepartmentsFilterValue;
  onApply: (value: DepartmentsFilterValue) => void;
}

export function DepartmentsFilter({
  value,
  onApply,
}: DepartmentsFilterPropsType) {
  return (
    <FilterDrawer
      value={value}
      emptyValue={EMPTY_DEPARTMENTS_FILTER}
      activeCount={value.instructorIds.length}
      onApply={onApply}
    >
      {(draft, setDraft) => (
        <InstructorMultiSelect
          value={draft.instructorIds}
          onChange={(instructorIds) => {
            setDraft({ ...draft, instructorIds });
          }}
        />
      )}
    </FilterDrawer>
  );
}
