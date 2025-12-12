"use client";

import { Header, MENU_ITEMS, NavBar } from "@/components/index";

interface ShellProps {
  children: React.ReactNode;
  activeMenu: string;
  setActiveMenu: (menu: string) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  customAdditionalHeader: React.ReactNode;
}
export default function Shell({
  children,
  activeMenu,
  setActiveMenu,
  sidebarOpen,
  setSidebarOpen,
  customAdditionalHeader,
}: ShellProps) {
  const getPageTitle = () => {
    const item = MENU_ITEMS.find((m) => m.id === activeMenu);
    return item?.label || "Dashboard";
  };

  return (
    <div className="flex h-screen bg-neutral-50">
      {/* Sidebar */}
      <NavBar
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header
          title={getPageTitle()}
          customAdditionalHeader={customAdditionalHeader}
        />

        {/* Content Area */}
        <div className="flex-1 overflow-auto">
          <div className="p-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
