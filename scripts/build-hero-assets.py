#!/usr/bin/env python3
"""
Build the hero assets from the raw intro video.

    python scripts/build-hero-assets.py path/to/intro.mp4 [--crop W:H:X:Y] [--seconds 10]

Outputs (into ./public):
    hero/hero.mp4        H.264 + AAC, seamless loop
    hero/hero.webm       VP9 + Opus, seamless loop
    portrait-bust.webp   480x600 head-to-shirt still
    og.jpg               1200x630 social card

Needs: numpy, Pillow, and an ffmpeg binary (system ffmpeg, or the one bundled
with `pip install imageio-ffmpeg`).
"""
from __future__ import annotations

import argparse
import io
import shutil
import subprocess
import sys
import tempfile
import wave
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parent.parent
PUBLIC = ROOT / "public"
OUT_W = 768            # final hero width
FADE = 0.5             # seconds of cross-fade at the loop seam
SR = 48000             # audio sample rate
# Push the off-white backdrop to pure white so it disappears under mix-blend-mode: multiply.
# 0.98 is the usual value; this source's backdrop sits at ~240-250, so it needs 0.95.
WHITE_POINT = 0.95
WHITEN = f"colorlevels=rimax={WHITE_POINT}:gimax={WHITE_POINT}:bimax={WHITE_POINT}"


def ffmpeg_bin() -> str:
    exe = shutil.which("ffmpeg")
    if exe:
        return exe
    try:
        import imageio_ffmpeg

        return imageio_ffmpeg.get_ffmpeg_exe()
    except ImportError:
        sys.exit("ffmpeg not found. Install it, or `pip install imageio-ffmpeg`.")


FF = ffmpeg_bin()


def run(args: list[str], **kw) -> subprocess.CompletedProcess:
    return subprocess.run([FF, "-hide_banner", "-loglevel", "error", "-y", *args], check=True, **kw)


def probe(src: Path) -> tuple[int, int, float, float]:
    """Return (width, height, fps, duration) by parsing ffmpeg's banner."""
    p = subprocess.run([FF, "-hide_banner", "-i", str(src)], capture_output=True, text=True)
    import re

    info = p.stderr
    w, h = map(int, re.search(r"Video:.*?(\d{3,5})x(\d{3,5})", info).groups())
    fps = float(re.search(r"([\d.]+) fps", info).group(1))
    hh, mm, ss = re.search(r"Duration: (\d+):(\d+):([\d.]+)", info).groups()
    return w, h, fps, int(hh) * 3600 + int(mm) * 60 + float(ss)


def grab_gray(src: Path, w: int, h: int, n: int = 8, dur: float = 10) -> np.ndarray:
    """n evenly spaced grayscale frames as a (n, h, w) array."""
    frames = []
    for i in range(n):
        t = dur * (i + 0.5) / n
        raw = run(["-ss", f"{t:.3f}", "-i", str(src), "-frames:v", "1", "-f", "rawvideo",
                   "-pix_fmt", "gray", "-"], capture_output=True).stdout
        frames.append(np.frombuffer(raw, np.uint8).reshape(h, w))
    return np.stack(frames)


def detect_person(frames: np.ndarray) -> tuple[int, int, int, int]:
    """Bounding box (x0, y0, x1, y1) of everything clearly darker than the backdrop."""
    _, h, w = frames.shape
    bg = np.median(frames, axis=(1, 2), keepdims=True)
    mask = (bg.astype(int) - frames.astype(int) > 40).any(axis=0)
    # ignore the outer 4 % (watermarks, vignetting)
    mx, my = int(w * 0.04), int(h * 0.02)
    mask[:, :mx] = mask[:, w - mx:] = False
    mask[h - my:, :] = False
    cols = np.where(mask.sum(axis=0) > h * 0.02)[0]
    rows = np.where(mask.sum(axis=1) > w * 0.004)[0]
    return int(cols[0]), int(rows[0]), int(cols[-1]), int(rows[-1])


