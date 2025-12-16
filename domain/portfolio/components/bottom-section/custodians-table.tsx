import { Skeleton, Table } from "@/components/index";
import { usePortfolioData } from "@/domain/portfolio/hooks/use-portfolio-data";

export default function CustodiansTable() {
  const { custodiansData, isLoading } = usePortfolioData();

  if (isLoading || !custodiansData) {
    return <Skeleton lines={3} />;
  }

  return (
    <Table
      tableHeaders={[
        {
          id: "nameHeader",
          label: "Custodian",
          className: "text-left",
        },
        {
          id: "serviceHeader",
          label: "Service",
          className: "text-left",
        },
        {
          id: "assetsHeader",
          label: "Assets",
          className: "text-left",
        },
        {
          id: "balanceHeader",
          label: "Balance",
          className: "text-left",
        },
        {
          id: "availableHeader",
          label: "Available",
          className: "text-left",
        },
        {
          id: "lastSyncHeader",
          label: "Last Sync",
          className: "text-left",
        },
      ]}
      rows={custodiansData.map((custodian) => ({
        id: custodian.name,
        cells: [
          {
            id: "name",
            value: custodian.name,
            className: "text-left",
          },
          {
            id: "service",
            value: custodian.service,
            className: "text-left",
          },
          {
            id: "assets",
            value: custodian.assets.toString(),
            className: "text-left",
          },
          {
            id: "balance",
            value: custodian.balance,
            className: "text-left",
          },
          {
            id: "available",
            value: custodian.available,
            className: "text-left",
          },
          {
            id: "lastSync",
            value: custodian.lastSync,
            className: "text-left",
          },
        ],
      }))}
    />
  );
}
