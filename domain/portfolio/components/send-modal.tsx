import { SelectorProps } from "@/components/core/select";
import { Button, Modal, Select } from "@/components/index";
import { Send } from "lucide-react";

interface SendModalProps {
  sendModalOpen: boolean;
  setSendModalOpen: (open: boolean) => void;
  handleSend: () => void;
  assetSelector: SelectorProps;
  fromSelector: SelectorProps;
  toSelector: SelectorProps;
}

export default function SendModal({
  sendModalOpen,
  setSendModalOpen,
  handleSend,
  assetSelector,
  fromSelector,
  toSelector,
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
        <Select className="w-full" label="Asset" properties={assetSelector} />

        {/* From Field */}
        <Select className="w-full" label="From" properties={fromSelector} />

        {/* To Field */}
        <Select className="w-full" label="To" properties={toSelector} />

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
