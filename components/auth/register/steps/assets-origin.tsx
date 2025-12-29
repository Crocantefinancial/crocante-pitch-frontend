import { SelectOption } from "@/components/core/select";
import { Button, Select } from "@/components/index";
import { useSelector } from "@/hooks/use-selector";

interface AssetsOriginComponentProps {
  onCancel: () => void;
  onRegister: () => void;
}

enum AssetsOriginType {
  Ahorros = "Ahorros",
  Prestamo = "Prestamo",
  Herencia = "Herencia",
  RegaloDonacion = "Regalo/Donacion",
  VentaPropiedad = "Venta de Propiedad",
  Otro = "Otro",
}

const assetsOriginOptions: Array<SelectOption> = Object.values(
  AssetsOriginType
).map((assetsOrigin) => ({
  id: assetsOrigin,
  label: assetsOrigin,
  value: assetsOrigin,
}));

export default function AssetsOrigin({
  onCancel,
  onRegister,
}: AssetsOriginComponentProps) {
  const {
    selectedRow: selectedAssetsOrigin,
    selectedIndex: selectedAssetsOriginIndex,
    change: changeAssetsOriginSelection,
  } = useSelector<SelectOption>(
    assetsOriginOptions.reduce((acc, assetsOrigin) => {
      acc[assetsOrigin.id] = assetsOrigin;
      return acc;
    }, {} as Record<string, SelectOption>),
    0,
    {
      onChange: () => {
        console.log("selectedAssetsOrigin", selectedAssetsOrigin);
      },
    }
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col mt-8">
        <Select
          className="w-full"
          label="Assets Origin"
          properties={{
            options: assetsOriginOptions,
            selectedIndex: selectedAssetsOriginIndex,
            onChange: changeAssetsOriginSelection,
          }}
        />
      </div>

      <div className="flex flex-row justify-between mt-4 gap-2">
        <Button
          variant="primary"
          onClick={() => {
            onRegister();
          }}
        >
          Register
        </Button>
        <Button
          variant="secondary"
          onClick={() => {
            onCancel();
          }}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
