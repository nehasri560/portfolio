"use client";

import { PROFILE } from "@/lib/data";
import { scrollToTarget } from "@/lib/scroll";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer-row">
        <p>
          © {new Date().getFullYear()} {PROFILE.name}
        </p>
        <a
          href="#top"
          className="footer-top"
          onClick={(e) => {
            e.preventDefault();
            scrollToTarget(0);
          }}
        >
          Back to top ↑
        </a>
      </div>
      <style href="footer" precedence="default">{`
        .footer{border-top:1px solid var(--line)}
        .footer-row{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:12px 24px;padding-block:28px;font-size:13.5px;color:var(--mute)}
        .footer-row p{margin:0}
        .footer-top{color:var(--ink);font-weight:500}
        .footer-top:hover{text-decoration:underline;text-underline-offset:4px}
      `}</style>
    </footer>
  );
}
