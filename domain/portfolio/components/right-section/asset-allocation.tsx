import { Skeleton } from "@/components/index";
import { usePortfolioData } from "@/domain/portfolio/hooks/use-portfolio-data";
import { formatCurrency } from "@/lib/utils";
import { useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

export default function AssetAllocation() {
  const { assetAllocationData, isLoading } = usePortfolioData();
  const [hoveredSegment, setHoveredSegment] = useState<number | null>(null);

  if (isLoading || !assetAllocationData) {
    return <Skeleton lines={3} />;
  }

  return (
    <div className="bg-background rounded-lg p-6 flex flex-col">
      <h4 className="text-sm font-normal text-muted-foreground mb-4 uppercase">
        Asset Allocation
      </h4>

      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={assetAllocationData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={2}
            stroke="none"
            onMouseEnter={(_, index) => setHoveredSegment(index)}
            onMouseLeave={() => setHoveredSegment(null)}
          >
            {assetAllocationData.map((entry, index) => (
              <Cell
                key={`segment-${entry.name}`}
                className={`portfolio-segment-${index}`}
                fill={entry.color}
                opacity={
                  hoveredSegment === null || hoveredSegment === index ? 1 : 0.7
                }
                style={{ cursor: "pointer" }}
              />
            ))}
          </Pie>

          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              fontSize: "12px",
            }}
            formatter={(value: number, name: string) => [`${value}%`, name]}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="mt-6 space-y-2.5">
        {assetAllocationData.map((item, index) => (
          <div
            key={item.name}
            className="flex items-center justify-between cursor-pointer hover:bg-muted/5 p-2 rounded transition-colors"
            onMouseEnter={() => setHoveredSegment(index)}
            onMouseLeave={() => setHoveredSegment(null)}
          >
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm text-muted-foreground">
                {item.name} {item.value}%
              </span>
            </div>
            <span className="text-xs text-muted-foreground">
              {formatCurrency(item.amount)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
