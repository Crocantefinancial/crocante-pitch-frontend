import clsx from "clsx";
import {
  AlertCircleIcon as AlertIcon,
  CheckIcon,
  Eye,
  EyeOff,
} from "lucide-react";
import React, { forwardRef, useState } from "react";
import CircledExclamationIcon from "../icons/circled-exclamation-icon";
import Button from "./button";
import Tooltip from "./tooltip";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  type?: "text" | "email" | "password" | "number";
  label?: string;
  noEdit?: boolean;
  max?: number;
  onMaxClick?: () => void;
  validation?: "invalid" | "success" | null;
  validationMessage?: string;
  secondaryLabel?: string;
  secondaryLabelAlign?: "left" | "right";
  complexLabel?: {
    leftText: string;
    icon: React.ReactNode;
    rightText: string;
    align?: "left" | "right";
    tooltip?: string;
  };
  leftIcon?: React.ReactNode;
  noBottomSpace?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    type = "text",
    value,
    onChange,
    placeholder,
    disabled = false,
    label = "",
    noEdit = false,
    max,
    onMaxClick,
    validation = null,
    validationMessage = "",
    secondaryLabel,
    secondaryLabelAlign = "left",
    complexLabel,
    leftIcon,
    className,
    noBottomSpace = false,
    ...props
  },
  ref
) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword && showPassword ? "text" : type;

  const inputClassName = clsx({
    "!border-invalid": validation === "invalid",
    "!border-success": validation === "success",
    "!bg-disabled !border-secondary !text-neutral": noEdit, // noEdit is disabled input forced to default styles
    "!pl-10 sm:!pl-12": leftIcon,
    "!pr-10 sm:!pr-12": isPassword && !validation && !max,
    "!pr-20 sm:!pr-24": isPassword && (validation || max),
  });

  return (
    <div className={className}>
      {label && (
        <label className="block mb-1 sm:mb-2 font-normal text-xs sm:text-sm leading-none text-neutral h-[1.2em]">
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2">
            {leftIcon}
          </div>
        )}
        <input
          {...props}
          ref={ref}
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled || noEdit}
          className={inputClassName}
        />

        {/* Password Toggle Button */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            disabled={disabled || noEdit}
            className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
            ) : (
              <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
            )}
          </button>
        )}

        {/* Validation Icon */}
        {validation === "invalid" && (
          <div
            className={clsx(
              "absolute top-1/2 transform -translate-y-1/2",
              isPassword ? "right-10 sm:right-12" : "right-3 sm:right-4"
            )}
          >
            <AlertIcon className="text-invalid sm:w-4 sm:h-4" size={14} />
          </div>
        )}

        {validation === "success" && (
          <div
            className={clsx(
              "absolute top-1/2 transform -translate-y-1/2",
              isPassword ? "right-10 sm:right-12" : "right-3 sm:right-4"
            )}
          >
            <CheckIcon className="text-success sm:w-3.5 sm:h-3.5" size={12} />
          </div>
        )}

        {!!max && onMaxClick && (
          <div
            className={clsx(
              "absolute top-1/2 transform -translate-y-1/2",
              isPassword ? "right-10 sm:right-12" : "right-2 sm:right-3"
            )}
          >
            <Button
              onClick={onMaxClick}
              variant="secondary"
              disabled={noEdit}
              className="w-8 sm:w-10 h-4 sm:h-5 !rounded text-[0.625rem] sm:text-xs"
            >
              max.
            </Button>
          </div>
        )}
      </div>

      {/* Always reserve space for bottom content */}
      {!noBottomSpace && (
        <div className="mt-1 sm:mt-2 h-4 sm:h-5 items-center">
          {/* Validation Message */}
          {validation && validationMessage && (
            <div
              className={clsx(
                "font-inter font-normal text-xs sm:text-sm leading-none tracking-wider",
                {
                  "text-invalid": validation === "invalid",
                  "text-success": validation === "success",
                }
              )}
            >
              {validationMessage}
            </div>
          )}

          {/* Secondary Label */}
          {secondaryLabel && !validation && (
            <div
              className={clsx(
                "font-normal text-[0.625rem] sm:text-xs leading-none text-neutral",
                {
                  "text-right": secondaryLabelAlign === "right",
                  "text-left": secondaryLabelAlign === "left",
                }
              )}
            >
              {secondaryLabel}
            </div>
          )}

          {/* Complex Label */}
          {complexLabel && !validation && (
            <div
              className={clsx(
                "font-normal text-[0.625rem] sm:text-xs leading-none flex items-center gap-1 sm:gap-2",
                {
                  "justify-end": complexLabel.align === "right",
                  "justify-start": complexLabel.align === "left",
                }
              )}
            >
              <span className="text-neutral">{complexLabel.leftText}</span>
              <span className="text-neutral">{complexLabel.icon}</span>
              <Tooltip
                content={complexLabel.tooltip || ""}
                variant="default"
                trigger="hover"
                position="left"
                className="min-w-[240px]"
                delay={400}
              >
                <span className="text-primary flex items-center gap-1">
                  {complexLabel.rightText} <CircledExclamationIcon size={10} />
                </span>
              </Tooltip>
            </div>
          )}
        </div>
      )}
    </div>
  );
});

export default Input;
