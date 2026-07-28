"use client";

import { useLayoutEffect, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { site } from "@/config/site";
import type { PortfolioMedia } from "@/lib/portfolio";
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

export default function Home({ media }: { media: Record<string, PortfolioMedia> }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useIso(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return; // CSS renders everything final; dot hidden, static period shown

    const root = rootRef.current!;
    const dot = dotRef.current!;
    const isMobile = window.matchMedia("(max-width: 820px)").matches;
    document.body.classList.add("dot-live"); // hide the static period; the travelling dot takes over

    // ---- pre-paint (cheap, synchronous): hide the hero letters and park the dot
    // so the very first paint shows a settled frame with no flash. No GSAP yet —
    // all heavy setup is deferred one frame so it never delays first paint. ----
    const letters = Array.from(root.querySelectorAll<HTMLElement>(".hm-l"));
    letters.forEach((l) => {
      l.style.transform = "translateY(125%)";
      l.style.opacity = "0";
    });
    const heroSlot = root.querySelector<HTMLElement>('[data-dot-anchor="hero"]')!;
    const mark = root.querySelector<HTMLElement>(".hero-mark")!;
    const dotSize = () => dot.offsetWidth || 14;

    // Dot state in viewport coords. The lerp reads ONLY scrollY per frame (never
    // getBoundingClientRect), so it costs no forced layout. Each anchor is
    // measured to an absolute document Y once, when it becomes active/on-screen.
    let cx = 0;
    let cy = 0;
    let targetX = 0; // viewport X (stable under vertical scroll)
    let targetYAbs = 0; // document Y of the target's centre
    const applyDot = () => {
      dot.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
    };
    const measure = (el: HTMLElement) => {
      const r = el.getBoundingClientRect();
      const s = dotSize();
      targetX = r.left + r.width / 2 - s / 2;
      targetYAbs = r.top + window.scrollY + r.height / 2 - s / 2;
    };
    {
      const mr = mark.getBoundingClientRect();
      cx = mr.left - 30;
      cy = mr.top + mr.height * 0.52 - dotSize() / 2;
      applyDot();
      dot.style.opacity = "1";
    }

    let rafId = 0;
    let ticking = false;
    const tick = () => {
      const ty = targetYAbs - window.scrollY; // cheap read, no layout flush
      cx += (targetX - cx) * 0.14;
      cy += (ty - cy) * 0.14;
      applyDot();
      rafId = requestAnimationFrame(tick);
    };
    const startFollow = () => {
      if (ticking) return;
      ticking = true;
      rafId = requestAnimationFrame(tick);
    };

    // ---- heavy setup: runs one frame after first paint ----
    let started = false;
    let ctx: gsap.Context | null = null;
    let io: IntersectionObserver | null = null;
    const removers: Array<() => void> = [];

    const start = () => {
      if (started) return;
      started = true;
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        // Reveals — mobile collapses each split headline to ONE fade-up (no dozens
        // of animated word spans); desktop keeps the word-by-word rise.
        if (isMobile) {
          gsap.utils.toArray<HTMLElement>(".kin").forEach((k) => {
            gsap.set(k, { y: 16, opacity: 0 });
            ScrollTrigger.create({
              trigger: k,
              start: "top 88%",
              once: true,
              onEnter: () => gsap.to(k, { y: 0, opacity: 1, duration: 0.5, ease: "power2.out", force3D: true }),
            });
          });
        } else {
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
        }
        gsap.utils.toArray<HTMLElement>(".reveal-fade").forEach((el) => {
          gsap.set(el, { y: 18, opacity: 0 });
          ScrollTrigger.create({
            trigger: el,
            start: "top 88%",
            once: true,
            onEnter: () => gsap.to(el, { y: 0, opacity: 1, duration: 0.6, ease: "power2.out", force3D: true }),
          });
        });

        // Scrubbed parallax (frame drift + watermark drift) is DESKTOP ONLY — no
        // scrubbing ScrollTriggers run on mobile, where they cost the most.
        if (!isMobile) {
          gsap.utils.toArray<HTMLElement>(".pf-frame").forEach((frame) => {
            gsap.fromTo(
              frame,
              { yPercent: -4 },
              { yPercent: 4, ease: "none", force3D: true, scrollTrigger: { trigger: frame.closest(".pf"), start: "top bottom", end: "bottom top", scrub: true } }
            );
          });
          gsap.utils.toArray<HTMLElement>(".watermark").forEach((w) => {
            gsap.fromTo(
              w,
              { yPercent: -8 },
              { yPercent: 8, ease: "none", force3D: true, scrollTrigger: { trigger: w.closest(".section, .pf"), start: "top bottom", end: "bottom top", scrub: true } }
            );
          });
        }

        const tintLayer = root.querySelector<HTMLElement>(".tint-layer")!;
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

        // Dot docking — each anchor is measured only when it becomes active (i.e.
        // on-screen), so cached positions stay correct even for content-visibility
        // sections that hadn't been laid out yet.
        let breathed = false;
        const breathe = () => {
          if (breathed) return;
          breathed = true;
          gsap.fromTo(".close-cta .btn", { scale: 1 }, { scale: 1.05, duration: 0.5, yoyo: true, repeat: 1, ease: "sine.inOut" });
        };
        const attachDotScroll = () => {
          measure(heroSlot);
          startFollow();
          gsap.utils.toArray<HTMLElement>("[data-dot-anchor]").forEach((el) => {
            const section = el.closest<HTMLElement>(".pf, .section, .hero, .close") || el;
            const isClose = el.getAttribute("data-dot-anchor") === "close";
            ScrollTrigger.create({
              trigger: section,
              start: "top 58%",
              end: "bottom 42%",
              onEnter: () => {
                measure(el);
                if (isClose) breathe();
              },
              onEnterBack: () => measure(el),
            });
          });
          ScrollTrigger.refresh();
        };

        // Intro — the dot writes the wordmark on every load; transform/opacity only.
        measure(heroSlot);
        const end = { x: targetX, y: targetYAbs - window.scrollY };
        const s = dotSize();
        gsap.set(letters, { yPercent: 125, opacity: 0 });
        const proxy = { x: cx, y: cy };
        const sync = () => {
          cx = proxy.x;
          cy = proxy.y;
          applyDot();
        };
        const finish = () => attachDotScroll();
        const tl = gsap.timeline({ onUpdate: sync, onComplete: finish });
        tl.to(letters, { yPercent: 0, opacity: 1, duration: 0.5, stagger: isMobile ? 0.06 : 0.11, ease: "back.out(1.6)", force3D: true }, 0.1);
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
        removers.push(removeSkip);
      }, rootRef);

      const refresh = () => ScrollTrigger.refresh();
      window.addEventListener("resize", refresh, { passive: true });
      window.addEventListener("load", refresh, { once: true });
      removers.push(() => window.removeEventListener("resize", refresh));

      // ---- portfolio videos: exactly ONE plays at a time (the most visible) ----
      // iOS/mobile refuse multiple simultaneous decodes, which is why extra clips
      // sat frozen. On every intersection change we play only the most-visible clip
      // and pause the rest; sources are lazy (preload="none", set on approach) with
      // the mobile size on small screens; a rejected play() is retried on first tap.
      const mqMobile = window.matchMedia("(max-width: 820px)");
      const vids = Array.from(root.querySelectorAll<HTMLVideoElement>("video.pf-video"));
      const pickSrc = (v: HTMLVideoElement) => {
        const size = mqMobile.matches ? "mobile" : "desktop";
        const canWebm = v.canPlayType('video/webm; codecs="vp9"') !== "";
        return v.dataset[canWebm ? `${size}Webm` : `${size}Mp4`] || "";
      };
      const ensureSrc = (v: HTMLVideoElement) => {
        if (!v.getAttribute("src")) {
          const src = pickSrc(v);
          if (src) {
            v.src = src;
            v.load();
          }
        }
      };
      if (vids.length && "IntersectionObserver" in window) {
        const ratios = new Map<HTMLVideoElement, number>();
        let current: HTMLVideoElement | null = null;
        let touchArmed = false;
        const armTouch = () => {
          if (touchArmed) return;
          touchArmed = true;
          const h = () => {
            touchArmed = false;
            if (current) current.play().catch(() => {});
          };
          window.addEventListener("touchstart", h, { once: true, passive: true });
          window.addEventListener("pointerdown", h, { once: true, passive: true });
          removers.push(() => {
            window.removeEventListener("touchstart", h);
            window.removeEventListener("pointerdown", h);
          });
        };
        const update = () => {
          let best: HTMLVideoElement | null = null;
          let bestR = 0;
          ratios.forEach((r, v) => {
            if (r > bestR) {
              bestR = r;
              best = v;
            }
          });
          vids.forEach((v) => {
            if (v !== best && !v.paused) v.pause(); // never more than one playing
          });
          current = best;
          if (best && bestR > 0) {
            ensureSrc(best);
            (best as HTMLVideoElement).play().catch(() => armTouch());
          }
        };
        io = new IntersectionObserver(
          (entries) => {
            for (const e of entries) {
              const v = e.target as HTMLVideoElement;
              ratios.set(v, e.isIntersecting ? e.intersectionRatio : 0);
              if (e.isIntersecting) ensureSrc(v); // buffer on approach; decode happens only on play()
            }
            update();
          },
          { rootMargin: "200px 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
        );
        vids.forEach((v) => io!.observe(v));
      }
    };

    const kick = requestAnimationFrame(start); // defer heavy work past first paint

    // ---- magnetic buttons (desktop, fine pointer) ----
    const fine = window.matchMedia("(pointer:fine)").matches;
    const magnets: Array<() => void> = [];
    if (fine) {
      root.querySelectorAll<HTMLElement>("[data-magnetic]").forEach((btn) => {
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
      cancelAnimationFrame(kick);
      cancelAnimationFrame(rafId);
      ctx?.revert();
      io?.disconnect();
      removers.forEach((fn) => fn());
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
            const m = media[p.slug];
            const ratio = m?.has ? `${m.width} / ${m.height}` : "1400 / 670";
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
                    {/* The poster (a still frame of the real site) shows until the
                        IntersectionObserver lazy-loads and plays the video on
                        approach; it also stays put under reduced motion or if a
                        source fails. Sizes/ratio are fixed so there is no CLS. */}
                    <div className="pf-view" style={{ aspectRatio: ratio }}>
                      {m?.video ? (
                        <video
                          className="pf-video"
                          poster={m.poster}
                          muted
                          loop
                          playsInline
                          preload="none"
                          aria-label={`${p.name} — website preview`}
                          data-desktop-webm={m.video.desktopWebm}
                          data-desktop-mp4={m.video.desktopMp4}
                          data-mobile-webm={m.video.mobileWebm}
                          data-mobile-mp4={m.video.mobileMp4}
                        />
                      ) : m?.has ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img className="pf-video" src={m.poster} alt={`${p.name} — website`} loading="lazy" />
                      ) : (
                        <div className="pf-video" style={{ background: p.tint }} />
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
