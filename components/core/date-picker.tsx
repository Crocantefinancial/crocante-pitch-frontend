"use client";

import "@/components/custom-styles/date-picker.css";
import clsx from "clsx";
import {
  Datepicker as FlowbiteDatepicker,
  type DatepickerTheme,
} from "flowbite-react";
import { useEffect, useRef } from "react";

export interface DateValueType {
  startDate: Date | null;
  endDate: Date | null;
}

interface DatePickerProps {
  value: DateValueType;
  onChange: (newValue: DateValueType) => void;
  className?: string; // wrapper
  inputClassName?: string; // input
  placeholder?: string;
  onVisibilityChange?: (isVisible: boolean) => void;
}

/**
 * Theme wiring: attaches .croc-... classes
 * from date-picker.css to flowbite-react's internal structure.
 */
const crocTheme: Partial<DatepickerTheme> = {
  root: {
    base: "croc-datepicker-root",
  },
  popup: {
    root: {
      base: "croc-datepicker-popup",
      inline: "croc-datepicker-popup-inline",
      inner: "croc-datepicker-inner",
    },
    header: {
      base: "croc-datepicker-header",
      title: "croc-datepicker-title",
      selectors: {
        base: "croc-datepicker-header-controls",
        button: {
          base: "croc-datepicker-nav-button",
          prev: "",
          next: "",
          view: "croc-datepicker-month-label",
        },
      },
    },
    view: {
      base: "croc-datepicker-view",
    },
    footer: {
      base: "croc-datepicker-footer",
      button: {
        base: "croc-datepicker-footer-btn",
        today: "croc-datepicker-footer-btn--today",
        clear: "croc-datepicker-footer-btn--clear",
      },
    },
  },
  views: {
    // DAYS VIEW (main calendar grid)
    days: {
      header: {
        base: "croc-datepicker-dow-row",
        title: "croc-datepicker-dow",
      },
      items: {
        base: "croc-datepicker-grid",
        item: {
          base: "croc-datepicker-cell",
          selected: "croc-datepicker-cell--selected",
          disabled: "croc-datepicker-cell--disabled",
          today: "croc-datepicker-cell--today",
        },
      },
    },
    // MONTHS VIEW (used when clicking on month title)
    months: {
      items: {
        base: "croc-datepicker-grid",
        item: {
          base: "croc-datepicker-cell",
          selected: "croc-datepicker-cell--selected",
          disabled: "croc-datepicker-cell--disabled",
        },
      },
    },
    // YEARS VIEW
    years: {
      items: {
        base: "croc-datepicker-grid",
        item: {
          base: "croc-datepicker-cell",
          selected: "croc-datepicker-cell--selected",
          disabled: "croc-datepicker-cell--disabled",
        },
      },
    },
    // DECADES VIEW
    decades: {
      items: {
        base: "croc-datepicker-grid",
        item: {
          base: "croc-datepicker-cell",
          selected: "croc-datepicker-cell--selected",
          disabled: "croc-datepicker-cell--disabled",
        },
      },
    },
  },
};

export default function DatePicker({
  value,
  onChange,
  className,
  inputClassName,
  placeholder = "Select date",
  onVisibilityChange,
}: DatePickerProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<MutationObserver | null>(null);

  useEffect(() => {
    if (!onVisibilityChange || !rootRef.current) return;

    const checkVisibility = () => {
      const popup = rootRef.current?.querySelector(".croc-datepicker-popup");
      if (popup) {
        const style = window.getComputedStyle(popup);
        const isVisible =
          style.display !== "none" &&
          style.visibility !== "hidden" &&
          style.opacity !== "0";
        onVisibilityChange(isVisible);
      } else {
        onVisibilityChange(false);
      }
    };

    // Use MutationObserver to watch for popup changes
    observerRef.current = new MutationObserver(() => {
      checkVisibility();
    });

    // Observe the root element for changes
    observerRef.current.observe(rootRef.current, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["style", "class"],
    });

    // Also listen to click events to detect when calendar opens/closes
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const input = rootRef.current?.querySelector("input");
      const popup = rootRef.current?.querySelector(".croc-datepicker-popup");

      if (input?.contains(target)) {
        // Input was clicked, check visibility after a short delay
        setTimeout(checkVisibility, 100);
      } else if (popup && popup.contains(target)) {
        // Clicked inside popup, it should be visible
        setTimeout(checkVisibility, 50);
      } else {
        // Clicked outside, calendar should be hidden
        setTimeout(checkVisibility, 50);
      }
    };

    document.addEventListener("click", handleClick);
    checkVisibility(); // Initial check

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      document.removeEventListener("click", handleClick);
    };
  }, [onVisibilityChange]);

  return (
    <div ref={rootRef} className={clsx("w-full mb-6 relative", className)}>
      <FlowbiteDatepicker
        value={value.startDate ?? null}
        onChange={(date: Date | null) =>
          onChange({
            startDate: date,
            endDate: date,
          })
        }
        placeholder={placeholder}
        autoHide
        theme={crocTheme}
        className={clsx("w-full h-10 text-sm leading-normal", inputClassName)}
      />
    </div>
  );
}
