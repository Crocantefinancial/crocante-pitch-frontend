import clsx from "clsx";

export default function Badge({
  label,
  variant = "primary",
}: {
  label: string;
  variant?: "primary" | "accent";
}) {
  const variantClasses = clsx({
    "bg-primary/10 text-primary": variant === "primary",
    "bg-accent/10 text-accent": variant === "accent",
  });
  const colorClasses = clsx({
    "bg-primary": variant === "primary",
    "bg-accent": variant === "accent",
  });
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-normal",
        variantClasses
      )}
    >
      <div className={clsx("w-1.5 h-1.5 rounded-full", colorClasses)}></div>
      {label}
    </span>
  );
}
