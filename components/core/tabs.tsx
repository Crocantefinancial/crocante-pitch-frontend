import { Button } from "@/components/index";

interface TabsProps {
  TabValues: Record<string, string>;
  selectedRow?: string;
  onChange?: (selectedRow: string) => void;
}

export default function Tabs({ TabValues, selectedRow, onChange }: TabsProps) {
  return (
    <div className="flex gap-2 bg-muted/10 p-1 rounded-lg">
      {Object.keys(TabValues).map((tabKey) => (
        <Button
          key={tabKey}
          onClick={() => onChange?.(tabKey)}
          variant="secondary"
          className={`text-sm ${
            selectedRow === TabValues[tabKey as keyof typeof TabValues]
              ? "!bg-card shadow-sm"
              : "!text-muted-foreground hover:!text-foreground"
          }`}
        >
          {TabValues[tabKey as keyof typeof TabValues]}
        </Button>
      ))}
    </div>
  );
}
