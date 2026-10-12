import { CERTIFICATIONS } from "@/lib/data";
import SectionTag from "../ui/SectionTag";
import { ArrowUpRight } from "../ui/Icons";

export default function Certifications() {
  const count = CERTIFICATIONS.length;
  return (
    <section id="certifications" className="section certs cv" aria-labelledby="certs-title">
      <div className="wrap certs-grid">
        <div className="certs-head">
          <SectionTag id="certifications" />
          <h2 id="certs-title" className="h2 certs-h">
            <span className="rv-mask">
              <span>Always</span>
            </span>
            <span className="rv-mask" style={{ "--i": 1 } as React.CSSProperties}>
              <span>
                <em>learning.</em>
              </span>
            </span>
          </h2>
          <p className="certs-count mono rv">
            {String(count).padStart(2, "0")} {count === 1 ? "certification" : "certifications"} on my résumé
          </p>
        </div>

        <ol className="certs-list">
          {CERTIFICATIONS.map((c, i) => {
            const body = (
              <>
                <span className="cert-n mono">{String(i + 1).padStart(2, "0")}</span>
                <span className="cert-title">{c.title}</span>
                <span className="cert-issuer mono">{c.issuer}</span>
                <span className="cert-arrow" aria-hidden>
                  <ArrowUpRight size={20} />
                </span>
              </>
            );
            return (
              <li key={c.title} className="rv" style={{ "--i": i } as React.CSSProperties}>
                {c.href ? (
                  <a className="cert" href={c.href} target="_blank" rel="noreferrer">
                    {body}
                  </a>
                ) : (
                  // no certificate URL on the résumé: focusable for the hover effect, but not a link
                  <div className="cert" tabIndex={0}>
                    {body}
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      </div>

      <style href="certifications" precedence="default">{`
        .certs{background:var(--card);border-block:1px solid var(--line)}
        .certs-grid{display:grid;grid-template-columns:minmax(0,5fr) minmax(0,7fr);gap:clamp(32px,5vw,80px);align-items:start}
        .certs-head{position:sticky;top:110px}
        .certs-h{margin:18px 0 18px}
        .certs-count{margin:0;font-size:12px;color:var(--mute);text-transform:uppercase;letter-spacing:.05em}
        .certs-list{list-style:none;margin:0;padding:0;border-top:1px solid var(--line)}
        .certs-list li{border-bottom:1px solid var(--line)}
        .cert{position:relative;isolation:isolate;display:grid;grid-template-columns:56px minmax(0,1fr) auto 32px;align-items:center;gap:16px;padding:clamp(24px,3.6vw,40px) 18px;overflow:hidden;transition:color .5s var(--ease)}
        .cert::before{content:"";position:absolute;inset:0;z-index:-1;background:var(--ink);transform:scaleX(0);transform-origin:0 50%;transition:transform .7s var(--ease)}
        .cert:hover,.cert:focus-visible{color:#fff}
        .cert:hover::before,.cert:focus-visible::before{transform:scaleX(1)}
        .cert:focus-visible{outline-offset:-2px;border-radius:0}
        .cert-n{font-size:12px;color:var(--mute);transition:color .5s var(--ease)}
        .cert-title{font-size:clamp(22px,2.6vw,38px);font-weight:600;letter-spacing:-.04em;line-height:1.1}
        .cert-issuer{font-size:12px;text-transform:uppercase;letter-spacing:.05em;color:var(--mute);transition:color .5s var(--ease);text-align:right}
        .cert:hover .cert-n,.cert:hover .cert-issuer,.cert:focus-visible .cert-n,.cert:focus-visible .cert-issuer{color:rgba(255,255,255,.65)}
        .cert-arrow{display:grid;place-items:center;opacity:0;transform:translate(-14px,8px);transition:opacity .5s var(--ease),transform .6s var(--ease)}
        .cert:hover .cert-arrow,.cert:focus-visible .cert-arrow{opacity:1;transform:none}
        @media (max-width: 860px){
          .certs-grid{grid-template-columns:minmax(0,1fr)}
          .certs-head{position:relative;top:0}
        }
        @media (max-width: 560px){
          .cert{grid-template-columns:36px minmax(0,1fr) 22px;row-gap:6px;padding-inline:10px}
          .cert-issuer{grid-column:2;grid-row:2;text-align:left}
          .cert-arrow{grid-column:3;grid-row:1 / span 2}
        }
      `}</style>
    </section>
  );
}
