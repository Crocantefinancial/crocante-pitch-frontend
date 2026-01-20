import { StakeModal } from "@/domain/portfolio/components";
import {
  TokenType,
} from "@/domain/portfolio/hooks/use-portfolio-data";
import { useStakeData } from "@/domain/portfolio/hooks/use-stake-data";
import { useModal } from "@/hooks/use-modal";
import { useSelector } from "@/hooks/use-selector";
import { usePostStaking } from "@/services/hooks/mutations/use-post-staking";
import { useEffect, useState } from "react";

interface StakeActionProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}
export default function StakeAction({ open, setOpen }: StakeActionProps) {
  const postStaking = usePostStaking();
  const [selectedToken, setSelectedToken] = useState("");

  const {
    tokens,
    tokensOptions,
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

  const handleStake = (userId: string, typeId: string) => {
    const amount = value?.trim();

    if (!userId || !typeId || !amount) {
      console.warn("Stake blocked: missing inputs", {
        userId,
        typeId,
        amount,
      });
      return;
    }

    postStaking.mutate(
      { userId, typeId, amount },
      {
        onSuccess: (data) => {
          console.log("POST STAKING SUCCESS", data);
          //TODO: toast success
        },
        onError: (err) => {
          console.error("POST STAKING ERROR", err);
          //TODO: toast error
        },
        onSettled: () => {
          closeStakeModal();
        },
      }
    );
  };

  useEffect(() => {
    if (selectedAsset) {
      setSelectedToken(selectedAsset.symbol);
    }
  }, [selectedAsset]);

  if (!tokens) return null;

  return (
    stakeModalOpen && (
      <StakeModal
        isLoading={isLoadingStakeData}
        isStaking={postStaking.isPending}
        stakeModalOpen={stakeModalOpen}
        setStakeModalOpen={closeStakeModal}
        handleStake={handleStake}
        stakeData={stakeData || []}
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
