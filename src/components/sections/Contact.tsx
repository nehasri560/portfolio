"use client";

import { useState } from "react";
import { PROFILE } from "@/lib/data";
import SectionTag from "../ui/SectionTag";
import { ArrowUpRight, LinkedInIcon } from "../ui/Icons";

const LINES: { text: string; accent?: string }[] = [{ text: "Let's build" }, { text: "something", accent: "together." }];

function HopWord({ word, className }: { word: string; className?: string }) {
  return (
    <span className={`hw ${className ?? ""}`}>
      {Array.from(word).map((ch, i) => (
        <span
          key={i}
          className="hl"
          onPointerEnter={(e) => {
            const el = e.currentTarget;
            el.classList.remove("hop");
            void el.offsetWidth; // restart the animation
            el.classList.add("hop");
          }}
          onAnimationEnd={(e) => e.currentTarget.classList.remove("hop")}
        >
          {ch}
        </span>
      ))}
    </span>
  );
}

export default function Contact() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.email);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = PROFILE.email;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2200);
  };

  const fullHeading = LINES.map((l) => [l.text, l.accent].filter(Boolean).join(" ")).join(" ");

  return (
    <section id="contact" className="section contact cv" aria-labelledby="contact-title">
      <div className="wrap">
        <SectionTag id="contact" />
        <h2 id="contact-title" className="contact-h" aria-label={fullHeading}>
          {LINES.map((l, i) => (
            <span key={i} className="rv-mask" style={{ "--i": i } as React.CSSProperties} aria-hidden>
              <span>
                {l.text.split(" ").map((w, k) => (
                  <HopWord key={k} word={w} />
                ))}
                {l.accent && <HopWord word={l.accent} className="accent" />}
              </span>
            </span>
          ))}
        </h2>

        <div className="contact-grid">
          <div className="contact-main rv">
            <p className="contact-label mono">Write to me</p>
            <div className="email-row">
              <a href={`mailto:${PROFILE.email}`} className="email">
                {PROFILE.email}
              </a>
              <button type="button" className={`copy ${copied ? "is-copied" : ""}`} onClick={copy}>
                {copied ? "Copied ✓" : "Copy"}
              </button>
              <span className="sr-only" aria-live="polite">
                {copied ? "Email address copied to clipboard" : ""}
              </span>
            </div>

            <ul className="contact-links">
              <li>
                <span className="mono">Phone</span>
                <a href={PROFILE.phoneHref}>{PROFILE.phone}</a>
              </li>
              {PROFILE.linkedin && (
                <li>
                  <span className="mono">LinkedIn</span>
                  <a href={PROFILE.linkedin} target="_blank" rel="noreferrer">
                    <LinkedInIcon size={15} /> {PROFILE.linkedinLabel} <ArrowUpRight size={14} />
                  </a>
                </li>
              )}
              {PROFILE.github && (
                <li>
                  <span className="mono">GitHub</span>
                  <a href={PROFILE.github} target="_blank" rel="noreferrer">
                    {PROFILE.github.replace(/^https?:\/\//, "")} <ArrowUpRight size={14} />
                  </a>
                </li>
              )}
              <li>
                <span className="mono">Based in</span>
                <span>{PROFILE.location}</span>
              </li>
            </ul>
          </div>

          <a href={`mailto:${PROFILE.email}`} className="badge rv" aria-label={`Say hello — email ${PROFILE.email}`}>
            <svg viewBox="0 0 200 200" className="badge-ring" aria-hidden>
              <defs>
                <path id="badge-circle" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
              </defs>
              <text>
                <textPath href="#badge-circle" textLength="488">
                  SAY HELLO · SAY HELLO · SAY HELLO ·
                </textPath>
              </text>
            </svg>
            <span className="badge-core" aria-hidden>
              <ArrowUpRight size={26} />
            </span>
          </a>
        </div>
      </div>

      <style href="contact" precedence="default">{`
        .contact{padding-bottom:clamp(64px,10vh,120px)}
        .contact-h{margin:22px 0 clamp(40px,6vw,72px);font-weight:700;letter-spacing:-.055em;line-height:.95;font-size:clamp(46px,10vw,168px)}
        .contact-h .accent{font-size:1.04em}
        .hw{display:inline-block;white-space:nowrap;margin-right:.22em}
        .hw:last-child{margin-right:0}
        .hl{display:inline-block;will-change:transform}
        .hl.hop{animation:hop .6s var(--ease)}
        @keyframes hop{0%{transform:translateY(0)}35%{transform:translateY(-.16em)}65%{transform:translateY(.03em)}100%{transform:translateY(0)}}
        .contact-grid{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:40px;align-items:end;border-top:1px solid var(--line);padding-top:clamp(32px,4vw,48px)}
        .contact-label{margin:0 0 14px;font-size:12px;text-transform:uppercase;letter-spacing:.06em;color:var(--mute)}
        .email-row{display:flex;flex-wrap:wrap;align-items:center;gap:14px 18px}
        .email{font-size:clamp(24px,4.2vw,58px);font-weight:600;letter-spacing:-.045em;line-height:1.1;text-decoration:underline;text-decoration-thickness:2px;text-underline-offset:.16em;text-decoration-color:rgba(13,13,13,.25);transition:text-decoration-color .4s var(--ease);overflow-wrap:anywhere}
        .email:hover{text-decoration-color:var(--ink)}
        .copy{height:36px;padding:0 16px;border-radius:999px;font-size:13px;font-weight:500;box-shadow:inset 0 0 0 1px rgba(13,13,13,.18);transition:background-color .4s var(--ease),color .4s var(--ease),transform .4s var(--ease)}
        .copy:hover{transform:translateY(-2px)}
        .copy.is-copied{background:var(--ink);color:#fff;box-shadow:none}
        .contact-links{list-style:none;margin:36px 0 0;padding:0;display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:18px 32px}
        .contact-links li{display:flex;flex-direction:column;gap:6px;font-size:16px;font-weight:500}
        .contact-links .mono{font-size:11px;font-weight:400;text-transform:uppercase;letter-spacing:.06em;color:var(--mute)}
        .contact-links a{display:inline-flex;align-items:center;gap:7px;width:fit-content;max-width:100%;overflow-wrap:anywhere;background:linear-gradient(var(--ink),var(--ink)) 0 100%/0 1px no-repeat;transition:background-size .6s var(--ease)}
        .contact-links a:hover{background-size:100% 1px}
        .badge{position:relative;width:168px;height:168px;display:grid;place-items:center;border-radius:50%;transition:transform .6s var(--ease)}
        .badge:hover{transform:scale(1.05)}
        .badge-ring{position:absolute;inset:0;width:100%;height:100%;animation:spin 18s linear infinite}
        .badge-ring text{font-family:var(--font-mono);font-size:13.5px;letter-spacing:.1em;fill:var(--ink)}
        .badge-core{width:72px;height:72px;border-radius:50%;background:var(--ink);color:#fff;display:grid;place-items:center;transition:transform .6s var(--ease)}
        .badge:hover .badge-core{transform:rotate(45deg)}
        @keyframes spin{to{transform:rotate(360deg)}}
        @media (max-width: 760px){
          .contact-grid{grid-template-columns:minmax(0,1fr)}
          .badge{width:132px;height:132px;justify-self:end}
          .badge-core{width:56px;height:56px}
        }
      `}</style>
    </section>
  );
}
