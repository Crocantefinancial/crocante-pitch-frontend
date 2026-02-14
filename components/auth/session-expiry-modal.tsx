import { Button, Modal } from "@/components/index";
import { Clock } from "lucide-react";
import { useEffect, useState } from "react";

const WARN_BEFORE_MS = 30 * 1000; // 30 seconds

function useCountdown(expiresAt: number | null, open: boolean) {
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);

  useEffect(() => {
    if (!open || expiresAt == null) {
      setSecondsLeft(null);
      return;
    }
    const update = () => {
      const remaining = Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000));
      setSecondsLeft(remaining);
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [expiresAt, open]);

  return secondsLeft;
}

export default function SessionExpiryModal({
  open,
  expiresAt,
  onRenew,
  isRenewing,
}: {
  open: boolean;
  expiresAt: number | null;
  onRenew: () => void;
  isRenewing: boolean;
}) {
  const secondsLeft = useCountdown(expiresAt, open);

  return (
    <Modal
      open={open}
      onClose={() => {}}
      title="Session expiring soon"
      icon={<Clock className="w-5 h-5 text-muted-foreground" />}
      blockClose
    >
      <div>
        <p>
          Your session will expire in{" "}
          {secondsLeft != null ? `${secondsLeft} second${secondsLeft !== 1 ? "s" : ""}` : "…"}.{" "}
          Renew to stay signed in.
        </p>
        <div className="flex justify-end mt-6">
          <Button
            variant="primary"
            onClick={onRenew}
            disabled={isRenewing}
          >
            {isRenewing ? "Renewing…" : "Renew session"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export { WARN_BEFORE_MS };
