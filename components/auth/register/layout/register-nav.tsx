import { AvatarIcon } from "@/components/index";
import clsx from "clsx";

export default function RegisterNav({
  selectedIndex,
  onSelect,
  navLength,
}: {
  selectedIndex: number;
  onSelect: (index: number) => void;
  navLength: number;
}) {
  return (
    <div className="flex flex-row justify-between mt-4 gap-2">
      {Array.from({ length: navLength }).map((_, index) => (
        <AvatarIcon
          key={index}
          initials={String(index + 1)}
          color={
            index === selectedIndex
              ? "outline"
              : index < selectedIndex
              ? "primary"
              : "accent"
          }
          className={clsx(
            "!w-10 !h-10",
            index > selectedIndex && "hover:cursor-not-allowed"
          )}
          onClick={index < selectedIndex ? () => onSelect(index) : undefined}
        />
      ))}
    </div>
  );
}
