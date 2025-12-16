import { Button } from "@/components/index";
import { SendModal } from "@/domain/portfolio/components";
import { useModal } from "@/hooks/use-modal";
import { ArrowUpDown, Eye, Send } from "lucide-react";

export default function CustomAdditionalHeader() {
  const { isOpen: sendModalOpen, setIsOpen: setSendModalOpen } =
    useModal(false);

  return (
    <div className="flex items-center gap-3">
      <Button variant="secondary">
        <Eye className="w-4 h-4" />
        View Options
      </Button>
      <Button variant="secondary">
        <ArrowUpDown className="w-4 h-4" />
        Sort
      </Button>
      <Button onClick={() => setSendModalOpen(true)} variant="primary">
        <Send className="w-4 h-4" />
        Send
      </Button>

      {sendModalOpen && (
        <SendModal
          sendModalOpen={sendModalOpen}
          setSendModalOpen={setSendModalOpen}
        />
      )}
    </div>
  );
}
