import { Button } from "@/components/index";
import { SendModal } from "@/domain/portfolio/components";
import {
  FromType,
  TokenType,
  ToType,
  usePortfolioData,
} from "@/domain/portfolio/hooks/use-portfolio-data";
import { useModal } from "@/hooks/use-modal";
import { useSelector } from "@/hooks/use-selector";
import { ArrowUpDown, Eye, Send } from "lucide-react";

export default function CustomAdditionalHeader() {
  const {
    tokens,
    tokensOptions,
    wallets,
    walletsOptions,
    exchanges,
    exchangesOptions,
  } = usePortfolioData();

  const {
    selectedRow: selectedAsset,
    selectedIndex: selectedAssetIndex,
    reset: resetAssetSelector,
    change: changeAssetSelection,
  } = useSelector<TokenType>(tokens || {}, 0, {});

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
    console.log("SEND", selectedAsset, selectedFrom, selectedTo);
  };

  if (!tokens || !wallets || !exchanges) return null;

  return (
    <div className="flex items-center gap-3">
      <Button variant="secondary">
        <Eye className="w-4 h-4" />
        View Options
      </Button>
      <Button variant="secondary">
        <ArrowUpDown className="w-4 h-4" />
        Sort
      </Button>
      <Button onClick={openSendModal} variant="primary">
        <Send className="w-4 h-4" />
        Send
      </Button>

      {sendModalOpen && tokens && (
        <SendModal
          sendModalOpen={sendModalOpen}
          setSendModalOpen={setSendModalOpen}
          handleSend={handleSend}
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
