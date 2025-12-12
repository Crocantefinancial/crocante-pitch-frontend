"use client";

import {
  Banknote,
  Bitcoin,
  CheckCircle2,
  ChevronRight,
  Download,
  ExternalLink,
  Hexagon,
  Info,
  Loader2,
  Network,
  Wallet,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

import type { Fund } from "@/services/api/types/fund-data";
import { FUNDS_DATA } from "@/shared/mockups/funds";

const getCategoryStyles = (category: Fund["category"]) => {
  const styles = {
    btc: { accent: "#C8A24A", bg: "#C8A24A0F", icon: Bitcoin, label: "BTC" },
    eth: { accent: "#7C88C2", bg: "#7C88C20F", icon: Hexagon, label: "ETH" },
    defi: { accent: "#5FA6A1", bg: "#5FA6A10F", icon: Network, label: "DeFi" },
    tbill: {
      accent: "#7FA38F",
      bg: "#7FA38F0F",
      icon: Banknote,
      label: "T-Bills",
    },
    stable: {
      accent: "#7C8A99",
      bg: "#7C8A990F",
      icon: Wallet,
      label: "Stablecoins",
    },
  };
  return styles[category];
};

export default function Fund({ slug }: { slug: string }) {
  const router = useRouter();

  const fund = FUNDS_DATA.find((f) => f.slug === slug);

  const [activeSection, setActiveSection] = useState("overview");
  const [investStep, setInvestStep] = useState<
    "connect" | "configure" | "review" | "submit"
  >("connect");
  const [investAmount, setInvestAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToEligibility, setAgreedToEligibility] = useState(false);
  const [performancePeriod, setPerformancePeriod] = useState("YTD");

  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        "overview",
        "strategy",
        "risks",
        "fees",
        "holdings",
        "docs",
        "activity",
      ];
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetBottom = offsetTop + element.offsetHeight;
          if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!fund) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-neutral-900 mb-2">
            Fund not found
          </h1>
          <button
            onClick={() => router.push("/")}
            className="text-primary hover:underline"
          >
            Return to Invest
          </button>
        </div>
      </div>
    );
  }

  const categoryStyle = getCategoryStyles(fund.category);
  const Icon = categoryStyle.icon;

  const handleInvestSubmit = async () => {
    setIsSubmitting(true);
    setSubmitStatus("idle");

    // Simulate transaction
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Simulate success
    setIsSubmitting(false);
    setSubmitStatus("success");
    setInvestStep("submit");
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <button
            onClick={() => router.push("/")}
            className="hover:text-foreground"
          >
            Home
          </button>
          <ChevronRight className="w-4 h-4" />
          <button
            onClick={() => router.push("/")}
            className="hover:text-foreground"
          >
            Invest
          </button>
          <ChevronRight className="w-4 h-4" />
          <span className="text-foreground">{fund.name}</span>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[2.1fr_0.9fr] gap-6">
          {/* Left Column - Main Content */}
          <div className="space-y-6">
            {/* Header Block */}
            <div
              className="bg-card border-l-4 rounded-2xl p-6"
              style={{ borderLeftColor: categoryStyle.accent }}
            >
              {/* Title Row */}
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: categoryStyle.bg }}
                >
                  <Icon
                    className="w-5 h-5"
                    style={{ color: categoryStyle.accent }}
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h1 className="text-3xl font-semibold text-foreground">
                      {fund.name}
                    </h1>
                    <span
                      className="px-2 py-0.5 text-xs font-normal rounded-full"
                      style={{
                        backgroundColor: categoryStyle.bg,
                        color: categoryStyle.accent,
                      }}
                    >
                      {categoryStyle.label}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {fund.summary}
                  </p>
                </div>
              </div>

              {/* Key Stats Strip */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-6 mb-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                    APY
                    <Info className="w-3 h-3" />
                  </p>
                  <p className="text-lg font-semibold text-foreground">
                    {fund.stats.apy}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">AUM</p>
                  <p className="text-lg font-semibold text-foreground">
                    {fund.stats.aum}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                    Liquidity
                    <Info className="w-3 h-3" />
                  </p>
                  <p className="text-lg font-semibold text-foreground">
                    {fund.stats.liquidity}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                    Risk
                    <Info className="w-3 h-3" />
                  </p>
                  <p className="text-lg font-semibold text-foreground">
                    {fund.stats.risk}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    Inception
                  </p>
                  <p className="text-lg font-semibold text-foreground">
                    {fund.stats.inception}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Network</p>
                  <div className="flex gap-1">
                    <span className="px-2 py-0.5 text-xs rounded-full bg-muted/50 text-muted-foreground">
                      {fund.stats.network}
                    </span>
                    <span className="px-2 py-0.5 text-xs rounded-full bg-muted/50 text-muted-foreground">
                      {fund.stats.depositAsset}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-muted-foreground mt-4">
                Past performance is not indicative of future results.
              </p>
            </div>

            {/* Anchored Section Tabs */}
            <div className="bg-card rounded-2xl border border-border sticky top-0 z-10">
              <div className="flex gap-6 px-6 overflow-x-auto">
                {[
                  { id: "overview", label: "Overview" },
                  { id: "strategy", label: "Strategy" },
                  { id: "risks", label: "Risks" },
                  { id: "fees", label: "Fees" },
                  { id: "holdings", label: "Holdings" },
                  { id: "docs", label: "Documents" },
                  { id: "activity", label: "Activity" },
                ].map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className={`py-4 text-sm font-normal border-b-2 transition-colors whitespace-nowrap ${
                      activeSection === section.id
                        ? "border-primary text-primary"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {section.label}
                  </a>
                ))}
              </div>
            </div>

            {/* Overview Section */}
            <div
              id="overview"
              className="bg-card rounded-2xl p-6 border border-border"
            >
              <h2 className="text-xl font-semibold text-foreground mb-4">
                Overview
              </h2>

              <div className="prose prose-sm max-w-none mb-6">
                <p className="text-muted-foreground">{fund.strategy}</p>
              </div>

              <div className="mb-6">
                <h3 className="text-sm font-semibold text-foreground mb-3">
                  Why this product
                </h3>
                <ul className="space-y-2">
                  {fund.whyInvest.map((reason, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-muted-foreground"
                    >
                      <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Performance Chart */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-foreground">
                    Performance
                  </h3>
                  <div className="flex gap-2">
                    {["YTD", "1Y", "Max"].map((period) => (
                      <button
                        key={period}
                        onClick={() => setPerformancePeriod(period)}
                        className={`px-3 py-1 text-xs rounded transition-colors ${
                          performancePeriod === period
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted/50 text-muted-foreground hover:bg-muted"
                        }`}
                      >
                        {period}
                      </button>
                    ))}
                  </div>
                </div>

                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={fund.performance}>
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 12 }}
                      stroke="#94a3b8"
                    />
                    <YAxis
                      tick={{ fontSize: 12 }}
                      stroke="#94a3b8"
                      domain={["auto", "auto"]}
                    />
                    <RechartsTooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="nav"
                      stroke={categoryStyle.accent}
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>

                {fund.stats.benchmark && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Benchmark: {fund.stats.benchmark}
                  </p>
                )}
              </div>
            </div>

            {/* Strategy Section */}
            <div
              id="strategy"
              className="bg-card rounded-2xl p-6 border border-border"
            >
              <h2 className="text-xl font-semibold text-foreground mb-4">
                Strategy
              </h2>

              <div className="prose prose-sm max-w-none mb-6">
                <p className="text-muted-foreground">{fund.strategy}</p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3">
                  Where yield comes from
                </h3>
                <ul className="space-y-2">
                  {fund.yieldSources.map((source, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-muted-foreground"
                    >
                      <span className="text-primary mt-0.5">•</span>
                      <span>{source}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Risks Section */}
            <div
              id="risks"
              className="bg-card rounded-2xl p-6 border border-border"
            >
              <h2 className="text-xl font-semibold text-foreground mb-4">
                Risks
              </h2>

              <div className="grid gap-4">
                {fund.risks.map((risk, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-4 p-4 bg-muted/20 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-semibold text-foreground">
                          {risk.type}
                        </h3>
                        <span
                          className={`px-2 py-0.5 text-xs rounded-full ${
                            risk.level === "Low"
                              ? "bg-emerald-100 text-emerald-700"
                              : risk.level === "Medium"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {risk.level}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {risk.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Fees Section */}
            <div
              id="fees"
              className="bg-card rounded-2xl p-6 border border-border"
            >
              <h2 className="text-xl font-semibold text-foreground mb-4">
                Fees
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 text-sm font-semibold text-foreground">
                        Fee Type
                      </th>
                      <th className="text-left py-3 text-sm font-semibold text-foreground">
                        Rate
                      </th>
                      <th className="text-left py-3 text-sm font-semibold text-foreground">
                        Annual Cost ($100k)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border">
                      <td className="py-3 text-sm text-foreground">
                        Management
                      </td>
                      <td className="py-3 text-sm text-muted-foreground">
                        {fund.fees.management}
                      </td>
                      <td className="py-3 text-sm text-muted-foreground">
                        ${(parseFloat(fund.fees.management) * 1000).toFixed(0)}
                      </td>
                    </tr>
                    {fund.fees.performance && (
                      <tr className="border-b border-border">
                        <td className="py-3 text-sm text-foreground">
                          Performance
                        </td>
                        <td className="py-3 text-sm text-muted-foreground">
                          {fund.fees.performance}
                        </td>
                        <td className="py-3 text-sm text-muted-foreground">
                          Variable
                        </td>
                      </tr>
                    )}
                    {fund.fees.admin && (
                      <tr className="border-b border-border">
                        <td className="py-3 text-sm text-foreground">
                          Administration
                        </td>
                        <td className="py-3 text-sm text-muted-foreground">
                          {fund.fees.admin}
                        </td>
                        <td className="py-3 text-sm text-muted-foreground">
                          ${(parseFloat(fund.fees.admin) * 1000).toFixed(0)}
                        </td>
                      </tr>
                    )}
                    <tr>
                      <td className="py-3 text-sm text-foreground">
                        Redemption
                      </td>
                      <td className="py-3 text-sm text-muted-foreground">
                        {fund.fees.redemption || "None"}
                      </td>
                      <td className="py-3 text-sm text-muted-foreground">$0</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="text-xs text-muted-foreground mt-4">
                Fees are accrued daily and deducted from NAV. Performance fees
                apply only to returns above the benchmark.
              </p>
            </div>

            {/* Holdings Section */}
            <div
              id="holdings"
              className="bg-card rounded-2xl p-6 border border-border"
            >
              <h2 className="text-xl font-semibold text-foreground mb-4">
                Holdings / Exposures
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={fund.exposures}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="pct"
                      >
                        {fund.exposures.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="flex flex-col justify-center space-y-3">
                  {fund.exposures.map((exposure, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: exposure.color }}
                        ></div>
                        <span className="text-sm text-foreground">
                          {exposure.label}
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-foreground">
                        {exposure.pct}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Documents Section */}
            <div
              id="docs"
              className="bg-card rounded-2xl p-6 border border-border"
            >
              <h2 className="text-xl font-semibold text-foreground mb-4">
                Documents
              </h2>

              <div className="space-y-2">
                {fund.documents.map((doc, i) => (
                  <a
                    key={i}
                    href={doc.url}
                    className="flex items-center justify-between p-3 hover:bg-muted/20 rounded-lg transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <Download className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-foreground group-hover:text-primary">
                        {doc.label}
                      </span>
                    </div>
                    <ExternalLink className="w-4 h-4 text-muted-foreground" />
                  </a>
                ))}
              </div>

              {fund.contract && (
                <div className="mt-4 pt-4 border-t border-border">
                  <a
                    href={fund.contract.explorerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-primary hover:underline"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View contract on Etherscan: {fund.contract.address}
                  </a>
                </div>
              )}
            </div>

            {/* Activity Section */}
            <div
              id="activity"
              className="bg-card rounded-2xl p-6 border border-border"
            >
              <h2 className="text-xl font-semibold text-foreground mb-4">
                Activity
              </h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        All systems operational
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Last checked: 2 minutes ago
                      </p>
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 text-xs font-semibold text-muted-foreground">
                          Date
                        </th>
                        <th className="text-left py-3 text-xs font-semibold text-muted-foreground">
                          Type
                        </th>
                        <th className="text-left py-3 text-xs font-semibold text-muted-foreground">
                          Amount
                        </th>
                        <th className="text-left py-3 text-xs font-semibold text-muted-foreground">
                          Tx
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        {
                          date: "Nov 15, 2024",
                          type: "Deposit",
                          amount: "$50,000",
                          tx: "0x12...34",
                        },
                        {
                          date: "Nov 14, 2024",
                          type: "Withdrawal",
                          amount: "$25,000",
                          tx: "0x56...78",
                        },
                        {
                          date: "Nov 13, 2024",
                          type: "Deposit",
                          amount: "$100,000",
                          tx: "0x9a...bc",
                        },
                      ].map((activity, i) => (
                        <tr key={i} className="border-b border-border">
                          <td className="py-3 text-sm text-muted-foreground">
                            {activity.date}
                          </td>
                          <td className="py-3 text-sm text-foreground">
                            {activity.type}
                          </td>
                          <td className="py-3 text-sm text-foreground">
                            {activity.amount}
                          </td>
                          <td className="py-3 text-sm">
                            <a
                              href="#"
                              className="text-primary hover:underline"
                            >
                              {activity.tx}
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Sticky Invest Panel */}
          <div className="lg:sticky lg:top-6 h-fit">
            <div className="bg-card rounded-2xl border border-border p-5 space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">
                  Invest in {fund.name}
                </h3>
                <span
                  className="px-2 py-0.5 text-xs font-normal rounded-full"
                  style={{
                    backgroundColor: categoryStyle.bg,
                    color: categoryStyle.accent,
                  }}
                >
                  {categoryStyle.label}
                </span>
              </div>

              {/* Stepper Indicators */}
              <div className="flex items-center gap-2">
                {["connect", "configure", "review", "submit"].map(
                  (step, index) => (
                    <div
                      key={step}
                      className={`flex-1 h-1.5 rounded-full transition-colors ${
                        investStep === step
                          ? "bg-primary"
                          : [
                              "connect",
                              "configure",
                              "review",
                              "submit",
                            ].indexOf(investStep) >
                            [
                              "connect",
                              "configure",
                              "review",
                              "submit",
                            ].indexOf(step)
                          ? "bg-primary/30"
                          : "bg-muted"
                      }`}
                    ></div>
                  )
                )}
              </div>

              {/* Step Content */}
              {investStep === "connect" && (
                <div className="space-y-4">
                  <div className="p-4 bg-muted/20 rounded-lg">
                    <p className="text-sm font-semibold text-foreground mb-1">
                      Connected Wallet
                    </p>
                    <p className="text-xs text-muted-foreground">
                      0x1234...5678
                    </p>
                  </div>
                  <button
                    onClick={() => setInvestStep("configure")}
                    className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-normal hover:bg-primary/90 transition-colors"
                  >
                    Continue
                  </button>
                </div>
              )}

              {investStep === "configure" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-normal text-muted-foreground mb-2">
                      Amount
                    </label>
                    <input
                      type="number"
                      value={investAmount}
                      onChange={(e) => setInvestAmount(e.target.value)}
                      placeholder="Enter amount"
                      className="w-full p-3 border border-border rounded-lg text-sm font-normal text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Min: $1,000 • Available: $100,000
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-normal text-muted-foreground mb-2">
                      Currency
                    </label>
                    <select className="w-full p-3 border border-border rounded-lg text-sm font-normal text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20">
                      <option>{fund.stats.depositAsset}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-normal text-muted-foreground mb-2">
                      Network
                    </label>
                    <select
                      disabled
                      className="w-full p-3 border border-border rounded-lg text-sm font-normal text-foreground bg-muted/20"
                    >
                      <option>{fund.stats.network}</option>
                    </select>
                  </div>

                  <div className="p-3 bg-muted/20 rounded-lg space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Est. APY</span>
                      <span className="text-foreground font-semibold">
                        {fund.stats.apy}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Est. Fees</span>
                      <span className="text-foreground">
                        ~$
                        {investAmount
                          ? (parseFloat(investAmount) * 0.005).toFixed(2)
                          : "0.00"}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => setInvestStep("review")}
                    disabled={!investAmount || parseFloat(investAmount) < 1000}
                    className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-normal hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Review
                  </button>
                </div>
              )}

              {investStep === "review" && (
                <div className="space-y-4">
                  <div className="space-y-3 p-4 bg-muted/20 rounded-lg">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Amount</span>
                      <span className="text-foreground font-semibold">
                        ${investAmount} {fund.stats.depositAsset}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Fees</span>
                      <span className="text-foreground">
                        ~${(parseFloat(investAmount) * 0.005).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Expected shares
                      </span>
                      <span className="text-foreground">
                        {(parseFloat(investAmount) * 0.995).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="flex items-start gap-2 text-xs text-muted-foreground">
                      <input
                        type="checkbox"
                        checked={agreedToEligibility}
                        onChange={(e) =>
                          setAgreedToEligibility(e.target.checked)
                        }
                        className="mt-0.5"
                      />
                      <span>
                        I am eligible to invest in this fund and meet all
                        requirements
                      </span>
                    </label>
                    <label className="flex items-start gap-2 text-xs text-muted-foreground">
                      <input
                        type="checkbox"
                        checked={agreedToTerms}
                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                        className="mt-0.5"
                      />
                      <span>
                        I have read and agree to the fund documents and terms
                      </span>
                    </label>
                  </div>

                  <button
                    onClick={handleInvestSubmit}
                    disabled={
                      !agreedToTerms || !agreedToEligibility || isSubmitting
                    }
                    className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-normal hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Waiting for wallet...
                      </>
                    ) : (
                      "Submit"
                    )}
                  </button>

                  <button
                    onClick={() => setInvestStep("configure")}
                    className="w-full py-2 text-sm text-muted-foreground hover:text-foreground"
                  >
                    Back
                  </button>
                </div>
              )}

              {investStep === "submit" && submitStatus === "success" && (
                <div className="space-y-4 text-center py-4">
                  <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                  <div>
                    <h4 className="text-lg font-semibold text-foreground mb-1">
                      Investment Successful!
                    </h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Your investment of ${investAmount}{" "}
                      {fund.stats.depositAsset} has been processed
                    </p>
                    <a
                      href="#"
                      className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                    >
                      View transaction
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  <div className="space-y-2">
                    <button
                      onClick={() => router.push("/")}
                      className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-normal hover:bg-primary/90 transition-colors"
                    >
                      View Position
                    </button>
                    <button
                      onClick={() => {
                        setInvestStep("connect");
                        setInvestAmount("");
                        setSubmitStatus("idle");
                        setAgreedToTerms(false);
                        setAgreedToEligibility(false);
                      }}
                      className="w-full py-2 text-sm text-muted-foreground hover:text-foreground"
                    >
                      Make another investment
                    </button>
                  </div>
                </div>
              )}

              {/* Compliance Footer */}
              <div className="pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  Investment involves risks. Please read all fund documents
                  before investing.{" "}
                  <a href="#" className="text-primary hover:underline">
                    View disclosures
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
