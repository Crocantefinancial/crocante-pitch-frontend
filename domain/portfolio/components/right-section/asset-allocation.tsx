import { Skeleton } from "@/components/index";
import { usePortfolioData } from "@/domain/portfolio/hooks/use-portfolio-data";
import { formatCurrency } from "@/lib/utils";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

export default function AssetAllocation() {
  const { assetAllocationData, isLoading } = usePortfolioData();
  const [hoveredSegment, setHoveredSegment] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [chartSize, setChartSize] = useState({
    innerRadius: 60,
    outerRadius: 90,
    height: 250,
  });

  useEffect(() => {
    const updateChartSize = () => {
      if (!containerRef.current) return;

      const containerWidth = containerRef.current.clientWidth;
      // Calculate sizes based on container width (responsive)
      // Use 30-35% of container width for outer radius
      const baseSize = Math.min(containerWidth * 0.35, 90); // Cap at 90px for very large screens
      const minSize = Math.max(containerWidth * 0.25, 65); // Minimum 65px for small screens

      const outerRadius = Math.max(minSize, Math.min(baseSize, 90));
      const innerRadius = outerRadius * 0.67; // Inner radius is 67% of outer
      const height = outerRadius * 2.5; // Height is 2.5x the outer radius

      setChartSize({
        innerRadius: Math.round(innerRadius),
        outerRadius: Math.round(outerRadius),
        height: Math.round(height),
      });
    };

    updateChartSize();
    window.addEventListener("resize", updateChartSize);

    // Use ResizeObserver for more accurate container size tracking
    const resizeObserver = new ResizeObserver(updateChartSize);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      window.removeEventListener("resize", updateChartSize);
      resizeObserver.disconnect();
    };
  }, []);

  if (isLoading || !assetAllocationData) {
    return <Skeleton lines={3} />;
  }

  return (
    <div
      ref={containerRef}
      className="bg-background rounded-lg p-6 flex flex-col overflow-visible"
    >
      <h4 className="text-sm font-normal text-muted-foreground mb-4 uppercase">
        Asset Allocation
      </h4>

      <div className="w-full flex justify-center overflow-visible">
        <ResponsiveContainer width="100%" height={chartSize.height}>
          <PieChart>
            <Pie
              data={assetAllocationData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={chartSize.innerRadius}
              outerRadius={chartSize.outerRadius}
              paddingAngle={2}
              stroke="none"
              onMouseEnter={(_, index) => setHoveredSegment(index)}
              onMouseLeave={() => setHoveredSegment(null)}
            >
              {assetAllocationData.map((entry, index) => (
                <Cell
                  key={`segment-${entry.name}`}
                  className={clsx(
                    `portfolio-segment-${index}`,
                    "cursor-pointer"
                  )}
                  fill={entry.color}
                  opacity={
                    hoveredSegment === null || hoveredSegment === index
                      ? 1
                      : 0.7
                  }
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
      </div>

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
