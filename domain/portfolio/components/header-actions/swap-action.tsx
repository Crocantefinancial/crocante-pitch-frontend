import { SwapModal } from "@/domain/portfolio/components";
import {
  TokenType,
  usePortfolioData,
} from "@/domain/portfolio/hooks/use-portfolio-data";
import { useModal } from "@/hooks/use-modal";
import { useSelector } from "@/hooks/use-selector";

import { useSwapData } from "@/domain/portfolio/hooks/use-swap-data";
import { useEffect, useState } from "react";

interface SwapActionProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}
export default function SwapAction({ open, setOpen }: SwapActionProps) {
  const { tokens, tokensOptions } = usePortfolioData();
  //const { tokensFrom, tokensTo } = useSwapData(selectedAsset.symbol);

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
    selectedRow: selectedSwapAsset,
    selectedIndex: selectedSwapAssetIndex,
    reset: resetSwapAssetSelector,
    change: changeSwapAssetSelection,
  } = useSelector<TokenType>(tokens || {}, 0, {
    onReset: handleResetValues,
    onChange: handleResetValues,
  });

  const handleResetSwapSelectors = () => {
    resetAssetSelector();
    resetSwapAssetSelector();
  };

  const {
    isOpen: swapModalOpen,
    open: openSwapModal,
    close: closeSwapModal,
  } = useModal(false, {
    onOpen: handleResetSwapSelectors,
    onClose: () => setOpen(false),
  });

  const handleSwap = () => {
    console.log(
      "SWAP",
      selectedAsset,
      selectedSwapAsset,
      value,
      valueUSD + " USD"
    );
  };

  useEffect(() => {
    if (open) {
      openSwapModal();
    }
  }, [open]);

  if (!tokens) return null;

  return (
    swapModalOpen && (
      <SwapModal
        swapModalOpen={swapModalOpen}
        setSwapModalOpen={closeSwapModal}
        handleSwap={handleSwap}
        value={value}
        valueReceive={valueUSD}
        setValue={setValue}
        setValueReceive={setValueUSD}
        assetSelector={{
          selectedIndex: selectedAssetIndex,
          onChange: changeAssetSelection,
          options: tokensOptions,
        }}
        assetSwapSelector={{
          selectedIndex: selectedSwapAssetIndex,
          onChange: changeSwapAssetSelection,
          options: tokensOptions,
        }}
      />
    )
  );
}
