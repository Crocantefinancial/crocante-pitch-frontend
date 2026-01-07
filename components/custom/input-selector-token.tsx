import { Button, Input, Select, SelectorProps } from "@/components/index";

interface InputSelectorTokenProps {
  label: string;
  value: string;
  onMaxClick?: () => void;
  onChangeValue: (e: React.ChangeEvent<HTMLInputElement>) => void;
  maxValue?: string;
  tokenCode?: string;
  selectorProps: SelectorProps;
}
export default function InputSelectorToken({
  label,
  value,
  onMaxClick,
  onChangeValue,
  maxValue,
  tokenCode,
  selectorProps,
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
              onChange={onChangeValue}
              className="h-12"
              noBottomSpace={true}
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
        <div className="flex items-center gap-1 -mt-4">
          <Button
            variant="outline"
            className="text-xs mt-1.5"
            onClick={onMaxClick}
          >
            Max
          </Button>
          <p
            className="text-xs text-muted-foreground mt-1.5 cursor-pointer"
            onClick={onMaxClick}
          >
            {maxValue} {tokenCode}
          </p>
        </div>
      )}
    </div>
  );
}
