import { Fund } from "@/services/hooks/types/fund-data";

export const FUNDS_DATA: Fund[] = [
  {
    id: "1",
    slug: "steakhouse-usdc",
    name: "Steakhouse USDC",
    category: "defi",
    summary:
      "Over-collateralized lending protocol delivering institutional-grade yields on USDC deposits",
    stats: {
      apy: "6.4%",
      aum: "$142.5M",
      liquidity: "T+1",
      risk: "Medium",
      inception: "Jan 15, 2024",
      network: "Ethereum",
      depositAsset: "USDC",
      benchmark: "SOFR + 1.2%",
    },
    performance: [
      { date: "2024-01", nav: 1.0 },
      { date: "2024-02", nav: 1.005 },
      { date: "2024-03", nav: 1.012 },
      { date: "2024-04", nav: 1.019 },
      { date: "2024-05", nav: 1.027 },
      { date: "2024-06", nav: 1.035 },
      { date: "2024-07", nav: 1.043 },
      { date: "2024-08", nav: 1.051 },
      { date: "2024-09", nav: 1.059 },
      { date: "2024-10", nav: 1.068 },
      { date: "2024-11", nav: 1.077 },
    ],
    exposures: [
      { label: "Aave V3", pct: 45, color: "#5FA6A1" },
      { label: "Compound", pct: 35, color: "#7C88C2" },
      { label: "Cash Reserve", pct: 20, color: "#7C8A99" },
    ],
    fees: {
      management: "0.5%",
      performance: "10% above SOFR",
      admin: "0.1%",
      redemption: "None",
    },
    documents: [
      { label: "Fund Factsheet (PDF)", url: "#" },
      { label: "Terms & Conditions", url: "#" },
      { label: "Risk Disclosure", url: "#" },
      { label: "Smart Contract", url: "#" },
    ],
    contract: {
      chainId: 1,
      address: "0x1234...5678",
      explorerUrl: "https://etherscan.io/address/0x1234567890",
    },
    strategy:
      "Steakhouse USDC deploys capital into blue-chip DeFi lending protocols with proven track records. The fund maintains strict risk parameters including maximum 75% LTV ratios and diversification across multiple protocols to minimize smart contract risk.",
    yieldSources: [
      "Over-collateralized lending to institutional borrowers",
      "Protocol incentive rewards",
      "Yield optimization across multiple venues",
    ],
    risks: [
      {
        type: "Market",
        level: "Low",
        description: "USDC is pegged to USD with minimal volatility",
      },
      {
        type: "Smart Contract",
        level: "Medium",
        description: "Exposure to audited but not risk-free DeFi protocols",
      },
      {
        type: "Liquidity",
        level: "Low",
        description: "T+1 redemptions with 95%+ success rate",
      },
      {
        type: "Counterparty",
        level: "Low",
        description: "Diversified across multiple protocols",
      },
      {
        type: "Regulatory",
        level: "Medium",
        description: "Subject to evolving DeFi regulations",
      },
    ],
    whyInvest: [
      "Institutional-grade DeFi exposure with professional risk management",
      "Consistent yields above traditional money markets",
      "Daily liquidity with T+1 settlement",
    ],
  },
  {
    id: "2",
    slug: "franklin-onchain-govt",
    name: "Franklin OnChain U.S. Government Money Fund",
    category: "tbill",
    summary:
      "First SEC-registered money market fund offering blockchain-based shares backed by U.S. Government securities",
    stats: {
      apy: "5.2%",
      aum: "$381.2M",
      liquidity: "T+0",
      risk: "Low",
      inception: "Apr 2021",
      network: "Ethereum",
      depositAsset: "USDC",
      benchmark: "U.S. Treasury 3-Month",
    },
    performance: [
      { date: "2024-01", nav: 1.0 },
      { date: "2024-02", nav: 1.004 },
      { date: "2024-03", nav: 1.009 },
      { date: "2024-04", nav: 1.013 },
      { date: "2024-05", nav: 1.018 },
      { date: "2024-06", nav: 1.022 },
      { date: "2024-07", nav: 1.027 },
      { date: "2024-08", nav: 1.031 },
      { date: "2024-09", nav: 1.036 },
      { date: "2024-10", nav: 1.041 },
      { date: "2024-11", nav: 1.045 },
    ],
    exposures: [
      { label: "U.S. Treasury Bills", pct: 85, color: "#7FA38F" },
      { label: "Government Repos", pct: 10, color: "#7C8A99" },
      { label: "Cash", pct: 5, color: "#64748B" },
    ],
    fees: {
      management: "0.19%",
      admin: "0.06%",
      redemption: "None",
    },
    documents: [
      { label: "Prospectus (PDF)", url: "#" },
      { label: "Statement of Additional Information", url: "#" },
      { label: "Annual Report", url: "#" },
      { label: "Holdings (Daily)", url: "#" },
    ],
    contract: {
      chainId: 1,
      address: "0xabcd...ef12",
      explorerUrl: "https://etherscan.io/address/0xabcdef12",
    },
    strategy:
      "The fund invests in high-quality, short-term U.S. Government securities and repurchase agreements. All holdings are tokenized on Ethereum, providing 24/7 settlement and transparency while maintaining SEC money market fund compliance.",
    yieldSources: [
      "U.S. Treasury Bills (0-3 month maturity)",
      "Government-backed repurchase agreements",
      "Interest income from short-term securities",
    ],
    risks: [
      {
        type: "Market",
        level: "Low",
        description: "Government securities with minimal credit risk",
      },
      {
        type: "Smart Contract",
        level: "Low",
        description: "Audited tokenization layer with traditional custody",
      },
      {
        type: "Liquidity",
        level: "Low",
        description: "Same-day redemptions during business hours",
      },
      {
        type: "Counterparty",
        level: "Low",
        description: "U.S. Government backing",
      },
      {
        type: "Regulatory",
        level: "Low",
        description: "SEC-registered and regulated money market fund",
      },
    ],
    whyInvest: [
      "First-of-its-kind SEC-registered blockchain fund",
      "Safety of U.S. Government securities with blockchain efficiency",
      "Same-day liquidity with transparent, 24/7 on-chain settlement",
    ],
  },
];
