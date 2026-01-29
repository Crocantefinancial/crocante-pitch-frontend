import { SelectOption } from "@/components/core/select";
import { useSelector } from "@/hooks/use-selector";
import { useTableFilters } from "@/hooks/use-table-filters";
import { useState } from "react";

interface UseActivityFiltersProps {
    page: number;
}
export enum FILTER_STATUS {
    NONE = "None",
    ACTIVE = "Active",
    COMPLETED = "Completed",
    CANCELED = "Canceled",
}
export enum FILTER_TX_TYPE {
    NONE = "None",
    DEPOSIT = "Deposit",
    WITHDRAWAL = "Withdrawal",
    STAKING = "Staking",
    SWAP = "Swap",
    TRADE = "Trade",
    LOAN = "Loan",
}
export function useActivityFilters({ page }: UseActivityFiltersProps) {
    const [status, setStatus] = useState<string[]>([]);
    const [txType, setTxType] = useState<string[]>([]);
    const [changeFilters, setChangeFilters] = useState<{ op: SelectOption, index: number }>();

    const handleSetFilters = (filters: string[][]) => {
        setTxType(filters[0]);
        setStatus(filters[1]);
    }

    const resetSelectors = () => {
        resetTxTypesSelector();
        resetStatusSelector();
    }

    const statusOptions: Array<SelectOption> = [
        { id: FILTER_STATUS.NONE, label: "None", value: "" },
        { id: FILTER_STATUS.ACTIVE, label: "Active", value: FILTER_STATUS.ACTIVE },
        { id: FILTER_STATUS.COMPLETED, label: "Completed", value: FILTER_STATUS.COMPLETED },
        { id: FILTER_STATUS.CANCELED, label: "Canceled", value: FILTER_STATUS.CANCELED },
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
        onChangeReactive: (op: SelectOption) => setChangeFilters({ op, index: 1 })
    });

    const txTypesOptions: Array<SelectOption> = [
        { id: FILTER_TX_TYPE.NONE, label: "None", value: "" },
        { id: FILTER_TX_TYPE.DEPOSIT, label: "Deposit", value: FILTER_TX_TYPE.DEPOSIT },
        { id: FILTER_TX_TYPE.WITHDRAWAL, label: "Withdrawal", value: FILTER_TX_TYPE.WITHDRAWAL },
        { id: FILTER_TX_TYPE.STAKING, label: "Staking", value: FILTER_TX_TYPE.STAKING },
        { id: FILTER_TX_TYPE.SWAP, label: "Swap", value: "Trade.Conversion" },
        { id: FILTER_TX_TYPE.TRADE, label: "Trade", value: FILTER_TX_TYPE.TRADE },
        { id: FILTER_TX_TYPE.LOAN, label: "Loan", value: FILTER_TX_TYPE.LOAN },
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
        onChangeReactive: (op: SelectOption) => setChangeFilters({ op, index: 0 })
    });

    const {
        page: pageHook,
        filtersClassName,
        activeFilters,
        openFiltersModal,
        filtersModalOpen,
        closeFiltersModal,
    } = useTableFilters({
        page,
        selectors: [
            {
                selectedIndex: selectedTxTypesIndex,
                onChange: changeTxTypesSelection,
                options: txTypesOptions,
            },
            {
                selectedIndex: selectedStatusIndex,
                onChange: changeStatusSelection,
                options: statusOptions,
            }
        ],
        setFilters: handleSetFilters,
        resetSelectors,
        handleChangeFilters: changeFilters
    });

    return {
        page: pageHook,
        filtersClassName,
        activeFilters,
        openFiltersModal,
        filtersModalOpen,
        closeFiltersModal,
        status,
        txType,
        txTypeSelector: {
            selectedIndex: selectedTxTypesIndex,
            onChange: changeTxTypesSelection,
            options: txTypesOptions,
        },
        statusSelector: {
            selectedIndex: selectedStatusIndex,
            onChange: changeStatusSelection,
            options: statusOptions,
        }
    }
}
