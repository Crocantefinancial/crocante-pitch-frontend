import { SelectOption } from "@/components/core/select";
import { AvatarIcon } from "@/components/index";
import { POLL_TOKENS_NETWORKS_DATA_INTERVAL } from "@/config/constants";
import { getNetworkConfig, NetworkConfig } from "@/lib/network";
import { useDepositAddress } from "@/services/api/use-deposit-address";
import { useTokensNetworks } from "@/services/api/use-tokens-networks";
import { useMemo } from "react";

export type NetworkTokenType = {
  symbol: string;
  icon: React.ReactNode;
};

export function useDepositAddressData(networkId?: string) {
  // Always call the hook, but disable it when networkId is not provided
  const { data: depositAddressData, isLoading: isLoadingDepositAddress } =
    useDepositAddress(networkId || "", POLL_TOKENS_NETWORKS_DATA_INTERVAL);

  const { depositAddress, network } = useMemo(() => {
    if (!networkId) {
      return { depositAddress: undefined, network: undefined };
    }

    const networkData: NetworkConfig = getNetworkConfig(networkId);
    if (!depositAddressData) {
      return { depositAddress: undefined, network: networkData };
    }

    return {
      depositAddress: depositAddressData.address,
      network: networkData,
    };
  }, [depositAddressData, networkId]);

  return {
    depositAddress,
    network,
    isLoading: isLoadingDepositAddress,
  };
}
