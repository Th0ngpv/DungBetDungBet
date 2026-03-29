// src/components/Game.tsx
import { useRef, useState } from "react";
import Wheel, { type WheelRef } from "./SpinningWheel";
import Board from "./Board";
import Notification from "./Notification";
import WarningPopup from "./WarningPopup";

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
  "Cờ bạc dễ gây nghiện đấy, hãy chơi vừa phải thôi nhé!",
  "Nhà cái lúc nào cũng có lợi thế — chơi lâu dài là sẽ thua thôi.",
  "Chuỗi thắng chỉ là tạm thời, thua là chuyện bình thường.",
  "Đừng đánh bạc với tiền mà bạn không muốn mất nhé!",
  "Trò này chỉ để học và vui thôi, đừng xem là cách kiếm tiền nhé."
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
      notify("Place a bet first!", "error");
      return;
    }

    setIsSpinning(true);

    notify("Spinning...", "info");

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

    // 🎉 RESULT NOTIFICATION
    if (win > 0) {
      notify(`Bạn đã thắng ${(win / 1000000).toFixed(2)}M!`, "success");
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

      {/* Balance */}
      <h2>
        Tiền Vốn: {balance >= 1000000 ? `${balance / 1000000}tr` : `${balance / 1000}k`}
      </h2>



      {/* Wheel */}
      <Wheel ref={wheelRef} />

      {/* Spin Button */}
      <button
        className="spin-btn"
        onClick={handleSpin}
        disabled={isSpinning || bets.length === 0}
      >
        {isSpinning ? "Đang quay..." : "Quay!"}
      </button>

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