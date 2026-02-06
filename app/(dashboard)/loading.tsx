export default function DashboardLoading() {
  return (
    <div className="bg-white p-12 flex flex-col gap-8 animate-in fade-in duration-150">
      <div className="flex flex-col gap-4">
        <div className="h-6 w-48 bg-neutral-100 rounded animate-pulse" />
        <div className="h-4 w-full max-w-xl bg-neutral-50 rounded animate-pulse" />
      </div>
      <div className="flex flex-col gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-12 w-full bg-neutral-50 rounded animate-pulse" />
        ))}
      </div>
    </div>
  );
}
