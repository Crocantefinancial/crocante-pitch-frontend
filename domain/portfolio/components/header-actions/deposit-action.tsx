import { DepositModal } from "@/domain/portfolio/components";
import { useDepositAddressData } from "@/domain/portfolio/hooks/use-deposit-address-data";
import {
  DepositTokenType,
  useDepositData,
} from "@/domain/portfolio/hooks/use-deposit-data";
import {
  NetworkTokenType,
  useNetworkData,
} from "@/domain/portfolio/hooks/use-network-data";
import { useModal } from "@/hooks/use-modal";
import { useSelector } from "@/hooks/use-selector";
import { useEffect } from "react";

interface DepositActionProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function DepositAction({ open, setOpen }: DepositActionProps) {
  const {
    depositTokens,
    depositTokensOptions,
    isLoading: isLoadingDeposit,
  } = useDepositData();

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

  const {
    depositAddress,
    network,
    isLoading: isLoadingDepositAddress,
  } = useDepositAddressData(
    Object.keys(networks || {}).length === 0
      ? ""
      : selectedNetwork?.symbol || ""
  );

  const handleResetDepositSelectors = () => {
    resetDepositAssetSelector();
    resetNetworkSelector();
  };

  const {
    isOpen: depositModalOpen,
    open: openDepositModal,
    close: closeDepositModal,
  } = useModal(false, {
    onOpen: handleResetDepositSelectors,
    onClose: () => setOpen(false),
  });

  useEffect(() => {
    if (open) {
      openDepositModal();
    }
  }, [open]);

  return (
    depositModalOpen &&
    depositTokens && (
      <DepositModal
        isOpen={depositModalOpen}
        onClose={closeDepositModal}
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
    )
  );
}
