import type { ReactNode } from "react";

/**
 * Real brand logos (devicon "original" SVGs in /public/logos, MIT) keep their official colours.
 * `tint` is the brand colour used for the soft glow behind them.
 */
export const BRAND: Record<string, { src: string; tint: string; label: string }> = {
  python: { src: "/logos/python.svg", tint: "#3776ab", label: "Python logo" },
  gitbash: { src: "/logos/git.svg", tint: "#f05032", label: "Git logo" },
  html: { src: "/logos/html5.svg", tint: "#e34f26", label: "HTML5 logo" },
  css: { src: "/logos/css3.svg", tint: "#1572b6", label: "CSS3 logo" },
  javascript: { src: "/logos/javascript.svg", tint: "#f7df1e", label: "JavaScript logo" },
  flask: { src: "/logos/flask.svg", tint: "#7a7a7a", label: "Flask logo" },
  mysql: { src: "/logos/mysql.svg", tint: "#00758f", label: "MySQL logo" },
  sqlite: { src: "/logos/sqlite.svg", tint: "#0f80cc", label: "SQLite logo" },
  scikitlearn: { src: "/logos/scikitlearn.svg", tint: "#f7931e", label: "scikit-learn logo" },
  pandas: { src: "/logos/pandas.svg", tint: "#150458", label: "pandas logo" },
  numpy: { src: "/logos/numpy.svg", tint: "#4dabcf", label: "NumPy logo" },
};

/**
 * Thin line icons for concepts and for products whose logos are not openly licensed
 * (MS Excel, Power BI). 24×24 grid, 1.5 stroke, currentColor.
 */
export const CONCEPT: Record<string, ReactNode> = {
  sql: (
    <>
      <ellipse cx="12" cy="5.5" rx="7" ry="2.5" />
      <path d="M5 5.5v13c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5v-13" />
      <path d="M5 12c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5" />
    </>
  ),
  ml: (
    <>
      <circle cx="5" cy="6" r="1.8" />
      <circle cx="5" cy="18" r="1.8" />
      <circle cx="12" cy="12" r="1.8" />
      <circle cx="19" cy="6" r="1.8" />
      <circle cx="19" cy="18" r="1.8" />
      <path d="M6.6 6.9l3.8 4.2M6.6 17.1l3.8-4.2M13.6 11.1l3.8-4.2M13.6 12.9l3.8 4.2" />
    </>
  ),
  cv: (
    <>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" />
      <circle cx="12" cy="12" r="3.2" />
      <path d="M3 3h3M3 3v3M21 3h-3M21 3v3M3 21h3M3 21v-3M21 21h-3M21 21v-3" />
    </>
  ),
  segmentation: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M8 16c0-3 1.5-6 4.5-7.5S18 8 18 8" strokeDasharray="2 2" />
      <path d="M6 7.5c2 .5 3.5 2 3.5 4.5" />
      <circle cx="15" cy="15" r="2.5" />
    </>
  ),
  nlp: (
    <>
      <path d="M4 5h16v10H9l-5 4V5z" />
      <path d="M8 9h8M8 12h5" />
    </>
  ),
  annotation: (
    <>
      <rect x="4" y="7" width="13" height="13" rx="1" strokeDasharray="2.5 2" />
      <path d="M4 7V4h8v3" />
      <path d="M17 13l4 4-2 2-4-4" />
    </>
  ),
  analysis: (
    <>
      <path d="M3 20h18" />
      <path d="M5 16l4-5 4 3 6-8" />
      <circle cx="19" cy="6" r="1.4" />
    </>
  ),
  excel: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M3 9h18M3 14.5h18M9 4v16M15 4v16" />
    </>
  ),
  powerbi: (
    <>
      <rect x="4" y="12" width="4" height="8" rx="1" />
      <rect x="10" y="8" width="4" height="12" rx="1" />
      <rect x="16" y="4" width="4" height="16" rx="1" />
    </>
  ),
  analytical: (
    <>
      <circle cx="10.5" cy="10.5" r="6" />
      <path d="M15 15l5.5 5.5M8 11.5l2 2 3-4" />
    </>
  ),
  problem: (
    <>
      <path d="M4 8h4a2 2 0 114 0h4v4a2 2 0 110 4v4H4v-4a2 2 0 100-4V8z" />
    </>
  ),
  team: (
    <>
      <circle cx="9" cy="8" r="3" />
      <circle cx="17" cy="9.5" r="2.3" />
      <path d="M3 19c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5M15.5 14c2.8-.4 5.5 1.3 5.5 4.5" />
    </>
  ),
};

export function isBrand(id: string): boolean {
  return id in BRAND;
}

export default function TechLogo({
  id,
  size = 24,
  className = "",
  decorative = true,
}: {
  id: string;
  size?: number;
  className?: string;
  decorative?: boolean;
}) {
  const brand = BRAND[id];
  if (brand) {
    return (
      <img
        src={brand.src}
        alt={decorative ? "" : brand.label}
        width={size}
        height={size}
        className={className}
        loading="lazy"
        decoding="async"
        draggable={false}
      />
    );
  }
  const glyph = CONCEPT[id];
  if (!glyph) return null;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={size > 60 ? 0.9 : 1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden={decorative || undefined}
      role={decorative ? undefined : "img"}
    >
      {glyph}
    </svg>
  );
}
