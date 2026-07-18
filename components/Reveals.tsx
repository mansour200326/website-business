"use client";

import { useEffect } from "react";

/**
 * Scroll reveals — ports the prototype's IntersectionObserver that adds the
 * `in` class to every `.rv` element as it enters the viewport. Mounted once.
 */
export default function Reveals() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>(".rv"));

    // prefers-reduced-motion: the CSS already forces everything visible.
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      els.forEach((el) => el.classList.add("in"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return null;
}
