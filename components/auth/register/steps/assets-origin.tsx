import { SelectOption } from "@/components/core/select";
import { Button, Label, RadioGroup, Select } from "@/components/index";
import { useSelector } from "@/hooks/use-selector";

export interface AssetsOriginConfirmProps {
  assetsOrigin: string;
  politicallyExposed: boolean;
}
interface AssetsOriginComponentProps {
  onCancel: () => void;
  onConfirm: (props: AssetsOriginConfirmProps) => void;
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

const assetsOriginOptionsRecord: Record<string, SelectOption> =
  Object.fromEntries(assetsOriginOptions.map((option) => [option.id, option]));

const politicallyExposedOptions: Array<SelectOption> = [
  { id: "Yes", label: "Yes", value: "Yes" },
  { id: "No", label: "No", value: "No" },
];

const politicallyExposedOptionsRecord: Record<string, SelectOption> =
  Object.fromEntries(
    politicallyExposedOptions.map((option) => [option.id, option])
  );

export default function AssetsOrigin({
  onCancel,
  onConfirm,
}: AssetsOriginComponentProps) {
  const {
    selectedRow: selectedAssetsOrigin,
    selectedIndex: selectedAssetsOriginIndex,
    change: changeAssetsOriginSelection,
  } = useSelector<SelectOption>(assetsOriginOptionsRecord, 0, {});

  const {
    selectedRow: selectedPoliticallyExposed,
    selectedIndex: selectedPoliticallyExposedIndex,
    change: changePoliticallyExposedSelection,
  } = useSelector<SelectOption>(politicallyExposedOptionsRecord, 0, {});

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

        <RadioGroup
          className="w-full mt-8 mb-4"
          label="Politically exposed"
          options={politicallyExposedOptions}
          selectedIndex={selectedPoliticallyExposedIndex}
          onChange={changePoliticallyExposedSelection}
        />
      </div>

      <div className="flex flex-row justify-between mt-4 gap-2">
        <Button
          variant="primary"
          onClick={() => {
            onConfirm({
              assetsOrigin: selectedAssetsOrigin?.value ?? "",
              politicallyExposed: selectedPoliticallyExposed?.value === "Yes",
            });
          }}
        >
          Confirm
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
