html_path = 'wave_optics_review.html'

with open(html_path, 'r', encoding='utf-8') as f:
    text = f.read()

# Replace LABS.young setup mode y1 and text coordinates
old_young_setup_coords = """                if (p.mode === 'setup') {
                    const y0 = 8, y1 = h - 60, cy = (y0 + y1) / 2, TH = y1 - y0;"""

new_young_setup_coords = """                if (p.mode === 'setup') {
                    const y0 = 8, y1 = h - 74, cy = (y0 + y1) / 2, TH = y1 - y0;"""

old_young_text = """                    label(ctx, 'S₀S₁ = S₀S₂ ⇒ S₁、S₂ 落在同一波前上 ⇒ 同相同調光', 6, y1 + 32, C.orange, 11);"""
new_young_text = """                    label(ctx, 'S₀S₁ = S₀S₂ ⇒ S₁、S₂ 落在同一波前上 ⇒ 同相同調光', 6, y1 + 34, C.orange, 11);"""

old_young_bottom = """                    label(ctx, `實際的條紋間距 Δy = Lλ/d = ${(dy * 1000).toFixed(2)} mm，各亮紋等寬等亮`, 6, h - 26, C.ink, 12);
                    label(ctx, '圖中尺寸未按實際比例（實際 L ≫ d，條紋數遠多於圖示）', 6, h - 8, C.muted, 11);"""

new_young_bottom = """                    label(ctx, `實際的條紋間距 Δy = Lλ/d = ${(dy * 1000).toFixed(2)} mm，各亮紋等寬等亮`, 6, h - 22, C.ink, 12);
                    label(ctx, '圖中尺寸未按實際比例（實際 L ≫ d，條紋數遠多於圖示）', 6, h - 7, C.muted, 11);"""

text = text.replace(old_young_setup_coords, new_young_setup_coords)
text = text.replace(old_young_text, new_young_text)
text = text.replace(old_young_bottom, new_young_bottom)

with open(html_path, 'w', encoding='utf-8') as f:
    f.write(text)

print("Successfully updated LABS.young bottom text spacing!")
