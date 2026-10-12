"use client";

import { useEffect, useRef, useState } from "react";
import { PROFILE } from "@/lib/data";
import { prefersReducedMotion } from "@/lib/hooks";
import { scrollToTarget } from "@/lib/scroll";
import { ArrowDown } from "../ui/Icons";

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const soundBtnRef = useRef<HTMLButtonElement>(null);
  const [soundOn, setSoundOn] = useState(false);
  const [blocked, setBlocked] = useState(false);
  // has the visitor explicitly chosen sound on/off? then never override it
  const userChoice = useRef<boolean | null>(null);
  const visible = useRef(true);
  const reduced = useRef(false);
  const started = useRef(false);

  // autoplay with sound if allowed, else muted; unlock on first gesture
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    reduced.current = prefersReducedMotion();
    if (reduced.current) return; // no autoplay; the button starts it

    // start once the page has finished loading so decoding doesn't compete with hydration
    const start = () => {
      started.current = true;
      if (!visible.current) return;
      v.muted = userChoice.current === false;
      v.play()
        .then(() => setSoundOn(!v.muted))
        .catch(() => {
          v.muted = true;
          setSoundOn(false);
          setBlocked(userChoice.current === null);
          v.play().catch(() => {});
        });
    };
    let timer = 0;
    const kick = () => (timer = window.setTimeout(start, 400));
    if (document.readyState === "complete") kick();
    else window.addEventListener("load", kick, { once: true });

    const unlock = (e: Event) => {
      if (soundBtnRef.current?.contains(e.target as Node)) return; // the button handles itself
      cleanup();
      if (userChoice.current !== null || !started.current) return;
      v.muted = false;
      setSoundOn(true);
      setBlocked(false);
      if (visible.current) v.play().catch(() => {});
    };
    const evts = ["pointerdown", "keydown", "touchend"] as const;
    const cleanup = () => evts.forEach((n) => window.removeEventListener(n, unlock, true));
    evts.forEach((n) => window.addEventListener(n, unlock, { capture: true, passive: true }));
    return () => {
      cleanup();
      window.clearTimeout(timer);
      window.removeEventListener("load", kick);
    };
  }, []);

  // pause (and silence) once less than 35 % of the hero is visible
  useEffect(() => {
    const section = sectionRef.current;
    const v = videoRef.current;
    if (!section || !v) return;
    const io = new IntersectionObserver(
      ([e]) => {
        visible.current = e.intersectionRatio >= 0.35;
        if (!visible.current) v.pause();
        else if (started.current && (!reduced.current || userChoice.current)) v.play().catch(() => {});
      },
      { threshold: [0, 0.35, 0.6, 1] },
    );
    io.observe(section);
    return () => io.disconnect();
  }, []);

  const toggleSound = () => {
    const v = videoRef.current;
    if (!v) return;
    const next = !soundOn;
    userChoice.current = next;
    started.current = true;
    v.muted = !next;
    setSoundOn(next);
    setBlocked(false);
    if (next) {
      if (v.ended || v.paused) v.play().catch(() => {});
    } else if (reduced.current) {
      v.pause();
    }
  };

  return (
    <section ref={sectionRef} id="top" className="hero" aria-label="Introduction">
      <div className="hero-figure">
        <p className="hero-ghost" aria-hidden>
          {PROFILE.firstName.toUpperCase()}
        </p>
        <div className="hero-stage">
        <video
          ref={videoRef}
          className="hero-video"
          muted
          loop
          playsInline
          preload="auto"
          width={768}
          height={960}
          aria-label={`Video: ${PROFILE.name} gives a short spoken introduction`}
        >
          <source src="/hero/hero.webm" type="video/webm" />
          <source src="/hero/hero.mp4" type="video/mp4" />
        </video>
        </div>
      </div>

      <div className="hero-copy wrap">
        <div className="hero-left">
          <p className="hero-hello rv" style={{ "--i": 0 } as React.CSSProperties}>
            Hi, I&apos;m {PROFILE.name}
          </p>
          <h1 className="hero-title">
            {PROFILE.roleLines.map((line, i) => (
              <span key={line} className="rv-mask" style={{ "--i": i + 1 } as React.CSSProperties}>
                <span>{i === PROFILE.roleLines.length - 1 ? <em className="accent">{line}</em> : line}</span>
              </span>
            ))}
          </h1>
          <div className="hero-ctas rv" style={{ "--i": 5 } as React.CSSProperties}>
            <a
              href="#work"
              className="btn btn-primary"
              onClick={(e) => {
                e.preventDefault();
                scrollToTarget("#work");
              }}
            >
              Explore work
            </a>
            <a
              href="#contact"
              className="btn btn-ghost"
              onClick={(e) => {
                e.preventDefault();
                scrollToTarget("#contact");
              }}
            >
              Let&apos;s talk
            </a>
            <a href={PROFILE.resume} download={PROFILE.resumeFileName} className="btn btn-ghost">
              Résumé <ArrowDown size={15} />
            </a>
          </div>
        </div>

        <div className="hero-right rv" style={{ "--i": 4 } as React.CSSProperties}>
          <p className="hero-note">
            CSE graduate specialized in <em className="accent">Artificial Intelligence.</em>
          </p>
          <p className="hero-loc mono">{PROFILE.location}</p>
          <div className="hero-sound">
            <button
              ref={soundBtnRef}
              type="button"
              className={`sound-btn ${blocked ? "is-blocked" : ""}`}
              onClick={toggleSound}
              aria-label={soundOn ? "Mute the intro video" : "Play the intro video with sound"}
              aria-pressed={soundOn}
            >
              {soundOn ? (
                <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
                  <rect x="2.5" y="2" width="3" height="10" rx="1" fill="currentColor" />
                  <rect x="8.5" y="2" width="3" height="10" rx="1" fill="currentColor" />
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
                  <path d="M4 2.2v9.6a.6.6 0 00.9.5l7.4-4.8a.6.6 0 000-1L4.9 1.7a.6.6 0 00-.9.5z" fill="currentColor" />
                </svg>
              )}
            </button>
            <span className="mono hero-scroll" aria-hidden>
              Scroll ↓
            </span>
          </div>
        </div>
      </div>

      <style href="hero" precedence="default">{`
        .hero{position:relative;min-height:100svh;overflow:hidden;isolation:isolate;background:var(--paper)}
        .hero-figure{position:absolute;inset:0;pointer-events:none}
        .hero-ghost{position:absolute;left:50%;top:clamp(84px,14vh,150px);transform:translateX(-50%);margin:0;z-index:-1;font-weight:800;font-size:clamp(84px,19vw,330px);line-height:.8;letter-spacing:-.06em;color:transparent;-webkit-text-stroke:1.2px rgba(13,13,13,.16);white-space:nowrap;user-select:none;}
        .hero-stage{position:absolute;left:50%;bottom:0;transform:translateX(-50%);height:min(96svh,1040px);aspect-ratio:768/960;max-width:100vw;pointer-events:none;mix-blend-mode:multiply}
        .hero-video{display:block;width:100%;height:100%;object-fit:cover;object-position:50% 100%}
        .hero-copy{position:relative;min-height:100svh;display:flex;align-items:flex-end;justify-content:space-between;gap:24px;padding-top:120px;padding-bottom:clamp(28px,6vh,64px)}
        .hero-left{max-width:min(44vw,560px)}
        .hero-hello{font-size:15px;font-weight:500;color:var(--ink-2);margin:0 0 18px}
        .hero-title{margin:0;font-weight:700;letter-spacing:-.05em;line-height:.98;font-size:clamp(34px,3.9vw,64px)}
        .hero-title .accent{font-size:1.08em}
        .hero-ctas{display:flex;flex-wrap:wrap;gap:10px;margin-top:30px}
        .hero-right{display:flex;flex-direction:column;align-items:flex-end;text-align:right;gap:12px;max-width:min(26vw,300px)}
        .hero-note{margin:0;font-size:clamp(17px,1.5vw,22px);line-height:1.3;letter-spacing:-.02em;font-weight:500}
        .hero-loc{margin:0;font-size:12px;color:var(--mute);text-transform:uppercase;letter-spacing:.04em}
        .hero-sound{display:flex;align-items:center;gap:14px;margin-top:14px;flex-direction:row-reverse}
        .hero-scroll{font-size:11px;letter-spacing:.08em;color:var(--mute);text-transform:uppercase}
        .sound-btn{position:relative;width:46px;height:46px;border-radius:50%;background:var(--ink);color:#fff;display:grid;place-items:center;transition:transform .5s var(--ease)}
        .sound-btn:hover{transform:scale(1.07)}
        .sound-btn.is-blocked::before,.sound-btn.is-blocked::after{content:"";position:absolute;inset:0;border-radius:50%;box-shadow:0 0 0 1.5px var(--ink);animation:ping 2.2s var(--ease) infinite}
        .sound-btn.is-blocked::after{animation-delay:1.1s}
        @keyframes ping{from{transform:scale(1);opacity:.55}to{transform:scale(1.9);opacity:0}}
        @media (max-width: 900px){
          .hero{display:flex;flex-direction:column;min-height:auto}
          .hero-figure{position:relative;inset:auto;order:2;height:62svh;max-height:640px}
          .hero-ghost{top:26%;font-size:21vw}
          .hero-stage{position:relative;left:auto;bottom:auto;transform:none;margin:0 auto;height:100%}
          .hero-copy{display:contents}
          .hero-left{order:1;max-width:none;padding:112px var(--gutter) 8px}
          .hero-right{order:3;align-items:flex-start;text-align:left;max-width:none;padding:24px var(--gutter) 40px;flex-direction:row;flex-wrap:wrap;align-items:center;justify-content:space-between}
          .hero-note{flex-basis:100%}
          .hero-sound{margin:0;flex-direction:row}
          .hero-title{font-size:clamp(38px,10.5vw,64px)}
          .hero-ctas{margin-top:22px}
        }
      `}</style>
    </section>
  );
}
