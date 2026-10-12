# Chandra Nehasri — Portfolio

A quiet, one-page "talking video" portfolio: white, black and grays, one continuous scroll.
Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Lenis. No GSAP, no WebGL, no runtime CDNs.

## Run it

```bash
npm install
npm run dev          # http://localhost:3000
```

Production (static export: `next build` writes the finished site to `out/`):

```bash
npm run build
npm start            # serves ./out on http://localhost:3000
```

## Deploy (Render)

`render.yaml` is a Render Blueprint for a free **static site** (no server, no cold starts):
build `npm ci && npm run build`, publish `out`, Node 22.
In Render: **New → Blueprint**, pick this repo, **Apply**. Every push to `main` redeploys.
Set `NEXT_PUBLIC_SITE_URL` to the final URL if you want absolute Open Graph image links.

First-load JS for `/` is **≈128 kB** (Next's shared 103 kB + 25 kB for the page).

## Where things live

| Path | What |
| --- | --- |
| `src/lib/data.ts` | **All content.** Every string comes from `public/Nehasri_Resume.pdf`. Components only read from here. |
| `src/lib/hooks.ts` | `useInView`, `useScrollProgress`, `prefersReducedMotion` |
| `src/lib/scroll.tsx` | Lenis provider, `scrollToTarget`, `lockScroll` |
| `src/components/App.tsx` | Page composition |
| `src/components/Navigation.tsx` | Nav pill, sliding indicator, progress bar, mobile overlay |
| `src/components/hero/Hero.tsx` | Talking video hero + sound control |
| `src/components/sections/*.tsx` | One file per section (component CSS lives in a `<style>` inside each) |
| `src/components/ui/*.tsx` | `IdCard`, `TechLogo`, `RevealObserver`, `SectionTag`, icons |
| `src/fonts/` | Self-hosted Inter Tight (variable), Instrument Serif, JetBrains Mono (variable) |
| `public/hero/` | `hero.webm`, `hero.mp4` (generated) |
| `public/logos/` | Brand SVGs + licence |
| `scripts/build-hero-assets.py` | Video → seamless hero loop, portrait, OG image |
| `scripts/check.mjs` | Playwright smoke test (screenshots, overflow, video, ID card, menu) |

Component styles are rendered as `<style href="…" precedence="default">`, so React 19 hoists them into `<head>`.
That avoids a flash of unstyled content and layout shift.

## Sections

| # | Section | Component | Signature motion |
| --- | --- | --- | --- |
| — | Hero | `hero/Hero.tsx` | Looping talking video (multiply-blended into the page), outlined ghost name, ▶/❚❚ sound button |
| 01 | About | `sections/About.tsx` + `ui/IdCard.tsx` | Lanyard ID card: damped pendulum on pointer velocity, idle sway, 3D flip (hover / tap / Enter) |
| 02 | Skills | `sections/Skills.tsx` | "Periodic table" with diagonal wave reveal, family filters, sticky inspector with brand logo pop |
| 03 | Work | `sections/Work.tsx` | Expanding accordion gallery, clip-path reveal of an *illustrative* grayscale mini-UI |
| 04 | Certifications | `sections/Certifications.tsx` | Ink-flood rows |
| 05 | Experience | `sections/Experience.tsx` | Scroll-drawn spine; stops light up as it reaches them |
| 06 | Contact | `sections/Contact.tsx` | Letter-hop heading, copy-email chip (aria-live), spinning "say hello" badge |

**Achievements is intentionally omitted.** The résumé lists no ranks, platform stats or honours.
If you add some to `ACHIEVEMENTS` in `data.ts`, the section needs to be built and added to `NAV`.

### Content notes

- The PDF has no embedded hyperlinks. The only repo link is the **News Brief Desk** project, added later from its public GitHub repo; it shows "View on GitHub" and "Live demo" buttons.
  Add `github` to `PROFILE`, `github` / `demo` to a project, or `href` to a certification, and the buttons and links appear automatically.
- Three résumé typos were corrected with the owner's OK: "Powe BI", "Parul niversity" and "an contribute".
- Added later by the owner (not in the PDF): the new email address, "Git Bash" in place of "Bash", and the current role (FDE · AI Developer at VSP AI & Robotics, Sep 2026 – Present).
- The About quote is a paraphrase of the résumé summary and is labelled as such.
- The Work mini-UIs are pure CSS sketches labelled "Illustrative UI — not a screenshot".

## Rebuilding the hero video

Requirements: Python 3, `numpy`, `Pillow`, and ffmpeg. A system ffmpeg works, or run `pip install imageio-ffmpeg` to get a bundled binary.

```bash
python scripts/build-hero-assets.py path/to/intro.mp4
# or force the crop instead of auto-detecting the person:
python scripts/build-hero-assets.py path/to/intro.mp4 --crop 840:1052:520:18
```

What it does:

1. **Detects the person** by comparing each pixel with the backdrop over 8 sampled frames. It then makes a 4:5 crop, head to toe and centred, that is at least 800×1000. It scales the crop to **768×960**.
2. **Whitens the backdrop** with `colorlevels` so it becomes pure white and vanishes under `mix-blend-mode: multiply`.
   This source's wall sat at about 240–250, so `WHITE_POINT` is `0.95` (the usual value is 0.98).
3. **Makes a seamless loop** from the first 10 s:
   - The last 0.5 s of the picture cross-fades into the first 0.5 s (ffmpeg `xfade`).
   - The audio gets the same equal-power cross-fade, sample-accurate, in numpy (not `acrossfade`).
   - Nothing is retimed, so lips stay in sync. Result: a 9.5 s loop with no visible jump and no click.
4. **Exports** `hero.webm` (VP9 CRF 36 + Opus 80k) and `hero.mp4` (H.264 CRF 24 `-preset slow` + AAC 96k, `+faststart`).
5. **Stills**: picks the sharpest frame (Laplacian variance of the head region) for `public/portrait-bust.webp` (480×600). It also renders `public/og.jpg` (1200×630).

### Hero playback behaviour

- Playback starts right after `window.load`: first with sound, falling back to muted if the browser blocks it.
- The first `pointerdown`, `keydown` or `touchend` unmutes it, unless the visitor already chose with the button.
- The video pauses when less than 35 % of the hero is visible and resumes when you scroll back.
- While autoplay is blocked, a soft ping ring surrounds the button.
- With `prefers-reduced-motion`, nothing autoplays; the button starts it.

## Checks

```bash
npm run build && npm start              # in one terminal (serves out/ on :3000)
node scripts/check.mjs http://localhost:3000 screenshots
```

`check.mjs` uses `playwright-core` with your installed Chrome or Edge. It checks:

- Screenshots at 1440×900 and 390×844
- `scrollWidth === innerWidth`
- The video pauses and resumes, and ▶/❚❚ toggles
- The ID card flips on Enter and on tap, and swings on pointer movement
- Esc closes the mobile menu
- No console errors

Last local results:

- All checks pass.
- No horizontal overflow from 360 px to 1920 px.
- Lighthouse desktop: 100 / 100 / 100 / 100.
- Lighthouse mobile: Performance 81–94 (it varies run to run, mostly from video decode under 4× CPU throttling), Accessibility / Best Practices / SEO 100.

## Credits & licences

- **Brand logos** (`public/logos/*.svg`): [devicon](https://github.com/devicons/devicon) "original" icons, MIT licence. See `public/logos/LICENSE-devicon.txt`.
  The logos remain trademarks of their owners: Python, Git, HTML5, CSS3, JavaScript, Flask, MySQL, scikit-learn, pandas and NumPy.
- **MS Excel and Power BI** have no openly licensed logo in devicon or simple-icons, so they use the same custom line icons as the concept skills.
- **Fonts**:
  - Inter Tight (Rasmus Andersson et al.), Instrument Serif (Instrument) and JetBrains Mono (JetBrains): SIL Open Font License 1.1.
  - Files taken from the `@fontsource` packages.
