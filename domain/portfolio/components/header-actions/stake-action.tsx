import { StakeModal } from "@/domain/portfolio/components";
import {
  TokenType,
  usePortfolioData,
} from "@/domain/portfolio/hooks/use-portfolio-data";
import { useStakeData } from "@/domain/portfolio/hooks/use-stake-data";
import { useModal } from "@/hooks/use-modal";
import { useSelector } from "@/hooks/use-selector";
import { useEffect, useState } from "react";

interface StakeActionProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}
export default function StakeAction({ open, setOpen }: StakeActionProps) {
  const [selectedToken, setSelectedToken] = useState("");

  const {
    tokens,
    tokensOptions,
  } = usePortfolioData();

  const {
    stakeData,
    StakingTypeValues,
    isLoading: isLoadingStakeData,
  } = useStakeData(selectedToken);

  const [value, setValue] = useState("");
  const [valueUSD, setValueUSD] = useState("");

  const handleResetValues = () => {
    setValue("");
    setValueUSD("");
  };

  type StakingTypeType = (typeof StakingTypeValues)[keyof typeof StakingTypeValues];

  const {
    selectedRow: selectedStakingType,
    selectedIndex: selectedStakingTypeIndex,
    change: changeStakingTypeSelection
  } = useSelector<StakingTypeType>(
    StakingTypeValues,
    0
  );

  const stakingTypeOptions = Object.entries(StakingTypeValues).map(
    ([key, label]) => ({
      id: key,
      label,
      value: label,
    })
  );

  const {
    selectedRow: selectedAsset,
    selectedIndex: selectedAssetIndex,
    reset: resetAssetSelector,
    change: changeAssetSelection,
  } = useSelector<TokenType>(tokens || {}, 0, {
    onReset: handleResetValues,
    onChange: handleResetValues,
  });


  const handleResetStakeSelectors = () => {
    resetAssetSelector();
  };

  const {
    isOpen: stakeModalOpen,
    open: openStakeModal,
    close: closeStakeModal,
  } = useModal(false, {
    onOpen: handleResetStakeSelectors,
    onClose: () => setOpen(false),
  });

  useEffect(() => {
    if (open) {
      openStakeModal();
    }
  }, [open]);

  const handleStake = () => {
    console.log(
      "STAKE",
      selectedAsset,
      value,
      valueUSD + " USD"
    );
  };

  useEffect(() => {
    if (selectedAsset) {
      setSelectedToken(selectedAsset.symbol);
    }
  }, [selectedAsset]);

  if (!tokens) return null;

  return (
    stakeModalOpen &&
    tokens && (
      <StakeModal
        stakeModalOpen={stakeModalOpen}
        setStakeModalOpen={closeStakeModal}
        handleStake={handleStake}
        value={value}
        valueUSD={valueUSD}
        setValue={setValue}
        setValueUSD={setValueUSD}
        assetSelector={{
          selectedIndex: selectedAssetIndex,
          onChange: changeAssetSelection,
          options: tokensOptions,
        }}
        stakingTypeSelector={{
          selectedIndex: selectedStakingTypeIndex,
          onChange: changeStakingTypeSelection,
          options: stakingTypeOptions,
        }}
      />
    )
  );
}
