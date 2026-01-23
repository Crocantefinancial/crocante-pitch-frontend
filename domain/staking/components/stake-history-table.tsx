import { Badge, Modal, Select, Table } from "@/components/index";
import { useStakeHistoryData } from "@/domain/staking/hooks/use-stake-history-data";
import { useStakeHistoryFilters } from "@/domain/staking/hooks/use-stake-history-filters";
import { useState } from "react";

export default function StakeHistoryTable() {
  const [pageLocal, setPageLocal] = useState(1);
  const {
    page,
    status,
    activeFilters,
    filtersClassName,
    filtersModalOpen,
    openFiltersModal,
    closeFiltersModal,
    statusSelector
  } = useStakeHistoryFilters({ page: pageLocal });

  const { stakingData, isLoading } = useStakeHistoryData(page, status);

  return (
    <>
      <Table
        isLoading={isLoading || !stakingData}
        tableHeaders={[
          {
            id: "dateHeader",
            label: "Date",
            className: "text-left",
          },
          {
            id: "tokenHeader",
            label: "Token",
            className: "text-left",
          },
          {
            id: "amountHeader",
            label: "Amount",
            className: "text-left",
          },
          {
            id: "durationHeader",
            label: "Duration",
            className: "text-left",
          },
          {
            id: "statusHeader",
            label: "Status",
            className: "text-left",
          }
        ]}
        rows={stakingData.map((tx) => (
          {
            id: tx.id,
            cells: [
              {
                id: "date",
                value: tx.date,
                subtitle: tx.subDate,
                className: "text-center",
              },
              {
                id: "token",
                value: tx.token,
                subtitle: tx.subAmount,
                className: "text-center",
              },
              {
                id: "amount",
                value: tx.amount,
                subtitle: tx.subAmount,
                className: "text-center",
              },
              {
                id: "duration",
                value: tx.duration.charAt(0).toUpperCase() + tx.duration.slice(1).toLowerCase(),
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
        filters={{
          page: page,
          setPage: setPageLocal,
          filtersClassName: filtersClassName,
          activeFilters: activeFilters,
          openFiltersModal: openFiltersModal,
        }}
      />
      <Modal
        open={filtersModalOpen}
        onClose={closeFiltersModal}
        title="Filters"
      >
        <div className="flex flex-col gap-2">
          <Select
            label="Status"
            properties={statusSelector}
          />
        </div>
      </Modal>
    </>
  );
}
