"use client";

import {
  ArrowUpRight,
  Banknote,
  Bitcoin,
  Hexagon,
  Info,
  Network,
  Wallet,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Category = "btc" | "eth" | "defi" | "tbill" | "stable";

const PRODUCTS_DATA = [
  {
    id: 1,
    name: "Bitcoin Yield",
    category: "btc" as Category,
    subtitle: "Principally Protected (BTC-denominated)",
    apy: "4–6%",
    liquidity: "T+1",
    lockup: "None",
    risk: "Low",
    network: "Bitcoin",
    deposit: "BTC",
    badge: "Franklin Templeton",
  },
  {
    id: 2,
    name: "Franklin OnChain",
    category: "tbill" as Category,
    subtitle: "U.S. Government Money Fund (USDC deposits)",
    apy: "6.48%",
    liquidity: "T+1",
    lockup: "None",
    risk: "Low",
    network: "Ethereum",
    deposit: "USDC",
    badge: "Franklin Templeton",
  },
  {
    id: 3,
    name: "High Yield",
    category: "defi" as Category,
    subtitle: "Over-collateralized lending (USDC)",
    apy: "9.7%",
    liquidity: "Instant",
    lockup: "None",
    risk: "Medium",
    network: "Ethereum",
    deposit: "USDC",
    badge: "Spark Protocol",
  },
  {
    id: 4,
    name: "Lido Staking",
    category: "eth" as Category,
    subtitle: "Liquid staking rewards",
    apy: "3.8%",
    liquidity: "Instant",
    lockup: "None",
    risk: "Low",
    network: "Ethereum",
    deposit: "ETH",
    badge: "Lido",
  },
  {
    id: 5,
    name: "USDC Yield",
    category: "stable" as Category,
    subtitle: "Short-duration cash yield (USD stablecoins)",
    apy: "5.2%",
    liquidity: "T+1",
    lockup: "None",
    risk: "Low",
    network: "Ethereum",
    deposit: "USDC",
    badge: "Aave",
  },
  {
    id: 6,
    name: "Aave USDC",
    category: "defi" as Category,
    subtitle: "Lending Protocol",
    apy: "8.2%",
    liquidity: "Instant",
    lockup: "None",
    risk: "Medium",
    network: "Ethereum",
    deposit: "USDC",
    badge: "Aave",
  },
];

export function InvestSection() {
  const [activeTab, setActiveTab] = useState("Positions");
  const [selectedCategory, setSelectedCategory] = useState<Category | "all">(
    "all"
  );
  const [selectedNetwork, setSelectedNetwork] = useState("all");
  const [selectedDeposit, setSelectedDeposit] = useState("all");

  const router = useRouter();

  const getCategoryStyles = (category: Category) => {
    const styles = {
      btc: {
        accent: "#C8A24A",
        bg: "bg-[#C8A24A]/[0.06]",
        border: "border-l-[#C8A24A]",
        icon: Bitcoin,
        label: "BTC",
      },
      eth: {
        accent: "#7C88C2",
        bg: "bg-[#7C88C2]/[0.06]",
        border: "border-l-[#7C88C2]",
        icon: Hexagon,
        label: "ETH",
      },
      defi: {
        accent: "#5FA6A1",
        bg: "bg-[#5FA6A1]/[0.06]",
        border: "border-l-[#5FA6A1]",
        icon: Network,
        label: "DeFi",
      },
      tbill: {
        accent: "#7FA38F",
        bg: "bg-[#7FA38F]/[0.06]",
        border: "border-l-[#7FA38F]",
        icon: Banknote,
        label: "T-Bills",
      },
      stable: {
        accent: "#7C8A99",
        bg: "bg-[#7C8A99]/[0.06]",
        border: "border-l-[#7C8A99]",
        icon: Wallet,
        label: "Stablecoins",
      },
    };
    return styles[category];
  };

  const filteredProducts = PRODUCTS_DATA.filter((product) => {
    const categoryMatch =
      selectedCategory === "all" || product.category === selectedCategory;
    const networkMatch =
      selectedNetwork === "all" ||
      product.network.toLowerCase() === selectedNetwork.toLowerCase();
    const depositMatch =
      selectedDeposit === "all" || product.deposit === selectedDeposit;
    return categoryMatch && networkMatch && depositMatch;
  });

  const handleInvest = (productId: number) => {
    // Map product IDs to slugs
    const slugMap: Record<number, string> = {
      1: "bitcoin-yield",
      2: "franklin-onchain-govt",
      3: "steakhouse-usdc",
      4: "lido-staking",
      5: "usdc-yield",
      6: "aave-usdc",
    };

    const slug = slugMap[productId];
    if (slug) {
      router.push(`/funds/${slug}`);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-2">Invest</h2>
        <p className="text-sm text-muted-foreground">
          Earn yield on your digital assets
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-border">
        {["Positions", "Yield overview"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-sm font-normal border-b-2 transition-colors ${
              activeTab === tab
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap items-center gap-4">
        {/* Network Select */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-normal text-foreground">Network</label>
          <select
            value={selectedNetwork}
            onChange={(e) => setSelectedNetwork(e.target.value)}
            className="px-3 py-2 text-sm rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="all">All</option>
            <option value="ethereum">Ethereum</option>
            <option value="bitcoin">Bitcoin</option>
            <option value="polygon">Polygon</option>
            <option value="arbitrum">Arbitrum</option>
          </select>
        </div>

        {/* Deposit Currency Select */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-normal text-foreground">Deposit</label>
          <select
            value={selectedDeposit}
            onChange={(e) => setSelectedDeposit(e.target.value)}
            className="px-3 py-2 text-sm rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="all">All</option>
            <option value="USDC">USDC</option>
            <option value="BTC">BTC</option>
            <option value="ETH">ETH</option>
            <option value="USDT">USDT</option>
          </select>
        </div>

        {/* Category Segmented Control */}
        <div className="flex items-center gap-2 ml-auto">
          <label className="text-sm font-normal text-foreground">
            Category
          </label>
          <div className="inline-flex rounded-lg border border-border bg-muted/20 p-1">
            {[
              { value: "all", label: "All" },
              { value: "btc", label: "BTC" },
              { value: "eth", label: "ETH" },
              { value: "defi", label: "DeFi" },
              { value: "tbill", label: "T-Bills" },
              { value: "stable", label: "Stablecoins" },
            ].map((cat) => (
              <button
                key={cat.value}
                onClick={() =>
                  setSelectedCategory(cat.value as Category | "all")
                }
                className={`px-3 py-1.5 text-xs font-normal rounded-md transition-colors ${
                  selectedCategory === cat.value
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {activeTab === "Positions" && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProducts.map((product) => {
            const categoryStyle = getCategoryStyles(product.category);
            const Icon = categoryStyle.icon;

            return (
              <div
                key={product.id}
                className={`group relative bg-card border ${categoryStyle.border} border-l-4 rounded-2xl p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer`}
                style={{
                  backgroundColor: `color-mix(in srgb, ${categoryStyle.accent} 6%, white)`,
                }}
              >
                {/* Top Row */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {/* Icon Chip */}
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{
                        backgroundColor: `color-mix(in srgb, ${categoryStyle.accent} 15%, white)`,
                        border: `1px solid color-mix(in srgb, ${categoryStyle.accent} 30%, transparent)`,
                      }}
                    >
                      <Icon
                        className="w-4 h-4"
                        style={{ color: categoryStyle.accent }}
                      />
                    </div>
                    {/* Category Badge */}
                    <span
                      className="px-2 py-0.5 text-xs font-normal rounded-full"
                      style={{
                        backgroundColor: `color-mix(in srgb, ${categoryStyle.accent} 10%, white)`,
                        color: categoryStyle.accent,
                      }}
                    >
                      {categoryStyle.label}
                    </span>
                  </div>
                  <button className="text-muted-foreground hover:text-foreground transition-colors">
                    <ArrowUpRight className="w-5 h-5" />
                  </button>
                </div>

                {/* Title & Subtitle */}
                <h3 className="text-lg font-semibold text-foreground mb-1 line-clamp-1">
                  {product.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-1">
                  {product.subtitle}
                </p>

                {/* Meta Row */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">APY</p>
                    <p
                      className="text-base font-semibold tabular-nums group-hover:transition-colors"
                      style={{ color: "inherit" }}
                    >
                      {product.apy}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">
                      Liquidity
                    </p>
                    <p className="text-sm font-normal text-foreground">
                      {product.liquidity}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5 flex items-center gap-1">
                      Risk
                      <Info className="w-3 h-3" />
                    </p>
                    <p className="text-sm font-normal text-foreground">
                      {product.risk}
                    </p>
                  </div>
                </div>

                {/* Pills */}
                <div className="flex gap-2 mb-4">
                  <span className="px-2 py-1 text-xs rounded-full bg-muted/50 text-muted-foreground">
                    {product.network}
                  </span>
                  <span className="px-2 py-1 text-xs rounded-full bg-muted/50 text-muted-foreground">
                    {product.deposit}
                  </span>
                </div>

                {/* Footer */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleInvest(product.id)}
                    className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-normal hover:bg-primary/90 transition-colors"
                  >
                    Invest
                  </button>
                  <button
                    onClick={() => handleInvest(product.id)}
                    className="text-sm font-normal text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Yield Overview Tab */}
      {activeTab === "Yield overview" && (
        <div className="bg-card rounded-lg border border-border p-12 text-center">
          <p className="text-muted-foreground text-sm">
            No active positions yet.
          </p>
          <p className="text-muted-foreground text-xs mt-2">
            Start by investing in one of the opportunities above
          </p>
        </div>
      )}
    </div>
  );
}
