"use client";

import "@/components/custom-styles/date-picker.css";
import clsx from "clsx";
import { useEffect, useRef } from "react";

export interface DateValueType {
  startDate: Date | null;
  endDate: Date | null;
}

interface DatePickerProps {
  value: DateValueType;
  onChange: (newValue: DateValueType) => void;
  className?: string;
  inputClassName?: string;
  placeholder?: string;
}

export default function DatePicker({
  value,
  onChange,
  className,
  inputClassName,
  placeholder = "Select date",
}: DatePickerProps) {
  const ref = useRef<HTMLInputElement | null>(null);
  const datepickerInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (!ref.current) return;

    let instance: any;
    const inputEl = ref.current;

    let handleChangeDate: ((e: any) => void) | null = null;

    (async () => {
      // Dynamic import
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error: no official TS types for this module
      const DatepickerModule = await import("flowbite-datepicker/Datepicker");
      const Datepicker =
        (DatepickerModule as any).default || (DatepickerModule as any);

      instance = new Datepicker(inputEl, {
        autohide: true,
        format: "yyyy-mm-dd",
        orientation: "bottom auto",
      });

      // Listen to the DOM changeDate event
      handleChangeDate = (event: any) => {
        // Get the selected date from the event or from the instance
        const selected: Date | undefined =
          event?.detail?.date ||
          (instance && typeof instance.getDate === "function"
            ? instance.getDate()
            : undefined);

        if (selected) {
          // Immediately update the input value to ensure it's visible
          const dateStr = selected.toISOString().split("T")[0];
          if (inputEl && inputEl.value !== dateStr) {
            inputEl.value = dateStr;
          }

          // Also ensure the datepicker instance has the date set
          if (instance && typeof instance.setDate === "function") {
            instance.setDate(selected);
          }

          // Update the parent component state
          onChange({
            startDate: selected,
            endDate: selected,
          });

          // Hide the calendar after selecting a date
          requestAnimationFrame(() => {
            setTimeout(() => {
              // Remove active class from datepicker element to hide it
              const activeDatepicker =
                document.querySelector(".datepicker.active");
              if (activeDatepicker) {
                activeDatepicker.classList.remove("active");
              }
            }, 100);
          });
        }
      };

      inputEl.addEventListener("changeDate", handleChangeDate);
      datepickerInstanceRef.current = instance;
    })();

    return () => {
      if (handleChangeDate && inputEl) {
        inputEl.removeEventListener("changeDate", handleChangeDate);
      }
      if (instance && typeof instance.destroy === "function") {
        instance.destroy();
      }
    };
  }, [onChange]);

  // Keep input & datepicker in sync with external value
  useEffect(() => {
    const inputEl = ref.current;
    const instance = datepickerInstanceRef.current;

    if (!inputEl) return;

    if (value?.startDate) {
      const dateStr = value.startDate.toISOString().split("T")[0];

      if (inputEl.value !== dateStr) {
        inputEl.value = dateStr;
      }

      if (instance && typeof instance.setDate === "function") {
        instance.setDate(value.startDate);
      }
    } else {
      inputEl.value = "";
      if (instance && typeof instance.clear === "function") {
        instance.clear();
      }
    }
  }, [value]);

  return (
    <div className={clsx("w-full mb-6 relative", className)}>
      <input
        ref={ref}
        type="text"
        className={clsx(
          "w-full h-12 px-4 py-3 border rounded-2xl text-base leading-normal font-normal text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors",
          inputClassName
        )}
        placeholder={placeholder}
      />
    </div>
  );
}
