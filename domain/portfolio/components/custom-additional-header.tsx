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
import { NetworkConfig } from "@/lib/network";
import clsx from "clsx";
import { ArrowUp, ArrowUpDown, Eye, Send } from "lucide-react";
import { useState } from "react";
import { sepolia } from "viem/chains";
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
  } = useSelector<DepositTokenType>(depositTokens || {}, 0, {
    //onChange: resetNetworkSelector,
  });

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
      <Button
        onClick={openDepositModal}
        variant="primary"
        className={clsx("flex flex-row", isMobile && "")}
      >
        <ArrowUp className="h-4 w-auto" />
        {!isMobile && "Deposit"}
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
