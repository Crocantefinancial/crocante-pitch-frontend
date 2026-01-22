import { useState } from "react";
import ActivityFilters from "./components/activity-filters";
import ActivityTable from "./components/activity-table";

export default function Activity() {
    const [page, setPage] = useState(0);
    const [status, setStatus] = useState<string[]>([]);
    const [txType, setTxType] = useState<string[]>([]);

    return (
        <div className="space-y-8 p-8 bg-white">
            <ActivityFilters
                setPageCallback={setPage}
                setStatusCallback={setStatus}
                setTxTypeCallback={setTxType}
            />
            <ActivityTable
                page={page}
                status={status}
                txType={txType}
            />
        </div>
    );
}
