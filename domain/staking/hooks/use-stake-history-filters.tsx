import { SelectOption } from "@/components/core/select";
import { useSelector } from "@/hooks/use-selector";
import { useTableFilters } from "@/hooks/use-table-filters";
import { useState } from "react";

interface UseStakeHistoryFiltersProps {
    page: number;
}
export function useStakeHistoryFilters({ page }: UseStakeHistoryFiltersProps) {
    const statusOptions: Array<SelectOption> = [
        { id: "Active", label: "Active", value: "Active" },
        { id: "Redeemed", label: "Redeemed", value: "Redeemed" },
    ];
    const statusOptionsRecord = statusOptions.reduce(
        (acc, option) => {
            acc[option.id] = option;
            return acc;
        },
        {} as Record<string, SelectOption>
    );

    const [status, setStatus] = useState<string[]>(["Active"]);
    const [changeFilters, setChangeFilters] = useState<{ op: SelectOption, index: number }>({ op: statusOptions[0], index: 0 });

    const handleSetFilters = (filters: string[][]) => {
        setStatus(filters[0] || ["Active"]);
    }

    const resetSelectors = () => {
        resetStatusSelector();
        setChangeFilters({ op: statusOptions[0], index: 0 });
    }

    const {
        selectedIndex: selectedStatusIndex,
        reset: resetStatusSelector,
        change: changeStatusSelection,
    } = useSelector<SelectOption>(statusOptionsRecord, 0, {
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
        status: status[0],
        statusSelector: {
            selectedIndex: selectedStatusIndex,
            onChange: changeStatusSelection,
            options: statusOptions,
        }
    }
}
