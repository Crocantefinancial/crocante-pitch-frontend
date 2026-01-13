import { DepositModal } from "@/domain/portfolio/components";
import { useDepositAddressData } from "@/domain/portfolio/hooks/use-deposit-address-data";
import {
  DepositAssetType,
  DepositFiatType,
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
    depositAssetTypes,
    depositAssetTypesOptions,
    depositFiat,
    depositFiatOptions,
    isLoading: isLoadingDeposit,
  } = useDepositData();

  const {
    selectedRow: selectedDepositAssetType,
    selectedIndex: selectedDepositAssetTypeIndex,
    reset: resetDepositAssetTypeSelector,
    change: changeDepositAssetTypeSelection,
  } = useSelector<DepositAssetType>(depositAssetTypes || {}, 0, {
    /* onReset: () => {
      resetDepositAssetTypeSelector();
    },
    onChange: () => {
      resetDepositAssetTypeSelector();
    }, */
  });

  const {
    selectedRow: selectedDepositFiat,
    selectedIndex: selectedDepositFiatIndex,
    reset: resetDepositFiatSelector,
    change: changeDepositFiatSelection,
  } = useSelector<DepositFiatType>(depositFiat || {}, 0, {
    /* onReset: () => {
      resetDepositFiatSelector();
    },
    onChange: () => {
      resetDepositFiatSelector();
    }, */
  });

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
        assetTypeSelector={{
          selectedIndex: selectedDepositAssetTypeIndex,
          onChange: changeDepositAssetTypeSelection,
          options: depositAssetTypesOptions,
        }}
        fiatSelector={{
          selectedIndex: selectedDepositFiatIndex,
          onChange: changeDepositFiatSelection,
          options: depositFiatOptions,
        }}
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
