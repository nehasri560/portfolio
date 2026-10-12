"use client";

import { useState } from "react";
import { PROJECTS } from "@/lib/data";
import SectionTag from "../ui/SectionTag";
import TechLogo from "../ui/TechLogo";
import { ArrowUpRight } from "../ui/Icons";
import { ChatbotUI, CommunityUI, MINI_CSS, NewsDeskUI } from "./WorkMiniUI";

const MINI: Record<string, () => React.ReactElement> = {
  "news-brief-desk": NewsDeskUI,
  "entrepreneur-club": CommunityUI,
  "ai-chatbot": ChatbotUI,
};

export default function Work() {
  const [open, setOpen] = useState(0);
  const n = PROJECTS.length;

  return (
    <section id="work" className="section work cv" aria-labelledby="work-title">
      <div className="wrap">
        <div className="work-head">
          <div>
            <SectionTag id="work" />
            <h2 id="work-title" className="h2 work-h">
              <span className="rv-mask">
                <span>
                  Things I&apos;ve <em>built.</em>
                </span>
              </span>
            </h2>
          </div>
          <p className="work-count mono rv">
            {String(n).padStart(2, "0")} projects · hover, focus or tap to open
          </p>
        </div>

        <div className="acc rv" style={{ "--n": n } as React.CSSProperties}>
          {PROJECTS.map((p, i) => {
            const isOpen = open === i;
            const Mini = MINI[p.id];
            return (
              <article
                key={p.id}
                className={`panel ${isOpen ? "is-open" : ""}`}
                onPointerEnter={(e) => e.pointerType === "mouse" && setOpen(i)}
                onFocusCapture={() => setOpen(i)}
                aria-labelledby={`${p.id}-title`}
              >
                <button
                  type="button"
                  className="spine"
                  aria-expanded={isOpen}
                  aria-controls={`${p.id}-body`}
                  onClick={() => setOpen(i)}
                >
                  <span className="spine-n mono">{p.index}</span>
                  <span className="spine-title">{p.title}</span>
                  <span className="spine-plus" aria-hidden>
                    +
                  </span>
                </button>

                <div id={`${p.id}-body`} className="panel-body" aria-hidden={!isOpen} inert={!isOpen}>
                  <div className="panel-inner">
                    <div className="panel-text">
                      <p className="panel-kicker mono">
                        <span>{p.index}</span> {p.kicker} · {p.date}
                      </p>
                      <h3 id={`${p.id}-title`} className="panel-title">
                        {p.title}
                      </h3>
                      <p className="panel-desc">{p.description}</p>
                      <ul className="panel-feats">
                        {p.features.map((f) => (
                          <li key={f}>{f}</li>
                        ))}
                      </ul>
                      <ul className="panel-tech" aria-label="Tech stack">
                        {p.tech.map((t, k) => (
                          <li key={t} className="chip">
                            <TechLogo id={p.techIds[k]} size={14} />
                            {t}
                          </li>
                        ))}
                      </ul>
                      {(p.github || p.demo) && (
                        <div className="panel-links">
                          {p.github && (
                            <a href={p.github} target="_blank" rel="noreferrer" className="btn btn-primary">
                              View on GitHub <ArrowUpRight size={15} />
                            </a>
                          )}
                          {p.demo && (
                            <a href={p.demo} target="_blank" rel="noreferrer" className="btn btn-ghost">
                              Live demo <ArrowUpRight size={15} />
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                    <figure className="panel-ui">
                      <div className="panel-ui-frame">{Mini && <Mini />}</div>
                      <figcaption className="mono">Illustrative UI — not a screenshot</figcaption>
                    </figure>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <style href="work" precedence="default">{MINI_CSS}</style>
      <style href="work-2" precedence="default">{`
        .panel:not(.is-open) .mu-post,.panel:not(.is-open) .mu-msg{animation:none;opacity:0}
        .work-head{display:flex;align-items:flex-end;justify-content:space-between;gap:24px;flex-wrap:wrap;margin-bottom:36px}
        .work-h{margin:18px 0 0}
        .work-count{font-size:12px;color:var(--mute);text-transform:uppercase;letter-spacing:.05em;margin:0}
        .acc{--spine:96px;--gap:12px;--acc-h:max(min(78svh,600px),520px);display:flex;gap:var(--gap)}
        .panel{position:relative;flex:.0001 1 var(--spine);min-width:var(--spine);border-radius:28px;background:var(--card);box-shadow:inset 0 0 0 1px var(--line);overflow:hidden;transition:flex-grow .9s var(--ease),box-shadow .6s var(--ease)}
        .panel.is-open{flex-grow:8;box-shadow:inset 0 0 0 1px var(--line),var(--shadow-soft)}
        .panel:has(:focus-visible){outline:2px solid var(--ink);outline-offset:3px}
        .spine{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:space-between;padding:26px 0;transition:opacity .4s var(--ease)}
        .spine:focus-visible{outline:none}
        .panel.is-open .spine{opacity:0;pointer-events:none}
        .spine-n{font-size:12px;color:var(--mute)}
        .spine-title{writing-mode:vertical-rl;transform:rotate(180deg);font-size:20px;font-weight:600;letter-spacing:-.03em;white-space:nowrap;max-height:calc(100% - 120px);overflow:hidden;text-overflow:ellipsis}
        .spine-plus{width:40px;height:40px;border-radius:50%;display:grid;place-items:center;font-size:22px;font-weight:300;box-shadow:inset 0 0 0 1px rgba(13,13,13,.18);transition:transform .6s var(--ease),background-color .4s var(--ease),color .4s var(--ease)}
        .spine:hover .spine-plus{transform:rotate(90deg);background:var(--ink);color:#fff}
        .panel-body{position:absolute;inset:0;opacity:0;transition:opacity .5s var(--ease)}
        /* the open panel's body sits in flow, so the panel grows to fit its content instead of clipping it */
        .panel.is-open .panel-body{position:relative;opacity:1;transition:opacity .7s var(--ease) .25s}
        .panel-inner{min-height:var(--acc-h);width:calc(min(1320px, 100vw - var(--gutter) * 2) - (var(--spine) + var(--gap)) * (var(--n) - 1));display:grid;grid-template-columns:minmax(0,1.05fr) minmax(0,1fr);gap:clamp(20px,3vw,44px);padding:clamp(24px,3vw,44px)}
        .panel-text{display:flex;flex-direction:column}
        .panel-kicker{margin:0;font-size:11.5px;text-transform:uppercase;letter-spacing:.06em;color:var(--mute)}
        .panel-kicker span{color:var(--ink);margin-right:6px}
        .panel-title{margin:14px 0 14px;font-size:clamp(30px,3.2vw,48px);font-weight:700;letter-spacing:-.045em;line-height:1}
        .panel-desc{margin:0;font-size:16px;line-height:1.55;color:var(--ink-2)}
        .panel-feats{list-style:none;margin:22px 0 0;padding:0;display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:14px 20px}
        .panel-feats li{font-size:13.5px;line-height:1.5;color:var(--ink-2);padding-top:12px;border-top:1px solid var(--line)}
        .panel-tech{list-style:none;margin:auto 0 0;padding:22px 0 0;display:flex;flex-wrap:wrap;gap:6px}
        .panel-tech .chip{font-size:12.5px;height:28px}
        .panel-tech .chip svg{color:var(--ink-2)}
        .panel-links{display:flex;flex-wrap:wrap;gap:8px;margin-top:16px}
        .panel-ui{margin:0;display:flex;flex-direction:column;gap:10px;min-height:0}
        .panel-ui-frame{flex:1;min-height:320px;border-radius:20px;background:var(--paper);box-shadow:inset 0 0 0 1px var(--line);overflow:hidden;clip-path:inset(0 0 0 100% round 20px);transition:clip-path 1.1s var(--ease)}
        .panel.is-open .panel-ui-frame{clip-path:inset(0 0 0 0 round 20px);transition-delay:.3s}
        .panel-ui figcaption{font-size:10.5px;letter-spacing:.06em;text-transform:uppercase;color:var(--mute);text-align:right}
        @media (max-width: 1100px){
          .panel-inner{grid-template-columns:minmax(0,1fr)}
          .panel-ui{display:none}
        }
        @media (max-width: 900px){
          .acc{flex-direction:column;height:auto;min-height:0}
          .panel{flex:none;min-width:0}
          .spine{position:relative;inset:auto;width:100%;flex-direction:row;padding:20px 22px;gap:14px;justify-content:flex-start}
          .panel.is-open .spine{opacity:1;pointer-events:auto}
          .spine-title{writing-mode:horizontal-tb;transform:none;font-size:18px;white-space:normal;text-align:left;flex:1;max-height:none}
          .panel.is-open .spine-plus{transform:rotate(45deg);background:var(--ink);color:#fff}
          .panel-body{position:relative;inset:auto;display:grid;grid-template-rows:0fr;transition:grid-template-rows .8s var(--ease),opacity .5s var(--ease)}
          .panel.is-open .panel-body{grid-template-rows:1fr}
          .panel-inner{min-height:0;overflow:hidden;width:auto;height:auto;padding:0 22px}
          .panel.is-open .panel-inner{min-height:0}
          .panel.is-open .panel-inner{padding-bottom:24px}
          .panel-title{display:none}
          .panel-kicker{margin-top:2px}
          .panel-desc{margin-top:12px}
          .panel-feats{grid-template-columns:minmax(0,1fr)}
          .panel-ui{display:flex}
          .panel-ui-frame{height:240px;min-height:0;flex:none}
        }
      `}</style>
    </section>
  );
}
