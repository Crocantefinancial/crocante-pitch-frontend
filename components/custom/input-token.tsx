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
}: InputTokenProps) {
  return (
    <div>
      <label className="block text-sm font-normal text-muted-foreground mb-2">
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
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-normal text-foreground flex items-center gap-1">
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
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-normal text-foreground">
              {tokenIcon && (
                <div className="inline-block mr-1">{tokenIcon}</div>
              )}
              {tokenCode} &nbsp;
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-1 -mt-1">
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
