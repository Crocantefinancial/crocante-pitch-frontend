import {
  TokenType,
} from "@/domain/portfolio/hooks/use-portfolio-data";
import { useStakeData } from "@/domain/portfolio/hooks/use-stake-data";
import { StakeComponent } from "@/domain/staking";
import { useSelector } from "@/hooks/use-selector";
import { usePostStaking } from "@/services/hooks/mutations/use-post-staking";
import { useEffect, useState } from "react";

export default function Stake() {
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


  useEffect(() => {
    resetAssetSelector();
  }, []);

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
          resetAssetSelector();
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
    <StakeComponent
      isLoading={isLoadingStakeData}
      isStaking={postStaking.isPending}
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
  );
}
