// src/components/Game.tsx
import { useRef, useState } from "react";
import Wheel, { type WheelRef } from "./Wheel";
import Board from "./Board";
import Notification from "./Notification";

import "./game.css";

type Bet = {
  id: string;
  amount: number;
};

const Game = () => {
  const wheelRef = useRef<WheelRef>(null);

  const [round, setRound] = useState(0);

  const [bets, setBets] = useState<Bet[]>([]);
  const [balance, setBalance] = useState(5000000);

  const [isSpinning, setIsSpinning] = useState(false);
  const [lastResult, setLastResult] = useState<number | null>(null);

  const [notification, setNotification] = useState<{
    message: string;
    type?: "success" | "error" | "info";
  } | null>(null);

  const notify = (message: string, type?: "success" | "error" | "info") => {
    setNotification({ message, type });
  };

  const getColor = (num: number) => {
    if (num === 0) return "green";
    const reds = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
    return reds.includes(num) ? "red" : "black";
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

    notify("Spinning...", "info"); // 🔥 nice UX

    const winningNumber = Math.floor(Math.random() * 37);

    await wheelRef.current?.spinToNumber(winningNumber);

    setLastResult(winningNumber);

    const totalBet = bets.reduce((sum, b) => sum + b.amount, 0);
    setBalance((prev) => prev - totalBet);

    const win = evaluateBets(winningNumber, bets);
    setBalance((prev) => prev + win);

    // 🎉 RESULT NOTIFICATION
    if (win > 0) {
      notify(`You won ${(win / 1000000).toFixed(2)}M!`, "success");
    } else {
      notify("You lost!", "error");
    }

    // reset
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

      {/* Balance */}
      <h2>
        Balance: {balance >= 1000000 ? `${balance / 1000000}tr` : `${balance / 1000}k`}
      </h2>



      {/* Wheel */}
      <Wheel ref={wheelRef} />

      {/* Spin Button */}
      <button
        className="spin-btn"
        onClick={handleSpin}
        disabled={isSpinning || bets.length === 0}
      >
        {isSpinning ? "Spinning..." : "SPIN"}
      </button>

      <Board
        key={round}
        onBetChange={handleBetChange}
        disabled={isSpinning}
        balance={balance}
        showNotification={notify} // 🔥 NEW
      />



      {/* Result */}
      {lastResult !== null && (
        <div style={{ marginTop: "20px", fontSize: "20px" }}>
          🎯 Result: {lastResult} ({getColor(lastResult)})
        </div>
      )}
    </div>
  );
};

export default Game;