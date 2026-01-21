import ActivityTable from "./components/activity-table";

export default function Activity() {
    return (
        <div className="space-y-8">
            <div className="bg-card rounded-lg p-6">
                <h2 className="text-xl font-semibold text-foreground mb-4">
                    <ActivityTable />
                </h2>
            </div>
        </div>
    );
}
