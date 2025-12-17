import { Button } from "@/components/index";
import { SendModal } from "@/domain/portfolio/components";
import {
  TokenType,
  usePortfolioData,
} from "@/domain/portfolio/hooks/use-portfolio-data";
import { useModal } from "@/hooks/use-modal";
import { useSelector } from "@/hooks/use-selector";
import { ArrowUpDown, Eye, Send } from "lucide-react";

export default function CustomAdditionalHeader() {
  const { tokens } = usePortfolioData();

  const {
    selectedRow,
    reset: resetSelector,
    change: changeTokenSelection,
  } = useSelector<TokenType>(tokens || {}, 0, {});

  const {
    isOpen: sendModalOpen,
    setIsOpen: setSendModalOpen,
    open: openSendModal,
  } = useModal(false, { onOpen: resetSelector });

  const handleSend = () => {
    console.log("SEND", selectedRow);
  };

  if (!tokens) return null;

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
      <Button onClick={openSendModal} variant="primary">
        <Send className="w-4 h-4" />
        Send
      </Button>

      {sendModalOpen && tokens && (
        <SendModal
          sendModalOpen={sendModalOpen}
          setSendModalOpen={setSendModalOpen}
          handleSend={handleSend}
          assetSelector={{
            selectedIndex: selectedRow
              ? Object.keys(tokens).indexOf(selectedRow.symbol)
              : 0,
            onOptionSelected: (e: React.ChangeEvent<HTMLSelectElement>) =>
              changeTokenSelection(e.target.value),
            options: Object.keys(tokens).map((token) => ({
              label: tokens[token as keyof typeof tokens].symbol,
              value: token,
              icon: tokens[token as keyof typeof tokens].icon,
            })),
          }}
        />
      )}
    </div>
  );
}
