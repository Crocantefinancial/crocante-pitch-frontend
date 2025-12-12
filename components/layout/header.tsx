interface HeaderProps {
  title: string;
  customAdditionalHeader: React.ReactNode;
}

export default function Header({ title, customAdditionalHeader }: HeaderProps) {
  return (
    <div className="bg-white px-8 py-4 flex items-center justify-between">
      <h1 className="text-3xl font-semibold text-neutral-900">{title}</h1>
      {customAdditionalHeader}
    </div>
  );
}
