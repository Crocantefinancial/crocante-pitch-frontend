import { DateValueType } from "@/components/core/date-picker";
import { Button, DatePicker, Input } from "@/components/index";
import { useState } from "react";

export interface InfoConfirmProps {
  birthday: Date;
  city: string;
  country: string;
  address: string;
  zipCode: string;
  phoneNumber: string;
}
interface InfoComponentProps {
  onCancel: () => void;
  onConfirm: (props: InfoConfirmProps) => void;
}

export default function Info({ onCancel, onConfirm }: InfoComponentProps) {
  const [birthday, setBirthday] = useState<DateValueType>(null);
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [address, setAddress] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [calendarVisible, setCalendarVisible] = useState(false);
  return (
    <div className="space-y-4">
      <div className="flex flex-col mt-8">
        <DatePicker
          placeholder="Birthdate"
          value={birthday}
          onChange={setBirthday}
          onVisibilityChange={(isVisible) => setCalendarVisible(isVisible)}
        />
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
          disabled={!birthday || calendarVisible}
          onClick={() => {
            onConfirm({
              birthday: birthday,
              city: city,
              country: country,
              address: address,
              zipCode: zipCode,
              phoneNumber: phoneNumber,
            } as InfoConfirmProps);
          }}
        >
          Confirm
        </Button>
        <Button
          variant="secondary"
          disabled={calendarVisible}
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
