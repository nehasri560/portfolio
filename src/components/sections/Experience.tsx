"use client";

import { useEffect, useRef, useState } from "react";
import { EDUCATION, EXPERIENCE } from "@/lib/data";
import { useInView, useScrollProgress } from "@/lib/hooks";
import { scrollToTarget } from "@/lib/scroll";
import SectionTag from "../ui/SectionTag";
import { ArrowRight } from "../ui/Icons";

type Stop = { sort: string; year: string; title: string; place: string; detail: string; kind: string; date: string };

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const sortKey = (d: string) => {
  const [m, y] = d.split(" ");
  return `${y}-${String(MONTHS.indexOf(m) + 1).padStart(2, "0")}`;
};

// education is split into its start and its finish so it sits around the internship in time
const STOPS: Stop[] = [
  ...EDUCATION.flatMap((e) => [
    {
      sort: sortKey(e.start),
      year: e.start.slice(-4),
      date: e.start,
      kind: "Education",
      title: `${e.degree}, ${e.field}`,
      place: `${e.school}, ${e.place}`,
      detail: "Began the B.Tech in Computer Science and Engineering.",
    },
    {
      sort: sortKey(e.end),
      year: e.end.slice(-4),
      date: `${e.start} – ${e.end}`,
      kind: "Graduated",
      title: `${e.degree}, ${e.field}`,
      place: `${e.school}, ${e.place}`,
      detail: `${e.score} · CSE graduate specialized in Artificial Intelligence.`,
    },
  ]),
  ...EXPERIENCE.map((x) => ({
    sort: sortKey(x.start),
    year: x.year,
    date: `${x.start} – ${x.end}`,
    kind: x.type,
    title: x.role,
    place: x.place ? `${x.company}, ${x.place}` : x.company,
    detail: x.points[0] ?? "",
  })),
].sort((a, b) => a.sort.localeCompare(b.sort));

