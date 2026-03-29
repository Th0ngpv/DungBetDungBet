// src/components/Game.tsx
import { useRef, useState } from "react";
import Wheel, { type WheelRef } from "./Wheel";
import Board from "./Board";

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

  const getColor = (num: number) => {
    if (num === 0) return "green";
    const reds = [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36];
    return reds.includes(num) ? "red" : "black";
  };

  const evaluateBets = (winningNumber: number, bets: Bet[]) => {
  let totalWin = 0;

  const reds = [
    1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36
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
  

  setIsSpinning(true);

  const winningNumber = Math.floor(Math.random() * 37);

  await wheelRef.current?.spinToNumber(winningNumber);

  setLastResult(winningNumber);

  const totalBet = bets.reduce((sum, b) => sum + b.amount, 0);

  setBalance((prev) => prev - totalBet);

  const win = evaluateBets(winningNumber, bets);
  setBalance((prev) => prev + win);

  // reset
  setRound((r) => r + 1);
  setBets([]);

  setIsSpinning(false);
};


  return (
    <div style={{ textAlign: "center" }}>
      
      {/* Balance */}
      <h2>
        Balance: {balance >= 1000000 ? `${balance / 1000000}tr` : `${balance / 1000}k`}
      </h2>

      

      {/* Wheel */}
      <Wheel ref={wheelRef} />

      {/* Spin Button */}
      <button className="spin-btn" onClick={handleSpin} disabled={isSpinning}>
        {isSpinning ? "Spinning..." : "SPIN"}
      </button>

      <Board 
        key={round}
        onBetChange={handleBetChange}
        disabled={isSpinning}
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