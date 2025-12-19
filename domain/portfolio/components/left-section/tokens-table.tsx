import { AvatarIcon, Skeleton, Table } from "@/components/index";
import { usePortfolioData } from "@/domain/portfolio/hooks/use-portfolio-data";

export default function TokensTable() {
  const { cryptocurrenciesData, isLoading } = usePortfolioData();

  if (isLoading || !cryptocurrenciesData) {
    return <Skeleton lines={3} />;
  }

  return (
    <Table
      tableHeaders={[
        {
          id: "currencyHeader",
          label: "Asset",
          className: "text-left",
        },
        {
          id: "amountHeader",
          label: "Amount",
          className: "text-left",
        },
        {
          id: "valueHeader",
          label: "Value",
          className: "text-right",
        },
        {
          id: "changeHeader",
          label: "24h",
          className: "text-right",
        },
      ]}
      rows={cryptocurrenciesData.map((currency) => ({
        id: currency.code,
        cells: [
          {
            id: "currency",
            value: currency.code,
            subtitle: currency.name,
            leftIcon: () => {
              return (
                <AvatarIcon
                  initials={currency.code.charAt(0)}
                  color="primary"
                />
              );
            },
            className: "text-left",
          },
          {
            id: "amount",
            value: currency.amount,
            className: "text-left",
          },
          {
            id: "value",
            value: currency.value,
            className: "text-right",
          },
          {
            id: "change",
            value: currency.change,
            className: "text-right",
            highlight: currency.change.startsWith("+"),
          },
        ],
      }))}
    />
  );
}
