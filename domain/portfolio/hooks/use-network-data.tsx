import { SelectOption } from "@/components/core/select";
import { AvatarIcon } from "@/components/index";
import { POLL_TOKENS_NETWORKS_DATA_INTERVAL } from "@/config/constants";
import { useTokensNetworks } from "@/services/hooks/use-tokens-networks";
import { useMemo } from "react";

export type NetworkTokenType = {
  symbol: string;
  icon: React.ReactNode;
};

export function useNetworkData(currencyId: string) {
  const { data: networkData, isLoading: isLoadingNetwork } = useTokensNetworks(
    currencyId,
    POLL_TOKENS_NETWORKS_DATA_INTERVAL
  );

  const { networks, networksOptions } = useMemo(() => {
    if (!networkData || networkData.length === 0) {
      return { networks: {}, networksOptions: [] };
    }

    const networksRecord: Record<string, NetworkTokenType> = {};
    const options: Array<SelectOption> = [];

    networkData.forEach((network) => {
      const tokenNetwork: NetworkTokenType = {
        symbol: network.networkId,
        icon: (
          <AvatarIcon initials={network.networkId.charAt(0)} color="primary" />
        ),
      };
      networksRecord[network.networkId] = tokenNetwork;
      options.push({
        label: network.networkId,
        id: network.networkId,
        icon: tokenNetwork.icon,
        value: network.depositMin,
      });
    });

    return {
      networks: networksRecord,
      networksOptions: options,
    };
  }, [networkData]);

  return {
    networks,
    networksOptions,
    isLoading: isLoadingNetwork,
  };
}
