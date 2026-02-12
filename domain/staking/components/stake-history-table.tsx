import { Badge, Button, Label, Modal, Select, Table, ToastType } from "@/components/index";
import { useToast } from "@/context/toast-provider";
import { UIStakeHistoryDataType, useStakeHistoryData } from "@/domain/staking/hooks/use-stake-history-data";
import { useStakeHistoryFilters } from "@/domain/staking/hooks/use-stake-history-filters";
import { useModal } from "@/hooks/use-modal";
import { formatDate } from "@/lib/utils";
import { usePostStakingRedeem } from "@/services/hooks/mutations/use-post-staking-redeem";
import { useEffect, useState } from "react";

interface StakeHistoryTableProps {
  sessionMode: string;
}

export default function StakeHistoryTable({ sessionMode }: StakeHistoryTableProps) {
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

  const { stakingData, isLoading, userId } = useStakeHistoryData(page, status);
  const { showToast } = useToast();
  const [redeemId, setRedeemId] = useState("");
  const [selectedRedeemData, setSelectedRedeemData] = useState<UIStakeHistoryDataType | null>(null);
  const [isRedeemable, setIsRedeemable] = useState(false);
  const postStakingRedeem = usePostStakingRedeem();

  const isRedeemableFunction = (data: UIStakeHistoryDataType) => {
    return (data.closedAt === null) && ((data.redeemableAt && new Date(data.redeemableAt) <= new Date()) ||
      (data.duration.toLocaleUpperCase() === "VARIABLE"));
  }

  useEffect(() => {
    if (redeemId) {
      const data = stakingData?.find(tx => tx.id === redeemId)!;
      setSelectedRedeemData(data);
      setIsRedeemable(isRedeemableFunction(data));
    }
  }, [redeemId]);

  const handleRedeem = (id: string) => {
    setRedeemId(id);
    openRedeemModal();
  }

  const finalizeRedeem = () => {
    postStakingRedeem.mutate({ userId: userId, opId: redeemId }, {
      onSuccess: (data) => {
        showToast("Redeem successful", ToastType.SUCCESS);
      },
      onError: (err) => {
        console.error("POST STAKING REDEEM ERROR", err);
        showToast("Redeem failed", ToastType.ERROR);
      },
      onSettled: () => {
        setRedeemId("");
        setSelectedRedeemData(null);
        setIsRedeemable(false);
      },
    });
    closeRedeemModal();
  }

  const {
    isOpen: redeemModalOpen,
    open: openRedeemModal,
    close: closeRedeemModal,
  } = useModal(false);

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
          },
          {
            id: "redeemableHeader",
            label: "Redeemable",
            className: "text-left",
          }
        ]}
        rows={stakingData.map((tx) => (
          {
            id: tx.id,
            onClick: () => handleRedeem(tx.id),
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
                className: "text-center",
              },
              {
                id: "amount",
                value: tx.uiDisplay.amount,
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
              {
                id: "redeemable",
                className: "text-left",
                leftIcon: () => {
                  const isRedeemable = isRedeemableFunction(tx);
                  if (isRedeemable) {
                    return (<Badge
                      label="Redeemable"
                      variant="accent"
                    />)
                  }
                },
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
        open={redeemModalOpen}
        onClose={closeRedeemModal}
        title="Redeem"
      >
        <div className="flex flex-col gap-2 px-6">
          <Label
            label="Invested Amount"
            secondaryLabel={selectedRedeemData?.uiDisplay.amount || ""}
          />
          <Label
            label="APY"
            secondaryLabel={Number(selectedRedeemData?.apy) * 100 + "%" || ""}
          />
          <Label
            label="Duration"
            secondaryLabel={selectedRedeemData?.duration || ""}
          />
          {selectedRedeemData?.redeemableAt && <Label
            label="Redeemable At"
            secondaryLabel={formatDate(selectedRedeemData?.redeemableAt || "")}
          />
          }
          <Label
            label="Opened At"
            secondaryLabel={formatDate(selectedRedeemData?.date || "")}
          />
          {selectedRedeemData?.closedAt && <Label
            label="Closed At"
            secondaryLabel={formatDate(selectedRedeemData?.closedAt || "")}
          />
          }
          <Label
            label={selectedRedeemData?.status === "Redeemed" ? "Total Yield" : "Current Yield"}
            secondaryLabel={selectedRedeemData?.uiDisplay.yield || ""}
          />
          {selectedRedeemData?.status !== "Redeemed" && <Label
            label="Estimated Redeem Yield"
            secondaryLabel={selectedRedeemData?.uiDisplay.estRedeemYield || ""}
          />
          }
          <Label
            label={selectedRedeemData?.status === "Redeemed" ? "Redeemed Amount" : "Redeemable Amount"}
            secondaryLabel={selectedRedeemData?.uiDisplay.redeemableAmount || ""}
          />
        </div>
        <Button
          variant="primary"
          className="w-full justify-center mt-4"
          onClick={finalizeRedeem}
          disabled={!selectedRedeemData || !isRedeemable || sessionMode === "mock"}
        >
          Redeem
        </Button>
      </Modal>
    </>
  );
}
