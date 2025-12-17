import { SelectOption } from "@/components/core/select";
import { Button, Modal, Select } from "@/components/index";
import { ArrowUpDown, Lock, Send } from "lucide-react";

interface SelectorProps {
  selectedIndex: number;
  onOptionSelected: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: Array<SelectOption>;
}
interface SendModalProps {
  sendModalOpen: boolean;
  setSendModalOpen: (open: boolean) => void;
  handleSend: () => void;
  assetSelector: SelectorProps;
}

export default function SendModal({
  sendModalOpen,
  setSendModalOpen,
  handleSend,
  assetSelector,
}: SendModalProps) {
  return (
    <Modal
      open={sendModalOpen}
      onClose={() => setSendModalOpen(false)}
      icon={<Send className="w-5 h-5 text-muted-foreground" />}
      title="Send"
      actions={() => (
        <Button
          variant="primary"
          className="w-full justify-center"
          onClick={() => {
            handleSend();
            setSendModalOpen(false);
          }}
        >
          Send
        </Button>
      )}
    >
      <div className="space-y-4">
        {/* Asset Field */}
        <Select
          className="w-full"
          label="Asset"
          onChange={assetSelector.onOptionSelected}
          selectedIndex={assetSelector.selectedIndex}
          options={assetSelector.options}
        />

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
      </div>
    </Modal>
  );
}
