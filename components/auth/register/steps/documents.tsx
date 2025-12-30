import { Button, Label } from "@/components/index";
import { UploadIcon } from "lucide-react";

export interface DocumentsConfirmProps {
  documents: string[];
}

interface DocumentsComponentProps {
  onCancel: () => void;
  onConfirm: (props: DocumentsConfirmProps) => void;
}

export default function Documents({
  onCancel,
  onConfirm,
}: DocumentsComponentProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col mt-8">
        <label className="block mb-1 sm:mb-2 font-montserrat font-normal text-xs sm:text-sm leading-none text-neutral h-[1.2em]">
          Documents
        </label>
        <div className="flex flex-col gap-2">
          <Button variant="outline" className="w-full">
            <UploadIcon className="w-4 h-4" />
            ID Front
          </Button>
          <Button variant="outline" className="w-full">
            <UploadIcon className="w-4 h-4" />
            ID Back
          </Button>
          <Button variant="outline" className="w-full">
            <UploadIcon className="w-4 h-4" />
            Driver's Lic. or Proof of Address
          </Button>
        </div>
      </div>

      <div className="flex flex-row justify-between mt-4 gap-2">
        <Button
          variant="primary"
          onClick={() => {
            onConfirm({
              documents: [],
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
