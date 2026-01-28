import { Badge, Button, Label, Modal, Select, Table, ToastType } from "@/components/index";
import { useToast } from "@/context/toast-provider";
import { UILoanHistoryDataType, useLoanHistoryData } from "@/domain/credit/hooks/use-loan-history-data";
import { useLoanHistoryFilters } from "@/domain/credit/hooks/use-loan-history-filters";
import { useModal } from "@/hooks/use-modal";
import { formatDate } from "@/lib/utils";
//import { usePostLoan } from "@/services/hooks/mutations/use-post-loan";
import { useEffect, useState } from "react";


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

  return (
    <>
      <Table
        isLoading={isLoading || !loanData}
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
                id: "ratio",
                value: tx.ratio,
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
      >
        <div className="flex flex-col gap-2 px-6">
          <Label
            label="Invested Amount"
            secondaryLabel={selectedLoanData?.amount || ""}
          />
          <Label
            label="APY"
            secondaryLabel={Number(selectedLoanData?.apr) * 100 + "%" || ""}
          />
          <Label
            label="Ratio"
            secondaryLabel={selectedLoanData?.ratio || ""}
          />
          <Label
            label="Opened At"
            secondaryLabel={selectedLoanData?.date || ""}
          />
          {selectedLoanData?.closedAt && <Label
            label="Closed At"
            secondaryLabel={selectedLoanData?.closedAt || ""}
          />
          }
          <Label
            label="Origination Fee"
            secondaryLabel={selectedLoanData?.origFee || ""}
          />
        </div>
        <Button
          variant="primary"
          className="w-full justify-center mt-4"
          onClick={finalizeLoanComplete}
          disabled={!selectedLoanData || !isCompleteable}
        >
          Complete
        </Button>
      </Modal>
    </>
  );
}
