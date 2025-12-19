import { Badge, Skeleton, Table } from "@/components/index";
import { usePortfolioData } from "@/domain/portfolio/hooks/use-portfolio-data";

export default function OTCDesksTable() {
  const { otcDesksData, isLoading } = usePortfolioData();

  if (isLoading || !otcDesksData) {
    return <Skeleton lines={3} />;
  }

  return (
    <Table
      tableHeaders={[
        {
          id: "nameHeader",
          label: "OTC Desk",
          className: "text-left",
        },
        {
          id: "statusHeader",
          label: "Status",
          className: "text-left",
        },
        {
          id: "volume30dHeader",
          label: "30d Volume",
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
          id: "lastTradeHeader",
          label: "Last Trade",
          className: "text-left",
        },
      ]}
      rows={otcDesksData.map((desk) => ({
        id: desk.name,
        cells: [
          {
            id: "name",
            value: desk.name,
            className: "text-left",
          },
          {
            id: "status",
            leftIcon: () => (
              <Badge
                label={desk.status}
                variant={desk.status === "Active" ? "accent" : "primary"}
              />
            ),
            className: "text-left",
          },
          {
            id: "volume30d",
            value: desk.volume30d,
            className: "text-left",
          },
          {
            id: "balance",
            value: desk.balance,
            className: "text-left",
          },
          {
            id: "available",
            value: desk.available,
            className: "text-left",
          },
          {
            id: "lastTrade",
            value: desk.lastTrade,
            className: "text-left",
          },
        ],
      }))}
    />
  );
}
