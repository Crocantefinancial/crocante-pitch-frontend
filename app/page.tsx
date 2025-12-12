"use client";

import { Shell } from "@/components/index";
import { CreditSection } from "@/domain/credit-section";
import { CustodySection } from "@/domain/custody-section";
import { GovernanceSection } from "@/domain/governance-section";
import { InvestSection } from "@/domain/invest-section";
import { PortfolioSection } from "@/domain/portfolio-section";
import { ReportsSection } from "@/domain/reports-section";
import { SettingsSection } from "@/domain/settings-section";
import { TradeSection } from "@/domain/trade-section";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState("portfolio");
  const [content, setContent] = useState<React.ReactNode>(<></>);
  const [customAdditionalHeader, setCustomAdditionalHeader] =
    useState<React.ReactNode>(<></>);

  useEffect(() => {
    if (!(activeMenu === "portfolio" || activeMenu === "settings")) {
      setCustomAdditionalHeader(<></>);
    }

    switch (activeMenu) {
      case "portfolio":
        setContent(
          <PortfolioSection
            setCustomAdditionalHeader={setCustomAdditionalHeader}
          />
        );
        break;
      case "custody":
        setContent(<CustodySection />);
        break;
      case "invest":
        setContent(<InvestSection />);
        break;
      case "credit":
        setContent(<CreditSection />);
        break;
      case "governance":
        setContent(<GovernanceSection />);
        break;
      case "trade":
        setContent(<TradeSection />);
        break;
      case "settings":
        setContent(
          <SettingsSection
            setCustomAdditionalHeader={setCustomAdditionalHeader}
          />
        );
        break;
      case "reports":
        setContent(<ReportsSection />);
        break;
      case "rfq-manager":
        setContent(
          <div className="bg-white rounded-lg p-12 text-center">
            <p className="text-neutral-500 text-lg font-normal">RFQ Manager</p>
            <p className="text-neutral-400 text-sm mt-2">Coming soon</p>
          </div>
        );
        break;
    }
  }, [activeMenu]);

  return (
    <Shell
      activeMenu={activeMenu}
      setActiveMenu={setActiveMenu}
      sidebarOpen={sidebarOpen}
      setSidebarOpen={setSidebarOpen}
      customAdditionalHeader={customAdditionalHeader}
    >
      {content}
    </Shell>
  );
}
