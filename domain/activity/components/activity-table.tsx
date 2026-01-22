import { Badge, Skeleton, Table } from "@/components/index";
import { useActivityData } from "@/domain/activity/hooks/use-activity-data";

interface ActivityTableProps {
  page: number;
  status: string[];
  txType: string[];
}

export default function ActivityTable({ page = 1, status = [], txType = [] }: ActivityTableProps) {
  const { activityData, isLoading } = useActivityData(page, status, txType);

  if (isLoading || !activityData) {
    return <Skeleton lines={3} />;
  }

  return (
    <Table
      tableHeaders={[
        {
          id: "typeHeader",
          label: "Type",
          className: "text-left",
        },
        {
          id: "dateHeader",
          label: "Date",
          className: "text-left",
        },
        {
          id: "amountHeader",
          label: "Amount",
          className: "text-left",
        },
        {
          id: "statusHeader",
          label: "Status",
          className: "text-left",
        }
      ]}
      rows={activityData.map((tx) => (
        {
          id: tx.id,
          cells: [
            {
              id: "type",
              value: tx.type.charAt(0).toUpperCase() + tx.type.slice(1).toLowerCase(),
              leftIcon: () => tx.opIcon,
              className: "text-left",
            },
            {
              id: "date",
              value: tx.date,
              subtitle: tx.subDate,
              className: "text-center",
            },
            {
              id: "amount",
              value: tx.amount,
              subtitle: tx.subAmount,
              className: "text-center",
            },
            {
              id: "status",
              className: "text-left",
              leftIcon: () => (
                <Badge
                  label={tx.status.charAt(0).toUpperCase() + tx.status.slice(1).toLowerCase()}
                  variant={tx.status.toLocaleUpperCase() === "CANCELED" ? "accent" : "primary"}
                />
              ),
            },
          ],
        }))}
    />
  );
}
