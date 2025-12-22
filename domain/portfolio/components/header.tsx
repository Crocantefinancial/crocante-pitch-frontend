import { Skeleton } from "@/components/index";
import { usePortfolioData } from "@/domain/portfolio/hooks/use-portfolio-data";

export default function Header() {
  const { totalBalance, isLoading } = usePortfolioData();

  return (
    <div className="flex items-center justify-between flex flex-wrap gap-4 mb-8 pb-6 border-b border-gray-200">
      <div className="flex items-center gap-2 flex flex-wrap">
        <h3 className="text-lg font-normal text-foreground">
          Consolidated View
        </h3>
      </div>
      <div className="flex items-center gap-2 flex flex-wrap">
        <p className="text-sm text-muted-foreground my-0 py-0">
          Total Balance:
        </p>
        {isLoading ? (
          <Skeleton lines={1} />
        ) : (
          <p className="text-2xl font-semibold text-foreground">
            {totalBalance}
          </p>
        )}
      </div>
    </div>
  );
}
