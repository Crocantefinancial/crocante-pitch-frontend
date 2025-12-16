import { Button, Tabs } from "@/components/index";
import {
  BanksTable,
  CustodiansTable,
  ExchangesTable,
  InternalWalletsTable,
  OTCDesksTable,
} from "@/domain/portfolio/components";

import { useSelector } from "@/hooks/use-selector";
import { Plus } from "lucide-react";

enum TabValues {
  InternalWallets = "Internal Wallets",
  Exchanges = "Exchanges",
  Banks = "Banks",
  Custodians = "Custodians",
  OTCDesks = "OTC Desks",
}

export default function TabsSection() {
  type TabType = (typeof TabValues)[keyof typeof TabValues];
  const { selectedRow, change: changeTabSelection } = useSelector<TabType>(
    TabValues,
    0
  );

  const renderTable = () => {
    switch (selectedRow) {
      case TabValues.InternalWallets:
        return <InternalWalletsTable />;
      case TabValues.Exchanges:
        return <ExchangesTable />;
      case TabValues.Banks:
        return <BanksTable />;
      case TabValues.Custodians:
        return <CustodiansTable />;
      case TabValues.OTCDesks:
        return <OTCDesksTable />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-card rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <Tabs
          TabValues={TabValues}
          selectedRow={selectedRow}
          onChange={changeTabSelection}
        />
        <Button variant="primary" className="text-sm">
          <Plus className="w-4 h-4" />
          Add New
        </Button>
      </div>

      {/* Table */}
      <div className="bg-background rounded-lg overflow-hidden">
        {renderTable()}
      </div>
    </div>
  );
}
