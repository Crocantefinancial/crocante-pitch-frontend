import { Button } from "@/components/index";
import { DepositModal, SendModal } from "@/domain/portfolio/components";
import { DepositTokenType } from "@/domain/portfolio/hooks/use-deposit-data";
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
import { ArrowUp, ArrowUpDown, Eye, MenuIcon, Send, XIcon } from "lucide-react";
import { useState } from "react";
import { createPortal } from "react-dom";
import { useDepositAddressData } from "../hooks/use-deposit-address-data";
import { useDepositData } from "../hooks/use-deposit-data";
import { NetworkTokenType, useNetworkData } from "../hooks/use-network-data";

export default function CustomAdditionalHeader() {
  const isMobile = useIsMobile();
  const {
    tokens,
    tokensOptions,
    custodiansFrom,
    fromOptions,
    custodiansTo,
    toOptions,
  } = usePortfolioData();

  const {
    depositTokens,
    depositTokensOptions,
    isLoading: isLoadingDeposit,
  } = useDepositData();

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

  const {
    selectedRow: selectedDepositAsset,
    selectedIndex: selectedDepositAssetIndex,
    reset: resetDepositAssetSelector,
    change: changeDepositAssetSelection,
  } = useSelector<DepositTokenType>(depositTokens || {}, 0, {});

  const {
    networks,
    networksOptions,
    isLoading: isLoadingNetworks,
  } = useNetworkData(selectedDepositAsset?.symbol || "");

  const {
    selectedRow: selectedNetwork,
    selectedIndex: selectedNetworkIndex,
    reset: resetNetworkSelector,
    change: changeNetworkSelection,
  } = useSelector<NetworkTokenType>(networks || {}, 0, {});

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

  const {
    isOpen: depositModalOpen,
    setIsOpen: setDepositModalOpen,
    open: openDepositModal,
  } = useModal(false, {});

  const { isOpen: mobileMenuOpen, toggle: toggleMobileMenu } = useModal(
    false,
    {}
  );

  const menuItems = [
    {
      label: "Options",
      icon: <Eye className="h-4 w-auto" />,
      onClick: () => {},
      variant: "secondary",
    },
    {
      label: "Sort",
      icon: <ArrowUpDown className="h-4 w-auto" />,
      onClick: () => {},
      variant: "secondary",
    },
    {
      label: "Send",
      icon: <Send className="h-4 w-auto" />,
      onClick: openSendModal,
      variant: "primary",
    },
    {
      label: "Deposit",
      icon: <ArrowUp className="h-4 w-auto" />,
      onClick: openDepositModal,
      variant: "primary",
    },
  ];

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

  const {
    depositAddress,
    network,
    isLoading: isLoadingDepositAddress,
  } = useDepositAddressData(
    Object.keys(networks || {}).length === 0
      ? ""
      : selectedNetwork?.symbol || ""
  );

  if (!tokens || !custodiansFrom || !custodiansTo) return null;

  const menuContent = (
    <div className="fixed inset-0 z-[9999]">
      {/* full-screen backdrop (this is what blurs/dims the whole page) */}
      <div
        className="absolute inset-0 backdrop-blur-[2px]"
        onClick={() => toggleMobileMenu()}
      />

      {/* the menu panel */}
      <div
        className="absolute top-16 right-4 bg-white border border-secondary rounded-lg shadow-lg min-w-[200px]"
        onClick={(e) => e.stopPropagation()}
      >
        <nav className="flex flex-col p-4 space-y-2">
          {menuItems.map((it) => (
            <span
              key={it.label}
              className="flex items-center gap-2 cursor-pointer hover:bg-disabled p-2 rounded-lg"
              onClick={() => {
                toggleMobileMenu();
                it.onClick();
              }}
            >
              {it.icon}
              {it.label}
            </span>
          ))}
        </nav>
      </div>
    </div>
  );

  return (
    <div className="relative flex items-center gap-[clamp(0rem,4vw-1rem,0.75rem)]">
      {isMobile && (
        <Button
          onClick={() => toggleMobileMenu()}
          className={clsx("p-2", mobileMenuOpen && "relative z-[10000]")}
        >
          {mobileMenuOpen ? <XIcon size={16} /> : <MenuIcon size={16} />}
        </Button>
      )}
      {/* Mobile Navigation Menu */}
      {isMobile && mobileMenuOpen && createPortal(menuContent, document.body)}

      {!isMobile && (
        <>
          {menuItems.map((it) => (
            <Button
              key={it.label}
              variant={it.variant as any}
              className="flex flex-row"
              onClick={it.onClick}
            >
              {it.icon}
              {it.label}
            </Button>
          ))}
        </>
      )}

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
            options: fromOptions,
          }}
          toSelector={{
            selectedIndex: selectedToIndex,
            onChange: changeToSelection,
            options: toOptions,
          }}
        />
      )}
      {depositModalOpen && depositTokens && (
        <DepositModal
          isOpen={depositModalOpen}
          onClose={() => setDepositModalOpen(false)}
          address={depositAddress || ""}
          network={network}
          tokenSelector={{
            selectedIndex: selectedDepositAssetIndex,
            onChange: changeDepositAssetSelection,
            options: depositTokensOptions,
          }}
          networkSelector={{
            selectedIndex: selectedNetworkIndex,
            onChange: changeNetworkSelection,
            options: networksOptions,
          }}
        />
      )}
    </div>
  );
}
