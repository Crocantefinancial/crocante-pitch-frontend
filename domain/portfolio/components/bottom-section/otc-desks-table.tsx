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
/* 

(
          <table className="w-full">
            <thead>
              <tr>
                <th className="px-6 py-4 text-left text-sm font-normal text-muted-foreground">
                  OTC Desk
                </th>
                <th className="px-6 py-4 text-left text-sm font-normal text-muted-foreground">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-normal text-muted-foreground">
                  30d Volume
                </th>
                <th className="px-6 py-4 text-left text-sm font-normal text-muted-foreground">
                  Balance
                </th>
                <th className="px-6 py-4 text-left text-sm font-normal text-muted-foreground">
                  Available
                </th>
                <th className="px-6 py-4 text-left text-sm font-normal text-muted-foreground">
                  Last Trade
                </th>
              </tr>
            </thead>
            <tbody>
              {OTC_DESKS_DATA.map((desk, index) => (
                <tr
                  key={index}
                  className="hover:bg-muted/5 transition-colors cursor-pointer"
                >
                  <td className="px-6 py-4 text-sm font-normal text-foreground">
                    {desk.name}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent/10 text-accent text-xs font-normal">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent"></div>
                      {desk.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {desk.volume30d}
                  </td>
                  <td className="px-6 py-4 text-sm font-normal text-foreground">
                    {desk.balance}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {desk.available}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {desk.lastTrade}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        );

*/
