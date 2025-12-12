"use client";

import {
  Activity,
  AlertCircle,
  Building,
  CheckCircle,
  ChevronRight,
  Download,
  FileText,
  Info,
  Key,
  Lock,
  Plus,
  RotateCw,
  Shield,
  TrendingUp,
  X,
} from "lucide-react";
import { useState } from "react";
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

type Provider = {
  id: "copper" | "fireblocks" | "bitgo" | "self";
  name: string;
  status: "operational" | "degraded" | "maintenance";
  model: "MPC" | "Multisig" | "HSM";
  jurisdiction: string[];
  certifications: string[];
  quorum?: string;
  feesNote?: string;
  logo?: string;
};

type Account = {
  id: string;
  name: string;
  segregation: "Segregated" | "Omnibus";
  providerId: Provider["id"];
  custodyModel: "MPC" | "Multisig" | "Self";
  netAssetsUSD: number;
  topAssets: { symbol: string; amount: string; color: string }[];
  policyId: string;
  status: "Active" | "Restricted";
};

type Policy = {
  id: string;
  summary: string;
  expression: string;
  breaches30d: number;
};

type AllowlistEntry = {
  id: string;
  label: string;
  asset: string;
  address: string;
  network: string;
  addedBy: string;
  lastUsed?: string;
};

type AuditEvent = {
  time: string;
  event: string;
  actor: string;
  object: string;
  result: "Success" | "Failed" | "Pending";
  txRef?: string;
};

const PROVIDERS: Provider[] = [
  {
    id: "copper",
    name: "Copper",
    status: "operational",
    model: "MPC",
    jurisdiction: ["UK", "US"],
    certifications: ["SOC2", "ISO27001"],
    quorum: "3-of-5",
    feesNote: "~$0.50/tx",
  },
  {
    id: "fireblocks",
    name: "Fireblocks",
    status: "operational",
    model: "MPC",
    jurisdiction: ["US", "EU"],
    certifications: ["SOC2", "ISO27001", "CCSS"],
    quorum: "2-of-3",
    feesNote: "~$0.75/tx",
  },
  {
    id: "bitgo",
    name: "BitGo",
    status: "operational",
    model: "Multisig",
    jurisdiction: ["US"],
    certifications: ["SOC2"],
    quorum: "2-of-3",
    feesNote: "~$1.00/tx",
  },
  {
    id: "self",
    name: "Self-Custody",
    status: "operational",
    model: "Multisig",
    jurisdiction: ["On-premise"],
    certifications: ["Internal"],
    quorum: "3-of-5",
    feesNote: "Network fees only",
  },
];

const ACCOUNTS: Account[] = [
  {
    id: "acc1",
    name: "Treasury • Segregated",
    segregation: "Segregated",
    providerId: "copper",
    custodyModel: "MPC",
    netAssetsUSD: 412900000,
    topAssets: [
      { symbol: "BTC", amount: "2,500", color: "#C8A24A" },
      { symbol: "ETH", amount: "15,300", color: "#7C88C2" },
    ],
    policyId: "pol1",
    status: "Active",
  },
  {
    id: "acc2",
    name: "Trading • Omnibus",
    segregation: "Omnibus",
    providerId: "fireblocks",
    custodyModel: "MPC",
    netAssetsUSD: 156300000,
    topAssets: [
      { symbol: "USDC", amount: "150M", color: "#7C8A99" },
      { symbol: "USDT", amount: "6.3M", color: "#7C8A99" },
    ],
    policyId: "pol2",
    status: "Active",
  },
  {
    id: "acc3",
    name: "Reserves • Segregated",
    segregation: "Segregated",
    providerId: "bitgo",
    custodyModel: "Multisig",
    netAssetsUSD: 203700000,
    topAssets: [
      { symbol: "BTC", amount: "1,200", color: "#C8A24A" },
      { symbol: "ETH", amount: "8,500", color: "#7C88C2" },
    ],
    policyId: "pol1",
    status: "Active",
  },
  {
    id: "acc4",
    name: "Cold Storage • Segregated",
    segregation: "Segregated",
    providerId: "self",
    custodyModel: "Self",
    netAssetsUSD: 89500000,
    topAssets: [{ symbol: "BTC", amount: "800", color: "#C8A24A" }],
    policyId: "pol3",
    status: "Active",
  },
];

