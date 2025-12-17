import clsx from "clsx";
import { ChevronDownIcon } from "lucide-react";
import React from "react";

export interface SelectOption {
  label: string;
  icon?: React.ReactNode;
  value: string;
}
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: Array<SelectOption>;
  label: string;
  className?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  secondaryLabel?: string;
  secondaryLabelAlign?: "left" | "right";
  block?: boolean;
  selectedIndex?: number;
}

export default function Select({
  options,
  label,
  className,
  secondaryLabel,
  secondaryLabelAlign = "left",
  onChange,
  block,
  selectedIndex,
  ...props
}: SelectProps) {
  const hasIcon = selectedIndex !== undefined && !!options[selectedIndex]?.icon;
  const selectedValue =
    selectedIndex !== undefined && options[selectedIndex]
      ? options[selectedIndex].value
      : undefined;

  return (
    <div className={clsx("flex flex-col", className)}>
      {label && (
        <label className="block mb-1 sm:mb-2 font-montserrat font-normal text-xs sm:text-sm leading-none text-neutral h-[1.2em]">
          {label}
        </label>
      )}
      <div className={clsx("relative border border-gray-200 rounded-lg p-3")}>
        {hasIcon && (
          <div className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2">
            {options[selectedIndex].icon}
          </div>
        )}
        <div className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <ChevronDownIcon className="w-4 h-4 text-neutral" />
        </div>
        <select
          className={clsx(
            "appearance-none focus:outline-none pr-12 sm:pr-16",
            className,
            hasIcon ? "pl-8 sm:pl-10" : "pl-3 sm:pl-4"
          )}
          {...props}
          value={selectedValue}
          onChange={onChange}
          disabled={block}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
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
