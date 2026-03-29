import "./warningPopup.css";

type WarningPopupProps = {
  message: string;
  loss?: number;       // amount lost this spin
  win?: number;        // amount won this spin
  winningNumber?: number; // the roulette number
  onClose: () => void;
};

const WarningPopup = ({ message, loss, win, winningNumber, onClose }: WarningPopupProps) => {
  return (
    <div className="warning-overlay">
      <div className="warning-box">
        <p>{message}</p>

        {winningNumber !== undefined && (
          <p className="win-number">
            {winningNumber}
          </p>
        )}

        {loss !== undefined && loss > 0 && (
          <p style={{ fontWeight: "bold", marginTop: "5px", color: "red", textShadow: "2px 2x 2px darkred" }}>
            Bạn đã thua: {loss >= 1000000 ? `${(loss / 1000000).toFixed(2)}M` : `${(loss / 1000).toFixed(0)}k`}
          </p>
        )}

        {win !== undefined && win > 0 && (
          <p style={{ fontWeight: "bold", marginTop: "5px", color: "green", textShadow: "2px 2x 2px darkred" }}>
            Mừng ông chủ thắng lớn: {win >= 1000000 ? `${(win / 1000000).toFixed(2)}Tr` : `${(win / 1000).toFixed(0)}k`}
          </p>
        )}

        <button onClick={onClose}>Tiếp Tục</button>
      </div>
    </div>
  );
};

export default WarningPopup;