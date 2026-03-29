import { useEffect } from "react";
import "./Notification.css";

type NotificationProps = {
  message: string;
  type?: "success" | "error" | "info";
  onClose: () => void;
  duration?: number;
};

const Notification = ({
  message,
  type = "info",
  onClose,
  duration = 2000,
}: NotificationProps) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div className={`notification ${type}`}>
      {message}
    </div>
  );
};

export default Notification;