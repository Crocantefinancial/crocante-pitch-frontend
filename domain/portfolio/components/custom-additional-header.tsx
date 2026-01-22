import { Button } from "@/components/index";
import { DEPOSIT_ICON, SEND_ICON, STAKE_ICON, SWAP_ICON } from "@/config/operation-icons";
import {
  DepositAction,
  SendAction,
  StakeAction,
  SwapAction,
} from "@/domain/portfolio/components";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { useModal } from "@/hooks/use-modal";
import clsx from "clsx";
import {
  ArrowUpDown,
  Eye,
  MenuIcon,
  XIcon,
} from "lucide-react";
import { useState } from "react";
import { createPortal } from "react-dom";

export default function CustomAdditionalHeader() {
  const isMobile = useIsMobile();
  const { isOpen: mobileMenuOpen, toggle: toggleMobileMenu } = useModal(
    false,
    {}
  );

  const [openSendModal, setOpenSendModal] = useState(false);
  const [openDepositModal, setOpenDepositModal] = useState(false);
  const [openSwapModal, setOpenSwapModal] = useState(false);
  const [openStakingModal, setOpenStakingModal] = useState(false);

  const menuItems = [
    /* {
      label: "Options",
      icon: <Eye className="h-4 w-auto" />,
      onClick: () => {},
      variant: "secondary",
    },
    {
      label: "Sort",
      icon: <ArrowUpDown className="h-4 w-auto" />,
      onClick: () => {},
      variant: "secondary",
    }, */
    {
      label: "Send",
      icon: <SEND_ICON className="h-4 w-auto" />,
      onClick: () => setOpenSendModal(true),
      variant: "primary",
    },
    {
      label: "Deposit",
      icon: <DEPOSIT_ICON className="h-4 w-auto" />,
      onClick: () => setOpenDepositModal(true),
      variant: "primary",
    },
    {
      label: "Swap",
      icon: <SWAP_ICON className="h-4 w-auto" />,
      onClick: () => setOpenSwapModal(true),
      variant: "primary",
    },
    {
      label: "Staking",
      icon: <STAKE_ICON className="h-4 w-auto" />,
      onClick: () => setOpenStakingModal(true),
      variant: "primary",
    },
  ];

  const menuContent = (
    <div className="fixed inset-0 z-[9999]">
      {/* full-screen backdrop (this is what blurs/dims the whole page) */}
      <div
        className="absolute inset-0 backdrop-blur-[2px]"
        onClick={() => toggleMobileMenu()}
      />

      {/* the menu panel */}
      <div
        className="absolute top-16 right-4 bg-white border border-secondary rounded-lg shadow-lg min-w-[200px]"
        onClick={(e) => e.stopPropagation()}
      >
        <nav className="flex flex-col p-4 space-y-2">
          {menuItems.map((it) => (
            <span
              key={it.label}
              className="flex items-center gap-2 cursor-pointer hover:bg-disabled p-2 rounded-lg"
              onClick={() => {
                toggleMobileMenu();
                it.onClick();
              }}
            >
              {it.icon}
              {it.label}
            </span>
          ))}
        </nav>
      </div>
    </div>
  );

  return (
    <div className="relative flex items-center gap-[clamp(0rem,4vw-1rem,0.75rem)]">
      {isMobile && (
        <Button
          onClick={() => toggleMobileMenu()}
          className={clsx("p-2", mobileMenuOpen && "relative z-[10000]")}
        >
          {mobileMenuOpen ? <XIcon size={16} /> : <MenuIcon size={16} />}
        </Button>
      )}
      {/* Mobile Navigation Menu */}
      {isMobile && mobileMenuOpen && createPortal(menuContent, document.body)}

      {!isMobile && (
        <>
          {menuItems.map((it) => (
            <Button
              key={it.label}
              variant={it.variant as any}
              className="flex flex-row"
              onClick={it.onClick}
            >
              {it.icon}
              {it.label}
            </Button>
          ))}
        </>
      )}

      <SendAction open={openSendModal} setOpen={setOpenSendModal} />

      <DepositAction open={openDepositModal} setOpen={setOpenDepositModal} />

      <SwapAction open={openSwapModal} setOpen={setOpenSwapModal} />

      <StakeAction open={openStakingModal} setOpen={setOpenStakingModal} />
    </div>
  );
}
