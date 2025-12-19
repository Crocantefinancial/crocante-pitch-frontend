import clsx from "clsx";

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
  return (
    <div className="bg-background rounded-lg overflow-hidden">
      <table className="w-full">
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
  );
}
