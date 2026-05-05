import {
  useEffect,
  useRef,
  useState,
  useImperativeHandle,
  type Ref,
} from "react";

import "altcha";
import type {} from "altcha/types/react";
import type { WidgetAttributes, WidgetMethods } from "altcha/types";
import invariant from "tiny-invariant";

interface AltchaHandle {
  value: string | null;
}

interface AltchaProps {
  ref?: Ref<AltchaHandle>;
  onStateChange?: (ev: Event | CustomEvent) => void;
}

function Altcha({ ref, onStateChange }: AltchaProps) {
  const widgetRef = useRef<WidgetAttributes & WidgetMethods & HTMLElement>(
    null,
  );
  const [value, setValue] = useState<string | null>(null);

  useImperativeHandle(ref, () => {
    return {
      get value() {
        return value;
      },
    };
  }, [value]);

  useEffect(() => {
    const handleStateChange = (ev: Event | CustomEvent) => {
      if ("detail" in ev) {
        const detail = ev.detail as { payload?: string };
        invariant("payload" in detail);

        setValue(detail.payload ?? null);
        onStateChange?.(ev);
      }
    };

    const { current } = widgetRef;

    if (current) {
      current.addEventListener("statechange", handleStateChange);
      return () => {
        current.removeEventListener("statechange", handleStateChange);
      };
    }
  }, [onStateChange]);

  return (
    <altcha-widget
      ref={widgetRef}
      challenge="/api/altcha/challenge"
    ></altcha-widget>
  );
}

export default Altcha;
