"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type MouseEvent } from "react";
import { NAV, PROFILE } from "@/lib/data";
import { lockScroll, scrollToTarget } from "@/lib/scroll";

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const menuBtnRef = useRef<HTMLButtonElement>(null);

  // scrolled state + top progress bar
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      setScrolled(y > 40);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  // active section
  useEffect(() => {
    const targets = ["top", ...NAV.map((n) => n.id)]
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(e.target.id === "top" ? null : e.target.id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);

  // slide the ink indicator under the active link
  const placeIndicator = useCallback(() => {
    const pill = pillRef.current;
    const ind = indicatorRef.current;
    if (!pill || !ind) return;
    const link = active ? pill.querySelector<HTMLElement>(`[data-id="${active}"]`) : null;
    if (!link) {
      ind.style.opacity = "0";
      return;
    }
    ind.style.opacity = "1";
    ind.style.width = `${link.offsetWidth}px`;
    ind.style.transform = `translateX(${link.offsetLeft}px)`;
  }, [active]);

  useLayoutEffect(placeIndicator, [placeIndicator, scrolled]);
  useEffect(() => {
    window.addEventListener("resize", placeIndicator);
    document.fonts?.ready.then(placeIndicator);
    return () => window.removeEventListener("resize", placeIndicator);
  }, [placeIndicator]);

  // mobile menu: Esc closes, page scroll locked
  useEffect(() => {
    if (!open) return;
    const btn = menuBtnRef.current;
    lockScroll(true);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      lockScroll(false);
      window.removeEventListener("keydown", onKey);
      btn?.focus();
    };
  }, [open]);

  const go = (e: MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setOpen(false);
    // let the overlay unlock scrolling first
    requestAnimationFrame(() => scrollToTarget(id === "top" ? 0 : `#${id}`));
  };

  return (
    <>
      <div className="nav-progress" aria-hidden>
        <div ref={progressRef} />
      </div>
      <header className={`nav ${scrolled ? "is-scrolled" : ""} ${open ? "is-open" : ""}`}>
        <a href="#top" className="nav-brand" onClick={(e) => go(e, "top")}>
          <span className="nav-mark" aria-hidden>
            {PROFILE.initials}
          </span>
          <span className="nav-name">{PROFILE.name}</span>
          <span className="sr-only">, back to top</span>
        </a>

        <nav aria-label="Primary" className="nav-desktop">
          <div ref={pillRef} className="nav-pill">
            <span ref={indicatorRef} className="nav-indicator" aria-hidden />
            <ul>
            {NAV.map((n) => (
              <li key={n.id}>
                <a
                  href={`#${n.id}`}
                  data-id={n.id}
                  className={active === n.id ? "is-active" : ""}
                  aria-current={active === n.id ? "location" : undefined}
                  onClick={(e) => go(e, n.id)}
                >
                  {n.label}
                </a>
              </li>
            ))}
            </ul>
          </div>
        </nav>

        <button
          ref={menuBtnRef}
          className="nav-menu-btn"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((o) => !o)}
        >
          <span>{open ? "Close" : "Menu"}</span>
          <i aria-hidden />
        </button>
      </header>

      <div id="mobile-menu" className={`menu ${open ? "is-open" : ""}`} aria-hidden={!open} inert={!open}>
        <nav aria-label="Mobile">
          <ol>
            {NAV.map((n, i) => (
              <li key={n.id} style={{ "--i": i } as React.CSSProperties}>
                <a href={`#${n.id}`} onClick={(e) => go(e, n.id)}>
                  <span className="mono">{String(i + 1).padStart(2, "0")}</span>
                  {n.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>
        <p className="menu-foot mono">
          <a href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a>
        </p>
      </div>

      <style href="navigation" precedence="default">{`
        .nav-progress{position:fixed;inset:0 0 auto 0;height:2px;z-index:70;pointer-events:none}
        .nav-progress div{height:100%;background:var(--ink);transform-origin:0 50%;transform:scaleX(0)}
        .nav{position:fixed;z-index:60;top:14px;left:var(--gutter);right:var(--gutter);display:flex;align-items:center;justify-content:space-between;gap:16px;pointer-events:none}
        .nav > *{pointer-events:auto}
        .nav-brand{display:flex;align-items:center;gap:12px;padding:5px 14px 5px 5px;border-radius:999px;transition:background-color .5s var(--ease),box-shadow .5s var(--ease)}
        .nav-mark{width:40px;height:40px;border-radius:50%;display:grid;place-items:center;font-weight:700;font-size:13px;letter-spacing:-.02em;box-shadow:inset 0 0 0 1.5px var(--ink);transition:background-color .5s var(--ease),color .5s var(--ease),transform .9s var(--ease)}
        .nav-brand:hover .nav-mark{transform:rotate(360deg)}
        .nav-name{font-weight:600;font-size:15px;letter-spacing:-.02em;transition:opacity .5s var(--ease),transform .6s var(--ease)}
        .nav.is-scrolled .nav-mark{background:var(--ink);color:#fff}
        .nav.is-scrolled .nav-name{opacity:0;transform:translateX(-8px);pointer-events:none}
        .nav-pill ul{display:flex;gap:2px;list-style:none;margin:0;padding:0}
        .nav-pill{position:relative;padding:5px;border-radius:999px;transition:background-color .5s var(--ease),box-shadow .5s var(--ease),backdrop-filter .5s}
        .nav.is-scrolled .nav-pill,.nav.is-scrolled .nav-menu-btn{background:rgba(255,255,255,.72);-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);box-shadow:inset 0 0 0 1px var(--line),0 10px 30px -18px rgba(13,13,13,.3)}
        .nav-pill a{position:relative;z-index:1;display:block;padding:10px 16px;border-radius:999px;font-size:14px;font-weight:500;color:var(--ink-2);transition:color .45s var(--ease)}
        .nav-pill a:hover{color:var(--ink)}
        .nav-pill a.is-active{color:#fff}
        .nav-indicator{position:absolute;left:0;top:5px;bottom:5px;border-radius:999px;background:var(--ink);opacity:0;transition:transform .6s var(--ease),width .6s var(--ease),opacity .4s var(--ease)}
        .nav-menu-btn{display:none;align-items:center;gap:10px;height:46px;padding:0 8px 0 18px;border-radius:999px;font-size:14px;font-weight:500;background:rgba(255,255,255,.72);box-shadow:inset 0 0 0 1px var(--line)}
        .nav-menu-btn i{position:relative;width:30px;height:30px;border-radius:50%;background:var(--ink)}
        .nav-menu-btn i::before,.nav-menu-btn i::after{content:"";position:absolute;left:9px;right:9px;height:1.5px;background:#fff;top:50%;transition:transform .5s var(--ease)}
        .nav-menu-btn i::before{transform:translateY(-3px)}
        .nav-menu-btn i::after{transform:translateY(3px)}
        .nav.is-open .nav-menu-btn i::before{transform:rotate(45deg)}
        .nav.is-open .nav-menu-btn i::after{transform:rotate(-45deg)}
        .menu{position:fixed;inset:0;z-index:55;background:var(--paper);display:flex;flex-direction:column;justify-content:space-between;padding:110px var(--gutter) 36px;clip-path:circle(0% at calc(100% - var(--gutter) - 30px) 37px);transition:clip-path .8s var(--ease);visibility:hidden}
        .menu.is-open{clip-path:circle(150% at calc(100% - var(--gutter) - 30px) 37px);visibility:visible}
        .menu:not(.is-open){transition:clip-path .6s var(--ease),visibility 0s .6s}
        .menu ol{list-style:none;margin:0;padding:0}
        .menu li{overflow:hidden;border-bottom:1px solid var(--line)}
        .menu li a{display:flex;align-items:baseline;gap:16px;padding:14px 0;font-size:clamp(40px,11vw,64px);font-weight:700;letter-spacing:-.045em;line-height:1.05;transform:translateY(110%);transition:transform .8s var(--ease);transition-delay:calc(var(--i) * 60ms + 150ms)}
        .menu li a span{font-size:12px;font-weight:400;letter-spacing:0;color:var(--mute)}
        .menu.is-open li a{transform:none}
        .menu-foot{font-size:13px;color:var(--mute)}
        @media (max-width: 860px){
          .nav-desktop{display:none}
          .nav-menu-btn{display:inline-flex}
          .nav.is-open .nav-mark{background:var(--ink);color:#fff}
        }
      `}</style>
    </>
  );
}
