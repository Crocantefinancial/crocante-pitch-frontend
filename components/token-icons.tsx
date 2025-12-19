export const ethereumChainLogo = "/images/tokens/ethereum-chain-logo.png";
export const optimismChainLogo = "/images/tokens/optimism-chain-logo.svg";
export const avalancheChainLogo = "/images/tokens/avalanche-avax-logo.png";
export const wethTokenLogo = "/images/tokens/weth.png";
export const usdcTokenLogo = "/images/tokens/usdc.png";
export const usdtTokenLogo = "/images/tokens/usdt.png";
export const daiTokenLogo = "/images/tokens/dai.png";
export const worldcoinTokenLogo = "/images/tokens/worldcoin.jpeg";
export const tronTokenLogo = "/images/tokens/tron-trx-logo.png";

export const getTokenLogo = (token: string) => {
  if (token.toLowerCase().startsWith("avax")) return avalancheChainLogo;
  if (token.toLowerCase().startsWith("weth")) return wethTokenLogo;
  if (token.toLowerCase().startsWith("usdc")) return usdcTokenLogo;
  if (token.toLowerCase().startsWith("usdt")) return usdtTokenLogo;
  if (token.toLowerCase().startsWith("dai")) return daiTokenLogo;
  if (token.toLowerCase().startsWith("worldcoin")) return worldcoinTokenLogo;
  if (token.toLowerCase().startsWith("tron")) return tronTokenLogo;
  return ethereumChainLogo;
};
