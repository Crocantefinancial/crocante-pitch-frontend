import { Button, Label } from "@/components/index";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { useState } from "react";
import ActivityTable from "./components/activity-table";

export default function Activity() {
    const [page, setPage] = useState(1);

    const handlePageChange = (page: number) => {
        setPage(page);
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-end gap-0 mb-4 ml-auto">
                <Button variant="primary" className="text-xs" onClick={() => handlePageChange(1)}>
                    1
                </Button>
                <Button variant="outline" className="text-xs" onClick={() => handlePageChange(page > 1 ? page - 1 : 1)}>
                    <ArrowLeftIcon className="w-4 h-4" />
                </Button>
                <Label label={`${page}`} />
                <Button variant="outline" className="text-xs" onClick={() => handlePageChange(page + 1)}>
                    <ArrowRightIcon className="w-4 h-4" />
                </Button>
                <Button variant="primary" className="text-xs" onClick={() => handlePageChange(page + 10)}>
                    10+
                </Button>
            </div>
            <ActivityTable page={page} />
        </div>
    );
}
