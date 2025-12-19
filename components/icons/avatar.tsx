import clsx from "clsx";

export default function AvatarIcon({
  initials,
  color = "primary",
  className,
}: {
  initials: string;
  color?: "primary" | "accent";
  className?: string;
}) {
  const colorClass =
    color === "primary"
      ? "bg-primary/10 text-primary"
      : "bg-accent/10 text-accent";
  return (
    <div
      className={clsx(
        "w-8 h-8 rounded-full flex items-center justify-center",
        colorClass,
        className
      )}
    >
      <span className="text-xs font-semibold">{initials.toUpperCase()}</span>
    </div>
  );
}
