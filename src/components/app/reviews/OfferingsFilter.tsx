import { FilterDrawer } from "@/components/app/reviews/FilterDrawer";
import { InstructorMultiSelect } from "@/components/app/reviews/InstructorMultiSelect";

export interface OfferingsFilterValue {
  instructorIds: number[];
}

const EMPTY_OFFERINGS_FILTER: OfferingsFilterValue = {
  instructorIds: [],
};

export interface OfferingsFilterPropsType {
  value: OfferingsFilterValue;
  onApply: (value: OfferingsFilterValue) => void;
}

export function OfferingsFilter({ value, onApply }: OfferingsFilterPropsType) {
  return (
    <FilterDrawer
      value={value}
      emptyValue={EMPTY_OFFERINGS_FILTER}
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
