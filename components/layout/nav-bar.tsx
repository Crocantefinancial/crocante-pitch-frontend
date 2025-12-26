import { Button } from "@/components/index";
import { useSession } from "@/context/session-provider";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { useLogout } from "@/services/hooks/mutations/use-logout";
import clsx from "clsx";
import {
  Activity,
  BarChart3,
  Building2,
  Cog,
  CreditCard,
  FileText,
  Lock,
  LogOut,
  Menu,
  Shield,
  Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";

export const MENU_ITEMS = [
  { icon: Building2, label: "Portfolio", id: "portfolio" },
  { icon: Lock, label: "Custody", id: "custody" },
  { icon: Zap, label: "Invest", id: "invest" },
  { icon: CreditCard, label: "Credit", id: "credit" },
  { icon: Shield, label: "Governance", id: "governance" },
  { icon: BarChart3, label: "Trade", id: "trade" },
  { icon: Activity, label: "Reports", id: "reports" },
  { icon: Cog, label: "Settings", id: "settings" },
  { icon: FileText, label: "RFQ Manager", id: "rfq-manager" },
];

interface NavBarProps {
  activeMenu: string;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export default function NavBar({
  activeMenu,
  sidebarOpen,
  setSidebarOpen,
}: NavBarProps) {
  const { user } = useSession();
  const router = useRouter();
  const isMobile = useIsMobile();
  const { mutate: logoutMutation } = useLogout();
  return (
    <div
      className={`${
        sidebarOpen ? "w-64" : "w-20"
      } bg-white border-r border-neutral-200 transition-all duration-300 flex flex-col`}
    >
      {/* Logo */}
      <div className="px-3 py-4 border-b border-neutral-200 flex items-center justify-center">
        {!isMobile && (
          <Button
            variant="secondary"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={clsx("flex items-center !px-0")}
          >
            <Menu className="w-4 h-4" />
          </Button>
        )}
        <div
          className={clsx(
            "flex items-center",
            !sidebarOpen && "justify-center w-full"
          )}
        >
          {sidebarOpen ? (
            <img
              src="/images/design-mode/1X_Full-Color.png"
              alt="Crocante Logo"
              className="h-8 w-auto"
            />
          ) : (
            <img
              src="/images/design-mode/1X_Logo.png"
              alt="Crocante Logo"
              className="h-6 w-auto"
            />
          )}
        </div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 overflow-y-auto py-4">
        {MENU_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeMenu === item.id;
          return (
            <Button
              key={item.id}
              variant="nav"
              isActive={isActive}
              onClick={() => {
                router.push(`/${item.id}`);
              }}
              className={clsx(!sidebarOpen && "px-0 justify-center")}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && <span>{item.label}</span>}
            </Button>
          );
        })}
      </nav>

      {/* User Info */}
      <div className="p-6 border-t border-neutral-200">
        <div
          className={clsx(
            "flex flex-col gap-3",
            !sidebarOpen ? "items-center" : "items-start"
          )}
        >
          <Button
            variant="outline"
            className={clsx(
              "w-full text-sm flex flex-row",
              !sidebarOpen ? "justify-center" : "justify-start gap-4"
            )}
            onClick={() => logoutMutation()}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span>Logout</span>}
          </Button>
          <div className="flex items-center gap-3 w-full">
            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center font-normal text-primary flex-shrink-0">
              {user?.avatar}
            </div>
            {sidebarOpen && (
              <div className="min-w-0">
                <p className="font-normal text-sm truncate text-neutral-900">
                  {user?.fullName}
                </p>
                <p className="text-xs text-neutral-500">{user?.email}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
