import {
  avalancheChainLogo,
  ethereumChainLogo,
  optimismChainLogo,
  tronTokenLogo,
} from "@/components/token-icons";
import type { Chain } from "viem";
import { avalanche, mainnet, optimism, tron } from "viem/chains";

export type NetworkConfig = {
  chain: Chain;
  rpcUrl: string;
  network: "mainnet" | "optimism";
  explorerUrl: string;
};

const optimismNetworkConfig: NetworkConfig = {
  chain: optimism,
  rpcUrl: "https://optimism.therpc.io",
  network: "optimism",
  explorerUrl: "https://optimistic.etherscan.io",
};

const mainnetNetworkConfig: NetworkConfig = {
  chain: mainnet,
  rpcUrl: "https://mainnet.infura.io/v3/YOUR_INFURA_API_KEY",
  network: "mainnet",
  explorerUrl: "https://etherscan.io",
};

const avalancheNetworkConfig: NetworkConfig = {
  chain: avalanche,
  rpcUrl: "https://avalanche.infura.io/v3/YOUR_INFURA_API_KEY",
  network: "mainnet",
  explorerUrl: "https://snowtrace.io",
};

const tronNetworkConfig: NetworkConfig = {
  chain: tron,
  rpcUrl: "https://tron.infura.io/v3/YOUR_INFURA_API_KEY",
  network: "mainnet",
  explorerUrl: "https://tronscan.org",
};

export const getNetworkConfig = (networkId: string): NetworkConfig => {
  switch (networkId.toLowerCase()) {
    case "mainnet":
      return mainnetNetworkConfig;
    case "optimism":
      return optimismNetworkConfig;
    case "avalanche":
      return avalancheNetworkConfig;
    case "tron":
      return tronNetworkConfig;
    default:
      return mainnetNetworkConfig;
  }
};

export const getChainLogo = (chain: Chain) => {
  if (chain.id === 10) return optimismChainLogo;
  if (chain.id === 1) return ethereumChainLogo;
  if (chain.id === 43114) return avalancheChainLogo;
  if (chain.id === 728126428) return tronTokenLogo;
  return optimismChainLogo;
};

export const getShortAddress = (address: string) => {
  return address?.slice(0, 6).concat("...").concat(address?.slice(-4));
};
