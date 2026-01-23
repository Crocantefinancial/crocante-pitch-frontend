import { AvatarIcon, Button, Input } from "@/components/index";

interface InputTokenProps {
  label: string;
  placeholder: string;
  value: string;
  valueUSD: string;
  onMaxClick: () => void;
  onMinClick?: () => void;
  onChangeUSD: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeValue: (e: React.ChangeEvent<HTMLInputElement>) => void;
  maxValue: string;
  minValue?: string;
  tokenCode: string;
  tokenIcon: React.ReactNode;
  handleFocus: (convertedInputFocused: boolean) => void;
}
export default function InputToken({
  label,
  placeholder,
  value,
  valueUSD,
  onMaxClick,
  onMinClick,
  onChangeUSD,
  onChangeValue,
  maxValue,
  minValue,
  tokenCode,
  tokenIcon,
  handleFocus,
}: InputTokenProps) {
  return (
    <div>
      <label className="block text-xs font-normal text-muted-foreground mb-1">
        {label}
      </label>
      <div className="flex items-center gap-1">
        <div className="w-full flex flex-row justify-between gap-1 flex-wrap">
          <div className="flex-1 relative w-1/2 min-w-[240px]">
            <Input
              type="text"
              placeholder={placeholder}
              value={valueUSD}
              onChange={onChangeUSD}
              className="h-12"
              noBottomSpace={true}
              onFocus={() => handleFocus(true)}
              onBlur={() => handleFocus(false)}
            />
            <div className="absolute right-3 -mt-7 -translate-y-1/2 text-sm font-normal text-foreground flex items-center gap-1">
              <AvatarIcon initials="$" color="primary" className="!w-6 !h-6" />
              USD
            </div>
          </div>
          <div className="flex-1 relative w-1/2 min-w-[240px]">
            <Input
              type="text"
              value={value}
              onChange={onChangeValue}
              className="h-12"
              noBottomSpace={true}
            />
            <div className="absolute right-3 -mt-7 -translate-y-1/2 text-sm font-normal text-foreground flex items-center gap-1">
              {tokenIcon && tokenIcon}
              {tokenCode} &nbsp;
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
