import { Button } from "@/components/index";
import { ArrowUpDown, Lock, Send } from "lucide-react";

interface SendModalProps {
  sendModalOpen: boolean;
  setSendModalOpen: (open: boolean) => void;
}

export default function SendModal({
  sendModalOpen,
  setSendModalOpen,
}: SendModalProps) {
  return (
    sendModalOpen && (
      <div
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        onClick={() => setSendModalOpen(false)}
      >
        <div
          className="bg-white rounded-lg w-full max-w-md p-6 shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Send className="w-5 h-5 text-muted-foreground" />
              <h2 className="text-lg font-semibold text-foreground">Send</h2>
            </div>
            <button
              onClick={() => setSendModalOpen(false)}
              className="text-muted-foreground hover:text-foreground"
            >
              ×
            </button>
          </div>

          <div className="space-y-4">
            {/* Asset Field */}
            <div>
              <label className="block text-sm font-normal text-muted-foreground mb-2">
                Asset
              </label>
              <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-gray-300 transition-colors">
                <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center">
                  <span className="text-xs font-semibold text-purple-600">
                    E
                  </span>
                </div>
                <span className="text-sm font-normal text-foreground flex-1">
                  ETH
                </span>
                <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>

            {/* From Field */}
            <div>
              <label className="block text-sm font-normal text-muted-foreground mb-2">
                From
              </label>
              <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-gray-300 transition-colors">
                <Lock className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm font-normal text-foreground flex-1">
                  Omnibus Wallet
                </span>
                <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>

            {/* To Field */}
            <div>
              <label className="block text-sm font-normal text-muted-foreground mb-2">
                To
              </label>
              <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-gray-300 transition-colors">
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-xs font-semibold text-blue-600">K</span>
                </div>
                <span className="text-sm font-normal text-foreground flex-1">
                  Kraken Main Account
                </span>
                <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>

            {/* Quantity Field */}
            <div>
              <label className="block text-sm font-normal text-muted-foreground mb-2">
                Quantity
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Equivalent: 25,000 in USD"
                  className="w-full p-3 pr-20 border border-gray-200 rounded-lg text-sm font-normal text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-normal text-foreground">
                  5.35 ETH
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-1.5">
                Available: 25,000.5 ETH
              </p>
            </div>

            {/* Send Button */}
            <Button variant="primary" className="w-full">
              Send
            </Button>
          </div>
        </div>
      </div>
    )
  );
}
