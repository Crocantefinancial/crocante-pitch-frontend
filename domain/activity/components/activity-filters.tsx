import { SelectOption } from "@/components/core/select";
import { Button, Label, Modal, Select } from "@/components/index";
import { useModal } from "@/hooks/use-modal";
import { useSelector } from "@/hooks/use-selector";
import { ArrowLeftIcon, ArrowRightIcon, Eye } from "lucide-react";
import { useEffect, useState } from "react";

interface ActivityFiltersProps {
    setPageCallback: (page: number) => void;
    setStatusCallback: (status: string[]) => void;
    setTxTypeCallback: (txType: string[]) => void;
}

export default function ActivityFilters({
    setPageCallback,
    setStatusCallback,
    setTxTypeCallback
}: ActivityFiltersProps) {
    const [page, setPage] = useState(1);
    const [filtersClassName, setFiltersClassName] = useState("secondary");
    const [activeFilters, setActiveFilters] = useState("");

    const handleResetFilters = () => {
        resetTxTypesSelector();
        resetStatusSelector();
        setFiltersClassName("secondary");
        setActiveFilters("");
        setPage(1);
    }

    const {
        isOpen: filtersModalOpen,
        open: openFiltersModal,
        close: closeFiltersModal,
    } = useModal(false, {
        onOpen: handleResetFilters,
    });

    const onChangeFilters = (op: SelectOption, type: "status" | "txType") => {
        let selectedStatus;
        let selectedTxTypes;
        let selectedStatusLabel;
        let selectedTxTypesLabel;
        if (type === "status") {
            selectedStatus = op.value;
            selectedStatusLabel = op.label;
            selectedTxTypes = txTypesOptions[selectedTxTypesIndex]?.value || "";
            selectedTxTypesLabel = txTypesOptions[selectedTxTypesIndex]?.label || "";
        } else if (type === "txType") {
            selectedTxTypes = op.value;
            selectedTxTypesLabel = op.label;
            selectedStatus = statusOptions[selectedStatusIndex]?.value || "";
            selectedStatusLabel = statusOptions[selectedStatusIndex]?.label || "";
        }
        selectedStatusLabel = selectedStatusLabel === "None" ? "" : selectedStatusLabel;
        selectedTxTypesLabel = selectedTxTypesLabel === "None" ? "" : selectedTxTypesLabel;
        setFiltersClassName(selectedStatus === "" && selectedTxTypes === "" ? "secondary" : "outline");
        setActiveFilters(selectedStatus === "" && selectedTxTypes === "" ? "" : `${selectedStatusLabel} ${selectedTxTypesLabel}`);
        if (page !== 1) {
            setPage(1);
        }
    }

    const statusOptions: Array<SelectOption> = [
        { id: "None", label: "None", value: "" },
        { id: "Active", label: "Active", value: "Active" },
        { id: "Completed", label: "Completed", value: "Completed" },
        { id: "Canceled", label: "Canceled", value: "Canceled" },
    ];
    const statusOptionsRecord = statusOptions.reduce(
        (acc, option) => {
            acc[option.id] = option;
            return acc;
        },
        {} as Record<string, SelectOption>
    );

    const {
        selectedIndex: selectedStatusIndex,
        reset: resetStatusSelector,
        change: changeStatusSelection,
    } = useSelector<SelectOption>(statusOptionsRecord, 0, {
        onChangeReactive: (op: SelectOption) => onChangeFilters(op, "status")
    });

    const txTypesOptions: Array<SelectOption> = [
        { id: "None", label: "None", value: "" },
        { id: "Deposit", label: "Deposit", value: "Deposit" },
        { id: "Withdrawal", label: "Withdrawal", value: "Withdrawal" },
        { id: "Staking", label: "Staking", value: "Staking" },
        { id: "Swap", label: "Swap", value: "Trade.Conversion" },
        { id: "Trade", label: "Trade", value: "Trade" },
        { id: "Loan", label: "Loan", value: "Loan" },
    ];

    const txTypesOptionsRecord = txTypesOptions.reduce(
        (acc, option) => {
            acc[option.id] = option;
            return acc;
        }, {} as Record<string, SelectOption>
    );
    const {
        selectedIndex: selectedTxTypesIndex,
        reset: resetTxTypesSelector,
        change: changeTxTypesSelection,
    } = useSelector<SelectOption>(txTypesOptionsRecord, 0, {
        onChangeReactive: (op: SelectOption) => onChangeFilters(op, "txType")
    });

    useEffect(() => {
        setPageCallback(page);
        setStatusCallback([statusOptions[selectedStatusIndex]?.value || ""]);
        setTxTypeCallback([txTypesOptions[selectedTxTypesIndex]?.value || ""]);
    }, [page, selectedStatusIndex, selectedTxTypesIndex]);

    return (
        <>
            <div className="space-y-8">
                <div className="flex flex-wrap items-center justify-between gap-0 mb-2">
                    <div className="flex flex-item flex-row items-center justify-start gap-0">
                        <Button variant={filtersClassName as "outline" | "secondary"} className="text-xs" onClick={openFiltersModal}>
                            <Eye className="w-4 h-4" />
                            Filters {activeFilters ? `| ${activeFilters}` : ""}
                        </Button>
                    </div>
                    <div className="flex flex-item flex-row items-center justify-end gap-0 ml-auto">
                        <Button variant="primary" className="text-xs" onClick={() => setPage(1)}>
                            1
                        </Button>
                        <Button
                            variant="outline"
                            className="text-xs h-8 px-0 flex items-center justify-center"
                            onClick={() => setPage(page > 1 ? page - 1 : 1)}
                        >
                            <ArrowLeftIcon className="w-4 h-4" />
                        </Button>
                        <Label label={`${page}`} />
                        <Button
                            variant="outline"
                            className="text-xs h-8 px-0 flex items-center justify-center"
                            onClick={() => setPage(page + 1)}
                        >
                            <ArrowRightIcon className="w-4 h-4" />
                        </Button>
                        <Button variant="primary" className="text-xs" onClick={() => setPage(page + 10)}>
                            10+
                        </Button>
                    </div>
                </div>
            </div>
            <Modal
                open={filtersModalOpen}
                onClose={closeFiltersModal}
                title="Filters"
            >
                <div className="flex flex-col gap-2">
                    <Select
                        label="Transaction Type"
                        properties={{
                            options: txTypesOptions,
                            selectedIndex: selectedTxTypesIndex,
                            onChange: changeTxTypesSelection,
                        }}
                    />
                    <Select
                        label="Status"
                        properties={{
                            options: statusOptions,
                            selectedIndex: selectedStatusIndex,
                            onChange: changeStatusSelection,
                        }}
                    />
                </div>
            </Modal>
        </>
    );
}
