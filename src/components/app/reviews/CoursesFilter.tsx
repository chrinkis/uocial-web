import { FilterDrawer } from "@/components/app/reviews/FilterDrawer";
import { InstructorMultiSelect } from "@/components/app/reviews/InstructorMultiSelect";

export interface CoursesFilterValue {
  instructorIds: number[];
}

const EMPTY_COURSES_FILTER: CoursesFilterValue = { instructorIds: [] };

export interface CoursesFilterPropsType {
  departmentId: number | string;
  value: CoursesFilterValue;
  onApply: (value: CoursesFilterValue) => void;
}

export function CoursesFilter({
  departmentId,
  value,
  onApply,
}: CoursesFilterPropsType) {
  return (
    <FilterDrawer
      value={value}
      emptyValue={EMPTY_COURSES_FILTER}
      activeCount={value.instructorIds.length}
      onApply={onApply}
    >
      {(draft, setDraft) => (
        <InstructorMultiSelect
          scope={{ departmentId }}
          value={draft.instructorIds}
          onChange={(instructorIds) => {
            setDraft({ ...draft, instructorIds });
          }}
        />
      )}
    </FilterDrawer>
  );
}
