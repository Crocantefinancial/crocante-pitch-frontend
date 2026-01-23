import { SelectOption } from "@/components/core/select";
import { useSelector } from "@/hooks/use-selector";
import { useTableFilters } from "@/hooks/use-table-filters";
import { useState } from "react";

interface UseActivityFiltersProps {
    page: number;
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
        onChangeReactive: (op: SelectOption) => setChangeFilters({ op, index: 1 })
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
