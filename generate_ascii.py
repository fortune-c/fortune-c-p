from PIL import Image
import os
import math

input_img = "/home/fortune/.gemini/antigravity/brain/a235a3bb-9d83-4c9e-8905-7306587b2cd2/media__1772894364358.jpg"
out_dir = "/home/fortune/Documents/repos/fortune-c-p/assets/ascii-me"

img = Image.open(input_img).convert("RGB")

width, height = img.size
# Crop to aspect ratio 400:543
target_aspect = 400 / 543.0
current_aspect = width / height

if current_aspect > target_aspect:
    new_width = int(target_aspect * height)
    left = (width - new_width) / 2
    img = img.crop((left, 0, left + new_width, height))
else:
    new_height = int(width / target_aspect)
    top = (height - new_height) / 2
    img = img.crop((0, top, width, top + new_height))

COLS = 65
ROWS = int(COLS * 543 / 400)

img_small = img.resize((COLS, ROWS), Image.LANCZOS)
pixels = img_small.load()

# Styles
# 1: dark (white with varying sizes)
# 2: butter (yellow shades)
# 3: multicolor (real colors)
# 4: white (pure white, constant size, sparse)

def generate_svg(style, filename):
    svg = []
    svg.append(f'<svg width="400" height="543" viewBox="0 0 400 543" fill="none" xmlns="http://www.w3.org/2000/svg">')
    
    cell_w = 400.0 / COLS
    cell_h = 543.0 / ROWS
    max_r = min(cell_w, cell_h) / 2.0 * 0.9

    for y in range(ROWS):
        for x in range(COLS):
            r, g, b = pixels[x, y]
            brightness = (r + g + b) / 765.0 # 0 to 1
            
            if style == 1:
                # dark / grayscale
                rad = max_r * brightness
                if rad > 0.5:
                    svg.append(f'<circle cx="{x*cell_w + cell_w/2:.2f}" cy="{y*cell_h + cell_h/2:.2f}" r="{rad:.2f}" fill="#ccc" />')
            
            elif style == 2:
                # butter
                rad = max_r * (brightness ** 0.8)
                if rad > 0.5:
                    # Map brightness to yellowish color
                    color = f"rgb({int(100 + brightness*155)},{int(100 + brightness*140)},{int(brightness*100)})"
                    svg.append(f'<circle cx="{x*cell_w + cell_w/2:.2f}" cy="{y*cell_h + cell_h/2:.2f}" r="{rad:.2f}" fill="{color}" />')
            
            elif style == 3:
                # multicolor
                rad = max_r * 0.8
                # Boost saturation slightly
                color = f"rgb({r},{g},{b})"
                if brightness > 0.05:
                    svg.append(f'<circle cx="{x*cell_w + cell_w/2:.2f}" cy="{y*cell_h + cell_h/2:.2f}" r="{rad*brightness**0.5:.2f}" fill="{color}" />')

            elif style == 4:
                # pure white
                if brightness > 0.2 + (x%2)*0.1 + (y%2)*0.1: # semi-dithered threshold
                    svg.append(f'<circle cx="{x*cell_w + cell_w/2:.2f}" cy="{y*cell_h + cell_h/2:.2f}" r="{max_r*0.6:.2f}" fill="white" />')

            elif style == 5:
                # pure dust (completely random spread for transition effect)
                import random
                if random.random() < 0.15:
                    svg.append(f'<circle cx="{x*cell_w + cell_w/2 + random.uniform(-cell_w, cell_w):.2f}" cy="{y*cell_h + cell_h/2 + random.uniform(-cell_h, cell_h):.2f}" r="{max_r*0.4:.2f}" fill="#aaeeaa" style="opacity:{random.uniform(0.3,0.8):.2f}" />')

    svg.append("</svg>")
    
    with open(os.path.join(out_dir, filename), "w") as f:
        f.write("\n".join(svg))

generate_svg(1, "ascii-me1.svg")
generate_svg(2, "ascii-me2.svg")
generate_svg(3, "ascii-me3.svg")
generate_svg(4, "ascii-me4.svg")
generate_svg(5, "ascii-dust1.svg")
generate_svg(5, "ascii-dust2.svg")
generate_svg(5, "ascii-dust3.svg")
generate_svg(5, "ascii-dust4.svg")
print("Done!")
