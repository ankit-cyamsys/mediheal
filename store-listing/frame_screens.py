#!/usr/bin/env python3
"""
Frame raw app screenshots into polished Google Play marketing images.

Usage:
  1. Drop your raw phone screenshots (PNG/JPG) into  store-listing/raw-screens/
     Name them in the order you want, e.g. 1-welcome.png, 2-home.png, ...
  2. (Optional) edit CAPTIONS below — one headline per screenshot, in order.
  3. Run with a Python that has Pillow installed:
        python store-listing/frame_screens.py

Outputs 9:16 images (Play-compliant) into:
  store-listing/phone/   1080 x 1920
  store-listing/tablet/  1440 x 2560
"""
import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, "raw-screens")
OUT_PHONE = os.path.join(HERE, "phone")
OUT_TABLET = os.path.join(HERE, "tablet")

# One caption per screenshot, in filename order. Extra screenshots get no caption.
CAPTIONS = [
    "A calmer mind,\na few minutes a day",
    "Guided sessions\nfor every moment",
    "Follow your breath",
    "Track your progress",
    "Light & dark themes",
    "Start free — no account needed",
]

TOP = (8, 52, 42)
BOT = (4, 25, 20)
WHITE = (255, 255, 255)
ACCENT = (198, 235, 220)

BOLD = ["/System/Library/Fonts/Supplemental/Arial Bold.ttf", "/System/Library/Fonts/Helvetica.ttc"]


def font(size):
    for p in BOLD:
        try:
            return ImageFont.truetype(p, size)
        except Exception:
            continue
    return ImageFont.load_default()


def gradient(w, h):
    img = Image.new("RGB", (w, h))
    px = img.load()
    for y in range(h):
        t = y / (h - 1)
        row = tuple(int(TOP[i] + (BOT[i] - TOP[i]) * t) for i in range(3))
        for x in range(w):
            px[x, y] = row
    return img.convert("RGBA")


def frame(shot, W, H, caption):
    canvas = gradient(W, H)
    draw = ImageDraw.Draw(canvas)

    # caption
    cap_bottom = int(H * 0.16)
    if caption:
        f = font(int(W * 0.058))
        y = int(H * 0.05)
        for line in caption.split("\n"):
            bbox = draw.textbbox((0, 0), line, font=f)
            tw = bbox[2] - bbox[0]
            draw.text(((W - tw) / 2, y), line, font=f, fill=WHITE)
            y += int((bbox[3] - bbox[1]) * 1.5)
        cap_bottom = y + int(H * 0.02)

    # scale screenshot to fit within the remaining area
    avail_h = H - cap_bottom - int(H * 0.05)
    target_w = int(W * 0.82)
    scale = min(target_w / shot.width, avail_h / shot.height)
    sw, sh = int(shot.width * scale), int(shot.height * scale)
    shot_r = shot.resize((sw, sh), Image.LANCZOS)

    # rounded corners + shadow
    radius = int(sw * 0.06)
    mask = Image.new("L", (sw, sh), 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, sw, sh], radius=radius, fill=255)
    x = (W - sw) // 2
    y = cap_bottom + (avail_h - sh) // 2
    shadow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    ImageDraw.Draw(shadow).rounded_rectangle([x, y + 12, x + sw, y + sh + 12], radius=radius,
                                             fill=(0, 0, 0, 120))
    shadow = shadow.filter(ImageFilter.GaussianBlur(24))
    canvas = Image.alpha_composite(canvas, shadow)
    canvas.paste(shot_r, (x, y), mask)
    return canvas.convert("RGB")


def main():
    if not os.path.isdir(SRC) or not any(
        f.lower().endswith((".png", ".jpg", ".jpeg")) for f in os.listdir(SRC)
    ):
        print(f"No screenshots found in {SRC}\nDrop your raw phone screenshots there and re-run.")
        return
    os.makedirs(OUT_PHONE, exist_ok=True)
    os.makedirs(OUT_TABLET, exist_ok=True)
    files = sorted(f for f in os.listdir(SRC) if f.lower().endswith((".png", ".jpg", ".jpeg")))
    for i, name in enumerate(files):
        shot = Image.open(os.path.join(SRC, name)).convert("RGBA")
        cap = CAPTIONS[i] if i < len(CAPTIONS) else ""
        base = f"{i + 1:02d}"
        frame(shot, 1080, 1920, cap).save(os.path.join(OUT_PHONE, f"{base}.png"))
        frame(shot, 1440, 2560, cap).save(os.path.join(OUT_TABLET, f"{base}.png"))
        print(f"framed {name} -> phone/{base}.png, tablet/{base}.png")
    print("\nDone. Upload phone/*.png to Phone screenshots, tablet/*.png to tablet slots.")


if __name__ == "__main__":
    main()
