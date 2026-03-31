// src/components/Game.tsx
import { useRef, useState } from "react";
import Wheel, { type WheelRef } from "./SpinningWheel";
import Board from "./Board";
import Notification from "./Notification";
import WarningPopup from "./WarningPopup";

import decoLeft from "../assets/images/deco_left.png";
import decoRight from "../assets/images/deco_right.png";

import win1 from "../assets/sounds/win1.mp3";
import win2 from "../assets/sounds/win2.mp3";
import win3 from "../assets/sounds/win3.mp3";

import lose1 from "../assets/sounds/lose1.mp3";
import lose2 from "../assets/sounds/lose2.mp3";
import lose3 from "../assets/sounds/lose3.mp3";

const winningSounds = [win1, win2, win3];
const losingSounds = [lose1, lose2, lose3];

import "./Game.css";

type Bet = {
  id: string;
  amount: number;
};

type WarningInfo = {
  message: string;
  loss?: number;
  win?: number;
  winningNumber?: number;
};


const Game = () => {
  const wheelRef = useRef<WheelRef>(null);

  const [round, setRound] = useState(0);

  const [bets, setBets] = useState<Bet[]>([]);
  const [balance, setBalance] = useState(5000000);

  const [isSpinning, setIsSpinning] = useState(false);

  const [notification, setNotification] = useState<{
    message: string;
    type?: "success" | "error" | "info";
  } | null>(null);

  const [warningPopup, setWarningPopup] = useState<WarningInfo | null>(null);

  const warnings = [
    "Cờ bạc dễ nghiện lắm.\nMột lần “bet cho vui” thành “bết” lúc nào không hay.🥀",
    "Nhà cái không cần thắng bạn ngay.\nChỉ cần bạn chơi đủ lâu.🤯",
    "Chơi cho vui thì được.\nNhưng nếu bắt đầu nghĩ kiếm tiền từ đây — là bắt đầu “bết” rồi.🥀",
  ];

  const notify = (message: string, type?: "success" | "error" | "info") => {
    setNotification({ message, type });
  };


  const evaluateBets = (winningNumber: number, bets: Bet[]) => {
    let totalWin = 0;

    const reds = [
      1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36
    ];

    const isRed = (n: number) => reds.includes(n);

    bets.forEach((bet) => {
      const id = bet.id;
      const amount = bet.amount;

      // number
      if (!isNaN(Number(id))) {
        if (Number(id) === winningNumber) {
          totalWin += amount * 35;
        }
      }

      // red/black
      if (id === "red" && isRed(winningNumber)) {
        totalWin += amount * 2;
      }

      if (id === "black" && winningNumber !== 0 && !isRed(winningNumber)) {
        totalWin += amount * 2;
      }

      // even/odd
      if (id === "even" && winningNumber !== 0 && winningNumber % 2 === 0) {
        totalWin += amount * 2;
      }

      if (id === "odd" && winningNumber % 2 === 1) {
        totalWin += amount * 2;
      }
    });

    return totalWin;
  };

  const handleBetChange = (newBets: Bet[]) => {
    setBets(newBets);
  };

  const handleSpin = async () => {
    if (isSpinning) return;

    if (bets.length === 0) {
      notify("Hãy Đặt cược trước!", "error");
      return;
    }

    setIsSpinning(true);
    notify("Đang quay...", "info");

    const winningNumber = Math.floor(Math.random() * 37);
    await wheelRef.current?.spinToNumber(winningNumber);

    const totalBet = bets.reduce((sum, b) => sum + b.amount, 0);
    const win = evaluateBets(winningNumber, bets);

    setBalance((prev) => prev - totalBet + win);

    // always show popup with full info
    const randomWarning = warnings[Math.floor(Math.random() * warnings.length)];

    setWarningPopup({
      message: randomWarning,
      loss: totalBet > win ? totalBet - win : 0,
      win: win > 0 ? win : 0,
      winningNumber,
    });

    // 🎵 Delayed audio after 6.5 seconds
    setTimeout(() => {
      let audio: HTMLAudioElement;
      if (win > 0) {
        const randomWin = winningSounds[Math.floor(Math.random() * winningSounds.length)];
        audio = new Audio(randomWin);
      } else {
        const randomLose = losingSounds[Math.floor(Math.random() * losingSounds.length)];
        audio = new Audio(randomLose);
      }

      audio.play().catch((err) => console.log("Audio play failed:", err));
    }, 0);

    // 🎉 RESULT NOTIFICATION
    if (win > 0) {
      notify(`Bạn đã thắng ${(win / 1000000).toFixed(1)}Tr!`, "success");
    } else {
      notify("Bạn đã thua !", "error");
    }

    // reset bets and round
    setRound((r) => r + 1);
    setBets([]);
    setIsSpinning(false);
  };

  return (

    <div style={{ textAlign: "center" }}>

      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      {warningPopup && (
        <WarningPopup
          message={warningPopup.message}
          loss={warningPopup.loss}
          win={warningPopup.win}
          winningNumber={warningPopup.winningNumber}
          onClose={() => setWarningPopup(null)}
        />
      )}

      {/* Header with title and balance */}
      <div className="header-bar">
        <div className="header-spacer"></div>  {/* empty left space */}
        <div className="header-title">Loay hoay Xoay roulette</div>
        <div className="header-balance">
          Tiền Vốn: {balance >= 1000000 ? `${balance / 1000000}tr` : `${balance / 1000}k`}
        </div>
      </div>



      {/* Wheel */}
      <Wheel ref={wheelRef} />

      {/* Spin Button with Decorative Images */}
      <div className="spin-container">
        <img
          src={decoLeft}
          alt="Left decoration"
          className="spin-decor left"
        />

        <button
          className="spin-btn"
          onClick={handleSpin}
          disabled={isSpinning}
        >
          {isSpinning ? "Đang quay..." : "Quay!"}
        </button>

        <img
          src={decoRight}
          alt="Right decoration"
          className="spin-decor right"
        />
      </div>

      <Board
        key={round}
        onBetChange={handleBetChange}
        disabled={isSpinning}
        balance={balance}
        showNotification={notify} // 🔥 NEW
      />
    </div>
  );
};

export default Game;