export default function Experience() {
  const listRef = useRef<HTMLDivElement>(null);
  const progress = useScrollProgress(listRef, { start: 0.75, end: 0.55 });
  const [marks, setMarks] = useState<number[]>([]);
  // measure lazily: the section is content-visibility: auto until it nears the viewport
  const near = useInView(listRef, { rootMargin: "300px 0px" });

  // where each stop sits along the spine (0 → 1)
  useEffect(() => {
    const list = listRef.current;
    if (!list || !near) return;
    const measure = () => {
      const h = list.offsetHeight || 1;
      setMarks(Array.from(list.querySelectorAll<HTMLElement>(".stop")).map((el) => (el.offsetTop + 18) / h));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(list);
    return () => ro.disconnect();
  }, [near]);

  return (
    <section id="experience" className="section exp cv" aria-labelledby="exp-title">
      <div className="wrap exp-grid">
        <div className="exp-head">
          <SectionTag id="experience" />
          <h2 id="exp-title" className="h2 exp-h">
            <span className="rv-mask">
              <span>The path</span>
            </span>
            <span className="rv-mask" style={{ "--i": 1 } as React.CSSProperties}>
              <span>
                so <em>far.</em>
              </span>
            </span>
          </h2>
        </div>

        <div ref={listRef} className="path" style={{ "--p": progress } as React.CSSProperties}>
          <span className="spine-track" aria-hidden />
          <span className="spine-fill" aria-hidden />
          <ol className="path-list">
          {STOPS.map((s, i) => {
            const lit = marks[i] !== undefined && progress >= marks[i] - 0.02;
            return (
              <li key={`${s.kind}-${s.sort}`} className={`stop ${lit ? "is-lit" : ""}`}>
                <span className="dot" aria-hidden />
                <p className="stop-year mono">
                  {s.year} <span>· {s.kind}</span>
                </p>
                <h3 className="stop-title">{s.title}</h3>
                <p className="stop-place">
                  {s.place} <span className="mono">{s.date}</span>
                </p>
                {s.detail && <p className="stop-detail">{s.detail}</p>}
              </li>
            );
          })}
          <li className={`stop stop-next ${progress > 0.97 ? "is-lit" : ""}`}>
            <span className="dot" aria-hidden />
            <a
              href="#contact"
              className="next-card"
              onClick={(e) => {
                e.preventDefault();
                scrollToTarget("#contact");
              }}
            >
              <span className="mono">Next —</span>
              <span className="next-title">
                Your <em className="accent">team?</em>
              </span>
              <ArrowRight size={22} />
            </a>
          </li>
          </ol>
        </div>
      </div>

      <style href="experience" precedence="default">{`
        .exp-grid{display:grid;grid-template-columns:minmax(0,5fr) minmax(0,7fr);gap:clamp(32px,5vw,80px);align-items:start}
        .exp-head{position:sticky;top:110px}
        .exp-h{margin:18px 0 0}
        .path{position:relative;padding-left:48px}
        .path-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:clamp(48px,8vh,84px)}
        .spine-track,.spine-fill{position:absolute;left:11px;top:8px;bottom:40px;width:2px;border-radius:2px}
        .spine-track{background:var(--soft)}
        .spine-fill{background:var(--ink);transform-origin:50% 0;transform:scaleY(var(--p))}
        .stop{position:relative;color:var(--mute);transform:translateX(10px);transition:color .8s var(--ease),transform .9s var(--ease)}
        .stop.is-lit{color:var(--ink);transform:none}
        .stop:not(.is-lit) .stop-place,.stop:not(.is-lit) .stop-year{color:var(--mute)}
        .stop:not(.is-lit) .next-card{border-color:rgba(13,13,13,.16)}
        .dot{position:absolute;left:-48px;top:4px;width:24px;height:24px;border-radius:50%;background:var(--paper);box-shadow:inset 0 0 0 2px var(--soft);transition:box-shadow .6s var(--ease),background-color .6s var(--ease)}
        .dot::after{content:"";position:absolute;inset:8px;border-radius:50%;background:var(--faint);transition:background-color .6s var(--ease),transform .6s var(--ease)}
        .stop.is-lit .dot{box-shadow:inset 0 0 0 2px var(--ink)}
        .stop.is-lit .dot::after{background:var(--ink);transform:scale(1.2)}
        .stop-year{margin:0 0 10px;font-size:12px;letter-spacing:.05em;text-transform:uppercase}
        .stop-year span{color:var(--mute)}
        .stop-title{margin:0;font-size:clamp(24px,2.6vw,36px);font-weight:700;letter-spacing:-.04em;line-height:1.08}
        .stop-place{margin:10px 0 0;font-size:15px;font-weight:500;color:var(--ink-2);display:flex;flex-wrap:wrap;gap:4px 12px;align-items:baseline}
        .stop-place .mono{font-size:11.5px;color:var(--mute);text-transform:uppercase;letter-spacing:.04em}
        .stop-detail{margin:12px 0 0;font-size:15px;line-height:1.6;color:var(--mute);max-width:58ch}
        .next-card{display:flex;align-items:center;gap:16px;padding:26px 28px;border-radius:24px;border:1.5px dashed rgba(13,13,13,.28);transition:background-color .5s var(--ease),color .5s var(--ease),border-color .5s var(--ease)}
        .next-card .mono{font-size:12px;text-transform:uppercase;letter-spacing:.06em;color:var(--mute)}
        .next-title{flex:1;font-size:clamp(26px,2.8vw,40px);font-weight:700;letter-spacing:-.045em}
        .next-card:hover{background:var(--ink);color:#fff;border-color:var(--ink)}
        .next-card:hover .accent,.next-card:hover .mono{color:rgba(255,255,255,.7)}
        @media (max-width: 860px){
          .exp-grid{grid-template-columns:minmax(0,1fr)}
          .exp-head{position:relative;top:0}
          .path{padding-left:40px}
          .dot{left:-40px}
          .spine-track,.spine-fill{left:11px}
        }
      `}</style>
    </section>
  );
}
