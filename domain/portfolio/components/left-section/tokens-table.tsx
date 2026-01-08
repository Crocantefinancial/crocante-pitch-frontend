import { Skeleton, Table } from "@/components/index";
import { getTokenLogo } from "@/components/token-icons";
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
          id: "availableHeader",
          label: "Available",
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
                <img
                  src={getTokenLogo(currency.code)}
                  className="w-7 h-7 rounded-full"
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
            id: "available",
            value: currency.available,
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
