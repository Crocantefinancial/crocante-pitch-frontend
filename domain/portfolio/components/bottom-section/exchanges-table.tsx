import { Badge, Skeleton, Table } from "@/components/index";
import { usePortfolioData } from "@/domain/portfolio/hooks/use-portfolio-data";

export default function ExchangesTable() {
  const { exchangesData, isLoading } = usePortfolioData();

  if (isLoading || !exchangesData) {
    return <Skeleton lines={3} />;
  }

  return (
    <Table
      tableHeaders={[
        {
          id: "nameHeader",
          label: "Exchange",
          className: "text-left",
        },
        {
          id: "statusHeader",
          label: "Status",
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
      rows={exchangesData.map((exchange) => ({
        id: exchange.name,
        cells: [
          {
            id: "name",
            value: exchange.name,
            className: "text-left",
          },
          {
            id: "status",
            leftIcon: () => (
              <Badge
                label={exchange.status}
                variant={exchange.status === "Connected" ? "primary" : "accent"}
              />
            ),
            className: "text-left",
          },
          {
            id: "assets",
            value: exchange.assets.toString(),
            className: "text-left",
          },
          {
            id: "balance",
            value: exchange.balance,
            className: "text-left",
          },
          {
            id: "available",
            value: exchange.available,
            className: "text-left",
          },
          {
            id: "lastSync",
            value: exchange.lastSync,
            className: "text-left",
          },
        ],
      }))}
    />
  );
}
