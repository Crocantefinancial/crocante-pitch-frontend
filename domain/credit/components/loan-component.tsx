import { SelectorProps } from "@/components/core/select";
import { Button, InputToken, Label, Select, Tabs } from "@/components/index";
import { useSession } from "@/context/session-provider";
import { useTokenConversion } from "@/hooks/use-token-conversion";
import { useValueVerifier } from "@/hooks/use-value-verifier";
import { formatToMaxDefinition, parseValue } from "@/lib/utils";
import { LoanTypeData } from "@/services/hooks/types/loan-type-data";
import { ChangeEvent, useEffect, useState } from "react";

interface LoanComponentProps {
  isLoading: boolean;
  isLoan: boolean;
  loanData: LoanTypeData;
  value: string;
  valueUSD: string;
  setValue: (value: string) => void;
  setValueUSD: (value: string) => void;
  handleLoan: (userId: string, typeId: string) => void;
  assetSelector: SelectorProps;
  collateralSelector: SelectorProps;
  loanTypeSelector: SelectorProps;
}

export default function LoanComponent({
  isLoading,
  isLoan,
  loanData,
  value,
  valueUSD,
  setValue,
  setValueUSD,
  handleLoan,
  assetSelector,
  collateralSelector,
  loanTypeSelector,
}: LoanComponentProps) {
  const TabValues = loanTypeSelector.options.reduce(
    (acc, option) => {
      acc[option.id] = option.label;
      return acc;
    },
    {} as Record<string, string>
  );
  const selectedRow =
    loanTypeSelector.options[loanTypeSelector.selectedIndex]?.label || "";
  const selectedRowKey = Object.keys(TabValues).find(key => TabValues[key] === selectedRow);
  const item = loanData?.models?.find(item => item.ratio === selectedRowKey);
  const tokenLabel =
    assetSelector.options[assetSelector.selectedIndex]?.label || "";
  const rawMaxValue =
    assetSelector.options[assetSelector.selectedIndex]?.value || "0";
  const rawMinValue = loanData?.minSize ?? "0";

  const parsedMaxValue = parseValue(rawMaxValue);
  const parsedMinValue = parseValue(rawMinValue);

  const { user } = useSession();
  const userId = user?.id.toString() || "";

  const [convertedInputFocused, setConvertedInputFocused] = useState(false);

  const { convertToUSD, convertFromUSD, conversionRate } = useTokenConversion(
    userId,
    tokenLabel
  );

  const handleChangeUSD = (usdValue: string) => {
    setValueUSD(usdValue);
    if (usdValue) {
      const convertedValue = convertFromUSD(usdValue);
      setValue(convertedValue);
    } else {
      setValue("0");
    }
  };

  const handleChangeValue = (tokenValue: string) => {
    setValue(tokenValue);
    if (tokenValue) {
      const convertedUSD = convertToUSD(tokenValue);
      setValueUSD(convertedUSD);
    } else {
      setValueUSD("0");
    }
  };

  useEffect(() => {
    if (conversionRate) {
      if (convertedInputFocused) {
        setValue(convertFromUSD(valueUSD));
      } else {
        setValueUSD(convertToUSD(value));
      }
    }
  }, [conversionRate]);

  const { isValid: isValidValue } = useValueVerifier({
    value,
    min: Number(parsedMinValue),
    max: Number(parsedMaxValue),
    requireNonZero: true,
  });

  const conditionsSuccess =
    isValidValue &&
    selectedRowKey !== undefined &&
    assetSelector.options[assetSelector.selectedIndex]?.id !== undefined;

  const renderLoanData = () => {
    if (!item) return null;
    const itemsClassName = "mb-1 text-primary text-sm"
    return (
      <div className="w-1/2 mt-4 mb-2 mx-auto">
        <Label
          className={itemsClassName}
          label="APY:"
          secondaryLabel={`${formatToMaxDefinition(Number(item.apr) * 100)}% yearly`}
        />
        <Label
          className={itemsClassName}
          label="Overcollateralization:" secondaryLabel={`${formatToMaxDefinition(Number(item.ratio) * 100)}%`} />
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-8">
        <div className="flex flex-col flex-1 min-w-[240px] gap-8">
          {/* Asset Field */}
          <Select className="w-full" label="Asset" properties={assetSelector} />
          <Select className="w-full" label="Collateral" properties={collateralSelector} />

          {/* Quantity Field */}
          <InputToken
            label="Quantity"
            placeholder={`Equivalent`}
            value={value}
            valueUSD={valueUSD}
            onMaxClick={() => handleChangeValue(parsedMaxValue)}
            onMinClick={() => handleChangeValue(parsedMinValue)}
            onChangeUSD={(e) => handleChangeUSD(e.target.value)}
            onChangeValue={(e) => handleChangeValue(e.target.value)}
            maxValue={rawMaxValue}
            minValue={rawMinValue}
            tokenCode={tokenLabel}
            tokenIcon={assetSelector.options[assetSelector.selectedIndex]?.icon}
            handleFocus={setConvertedInputFocused}
          />
        </div>
        <div className="flex flex-col flex-1 min-w-[240px]">
          {/* Loan Type Field */}
          {loanData?.models?.length > 0 && (
            <div className="bg-card rounded-lg max-w-full">
              <div className="flex items-end justify-between mb-1 gap-2">
                <Tabs
                  TabValues={TabValues}
                  selectedRow={selectedRow}
                  onChange={(selectedRow) =>
                    loanTypeSelector.onChange?.(
                      {
                        target: { value: selectedRow },
                      } as ChangeEvent<HTMLSelectElement>
                    )
                  }
                />
              </div>


              {/* Loan Data */}
              <div className="bg-background rounded-lg overflow-hidden">
                {renderLoanData()}
              </div>
            </div>
          )}
        </div>
      </div>
      <Button
        variant="primary"
        className="w-full justify-center mt-8 min-w-[240px]"
        onClick={() => {
          handleLoan(userId, selectedRowKey!);
        }}
        disabled={!conditionsSuccess || isLoan}
      >
        Loan
      </Button>
    </div>
  );
}
