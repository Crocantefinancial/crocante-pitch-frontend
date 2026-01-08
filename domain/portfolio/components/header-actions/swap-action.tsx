import { SwapModal } from "@/domain/portfolio/components";
import { TokenType } from "@/domain/portfolio/hooks/use-portfolio-data";
import { useSwapData } from "@/domain/portfolio/hooks/use-swap-data";
import { useModal } from "@/hooks/use-modal";
import { useSelector } from "@/hooks/use-selector";
import { useEffect, useState } from "react";

interface SwapActionProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}
export default function SwapAction({ open, setOpen }: SwapActionProps) {
  const [selectedTokenFrom, setSelectedTokenFrom] = useState("");
  const {
    tokensFrom,
    tokensFromOptions,
    tokensTo,
    tokensToOptions,
    isLoading: isSwapDataLoading,
  } = useSwapData(selectedTokenFrom);

  const [isLoading, setIsLoading] = useState(isSwapDataLoading);
  const [swapipingSelectors, setSwapipingSelectors] = useState<
    string | undefined
  >(undefined);

  const [value, setValue] = useState("");
  const [valueUSD, setValueUSD] = useState("");

  const handleResetValues = () => {
    setValue("");
    setValueUSD("");
  };

  const {
    selectedRow: selectedSwapAsset,
    selectedIndex: selectedSwapAssetIndex,
    reset: resetSwapAssetSelector,
    change: changeSwapAssetSelection,
  } = useSelector<TokenType>(tokensTo || {}, 0, {
    onReset: () => {
      handleResetValues();
      if (swapipingSelectors) {
        changeSwapAssetSelection(swapipingSelectors);
        setSwapipingSelectors(undefined);
      }
      setIsLoading(false);
    },
    onChange: handleResetValues,
  });

  const {
    selectedRow: selectedAsset,
    selectedIndex: selectedAssetIndex,
    reset: resetAssetSelector,
    change: changeAssetSelection,
  } = useSelector<TokenType>(tokensFrom || {}, 0, {
    onReset: handleResetValues,
    onChange: () => {
      setIsLoading(true);
      handleResetValues();
    },
  });

  const handleSwapSelectors = (tokenLabel: string, tokenSwapLabel: string) => {
    changeAssetSelection(tokenSwapLabel);
    setSwapipingSelectors(tokenLabel);
  };

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

  useEffect(() => {
    if (selectedAsset) {
      setSelectedTokenFrom(selectedAsset.symbol);
    }
  }, [selectedAsset]);

  return (
    swapModalOpen && (
      <SwapModal
        isLoading={isLoading}
        swapModalOpen={swapModalOpen}
        setSwapModalOpen={closeSwapModal}
        handleSwap={handleSwap}
        value={value}
        valueReceive={valueUSD}
        setValue={setValue}
        setValueReceive={setValueUSD}
        handleSwapSelectors={handleSwapSelectors}
        assetSelector={{
          selectedIndex: selectedAssetIndex,
          onChange: changeAssetSelection,
          options: tokensFromOptions,
        }}
        assetSwapSelector={{
          selectedIndex: selectedSwapAssetIndex,
          onChange: changeSwapAssetSelection,
          options: tokensToOptions,
        }}
      />
    )
  );
}
