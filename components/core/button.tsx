import clsx from "clsx";
export type ButtonVariant =
  | "primary"
  | "secondary"
  | "tertiary"
  | "outline"
  | "outline-secondary"
  | "nav";
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  isLoading?: boolean;
  className?: string;
  isActive?: boolean;
}

export default function Button({
  children,
  onClick,
  variant = "primary",
  disabled = false,
  isLoading = false,
  className = "",
  isActive = false,
  ...props
}: ButtonProps) {
  const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
    primary:
      "bg-primary border-primary-foreground text-primary-foreground \
      hover:bg-primary/90",
    secondary:
      "bg-secondary/10 text-secondary-foreground \
      hover:bg-secondary/90",
    tertiary:
      "bg-accent border-accent text-textDark \
      hover:bg-neutral hover:border-neutral hover:text-textDark hover:opacity-95 \
      active:bg-accent active:border-accent active:text-textDark active:opacity-80 \
      cursor-pointer",
    outline:
      "bg-transparent text-primary \
      text-neutral-700 hover:bg-secondary/90 \
      active:bg-primary/10 active:text-primary active:border-l-2 active:border-primary",
    nav: "w-full px-6 py-3 flex items-center gap-3 text-sm font-normal transition-all duration-200 \
      text-neutral-700 hover:bg-neutral-50",
    "outline-secondary":
      "bg-transparent border-neutral text-accent \
      hover:bg-neutral hover:border-neutral hover:text-textDark \
      active:bg-secondary active:border-secondary active:text-textDark active:opacity-90 \
      cursor-pointer",
  };

  const disabledClasses =
    "!bg-disabled !border-disabled !text-neutral-500 !cursor-not-allowed";

  const loadingClasses = "!bg-primary !border-primary !text-textDark";

  // Extract justify-*, flex-*, and gap-* utilities from className to apply to inner div
  const justifyMatch = className.match(
    /justify-(between|around|evenly|start|end|center)/
  );
  const flexMatch = className.match(/flex-(col|row)/);
  const gapMatch = className.match(/gap-(\d+|\[.*?\])/);
  const justifyClass = justifyMatch ? justifyMatch[0] : "";
  const flexClass = flexMatch ? flexMatch[0] : "";
  const gapClass = gapMatch ? gapMatch[0] : "";

  const buttonClassName = className
    .replace(/justify-(between|around|evenly|start|end|center)/g, "")
    .replace(/flex-(col|row)/g, "")
    .replace(/gap-(\d+|\[.*?\])/g, "")
    .trim();

  const activeClasses =
    variant === "nav" && isActive
      ? "bg-primary/10 text-primary border-l-4 border-primary"
      : "";

  const buttonClasses = clsx(
    variants[variant],
    activeClasses,
    buttonClassName,
    disabled && disabledClasses,
    isLoading && loadingClasses
  );

  const innerDivClasses = clsx(
    "flex items-center min-h-[1.1rem] w-full",
    flexClass,
    justifyClass,
    gapClass ||
      (justifyClass ? "gap-2" : "[&>*:first-child]:mr-2 [&>*:last-child]:ml-2")
  );

  return (
    <button
      {...props}
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-disabled={disabled || isLoading}
      aria-busy={isLoading}
      data-loading={isLoading || undefined}
      className={buttonClasses}
    >
      {isLoading ? (
        <div className={clsx(innerDivClasses, "gap-2")}>
          <span>{children}</span>
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className={innerDivClasses}>{children}</div>
      )}
    </button>
  );
}
