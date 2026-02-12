import { Badge, Button, Modal, Select, Table } from "@/components/index";
import { UILoanHistoryDataType, useLoanHistoryData } from "@/domain/credit/hooks/use-loan-history-data";
import { FILTER_STATUS, useLoanHistoryFilters } from "@/domain/credit/hooks/use-loan-history-filters";
import { useModal } from "@/hooks/use-modal";
import { useState } from "react";
import LoanEventsTable from "./loan-events-table";
import LoanInfo from "./loan-info";
import ManageCollateralModal from "./manage-collateral-modal";
import ManageDebtModal from "./manage-debt-modal";

export default function LoanHistoryTable() {
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
  } = useLoanHistoryFilters({ page: pageLocal });

  const { loanData, isLoading, userId } = useLoanHistoryData(page, status);
  const [selectedLoanData, setSelectedLoanData] = useState<UILoanHistoryDataType | null>(null);
  const [isActive, setIsActive] = useState(false);

  const isActiveLoan = (loan: UILoanHistoryDataType) => {
    return loan.uiDisplay.closedAt === "" || loan.uiDisplay.closedAt === null;
  }

  const handleLoanSelected = (loan: UILoanHistoryDataType) => {
    setSelectedLoanData(loan);
    setIsActive(isActiveLoan(loan));
    openLoanModal();
  }

  const {
    isOpen: loanModalOpen,
    open: openLoanModal,
    close: closeLoanModal,
  } = useModal(false);

  const {
    isOpen: collateralModalOpen,
    open: openCollateralModal,
    close: closeCollateralModal,
  } = useModal(false);

  const {
    isOpen: debtModalOpen,
    open: openDebtModal,
    close: closeDebtModal,
  } = useModal(false);


  const renderCompleteTable = () => {
    return (
      <Table
        isLoading={isLoading || !loanData}
        tableHeaders={[
          {
            id: "dateHeader",
            label: "Date",
            className: "text-left",
          },
          {
            id: "closedAtHeader",
            label: "Closed At",
            className: "text-left",
          },
          {
            id: "amountHeader",
            label: "Amount",
            className: "text-left",
          },
          {
            id: "yieldHeader",
            label: "Yield",
            className: "text-left",
          },
          {
            id: "statusHeader",
            label: "Status",
            className: "text-left",
          },
        ]}
        rows={loanData.map((loan) => (
          {
            id: loan.opId,
            onClick: () => handleLoanSelected(loan),
            cells: [
              {
                id: "date",
                value: loan.uiDisplay.date,
                className: "text-center",
              },
              {
                id: "closedAt",
                value: loan.uiDisplay.closedAt,
                className: "text-center",
              },
              {
                id: "amount",
                value: loan.uiDisplay.amount,
                className: "text-center",
              },
              {
                id: "yield",
                value: loan.uiDisplay.interest,
                className: "text-center",
              },
              {
                id: "status",
                className: "text-left",
                leftIcon: () => (
                  <Badge
                    label={loan.uiDisplay.status.charAt(0).toUpperCase() + loan.uiDisplay.status.slice(1).toLowerCase()}
                    variant={loan.uiDisplay.status.toLocaleUpperCase() === "LIQUIDATED" ? "accent" : "primary"}
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
    )
  }

  const renderActiveTable = () => {
    return (
      <Table
        isLoading={isLoading || !loanData}
        tableHeaders={[
          {
            id: "dateHeader",
            label: "Date",
            className: "text-left",
          },
          {
            id: "debtHeader",
            label: "Debt",
            className: "text-left",
          },
          {
            id: "aprHeader",
            label: "APR",
            className: "text-left",
          },
          {
            id: "overcollateralizationHeader",
            label: "Overcollateralization",
            className: "text-left",
          },
          {
            id: "liqPriceHeader",
            label: "Liquidation Price",
            className: "text-left",
          },
          {
            id: "statusHeader",
            label: "Status",
            className: "text-left",
          },
        ]}
        rows={loanData.map((loan) => (
          {
            id: loan.opId,
            onClick: () => handleLoanSelected(loan),
            cells: [
              {
                id: "date",
                value: loan.uiDisplay.date,
                subtitle: loan.uiDisplay.time,
                className: "text-center",
              },
              {
                id: "debt",
                value: loan.uiDisplay.debt,
                className: "text-center",
              },
              {
                id: "apr",
                value: loan.uiDisplay.apr,
                className: "text-center",
              },
              {
                id: "overcollateralization",
                value: loan.uiDisplay.overcollateralization,
                className: "text-center",
              },
              {
                id: "liqPrice",
                value: loan.uiDisplay.liqPrice,
                className: "text-center",
              },
              {
                id: "status",
                className: "text-left",
                leftIcon: () => (
                  <Badge
                    label={loan.uiDisplay.status.charAt(0).toUpperCase() + loan.uiDisplay.status.slice(1).toLowerCase()}
                    variant={loan.uiDisplay.status.toLocaleUpperCase() === "LIQUIDATED" ? "accent" : "primary"}
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
    );
  }

  return (
    <>
      {activeFilters === FILTER_STATUS.COMPLETED ? renderCompleteTable() : renderActiveTable()}

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
      <Modal
        open={loanModalOpen}
        onClose={closeLoanModal}
        title="Loan Overview"
        actions={isActive ? () => (
          <>
            <Button
              variant="primary"
              className="w-full justify-center mt-4"
              onClick={() => { openCollateralModal(); closeLoanModal() }}
              disabled={!selectedLoanData}
            >
              Manage Collateral
            </Button>
            <Button
              variant="primary"
              className="w-full justify-center mt-4"
              onClick={() => { openDebtModal(); closeLoanModal() }}
              disabled={!selectedLoanData}
            >
              Manage Debt
            </Button>
          </>
        ) : undefined}
      >
        <div className="flex flex-col gap-2 mt-2 px-4">
          <LoanInfo loanData={selectedLoanData} isActive={isActive} />
          {selectedLoanData &&
            <LoanEventsTable
              opId={selectedLoanData.opId}
              userId={userId}
              isActive={isActive}
              loanTokenId={selectedLoanData.token}
              collateralTokenId={selectedLoanData.collateralToken}
            />
          }
        </div>
      </Modal>
      {selectedLoanData &&
        <ManageCollateralModal
          userId={userId}
          loanData={selectedLoanData}
          collateralModalOpen={collateralModalOpen}
          closeCollateralModal={closeCollateralModal}
        />
      }
      {selectedLoanData &&
        <ManageDebtModal
          userId={userId}
          loanData={selectedLoanData}
          debtModalOpen={debtModalOpen}
          closeDebtModal={closeDebtModal}
        />}
    </>
  );
}
