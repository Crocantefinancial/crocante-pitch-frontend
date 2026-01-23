import { Button, Label } from "@/components/index";
import { ArrowLeftIcon, ArrowRightIcon, Eye } from "lucide-react";

export interface TableFiltersProps {
    page: number;
    setPage: (page: number) => void;
    filtersClassName: string;
    activeFilters: string;
    openFiltersModal: () => void;
}

export default function TableFilters({
    page,
    setPage,
    filtersClassName,
    activeFilters,
    openFiltersModal,
}: TableFiltersProps) {
    return (
        <div className="px-2 py-2">
            <div className="flex flex-wrap gap-0">
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
    );
}
