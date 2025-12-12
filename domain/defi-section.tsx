import { TrendingUp } from "lucide-react"

const DEFI_POSITIONS = [
  { protocol: "Aave", asset: "USDC", amount: "500,000", apy: "8.2%", tvl: "$12.5B" },
  { protocol: "Curve", asset: "USDC-USDT", amount: "300,000", apy: "6.5%", tvl: "$5.2B" },
  { protocol: "Lido", asset: "ETH", amount: "125 ETH", apy: "3.8%", tvl: "$28.3B" },
  { protocol: "Compound", asset: "DAI", amount: "250,000", apy: "5.1%", tvl: "$3.8B" },
]

const DEFI_STATS = [
  { label: "Total Value Locked", value: "$8.45M", change: "+15.2%" },
  { label: "Monthly Yield", value: "$54,300", change: "+8.7%" },
  { label: "Active Protocols", value: "4", change: "0%" },
  { label: "Yield Average", value: "5.9%", change: "+2.1%" },
]

export function DeFiSection() {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <TrendingUp className="w-8 h-8 text-primary" />
        <h2 className="text-2xl font-semibold text-neutral-900">DeFi Protocols</h2>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {DEFI_STATS.map((stat) => (
          <div key={stat.label} className="bg-white rounded-lg p-6">
            <p className="text-neutral-600 text-sm font-normal mb-2">{stat.label}</p>
            <p className="text-2xl font-semibold text-neutral-900">{stat.value}</p>
            <p className={`text-xs mt-2 ${stat.change.includes("+") ? "text-emerald-600" : "text-neutral-600"}`}>
              {stat.change}
            </p>
          </div>
        ))}
      </div>

      {/* Active Positions */}
      <div>
        <h3 className="text-lg font-normal text-neutral-900 mb-4">Active Positions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {DEFI_POSITIONS.map((position, index) => (
            <div key={index} className="bg-white rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm font-normal text-primary">{position.protocol}</p>
                  <p className="text-sm text-neutral-600 mt-1">{position.asset}</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-normal bg-primary/10 text-primary">
                  {position.apy}
                </span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-600">Position Size:</span>
                  <span className="font-normal text-neutral-900">{position.amount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Protocol TVL:</span>
                  <span className="font-normal text-neutral-900">{position.tvl}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
