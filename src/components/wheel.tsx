import { useRef } from "react";
import { gsap } from "gsap";
import Board from "./board";

import "./wheel.css";

const Wheel = () => {
  const layer2Ref = useRef(null);
  const layer4Ref = useRef(null);
  const ballRef = useRef(null);

  const totalNumbers = 37;
  const singleRotation = 360 / totalNumbers;

  // European roulette order (IMPORTANT)
  const wheelNumbers = [
    0, 32, 15, 19, 4, 21, 2, 25, 17,
    34, 6, 27, 13, 36, 11, 30, 8, 23,
    10, 5, 24, 16, 33, 1, 20, 14, 31,
    9, 22, 18, 29, 7, 28, 12, 35, 3, 26
  ];


const getIndexFromNumber = (num: number) => {
  return wheelNumbers.indexOf(parseInt(num.toString()));
};

const getRotationFromNumber = (num: number) => {
  return getIndexFromNumber(num) * singleRotation;
};

const handleSpin = () => {
  const spinDuration = 4;
  const winningNumber = Math.floor(Math.random() * 37);
  console.log(winningNumber);
  

  // Raw spins, then snap to a whole number of pockets so the wheel
  // always stops flush on a pocket boundary — no float drift.
  const rawSpins = 360 * (3 + Math.random() * 3);
  const totalPockets = Math.round(rawSpins / singleRotation);
  
  const snappedSpins = totalPockets * singleRotation;
  
  
  const wheelEndRotation = -snappedSpins;

  // The ball needs to end up over the winning pocket.
  // The pocket's absolute position = its index × singleRotation.
  // But the wheel has rotated under it, so we add wheelEndRotation
  // to keep the ball pointing at the same pocket on the now-rotated wheel.
  const pocketDeg = getRotationFromNumber(winningNumber);
  const ballFinal = pocketDeg + wheelEndRotation;

  const tl = gsap.timeline();

  tl.set(layer2Ref.current, { rotate: 0 }, 0);

  // Wheel
  tl.to(layer2Ref.current, {
    rotate: wheelEndRotation,
    duration: spinDuration,
    ease: "power4.out",
  }, 0);

  // Fret ring (purely decorative counter-spin — not used in ball math)
  tl.to(layer4Ref.current, {
    rotate: -wheelEndRotation * 0.6,
    duration: spinDuration,
    ease: "power3.out",
  }, 0);

  // Ball
  tl.set(ballRef.current, { rotate: 0, y: 0 }, 0);
  tl.to(ballRef.current, {
    rotate: ballFinal,
    duration: spinDuration+2,
    ease: "power2.out",
  }, 0);
  
};

  return (
    <div style={{ textAlign: "center" }}>
      
      <div className="roulette-wheel">
        <div
          ref={layer2Ref}
          className="layer-2 wheel"
        ></div>

        <div className="layer-3"></div>

        <div
          ref={layer4Ref}
          className="layer-4 wheel"
        ></div>

        <div className="layer-5"></div>

        <div ref={ballRef} className="ball-container">
          <div className="ball"></div>
        </div>
      </div>

      <Board />

      {/* Spin Button */}
      <button className="spin-btn" onClick={handleSpin}>
        SPIN
      </button>
    </div>
  );
};

export default Wheel;