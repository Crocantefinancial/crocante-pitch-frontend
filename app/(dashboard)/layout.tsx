"use client";

import { Shell } from "@/components/index";
import { CustomHeaderProvider } from "@/context/custom-header-context";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [customAdditionalHeader, setCustomAdditionalHeader] =
    useState<React.ReactNode>(<></>);

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
