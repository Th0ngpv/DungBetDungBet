import { useEffect } from "react";
import "./warningPopup.css";

import win1 from "../assets/sounds/win1.mp3";
import win2 from "../assets/sounds/win2.mp3";
import win3 from "../assets/sounds/win3.mp3";

import lose1 from "../assets/sounds/lose1.mp3";
import lose2 from "../assets/sounds/lose2.mp3";
import lose3 from "../assets/sounds/lose3.mp3";

const winningSounds = [win1, win2, win3];
const losingSounds = [lose1, lose2, lose3];

type WarningPopupProps = {
  message: string;
  loss?: number;       
  win?: number;        
  winningNumber?: number;
  onClose: () => void;
};

const WarningPopup = ({ message, loss, win, winningNumber, onClose }: WarningPopupProps) => {

  useEffect(() => {
    let audio: HTMLAudioElement | null = null;

    if (win && win > 0) {
      const randomWin = winningSounds[Math.floor(Math.random() * winningSounds.length)];
      audio = new Audio(randomWin);
      audio.play();
    } else if (loss && loss > 0) {
      const randomLose = losingSounds[Math.floor(Math.random() * losingSounds.length)];
      audio = new Audio(randomLose);
      audio.play();
    }

    // Cleanup: stop audio if the component unmounts
    return () => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    };
  }, []); // Only run once when popup mounts

  return (
    <div className="warning-overlay">
      <div className="warning-box">
        <p>{message}</p>

        {winningNumber !== undefined && (
          <p className="win-number">{winningNumber}</p>
        )}

        {loss !== undefined && loss > 0 && (
          <p style={{ fontWeight: "bold", marginTop: "5px", color: "red", textShadow: "2px 2px 2px darkred" }}>
            Bạn đã thua: {loss >= 1000000 ? `${(loss / 1000000).toFixed(2)}M` : `${(loss / 1000).toFixed(0)}k`}
          </p>
        )}

        {win !== undefined && win > 0 && (
          <p style={{ fontWeight: "bold", marginTop: "5px", color: "green", textShadow: "2px 2px 2px darkred" }}>
            Mừng ông chủ thắng lớn: {win >= 1000000 ? `${(win / 1000000).toFixed(2)}Tr` : `${(win / 1000).toFixed(0)}k`}
          </p>
        )}

        <button onClick={onClose}>Tiếp Tục</button>
      </div>
    </div>
  );
};

export default WarningPopup;