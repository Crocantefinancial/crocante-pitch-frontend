import { CreditCard } from "lucide-react"

export function CreditSection() {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <CreditCard className="w-8 h-8 text-primary" />
        <h2 className="text-2xl font-semibold text-neutral-900">Credit</h2>
      </div>

      <div className="bg-white rounded-lg p-12 text-center">
        <p className="text-neutral-500 text-lg font-normal">Credit Services</p>
        <p className="text-neutral-400 text-sm mt-2">Credit management features coming soon</p>
      </div>
    </div>
  )
}
