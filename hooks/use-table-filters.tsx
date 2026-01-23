import { SelectOption, SelectorProps } from "@/components/core/select";
import { useModal } from "@/hooks/use-modal";
import { useEffect, useRef, useState } from "react";

interface UseTableFiltersProps {
    page: number;
    selectors: SelectorProps[];
    resetSelectors: () => void;
    setFilters: (filters: string[][]) => void;
    handleChangeFilters: { op: SelectOption, index: number } | undefined;
}

export function useTableFilters({ page, selectors, setFilters, resetSelectors, handleChangeFilters }: UseTableFiltersProps) {
    const [pageLocal, setPageLocal] = useState(page);
    const [filtersClassName, setFiltersClassName] = useState("secondary");
    const [activeFilters, setActiveFilters] = useState("");

    const handleResetFilters = () => {
        resetSelectors();
        setFiltersClassName("secondary");
        setActiveFilters("");
        setPageLocal(1);
    }

    const {
        isOpen: filtersModalOpen,
        open: openFiltersModal,
        close: closeFiltersModal,
    } = useModal(false, {
        onOpen: handleResetFilters,
    });

    const onChangeFilters = (op: SelectOption, index: number) => {
        const filtersValues: string[] = [];
        const filtersLabels: string[] = [];
        Array.from({ length: selectors.length }).forEach((_, i) => {
            const currentSelector = selectors[i].options[selectors[i].selectedIndex];
            let label;
            let value;
            if (i === index) {
                value = op.value!;
                label = op.label!;
            } else {
                value = currentSelector?.value || "";
                label = currentSelector?.label || "";
            }
            filtersValues.push(value);
            label = label === "None" ? "" : label;
            filtersLabels.push(label);
        });

        const noActiveFilters = filtersValues.every(value => value === "");
        setFiltersClassName(noActiveFilters ? "secondary" : "outline");
        setActiveFilters(noActiveFilters ? "" : filtersLabels.filter(label => label !== "").join(" "));
        if (pageLocal !== 1) {
            setPageLocal(1);
        }
    }

    useEffect(() => {
        if (handleChangeFilters) onChangeFilters(handleChangeFilters.op, handleChangeFilters.index);
    }, [handleChangeFilters?.op, handleChangeFilters?.index]);

    useEffect(() => {
        setPageLocal(page);
    }, [page]);

    const selectorValuesKey = selectors.map(s => `${s.selectedIndex}:${s.options[s.selectedIndex]?.value || ''}`).join('|');
    const prevFiltersRef = useRef<string>(selectorValuesKey);

    useEffect(() => {
        if (prevFiltersRef.current !== selectorValuesKey) {
            prevFiltersRef.current = selectorValuesKey;
            const newFilters: string[][] = [];
            selectors.forEach((selector) => {
                newFilters.push([selector.options[selector.selectedIndex]?.value || ""]);
            });
            setFilters(newFilters);
        }
    }, [selectorValuesKey, selectors, setFilters]);

    return {
        page: pageLocal,
        filtersClassName,
        activeFilters,
        openFiltersModal,
        filtersModalOpen,
        closeFiltersModal,
    }
}
