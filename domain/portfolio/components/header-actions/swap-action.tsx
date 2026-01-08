import { SwapModal } from "@/domain/portfolio/components";
import { TokenType } from "@/domain/portfolio/hooks/use-portfolio-data";
import { useSwapData } from "@/domain/portfolio/hooks/use-swap-data";
import { useModal } from "@/hooks/use-modal";
import { useSelector } from "@/hooks/use-selector";
import { usePostConversion } from "@/services/hooks/mutations/use-post-conversion";
import { useEffect, useState } from "react";

interface SwapActionProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}
export default function SwapAction({ open, setOpen }: SwapActionProps) {
  const postConversion = usePostConversion();
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
    onReset: handleResetValues,
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

  const handleSwap = (userId: string) => {
    const tokenFrom = selectedAsset?.symbol;
    const tokenTo = selectedSwapAsset?.symbol;
    const amount = value?.trim();

    if (!userId || !tokenFrom || !tokenTo || !amount) {
      console.warn("Swap blocked: missing inputs", {
        userId,
        tokenFrom,
        tokenTo,
        amount,
      });
      return;
    }

    postConversion.mutate(
      { userId, tokenFrom, tokenTo, amount },
      {
        onSuccess: (data) => {
          console.log("POST CONVERSION SUCCESS", data);
          //TODO: toast success
        },
        onError: (err) => {
          console.error("POST CONVERSION ERROR", err);
          //TODO: toast error
        },
        onSettled: () => {
          closeSwapModal();
        },
      }
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

  // Reset isLoading when tokensTo is available and data loading is complete
  useEffect(() => {
    if (tokensTo && !isSwapDataLoading) {
      if (swapipingSelectors) {
        changeSwapAssetSelection(swapipingSelectors);
        setSwapipingSelectors(undefined);
      }
      setIsLoading(false);
    }
  }, [tokensTo, isSwapDataLoading]);

  return (
    swapModalOpen && (
      <SwapModal
        isLoading={isLoading}
        isSwapping={postConversion.isPending}
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
