import { Button, Dropzone } from "@/components/index";
import { useState } from "react";

export interface DocumentsConfirmProps {
  documents: File[];
}

interface DocumentsComponentProps {
  onCancel: () => void;
  onConfirm: (props: DocumentsConfirmProps) => void;
}

export default function Documents({
  onCancel,
  onConfirm,
}: DocumentsComponentProps) {
  const [idFront, setIdFront] = useState<File | null>(null);
  const [idBack, setIdBack] = useState<File | null>(null);
  const [proofOfAddress, setProofOfAddress] = useState<File | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex flex-col mt-8">
        <label className="block mb-1 font-montserrat font-normal text-xs leading-none text-neutral h-[1.2em]">
          Documents
        </label>
        <div className="flex flex-col gap-2">
          <Dropzone
            label="ID Front"
            onFileSelect={setIdFront}
            accept="image/*,.pdf"
          />
          <Dropzone
            label="ID Back"
            onFileSelect={setIdBack}
            accept="image/*,.pdf"
          />
          <Dropzone
            label="Driver's Lic. or Proof of Address"
            onFileSelect={setProofOfAddress}
            accept="image/*,.pdf"
          />
        </div>
      </div>

      <div className="flex flex-row justify-between mt-4 gap-2">
        <Button
          variant="primary"
          onClick={() => {
            const documents = [idFront, idBack, proofOfAddress].filter(
              Boolean
            ) as File[];
            onConfirm({
              documents,
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
