import { BarChart3 } from 'lucide-react'

const RECENT_TRADES = [
  {
    id: "TRD-2024-001",
    pair: "BTC/USDC",
    type: "BUY",
    amount: "2.5 BTC",
    price: "$40,250",
    total: "$100,625",
    date: "Nov 8, 2024",
    status: "Completed",
  },
  {
    id: "TRD-2024-002",
    pair: "ETH/USDC",
    type: "SELL",
    amount: "50 ETH",
    price: "$2,150",
    total: "$107,500",
    date: "Nov 7, 2024",
    status: "Completed",
  },
  {
    id: "TRD-2024-003",
    pair: "BTC/EUR",
    type: "BUY",
    amount: "1.2 BTC",
    price: "$39,800",
    total: "$47,760",
    date: "Nov 6, 2024",
    status: "Completed",
  },
  {
    id: "TRD-2024-004",
    pair: "ETH/USDC",
    type: "BUY",
    amount: "100 ETH",
    price: "$2,145",
    total: "$214,500",
    date: "Nov 5, 2024",
    status: "Pending",
  },
]

export function TradeSection() {
  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg p-12 text-center">
        <p className="text-neutral-500 text-lg font-normal">Trade</p>
        <p className="text-neutral-400 text-sm mt-2">Coming soon</p>
      </div>
    </div>
  )
}