def crop_for(box, w, h) -> tuple[int, int, int, int]:
    """4:5 crop that fits the whole body plus a small margin (at least 800x1000)."""
    x0, y0, x1, y1 = box
    ch = min(h, max(1000, (y1 - y0 + 48) // 2 * 2))
    cw = ch * 4 // 5 // 2 * 2
    cx = (x0 + x1) // 2
    x = min(max(cx - cw // 2, 0), w - cw)
    y = min(max((y0 + y1) // 2 - ch // 2, 0), h - ch)  # centre head-to-toe vertically
    return cw, ch, x, y


def read_audio(src: Path, start: float, dur: float) -> np.ndarray:
    raw = run(["-ss", f"{start}", "-t", f"{dur}", "-i", str(src), "-vn", "-ac", "2", "-ar", str(SR),
               "-f", "f32le", "-"], capture_output=True).stdout
    return np.frombuffer(raw, np.float32).reshape(-1, 2).copy()


def loop_audio(src: Path, length: float) -> np.ndarray:
    """Sample-accurate loop: body = [FADE, length); its last FADE s fades into [0, FADE)."""
    a = read_audio(src, 0, length)
    n_len, n_fade = int(round(length * SR)), int(round(FADE * SR))
    if len(a) < n_len:  # pad if the source audio is a hair short
        a = np.vstack([a, np.zeros((n_len - len(a), 2), np.float32)])
    a = a[:n_len]
    head, body = a[:n_fade], a[n_fade:].copy()
    t = np.linspace(0, np.pi / 2, n_fade, dtype=np.float32)[:, None]
    body[-n_fade:] = body[-n_fade:] * np.cos(t) + head * np.sin(t)  # equal-power
    return np.clip(body, -1, 1)


def write_wav(path: Path, a: np.ndarray) -> None:
    pcm = (a * 32767).astype("<i2")
    with wave.open(str(path), "wb") as wf:
        wf.setnchannels(2)
        wf.setsampwidth(2)
        wf.setframerate(SR)
        wf.writeframes(pcm.tobytes())


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("src", type=Path)
    ap.add_argument("--crop", help="W:H:X:Y (skip auto-detection)")
    ap.add_argument("--seconds", type=float, default=10.0)
    args = ap.parse_args()

    src: Path = args.src
    w, h, fps, dur = probe(src)
    length = min(args.seconds, dur)
    print(f"source {w}x{h} @ {fps}fps, {dur:.2f}s -> using {length:.2f}s")

    if args.crop:
        cw, ch, cx, cy = map(int, args.crop.split(":"))
    else:
        box = detect_person(grab_gray(src, w, h, dur=length))
        cw, ch, cx, cy = crop_for(box, w, h)
        print(f"person box {box} -> crop={cw}:{ch}:{cx}:{cy}")

    look = f"crop={cw}:{ch}:{cx}:{cy},scale={OUT_W}:{OUT_W * 5 // 4}:flags=lanczos,{WHITEN}"
    body_len = length - FADE
    vf = (
        f"[0:v]{look},split[a][b];"
        f"[a]trim=start={FADE}:end={length},setpts=PTS-STARTPTS,fps={fps:g},settb=AVTB[body];"
        f"[b]trim=start=0:end={FADE},setpts=PTS-STARTPTS,fps={fps:g},settb=AVTB[head];"
        f"[body][head]xfade=transition=fade:duration={FADE}:offset={body_len - FADE},format=yuv420p[v]"
    )

    out = PUBLIC / "hero"
    out.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory() as tmp:
        wav = Path(tmp) / "loop.wav"
        write_wav(wav, loop_audio(src, length))
        common = ["-i", str(src), "-i", str(wav), "-filter_complex", vf, "-map", "[v]", "-map", "1:a",
                  "-t", f"{body_len}"]
        print("encoding hero.mp4 ...")
        run([*common, "-c:v", "libx264", "-preset", "slow", "-crf", "24", "-pix_fmt", "yuv420p",
             "-c:a", "aac", "-b:a", "96k", "-movflags", "+faststart", str(out / "hero.mp4")])
        print("encoding hero.webm ...")
        run([*common, "-c:v", "libvpx-vp9", "-crf", "36", "-b:v", "0", "-row-mt", "1",
             "-c:a", "libopus", "-b:a", "80k", str(out / "hero.webm")])

    stills(src, (cw, ch, cx, cy), length)
    for f in [out / "hero.mp4", out / "hero.webm", PUBLIC / "portrait-bust.webp", PUBLIC / "og.jpg"]:
        print(f"  {f.relative_to(ROOT)}  {f.stat().st_size / 1024:.0f} kB")


def stills(src: Path, crop, length: float) -> None:
    """Portrait bust from the sharpest frame + OG card."""
    from PIL import Image, ImageDraw, ImageFilter, ImageFont

    cw, ch, cx, cy = crop
    best, best_score = None, -1.0
    for i in range(12):
        t = length * (i + 0.5) / 12
        png = run(["-ss", f"{t:.3f}", "-i", str(src), "-frames:v", "1",
                   "-vf", f"crop={cw}:{ch}:{cx}:{cy},{WHITEN}", "-f", "image2pipe", "-vcodec", "png", "-"],
                  capture_output=True).stdout
        img = Image.open(io.BytesIO(png)).convert("RGB")
        g = np.asarray(img.convert("L"), np.float32)
        top = g[: ch // 4]  # head region
        lap = top[1:-1, 1:-1] * 4 - top[:-2, 1:-1] - top[2:, 1:-1] - top[1:-1, :-2] - top[1:-1, 2:]
        score = float(lap.var())
        if score > best_score:
            best, best_score = img, score

    g = np.asarray(best.convert("L"))
    dark = np.where((g < 200).any(axis=1))[0]
    head_top = int(dark[0]) if len(dark) else 0
    cols = np.where((g[head_top: head_top + 60] < 200).any(axis=0))[0]
    hx = int((cols[0] + cols[-1]) / 2) if len(cols) else cw // 2
    bh = 300  # head-to-shirt in source pixels
    bw = int(bh * 0.8)
    box = (hx - bw // 2, max(head_top - 30, 0), hx + bw // 2, max(head_top - 30, 0) + bh)
    bust = best.crop(box).resize((480, 600), Image.LANCZOS).filter(ImageFilter.UnsharpMask(1.2, 60, 2))
    bust.save(PUBLIC / "portrait-bust.webp", "WEBP", quality=86, method=6)

    # OG card: paper background, person on the right, name on the left.
    paper = (244, 242, 238)
    og = Image.new("RGB", (1200, 630), paper)
    person = best.resize((int(cw * 630 / ch), 630), Image.LANCZOS)
    # multiply the white backdrop into the paper
    p = np.asarray(person, np.float32) / 255 * np.array(paper, np.float32)
    og.paste(Image.fromarray(p.astype(np.uint8)), (1200 - person.width - 40, 0))
    d = ImageDraw.Draw(og)

    def font(size):
        for f in [ROOT / "src/fonts/InterTight-Variable.woff2", Path("C:/Windows/Fonts/arialbd.ttf"),
                  Path("/System/Library/Fonts/Helvetica.ttc"), Path("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf")]:
            try:
                ft = ImageFont.truetype(str(f), size)
                try:
                    ft.set_variation_by_axes([700])
                except Exception:
                    pass
                return ft
            except OSError:
                continue
        return ImageFont.load_default()

    d.text((72, 220), "Chandra", font=font(92), fill=(13, 13, 13))
    d.text((72, 316), "Nehasri", font=font(92), fill=(13, 13, 13))
    d.text((76, 440), "Machine Learning · Data Analytics · AI", font=font(26), fill=(119, 117, 111))
    og.save(PUBLIC / "og.jpg", "JPEG", quality=86, optimize=True)


if __name__ == "__main__":
    main()
