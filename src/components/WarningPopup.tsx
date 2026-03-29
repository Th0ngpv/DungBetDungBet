import "./warningPopup.css";

type WarningPopupProps = {
  message: string;
  onClose: () => void;
};

const WarningPopup = ({ message, onClose }: WarningPopupProps) => {
  return (
    <div className="warning-overlay">
      <div className="warning-box">
        <p>{message}</p>
        <button onClick={onClose}>OK</button>
      </div>
    </div>
  );
};

export default WarningPopup;