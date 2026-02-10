import { Button, Skeleton, Table } from "@/components/index";
import { getTokenLogo } from "@/components/token-icons";
import { usePortfolioData } from "@/domain/portfolio/hooks/use-portfolio-data";
import { Minus, Plus } from "lucide-react";
import { useEffect, useState } from "react";

export default function TokensTable() {
  const { cryptocurrenciesData, isLoading } = usePortfolioData();

  const [showMoreTokens, setShowMoreTokens] = useState(false);
  const [data, setData] = useState(
    () =>
      cryptocurrenciesData
        ? cryptocurrenciesData.filter(
          (currency) => Number(currency.amount) > 0
        )
        : []
  );

  useEffect(() => {
    if (!cryptocurrenciesData) return;
    if (showMoreTokens) {
      setData(cryptocurrenciesData);
    } else {
      setData(
        cryptocurrenciesData.filter(
          (currency) => Number(currency.amount) > 0
        )
      );
    }
  }, [cryptocurrenciesData, showMoreTokens]);

  if (isLoading || !cryptocurrenciesData) {
    return <Skeleton lines={3} />;
  }

  const handleMoreTokens = () => {
    setShowMoreTokens(!showMoreTokens);
  };

  const formatNumber = (val: string) => {
    return val === "0" ? "-" : val;
  };

  return (
    <div className="items-center justify-center">
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
            id: "priceHeader",
            label: "Change",
            className: "text-right",
          },
        ]}
        rows={data.map((currency) => ({
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
              value: formatNumber(currency.amount),
              className: "text-left",
            },
            {
              id: "available",
              value: formatNumber(currency.available),
              className: "text-left",
            },
            {
              id: "value",
              value: formatNumber(currency.value),
              className: "text-right",
            },
            {
              id: "price",
              value: formatNumber(currency.change),
              className: "text-right",
              highlight: currency.change.startsWith("+"),
            },
          ],
        }))}
      />
      <Button variant="nav" className="w-full mt-4 justify-center" onClick={handleMoreTokens}>
        {showMoreTokens
          ? <>
            <Minus className="w-4 h-4" />
            Less tokens
          </>
          : <>
            <Plus className="w-4 h-4" />
            More tokens
          </>
        }
      </Button>

    </div>
  );
}
