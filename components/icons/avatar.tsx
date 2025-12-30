import clsx from "clsx";

export default function AvatarIcon({
  initials,
  color = "primary",
  className,
  onClick,
}: {
  initials: string;
  color?: "primary" | "accent" | "secondary" | "outline";
  className?: string;
  onClick?: () => void;
}) {
  const colorClass =
    color === "primary"
      ? "bg-primary/10 text-primary"
      : color === "accent"
      ? "bg-accent/10 text-accent"
      : color === "secondary"
      ? "bg-secondary/10 text-secondary-foreground"
      : color === "outline"
      ? "bg-secondary/10 text-primary border border-primary"
      : "";
  return (
    <div
      onClick={onClick}
      className={clsx(
        "w-8 h-8 rounded-full flex items-center justify-center",
        onClick
          ? "hover:cursor-pointer hover:bg-primary/20"
          : "hover:cursor-default",
        colorClass,
        className
      )}
    >
      <span className="text-xs font-semibold">{initials.toUpperCase()}</span>
    </div>
  );
}
