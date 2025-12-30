import { useCallback, useMemo } from "react";
import { SelectOption } from "./select";

import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import clsx from "clsx";

interface RadioGroupProps {
  label: string;
  options: Array<SelectOption>;
  selectedIndex: number;
  onChange: (id: string) => void;
  className?: string;
}

export default function RadioGroup({
  label,
  options,
  selectedIndex,
  onChange,
  className,
}: RadioGroupProps) {
  const selectedValue = useMemo(
    () => options[selectedIndex]?.id ?? "",
    [options, selectedIndex]
  );

  const handleValueChange = useCallback(
    (value: string) => {
      // Only call onChange if the value actually changed
      if (value !== selectedValue) {
        onChange(value);
      }
    },
    [selectedValue, onChange]
  );

  return (
    <div className={clsx("flex flex-col gap-2", className)}>
      <label className="block  font-montserrat font-normal text-xs leading-none text-neutral h-[1.2em]">
        {label}
      </label>
      <RadioGroupPrimitive.Root
        value={selectedValue}
        onValueChange={handleValueChange}
        className="flex flex-row gap-2"
      >
        {options.map((option) => (
          <RadioGroupPrimitive.Item
            key={option.id}
            value={option.id}
            className="flex items-center gap-2"
          >
            <div className="relative flex items-center justify-center w-4 h-4 border border-gray-200 rounded-full">
              <RadioGroupPrimitive.Indicator className="absolute flex items-center justify-center w-2 h-2 bg-gray-900 rounded-full" />
            </div>
            <span className="text-sm font-normal text-neutral">
              {option.label}
            </span>
          </RadioGroupPrimitive.Item>
        ))}
      </RadioGroupPrimitive.Root>
    </div>
  );
}
