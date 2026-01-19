import { AvatarIcon, Button, Input } from "@/components/index";

interface InputTokenProps {
  label: string;
  placeholder: string;
  value: string;
  valueUSD: string;
  onMaxClick: () => void;
  onChangeUSD: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeValue: (e: React.ChangeEvent<HTMLInputElement>) => void;
  maxValue: string;
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
  onChangeUSD,
  onChangeValue,
  maxValue,
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
        <div className="w-full flex flex-row justify-between gap-1">
          <div className="relative w-1/2">
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
          <div className="relative w-1/2">
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
    </div>
  );
}
