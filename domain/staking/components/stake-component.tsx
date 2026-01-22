import { SelectorProps } from "@/components/core/select";
import { Button, InputToken, Label, Select, Tabs } from "@/components/index";
import { useSession } from "@/context/session-provider";
import { useTokenConversion } from "@/hooks/use-token-conversion";
import { useValueVerifier } from "@/hooks/use-value-verifier";
import { formatToMaxDefinition, parseValue } from "@/lib/utils";
import { StakingTypeData } from "@/services/hooks/types/staking-type-data";
import { ChangeEvent, useEffect, useState } from "react";

interface StakeComponentProps {
  isLoading: boolean;
  isStaking: boolean;
  stakeData: StakingTypeData;
  value: string;
  valueUSD: string;
  setValue: (value: string) => void;
  setValueUSD: (value: string) => void;
  handleStake: (userId: string, typeId: string) => void;
  assetSelector: SelectorProps;
  stakingTypeSelector: SelectorProps;
}

export default function StakeComponent({
  isLoading,
  isStaking,
  stakeData,
  value,
  valueUSD,
  setValue,
  setValueUSD,
  handleStake,
  assetSelector,
  stakingTypeSelector,
}: StakeComponentProps) {
  const TabValues = stakingTypeSelector.options.reduce(
    (acc, option) => {
      acc[option.id] = option.label;
      return acc;
    },
    {} as Record<string, string>
  );
  const selectedRow =
    stakingTypeSelector.options[stakingTypeSelector.selectedIndex]?.label || "";
  const selectedRowKey = Object.keys(TabValues).find(key => TabValues[key] === selectedRow);
  const item = stakeData.find(item => item.id === selectedRowKey);
  const tokenLabel =
    assetSelector.options[assetSelector.selectedIndex]?.label || "";
  const rawMaxValue =
    assetSelector.options[assetSelector.selectedIndex]?.value || "0";
  const rawMinValue = item?.minAmount || "0";

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
    stakeData.length > 0 &&
    assetSelector.options[assetSelector.selectedIndex]?.id !== undefined;

  const renderStakeDate = () => {
    if (!item) return null;
    const totalYield = Number(value) * Number(item.apy) / 365 * (Number(item.durationDays) || 1);
    const totalAccumulated = totalYield + Number(value);
    const tomorrow = new Date(new Date().getTime() + 1 * 24 * 60 * 60 * 1000);
    const endDate = new Date(tomorrow.getTime() + (Number(item.durationDays) || 1) * 24 * 60 * 60 * 1000);
    const itemsClassName = "mb-1 text-primary text-sm"
    return (
      <div className="w-1/2 mt-4 mb-2 mx-auto">
        <Label
          className={itemsClassName}
          label="APY:"
          secondaryLabel={`${formatToMaxDefinition(Number(item.apy) * 100)}% yearly`}
        />
        <Label
          className={itemsClassName}
          label="Duration:" secondaryLabel={item.durationDays ? item.durationDays + " days" : "Flexible"} />
        {item.durationDays ? (
          <>
            <Label
              className={itemsClassName}
              label="Total Yield:" secondaryLabel={`${formatToMaxDefinition(totalYield)} ${tokenLabel}`} />
            <Label
              className={itemsClassName}
              label="Total Accumulated:" secondaryLabel={`${formatToMaxDefinition(totalAccumulated)} ${tokenLabel}`} />
          </>
        ) : (
          <>
            <Label
              className={itemsClassName}
              label="Daily Yield:" secondaryLabel={`${formatToMaxDefinition(totalYield)} ${tokenLabel}`} />
            <Label
              className={itemsClassName}
              label="Next day:" secondaryLabel={`${formatToMaxDefinition(totalAccumulated)} ${tokenLabel}`} />
          </>
        )}
        <Label
          className={itemsClassName}
          label="Start Date:" secondaryLabel={tomorrow.toLocaleDateString()} />
        {item.durationDays ? (
          <Label
            className={itemsClassName}
            label="End Date:" secondaryLabel={endDate.toLocaleDateString()} />
        ) : (
          <Label
            className={itemsClassName}
            label="End Date:" secondaryLabel="Flexible" />
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-8">
        <div className="flex flex-col flex-1 min-w-[240px] gap-8">
          {/* Asset Field */}
          <Select className="w-full" label="Asset" properties={assetSelector} />

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
          {/* Staking Type Field */}
          {stakeData.length > 0 && (
            <div className="bg-card rounded-lg max-w-full">
              <div className="flex items-end justify-between mb-1 gap-2">
                <Tabs
                  TabValues={TabValues}
                  selectedRow={selectedRow}
                  onChange={(selectedRow) =>
                    stakingTypeSelector.onChange?.(
                      {
                        target: { value: selectedRow },
                      } as ChangeEvent<HTMLSelectElement>
                    )
                  }
                />
              </div>


              {/* Stake Data */}
              <div className="bg-background rounded-lg overflow-hidden">
                {renderStakeDate()}
              </div>
            </div>
          )}
        </div>
      </div>
      <Button
        variant="primary"
        className="w-full justify-center mt-8 min-w-[240px]"
        onClick={() => {
          handleStake(userId, selectedRowKey!);
        }}
        disabled={!conditionsSuccess || isStaking}
      >
        Stake
      </Button>
    </div>
  );
}
