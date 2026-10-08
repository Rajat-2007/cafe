"use client";

import { useEffect, useState } from "react";

export default function LoadingScreen() {
  const [value, setValue] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let frame = 0;
    let start = performance.now();
    let hideTimer: ReturnType<typeof setTimeout> | null = null;

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / 1100, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const next = Math.round(eased * 100);
      setValue(next);

      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        hideTimer = setTimeout(() => setVisible(false), 350);
      }
    };

    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      if (hideTimer) clearTimeout(hideTimer);
    };
  }, []);

  useEffect(() => {
    if (!visible) {
      document.body.dataset.loaded = "true";
    }
  }, [visible]);

  return (
    <div
      id="loading-screen"
      className={`fixed inset-0 z-[200] flex items-center justify-center bg-[#fafaf8] px-6 transition-opacity duration-700 ease-in-out ${
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
      aria-hidden="true"
    >
      <div className="w-full max-w-xl text-center">
        <div className="mb-4 editorial-kicker text-[#756b66]">Rasa / editorial dining</div>
        <div className="editorial-serif text-5xl tracking-[-0.05em] md:text-7xl">Preparing the table</div>
        <div className="mx-auto mt-8 h-px w-full max-w-md overflow-hidden bg-[rgba(43,35,32,0.1)]">
          <div
            className="h-full bg-[#2b2320]"
            style={{ width: `${value}%` }}
          />
        </div>
        <div className="mt-3 flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-[#756b66]">
          <span>Edition 01</span>
          <span>{String(value).padStart(2, "0")}%</span>
        </div>
      </div>
    </div>
  );
}
