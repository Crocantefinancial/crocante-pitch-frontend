import { SelectorProps } from "@/components/core/select";
import { Button, InputToken, Modal, Select, Tabs } from "@/components/index";
import { useSession } from "@/context/session-provider";
import { useTokenConversion } from "@/hooks/use-token-conversion";
import { useValueVerifier } from "@/hooks/use-value-verifier";
import { parseValue } from "@/lib/utils";
import { DatabaseZap as Staking } from "lucide-react";
import { ChangeEvent, useEffect, useState } from "react";

interface StakeModalProps {
  stakeModalOpen: boolean;
  setStakeModalOpen: (open: boolean) => void;
  value: string;
  valueUSD: string;
  setValue: (value: string) => void;
  setValueUSD: (value: string) => void;
  handleStake: () => void;
  assetSelector: SelectorProps;
  stakingTypeSelector: SelectorProps;
}

export default function StakeModal({
  stakeModalOpen,
  setStakeModalOpen,
  value,
  valueUSD,
  setValue,
  setValueUSD,
  handleStake,
  assetSelector,
  stakingTypeSelector,
}: StakeModalProps) {
  const tokenLabel =
    assetSelector.options[assetSelector.selectedIndex]?.label || "";
  const rawMaxValue =
    assetSelector.options[assetSelector.selectedIndex]?.value || "0";

  const parsedMaxValue = parseValue(rawMaxValue);
  //const parsedMinAmount = parseValue(assetSelector.options[assetSelector.selectedIndex]?.minAmount || "0");
  const parsedMinAmount = 0.000000001;

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
    min: Number(parsedMinAmount),
    max: Number(parsedMaxValue),
    requireNonZero: true,
  });

  const conditionsSuccess =
    isValidValue &&
    assetSelector.options[assetSelector.selectedIndex]?.id !== undefined;

  const renderTable = () => {
    return (
      <div>
        <h1>Table</h1>
      </div>
    );
  };

  const TabValues = stakingTypeSelector.options.reduce(
    (acc, option) => {
      acc[option.id] = option.label;
      return acc;
    },
    {} as Record<string, string>
  );
  const selectedRow =
    stakingTypeSelector.options[stakingTypeSelector.selectedIndex]?.label || "";

  return (
    <Modal
      open={stakeModalOpen}
      onClose={() => setStakeModalOpen(false)}
      icon={<Staking className="w-5 h-5 text-muted-foreground" />}
      title="Stake"
      actions={() => (
        <Button
          variant="primary"
          className="w-full justify-center"
          onClick={() => {
            handleStake();
            setStakeModalOpen(false);
          }}
          disabled={!conditionsSuccess}
        >
          Stake
        </Button>
      )}
    >
      <div className="space-y-4">
        {/* Asset Field */}
        <Select className="w-full" label="Asset" properties={assetSelector} />

        {/* Quantity Field */}
        <InputToken
          label="Quantity"
          placeholder={`Equivalent`}
          value={value}
          valueUSD={valueUSD}
          onMaxClick={() => handleChangeValue(parsedMaxValue)}
          onChangeUSD={(e) => handleChangeUSD(e.target.value)}
          onChangeValue={(e) => handleChangeValue(e.target.value)}
          maxValue={rawMaxValue}
          tokenCode={tokenLabel}
          tokenIcon={assetSelector.options[assetSelector.selectedIndex]?.icon}
          handleFocus={setConvertedInputFocused}
        />

        {/* Staking Type Field */}
        <div className="bg-card rounded-lg p-6">
          <div className="flex items-end justify-between mb-6 gap-2">
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

          {/* Table */}
          <div className="bg-background rounded-lg overflow-hidden">
            {renderTable()}
          </div>
        </div>
      </div>
    </Modal>
  );
}
