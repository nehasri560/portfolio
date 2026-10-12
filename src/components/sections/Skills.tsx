"use client";

import { useRef, useState } from "react";
import { SKILL_GROUPS, SKILLS, type SkillWithMeta } from "@/lib/data";
import { useInView } from "@/lib/hooks";
import SectionTag from "../ui/SectionTag";
import TechLogo, { BRAND, isBrand } from "../ui/TechLogo";

const FAMILIES = ["All", ...SKILL_GROUPS.map((g) => g.family)];

export default function Skills() {
  const gridRef = useRef<HTMLOListElement>(null);
  const inView = useInView(gridRef, { threshold: 0.15 });
  const [family, setFamily] = useState("All");
  const [current, setCurrent] = useState<SkillWithMeta>(SKILLS[0]);

  return (
    <section id="skills" className="section skills cv" aria-labelledby="skills-title">
      <div className="wrap">
        <SectionTag id="skills" />
        <h2 id="skills-title" className="h2 skills-h">
          <span className="rv-mask">
            <span>The periodic table</span>
          </span>
          <span className="rv-mask" style={{ "--i": 1 } as React.CSSProperties}>
            <span>
              of my <em>stack.</em>
            </span>
          </span>
        </h2>

        <div className="chips rv" role="group" aria-label="Filter skills by family">
          {FAMILIES.map((f) => (
            <button
              key={f}
              type="button"
              className={`fchip ${family === f ? "is-on" : ""}`}
              aria-pressed={family === f}
              onClick={() => setFamily(f)}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="skills-layout">
          <ol ref={gridRef} className={`ptable ${inView ? "is-in" : ""}`} aria-label="Skills">
            {SKILLS.map((s, i) => {
              const row = Math.floor(i / 8);
              const col = i % 8;
              const dim = family !== "All" && s.family !== family;
              return (
                <li key={s.id} style={{ "--d": `${(row + col) * 40}ms`, "--dm": `${(Math.floor(i / 4) + (i % 4)) * 40}ms` } as React.CSSProperties}>
                  <button
                    type="button"
                    className={`el ${dim ? "is-dim" : ""} ${current.id === s.id ? "is-current" : ""}`}
                    onPointerEnter={() => setCurrent(s)}
                    onFocus={() => setCurrent(s)}
                    onClick={() => setCurrent(s)}
                    aria-label={`${s.name} — ${s.family}`}
                  >
                    <span className="el-n mono">{s.number}</span>
                    <span className="el-sym">{s.symbol}</span>
                    <span className="el-name">{s.name}</span>
                    <span className="el-fam mono">{s.family}</span>
                  </button>
                </li>
              );
            })}
          </ol>

          <aside className="inspector card" aria-label={`Selected skill: ${current.name}`}>
            <div className="insp-logo" style={{ "--tint": isBrand(current.id) ? BRAND[current.id].tint : "#0d0d0d" } as React.CSSProperties}>
              <div key={current.id} className="insp-pop">
                <TechLogo id={current.id} size={150} decorative={false} />
              </div>
            </div>
            <p className="insp-meta mono">
              <span>No. {String(current.number).padStart(2, "0")}</span>
              <span>{current.symbol}</span>
            </p>
            <p className="insp-name">{current.name}</p>
            <p className="insp-fam mono">{current.family}</p>
            <div className="insp-used">
              <p className="mono">Used in</p>
              {current.usedIn.length ? (
                <ul>
                  {current.usedIn.map((u) => (
                    <li key={u}>{u}</li>
                  ))}
                </ul>
              ) : (
                <p className="insp-none">Listed under Technical Skills on my résumé.</p>
              )}
            </div>
          </aside>
        </div>
      </div>

      <style href="skills" precedence="default">{`
        .skills-h{margin:18px 0 34px}
        .chips{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:28px}
        .fchip{height:38px;padding:0 16px;border-radius:999px;font-size:13.5px;font-weight:500;color:var(--ink-2);box-shadow:inset 0 0 0 1px rgba(13,13,13,.14);transition:background-color .4s var(--ease),color .4s var(--ease),transform .4s var(--ease)}
        .fchip:hover{transform:translateY(-1px);color:var(--ink)}
        .fchip.is-on{background:var(--ink);color:#fff;box-shadow:none}
        .skills-layout{display:grid;grid-template-columns:minmax(0,1fr) 320px;gap:clamp(16px,2.4vw,32px);align-items:start}
        .ptable{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(8,minmax(0,1fr));gap:8px}
        .ptable li{opacity:0;transform:translate(-10px,14px) scale(.94);transition:opacity .7s var(--ease),transform .9s var(--ease);transition-delay:var(--d)}
        .ptable.is-in li{opacity:1;transform:none}
        .el{position:relative;width:100%;aspect-ratio:1/1.08;display:flex;flex-direction:column;justify-content:space-between;text-align:left;padding:10px 10px 9px;border-radius:14px;background:var(--card);box-shadow:inset 0 0 0 1px var(--line);transition:background-color .35s var(--ease),color .35s var(--ease),opacity .45s var(--ease),transform .45s var(--ease),box-shadow .45s var(--ease)}
        .el:hover,.el.is-current{background:var(--ink);color:#fff;transform:translateY(-3px);box-shadow:0 18px 30px -18px rgba(13,13,13,.55)}
        .el.is-dim{opacity:.22;transform:scale(.96)}
        .el.is-dim:hover,.el.is-dim:focus-visible{opacity:.6}
        .el-n{font-size:10px;color:var(--mute)}
        .el:hover .el-n,.el.is-current .el-n,.el:hover .el-fam,.el.is-current .el-fam{color:rgba(255,255,255,.6)}
        .el-sym{font-size:clamp(22px,2.3vw,34px);font-weight:700;letter-spacing:-.05em;line-height:1}
        .el-name{font-size:11.5px;font-weight:500;line-height:1.15;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
        .el-fam{font-size:8.5px;letter-spacing:.04em;text-transform:uppercase;color:var(--mute);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .inspector{position:sticky;top:96px;padding:22px;display:flex;flex-direction:column}
        .insp-logo{position:relative;height:200px;display:grid;place-items:center;border-radius:18px;background:var(--paper);overflow:hidden;color:var(--ink)}
        .insp-logo::before{content:"";position:absolute;width:180px;height:180px;border-radius:50%;background:var(--tint);opacity:.14;filter:blur(36px)}
        .insp-pop{position:relative;animation:pop .7s var(--ease) both}
        .insp-pop img,.insp-pop svg{display:block;width:150px;height:150px}
        @keyframes pop{0%{opacity:0;transform:scale(.6) rotate(-8deg)}60%{opacity:1;transform:scale(1.06)}100%{transform:none}}
        .insp-meta{display:flex;justify-content:space-between;margin:18px 0 6px;font-size:11px;color:var(--mute);text-transform:uppercase;letter-spacing:.05em}
        .insp-name{margin:0;font-size:26px;font-weight:700;letter-spacing:-.04em;line-height:1.05}
        .insp-fam{margin:6px 0 0;font-size:11.5px;text-transform:uppercase;letter-spacing:.06em;color:var(--mute)}
        .insp-used{margin-top:18px;padding-top:14px;border-top:1px solid var(--line)}
        .insp-used > .mono{margin:0 0 8px;font-size:10.5px;text-transform:uppercase;letter-spacing:.08em;color:var(--mute)}
        .insp-used ul{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:6px}
        .insp-used li{font-size:13.5px;line-height:1.35;padding-left:14px;position:relative}
        .insp-used li::before{content:"";position:absolute;left:0;top:.55em;width:6px;height:1px;background:var(--ink)}
        .insp-none{margin:0;font-size:13.5px;color:var(--mute)}
        @media (max-width: 1000px){
          .skills-layout{grid-template-columns:minmax(0,1fr)}
          .inspector{position:relative;top:0;display:grid;grid-template-columns:150px minmax(0,1fr);column-gap:20px}
          .insp-logo{grid-row:1 / span 5;height:auto;min-height:150px}
          .insp-pop img,.insp-pop svg{width:96px;height:96px}
          .insp-meta{margin-top:0}
        }
        @media (max-width: 700px){
          .ptable{grid-template-columns:repeat(4,minmax(0,1fr))}
          .ptable li{transition-delay:var(--dm)}
          .el-fam{display:none}
        }
        @media (max-width: 480px){
          .inspector{grid-template-columns:minmax(0,1fr)}
          .insp-logo{grid-row:auto;height:170px}
          .insp-meta{margin-top:16px}
        }
      `}</style>
    </section>
  );
}
