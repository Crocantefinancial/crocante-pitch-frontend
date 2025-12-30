import clsx from "clsx";
import { ChevronDownIcon } from "lucide-react";
import React from "react";

export interface SelectOption {
  id: string;
  label: string;
  icon?: React.ReactNode;
  value?: string;
}

export interface SelectorProps {
  selectedIndex: number;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: Array<SelectOption>;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  className?: string;
  secondaryLabel?: string;
  secondaryLabelAlign?: "left" | "right";
  block?: boolean;
  properties: SelectorProps;
}

export default function Select({
  label,
  className,
  secondaryLabel,
  secondaryLabelAlign = "left",
  block,
  properties,
  ...props
}: SelectProps) {
  const { selectedIndex, options, onChange } = properties;
  const hasIcon = selectedIndex !== undefined && !!options[selectedIndex]?.icon;
  const selectedLabel =
    selectedIndex !== undefined && options[selectedIndex]
      ? options[selectedIndex].label
      : undefined;

  return (
    <div className={clsx("flex flex-col", className)}>
      {label && (
        <label className="block mb-1 sm:mb-2 font-montserrat font-normal text-xs sm:text-sm leading-none text-neutral h-[1.2em]">
          {label}
        </label>
      )}
      <div
        className={clsx(
          "relative border border-gray-200 rounded-lg p-1 hover:bg-secondary"
        )}
      >
        {hasIcon && (
          <div className="absolute top-1/2 transform -translate-y-1/2">
            {options[selectedIndex].icon}
          </div>
        )}
        <div className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <ChevronDownIcon className="w-4 h-4 text-neutral" />
        </div>
        <select
          className={clsx(
            "custom-select",
            className,
            hasIcon ? "pl-8 sm:pl-10" : "pl-3 sm:pl-4"
          )}
          {...props}
          value={selectedLabel}
          onChange={onChange}
          disabled={block}
        >
          {options.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      {/* Secondary Label */}
      {secondaryLabel && (
        <div className="mt-1 sm:mt-2 h-4 sm:h-5 items-center">
          <div
            className={clsx(
              "font-montserrat font-normal text-[0.625rem] sm:text-xs leading-none text-neutral",
              {
                "text-right": secondaryLabelAlign === "right",
                "text-left": secondaryLabelAlign === "left",
              }
            )}
          >
            {secondaryLabel}
          </div>
        </div>
      )}
    </div>
  );
}
