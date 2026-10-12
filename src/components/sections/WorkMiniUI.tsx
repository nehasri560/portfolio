/**
 * Grayscale, pure-CSS sketches that hint at what each project does.
 * Labelled "Illustrative UI" where used — these are not screenshots.
 */

const Line = ({ w, h = 7, dark = false }: { w: string; h?: number; dark?: boolean }) => (
  <i className={`mu-line ${dark ? "is-dark" : ""}`} style={{ width: w, height: h }} />
);

export function CommunityUI() {
  return (
    <div className="mu mu-club" aria-hidden>
      <div className="mu-bar">
        <span />
        <span />
        <span />
        <i className="mu-url" />
        <b className="mu-pill">Signed in</b>
      </div>
      <div className="mu-club-body">
        <div className="mu-side">
          <i className="mu-logo" />
          {["58%", "70%", "46%", "64%"].map((w, i) => (
            <div key={i} className={`mu-nav ${i === 0 ? "is-on" : ""}`}>
              <Line w={w} h={6} dark={i === 0} />
            </div>
          ))}
        </div>
        <div className="mu-feed">
          <div className="mu-compose">
            <i className="mu-ava" />
            <Line w="60%" />
            <b className="mu-btn">Share idea</b>
          </div>
          {[0, 1, 2].map((k) => (
            <div key={k} className="mu-post" style={{ "--k": k } as React.CSSProperties}>
              <div className="mu-post-head">
                <i className="mu-ava" />
                <div>
                  <Line w="90px" dark />
                  <Line w="54px" h={5} />
                </div>
              </div>
              <Line w="92%" />
              <Line w={k === 1 ? "64%" : "78%"} />
              <div className="mu-react">
                <b />
                <b />
                <b />
              </div>
            </div>
          ))}
        </div>
        <div className="mu-members">
          <Line w="60%" h={6} dark />
          {[0, 1, 2, 3, 4].map((k) => (
            <div key={k} className="mu-member">
              <i className="mu-ava sm" />
              <Line w={`${50 + ((k * 13) % 30)}%`} h={5} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function NewsDeskUI() {
  const stages = ["Draft", "In review", "Approved", "Published"];
  return (
    <div className="mu mu-news" aria-hidden>
      <div className="mu-bar">
        <span />
        <span />
        <span />
        <i className="mu-url" />
        <b className="mu-pill">Editor</b>
      </div>
      <div className="mu-news-body">
        <div className="mu-side">
          <i className="mu-logo" />
          {["Incoming", "Stories", "Review", "Analytics"].map((l, i) => (
            <div key={l} className={`mu-nav ${i === 2 ? "is-on" : ""}`}>
              <span className="mu-navlabel">{l}</span>
            </div>
          ))}
        </div>
        <div className="mu-feed">
          <div className="mu-post mu-story" style={{ "--k": 0 } as React.CSSProperties}>
            <div className="mu-stages">
              {stages.map((s, i) => (
                <b key={s} className={i < 2 ? "is-done" : ""}>
                  {s}
                </b>
              ))}
            </div>
            <Line w="78%" h={9} dark />
            <Line w="94%" />
            <Line w="88%" />
            <Line w="60%" />
            <div className="mu-sources">
              {[0, 1, 2].map((k) => (
                <span key={k}>
                  <i />
                  <Line w={`${38 + k * 8}px`} h={5} />
                </span>
              ))}
            </div>
          </div>
          <div className="mu-row">
            <div className="mu-post mu-match" style={{ "--k": 1 } as React.CSSProperties}>
              <span className="mu-score">36%</span>
              <Line w="80%" h={5} />
              <Line w="56%" h={5} />
            </div>
            <div className="mu-post mu-chart" style={{ "--k": 2 } as React.CSSProperties}>
              {[46, 70, 34, 88, 58].map((h, k) => (
                <i key={k} style={{ height: `${h}%` }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ChatbotUI() {
  return (
    <div className="mu mu-chat" aria-hidden>
      <div className="mu-chat-head">
        <i className="mu-bot">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6">
            <rect x="5" y="8" width="14" height="11" rx="3" />
            <path d="M12 4v4M9 13h.01M15 13h.01" strokeLinecap="round" />
          </svg>
        </i>
        <div>
          <Line w="96px" dark />
          <span className="mu-online">
            <i /> online
          </span>
        </div>
      </div>
      <div className="mu-thread">
        <div className="mu-msg bot" style={{ "--k": 0 } as React.CSSProperties}>
          <Line w="150px" />
          <Line w="96px" />
        </div>
        <div className="mu-msg me" style={{ "--k": 1 } as React.CSSProperties}>
          <Line w="120px" />
        </div>
        <div className="mu-msg bot" style={{ "--k": 2 } as React.CSSProperties}>
          <Line w="170px" />
          <Line w="140px" />
          <Line w="70px" />
        </div>
        <div className="mu-msg me" style={{ "--k": 3 } as React.CSSProperties}>
          <Line w="90px" />
        </div>
        <div className="mu-msg bot typing" style={{ "--k": 4 } as React.CSSProperties}>
          <b />
          <b />
          <b />
        </div>
      </div>
      <div className="mu-input">
        <Line w="55%" />
        <b className="mu-send">↑</b>
      </div>
    </div>
  );
}

export const MINI_CSS = `
.mu{position:relative;height:100%;width:100%;display:flex;flex-direction:column;font-family:var(--font-mono);color:var(--ink);background:var(--paper)}
.mu-line{display:block;border-radius:6px;background:#d6d3cd;max-width:100%}
.mu-line.is-dark{background:#3a3a3a}
.mu-bar{display:flex;align-items:center;gap:6px;height:38px;padding:0 14px;border-bottom:1px solid var(--line);background:#fff}
.mu-bar > span{width:9px;height:9px;border-radius:50%;background:#d6d3cd}
.mu-url{flex:1;height:18px;border-radius:9px;background:var(--paper);margin:0 10px}
.mu-pill{font-size:9.5px;font-weight:500;padding:4px 9px;border-radius:999px;background:var(--ink);color:#fff;white-space:nowrap}
.mu-club-body{flex:1;min-height:0;display:grid;grid-template-columns:22% minmax(0,1fr) 24%;gap:12px;padding:12px}
.mu-side{display:flex;flex-direction:column;gap:8px;padding:10px;background:#fff;border-radius:12px;box-shadow:inset 0 0 0 1px var(--line)}
.mu-logo{width:26px;height:26px;border-radius:8px;background:var(--ink);margin-bottom:6px}
.mu-nav{padding:7px 8px;border-radius:8px}
.mu-nav.is-on{background:var(--paper)}
.mu-feed{display:flex;flex-direction:column;gap:10px;min-height:0;overflow:hidden}
.mu-compose{display:flex;align-items:center;gap:10px;padding:10px;background:#fff;border-radius:12px;box-shadow:inset 0 0 0 1px var(--line)}
.mu-compose .mu-line{flex:1}
.mu-btn{font-size:9.5px;font-weight:500;padding:6px 10px;border-radius:999px;background:var(--ink);color:#fff;white-space:nowrap}
.mu-ava{flex:none;width:26px;height:26px;border-radius:50%;background:linear-gradient(140deg,#cfccc6,#8f8c86)}
.mu-ava.sm{width:20px;height:20px}
.mu-post{display:flex;flex-direction:column;gap:7px;padding:12px;background:#fff;border-radius:12px;box-shadow:inset 0 0 0 1px var(--line);animation:muIn .9s var(--ease) both;animation-delay:calc(var(--k) * 140ms + .5s)}
.mu-post-head{display:flex;align-items:center;gap:8px;margin-bottom:3px}
.mu-post-head > div{display:flex;flex-direction:column;gap:5px}
.mu-react{display:flex;gap:6px;margin-top:3px}
.mu-react b{width:30px;height:14px;border-radius:7px;background:var(--paper);box-shadow:inset 0 0 0 1px var(--line)}
.mu-members{display:flex;flex-direction:column;gap:10px;padding:12px;background:#fff;border-radius:12px;box-shadow:inset 0 0 0 1px var(--line)}
.mu-member{display:flex;align-items:center;gap:8px}
.mu-member .mu-line{flex:1}
.mu-chat-head{display:flex;align-items:center;gap:12px;padding:14px 18px;background:#fff;border-bottom:1px solid var(--line)}
.mu-chat-head > div{display:flex;flex-direction:column;gap:6px}
.mu-bot{width:36px;height:36px;border-radius:50%;background:var(--ink);color:#fff;display:grid;place-items:center}
.mu-online{display:flex;align-items:center;gap:5px;font-size:10px;color:var(--mute)}
.mu-online i{width:6px;height:6px;border-radius:50%;background:var(--ink)}
.mu-thread{flex:1;min-height:0;display:flex;flex-direction:column;gap:10px;padding:18px;overflow:hidden}
.mu-msg{display:flex;flex-direction:column;gap:6px;padding:12px 14px;border-radius:16px;max-width:72%;animation:muIn .8s var(--ease) both;animation-delay:calc(var(--k) * 220ms + .5s)}
.mu-msg.bot{align-self:flex-start;background:#fff;box-shadow:inset 0 0 0 1px var(--line);border-bottom-left-radius:5px}
.mu-msg.me{align-self:flex-end;background:var(--ink);border-bottom-right-radius:5px}
.mu-msg.me .mu-line{background:rgba(255,255,255,.45)}
.mu-msg.typing{flex-direction:row;gap:5px;padding:14px}
.mu-msg.typing b{width:6px;height:6px;border-radius:50%;background:var(--faint);animation:muDot 1.2s ease-in-out infinite}
.mu-msg.typing b:nth-child(2){animation-delay:.15s}
.mu-msg.typing b:nth-child(3){animation-delay:.3s}
.mu-input{display:flex;align-items:center;justify-content:space-between;gap:12px;margin:0 14px 14px;padding:10px 10px 10px 16px;border-radius:999px;background:#fff;box-shadow:inset 0 0 0 1px var(--line)}
.mu-send{width:30px;height:30px;border-radius:50%;background:var(--ink);color:#fff;display:grid;place-items:center;font-size:14px}
.mu-news-body{flex:1;min-height:0;display:grid;grid-template-columns:24% minmax(0,1fr);gap:12px;padding:12px}
.mu-navlabel{font-size:9.5px;color:var(--mute)}
.mu-nav.is-on .mu-navlabel{color:var(--ink);font-weight:600}
.mu-story{gap:8px}
.mu-stages{display:flex;flex-wrap:wrap;gap:5px;margin-bottom:4px}
.mu-stages b{font-size:9px;font-weight:500;padding:4px 8px;border-radius:999px;box-shadow:inset 0 0 0 1px var(--line);color:var(--mute)}
.mu-stages b.is-done{background:var(--ink);color:#fff;box-shadow:none}
.mu-sources{display:flex;flex-wrap:wrap;gap:6px;margin-top:6px;padding-top:9px;border-top:1px dashed var(--line)}
.mu-sources span{display:flex;align-items:center;gap:5px;padding:4px 8px;border-radius:999px;background:var(--paper)}
.mu-sources span i{width:8px;height:8px;border-radius:50%;background:#8f8c86}
.mu-row{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:10px;flex:1;min-height:0}
.mu-match{gap:6px}
.mu-score{font-size:18px;font-weight:700;letter-spacing:-.04em}
.mu-chart{flex-direction:row;align-items:flex-end;gap:6px;min-height:70px}
.mu-chart i{flex:1;border-radius:4px 4px 2px 2px;background:#cfccc6}
.mu-chart i:nth-child(4){background:var(--ink)}
@media (max-width: 900px){.mu-news-body{grid-template-columns:minmax(0,1fr)}}
@keyframes muIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
@keyframes muDot{0%,80%,100%{transform:translateY(0);opacity:.5}40%{transform:translateY(-4px);opacity:1}}
@media (max-width: 900px){
  .mu-club-body{grid-template-columns:minmax(0,1fr)}
  .mu-side,.mu-members{display:none}
}
`;
