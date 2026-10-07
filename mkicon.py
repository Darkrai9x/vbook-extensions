import sys, io
from PIL import Image
from collections import Counter

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

src = Image.open('icon_src.ico').convert('RGBA')
print('src:', src.size)

# 1) smooth upscale far above target so curves interpolate cleanly
big = src.resize((800, 800), Image.LANCZOS)

px = big.load()
# 2) find the dominant opaque colour (the brand orange)
counts = Counter()
for y in range(0, 800, 4):
    for x in range(0, 800, 4):
        r, g, b, a = px[x, y]
        if a > 200:
            counts[(r // 8 * 8, g // 8 * 8, b // 8 * 8)] += 1
brand = counts.most_common(1)[0][0]
print('brand:', brand)

# 3) re-harden the edges the interpolation softened: binary alpha + flat colour
for y in range(800):
    for x in range(800):
        r, g, b, a = px[x, y]
        if a >= 128:
            px[x, y] = (brand[0], brand[1], brand[2], 255)
        else:
            px[x, y] = (0, 0, 0, 0)

# 4) down to 200 — LANCZOS now antialiases a clean shape instead of a blurry one
out = big.resize((200, 200), Image.LANCZOS)
out.save('icon.png', optimize=True)

import os
print('icon.png', os.path.getsize('icon.png'), 'bytes', out.size)
