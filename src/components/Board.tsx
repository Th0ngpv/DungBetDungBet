import "./board.css";
import boardImg from "../assets/images/Board.png";
import { useState, useEffect } from "react";

type BetZone = {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
};

type Bet = {
  id: string;
  amount: number;
};

type BoardProps = {
  onBetChange: (bets: Bet[]) => void;
  disabled?: boolean;
};

const zones: BetZone[] = [
  { id: "0", x: 0, y: 2, w: 7, h: 71 },
  
  { id: "1", x: 9, y: 51, w: 6, h: 21 },
  { id: "2", x: 9, y: 27, w: 6, h: 21 },
  { id: "3", x: 9, y: 2, w: 6, h: 21 },

  { id: "4", x: 16.5, y: 51, w: 6, h: 21 },
  { id: "5", x: 16.5, y: 27, w: 6, h: 21 },
  { id: "6", x: 16.5, y: 2, w: 6, h: 21 },

  { id: "7", x: 24.5, y: 51, w: 6, h: 21 },
  { id: "8", x: 24.5, y: 27, w: 6, h: 21 },
  { id: "9", x: 24.5, y: 2, w: 6, h: 21 },

  { id: "10", x: 32, y: 51, w: 6, h: 21 },
  { id: "11", x: 32, y: 27, w: 6, h: 21 },
  { id: "12", x: 32, y: 2, w: 6, h: 21 },

  { id: "13", x: 39.5, y: 51, w: 6, h: 21 },
  { id: "14", x: 39.5, y: 27, w: 6, h: 21 },
  { id: "15", x: 39.5, y: 2, w: 6, h: 21 },

  { id: "16", x: 47, y: 51, w: 6, h: 21 },
  { id: "17", x: 47, y: 27, w: 6, h: 21 },
  { id: "18", x: 47, y: 2, w: 6, h: 21 },

  { id: "19", x: 54.5, y: 51, w: 6, h: 21 },
  { id: "20", x: 54.5, y: 27, w: 6, h: 21 },
  { id: "21", x: 54.5, y: 2, w: 6, h: 21 },

  { id: "22", x: 62.5, y: 51, w: 6, h: 21 },
  { id: "23", x: 62.5, y: 27, w: 6, h: 21 },
  { id: "24", x: 62.5, y: 2, w: 6, h: 21 },

  { id: "25", x: 70, y: 51, w: 6, h: 21 },
  { id: "26", x: 70, y: 27, w: 6, h: 21 },
  { id: "27", x: 70, y: 2, w: 6, h: 21 },

  { id: "28", x: 77.5, y: 51, w: 6, h: 21 },
  { id: "29", x: 77.5, y: 27, w: 6, h: 21 },
  { id: "30", x: 77.5, y: 2, w: 6, h: 21 },

  { id: "31", x: 85, y: 51, w: 6, h: 21 },
  { id: "32", x: 85, y: 27, w: 6, h: 21 },
  { id: "33", x: 85, y: 2, w: 6, h: 21 },

  { id: "34", x: 92.5, y: 51, w: 6, h: 21 },
  { id: "35", x: 92.5, y: 27, w: 6, h: 21 },
  { id: "36", x: 92.5, y: 2, w: 6, h: 21 },
  
  
  { id: "even", x: 20, y: 77, w: 14, h: 20 },
  { id: "red", x: 35, y: 77, w: 14, h: 20 },
  { id: "black", x: 50, y: 77, w: 14, h: 20 },
  { id: "odd", x: 65, y: 77, w: 14, h: 20 },
];

const Board = ({ onBetChange, disabled }: BoardProps) => {
  const [bets, setBets] = useState<Bet[]>([]);
  const chipValue = 1000; // default chip


const handleClick = (id: string) => {
  setBets((prev) => {
    const existing = prev.find((b) => b.id === id);

    if (existing) {
      return prev.map((b) =>
        b.id === id ? { ...b, amount: b.amount + chipValue } : b
      );
    }

    return [...prev, { id, amount: chipValue }];
  });
};

useEffect(() => {
  onBetChange(bets);
}, [bets, onBetChange]);
  

  return (
    <div className="board-wrapper">
      <div
        className="board"
        style={{ backgroundImage: `url(${boardImg})` }}
      >
        {zones.map((z) => (
          <div
            key={z.id}
            className="zone"
            style={{
              left: `${z.x}%`,
              top: `${z.y}%`,
              width: `${z.w}%`,
              height: `${z.h}%`,
            }}
            onClick={() => !disabled && handleClick(z.id)}
          >
            {bets
            .filter((b) => b.id === z.id)
            .map((b) => (
                <div className="chip" key={b.id}>
                {b.amount / 1000}k
                </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Board;