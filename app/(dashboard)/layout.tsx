"use client";

import { Shell } from "@/components/index";
import { CustomHeaderProvider } from "@/context/custom-header-context";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { useModal } from "@/hooks/use-modal";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const [customAdditionalHeader, setCustomAdditionalHeader] =
    useState<React.ReactNode>(<></>);

  const { isOpen: sidebarOpen, setIsOpen: setSidebarOpen } = useModal(true);
  const isMobile = useIsMobile();
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [isMobile]);

  // Extract activeMenu from pathname (e.g., /portfolio -> portfolio)
  const activeMenu = pathname?.split("/").filter(Boolean)[0] || "portfolio";

  // Reset custom header when navigating away from portfolio/settings
  useEffect(() => {
    if (!(activeMenu === "portfolio" || activeMenu === "settings")) {
      setCustomAdditionalHeader(<></>);
    }
  }, [activeMenu]);

  return (
    <CustomHeaderProvider setCustomAdditionalHeader={setCustomAdditionalHeader}>
      <Shell
        activeMenu={activeMenu}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        customAdditionalHeader={customAdditionalHeader}
      >
        {children}
      </Shell>
    </CustomHeaderProvider>
  );
}
