import { useIsMobile } from "@/hooks/use-is-mobile";
import clsx from "clsx";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface TableHeader {
  id: string;
  label: string;
  className?: string;
}

interface TableCell {
  id: string;
  value?: string;
  subtitle?: string;
  highlight?: boolean;
  className?: string;
  leftIcon?: () => React.ReactNode;
}

interface TableRow {
  id: string;
  cells: TableCell[];
  className?: string;
  onClick?: () => void;
}
interface TableProps {
  tableHeaders: TableHeader[];
  rows: TableRow[];
}

export default function Table({ tableHeaders, rows }: TableProps) {
  const isMobile = useIsMobile();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLTableElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [columnWidth, setColumnWidth] = useState(0);

  useEffect(() => {
    if (!isMobile || !scrollContainerRef.current || !tableRef.current) return;

    const updateScrollState = () => {
      const container = scrollContainerRef.current;
      const table = tableRef.current;
      if (!container || !table) return;

      const containerWidth = container.clientWidth;
      const tableWidth = table.scrollWidth;
      const scrollLeft = container.scrollLeft;
      const scrollRight = scrollLeft + containerWidth;

      // Calculate average column width
      const headerCells = table.querySelectorAll("thead th");
      if (headerCells.length > 0) {
        const avgColumnWidth = tableWidth / headerCells.length;
        setColumnWidth(avgColumnWidth);
      }

      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollRight < tableWidth - 1); // -1 for rounding
    };

    updateScrollState();
    const container = scrollContainerRef.current;
    container.addEventListener("scroll", updateScrollState);
    window.addEventListener("resize", updateScrollState);

    return () => {
      container.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [isMobile, tableHeaders.length, rows.length]);

  const scrollColumns = (direction: "left" | "right") => {
    if (!scrollContainerRef.current || !columnWidth) return;

    const container = scrollContainerRef.current;
    const currentScroll = container.scrollLeft;
    const scrollAmount = columnWidth * 1.5; // Scroll 1.5 columns at a time

    const newScroll =
      direction === "left"
        ? Math.max(0, currentScroll - scrollAmount)
        : currentScroll + scrollAmount;

    container.scrollTo({
      left: newScroll,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative bg-background rounded-lg overflow-hidden">
      {isMobile && canScrollLeft && (
        <button
          onClick={() => scrollColumns("left")}
          className="absolute left-0 top-0 bottom-0 z-10 bg-gradient-to-r from-background to-transparent px-2 flex items-center hover:bg-muted/10 transition-colors"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-5 h-5 text-foreground" />
        </button>
      )}
      {isMobile && canScrollRight && (
        <button
          onClick={() => scrollColumns("right")}
          className="absolute right-0 top-0 bottom-0 z-10 bg-gradient-to-l from-background to-transparent px-2 flex items-center hover:bg-muted/10 transition-colors"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-5 h-5 text-foreground" />
        </button>
      )}
      <div
        ref={scrollContainerRef}
        className={clsx("overflow-x-auto", isMobile && "scrollbar-hide")}
      >
        <table
          ref={tableRef}
          className={clsx("w-full", isMobile && "min-w-max")}
        >
          <thead>
            <tr className="bg-muted/5">
              {tableHeaders.map((header) => (
                <th
                  key={header.id}
                  className={clsx(
                    "px-4 py-3 text-xs font-normal text-muted-foreground uppercase",
                    header.className
                  )}
                >
                  {header.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.id}
                className="hover:bg-muted/5 transition-colors cursor-pointer"
                onClick={row.onClick}
              >
                {row.cells.map((cell) => (
                  <td
                    key={cell.id}
                    className={clsx(
                      "px-4 py-3 text-sm font-normal",
                      cell.className
                    )}
                  >
                    <div
                      className={clsx(
                        "flex items-center gap-3",
                        cell.className?.includes("text-right") && "justify-end"
                      )}
                    >
                      {cell.leftIcon && cell.leftIcon()}
                      <div className="flex flex-col">
                        <p
                          className={clsx(
                            "text-sm font-normal",
                            cell.highlight
                              ? "text-accent"
                              : "text-muted-foreground"
                          )}
                        >
                          {cell.value}
                        </p>
                        {cell.subtitle && (
                          <p className="text-xs text-muted-foreground">
                            {cell.subtitle}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
