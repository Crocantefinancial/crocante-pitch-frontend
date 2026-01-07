import { SelectorProps } from "@/components/core/select";
import {
  Button,
  DynamicAvatarButton,
  InputSelectorToken,
  Modal,
} from "@/components/index";
import { useSession } from "@/context/session-provider";
import { useTokenSwap } from "@/hooks/use-token-swap";
import { useValueVerifier } from "@/hooks/use-value-verifier";
import { parseValue } from "@/lib/utils";
import { ArrowDown, ArrowUpDown, Repeat as Swap } from "lucide-react";

interface SwapModalProps {
  swapModalOpen: boolean;
  setSwapModalOpen: (open: boolean) => void;
  value: string;
  valueReceive: string;
  setValue: (value: string) => void;
  setValueReceive: (value: string) => void;
  handleSwap: () => void;
  assetSelector: SelectorProps;
  assetSwapSelector: SelectorProps;
}

export default function SwapModal({
  swapModalOpen,
  setSwapModalOpen,
  value,
  valueReceive,
  setValue,
  setValueReceive,
  handleSwap,
  assetSelector,
  assetSwapSelector,
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

  const { convertTo, convertFrom } = useTokenSwap(
    userId,
    tokenLabel,
    tokenSwapLabel
  );

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

  const { isValid: isValidValue } = useValueVerifier({
    value,
    min: 0,
    max: Number(parsedMaxValue),
    requireNonZero: true,
  });

  const conditionsSuccess =
    isValidValue &&
    assetSelector.options[assetSelector.selectedIndex]?.id !==
      assetSwapSelector.options[assetSwapSelector.selectedIndex]?.id;

  const handleSwapSelectors = () => {
    assetSelector.onChange?.({
      target: { value: tokenSwapLabel },
    } as React.ChangeEvent<HTMLSelectElement>);
    assetSwapSelector.onChange?.({
      target: { value: tokenLabel },
    } as React.ChangeEvent<HTMLSelectElement>);
  };

  return (
    <Modal
      open={swapModalOpen}
      onClose={() => setSwapModalOpen(false)}
      icon={<Swap className="w-5 h-5 text-muted-foreground" />}
      title="Swap"
      actions={() => (
        <Button
          variant="primary"
          className="w-full justify-center"
          onClick={() => {
            handleSwap();
            setSwapModalOpen(false);
          }}
          disabled={!conditionsSuccess}
        >
          Swap
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
              handleSwapSelectors();
            }}
          />
        </div>
        {/* Asset Swap Field */}
        <InputSelectorToken
          label="Receive"
          value={valueReceive}
          onChangeValue={(e) => handleChangeValueReceive(e.target.value)}
          selectorProps={assetSwapSelector}
        />
      </div>
    </Modal>
  );
}
