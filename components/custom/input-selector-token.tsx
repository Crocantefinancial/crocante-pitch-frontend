import { Button, Input, Select, SelectorProps } from "@/components/index";

interface InputSelectorTokenProps {
  label: string;
  value: string;
  placeholder?: string;
  onMaxClick?: () => void;
  onChangeValue?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  maxValue?: string;
  minValue?: string;
  onMinClick?: () => void;
  tokenCode?: string;
  selectorProps: SelectorProps;
  onFocus?: () => void;
  onBlur?: () => void;
  disabled?: boolean;
}
export default function InputSelectorToken({
  label,
  value,
  placeholder,
  onMaxClick,
  onChangeValue,
  maxValue,
  minValue,
  onMinClick,
  tokenCode,
  selectorProps,
  onFocus,
  onBlur,
  disabled,
}: InputSelectorTokenProps) {
  return (
    <div>
      <label className="block text-sm font-normal text-muted-foreground mb-2">
        {label}
      </label>
      <div className="flex items-center gap-1">
        <div className="w-full flex flex-row justify-between gap-1">
          <div className="relative w-full">
            <Input
              type="text"
              value={value}
              placeholder={placeholder}
              onChange={onChangeValue}
              className="h-12"
              noBottomSpace={true}
              onFocus={onFocus}
              onBlur={onBlur}
              noEdit={disabled}
            />
            <div className="absolute right-1 -mt-7 -translate-y-1/2 text-sm font-normal text-foreground flex items-center">
              <Select
                className="w-full border-none"
                label=""
                properties={selectorProps}
              />
            </div>
          </div>
        </div>
      </div>
      {onMaxClick && (
        <div className="flex flex-col gap-1 items-start">
          <Button
            variant="outline"
            className="text-xs -mt-2.5"
            onClick={onMaxClick}
          >
            Max
            <p className="text-xs text-muted-foreground cursor-pointer">
              {maxValue} {tokenCode}
            </p>
          </Button>

          {onMinClick && (
            <Button
              variant="outline"
              className="text-xs -mt-2.5"
              onClick={onMinClick}
            >
              Min
              <p className="text-xs text-muted-foreground cursor-pointer">
                {minValue} {tokenCode}
              </p>
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
