import { SelectorProps } from "@/components/core/select";
import { Button, InputToken, Modal, Select } from "@/components/index";
import { useTokenConversion } from "@/hooks/use-token-conversion";
import { useValueVerifier } from "@/hooks/use-value-verifier";
import { parseValue } from "@/lib/utils";
import { Send } from "lucide-react";

interface SendModalProps {
  sendModalOpen: boolean;
  setSendModalOpen: (open: boolean) => void;
  value: string;
  valueUSD: string;
  setValue: (value: string) => void;
  setValueUSD: (value: string) => void;
  handleSend: () => void;
  assetSelector: SelectorProps;
  fromSelector: SelectorProps;
  toSelector: SelectorProps;
}

export default function SendModal({
  sendModalOpen,
  setSendModalOpen,
  value,
  valueUSD,
  setValue,
  setValueUSD,
  handleSend,
  assetSelector,
  fromSelector,
  toSelector,
}: SendModalProps) {
  const tokenLabel =
    assetSelector.options[assetSelector.selectedIndex]?.label || "";
  const rawMaxValue =
    assetSelector.options[assetSelector.selectedIndex]?.value || "0";

  const parsedMaxValue = parseValue(rawMaxValue);

  const { convertToUSD, convertFromUSD } = useTokenConversion(tokenLabel);

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

  const { isValid: isValidValue } = useValueVerifier({
    value,
    min: 0,
    max: Number(parsedMaxValue),
    requireNonZero: true,
  });

  const conditionsSuccess =
    isValidValue &&
    fromSelector.options[fromSelector.selectedIndex]?.id !==
      toSelector.options[toSelector.selectedIndex]?.id;

  return (
    <Modal
      open={sendModalOpen}
      onClose={() => setSendModalOpen(false)}
      icon={<Send className="w-5 h-5 text-muted-foreground" />}
      title="Send"
      actions={() => (
        <Button
          variant="primary"
          className="w-full justify-center"
          onClick={() => {
            handleSend();
            setSendModalOpen(false);
          }}
          disabled={!conditionsSuccess}
        >
          Send
        </Button>
      )}
    >
      <div className="space-y-4">
        {/* Asset Field */}
        <Select className="w-full" label="Asset" properties={assetSelector} />

        {/* From Field */}
        <Select className="w-full" label="From" properties={fromSelector} />

        {/* To Field */}
        <Select className="w-full" label="To" properties={toSelector} />

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
        />
      </div>
    </Modal>
  );
}
