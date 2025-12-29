import RegisterNav from "./register-nav";

interface RegisterHeaderProps {
  title: string;
  selectedIndex: number;
  onSelect: (index: number) => void;
}
export default function RegisterHeader({
  title,
  selectedIndex,
  onSelect,
}: RegisterHeaderProps) {
  return (
    <div className="flex flex-row gap-2 justify-between">
      <p>{title}</p>
      <RegisterNav selectedIndex={selectedIndex} onSelect={onSelect} />
    </div>
  );
}
