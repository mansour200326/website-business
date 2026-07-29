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

    // ---- Part 1: every entry starts at the top (fresh, refresh, back-nav) ----
    // Reinforces the layout's early script, and forces the top for all visitors —
    // including reduced-motion, who return before the intro is built.
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    const onPageShow = (e: PageTransitionEvent) => {
      if (!e.persisted) return; // only a bfcache restore (back/forward navigation)
      window.scrollTo(0, 0);
      if (!reduce) window.location.reload(); // reload so the intro replays from the top
    };
    window.addEventListener("pageshow", onPageShow);

    if (reduce) {
      // CSS renders everything final; dot hidden, static period shown.
      return () => window.removeEventListener("pageshow", onPageShow);
    }

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
      // Mobile collapses each split headline to ONE fade-up (no dozens of animated
      // word spans / compositor layers); desktop keeps the word-by-word rise.
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
          start: "top 85%",
          once: true,
          onEnter: () => gsap.to(el, { y: 0, opacity: 1, duration: 0.6, ease: "power2.out", force3D: true }),
        });
      });
      // Parallax frame treatment — the browser-framed clip drifts a few percent
      // as the project passes (transform only, force3D). Desktop-only: on mobile
      // the frame stays put so the video is the only thing moving (performance).
      if (!isMobile) {
        gsap.utils.toArray<HTMLElement>(".pf-frame").forEach((frame) => {
          gsap.fromTo(
            frame,
            { yPercent: -4 },
            {
              yPercent: 4,
              ease: "none",
              force3D: true,
              scrollTrigger: { trigger: frame.closest(".pf"), start: "top bottom", end: "bottom top", scrub: true },
            }
          );
        });
      }
      // Ghost watermark parallax — desktop only (static on mobile). GSAP OWNS the
      // centering (xPercent/yPercent -50) and drifts a separate pixel axis, so it
      // can never drop the translate(-50%,-50%) centering the way animating
      // yPercent directly would — the word stays centred and faint behind content.
      if (!isMobile) {
        gsap.utils.toArray<HTMLElement>(".watermark").forEach((w) => {
          gsap.set(w, { xPercent: -50, yPercent: -50 });
          gsap.fromTo(
            w,
            { y: -36 },
            {
              y: 36,
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
      // The homepage arrives AFTER the wordmark is written: hide the hero body and
      // nav up front (pre-paint, so no flash) — but keep their layout space, so
      // nothing shifts when they fade in. Below-fold content stays in normal flow
      // and reveals on scroll via its own triggers.
      const heroBody = gsap.utils.toArray<HTMLElement>(".hero-tagline, .hero-support, .hero-cta");
      const navEl = document.querySelector<HTMLElement>("nav");
      gsap.set(heroBody, { y: 22, opacity: 0 });
      if (navEl) gsap.set(navEl, { opacity: 0 });
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
      // One continuous choreography: empty ivory → the dot writes the wordmark and
      // settles as the period → a ~0.4s hold → the hero body fade-rises and the nav
      // fades in → the living homepage. No hard cut.
      const tl = gsap.timeline({ onUpdate: sync, onComplete: finish });
      tl.to(letters, { yPercent: 0, opacity: 1, duration: 0.5, stagger: 0.11, ease: "back.out(1.6)", force3D: true }, 0.1);
      tl.to(proxy, { x: end.x, y: end.y, duration: 1.45, ease: "power2.inOut" }, 0);
      tl.to(proxy, { x: end.x + s * 0.7, duration: 0.12, ease: "power2.out" }, 1.45);
      tl.to(proxy, { x: end.x, duration: 0.32, ease: "elastic.out(1,0.5)" }, ">");
      // hold, then bring the homepage in
      tl.to(heroBody, { y: 0, opacity: 1, duration: 0.5, stagger: 0.09, ease: "power2.out", force3D: true }, "+=0.4");
      if (navEl) tl.to(navEl, { opacity: 1, duration: 0.55, ease: "power1.out" }, "<0.05");

      const revealAll = () => {
        gsap.set(letters, { yPercent: 0, opacity: 1 });
        gsap.set(heroBody, { y: 0, opacity: 1 });
        if (navEl) gsap.set(navEl, { opacity: 1 });
      };
      const skip = () => {
        if (tl.progress() < 1) {
          tl.progress(1);
          tl.kill();
          revealAll();
          cx = end.x;
          cy = end.y;
          applyDot();
          finish();
        }
        removeSkip();
      };
      // Register skip listeners one frame late, so the forced scroll-to-top above
      // (Part 1) can never be mistaken for a user scroll that skips the intro.
      const evts = ["pointerdown", "touchstart", "keydown", "wheel", "scroll"];
      const removeSkip = () => evts.forEach((e) => window.removeEventListener(e, skip));
      const armId = requestAnimationFrame(() => {
        evts.forEach((e) => window.addEventListener(e, skip, { once: true, passive: true }));
      });

      // ---- recalc anchor positions on resize and after the page settles ----
      // The frames reserve their space via a fixed aspect-ratio (no CLS), so a
      // resize + a post-load refresh keep every dock anchor accurate.
      const refresh = () => ScrollTrigger.refresh();
      window.addEventListener("resize", refresh, { passive: true });
      window.addEventListener("load", refresh, { once: true });

      return () => {
        cancelAnimationFrame(rafId);
        cancelAnimationFrame(armId);
        window.removeEventListener("resize", refresh);
        removeSkip();
      };
    }, rootRef);

    // ---- portfolio videos: exactly ONE plays at a time (the most visible) ----
    // Sources are lazy (preload="none", set on approach) with the mobile size on
    // small screens. On any intersection change we reconcile playback once per
    // frame (rAF-coalesced) so continuous scrolling never thrashes play()/pause()
    // and every clip plays cleanly as it becomes most-visible — on desktop and
    // mobile alike. iOS refuses multiple simultaneous decodes, so we keep it to
    // one and retry a rejected play() on first tap. Skipped under reduced motion
    // (the effect returns early above), so those visitors just see the poster.
    const mqMobile = window.matchMedia("(max-width: 820px)");
    const videos: HTMLVideoElement[] = rootRef.current
      ? Array.from(rootRef.current.querySelectorAll<HTMLVideoElement>("video.pf-video"))
      : [];
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
    let io: IntersectionObserver | null = null;
    let selRaf = 0;
    let touchArmed = false;
    let onScroll: (() => void) | null = null;
    if (videos.length && "IntersectionObserver" in window) {
      const visible = new Set<HTMLVideoElement>(); // clips currently near the viewport
      const armTouch = () => {
        if (touchArmed) return;
        touchArmed = true;
        const h = () => {
          touchArmed = false;
          select();
        };
        window.addEventListener("touchstart", h, { once: true, passive: true });
        window.addEventListener("pointerdown", h, { once: true, passive: true });
      };
      // Play the on-screen clip whose centre is nearest the viewport centre; pause
      // the rest. Distance-to-centre is monotonic with scroll, so — unlike
      // intersectionRatio, which saturates at 1 for any fully-visible clip and
      // makes adjacent clips flap or stick — it yields one clear winner and a clean
      // hand-off. Computed directly over the (≤3) clips each frame, so it never
      // depends on IntersectionObserver delivery timing. Exactly one ever plays
      // (iOS allows only one decode); a rejected play() retries on first tap.
      const select = () => {
        selRaf = 0;
        let best: HTMLVideoElement | null = null;
        let bestD = Infinity;
        const vh = window.innerHeight;
        const mid = vh / 2;
        for (const v of videos) {
          const r = v.getBoundingClientRect();
          if (r.bottom <= 0 || r.top >= vh) continue; // off-screen — not a candidate
          const d = Math.abs(r.top + r.height / 2 - mid);
          if (d < bestD) {
            bestD = d;
            best = v;
          }
        }
        for (const v of videos) {
          if (v === best) {
            ensureSrc(v);
            if (v.paused) v.play().catch(() => armTouch());
          } else if (!v.paused) {
            v.pause();
          }
        }
      };
      const schedule = () => {
        if (!selRaf) selRaf = requestAnimationFrame(select);
      };
      io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            const v = e.target as HTMLVideoElement;
            if (e.isIntersecting) {
              visible.add(v);
              ensureSrc(v); // buffer on approach; decode happens only on play()
            } else {
              visible.delete(v);
            }
          }
          schedule();
        },
        { rootMargin: "200px 0px", threshold: 0 }
      );
      videos.forEach((v) => io!.observe(v));
      // Re-select on scroll (rAF-throttled) so the hand-off tracks scroll position
      // continuously — not only at IntersectionObserver threshold crossings — and
      // only while a clip is near (cheap: a getBoundingClientRect for ≤3 elements).
      onScroll = () => {
        if (visible.size) schedule();
      };
      window.addEventListener("scroll", onScroll, { passive: true });
    }

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
      io?.disconnect();
      if (selRaf) cancelAnimationFrame(selRaf);
      if (onScroll) window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pageshow", onPageShow);
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
