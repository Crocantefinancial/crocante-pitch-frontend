import { SendModal } from "@/domain/portfolio/components";
import {
  FromType,
  TokenType,
  ToType,
  usePortfolioData,
} from "@/domain/portfolio/hooks/use-portfolio-data";
import { useModal } from "@/hooks/use-modal";
import { useSelector } from "@/hooks/use-selector";
import { useEffect, useState } from "react";

interface SendActionProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}
export default function SendAction({ open, setOpen }: SendActionProps) {
  const {
    tokens,
    tokensOptions,
    custodiansFrom,
    fromOptions,
    custodiansTo,
    toOptions,
  } = usePortfolioData();

  const [value, setValue] = useState("");
  const [valueUSD, setValueUSD] = useState("");

  const handleResetValues = () => {
    setValue("");
    setValueUSD("");
  };

  const {
    selectedRow: selectedAsset,
    selectedIndex: selectedAssetIndex,
    reset: resetAssetSelector,
    change: changeAssetSelection,
  } = useSelector<TokenType>(tokens || {}, 0, {
    onReset: handleResetValues,
    onChange: handleResetValues,
  });

  const {
    selectedRow: selectedFrom,
    selectedIndex: selectedFromIndex,
    reset: resetFromSelector,
    change: changeFromSelection,
  } = useSelector<FromType>(custodiansFrom || {}, 0, {});

  const {
    selectedRow: selectedTo,
    selectedIndex: selectedToIndex,
    reset: resetToSelector,
    change: changeToSelection,
  } = useSelector<ToType>(custodiansTo || {}, 0, {});

  const handleResetSendSelectors = () => {
    resetAssetSelector();
    resetFromSelector();
    resetToSelector();
  };

  const {
    isOpen: sendModalOpen,
    open: openSendModal,
    close: closeSendModal,
  } = useModal(false, {
    onOpen: handleResetSendSelectors,
    onClose: () => setOpen(false),
  });

  useEffect(() => {
    if (open) {
      openSendModal();
    }
  }, [open]);

  const handleSend = () => {
    console.log(
      "SEND",
      selectedAsset,
      selectedFrom,
      selectedTo,
      value,
      valueUSD + " USD"
    );
  };

  if (!tokens || !custodiansFrom || !custodiansTo) return null;

  return (
    sendModalOpen &&
    tokens && (
      <SendModal
        sendModalOpen={sendModalOpen}
        setSendModalOpen={closeSendModal}
        handleSend={handleSend}
        value={value}
        valueUSD={valueUSD}
        setValue={setValue}
        setValueUSD={setValueUSD}
        assetSelector={{
          selectedIndex: selectedAssetIndex,
          onChange: changeAssetSelection,
          options: tokensOptions,
        }}
        fromSelector={{
          selectedIndex: selectedFromIndex,
          onChange: changeFromSelection,
          options: fromOptions,
        }}
        toSelector={{
          selectedIndex: selectedToIndex,
          onChange: changeToSelection,
          options: toOptions,
        }}
      />
    )
  );
}
