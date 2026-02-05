import { SelectorProps } from "@/components/core/select";
import { Button, InputSelectorToken, Label, Tabs } from "@/components/index";
import { useSession } from "@/context/session-provider";
import { useTokenSwap } from "@/hooks/use-token-swap";
import { useValueVerifier } from "@/hooks/use-value-verifier";
import { formatToMaxDefinition, parseValue } from "@/lib/utils";
import { LoanTypeData } from "@/services/hooks/types/loan-type-data";
import { ChangeEvent, useEffect } from "react";
import { LoanSelectedData } from "../hooks/use-loan-selected-data";

interface LoanComponentProps {
  isLoading: boolean;
  isSessionModeMock: boolean;
  isLoanPending: boolean;
  loanData: LoanTypeData;
  value: string;
  collateralValue: string;
  setCollateralValue: (value: string) => void;
  setValue: (value: string) => void;
  handleLoan: (userId: string, ratio: string, size: string, typeId: string) => void;
  assetSelector: SelectorProps;
  collateralSelector: SelectorProps;
  loanTypeSelector: SelectorProps;
  loanSelectedData: LoanSelectedData;
}

export default function LoanComponent({
  isLoading,
  isSessionModeMock,
  isLoanPending,
  loanData,
  value,
  collateralValue,
  setCollateralValue,
  setValue,
  handleLoan,
  assetSelector,
  collateralSelector,
  loanTypeSelector,
  loanSelectedData,
}: LoanComponentProps) {
  const TabValues = loanTypeSelector.options.reduce(
    (acc, option) => {
      acc[option.id] = option.label;
      return acc;
    },
    {} as Record<string, string>
  );

  const maxPossibleLoan = parseValue(loanSelectedData.maxPossibleLoan);
  const parsedMinValue = parseValue(loanSelectedData.minLoanValue);

  const { user } = useSession();
  const userId = user?.id.toString() || "";

  const {
    convertTo,
    conversionRateFrom: conversionRate,
  } = useTokenSwap(userId, loanSelectedData.tokenLabel, loanSelectedData.collateralLabel, isLoading);

  const handleChangeValue = (tokenValue: string) => {
    setValue(tokenValue);
    if (tokenValue) {
      const convertedValue = convertTo((loanSelectedData.loanTotalCost).toString());
      setCollateralValue(convertedValue);
    } else {
      setCollateralValue("0");
    }
  };

  useEffect(() => {
    if (conversionRate) {
      setCollateralValue(convertTo(loanSelectedData.loanTotalCost.toString()));
    }
  }, [conversionRate, loanSelectedData.loanTotalCost]);

  const { isValid: isValidValue } = useValueVerifier({
    value,
    min: Number(parsedMinValue),
    max: Number(maxPossibleLoan),
    requireNonZero: true,
  });

  const conditionsSuccess =
    !isSessionModeMock &&
    isValidValue &&
    loanSelectedData.selectedRowKey !== "" &&
    loanSelectedData.tokenLabel !== "" &&
    loanSelectedData.collateralLabel !== "";

  const renderLoanData = () => {
    if (!loanSelectedData.item) return null;
    const itemsClassName = "mb-1 text-primary text-sm"

    return (
      <div className="flex flex-col gap-2">
        <div className="bg-background rounded-lg overflow-hidden">
          <div className="w-1/2 mt-4 mb-2 mx-auto">
            <Label
              className={itemsClassName}
              label="APY:"
              secondaryLabel={`${formatToMaxDefinition(Number(loanSelectedData.item.apr) * 100)}% yearly`}
            />
            <Label
              className={itemsClassName}
              label="Overcollateralization:" secondaryLabel={`${formatToMaxDefinition(loanSelectedData.overcollateralizationRate * 100)}%`}
            />
            <Label
              className={itemsClassName}
              label="Origination Fee:" secondaryLabel={`${formatToMaxDefinition(loanSelectedData.originationFeeRate * 100)}%`}
            />
          </div>
        </div>
        <div className="bg-background rounded-lg overflow-hidden">
          <div className="w-1/2 mt-4 mb-2 mx-auto">
            <Label
              className={itemsClassName}
              label="Origination Cost:"
              secondaryLabel={`${formatToMaxDefinition(loanSelectedData.originationCost)} ${loanSelectedData.tokenLabel}`}
            />
            <Label
              className={itemsClassName}
              label="Overcollateralization:"
              secondaryLabel={`${formatToMaxDefinition(loanSelectedData.overcollateralizationCost)} ${loanSelectedData.tokenLabel}`}
            />
            <Label
              className={itemsClassName}
              label="Loan Total Cost:"
              secondaryLabel={`${formatToMaxDefinition(loanSelectedData.loanTotalCost)} ${loanSelectedData.tokenLabel}`}
            />
            <Label
              className={itemsClassName}
              label="Collateral:"
              secondaryLabel={`${Number(collateralValue)} ${loanSelectedData.collateralLabel}`}
            />
            <Label
              className={itemsClassName}
              label="Liquidation Price:"
              secondaryLabel={`
                ${formatToMaxDefinition(loanSelectedData.liquidationPrice)} 
                ${loanSelectedData.tokenLabel}/${loanSelectedData.collateralLabel}
              `}
            />
            <Label
              className={itemsClassName}
              label="Daily Cost:"
              secondaryLabel={`${formatToMaxDefinition(loanSelectedData.dailyCost)} ${loanSelectedData.tokenLabel}`}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-8">
        <div className="flex flex-col flex-1 min-w-[240px] gap-8">
          <InputSelectorToken
            label="Quantity"
            value={value}
            onChangeValue={(e) => handleChangeValue(e.target.value)}
            maxValue={loanSelectedData.maxPossibleLoan}
            minValue={loanSelectedData.minLoanValue}
            onMaxClick={() => handleChangeValue(maxPossibleLoan)}
            onMinClick={() => handleChangeValue(parsedMinValue)}
            tokenCode={loanSelectedData.tokenLabel}
            selectorProps={assetSelector}
          />
          <InputSelectorToken
            label="Collateral"
            value={collateralValue}
            tokenCode={loanSelectedData.collateralLabel}
            selectorProps={collateralSelector}
            disabled={true}
          />
        </div>
        <div className="flex flex-col flex-1 min-w-[240px]">
          {/* Loan Type Field */}
          {loanData?.models?.length > 0 && (
            <div className="bg-card rounded-lg max-w-full">
              <div className="flex items-end justify-between mb-1 gap-2">
                <Tabs
                  TabValues={TabValues}
                  selectedRow={loanSelectedData.selectedRow}
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
              {renderLoanData()}
            </div>
          )}
        </div>
      </div>
      <Button
        variant="primary"
        className="w-full justify-center mt-8 min-w-[240px]"
        onClick={() => handleLoan(userId, loanSelectedData.overcollateralizationRate.toString(), value, loanSelectedData.modelId)}
        disabled={!conditionsSuccess || isLoanPending}
        isLoading={isLoanPending}
      >
        Loan
      </Button>
    </div>
  );
}
