import { Badge, Button, DynamicAvatarButton, InputSelectorToken, Label, Modal, Select, Table, ToastType } from "@/components/index";
import { useToast } from "@/context/toast-provider";
import { UILoanHistoryDataType, useLoanHistoryData } from "@/domain/credit/hooks/use-loan-history-data";
import { FILTER_STATUS, useLoanHistoryFilters } from "@/domain/credit/hooks/use-loan-history-filters";
import { useModal } from "@/hooks/use-modal";
//import { usePostLoan } from "@/services/hooks/mutations/use-post-loan";
import { ArrowDown, ArrowUpDown, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
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
  const { showToast } = useToast();
  const [loanId, setLoanId] = useState("");
  const [selectedLoanData, setSelectedLoanData] = useState<UILoanHistoryDataType | null>(null);
  const [isCompleteable, setIsCompleteable] = useState(false);
  //const postLoan = usePostLoan();

  const isCompleteableFunction = (data: UILoanHistoryDataType) => {
    return data.closedAt === "" || data.closedAt === null;
  }
  useEffect(() => {
    if (loanId) {
      const data = loanData?.find(tx => tx.opId === loanId)!;
      setSelectedLoanData(data);
      setIsCompleteable(isCompleteableFunction(data));
    }
  }, [loanId]);

  const handleLoanComplete = (id: string) => {
    setLoanId(id);
    openLoanModal();
  }

  const finalizeLoanComplete = () => {
    showToast("Loan complete not implemented", ToastType.ERROR);
    /* postLoanComplete.mutate({ userId: userId, opId: loanId }, {
      onSuccess: (data) => {
        showToast("Loan complete successful", ToastType.SUCCESS);
      },
      onError: (err) => {
        console.error("POST LOAN COMPLETE ERROR", err);
        showToast("Loan complete failed", ToastType.ERROR);
      },
      onSettled: () => {
        setLoanId("");
        setSelectedLoanData(null);
        setIsCompleteable(false);
      },
    }); */
    closeLoanModal();
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
        rows={loanData.map((tx) => (
          {
            id: tx.opId,
            onClick: () => handleLoanComplete(tx.opId),
            cells: [
              {
                id: "date",
                value: tx.date,
                className: "text-center",
              },
              {
                id: "closedAt",
                value: tx.closedAt,
                className: "text-center",
              },
              {
                id: "amount",
                value: tx.amount,
                className: "text-center",
              },
              {
                id: "yield",
                value: tx.interest,
                className: "text-center",
              },
              {
                id: "status",
                className: "text-left",
                leftIcon: () => (
                  <Badge
                    label={tx.status.charAt(0).toUpperCase() + tx.status.slice(1).toLowerCase()}
                    variant={tx.status.toLocaleUpperCase() === "LIQUIDATED" ? "accent" : "primary"}
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
        rows={loanData.map((tx) => (
          {
            id: tx.opId,
            onClick: () => handleLoanComplete(tx.opId),
            cells: [
              {
                id: "date",
                value: tx.date,
                subtitle: tx.subDate,
                className: "text-center",
              },
              {
                id: "debt",
                value: tx.debt,
                className: "text-center",
              },
              {
                id: "apr",
                value: tx.apr,
                className: "text-center",
              },
              {
                id: "overcollateralization",
                value: tx.overcollateralization,
                className: "text-center",
              },
              {
                id: "liqPrice",
                value: tx.liqPrice,
                className: "text-center",
              },
              {
                id: "status",
                className: "text-left",
                leftIcon: () => (
                  <Badge
                    label={tx.status.charAt(0).toUpperCase() + tx.status.slice(1).toLowerCase()}
                    variant={tx.status.toLocaleUpperCase() === "LIQUIDATED" ? "accent" : "primary"}
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
        title="Loan Complete"
        actions={isCompleteable ? () => (
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
        <div className="flex flex-col gap-2 px-6">
          <Label
            label="Invested Amount"
            secondaryLabel={selectedLoanData?.amount || ""}
          />
          <Label
            label="APY"
            secondaryLabel={selectedLoanData?.apr || ""}
          />
          {!isCompleteable ?
            <Label
              label="Yield"
              secondaryLabel={selectedLoanData?.interest || ""}
            />
            :
            <Label
              label="Overcollateralization"
              secondaryLabel={selectedLoanData?.overcollateralization || ""}
            />
          }
          <Label
            label="Opened At"
            secondaryLabel={selectedLoanData?.date || ""}
          />
          {!isCompleteable && <Label
            label="Closed At"
            secondaryLabel={selectedLoanData?.closedAt || ""}
          />
          }
          <Label
            label="Origination Fee"
            secondaryLabel={selectedLoanData?.origFee || ""}
          />
          {!isCompleteable &&
            <Label
              label="Initial Collateral"
              secondaryLabel={selectedLoanData?.initialCollat || ""}
            />
          }
        </div>
      </Modal>
      {selectedLoanData &&
        <ManageCollateralModal
          loanData={selectedLoanData}
          collateralModalOpen={collateralModalOpen}
          closeCollateralModal={closeCollateralModal}
        />
      }
      {selectedLoanData &&
        <ManageDebtModal
          loanData={selectedLoanData}
          debtModalOpen={debtModalOpen}
          closeDebtModal={closeDebtModal}
        />}
    </>
  );
}
