import {
  AssetAllocation,
  AssetBreakdown,
  Header,
  TabsSection,
} from "@/domain/portfolio/components";

export default function Portfolio() {
  return (
    <div className="space-y-8">
      {/* Consolidated View */}
      <div className="bg-card rounded-lg p-6">
        <Header />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Section - Asset breakdown */}
          <AssetBreakdown />

          {/* Right Section – Asset Allocation Pie Chart */}
          <AssetAllocation />
        </div>
      </div>

      {/* Tabs and Table */}
      <TabsSection />
    </div>
  );
}
