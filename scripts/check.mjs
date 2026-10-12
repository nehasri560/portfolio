// Visual + behaviour smoke test.
//   npm run build && npm start   (in another terminal)
//   node scripts/check.mjs [baseUrl] [outDir]
// Uses playwright-core with an installed Chrome / Edge (no browser download needed).
import { chromium } from "playwright-core";
import fs from "node:fs";
import path from "node:path";

const base = process.argv[2] ?? "http://localhost:3000";
const out = process.argv[3] ?? "screenshots";
fs.mkdirSync(out, { recursive: true });

async function launch() {
  for (const channel of ["chrome", "msedge"]) {
    try {
      return await chromium.launch({ channel, args: ["--autoplay-policy=no-user-gesture-required"] });
    } catch {}
  }
  throw new Error("No Chrome or Edge found for playwright-core");
}

const browser = await launch();
const results = [];
const ok = (name, pass, info = "") => results.push(`${pass ? "PASS" : "FAIL"}  ${name}${info ? `  (${info})` : ""}`);

for (const vp of [
  { name: "desktop", width: 1440, height: 900, touch: false },
  { name: "mobile", width: 390, height: 844, touch: true },
]) {
  const ctx = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    hasTouch: vp.touch,
    isMobile: vp.touch,
    deviceScaleFactor: 1,
  });
  const page = await ctx.newPage();
  const errors = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(String(e)));
  await page.goto(base, { waitUntil: "networkidle" });
  await page.waitForTimeout(1800);

  await page.screenshot({ path: path.join(out, `${vp.name}-hero.png`) });

  // walk the page so every reveal / observer fires
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < height; y += Math.round(vp.height * 0.6)) {
    await page.evaluate((top) => window.scrollTo(0, top), y);
    await page.waitForTimeout(120);
  }

  const overflow = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, iw: window.innerWidth }));
  ok(`${vp.name}: no horizontal overflow`, overflow.sw === overflow.iw, `${overflow.sw} vs ${overflow.iw}`);

  // hero video pauses when scrolled away, resumes on return
  const pausedAway = await page.evaluate(() => document.querySelector(".hero-video").paused);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(900);
  const playingBack = await page.evaluate(() => !document.querySelector(".hero-video").paused);
  ok(`${vp.name}: video pauses away from hero`, pausedAway);
  ok(`${vp.name}: video resumes on return`, playingBack);

  // sound button toggles mute
  const before = await page.evaluate(() => document.querySelector(".hero-video").muted);
  await page.click(".sound-btn");
  await page.waitForTimeout(200);
  const after = await page.evaluate(() => document.querySelector(".hero-video").muted);
  ok(`${vp.name}: sound button toggles`, before !== after, `muted ${before} → ${after}`);

  // video loop length
  const dur = await page.evaluate(() => document.querySelector(".hero-video").duration);
  ok(`${vp.name}: hero clip loaded`, dur > 9, `${dur?.toFixed?.(2)} s`);

  // section screenshots
  for (const id of ["about", "skills", "work", "certifications", "experience", "contact"]) {
    await page.evaluate((s) => document.getElementById(s).scrollIntoView({ block: "start" }), id);
    await page.waitForTimeout(1200);
    await page.screenshot({ path: path.join(out, `${vp.name}-${id}.png`) });
  }

  // ID card flips by keyboard
  await page.evaluate(() => document.getElementById("about").scrollIntoView({ block: "start" }));
  await page.mouse.move(2, 2); // make sure hover isn't what flips it
  await page.waitForTimeout(400);
  await page.focus(".idcard");
  await page.keyboard.press("Enter");
  await page.waitForTimeout(1100);
  const flipped = await page.evaluate(() => document.querySelector(".idcard").classList.contains("is-flipped"));
  ok(`${vp.name}: ID card flips on Enter`, flipped);
  await page.screenshot({ path: path.join(out, `${vp.name}-about-back.png`) });
  await page.keyboard.press("Enter");
  await page.waitForTimeout(300);

  if (vp.touch) {
    // the card never stops swaying, so skip Playwright's stability wait
    await page.tap(".idcard", { force: true });
    await page.waitForTimeout(300);
    const tapped = await page.evaluate(() => document.querySelector(".idcard").classList.contains("is-flipped"));
    ok(`${vp.name}: ID card flips on tap`, tapped);
    await page.tap(".idcard", { force: true });

    // mobile menu
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(400);
    await page.tap(".nav-menu-btn");
    await page.waitForTimeout(900);
    await page.screenshot({ path: path.join(out, `mobile-menu.png`) });
    await page.keyboard.press("Escape");
    await page.waitForTimeout(700);
    const closed = await page.evaluate(() => !document.querySelector(".menu").classList.contains("is-open"));
    ok("mobile: Esc closes the menu", closed);
  } else {
    // swing reacts to the pointer
    const box = await page.locator(".idcard").boundingBox();
    await page.mouse.move(box.x - 300, box.y + 100);
    await page.mouse.move(box.x + 600, box.y + 100, { steps: 6 });
    await page.waitForTimeout(160);
    const rot = await page.evaluate(() => document.querySelector(".swing").style.transform);
    ok("desktop: lanyard swings", /rotate\((-?\d+(\.\d+)?)deg\)/.test(rot) && Math.abs(parseFloat(rot.slice(7))) > 2, rot);
  }

  ok(`${vp.name}: no console errors`, errors.length === 0, errors.slice(0, 3).join(" | "));
  await ctx.close();
}

await browser.close();
console.log(results.join("\n"));
