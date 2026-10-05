"use client";

import { useEffect, useState } from "react";
import { calculateScrollProgress } from "./calculate-scroll-progress";

export default function ScrollProgressBar() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    let animationFrame = 0;

    function recalculateScrollProgress() {
      if (animationFrame) {
        return;
      }

      animationFrame = requestAnimationFrame(() => {
        const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

        setScrollProgress(calculateScrollProgress(scrollTop, scrollHeight, clientHeight));

        animationFrame = 0;
      });
    }

    document.addEventListener("scroll", recalculateScrollProgress, { passive: true });

    recalculateScrollProgress();

    return () => {
      document.removeEventListener("scroll", recalculateScrollProgress);

      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, []);

  return (
    <div id="scroll-progress-bar" className="fixed pointer-events-none top-0 left-0 z-50 h-0.5 w-full aria-hidden='true'">
      <div className="h-full bg-[#F5F5F5] dark:bg-[#050505]">
        <div
          className="h-full origin-left bg-[#050505] transition-transform duration-100 ease-out dark:bg-[#F5F5F5]"
          style={{ transform: `scaleX(${scrollProgress / 100})` }}
        />
      </div>
    </div>
  );
}
