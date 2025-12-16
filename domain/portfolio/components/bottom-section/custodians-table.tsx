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
/* 

(
          <table className="w-full">
            <thead>
              <tr>
                <th className="px-6 py-4 text-left text-sm font-normal text-muted-foreground">
                  Custodian
                </th>
                <th className="px-6 py-4 text-left text-sm font-normal text-muted-foreground">
                  Service
                </th>
                <th className="px-6 py-4 text-left text-sm font-normal text-muted-foreground">
                  Assets
                </th>
                <th className="px-6 py-4 text-left text-sm font-normal text-muted-foreground">
                  Balance
                </th>
                <th className="px-6 py-4 text-left text-sm font-normal text-muted-foreground">
                  Available
                </th>
                <th className="px-6 py-4 text-left text-sm font-normal text-muted-foreground">
                  Last Sync
                </th>
              </tr>
            </thead>
            <tbody>
              {CUSTODIANS_DATA.map((custodian, index) => (
                <tr
                  key={index}
                  className="hover:bg-muted/5 transition-colors cursor-pointer"
                >
                  <td className="px-6 py-4 text-sm font-normal text-foreground">
                    {custodian.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {custodian.service}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {custodian.assets}
                  </td>
                  <td className="px-6 py-4 text-sm font-normal text-foreground">
                    {custodian.balance}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {custodian.available}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {custodian.lastSync}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        );

*/
