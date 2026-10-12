import { CERTIFICATIONS, EDUCATION, EXPERIENCE, PROFILE, PROJECTS } from "@/lib/data";
import SectionTag from "../ui/SectionTag";
import IdCard from "../ui/IdCard";
import { ArrowDown, ArrowUpRight, LinkedInIcon } from "../ui/Icons";

export default function About() {
  const edu = EDUCATION[0];
  const current = EXPERIENCE.find((x) => x.end === "Present");
  const job = EXPERIENCE.find((x) => x.type === "Internship") ?? EXPERIENCE[0];

  const facts: { k: string; v: React.ReactNode }[] = [
    { k: "Location", v: PROFILE.location },
    { k: "Education", v: `B.Tech CSE · ${edu.school} · ${edu.score.replace("CGPA: ", "CGPA ")}` },
    ...(current ? [{ k: "Currently", v: `${current.role} · ${current.company} (${current.start} – ${current.end})` }] : []),
    { k: "Internship", v: `${job.role} · ${job.company}, ${job.place} (${job.start} – ${job.end})` },
    { k: "Email", v: <a href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a> },
  ];

  const back = [
    "AI · Machine Learning · Data Analytics",
    `B.Tech ${edu.field.replace("Computer Science and Engineering", "CSE")} · ${edu.score.replace(":", "")}`,
    current ? `${current.role} · ${current.company}` : `${job.role.replace("Artificial Intelligence", "AI")} · ${job.company}`,
    `Built: ${PROJECTS.map((p) => p.title.replace("Online Interactive ", "").replace(" Application", "")).join(", ")}`,
    `Certified: ${CERTIFICATIONS.map((c) => c.title.replace("Microsoft ", "")).join(", ")}`,
  ];

  return (
    <section id="about" className="section about" aria-labelledby="about-title">
      <div className="wrap about-grid">
        <div className="about-left">
          <SectionTag id="about" />
          <h2 id="about-title" className="h2 about-h">
            <span className="rv-mask">
              <span>Hi, I&apos;m</span>
            </span>
            <span className="rv-mask" style={{ "--i": 1 } as React.CSSProperties}>
              <span>
                <em>{PROFILE.firstName}.</em>
              </span>
            </span>
          </h2>
          <p className="lead rv" style={{ "--i": 1 } as React.CSSProperties}>
            {PROFILE.resumeSummary}
          </p>
          <p className="about-extra rv" style={{ "--i": 2 } as React.CSSProperties}>
            <span className="mono">At {job.company} —</span> {job.points[0]}
          </p>
          <div className="about-btns rv" style={{ "--i": 3 } as React.CSSProperties}>
            <a href={PROFILE.resume} download={PROFILE.resumeFileName} className="btn btn-primary">
              Résumé <ArrowDown size={15} />
            </a>
            {PROFILE.github && (
              <a href={PROFILE.github} target="_blank" rel="noreferrer" className="btn btn-ghost">
                GitHub <ArrowUpRight size={15} />
              </a>
            )}
            {PROFILE.linkedin && (
              <a href={PROFILE.linkedin} target="_blank" rel="noreferrer" className="btn btn-ghost">
                <LinkedInIcon size={15} /> LinkedIn <ArrowUpRight size={15} />
              </a>
            )}
          </div>
        </div>

        <div className="about-center">
          <IdCard
            name={PROFILE.name}
            role="AI · ML · Data Analytics"
            strap={`${PROFILE.name.toUpperCase()} · ${PROFILE.role.toUpperCase()} · `}
            rows={[
              { k: "Dept.", v: "CSE" },
              { k: "Focus", v: "Artificial Intelligence" },
              { k: "Valid till", v: edu.end.slice(-4) },
            ]}
            back={back}
            email={PROFILE.email}
          />
        </div>

        <aside className="about-right" aria-label="Quick facts">
          <div className="facts card rv" style={{ "--i": 2 } as React.CSSProperties}>
            <p className="facts-title mono">Quick facts</p>
            <dl>
              {facts.map((f) => (
                <div key={f.k}>
                  <dt className="mono">{f.k}</dt>
                  <dd>{f.v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <figure className="quote rv" style={{ "--i": 3 } as React.CSSProperties}>
            <blockquote>
              <span aria-hidden>“</span>Strong foundations in ML and data, hands-on AI projects, and an eagerness to
              keep <em className="accent">growing.</em>
              <span aria-hidden>”</span>
            </blockquote>
            <figcaption className="mono">Paraphrased from my résumé summary</figcaption>
          </figure>
        </aside>
      </div>

      <style href="about" precedence="default">{`
        .about{overflow:clip}
        .about-grid{display:grid;grid-template-columns:minmax(0,1fr) 320px minmax(0,1fr);gap:clamp(24px,3.4vw,56px);align-items:stretch}
        .about-left,.about-right{display:flex;flex-direction:column;gap:22px}
        .about-right{justify-content:flex-end}
        .about-h{font-size:clamp(44px,5.6vw,84px);margin:4px 0 6px}
        .about-h em{font-size:1.06em}
        .about-extra{font-size:14px;line-height:1.6;color:var(--mute);margin:0;max-width:52ch}
        .about-extra .mono{font-size:12px;color:var(--ink);text-transform:uppercase;letter-spacing:.03em}
        .about-btns{display:flex;flex-wrap:wrap;gap:10px;margin-top:6px}
        .about-left .lead{margin:0}
        .facts{padding:24px 24px 10px}
        .facts-title{margin:0 0 6px;font-size:12px;text-transform:uppercase;letter-spacing:.06em;color:var(--mute)}
        .facts dl{margin:0}
        .facts dl > div{display:grid;grid-template-columns:96px minmax(0,1fr);gap:12px;padding:14px 0;border-top:1px solid var(--line)}
        .facts dl > div:first-child{border-top:0}
        .facts dt{font-size:11.5px;text-transform:uppercase;letter-spacing:.05em;color:var(--mute);padding-top:2px}
        .facts dd{margin:0;font-size:14.5px;line-height:1.45;color:var(--ink);overflow-wrap:anywhere}
        .facts dd a{text-decoration:underline;text-underline-offset:3px;text-decoration-thickness:1px}
        .quote{margin:0;padding:6px 4px}
        .quote blockquote{margin:0;font-size:clamp(21px,1.9vw,28px);line-height:1.2;font-weight:600;letter-spacing:-.03em}
        .quote blockquote .accent{font-size:1.1em}
        .quote figcaption{margin-top:12px;font-size:11px;letter-spacing:.05em;text-transform:uppercase;color:var(--mute)}
        @media (max-width: 1100px){
          .about-grid{grid-template-columns:minmax(0,1fr) 320px}
          .about-right{grid-column:1 / -1;display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);align-items:end}
        }
        @media (max-width: 760px){
          .about-grid{grid-template-columns:minmax(0,1fr)}
          .about-right{grid-template-columns:minmax(0,1fr)}
          .about-center{padding-top:8px}
        }
      `}</style>
    </section>
  );
}
