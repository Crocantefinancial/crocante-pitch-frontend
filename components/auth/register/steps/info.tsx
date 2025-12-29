import { DateValueType } from "@/components/core/date-picker";
import { Button, DatePicker, Input } from "@/components/index";
import { useState } from "react";

interface InfoComponentProps {
  onCancel: () => void;
  onRegister: () => void;
}

export default function Info({ onCancel, onRegister }: InfoComponentProps) {
  const [birthday, setBirthday] = useState<DateValueType>({
    startDate: null,
    endDate: null,
  });
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [address, setAddress] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  return (
    <div className="space-y-4">
      <div className="flex flex-col mt-8">
        <DatePicker value={birthday} onChange={setBirthday} />
        <Input
          type="text"
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <Input
          type="text"
          placeholder="Country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        />
        <Input
          type="text"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <Input
          type="text"
          placeholder="Zip Code"
          value={zipCode}
          onChange={(e) => setZipCode(e.target.value)}
        />
        <Input
          type="text"
          placeholder="Phone Number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
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
