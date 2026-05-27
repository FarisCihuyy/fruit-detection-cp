"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function RandomFloatingBox() {
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!boxRef.current) return;

    const box = boxRef.current;
    const parent = box.parentElement;

    if (!parent) return;

    const moveRandomly = () => {
      const parentWidth = parent.clientWidth;
      const parentHeight = parent.clientHeight;

      const boxWidth = box.clientWidth;
      const boxHeight = box.clientHeight;

      const overflowAmount = 200;

      const randomX =
        Math.random() * (parentWidth + overflowAmount * 2 - boxWidth) -
        overflowAmount;

      const randomY =
        Math.random() * (parentHeight + overflowAmount * 2 - boxHeight) -
        overflowAmount;

      gsap.to(box, {
        x: randomX,
        y: randomY,
        duration: 3,
        ease: "none",
        onComplete: moveRandomly,
      });
    };

    moveRandomly();
  }, []);

  return (
    <div
      ref={boxRef}
      className="absolute inset-0 -z-10 size-200 blur-[350px] rounded-full bg-accent/30 pointer-events-none"
    />
  );
}
