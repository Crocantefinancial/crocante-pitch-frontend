interface HeaderProps {
  title: string;
  customAdditionalHeader: React.ReactNode;
}

export default function Header({ title, customAdditionalHeader }: HeaderProps) {
  return (
    <div className="relative bg-white px-8 py-4 flex items-center justify-between border-b border-neutral-200 h-[73px]">
      <h1 className="text-3xl font-semibold text-neutral-900">{title}</h1>
      {customAdditionalHeader}
    </div>
  );
}
