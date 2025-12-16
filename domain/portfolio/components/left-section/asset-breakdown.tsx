import { Button, Skeleton } from "@/components/index";
import { CurrencyTable, TokensTable } from "@/domain/portfolio/components";
import { usePortfolioData } from "@/domain/portfolio/hooks/use-portfolio-data";
import { useModal } from "@/hooks/use-modal";
import { ChevronDown, ChevronRight } from "lucide-react";

export default function AssetBreakdown() {
  const { cryptocurrencies, currencies, isLoading } = usePortfolioData();
  const { isOpen: openCryptoCurrencies, toggle: toggleCryptoCurrencies } =
    useModal(true);
  const { isOpen: openCurrencies, toggle: toggleCurrencies } = useModal(true);

  if (isLoading || !cryptocurrencies || !currencies) {
    return <Skeleton lines={3} />;
  }

  return (
    <div className="lg:col-span-2 space-y-6">
      {/* Cryptocurrencies - Collapsible */}
      <div>
        <Button
          onClick={() => toggleCryptoCurrencies()}
          className="w-full mb-4"
          variant="secondary"
        >
          <div className="w-full flex items-center justify-between">
            <div className="flex items-center gap-2">
              {openCryptoCurrencies ? (
                <ChevronDown className="w-5 h-5 text-muted-foreground" />
              ) : (
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              )}
              <span className="text-foreground font-normal">
                Cryptocurrencies
              </span>
            </div>
            <span className="text-foreground font-semibold">
              {cryptocurrencies}
            </span>
          </div>
        </Button>

        {openCryptoCurrencies && <TokensTable />}
      </div>

      {/* Currencies - Collapsible */}
      <div>
        <Button
          onClick={() => toggleCurrencies()}
          className="w-full mb-4"
          variant="secondary"
        >
          <div className="w-full flex items-center justify-between">
            <div className="flex items-center gap-2">
              {openCurrencies ? (
                <ChevronDown className="w-5 h-5 text-muted-foreground" />
              ) : (
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              )}
              <span className="text-foreground font-normal">Currencies</span>
            </div>
            <span className="text-foreground font-semibold">{currencies}</span>
          </div>
        </Button>

        {openCurrencies && <CurrencyTable />}
      </div>
    </div>
  );
}
