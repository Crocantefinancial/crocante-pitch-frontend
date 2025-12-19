import { Skeleton, Table } from "@/components/index";
import { usePortfolioData } from "@/domain/portfolio/hooks/use-portfolio-data";

export default function BanksTable() {
  const { banksData, isLoading } = usePortfolioData();

  if (isLoading || !banksData) {
    return <Skeleton lines={3} />;
  }

  return (
    <Table
      tableHeaders={[
        {
          id: "nameHeader",
          label: "Bank",
          className: "text-left",
        },
        {
          id: "accountTypeHeader",
          label: "Account Type",
          className: "text-left",
        },
        {
          id: "currencyHeader",
          label: "Currency",
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
      rows={banksData.map((bank) => ({
        id: bank.name,
        cells: [
          {
            id: "name",
            value: bank.name,
            className: "text-left",
          },
          {
            id: "accountType",
            value: bank.accountType,
            className: "text-left",
          },
          {
            id: "currency",
            value: bank.currency,
            className: "text-left",
          },
          {
            id: "balance",
            value: bank.balance,
            className: "text-left",
          },
          {
            id: "available",
            value: bank.available,
            className: "text-left",
          },
          {
            id: "lastSync",
            value: bank.lastSync,
            className: "text-left",
          },
        ],
      }))}
    />
  );
}
