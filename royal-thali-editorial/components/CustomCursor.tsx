"use client";

import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const cursor = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)");
    if (!mq.matches) return;

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let rx = x;
    let ry = y;

    const move = (event: MouseEvent) => {
      x = event.clientX;
      y = event.clientY;
    };

    const overInteractive = (element: Element | null) =>
      Boolean(element?.closest("a, button, [data-cursor='grow'], input, textarea, select"));

    const enter = (event: MouseEvent) => {
      if (!cursor.current || !ring.current) return;
      const target = event.target as Element | null;
      cursor.current.dataset.active = overInteractive(target) ? "true" : "false";
      ring.current.dataset.active = overInteractive(target) ? "true" : "false";
    };

    const tick = () => {
      rx += (x - rx) * 0.18;
      ry += (y - ry) * 0.18;
      if (cursor.current) {
        cursor.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      }
      if (ring.current) {
        ring.current.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      }
      requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("mouseover", enter, { passive: true });
    const frame = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", enter);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <>
      <div
        ref={ring}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[100] hidden h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[rgba(43,35,32,0.28)] md:block"
        style={{
          transition: "width 220ms ease, height 220ms ease, opacity 220ms ease",
          opacity: 0.82
        }}
        data-active="false"
      />
      <div
        ref={cursor}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[101] hidden h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#2b2320] md:block"
        style={{ transition: "transform 70ms linear" }}
        data-active="false"
      />
      <style jsx>{`
        [data-active="true"] {
          width: 52px !important;
          height: 52px !important;
          opacity: 0.45 !important;
        }
      `}</style>
    </>
  );
}
