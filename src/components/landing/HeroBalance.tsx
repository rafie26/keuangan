"use client";

import { useEffect, useRef, useState } from "react";

export default function HeroBalance({ value }: { value: number }) {
  const [display, setDisplay] = useState(value);
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const duration = 1600;
    const start = performance.now();
    let raf: number;

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(value * eased));
      if (progress < 1) {
        raf = requestAnimationFrame(tick);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);

  return <span className="font-tabular">{display.toLocaleString("id-ID")}</span>;
}
