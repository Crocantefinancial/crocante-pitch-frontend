import { Button } from "@/components/index";
import { SendModal } from "@/domain/portfolio/components";
import {
  FromType,
  TokenType,
  ToType,
  usePortfolioData,
} from "@/domain/portfolio/hooks/use-portfolio-data";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { useModal } from "@/hooks/use-modal";
import { useSelector } from "@/hooks/use-selector";
import clsx from "clsx";
import { ArrowUpDown, Eye, Send } from "lucide-react";
import { useState } from "react";

export default function CustomAdditionalHeader() {
  const isMobile = useIsMobile();
  const {
    tokens,
    tokensOptions,
    wallets,
    walletsOptions,
    exchanges,
    exchangesOptions,
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
  } = useSelector<FromType>(wallets || {}, 0, {});

  const {
    selectedRow: selectedTo,
    selectedIndex: selectedToIndex,
    reset: resetToSelector,
    change: changeToSelection,
  } = useSelector<ToType>(exchanges || {}, 0, {});

  const handleResetSelectors = () => {
    resetAssetSelector();
    resetFromSelector();
    resetToSelector();
  };

  const {
    isOpen: sendModalOpen,
    setIsOpen: setSendModalOpen,
    open: openSendModal,
  } = useModal(false, { onOpen: handleResetSelectors });

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

  if (!tokens || !wallets || !exchanges) return null;

  return (
    <div className="flex items-center gap-[clamp(0rem,4vw-1rem,0.75rem)]">
      <Button
        variant="secondary"
        className={clsx("flex flex-row", isMobile && "")}
      >
        <Eye className="h-4 w-auto" />
        {!isMobile && "View Options"}
      </Button>
      <Button
        variant="secondary"
        className={clsx("flex flex-row", isMobile && "-ml-6")}
      >
        <ArrowUpDown className="h-4 w-auto" />
        {!isMobile && "Sort"}
      </Button>
      <Button
        onClick={openSendModal}
        variant="primary"
        className={clsx("flex flex-row", isMobile && "")}
      >
        <Send className="h-4 w-auto" />
        {!isMobile && "Send"}
      </Button>

      {sendModalOpen && tokens && (
        <SendModal
          sendModalOpen={sendModalOpen}
          setSendModalOpen={setSendModalOpen}
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
            options: walletsOptions,
          }}
          toSelector={{
            selectedIndex: selectedToIndex,
            onChange: changeToSelection,
            options: exchangesOptions,
          }}
        />
      )}
    </div>
  );
}
