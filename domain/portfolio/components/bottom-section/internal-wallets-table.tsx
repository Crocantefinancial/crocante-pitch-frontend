import { Skeleton, Table } from "@/components/index";
import { usePortfolioData } from "@/domain/portfolio/hooks/use-portfolio-data";

export default function InternalWalletsTable() {
  const { internalWalletsData, isLoading } = usePortfolioData();

  if (isLoading || !internalWalletsData) {
    return <Skeleton lines={3} />;
  }

  return (
    <Table
      tableHeaders={[
        {
          id: "nameHeader",
          label: "Name",
          className: "text-left",
        },
        {
          id: "typeHeader",
          label: "Type",
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
          id: "lastActivityHeader",
          label: "Last Activity",
          className: "text-left",
        },
      ]}
      rows={internalWalletsData.map((wallet) => ({
        id: wallet.name,
        cells: [
          {
            id: "name",
            value: wallet.name,
            className: "text-left",
          },
          {
            id: "type",
            value: wallet.type,
            className: "text-left",
          },
          {
            id: "assets",
            value: wallet.assets.toString(),
            className: "text-left",
          },
          {
            id: "balance",
            value: wallet.balance,
            className: "text-left",
          },
          {
            id: "available",
            value: wallet.available,
            className: "text-left",
          },
          {
            id: "lastActivity",
            value: wallet.lastActivity,
            className: "text-left",
          },
        ],
      }))}
    />
  );
}
