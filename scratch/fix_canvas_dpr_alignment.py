html_path = 'wave_optics_review.html'

with open(html_path, 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Add getOffscreen helper if not present
if 'function getOffscreen(' not in text:
    target = '/* =====================================================================\n         * 互動實驗：共用框架'
    replacement = """/* =====================================================================
         * 離屏畫布快取（確保 High-DPI / Retina / 縮放螢幕下像素對齊不跑版）
         * ===================================================================*/
        let _offCanvas = null, _offCtx = null;
        function getOffscreen(w, h) {
            if (!_offCanvas) {
                _offCanvas = document.createElement('canvas');
                _offCtx = _offCanvas.getContext('2d');
            }
            if (_offCanvas.width !== w || _offCanvas.height !== h) {
                _offCanvas.width = w;
                _offCanvas.height = h;
            }
            return { canvas: _offCanvas, ctx: _offCtx };
        }

        /* =====================================================================
         * 互動實驗：共用框架"""
    text = text.replace(target, replacement)

# 2. Fix LABS.ripple first putImageData (interference mode)
old_rip_1 = """                    ctx.putImageData(img, x0, y0);"""
new_rip_1 = """                    const off = getOffscreen(iw, ih);
                    off.ctx.putImageData(img, 0, 0);
                    ctx.drawImage(off.canvas, 0, 0, iw, ih, x0, y0, tw, th);"""

# 3. Fix LABS.ripple second putImageData (diffraction mode)
old_rip_2 = """                ctx.putImageData(img, x0, by);"""
new_rip_2 = """                const off = getOffscreen(iw, ih);
                off.ctx.putImageData(img, 0, 0);
                ctx.drawImage(off.canvas, 0, 0, iw, ih, x0, by, tw, h2);"""

# 4. Fix LABS.young putImageData
old_young = """                        ctx.putImageData(img, xB, y0);"""
new_young = """                        const off = getOffscreen(iw, ih);
                        off.ctx.putImageData(img, 0, 0);
                        ctx.drawImage(off.canvas, 0, 0, iw, ih, xB, y0, fw, fh);"""

# 5. Fix LABS.diffraction putImageData
old_diff = """                    ctx.putImageData(img, xSl, y0);"""
new_diff = """                    const off = getOffscreen(iw, ih);
                    off.ctx.putImageData(img, 0, 0);
                    ctx.drawImage(off.canvas, 0, 0, iw, ih, xSl, y0, fw, fh);"""

text = text.replace(old_rip_1, new_rip_1, 1)
text = text.replace(old_rip_2, new_rip_2, 1)
text = text.replace(old_young, new_young, 1)
text = text.replace(old_diff, new_diff, 1)

with open(html_path, 'w', encoding='utf-8') as f:
    f.write(text)

print("Successfully replaced all putImageData calls with DPR-aware getOffscreen + drawImage!")
