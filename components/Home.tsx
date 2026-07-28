"use client";

import { useLayoutEffect, useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { site } from "@/config/site";
import type { PortfolioImage } from "@/lib/portfolio";
import { waLink } from "@/lib/whatsapp";
import Nav from "./Nav";
import Footer from "./Footer";

const useIso = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/** Wrap each word of a string in a rising span for kinetic reveals. */
function Kinetic({ text, className }: { text: string; className?: string }) {
  return (
    <span className={`kin ${className ?? ""}`}>
      {text.split(" ").map((w, i) => (
        <span className="kin-word" key={i}>
          {w}
        </span>
      ))}
    </span>
  );
}

export default function Home({ images }: { images: Record<string, PortfolioImage> }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useIso(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return; // CSS renders everything final; dot hidden, static period shown

    gsap.registerPlugin(ScrollTrigger);
    const dot = dotRef.current!;
    const isMobile = window.matchMedia("(max-width: 820px)").matches;
    document.body.classList.add("dot-live"); // hide the static period; the travelling dot takes over

    const ctx = gsap.context(() => {
      const heroSlot = document.querySelector<HTMLElement>('[data-dot-anchor="hero"]')!;
      const dotSize = () => dot.offsetWidth || 14;
      const posOf = (el: HTMLElement) => {
        const r = el.getBoundingClientRect();
        const s = dotSize();
        return { x: r.left + r.width / 2 - s / 2, y: r.top + r.height / 2 - s / 2 };
      };

      // ---- the dot: transforms only, continuous rAF lerp toward the active
      // anchor (closes ~14% of the remaining distance each frame). This flows
      // smoothly during momentum scrolling with no snapping — never top/left. ----
      let active: HTMLElement = heroSlot;
      let cx = 0;
      let cy = 0;
      let rafId = 0;
      let ticking = false;
      const applyDot = () => {
        dot.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      };
      const tick = () => {
        const p = posOf(active);
        cx += (p.x - cx) * 0.14;
        cy += (p.y - cy) * 0.14;
        applyDot();
        rafId = requestAnimationFrame(tick);
      };
      const startFollow = () => {
        if (ticking) return;
        ticking = true;
        dot.style.opacity = "1";
        rafId = requestAnimationFrame(tick);
      };

      // ---- reveals: transform + opacity only ----
      gsap.utils.toArray<HTMLElement>(".kin").forEach((k) => {
        const words = k.querySelectorAll(".kin-word");
        gsap.set(words, { yPercent: 115 });
        ScrollTrigger.create({
          trigger: k,
          start: "top 78%",
          once: true,
          onEnter: () => gsap.to(words, { yPercent: 0, duration: 0.55, stagger: 0.08, ease: "power3.out", force3D: true }),
        });
      });
      gsap.utils.toArray<HTMLElement>(".reveal-fade").forEach((el) => {
        gsap.set(el, { y: 18, opacity: 0 });
        ScrollTrigger.create({
          trigger: el,
          start: "top 85%",
          once: true,
          onEnter: () => gsap.to(el, { y: 0, opacity: 1, duration: 0.6, ease: "power2.out", force3D: true }),
        });
      });
      // Internal full-page reveal — a GPU translate (never object-position) walks
      // the framed screenshot from its top to its bottom as the project passes.
      // For a tall full-page capture this reveals the whole page.
      gsap.utils.toArray<HTMLElement>(".pf-img").forEach((img) => {
        const view = img.closest<HTMLElement>(".pf-view")!;
        gsap.fromTo(
          img,
          { y: 0 },
          {
            y: () => Math.min(0, -(img.offsetHeight - view.offsetHeight)),
            ease: "none",
            force3D: true,
            scrollTrigger: { trigger: view, start: "top bottom", end: "bottom top", scrub: true, invalidateOnRefresh: true },
          }
        );
      });
      // Ghost watermark parallax — desktop only (static on mobile).
      if (!isMobile) {
        gsap.utils.toArray<HTMLElement>(".watermark").forEach((w) => {
          gsap.fromTo(
            w,
            { yPercent: -8 },
            {
              yPercent: 8,
              ease: "none",
              force3D: true,
              scrollTrigger: { trigger: w.closest(".section, .pf"), start: "top bottom", end: "bottom top", scrub: true },
            }
          );
        });
      }
      const tintLayer = document.querySelector<HTMLElement>(".tint-layer")!;
      gsap.utils.toArray<HTMLElement>("[data-tint]").forEach((sec) => {
        const color = sec.getAttribute("data-tint")!;
        const to = (c: string) => gsap.to(tintLayer, { backgroundColor: c, duration: 0.8, ease: "power1.out" });
        ScrollTrigger.create({
          trigger: sec,
          start: "top 55%",
          end: "bottom 45%",
          onEnter: () => to(color),
          onEnterBack: () => to(color),
          onLeave: () => to("#F6F4EF"),
          onLeaveBack: () => to("#F6F4EF"),
        });
      });

      // ---- dot docking anchors ----
      let breathed = false;
      const breathe = () => {
        if (breathed) return;
        breathed = true;
        gsap.fromTo(".close-cta .btn", { scale: 1 }, { scale: 1.05, duration: 0.5, yoyo: true, repeat: 1, ease: "sine.inOut" });
      };
      const attachDotScroll = () => {
        active = heroSlot;
        startFollow();
        gsap.utils.toArray<HTMLElement>("[data-dot-anchor]").forEach((el) => {
          const section = el.closest<HTMLElement>(".pf, .section, .hero, .close") || el;
          const isClose = el.getAttribute("data-dot-anchor") === "close";
          ScrollTrigger.create({
            trigger: section,
            start: "top 58%",
            end: "bottom 42%",
            onEnter: () => {
              active = el;
              if (isClose) breathe();
            },
            onEnterBack: () => {
              active = el;
            },
          });
        });
        ScrollTrigger.refresh();
      };

      // ---- intro: the dot writes the wordmark — EVERY page load ----
      const letters = gsap.utils.toArray<HTMLElement>(".hm-l");
      const mark = document.querySelector<HTMLElement>(".hero-mark")!;
      const mr = mark.getBoundingClientRect();
      const s = dotSize();
      const end = posOf(heroSlot);
      gsap.set(letters, { yPercent: 125, opacity: 0 });
      cx = mr.left - 30;
      cy = mr.top + mr.height * 0.52 - s / 2;
      applyDot();
      dot.style.opacity = "1";

      const finish = () => attachDotScroll();
      const proxy = { x: cx, y: cy };
      const sync = () => {
        cx = proxy.x;
        cy = proxy.y;
        applyDot();
      };
      const tl = gsap.timeline({ onUpdate: sync, onComplete: finish });
      tl.to(letters, { yPercent: 0, opacity: 1, duration: 0.5, stagger: 0.11, ease: "back.out(1.6)", force3D: true }, 0.1);
      tl.to(proxy, { x: end.x, y: end.y, duration: 1.45, ease: "power2.inOut" }, 0);
      tl.to(proxy, { x: end.x + s * 0.7, duration: 0.12, ease: "power2.out" }, 1.45);
      tl.to(proxy, { x: end.x, duration: 0.32, ease: "elastic.out(1,0.5)" }, ">");

      const skip = () => {
        if (tl.progress() < 1) {
          tl.progress(1);
          tl.kill();
          gsap.set(letters, { yPercent: 0, opacity: 1 });
          cx = end.x;
          cy = end.y;
          applyDot();
          finish();
        }
        removeSkip();
      };
      const evts = ["pointerdown", "touchstart", "keydown", "wheel", "scroll"];
      const removeSkip = () => evts.forEach((e) => window.removeEventListener(e, skip));
      evts.forEach((e) => window.addEventListener(e, skip, { once: true, passive: true }));

      // ---- recalc anchor positions on resize and after images load ----
      const refresh = () => ScrollTrigger.refresh();
      window.addEventListener("resize", refresh, { passive: true });
      window.addEventListener("load", refresh, { once: true });
      gsap.utils.toArray<HTMLImageElement>(".pf-img").forEach((im) => {
        if (!im.complete) im.addEventListener("load", refresh, { once: true });
      });

      return () => {
        cancelAnimationFrame(rafId);
        window.removeEventListener("resize", refresh);
        removeSkip();
      };
    }, rootRef);

    // ---- magnetic buttons (desktop, fine pointer) ----
    const fine = window.matchMedia("(pointer:fine)").matches;
    const magnets: Array<() => void> = [];
    if (fine) {
      rootRef.current?.querySelectorAll<HTMLElement>("[data-magnetic]").forEach((btn) => {
        const move = (e: PointerEvent) => {
          const r = btn.getBoundingClientRect();
          gsap.to(btn, { x: (e.clientX - (r.left + r.width / 2)) * 0.25, y: (e.clientY - (r.top + r.height / 2)) * 0.3, duration: 0.3, ease: "power2.out" });
        };
        const reset = () => gsap.to(btn, { x: 0, y: 0, duration: 0.4, ease: "power3.out" });
        btn.addEventListener("pointermove", move);
        btn.addEventListener("pointerleave", reset);
        magnets.push(() => {
          btn.removeEventListener("pointermove", move);
          btn.removeEventListener("pointerleave", reset);
        });
      });
    }

    return () => {
      ctx.revert();
      magnets.forEach((fn) => fn());
      document.body.classList.remove("dot-live");
    };
  }, []);

  const { hero, portfolio, packages, about, process, close } = site;

  return (
    <div ref={rootRef}>
      <div className="tint-layer" aria-hidden="true" />
      <div className="dot" ref={dotRef} aria-hidden="true" />
      <Nav />

      <main>
        {/* HERO */}
        <section className="hero wrap" id="top">
          <h1 className="hero-mark" aria-label="Websmith">
            <span className="hm-letters" aria-hidden="true">
              {"Websmith".split("").map((c, i) => (
                <span className="hm-l" key={i}>
                  {c}
                </span>
              ))}
            </span>
            <span className="hm-slot" aria-hidden="true">
              <span className="dot-anchor" data-dot-anchor="hero" />
              <span className="hm-static-dot">.</span>
            </span>
          </h1>
          <p className="hero-tagline">{hero.tagline}</p>
          <p className="hero-support">{hero.support}</p>
          <div className="hero-cta">
            <a className="btn" data-magnetic href={waLink()} target="_blank" rel="noopener noreferrer">
              {hero.cta}
            </a>
            <a className="tlink sweep" href="#work">
              See the work
            </a>
          </div>
        </section>

        {/* PORTFOLIO */}
        <div id="work">
          {portfolio.map((p, i) => {
            const img = images[p.slug];
            return (
              <section className="pf" data-tint={p.tint} key={p.slug}>
                <div className="wrap pf-grid">
                  <div className="pf-info">
                    <div className="pf-index">
                      <span className="dot-anchor" data-dot-anchor={p.slug} />
                      {`0${i + 1} — Selected work`}
                    </div>
                    <h2 className="pf-name">{p.name}</h2>
                    <p className="pf-blurb reveal-fade">{p.blurb}</p>
                    <a className="pf-live sweep" href={p.liveUrl} target="_blank" rel="noopener noreferrer">
                      Visit live site <span className="arw">→</span>
                    </a>
                  </div>
                  <div className="pf-frame">
                    <div className="pf-bar" aria-hidden="true">
                      <i />
                      <i />
                      <i />
                    </div>
                    <div className="pf-view">
                      {img?.has ? (
                        <Image
                          className="pf-img"
                          src={img.src}
                          alt={`${p.name} — website`}
                          width={img.width}
                          height={img.height}
                          sizes="(max-width: 820px) 92vw, 560px"
                          loading="lazy"
                        />
                      ) : (
                        <div className="pf-img" style={{ background: p.tint }} />
                      )}
                    </div>
                  </div>
                </div>
              </section>
            );
          })}
        </div>

        {/* PACKAGES */}
        <section className="section wrap" id="packages" data-section>
          <div className="watermark" aria-hidden="true">
            Websmith
          </div>
          <div className="sec-head">
            <span className="label">Packages</span>
            <span className="dot-anchor" data-dot-anchor="packages" />
            <span className="idx">02</span>
          </div>
          <h2 className="sec-title">
            <Kinetic text="Pick a starting point. No prices, no packages padded with filler." />
          </h2>
          <div className="pkg-grid">
            {packages.map((pk) => (
              <div className="pkg reveal-fade" key={pk.name}>
                <div className="pk-name serif">{pk.name}</div>
                <p>{pk.description}</p>
                <a className="tlink sweep" href={waLink(pk.subject)} target="_blank" rel="noopener noreferrer">
                  Get a quote →
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* ABOUT / PROCESS */}
        <section className="section wrap" id="studio" data-section>
          <div className="watermark" aria-hidden="true">
            Forged
          </div>
          <div className="sec-head">
            <span className="label">The studio</span>
            <span className="dot-anchor" data-dot-anchor="studio" />
            <span className="idx">03</span>
          </div>
          <h2 className="sec-title">
            <Kinetic text={about.title} />
          </h2>
          <p className="about-body reveal-fade">{about.body}</p>
          <div className="steps">
            {process.map((s) => (
              <div className="step reveal-fade" key={s.label}>
                <div className="d">{s.label}</div>
                <h4>{s.title}</h4>
                <p>{s.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CLOSE */}
        <section className="close wrap" id="contact">
          <h2 className="close-title">
            <Kinetic text={close.title} />
          </h2>
          <p className="close-support reveal-fade">{close.support}</p>
          <div className="close-cta">
            <a className="btn" data-magnetic href={waLink()} target="_blank" rel="noopener noreferrer">
              <span className="slot" data-dot-anchor="close" aria-hidden="true" />
              {close.cta}
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
