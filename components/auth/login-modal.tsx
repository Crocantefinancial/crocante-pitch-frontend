import { Button, Input, Modal } from "@/components/index";
import { useLogin } from "@/services/hooks/mutations/use-login";
import { useMock } from "@/services/hooks/mutations/use-mock";
import { AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";

export default function LoginModal({
  open,
  onClose,
  onRegister,
}: {
  open: boolean;
  onClose: () => void;
  onRegister: () => void;
}) {
  const { mutate: loginMutation } = useLogin();
  const { mutate: mockMutation } = useMock();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (open) {
      setUsername("");
      setPassword("");
    }
  }, [open]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Session Expired"
      icon={<AlertCircle className="w-5 h-5 text-muted-foreground" />}
      blockClose
    >
      <div>
        <p>Your session has expired. Please log in again.</p>

        <div className="flex flex-col mt-8">
          <Input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="flex flex-row justify-between mt-4 gap-2">
          <Button
            variant="primary"
            onClick={() => {
              onClose();
              loginMutation({
                username: username,
                password: password,
              });
            }}
          >
            Log in
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              onClose();
              mockMutation();
            }}
          >
            Continue w/mock data
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              onClose();
              onRegister();
            }}
          >
            Register new account
          </Button>
        </div>
      </div>
    </Modal>
  );
}
