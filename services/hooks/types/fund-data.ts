export type Fund = {
  id: string;
  slug: string;
  name: string;
  category: "btc" | "eth" | "defi" | "tbill" | "stable";
  summary: string;
  stats: {
    apy: string;
    aum: string;
    liquidity: string;
    lockup?: string;
    risk: "Low" | "Medium" | "High";
    inception: string;
    network: string;
    depositAsset: string;
    benchmark?: string;
  };
  performance: Array<{ date: string; nav: number }>;
  exposures: Array<{ label: string; pct: number; color: string }>;
  fees: {
    management: string;
    performance?: string;
    admin?: string;
    redemption?: string;
  };
  documents: Array<{ label: string; url: string }>;
  contract?: {
    chainId: number;
    address: string;
    explorerUrl: string;
  };
  strategy: string;
  yieldSources: string[];
  risks: Array<{
    type: string;
    level: "Low" | "Medium" | "High";
    description: string;
  }>;
  whyInvest: string[];
};
