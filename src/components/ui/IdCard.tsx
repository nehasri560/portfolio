"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { prefersReducedMotion } from "@/lib/hooks";

type Props = {
  name: string;
  role: string;
  strap: string;
  rows: { k: string; v: string }[];
  back: string[];
  email: string;
};

/** Deterministic gray barcode derived from the name — purely decorative. */
function barcode(seed: string): number[] {
  const out: number[] = [];
  for (let i = 0; out.length < 38; i++) {
    const c = seed.charCodeAt(i % seed.length) + i * 7;
    out.push((c % 3) + 1);
  }
  return out;
}

export default function IdCard({ name, role, strap, rows, back, email }: Props) {
  const swingRef = useRef<HTMLDivElement>(null);
  const [flipped, setFlipped] = useState(false);
  const lastPointer = useRef<string>("mouse");
  const bars = useMemo(() => barcode(name), [name]);

  // damped pendulum: pointer velocity kicks the angle, a spring pulls it back to an idle sway
  useEffect(() => {
    const el = swingRef.current;
    if (!el || prefersReducedMotion()) return;
    let angle = 0;
    let vel = 0;
    let lastX: number | null = null;
    let lastT = 0;
    let frame = 0;
    let running = false;

    const onMove = (e: PointerEvent) => {
      const now = performance.now();
      if (lastX !== null && now - lastT < 100) {
        const vx = (e.clientX - lastX) / Math.max(8, now - lastT); // px per ms
        vel += Math.max(-0.9, Math.min(0.9, vx * 0.3));
      }
      lastX = e.clientX;
      lastT = now;
    };

    const tick = (t: number) => {
      const idle = Math.sin(t / 1500) * 1.4 + Math.sin(t / 2300) * 0.6;
      const acc = -0.018 * (angle - idle) - 0.075 * vel;
      vel += acc;
      angle = Math.max(-22, Math.min(22, angle + vel));
      el.style.transform = `rotate(${angle.toFixed(3)}deg)`;
      frame = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !running) {
        running = true;
        frame = requestAnimationFrame(tick);
        window.addEventListener("pointermove", onMove, { passive: true });
      } else if (!e.isIntersecting && running) {
        running = false;
        cancelAnimationFrame(frame);
        window.removeEventListener("pointermove", onMove);
      }
    });
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <div className="lanyard">
      <div ref={swingRef} className="swing">
        <div className="cord" aria-hidden>
          <div className="cord-text">
            <span>{strap.repeat(4)}</span>
            <span>{strap.repeat(4)}</span>
          </div>
        </div>
        <div className="strap" aria-hidden>
          <div className="cord-text">
            <span>{strap.repeat(2)}</span>
            <span>{strap.repeat(2)}</span>
          </div>
        </div>
        <div className="clip" aria-hidden>
          <i />
        </div>

        <div
          className={`idcard ${flipped ? "is-flipped" : ""}`}
          role="button"
          tabIndex={0}
          aria-pressed={flipped}
          onPointerDown={(e) => (lastPointer.current = e.pointerType)}
          onPointerEnter={(e) => e.pointerType === "mouse" && setFlipped(true)}
          onPointerLeave={(e) => e.pointerType === "mouse" && setFlipped(false)}
          onClick={() => lastPointer.current !== "mouse" && setFlipped((f) => !f)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              lastPointer.current = "keyboard";
              setFlipped((f) => !f);
            }
          }}
        >
          <span className="sr-only">ID card, press to flip to the {flipped ? "front" : "back"}. </span>
          <div className="idcard-inner">
            {/* front */}
            <div className="face front" aria-hidden={flipped}>
              <div className="band">
                <span className="slot" />
                <span className="mono">DEVELOPER ID</span>
              </div>
              <div className="photo">
                <div className="photo-ring">
                  <img src="/portrait-bust.webp" alt={`Portrait of ${name}`} width={128} height={156} />
                </div>
              </div>
              <p className="id-name">{name}</p>
              <p className="id-role mono">{role}</p>
              <dl className="id-rows">
                {rows.map((r) => (
                  <div key={r.k}>
                    <dt className="mono">{r.k}</dt>
                    <dd>{r.v}</dd>
                  </div>
                ))}
              </dl>
              <div className="id-foot">
                <svg className="barcode" viewBox={`0 0 ${bars.reduce((a, b) => a + b + 1.4, 0)} 28`} aria-hidden>
                  {
                    bars.reduce<{ x: number; els: React.ReactNode[] }>(
                      (acc, w, i) => {
                        acc.els.push(<rect key={i} x={acc.x} y="0" width={w} height="28" fill="#2a2a2a" />);
                        acc.x += w + 1.4;
                        return acc;
                      },
                      { x: 0, els: [] },
                    ).els
                  }
                </svg>
                <span className="holo" aria-hidden />
              </div>
            </div>

            {/* back */}
            <div className="face back" aria-hidden={!flipped}>
              <p className="back-title">
                What <em className="accent">I am</em>
              </p>
              <ul>
                {back.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
              <div className="sig">
                <span className="accent">{name}</span>
                <i />
                <small className="mono">Signature</small>
              </div>
              <p className="found mono">
                If found, say hello · <span>{email}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <p className="lanyard-hint mono" aria-hidden>
        Hover · tap · or press Enter to flip
      </p>

      <style href="idcard" precedence="default">{`
        .lanyard{--cord:calc(var(--section-pad) - 6px);position:relative;height:100%;display:flex;flex-direction:column;align-items:center;margin-top:calc(-1 * var(--cord))}
        .swing{display:flex;flex-direction:column;align-items:center;transform-origin:50% 0;will-change:transform}
        .cord,.strap{position:relative;width:30px;overflow:hidden;background:#151515;color:#d9d6d0}
        .cord{height:var(--cord);border-radius:0 0 2px 2px;box-shadow:inset 1px 0 0 rgba(255,255,255,.08),inset -1px 0 0 rgba(255,255,255,.08)}
        .strap{height:56px;border-radius:0 0 8px 8px;background:#202020;box-shadow:inset 0 1px 0 rgba(255,255,255,.12)}
        .cord-text{position:absolute;left:0;top:0;width:100%;display:flex;flex-direction:column;animation:strap 22s linear infinite}
        .strap .cord-text{animation-duration:12s}
        .cord-text span{writing-mode:vertical-rl;font-family:var(--font-mono);font-size:9.5px;letter-spacing:.18em;line-height:30px;white-space:nowrap;text-align:center}
        @keyframes strap{from{transform:translateY(0)}to{transform:translateY(-50%)}}
        .clip{position:relative;width:26px;height:30px;margin-top:-6px;display:flex;justify-content:center}
        .clip::before{content:"";position:absolute;top:0;width:24px;height:16px;border-radius:5px;background:linear-gradient(180deg,#e9e9e9,#9b9b9b 55%,#d6d6d6);box-shadow:inset 0 0 0 1px rgba(0,0,0,.25),0 2px 3px rgba(0,0,0,.2)}
        .clip i{position:absolute;top:12px;width:14px;height:18px;border-radius:0 0 7px 7px;border:2.5px solid #9d9d9d;border-top:0}
        .idcard{position:relative;width:300px;height:404px;margin-top:-4px;perspective:1400px;cursor:pointer;border-radius:22px;outline-offset:6px}
        .idcard-inner{position:relative;width:100%;height:100%;transform-style:preserve-3d;transition:transform 1s var(--ease)}
        .idcard.is-flipped .idcard-inner{transform:rotateY(180deg)}
        .face{position:absolute;inset:0;border-radius:22px;background:#fff;backface-visibility:hidden;-webkit-backface-visibility:hidden;box-shadow:inset 0 0 0 1px var(--line),0 40px 70px -36px rgba(13,13,13,.45),0 14px 24px -18px rgba(13,13,13,.25);overflow:hidden;display:flex;flex-direction:column;align-items:center}
        .back{transform:rotateY(180deg);align-items:stretch;padding:28px 26px 22px}
        .band{width:100%;height:58px;background:var(--ink);color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:7px}
        .band .slot{width:44px;height:6px;border-radius:6px;background:var(--paper);opacity:.9}
        .band .mono{font-size:10.5px;letter-spacing:.32em}
        .photo{margin-top:18px;position:relative}
        .photo::before{content:"";position:absolute;inset:-16px;border-radius:50%;background:radial-gradient(closest-side,rgba(13,13,13,.09),transparent);z-index:0}
        .photo-ring{position:relative;z-index:1;width:128px;height:156px;padding:3px;border-radius:18px;background:linear-gradient(150deg,#d9d6d0,#8d8a84 45%,#e9e6e0);box-shadow:0 18px 30px -18px rgba(13,13,13,.5)}
        .photo-ring img{display:block;width:100%;height:100%;object-fit:cover;border-radius:15px;background:#fff;transition:transform .8s var(--ease)}
        .photo-ring{overflow:hidden}
        .idcard:hover .photo-ring img,.idcard:focus-visible .photo-ring img{transform:scale(1.07)}
        .id-name{margin:14px 0 0;font-weight:700;font-size:20px;letter-spacing:-.035em}
        .id-role{margin:4px 0 0;font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:var(--mute)}
        .id-rows{width:calc(100% - 48px);margin:12px 0 0;border-top:1px dashed rgba(13,13,13,.15)}
        .id-rows div{display:flex;justify-content:space-between;gap:10px;padding:5px 0;font-size:12px}
        .id-rows dt{font-size:10px;letter-spacing:.06em;text-transform:uppercase;color:var(--mute)}
        .id-rows dd{margin:0;font-weight:500}
        .id-foot{margin-top:auto;width:calc(100% - 48px);display:flex;align-items:center;justify-content:space-between;padding:0 0 18px}
        .barcode{height:28px;width:150px}
        .holo{width:38px;height:38px;border-radius:50%;background:conic-gradient(from 0deg,#f2f2f2,#bdbdbd,#fafafa,#9a9a9a,#e6e6e6,#b0b0b0,#f2f2f2);box-shadow:inset 0 0 0 1px rgba(0,0,0,.12);animation:holo 6s linear infinite}
        @keyframes holo{to{transform:rotate(360deg)}}
        .back-title{margin:0 0 14px;font-weight:700;font-size:26px;letter-spacing:-.04em}
        .back ul{list-style:none;margin:0;padding:0;display:flex;flex-direction:column}
        .back li{font-size:13px;line-height:1.4;padding:9px 0;border-top:1px solid var(--line)}
        .sig{margin-top:auto;display:flex;flex-direction:column}
        .sig .accent{font-size:30px;color:var(--ink);line-height:1}
        .sig i{height:1px;background:var(--ink);margin-top:4px}
        .sig small{font-size:9.5px;letter-spacing:.12em;text-transform:uppercase;color:var(--mute);margin-top:6px}
        .found{margin:14px 0 0;font-size:10px;line-height:1.5;color:var(--mute);overflow-wrap:anywhere}
        .found span{color:var(--ink)}
        .lanyard-hint{margin:22px 0 0;font-size:10.5px;letter-spacing:.08em;text-transform:uppercase;color:var(--mute)}
        @media (max-width: 760px){.lanyard{--cord:72px;margin-top:0}}
        @media (max-width: 360px){.idcard{transform:scale(.92)}}
      `}</style>
    </div>
  );
}
