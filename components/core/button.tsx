import clsx from "clsx";
export type ButtonVariant =
  | "primary"
  | "secondary"
  | "tertiary"
  | "outline"
  | "outline-secondary";
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  isLoading?: boolean;
  className?: string;
}

export default function Button({
  children,
  onClick,
  variant = "primary",
  disabled = false,
  isLoading = false,
  className = "",
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
      "bg-transparent border-primary text-primary \
      hover:bg-neutral hover:border-neutral hover:text-textDark \
      active:bg-primary active:border-primary active:text-textDark active:opacity-90 \
      cursor-pointer",
    "outline-secondary":
      "bg-transparent border-neutral text-accent \
      hover:bg-neutral hover:border-neutral hover:text-textDark \
      active:bg-secondary active:border-secondary active:text-textDark active:opacity-90 \
      cursor-pointer",
  };

  const disabledClasses =
    "!bg-disabled !border-disabled !text-textMuted !cursor-not-allowed";

  const loadingClasses = "!bg-primary !border-primary !text-textDark";

  // Extract justify-* and flex-* utilities from className to apply to inner div
  const justifyMatch = className.match(
    /justify-(between|around|evenly|start|end|center)/
  );
  const flexMatch = className.match(/flex-(col|row)/);
  const justifyClass = justifyMatch ? justifyMatch[0] : "";
  const flexClass = flexMatch ? flexMatch[0] : "";

  const buttonClassName = className
    .replace(/justify-(between|around|evenly|start|end|center)/g, "")
    .replace(/flex-(col|row)/g, "")
    .trim();

  const buttonClasses = clsx(
    variants[variant],
    buttonClassName,
    disabled && disabledClasses,
    isLoading && loadingClasses
  );

  const innerDivClasses = clsx(
    "flex items-center min-h-[1.1rem]",
    flexClass,
    justifyClass,
    "[&>*:first-child]:mr-2 [&>*:last-child]:ml-2"
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
