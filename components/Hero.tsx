"use client";

import { useEffect, useState } from "react";
import { site } from "@/config/site";
import { waLink } from "@/lib/whatsapp";

export default function Hero() {
  const { hero } = site;
  const [count, setCount] = useState("00");
  const [counterDone, setCounterDone] = useState(false);

  useEffect(() => {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* opening counter then hero sequence */
    if (reduced) {
      setCounterDone(true);
      document.body.classList.add("loaded");
      return;
    }

    let n = 0;
    const iv = setInterval(() => {
      n += Math.floor(Math.random() * 14) + 6;
      if (n >= 100) {
        n = 100;
        clearInterval(iv);
        setCount("100");
        setTimeout(() => {
          setCounterDone(true);
          document.body.classList.add("loaded");
        }, 180);
      } else {
        setCount(String(n).padStart(2, "0"));
      }
    }, 70);

    return () => clearInterval(iv);
  }, []);

  return (
    <header id="top">
      <div className={`counter${counterDone ? " done" : ""}`} id="counter">
        {count}
      </div>
      <div className="h-eyebrow mono">{hero.eyebrow}</div>
      <h1 id="heroH">
        {hero.headline.map((line, i) => (
          <span className="row" key={i}>
            <span
              className={line.thin ? "thin" : undefined}
              style={{ ["--d" as string]: line.d } as React.CSSProperties}
            >
              {line.text}
            </span>
          </span>
        ))}
      </h1>
      <p className="h-sub">{hero.sub}</p>
      <div className="h-ctas">
        <a className="btn btn-solid" href={waLink()} target="_blank" rel="noopener noreferrer">
          {hero.ctaPrimary}
        </a>
        <a className="btn" href="#work">
          {hero.ctaSecondary}
        </a>
      </div>
      <div className="scroll-cue mono">
        <span className="tick" />
        Scroll
      </div>
    </header>
  );
}
