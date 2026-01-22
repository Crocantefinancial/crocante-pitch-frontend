import { SelectorProps } from "@/components/core/select";
import {
  Button,
  DynamicAvatarButton,
  InputSelectorToken,
  Modal,
} from "@/components/index";
import { SWAP_ICON } from "@/config/operation-icons";
import { useSession } from "@/context/session-provider";
import { useTokenSwap } from "@/hooks/use-token-swap";
import { useValueVerifier } from "@/hooks/use-value-verifier";
import { parseValue } from "@/lib/utils";
import { ArrowDown, ArrowUpDown, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

interface SwapModalProps {
  isLoading: boolean;
  isSwapping: boolean;
  swapModalOpen: boolean;
  setSwapModalOpen: (open: boolean) => void;
  value: string;
  valueReceive: string;
  setValue: (value: string) => void;
  setValueReceive: (value: string) => void;
  handleSwap: (userId: string) => void;
  assetSelector: SelectorProps;
  assetSwapSelector: SelectorProps;
  handleSwapSelectors: (tokenLabel: string, tokenSwapLabel: string) => void;
}

export default function SwapModal({
  isLoading,
  isSwapping,
  swapModalOpen,
  setSwapModalOpen,
  value,
  valueReceive,
  setValue,
  setValueReceive,
  handleSwap,
  assetSelector,
  assetSwapSelector,
  handleSwapSelectors,
}: SwapModalProps) {
  const tokenLabel =
    assetSelector.options[assetSelector.selectedIndex]?.label || "";
  const tokenSwapLabel =
    assetSwapSelector.options[assetSwapSelector.selectedIndex]?.label || "";
  const rawMaxValue =
    assetSelector.options[assetSelector.selectedIndex]?.value || "0";

  const parsedMaxValue = parseValue(rawMaxValue);

  const { user } = useSession();
  const userId = user?.id.toString() || "";

  const [inputReceiveFocused, setInputReceiveFocused] = useState(false);

  const {
    convertTo,
    convertFrom,
    conversionRateFrom,
    commissionRate,
    minAmount,
  } = useTokenSwap(userId, tokenLabel, tokenSwapLabel, isLoading);

  const handleChangeValueReceive = (valueReceive: string) => {
    setValueReceive(valueReceive);
    if (valueReceive) {
      const convertedValue = convertFrom(valueReceive);
      setValue(convertedValue);
    } else {
      setValue("0");
    }
  };

  const handleChangeValue = (tokenValue: string) => {
    setValue(tokenValue);
    if (tokenValue) {
      const convertedReceive = convertTo(tokenValue);
      setValueReceive(convertedReceive);
    } else {
      setValueReceive("0");
    }
  };

  useEffect(() => {
    if (conversionRateFrom) {
      if (inputReceiveFocused) {
        setValue(convertFrom(valueReceive));
      } else {
        setValueReceive(convertTo(value));
      }
    }
  }, [conversionRateFrom]);

  const { isValid: isValidValue } = useValueVerifier({
    value,
    min: minAmount ? Number(minAmount) : 0,
    max: Number(parsedMaxValue),
    requireNonZero: true,
  });

  const conditionsSuccess =
    isValidValue &&
    assetSelector.options[assetSelector.selectedIndex]?.id !==
    assetSwapSelector.options[assetSwapSelector.selectedIndex]?.id &&
    commissionRate &&
    minAmount;

  return (
    <Modal
      open={swapModalOpen}
      onClose={() => setSwapModalOpen(false)}
      icon={<SWAP_ICON className="w-5 h-5 text-muted-foreground" />}
      title="Swap"
      actions={() => (
        <Button
          variant="primary"
          className="w-full justify-center"
          onClick={() => {
            handleSwap(userId);
          }}
          disabled={!conditionsSuccess || isSwapping}
        >
          {isSwapping ? (
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground italic">Swapping...</span>
              <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" />
            </div>
          ) : (
            "Swap"
          )}
          {conditionsSuccess && (
            <span className="text-secondary-foreground text-xs italic">
              (Fee: {Number(commissionRate) * Number(value)} {tokenSwapLabel})
            </span>
          )}
        </Button>
      )}
    >
      <div className="space-y-4">
        {/* Asset Field */}
        <InputSelectorToken
          label="Send"
          value={value}
          onMaxClick={() => handleChangeValue(parsedMaxValue)}
          onChangeValue={(e) => handleChangeValue(e.target.value)}
          maxValue={rawMaxValue}
          minValue={minAmount}
          onMinClick={
            minAmount ? () => handleChangeValue(minAmount) : undefined
          }
          tokenCode={
            assetSelector.options[assetSelector.selectedIndex]?.label || ""
          }
          selectorProps={assetSelector}
        />

        <div className="flex justify-center">
          <DynamicAvatarButton
            icon={<ArrowDown className="w-5 h-5 text-muted-foreground" />}
            iconHover={
              <ArrowUpDown className="w-5 h-5 text-muted-foreground" />
            }
            onClick={() => {
              handleSwapSelectors(tokenLabel, tokenSwapLabel);
            }}
            disabled={isLoading}
          />
        </div>
        {/* Asset Swap Field */}
        {isLoading ? (
          <div className="flex justify-center">
            <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" />
          </div>
        ) : (
          <InputSelectorToken
            label="Receive"
            value={valueReceive}
            onChangeValue={(e) => handleChangeValueReceive(e.target.value)}
            selectorProps={assetSwapSelector}
            onFocus={() => {
              setInputReceiveFocused(true);
            }}
            onBlur={() => {
              setInputReceiveFocused(false);
            }}
          />
        )}
      </div>
    </Modal>
  );
}