const ALLOWLIST: AllowlistEntry[] = [
  {
    id: "al1",
    label: "Coinbase Exchange",
    asset: "BTC",
    address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    network: "Bitcoin",
    addedBy: "admin@crocante.com",
    lastUsed: "2024-11-14",
  },
  {
    id: "al2",
    label: "Kraken Deposit",
    asset: "ETH",
    address: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    network: "Ethereum",
    addedBy: "ops@crocante.com",
    lastUsed: "2024-11-13",
  },
  {
    id: "al3",
    label: "Treasury Vault",
    asset: "USDC",
    address: "0x8e23Ee67d1332aD560396262C48ffbB273f626a",
    network: "Ethereum",
    addedBy: "admin@crocante.com",
  },
];

const AUDIT_EVENTS: AuditEvent[] = [
  {
    time: "2024-11-15 14:32",
    event: "Transfer Approved",
    actor: "ops@crocante.com",
    object: "BTC Transfer 0.5",
    result: "Success",
    txRef: "0xabc123...",
  },
  {
    time: "2024-11-15 12:15",
    event: "Address Generated",
    actor: "admin@crocante.com",
    object: "Treasury ETH Address",
    result: "Success",
  },
  {
    time: "2024-11-15 10:45",
    event: "Policy Modified",
    actor: "admin@crocante.com",
    object: "Transfer Policy > $100k",
    result: "Success",
  },
  {
    time: "2024-11-14 16:20",
    event: "Key Rotation",
    actor: "system",
    object: "MPC Key Share 3/5",
    result: "Success",
  },
];

const ASSET_DISTRIBUTION = [
  {
    name: "BTC",
    value: 45.2,
    amount: 4500,
    provider: "copper",
    color: "#C8A24A",
  },
  {
    name: "ETH",
    value: 32.1,
    amount: 23800,
    provider: "fireblocks",
    color: "#7C88C2",
  },
  {
    name: "USDC",
    value: 18.4,
    amount: 156300000,
    provider: "bitgo",
    color: "#7C8A99",
  },
  {
    name: "Others",
    value: 4.3,
    amount: 35000000,
    provider: "self",
    color: "#94A3B8",
  },
];

const PROVIDER_DISTRIBUTION = [
  { name: "Copper", value: 47.8, color: "#C8A24A" },
  { name: "Fireblocks", value: 23.4, color: "#7C88C2" },
  { name: "BitGo", value: 18.1, color: "#7C8A99" },
  { name: "Self", value: 10.7, color: "#94A3B8" },
];

