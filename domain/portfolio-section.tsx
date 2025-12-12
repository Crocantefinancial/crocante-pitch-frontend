"use client";

import { Button } from "@/components/index";
import SendModal from "@/domain/portfolio/send-modal";
import {
  ArrowUpDown,
  ChevronDown,
  ChevronRight,
  Eye,
  Plus,
  Send,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const PORTFOLIO_DATA = {
  totalBalance: 128500000,
  cryptocurrencies: 122770000,
  currencies: 5220000,
  commodities: 510000,
};

const ASSET_ALLOCATION = [
  { name: "BTC", value: 66.1, color: "#3B82F6", amount: 84865850 },
  { name: "ETH", value: 27.9, color: "#A855F7", amount: 35851500 },
  { name: "Stables", value: 3.5, color: "#22C55E", amount: 4497500 },
  { name: "Fiat", value: 1.91, color: "#64748B", amount: 2454350 },
  { name: "Others", value: 0.59, color: "#F97316", amount: 758150 },
];

const CRYPTOCURRENCIES = [
  {
    code: "BTC",
    name: "Bitcoin",
    amount: "849.5052 BTC",
    value: "$84.87M",
    change: "+2.4%",
  },
  {
    code: "ETH",
    name: "Ethereum",
    amount: "13.8k ETH",
    value: "$35.85M",
    change: "+1.8%",
  },
  {
    code: "USDC",
    name: "USD Coin",
    amount: "2.24M USDC",
    value: "$2.24M",
    change: "0%",
  },
  {
    code: "USDT",
    name: "Tether",
    amount: "2.25M USDT",
    value: "$2.25M",
    change: "0%",
  },
  {
    code: "SOL",
    name: "Solana",
    amount: "8.5k SOL",
    value: "$1.87M",
    change: "+3.2%",
  },
];

const CURRENCIES = [
  {
    code: "BRL",
    name: "Brazilian Real",
    amount: "23.97M BRL",
    value: "$4.78M",
    change: "-0.3%",
  },
  {
    code: "USD",
    name: "US Dollar",
    amount: "444.40k USD",
    value: "$444.40k",
    change: "0%",
  },
  {
    code: "EUR",
    name: "Euro",
    amount: "6.81k EUR",
    value: "$7.39k",
    change: "+0.1%",
  },
  {
    code: "GBP",
    name: "British Pound",
    amount: "9.58k GBP",
    value: "$12.10k",
    change: "+0.2%",
  },
];

const INTERNAL_WALLETS = [
  {
    name: "Hot Wallet - Operations",
    balance: "$1.56M",
    available: "$1.55M",
    assets: 12,
    type: "Multi-sig 3/5",
    lastActivity: "2 min ago",
  },
  {
    name: "Cold Wallet - Treasury",
    balance: "$85.2M",
    available: "$85.2M",
    assets: 8,
    type: "Hardware",
    lastActivity: "3 days ago",
  },
  {
    name: "Hot Wallet - Trading",
    balance: "$2.8M",
    available: "$2.75M",
    assets: 15,
    type: "Multi-sig 2/3",
    lastActivity: "5 min ago",
  },
];

const EXCHANGES_DATA = [
  {
    name: "Bitgo Prime",
    balance: "$35.6M",
    available: "$35.5M",
    assets: 18,
    status: "Connected",
    lastSync: "Just now",
  },
  {
    name: "Coinbase Prime",
    balance: "$28.4M",
    available: "$28.2M",
    assets: 12,
    status: "Connected",
    lastSync: "1 min ago",
  },
  {
    name: "Kraken",
    balance: "$12.8M",
    available: "$12.7M",
    assets: 24,
    status: "Connected",
    lastSync: "2 min ago",
  },
  {
    name: "Binance",
    balance: "$8.5M",
    available: "$8.4M",
    assets: 32,
    status: "Connected",
    lastSync: "5 min ago",
  },
];

const BANKS_DATA = [
  {
    name: "JP Morgan Chase",
    balance: "$2.5M",
    available: "$2.5M",
    currency: "USD",
    accountType: "Business Checking",
    lastSync: "1 hour ago",
  },
  {
    name: "HSBC",
    balance: "$1.8M",
    available: "$1.8M",
    currency: "USD, EUR, GBP",
    accountType: "Multi-currency",
    lastSync: "2 hours ago",
  },
  {
    name: "Banco do Brasil",
    balance: "23.97M BRL",
    available: "23.97M BRL",
    currency: "BRL",
    accountType: "Corporate",
    lastSync: "30 min ago",
  },
];

const CUSTODIANS_DATA = [
  {
    name: "Copper.co",
    balance: "$42.5M",
    available: "$42.5M",
    assets: 6,
    service: "Custody & Settlement",
    lastSync: "Just now",
  },
  {
    name: "Fireblocks",
    balance: "$18.7M",
    available: "$18.6M",
    assets: 14,
    service: "Digital Asset Security",
    lastSync: "3 min ago",
  },
  {
    name: "Anchorage Digital",
    balance: "$9.2M",
    available: "$9.2M",
    assets: 8,
    service: "Qualified Custody",
    lastSync: "5 min ago",
  },
];

const OTC_DESKS_DATA = [
  {
    name: "Galaxy Digital",
    balance: "$5.5M",
    available: "$5.5M",
    lastTrade: "1 hour ago",
    volume30d: "$125M",
    status: "Active",
  },
  {
    name: "Cumberland",
    balance: "$3.2M",
    available: "$3.2M",
    lastTrade: "3 hours ago",
    volume30d: "$89M",
    status: "Active",
  },
  {
    name: "Circle Trade",
    balance: "$2.8M",
    available: "$2.8M",
    lastTrade: "1 day ago",
    volume30d: "$67M",
    status: "Active",
  },
];

type TabType =
  | "Internal Wallets"
  | "Exchanges"
  | "Banks"
  | "Custodians"
  | "OTC Desks";

interface PortfolioSectionProps {
  setCustomAdditionalHeader: (header: React.ReactNode) => void;
}

export function PortfolioSection({
  setCustomAdditionalHeader,
}: PortfolioSectionProps) {
  const [sendModalOpen, setSendModalOpen] = useState(false);
  useEffect(() => {
    setCustomAdditionalHeader(
      <div className="flex items-center gap-3">
        <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-muted-foreground hover:bg-muted/10 text-sm font-normal transition-colors">
          <Eye className="w-4 h-4" />
          View Options
        </button>
        <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-muted-foreground hover:bg-muted/10 text-sm font-normal transition-colors">
          <ArrowUpDown className="w-4 h-4" />
          Sort
        </button>

        <Button onClick={() => setSendModalOpen(true)} variant="primary">
          <Send className="w-4 h-4" />
          Send
        </Button>
      </div>
    );
  }, [setCustomAdditionalHeader]);
  const [activeTab, setActiveTab] = useState<TabType>("Internal Wallets");
  const [expandedCrypto, setExpandedCrypto] = useState(true);
  const [expandedCurrencies, setExpandedCurrencies] = useState(true);
  const [hoveredSegment, setHoveredSegment] = useState<number | null>(null);

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(2)}M`;
    }
    return `$${value.toLocaleString()}`;
  };

  const renderTable = () => {
    switch (activeTab) {
      case "Internal Wallets":
        return (
          <table className="w-full">
            <thead>
              <tr>
                <th className="px-6 py-4 text-left text-sm font-normal text-muted-foreground">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-sm font-normal text-muted-foreground">
                  Type
                </th>
                <th className="px-6 py-4 text-left text-sm font-normal text-muted-foreground">
                  Assets
                </th>
                <th className="px-6 py-4 text-left text-sm font-normal text-muted-foreground">
                  Balance
                </th>
                <th className="px-6 py-4 text-left text-sm font-normal text-muted-foreground">
                  Available
                </th>
                <th className="px-6 py-4 text-left text-sm font-normal text-muted-foreground">
                  Last Activity
                </th>
              </tr>
            </thead>
            <tbody>
              {INTERNAL_WALLETS.map((wallet, index) => (
                <tr
                  key={index}
                  className="hover:bg-muted/5 transition-colors cursor-pointer"
                >
                  <td className="px-6 py-4 text-sm font-normal text-foreground">
                    {wallet.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {wallet.type}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {wallet.assets}
                  </td>
                  <td className="px-6 py-4 text-sm font-normal text-foreground">
                    {wallet.balance}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {wallet.available}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {wallet.lastActivity}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      case "Exchanges":
        return (
          <table className="w-full">
            <thead>
              <tr>
                <th className="px-6 py-4 text-left text-sm font-normal text-muted-foreground">
                  Exchange
                </th>
                <th className="px-6 py-4 text-left text-sm font-normal text-muted-foreground">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-normal text-muted-foreground">
                  Assets
                </th>
                <th className="px-6 py-4 text-left text-sm font-normal text-muted-foreground">
                  Balance
                </th>
                <th className="px-6 py-4 text-left text-sm font-normal text-muted-foreground">
                  Available
                </th>
                <th className="px-6 py-4 text-left text-sm font-normal text-muted-foreground">
                  Last Sync
                </th>
              </tr>
            </thead>
            <tbody>
              {EXCHANGES_DATA.map((exchange, index) => (
                <tr
                  key={index}
                  className="hover:bg-muted/5 transition-colors cursor-pointer"
                >
                  <td className="px-6 py-4 text-sm font-normal text-foreground">
                    {exchange.name}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-normal">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                      {exchange.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {exchange.assets}
                  </td>
                  <td className="px-6 py-4 text-sm font-normal text-foreground">
                    {exchange.balance}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {exchange.available}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {exchange.lastSync}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      case "Banks":
        return (
          <table className="w-full">
            <thead>
              <tr>
                <th className="px-6 py-4 text-left text-sm font-normal text-muted-foreground">
                  Bank
                </th>
                <th className="px-6 py-4 text-left text-sm font-normal text-muted-foreground">
                  Account Type
                </th>
                <th className="px-6 py-4 text-left text-sm font-normal text-muted-foreground">
                  Currency
                </th>
                <th className="px-6 py-4 text-left text-sm font-normal text-muted-foreground">
                  Balance
                </th>
                <th className="px-6 py-4 text-left text-sm font-normal text-muted-foreground">
                  Available
                </th>
                <th className="px-6 py-4 text-left text-sm font-normal text-muted-foreground">
                  Last Sync
                </th>
              </tr>
            </thead>
            <tbody>
              {BANKS_DATA.map((bank, index) => (
                <tr
                  key={index}
                  className="hover:bg-muted/5 transition-colors cursor-pointer"
                >
                  <td className="px-6 py-4 text-sm font-normal text-foreground">
                    {bank.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {bank.accountType}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {bank.currency}
                  </td>
                  <td className="px-6 py-4 text-sm font-normal text-foreground">
                    {bank.balance}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {bank.available}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {bank.lastSync}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      case "Custodians":
        return (
          <table className="w-full">
            <thead>
              <tr>
                <th className="px-6 py-4 text-left text-sm font-normal text-muted-foreground">
                  Custodian
                </th>
                <th className="px-6 py-4 text-left text-sm font-normal text-muted-foreground">
                  Service
                </th>
                <th className="px-6 py-4 text-left text-sm font-normal text-muted-foreground">
                  Assets
                </th>
                <th className="px-6 py-4 text-left text-sm font-normal text-muted-foreground">
                  Balance
                </th>
                <th className="px-6 py-4 text-left text-sm font-normal text-muted-foreground">
                  Available
                </th>
                <th className="px-6 py-4 text-left text-sm font-normal text-muted-foreground">
                  Last Sync
                </th>
              </tr>
            </thead>
            <tbody>
              {CUSTODIANS_DATA.map((custodian, index) => (
                <tr
                  key={index}
                  className="hover:bg-muted/5 transition-colors cursor-pointer"
                >
                  <td className="px-6 py-4 text-sm font-normal text-foreground">
                    {custodian.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {custodian.service}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {custodian.assets}
                  </td>
                  <td className="px-6 py-4 text-sm font-normal text-foreground">
                    {custodian.balance}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {custodian.available}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {custodian.lastSync}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      case "OTC Desks":
        return (
          <table className="w-full">
            <thead>
              <tr>
                <th className="px-6 py-4 text-left text-sm font-normal text-muted-foreground">
                  OTC Desk
                </th>
                <th className="px-6 py-4 text-left text-sm font-normal text-muted-foreground">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-normal text-muted-foreground">
                  30d Volume
                </th>
                <th className="px-6 py-4 text-left text-sm font-normal text-muted-foreground">
                  Balance
                </th>
                <th className="px-6 py-4 text-left text-sm font-normal text-muted-foreground">
                  Available
                </th>
                <th className="px-6 py-4 text-left text-sm font-normal text-muted-foreground">
                  Last Trade
                </th>
              </tr>
            </thead>
            <tbody>
              {OTC_DESKS_DATA.map((desk, index) => (
                <tr
                  key={index}
                  className="hover:bg-muted/5 transition-colors cursor-pointer"
                >
                  <td className="px-6 py-4 text-sm font-normal text-foreground">
                    {desk.name}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent/10 text-accent text-xs font-normal">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent"></div>
                      {desk.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {desk.volume30d}
                  </td>
                  <td className="px-6 py-4 text-sm font-normal text-foreground">
                    {desk.balance}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {desk.available}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {desk.lastTrade}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        );
    }
  };

  return (
    <div className="space-y-8">
      {/* Consolidated View */}
      <div className="bg-card rounded-lg p-6">
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-200">
          <h3 className="text-lg font-normal text-foreground">
            Consolidated View
          </h3>
          <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground my-0 py-0">
              Total Balance:
            </p>
            <p className="text-3xl font-semibold text-foreground">
              {formatCurrency(PORTFOLIO_DATA.totalBalance)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Section - Asset breakdown */}
          <div className="lg:col-span-2 space-y-6">
            {/* Cryptocurrencies - Collapsible */}
            <div>
              <button
                onClick={() => setExpandedCrypto(!expandedCrypto)}
                className="w-full flex items-center justify-between mb-4 hover:bg-muted/5 p-2 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-2">
                  {expandedCrypto ? (
                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  )}
                  <span className="text-foreground font-normal">
                    Cryptocurrencies
                  </span>
                </div>
                <span className="text-foreground font-semibold">
                  {formatCurrency(PORTFOLIO_DATA.cryptocurrencies)}
                </span>
              </button>

              {expandedCrypto && (
                <div className="bg-background rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-muted/5">
                        <th className="px-4 py-3 text-left text-xs font-normal text-muted-foreground uppercase">
                          Asset
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-normal text-muted-foreground uppercase">
                          Amount
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-normal text-muted-foreground uppercase">
                          Value
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-normal text-muted-foreground uppercase">
                          24h
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {CRYPTOCURRENCIES.map((crypto) => (
                        <tr
                          key={crypto.code}
                          className="hover:bg-muted/5 transition-colors cursor-pointer"
                        >
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="text-xs font-semibold text-primary">
                                  {crypto.code.charAt(0)}
                                </span>
                              </div>
                              <div>
                                <p className="text-sm font-normal text-foreground">
                                  {crypto.code}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {crypto.name}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">
                            {crypto.amount}
                          </td>
                          <td className="px-4 py-3 text-sm font-normal text-foreground text-right">
                            {crypto.value}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <span
                              className={`text-sm font-normal ${
                                crypto.change.startsWith("+")
                                  ? "text-accent"
                                  : "text-muted-foreground"
                              }`}
                            >
                              {crypto.change}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Currencies - Collapsible */}
            <div>
              <button
                onClick={() => setExpandedCurrencies(!expandedCurrencies)}
                className="w-full flex items-center justify-between mb-4 hover:bg-muted/5 p-2 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-2">
                  {expandedCurrencies ? (
                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  )}
                  <span className="text-foreground font-normal">
                    Currencies
                  </span>
                </div>
                <span className="text-foreground font-semibold">
                  {formatCurrency(PORTFOLIO_DATA.currencies)}
                </span>
              </button>

              {expandedCurrencies && (
                <div className="bg-background rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-muted/5">
                        <th className="px-4 py-3 text-left text-xs font-normal text-muted-foreground uppercase">
                          Currency
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-normal text-muted-foreground uppercase">
                          Amount
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-normal text-muted-foreground uppercase">
                          Value
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-normal text-muted-foreground uppercase">
                          24h
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {CURRENCIES.map((currency) => (
                        <tr
                          key={currency.code}
                          className="hover:bg-muted/5 transition-colors cursor-pointer"
                        >
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                                <span className="text-xs font-semibold text-accent">
                                  {currency.code.charAt(0)}
                                </span>
                              </div>
                              <div>
                                <p className="text-sm font-normal text-foreground">
                                  {currency.code}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {currency.name}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">
                            {currency.amount}
                          </td>
                          <td className="px-4 py-3 text-sm font-normal text-foreground text-right">
                            {currency.value}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <span
                              className={`text-sm font-normal ${
                                currency.change.startsWith("+")
                                  ? "text-accent"
                                  : "text-muted-foreground"
                              }`}
                            >
                              {currency.change}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Right Section – Asset Allocation Pie Chart */}
          <div className="bg-background rounded-lg p-6 flex flex-col">
            <h4 className="text-sm font-normal text-muted-foreground mb-4 uppercase">
              Asset Allocation
            </h4>

            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={ASSET_ALLOCATION}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  stroke="none"
                  onMouseEnter={(_, index) => setHoveredSegment(index)}
                  onMouseLeave={() => setHoveredSegment(null)}
                >
                  {ASSET_ALLOCATION.map((entry, index) => (
                    <Cell
                      key={`segment-${entry.name}`}
                      className={`portfolio-segment-${index}`}
                      fill={entry.color}
                      opacity={
                        hoveredSegment === null || hoveredSegment === index
                          ? 1
                          : 0.7
                      }
                      style={{ cursor: "pointer" }}
                    />
                  ))}
                </Pie>

                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                  formatter={(value: number, name: string) => [
                    `${value}%`,
                    name,
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Legend */}
            <div className="mt-6 space-y-2.5">
              {ASSET_ALLOCATION.map((item, index) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between cursor-pointer hover:bg-muted/5 p-2 rounded transition-colors"
                  onMouseEnter={() => setHoveredSegment(index)}
                  onMouseLeave={() => setHoveredSegment(null)}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-muted-foreground">
                      {item.name} {item.value}%
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {formatCurrency(item.amount)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs and Table */}
      <div className="bg-card rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-2 bg-muted/10 p-1 rounded-lg">
            {(
              [
                "Internal Wallets",
                "Exchanges",
                "Banks",
                "Custodians",
                "OTC Desks",
              ] as TabType[]
            ).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-normal rounded-md transition-all ${
                  activeTab === tab
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-normal hover:bg-primary/90 transition-colors">
            <Plus className="w-4 h-4" />
            Add New
          </button>
        </div>

        {/* Table */}
        <div className="bg-background rounded-lg overflow-hidden">
          {renderTable()}
        </div>
      </div>

      {sendModalOpen && (
        <SendModal
          sendModalOpen={sendModalOpen}
          setSendModalOpen={setSendModalOpen}
        />
      )}
    </div>
  );
}
