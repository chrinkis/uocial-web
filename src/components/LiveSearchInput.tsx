import { useEffect, useRef, useState } from "react";
import { CloseButton, TextInput } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { IconSearch } from "@tabler/icons-react";

export interface LiveSearchInputPropsType {
  /** The currently applied search. */
  value: string;
  placeholder: string;
  onSearch: (search: string) => void;
}

export function LiveSearchInput({
  value,
  placeholder,
  onSearch,
}: LiveSearchInputPropsType) {
  const [text, setText] = useState(value);
  const [debounced] = useDebouncedValue(text.trim(), 300);

  // The last search this input reported, or received from outside. A `value`
  // equal to it is just our own update coming back; syncing from it would
  // overwrite whatever the user typed in the meantime.
  const lastSearch = useRef(value);

  useEffect(() => {
    if (value !== lastSearch.current) {
      lastSearch.current = value;
      setText(value);
    }
  }, [value]);

  useEffect(() => {
    if (debounced !== lastSearch.current) {
      lastSearch.current = debounced;
      onSearch(debounced);
    }
    // Only react to the user typing, not to `onSearch` identity changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced]);

  return (
    <TextInput
      flex={1}
      placeholder={placeholder}
      leftSection={<IconSearch size={16} />}
      rightSection={
        text === "" ? undefined : (
          <CloseButton
            size="sm"
            aria-label="Clear search"
            onClick={() => {
              setText("");
            }}
          />
        )
      }
      value={text}
      onChange={(event) => {
        setText(event.currentTarget.value);
      }}
    />
  );
}
