import TableFilters, { TableFiltersProps } from "@/components/core/table-filters";
import { Skeleton } from "@/components/index";
import { useIsMobile } from "@/hooks/use-is-mobile";
import clsx from "clsx";
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from "lucide-react";
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
  filters?: TableFiltersProps;
  isLoading?: boolean;
  className?: string;
}

export default function Table({ tableHeaders, rows, filters, isLoading, className }: TableProps) {
  const isMobile = useIsMobile();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLTableElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [canScrollUp, setCanScrollUp] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(false);
  const [columnWidth, setColumnWidth] = useState(0);

  useEffect(() => {
    const container = scrollContainerRef.current;
    const table = tableRef.current;
    if (!container) return;

    const updateScrollState = () => {
      const c = scrollContainerRef.current;
      const t = tableRef.current;
      if (!c) return;

      const containerWidth = c.clientWidth;
      const scrollLeft = c.scrollLeft;
      const scrollTop = c.scrollTop;
      const scrollHeight = c.scrollHeight;
      const clientHeight = c.clientHeight;

      setCanScrollUp(scrollTop > 0);
      setCanScrollDown(scrollTop + clientHeight < scrollHeight - 1);

      if (isMobile && t) {
        const tableWidth = t.scrollWidth;
        const scrollRight = scrollLeft + containerWidth;
        const headerCells = t.querySelectorAll("thead th");
        if (headerCells.length > 0) {
          setColumnWidth(tableWidth / headerCells.length);
        }
        setCanScrollLeft(scrollLeft > 0);
        setCanScrollRight(scrollRight < tableWidth - 1);
      }
    };

    updateScrollState();
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
    const scrollAmount = columnWidth * 1.5;

    const newScroll =
      direction === "left"
        ? Math.max(0, currentScroll - scrollAmount)
        : currentScroll + scrollAmount;

    container.scrollTo({
      left: newScroll,
      behavior: "smooth",
    });
  };

  const scrollRows = (direction: "up" | "down") => {
    if (!scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    const scrollAmount = 80;
    const newScrollTop =
      direction === "up"
        ? Math.max(0, container.scrollTop - scrollAmount)
        : container.scrollTop + scrollAmount;

    container.scrollTo({
      top: newScrollTop,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative bg-background rounded-lg overflow-hidden">
      {filters && <TableFilters {...filters} />}
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
      {canScrollUp && (
        <button
          onClick={() => scrollRows("up")}
          className="absolute left-0 right-0 top-10 z-10 py-1 flex items-center justify-center bg-gradient-to-b from-background to-transparent hover:bg-muted/10 transition-colors"
          aria-label="Scroll up"
        >
          <ChevronUp className="w-5 h-5 text-foreground" />
        </button>
      )}
      {canScrollDown && (
        <button
          onClick={() => scrollRows("down")}
          className="absolute left-0 right-0 bottom-0 z-10 py-1 flex items-center justify-center bg-gradient-to-t from-background to-transparent hover:bg-muted/10 transition-colors"
          aria-label="Scroll down"
        >
          <ChevronDown className="w-5 h-5 text-foreground" />
        </button>
      )}
      <div
        ref={scrollContainerRef}
        className={clsx("overflow-x-auto", isMobile && "scrollbar-hide", className)}
      >
        <table
          ref={tableRef}
          className={clsx("w-full", isMobile && "min-w-max")}
        >
          <thead className="sticky top-0 z-10 bg-background shadow-[0_1px_0_0_hsl(var(--border))]">
            <tr className="bg-muted/5">
              {tableHeaders.map((header) => (
                <th
                  key={header.id}
                  className={clsx(
                    "px-4 py-3 text-xs font-normal text-muted-foreground uppercase bg-muted/5",
                    header.className
                  )}
                >
                  {header.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={tableHeaders.length} className="text-center py-4">
                  <Skeleton lines={3} />
                </td>
              </tr>
            ) : (
              rows.map((row) => (
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
                              cell.className?.includes("text-xs") && "text-xs",
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
              )))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
