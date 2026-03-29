// src/components/Wheel.tsx
import { forwardRef, useImperativeHandle, useRef } from "react";
import { gsap } from "gsap";
import "./spinningWheel.css";

export interface WheelRef {
  spinToNumber: (num: number) => Promise<void>;
}

const Wheel = forwardRef<WheelRef>((_, ref) => {
  const layer2Ref = useRef<HTMLDivElement>(null);
  const layer4Ref = useRef<HTMLDivElement>(null);
  const ballRef = useRef<HTMLDivElement>(null);

  const totalNumbers = 37;
  const singleRotation = 360 / totalNumbers;

  const wheelNumbers = [
    0, 32, 15, 19, 4, 21, 2, 25, 17,
    34, 6, 27, 13, 36, 11, 30, 8, 23,
    10, 5, 24, 16, 33, 1, 20, 14, 31,
    9, 22, 18, 29, 7, 28, 12, 35, 3, 26
  ];

  const getIndex = (num: number) => wheelNumbers.indexOf(num);
  const getRotation = (num: number) => getIndex(num) * singleRotation;

  useImperativeHandle(ref, () => ({
    spinToNumber: (winningNumber: number) => {
      return new Promise<void>((resolve) => {
        const spinDuration = 4;

        const rawSpins = 360 * (3 + Math.random() * 3);
        const totalPockets = Math.round(rawSpins / singleRotation);
        const snappedSpins = totalPockets * singleRotation;
        const wheelEndRotation = -snappedSpins;

        const pocketDeg = getRotation(winningNumber);
        const ballFinal = pocketDeg + wheelEndRotation;

        const tl = gsap.timeline({
          onComplete: () => resolve()
        });

        tl.set(layer2Ref.current, { rotate: 0 }, 0);

        tl.to(layer2Ref.current, {
          rotate: wheelEndRotation,
          duration: spinDuration,
          ease: "power4.out",
        }, 0);

        tl.to(layer4Ref.current, {
          rotate: -wheelEndRotation * 0.6,
          duration: spinDuration,
          ease: "power3.out",
        }, 0);

        tl.set(ballRef.current, { rotate: 0 }, 0);

        tl.to(ballRef.current, {
          rotate: ballFinal,
          duration: spinDuration + 2,
          ease: "power2.out",
        }, 0);
      });
    }
  }));

  return (
    <div className="roulette-wheel">
      <div ref={layer2Ref} className="layer-2 wheel" />
      <div className="layer-3" />
      <div ref={layer4Ref} className="layer-4 wheel" />
      <div className="layer-5" />
      <div ref={ballRef} className="ball-container">
        <div className="ball" />
      </div>
    </div>
  );
});

export default Wheel;