export function CustodySection() {
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [distributionView, setDistributionView] = useState<
    "asset" | "provider"
  >("asset");
  const [allowlistTab, setAllowlistTab] = useState<
    "addresses" | "counterparties" | "travel-rule"
  >("addresses");
  const [auditFilter, setAuditFilter] = useState<string>("all");
  const [showSimulate, setShowSimulate] = useState(false);

  const formatCurrency = (value: number) => {
    if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
    return `$${value.toLocaleString()}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Lock className="w-8 h-8 text-slate-700" />
        <h2 className="text-3xl font-semibold text-neutral-900">Custody</h2>
        <div className="ml-auto flex gap-2">
          <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-neutral-200 bg-white text-sm font-normal hover:bg-neutral-50 transition-colors">
            <Plus className="w-4 h-4" />
            New Address
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-neutral-200 bg-white text-sm font-normal hover:bg-neutral-50 transition-colors">
            <Shield className="w-4 h-4" />
            Add Policy
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-neutral-200 bg-white text-sm font-normal hover:bg-neutral-50 transition-colors">
            <RotateCw className="w-4 h-4" />
            Rotate Keys
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-neutral-200">
          <p className="text-xs text-neutral-600 font-normal mb-1 uppercase tracking-wide">
            Total Under Custody
          </p>
          <p className="text-2xl font-semibold text-neutral-900 tabular-nums">
            $862.4M
          </p>
          <p className="text-xs text-emerald-600 mt-1">+2.3% / 30d</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-neutral-200">
          <p className="text-xs text-neutral-600 font-normal mb-1 uppercase tracking-wide">
            Accounts
          </p>
          <p className="text-2xl font-semibold text-neutral-900 tabular-nums">
            8 / 4
          </p>
          <p className="text-xs text-neutral-600 mt-1">Segregated / Omnibus</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-neutral-200">
          <p className="text-xs text-neutral-600 font-normal mb-1 uppercase tracking-wide">
            Active Providers
          </p>
          <div className="flex items-center gap-2 mt-1">
            {PROVIDERS.map((p) => (
              <div
                key={p.id}
                className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center"
              >
                <span className="text-[10px] font-semibold text-slate-700">
                  {p.name[0]}
                </span>
              </div>
            ))}
          </div>
          <p className="text-xs text-emerald-600 mt-1">All operational</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-neutral-200">
          <p className="text-xs text-neutral-600 font-normal mb-1 uppercase tracking-wide">
            Last Audit
          </p>
          <p className="text-2xl font-semibold text-neutral-900">Q3 2024</p>
          <p className="text-xs text-emerald-600 mt-1">Compliant</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-neutral-200">
          <p className="text-xs text-neutral-600 font-normal mb-1 uppercase tracking-wide">
            Policy Posture
          </p>
          <p className="text-2xl font-semibold text-neutral-900 tabular-nums">
            12 / 0
          </p>
          <p className="text-xs text-neutral-600 mt-1">Active / Breaches 30d</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-neutral-200">
          <p className="text-xs text-neutral-600 font-normal mb-1 uppercase tracking-wide">
            Key Health
          </p>
          <p className="text-2xl font-semibold text-neutral-900 tabular-nums">
            100%
          </p>
          <p className="text-xs text-neutral-600 mt-1">Next rotation: 45d</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-6">
        {/* Left column */}
        <div className="space-y-6">
          {/* Asset & Provider Distribution */}
          <div className="bg-white rounded-2xl p-6 border border-neutral-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-neutral-900">
                Distribution
              </h3>
              <div className="inline-flex rounded-lg border border-neutral-200 p-1">
                <button
                  onClick={() => setDistributionView("asset")}
                  className={`px-3 py-1 rounded text-sm font-normal transition-colors ${
                    distributionView === "asset"
                      ? "bg-neutral-900 text-white"
                      : "text-neutral-600 hover:text-neutral-900"
                  }`}
                >
                  By Asset
                </button>
                <button
                  onClick={() => setDistributionView("provider")}
                  className={`px-3 py-1 rounded text-sm font-normal transition-colors ${
                    distributionView === "provider"
                      ? "bg-neutral-900 text-white"
                      : "text-neutral-600 hover:text-neutral-900"
                  }`}
                >
                  By Provider
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={
                        distributionView === "asset"
                          ? ASSET_DISTRIBUTION
                          : PROVIDER_DISTRIBUTION
                      }
                      dataKey="value"
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                    >
                      {(distributionView === "asset"
                        ? ASSET_DISTRIBUTION
                        : PROVIDER_DISTRIBUTION
                      ).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-3">
                {(distributionView === "asset"
                  ? ASSET_DISTRIBUTION
                  : PROVIDER_DISTRIBUTION
                ).map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <span className="text-sm font-normal text-neutral-700">
                        {item.name}
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-neutral-900 tabular-nums">
                      {item.value}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Segregated Accounts */}
          <div className="bg-white rounded-2xl p-6 border border-neutral-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-neutral-900">
                Segregated Accounts
              </h3>
              <div className="flex gap-2">
                <select className="px-3 py-1.5 text-sm border border-neutral-200 rounded-lg bg-white">
                  <option>All Providers</option>
                  <option>Copper</option>
                  <option>Fireblocks</option>
                  <option>BitGo</option>
                  <option>Self</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-200">
                    <th className="px-4 py-3 text-left text-xs font-normal text-neutral-600 uppercase tracking-wide">
                      Account
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-normal text-neutral-600 uppercase tracking-wide">
                      Model
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-normal text-neutral-600 uppercase tracking-wide">
                      Segregation
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-normal text-neutral-600 uppercase tracking-wide">
                      Provider
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-normal text-neutral-600 uppercase tracking-wide">
                      Net Assets
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-normal text-neutral-600 uppercase tracking-wide">
                      Assets
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-normal text-neutral-600 uppercase tracking-wide">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-normal text-neutral-600 uppercase tracking-wide"></th>
                  </tr>
                </thead>
                <tbody>
                  {ACCOUNTS.map((account) => (
                    <tr
                      key={account.id}
                      className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors"
                    >
                      <td className="px-4 py-4">
                        <div className="text-sm font-normal text-neutral-900">
                          {account.name}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-normal bg-slate-100 text-slate-700">
                          <Shield className="w-3 h-3" />
                          {account.custodyModel}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`text-xs font-normal ${
                            account.segregation === "Segregated"
                              ? "text-emerald-600"
                              : "text-neutral-600"
                          }`}
                        >
                          {account.segregation}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm text-neutral-700 capitalize">
                          {account.providerId}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <span className="text-sm font-semibold text-neutral-900 tabular-nums">
                          {formatCurrency(account.netAssetsUSD)}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex gap-1">
                          {account.topAssets.slice(0, 2).map((asset, i) => (
                            <span
                              key={i}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-normal"
                              style={{
                                backgroundColor: `${asset.color}20`,
                                color: asset.color,
                              }}
                            >
                              {asset.symbol}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-normal ${
                            account.status === "Active"
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-amber-50 text-amber-700"
                          }`}
                        >
                          <div
                            className={`w-1.5 h-1.5 rounded-full ${
                              account.status === "Active"
                                ? "bg-emerald-600"
                                : "bg-amber-600"
                            }`}
                          ></div>
                          {account.status}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <button
                          onClick={() => setSelectedAccount(account)}
                          className="text-sm text-primary hover:underline"
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Policy Engine & RBAC */}
          <div className="bg-white rounded-2xl p-6 border border-neutral-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-neutral-900">
                Policy Engine & RBAC
              </h3>
              <button
                onClick={() => setShowSimulate(!showSimulate)}
                className="px-3 py-1.5 text-sm font-normal text-primary border border-primary rounded-lg hover:bg-primary/5"
              >
                Simulate
              </button>
            </div>

            {showSimulate && (
              <div className="mb-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                <h4 className="text-sm font-semibold text-neutral-900 mb-3">
                  Simulate Policy
                </h4>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <input
                    type="number"
                    placeholder="Amount (USD)"
                    className="px-3 py-2 text-sm border border-neutral-200 rounded-lg"
                  />
                  <select className="px-3 py-2 text-sm border border-neutral-200 rounded-lg bg-white">
                    <option>BTC</option>
                    <option>ETH</option>
                    <option>USDC</option>
                  </select>
                  <input
                    type="time"
                    className="px-3 py-2 text-sm border border-neutral-200 rounded-lg"
                  />
                  <select className="px-3 py-2 text-sm border border-neutral-200 rounded-lg bg-white">
                    <option>Admin</option>
                    <option>Ops</option>
                    <option>Approver</option>
                  </select>
                </div>
                <button className="w-full px-4 py-2 bg-primary text-white rounded-lg text-sm font-normal hover:bg-primary/90">
                  Run Simulation
                </button>
              </div>
            )}

            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-200">
                    <th className="px-3 py-2 text-left text-xs font-normal text-neutral-600 uppercase">
                      Role / Action
                    </th>
                    <th className="px-3 py-2 text-center text-xs font-normal text-neutral-600 uppercase">
                      Generate Address
                    </th>
                    <th className="px-3 py-2 text-center text-xs font-normal text-neutral-600 uppercase">
                      Initiate Transfer
                    </th>
                    <th className="px-3 py-2 text-center text-xs font-normal text-neutral-600 uppercase">
                      Approve
                    </th>
                    <th className="px-3 py-2 text-center text-xs font-normal text-neutral-600 uppercase">
                      Modify Policy
                    </th>
                    <th className="px-3 py-2 text-center text-xs font-normal text-neutral-600 uppercase">
                      Rotate Keys
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { role: "Admin", perms: [true, true, true, true, true] },
                    { role: "Ops", perms: [true, true, false, false, false] },
                    {
                      role: "Approver",
                      perms: [false, false, true, false, false],
                    },
                    {
                      role: "Viewer",
                      perms: [false, false, false, false, false],
                    },
                  ].map((row) => (
                    <tr key={row.role} className="border-b border-neutral-100">
                      <td className="px-3 py-3 font-normal text-neutral-900">
                        {row.role}
                      </td>
                      {row.perms.map((allowed, i) => (
                        <td key={i} className="px-3 py-3 text-center">
                          {allowed ? (
                            <CheckCircle className="w-4 h-4 text-emerald-600 mx-auto" />
                          ) : (
                            <X className="w-4 h-4 text-neutral-300 mx-auto" />
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200">
              <p className="text-xs font-mono text-neutral-700 mb-2">
                Policy Expression (YAML-like):
              </p>
              <pre className="text-xs font-mono text-neutral-600">
                {`transfer.usd > 100000:
  required: 2 of [Admin, Approver]
  within: working_hours
  geo: allowed_jurisdictions`}
              </pre>
              <button className="mt-3 text-sm text-primary hover:underline">
                Edit policy →
              </button>
            </div>
          </div>

          {/* Allowlists & Travel Rule */}
          <div className="bg-white rounded-2xl p-6 border border-neutral-200">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">
              Allowlists & Travel Rule
            </h3>

            <div className="flex gap-2 mb-4 border-b border-neutral-200">
              <button
                onClick={() => setAllowlistTab("addresses")}
                className={`px-4 py-2 text-sm font-normal transition-colors border-b-2 ${
                  allowlistTab === "addresses"
                    ? "border-primary text-primary"
                    : "border-transparent text-neutral-600 hover:text-neutral-900"
                }`}
              >
                Allowlisted Addresses
              </button>
              <button
                onClick={() => setAllowlistTab("counterparties")}
                className={`px-4 py-2 text-sm font-normal transition-colors border-b-2 ${
                  allowlistTab === "counterparties"
                    ? "border-primary text-primary"
                    : "border-transparent text-neutral-600 hover:text-neutral-900"
                }`}
              >
                Counterparties
              </button>
              <button
                onClick={() => setAllowlistTab("travel-rule")}
                className={`px-4 py-2 text-sm font-normal transition-colors border-b-2 ${
                  allowlistTab === "travel-rule"
                    ? "border-primary text-primary"
                    : "border-transparent text-neutral-600 hover:text-neutral-900"
                }`}
              >
                Travel Rule
              </button>
            </div>

            {allowlistTab === "addresses" && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-neutral-200">
                      <th className="px-4 py-3 text-left text-xs font-normal text-neutral-600 uppercase">
                        Label
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-normal text-neutral-600 uppercase">
                        Asset
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-normal text-neutral-600 uppercase">
                        Address
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-normal text-neutral-600 uppercase">
                        Network
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-normal text-neutral-600 uppercase">
                        Added By
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-normal text-neutral-600 uppercase">
                        Last Used
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {ALLOWLIST.map((entry) => (
                      <tr
                        key={entry.id}
                        className="border-b border-neutral-100 hover:bg-neutral-50"
                      >
                        <td className="px-4 py-3 text-sm font-normal text-neutral-900">
                          {entry.label}
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-normal bg-slate-100 text-slate-700">
                            {entry.asset}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm font-mono text-neutral-600">
                          {entry.address.slice(0, 12)}...
                        </td>
                        <td className="px-4 py-3 text-sm text-neutral-600">
                          {entry.network}
                        </td>
                        <td className="px-4 py-3 text-sm text-neutral-600">
                          {entry.addedBy}
                        </td>
                        <td className="px-4 py-3 text-sm text-neutral-600">
                          {entry.lastUsed || "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {allowlistTab === "travel-rule" && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  <div>
                    <p className="text-sm font-semibold text-emerald-900">
                      Travel Rule Ready
                    </p>
                    <p className="text-xs text-emerald-700">
                      TRISA/TRP integrated • Last certificate match: 2024-11-14
                      • 98.5% coverage
                    </p>
                  </div>
                </div>
                <p className="text-sm text-neutral-600">
                  Counterparty VASP matched. IVMS101 payload exchanged.
                </p>
              </div>
            )}
          </div>

          {/* Audit & Activity */}
          <div className="bg-white rounded-2xl p-6 border border-neutral-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-neutral-900">
                Audit & Activity
              </h3>
              <div className="flex gap-2">
                <div className="flex gap-1">
                  {["All", "Security", "Policy", "Transfers", "Keys"].map(
                    (filter) => (
                      <button
                        key={filter}
                        onClick={() => setAuditFilter(filter.toLowerCase())}
                        className={`px-3 py-1 text-xs rounded-full transition-colors ${
                          auditFilter === filter.toLowerCase()
                            ? "bg-primary text-white"
                            : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                        }`}
                      >
                        {filter}
                      </button>
                    )
                  )}
                </div>
                <button className="inline-flex items-center gap-1 px-3 py-1 text-xs border border-neutral-200 rounded-lg hover:bg-neutral-50">
                  <Download className="w-3 h-3" />
                  Export CSV
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-200">
                    <th className="px-4 py-3 text-left text-xs font-normal text-neutral-600 uppercase">
                      Time
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-normal text-neutral-600 uppercase">
                      Event
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-normal text-neutral-600 uppercase">
                      Actor
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-normal text-neutral-600 uppercase">
                      Object
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-normal text-neutral-600 uppercase">
                      Result
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-normal text-neutral-600 uppercase">
                      Tx/Ref
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {AUDIT_EVENTS.map((event, i) => (
                    <tr
                      key={i}
                      className="border-b border-neutral-100 hover:bg-neutral-50"
                    >
                      <td className="px-4 py-3 text-xs text-neutral-600 tabular-nums">
                        {event.time}
                      </td>
                      <td className="px-4 py-3 text-sm font-normal text-neutral-900">
                        {event.event}
                      </td>
                      <td className="px-4 py-3 text-sm text-neutral-600">
                        {event.actor}
                      </td>
                      <td className="px-4 py-3 text-sm text-neutral-600">
                        {event.object}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-normal ${
                            event.result === "Success"
                              ? "bg-emerald-50 text-emerald-700"
                              : event.result === "Failed"
                              ? "bg-red-50 text-red-700"
                              : "bg-amber-50 text-amber-700"
                          }`}
                        >
                          {event.result}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs font-mono text-neutral-600">
                        {event.txRef || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="sticky top-6 space-y-4">
            {/* Operations Card */}
            <div className="bg-white rounded-2xl p-6 border border-neutral-200">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">
                Operations
              </h3>

              <div className="space-y-3">
                <button className="w-full px-4 py-3 bg-primary text-white rounded-lg text-sm font-normal hover:bg-primary/90 flex items-center justify-between">
                  <span>Generate Address</span>
                  <ChevronRight className="w-4 h-4" />
                </button>

                <button className="w-full px-4 py-3 bg-white border border-neutral-200 text-neutral-900 rounded-lg text-sm font-normal hover:bg-neutral-50 flex items-center justify-between">
                  <span>Start Transfer</span>
                  <span className="text-xs text-amber-600">
                    Needs 2 approvals
                  </span>
                </button>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-neutral-700">
                      Key Rotation
                    </span>
                    <span className="text-xs text-neutral-600">Next: 45d</span>
                  </div>
                  <p className="text-xs text-neutral-600">
                    Schedule ceremony checklist
                  </p>
                </div>

                <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                  <div className="flex items-center gap-2 mb-1">
                    <Activity className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-semibold text-emerald-900">
                      Provider Health
                    </span>
                  </div>
                  <p className="text-xs text-emerald-700">
                    All systems operational • Avg latency: 120ms
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-neutral-200">
                <h4 className="text-xs font-semibold text-neutral-700 mb-2 uppercase">
                  Compliance
                </h4>
                <div className="space-y-1">
                  <a
                    href="#"
                    className="flex items-center gap-2 text-sm text-primary hover:underline"
                  >
                    <FileText className="w-4 h-4" />
                    Last Audit Report
                  </a>
                  <a
                    href="#"
                    className="flex items-center gap-2 text-sm text-primary hover:underline"
                  >
                    <FileText className="w-4 h-4" />
                    SOC2 Certificate
                  </a>
                  <a
                    href="#"
                    className="flex items-center gap-2 text-sm text-primary hover:underline"
                  >
                    <FileText className="w-4 h-4" />
                    ISO27001 Docs
                  </a>
                </div>
              </div>
            </div>

            {/* Providers */}
            <div className="bg-white rounded-2xl p-6 border border-neutral-200">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">
                Providers
              </h3>

              <div className="space-y-3">
                {PROVIDERS.map((provider) => (
                  <div
                    key={provider.id}
                    className="p-4 border border-neutral-200 rounded-lg hover:border-neutral-300 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-sm font-semibold text-neutral-900">
                            {provider.name}
                          </h4>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-normal ${
                              provider.status === "operational"
                                ? "bg-emerald-50 text-emerald-700"
                                : provider.status === "degraded"
                                ? "bg-amber-50 text-amber-700"
                                : "bg-slate-50 text-slate-700"
                            }`}
                          >
                            {provider.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-neutral-600">
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-slate-100 rounded">
                            <Shield className="w-3 h-3" />
                            {provider.model}
                          </span>
                          <span>{provider.jurisdiction.join(", ")}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-2">
                      {provider.certifications.map((cert) => (
                        <span
                          key={cert}
                          className="px-2 py-0.5 bg-neutral-100 text-neutral-700 rounded text-[10px] font-normal"
                        >
                          {cert}
                        </span>
                      ))}
                    </div>

                    {provider.quorum && (
                      <p className="text-xs text-neutral-600 mb-1">
                        Quorum: {provider.quorum}
                      </p>
                    )}
                    {provider.feesNote && (
                      <p className="text-xs text-neutral-600">
                        {provider.feesNote}
                      </p>
                    )}

                    <button className="mt-2 text-xs text-primary hover:underline">
                      View accounts →
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedAccount && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-end"
          onClick={() => setSelectedAccount(null)}
        >
          <div
            className="bg-white w-full max-w-2xl h-full overflow-y-auto p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-neutral-900">
                {selectedAccount.name}
              </h2>
              <button
                onClick={() => setSelectedAccount(null)}
                className="p-2 hover:bg-neutral-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-neutral-600 mb-1">Custody Model</p>
                  <p className="text-sm font-semibold text-neutral-900">
                    {selectedAccount.custodyModel}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-neutral-600 mb-1">Segregation</p>
                  <p className="text-sm font-semibold text-neutral-900">
                    {selectedAccount.segregation}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-neutral-600 mb-1">Provider</p>
                  <p className="text-sm font-semibold text-neutral-900 capitalize">
                    {selectedAccount.providerId}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-neutral-600 mb-1">Net Assets</p>
                  <p className="text-sm font-semibold text-neutral-900">
                    {formatCurrency(selectedAccount.netAssetsUSD)}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-neutral-900 mb-2">
                  Top Assets
                </h3>
                <div className="space-y-2">
                  {selectedAccount.topAssets.map((asset, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg"
                    >
                      <span className="text-sm font-normal text-neutral-900">
                        {asset.symbol}
                      </span>
                      <span className="text-sm font-semibold text-neutral-900">
                        {asset.amount}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-200">
                <p className="text-xs text-neutral-600">
                  Policy ID: {selectedAccount.policyId}
                </p>
                <p className="text-xs text-neutral-600">
                  Status: {selectedAccount.status}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
