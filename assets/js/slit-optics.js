/*
 * slit-optics.js
 * 楊氏雙狹縫（N19）與單狹縫繞射（N20）新增的兩種模式共用：
 *   ① 多波長疊加（雙色、白光、兩個獨立光源）：不同波長或不同光源之間沒有固定相位差，
 *      屏幕上是「強度相加」I = I₁ + I₂ + …，不是振幅相加。
 *   ② 3D 立體模擬：狹縫沿上下方向很長，光在水平面上展開；屏幕上是直條紋。
 * 依賴主頁的 label、labelFit、labelWrap、dashed、getOffscreen、C（呼叫時才取用，故可先載入）。
 */
(function () {
    'use strict';

    /* ---------------- 波長 → 顏色 ----------------
     * CIE 1931 2° 色彩配對函數的多高斯近似（Wyman, Sloan & Shirley 2013），
     * 再轉成線性 sRGB。白平衡以 400–700 nm 等能量白光為白色。 */
    const gs = (x, mu, s1, s2) => { const t = (x - mu) / (x < mu ? s1 : s2); return Math.exp(-0.5 * t * t); };
    const xyz = (l) => [
        1.056 * gs(l, 599.8, 37.9, 31.0) + 0.362 * gs(l, 442.0, 16.0, 26.7) - 0.065 * gs(l, 501.1, 20.4, 26.2),
        0.821 * gs(l, 568.8, 46.9, 40.5) + 0.286 * gs(l, 530.9, 16.3, 31.1),
        1.217 * gs(l, 437.0, 11.8, 36.0) + 0.681 * gs(l, 459.0, 26.0, 13.8)
    ];
    const linRGB = (l) => {
        const [X, Y, Z] = xyz(l);
        return [3.2406 * X - 1.5372 * Y - 0.4986 * Z, -0.9689 * X + 1.8758 * Y + 0.0415 * Z, 0.0557 * X - 0.2040 * Y + 1.0570 * Z];
    };
    const WHITE = (() => {
        const s = [0, 0, 0]; let n = 0;
        for (let l = 400; l <= 700; l += 1) { const c = linRGB(l); s[0] += c[0]; s[1] += c[1]; s[2] += c[2]; n++; }
        return s.map((v) => v / n);
    })();
    const bal = (l) => { const c = linRGB(l); return [c[0] / WHITE[0], c[1] / WHITE[1], c[2] / WHITE[2]]; };
    /* 單色光的顯示色（線性 RGB）：單一波長多在 sRGB 色域外，改用與彩虹實驗相同的分段色票，
     * 再換成線性值供混色；光譜兩端人眼看得比較暗。 */
    const pure = (l) => {
        let r = 0, g = 0, b = 0;
        if (l < 440) { r = (440 - l) / 60; b = 1; }
        else if (l < 490) { g = (l - 440) / 50; b = 1; }
        else if (l < 510) { g = 1; b = (510 - l) / 20; }
        else if (l < 580) { r = (l - 510) / 70; g = 1; }
        else if (l < 645) { r = 1; g = (645 - l) / 65; }
        else r = 1;
        const fall = l < 420 ? 0.3 + 0.7 * (l - 380) / 40 : l > 680 ? 0.3 + 0.7 * (750 - l) / 70 : 1;
        const toLin = (v) => (v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
        return [r, g, b].map((v) => toLin(v * fall));
    };
    const GAMMA = (() => {
        const t = new Uint8ClampedArray(1025);
        for (let i = 0; i <= 1024; i++) {
            const v = i / 1024;
            t[i] = Math.round(255 * (v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(v, 1 / 2.4) - 0.055));
        }
        return t;
    })();
    const enc = (v) => GAMMA[v <= 0 ? 0 : v >= 1 ? 1024 : (v * 1024) | 0];
    const css = (rgbLin, a = 1) => `rgba(${enc(rgbLin[0])},${enc(rgbLin[1])},${enc(rgbLin[2])},${a})`;
    /* 曲線、文字用的顏色：太亮的黃綠色畫在白底上看不清，壓暗一點 */
    const ink = (l, a = 1) => {
        const c = pure(l), Y = 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
        const k = Y > 0.45 ? 0.45 / Y : 1;
        return css(c.map((v) => v * k), a);
    };

    /* 光源的光譜：回傳 [{ lam, c }]，c 是混色用的線性 RGB 權重。
     * 白光在「波數」上等間隔取樣（3D 計算可用旋轉遞推），權重 ∝ λ²，使每單位波長等能量；
     * 最後把各色頻總和調成 1，整條光譜疊起來就是白色。 */
    function spectrum(src, p, nWhite) {
        if (src === 'white') {
            const N = nWhite || 31, k0 = 1 / 700, k1 = 1 / 400, out = [], sum = [0, 0, 0];
            for (let j = 0; j < N; j++) {
                const lam = 1 / (k0 + (k1 - k0) * j / (N - 1));
                const b = bal(lam), wgt = lam * lam;
                const c = b.map((v) => v * wgt);
                out.push({ lam, c });
                c.forEach((v, i) => { sum[i] += v; });
            }
            out.forEach((o) => { o.c = o.c.map((v, i) => v / sum[i]); });
            return out;
        }
        if (src === 'two') return [{ lam: Number(p.lam1), c: pure(Number(p.lam1)) }, { lam: Number(p.lam2), c: pure(Number(p.lam2)) }];
        return [{ lam: Number(p.lam), c: pure(Number(p.lam)) }];
    }

    /* 兩個波長的亮紋（或暗紋）第一次重合：n₁λ₁ = n₂λ₂。
     * 容許誤差取較短波長的 4%（光程差差不到 0.04λ，條紋在畫面上看不出錯開）。 */
    function coincide(l1, l2, maxN, startN) {
        for (let n1 = startN || 1; n1 <= maxN; n1++) {
            const n2 = Math.round(n1 * l1 / l2);
            if (n2 < 1 || n2 === n1) continue;
            const diff = Math.abs(n1 * l1 - n2 * l2);
            if (diff <= 0.04 * Math.min(l1, l2)) return { n1, n2, exact: diff < 0.5, path: n1 * l1 };
        }
        return null;
    }
    /* 小數比 → 最簡整數比（顯示「λ₁ : λ₂ = 4 : 3」用） */
    const gcd = (a, b) => (b ? gcd(b, a % b) : a);

    /* ======================================================================
     * 多波長疊加（2D，實際單位）
     * opt = {
     *   Y: 屏幕顯示的半寬（m），title,
     *   lines: [{ lam, c, I:(y)=>0..1, curve: 'solid'|'dash'|false, name, col }],
     *   axisMax: 曲線縱軸最大值（單色強度 = 1）, total: { label } | null,
     *   marks: [{ y, col, text }]（屏幕帶下方的級次標記）, vlines: [{ y, col, text }],
     *   bands: [{ y0, y1, col, text }], foot: [字串...]
     * }
     * ====================================================================== */
    function draw2D(ctx, w, h, opt) {
        const narrow = w < 560;
        const mx = narrow ? 14 : 22, X0 = mx, X1 = w - mx, PW = X1 - X0;
        const layout = opt.groups ? (opt.layout || 'both') : 'merge';
        const groups = layout === 'merge' ? [] : opt.groups;
        const showMerged = layout !== 'split';
        const gh = groups.length > 3 ? (narrow ? 15 : 17) : (narrow ? 24 : 28);   // 分開的色帶高度
        const mH = groups.length ? (narrow ? 34 : 40) : (narrow ? 52 : 64);        // 合併色帶高度
        const sTop = 30;
        const sBot = sTop + groups.length * (gh + 3) + (showMerged ? (groups.length ? 18 : 0) + mH : -3);
        const footLines = opt.foot || [];
        const footH = footLines.length * (narrow ? 30 : 17) + 10;
        const gTop = sBot + 44, gBot = h - footH - 26;
        const xOf = (y) => X0 + (y / opt.Y + 1) / 2 * PW;
        const yOf = (px) => ((px - X0) / PW * 2 - 1) * opt.Y;

        ctx.fillStyle = '#f7f9fa'; ctx.fillRect(0, 0, w, h);
        labelFit(ctx, opt.title || (layout === 'split' ? '屏幕上看到的條紋：各自分開' : layout === 'both' ? '屏幕上看到的條紋：先分開看，再合併（強度相加）' : '屏幕上看到的條紋（各色強度相加後的實際顏色）'),
            X0, 18, C.ink, 12, 'left', { maxW: PW, min: 10, clampW: w });

        /* --- 屏幕色帶：每一欄把各波長的強度乘上顏色權重相加 --- */
        const cols = Math.max(2, Math.round(PW));
        const strip = (lines, y0, hh, normIn, tag) => {
            const acc = new Float32Array(cols * 3);
            let peak = 1e-9;
            for (let i = 0; i < cols; i++) {
                const y = yOf(X0 + (i + 0.5) / cols * PW);
                let r = 0, g = 0, b = 0;
                for (const L of lines) {
                    if (L.mix === false) continue;
                    const I = L.I(y);
                    r += L.c[0] * I; g += L.c[1] * I; b += L.c[2] * I;
                }
                acc[i * 3] = r; acc[i * 3 + 1] = g; acc[i * 3 + 2] = b;
                peak = Math.max(peak, r, g, b);
            }
            const norm = normIn || peak;
            if (opt.compress) {
                // 側亮紋只有中央的幾 %：依亮度壓縮（保留色相），才看得出來
                for (let i = 0; i < cols; i++) {
                    const Y = (0.2126 * acc[i * 3] + 0.7152 * acc[i * 3 + 1] + 0.0722 * acc[i * 3 + 2]) / norm;
                    const k = Y > 1e-6 ? Math.pow(Y, opt.compress) / Y : 0;
                    acc[i * 3] *= k; acc[i * 3 + 1] *= k; acc[i * 3 + 2] *= k;
                }
            }
            const off = getOffscreen(cols, 1);
            const img = off.ctx.createImageData(cols, 1);
            for (let i = 0; i < cols; i++) {
                img.data[i * 4] = enc(acc[i * 3] / norm);
                img.data[i * 4 + 1] = enc(acc[i * 3 + 1] / norm);
                img.data[i * 4 + 2] = enc(acc[i * 3 + 2] / norm);
                img.data[i * 4 + 3] = 255;
            }
            off.ctx.putImageData(img, 0, 0);
            ctx.save();
            ctx.imageSmoothingEnabled = true;
            ctx.drawImage(off.canvas, 0, 0, cols, 1, X0, y0, PW, hh);
            ctx.restore();
            ctx.strokeStyle = 'rgba(18,49,58,0.35)'; ctx.lineWidth = 1;
            ctx.strokeRect(X0, y0, PW, hh);
            if (tag) labelFit(ctx, tag, X0 + 4, y0 + hh / 2 + 4, C.ink, hh < 20 ? 10 : 11, 'left',
                { plate: 'rgba(255,255,255,0.88)', maxW: PW * 0.45, min: 9, clampW: w });
        };
        let yy = sTop;
        groups.forEach((g) => { strip(g.lines, yy, gh, null, g.name); yy += gh + 3; });
        if (showMerged) {
            if (groups.length) {
                labelFit(ctx, layout === 'both' ? '↓ 合併：同一位置的強度相加' : '合併', X0, yy + 12, C.rose, 11, 'left', { maxW: PW, min: 9, clampW: w });
                yy += 18;
            }
            strip(opt.lines, yy, mH, opt.stripNorm, groups.length ? '合併' : '');
        }

        /* --- 刻度（mm） --- */
        const Ymm = opt.Y * 1000;
        const steps = [0.1, 0.2, 0.5, 1, 2, 5, 10, 20, 50, 100];
        const tick = steps.find((s) => Ymm / s <= (narrow ? 3 : 5)) || 100;
        ctx.fillStyle = C.muted;
        for (let v = -Math.floor(Ymm / tick) * tick; v <= Ymm + 1e-9; v += tick) {
            const x = xOf(v / 1000);
            ctx.fillRect(x - 0.5, sBot, 1, 4);
            if (x > X1 - 30) continue;                       // 右端留給單位 mm
            const txt = Math.abs(v) < 1e-9 ? '0' : (tick < 1 ? v.toFixed(1) : String(Math.round(v)));
            label(ctx, txt, x, sBot + 15, C.muted, 10, 'center');
        }
        labelFit(ctx, 'mm', X1, sBot + 15, C.muted, 10, 'right', { plate: '#f7f9fa', clampW: w });

        /* --- 級次標記（色帶上方的小三角形） --- */
        (opt.marks || []).forEach((m) => {
            const x = xOf(m.y);
            if (x < X0 + 2 || x > X1 - 2) return;
            ctx.fillStyle = m.col;
            ctx.beginPath(); ctx.moveTo(x, sTop - 1); ctx.lineTo(x - 4, sTop - 8); ctx.lineTo(x + 4, sTop - 8); ctx.closePath(); ctx.fill();
        });

        /* --- 強度曲線 --- */
        const gH = gBot - gTop;
        if (gH > 30) {
            const am = opt.axisMax || 1;
            const yv = (v) => gBot - v / am * gH;
            ctx.strokeStyle = 'rgba(18,49,58,0.25)'; ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(X0, gBot); ctx.lineTo(X1, gBot); ctx.stroke();
            for (let k = 1; k <= am; k++) {
                dashed(ctx, X0, yv(k), X1, yv(k), 'rgba(18,49,58,0.12)');
                label(ctx, `${k}`, X0 + 2, yv(k) - 3, C.muted, 9);
            }
            (opt.bands || []).forEach((b) => {
                const xa = Math.max(X0, xOf(b.y0)), xb = Math.min(X1, xOf(b.y1));
                if (xb - xa < 2) return;
                ctx.fillStyle = b.col; ctx.fillRect(xa, gTop - 4, xb - xa, gH + 4);
            });
            const plot = (fn, col, lw, dash) => {
                ctx.save();
                if (dash) ctx.setLineDash(dash);
                ctx.strokeStyle = col; ctx.lineWidth = lw;
                ctx.beginPath();
                for (let px = X0; px <= X1; px += 1) {
                    const v = fn(yOf(px));
                    px === X0 ? ctx.moveTo(px, yv(v)) : ctx.lineTo(px, yv(v));
                }
                ctx.stroke(); ctx.restore();
            };
            opt.lines.forEach((L) => {
                if (!L.curve) return;
                if (layout === 'merge' && opt.total) return;           // 只看合併：不畫各自的曲線
                plot(L.I, L.col || ink(L.lam, 0.95), L.lw || 1.8, L.curve === 'dash' ? [6, 4] : null);
            });
            if (opt.total && layout !== 'split') plot(opt.total.fn, C.ink, 2.4, null);
            (opt.vlines || []).forEach((v, i) => {
                const x = xOf(v.y);
                if (x < X0 || x > X1) return;
                dashed(ctx, x, sTop, x, gBot, v.col || C.rose);
                if (v.text) labelFit(ctx, v.text, x + (v.y >= 0 ? 4 : -4), gTop + 10 + i * 15, v.col || C.rose, 10, v.y >= 0 ? 'left' : 'right',
                    { plate: 'rgba(247,249,250,0.92)', clampW: w, maxW: PW * 0.5 });
            });
            (opt.bands || []).forEach((b) => {
                if (!b.text) return;
                const xa = Math.max(X0, xOf(b.y0)), xb = Math.min(X1, xOf(b.y1));
                if (xb - xa < 2) return;
                labelFit(ctx, b.text, (xa + xb) / 2, gTop + (b.row || 0) * 14 + 4, b.tcol || C.ink, 10, 'center',
                    { plate: 'rgba(247,249,250,0.9)', clampW: w, maxW: Math.max(60, xb - xa + 40) });
            });
            /* 圖例 */
            const isTot = (it) => /合成|白光合成/.test(it.text);
            const leg = (opt.legend || []).filter(Boolean).filter((it) => (layout === 'split' ? !isTot(it) : layout === 'merge' && opt.total ? isTot(it) : true));
            let lx = X1, ly = sBot + 32;
            ctx.font = '10px Outfit, "Noto Sans TC", sans-serif';
            for (let i = leg.length - 1; i >= 0; i--) {
                const it = leg[i], tw = ctx.measureText(it.text).width + 26;
                if (lx - tw < X0) { lx = X1; ly += 13; }
                ctx.save();
                if (it.dash) ctx.setLineDash([5, 3]);
                ctx.strokeStyle = it.col; ctx.lineWidth = it.lw || 2;
                ctx.beginPath(); ctx.moveTo(lx - tw, ly - 4); ctx.lineTo(lx - tw + 18, ly - 4); ctx.stroke();
                ctx.restore();
                label(ctx, it.text, lx - tw + 22, ly, C.ink, 10);
                lx -= tw + 8;
            }
        }
        /* --- 底部說明 --- */
        let fy = h - footH + 6;
        footLines.forEach((t) => {
            const n = labelWrap(ctx, typeof t === 'string' ? t : t.text, X0, fy, (t && t.col) || C.ink, 11, 14, PW);
            fy += n * 14 + 3;
        });
    }

    /* ======================================================================
     * 3D 立體模擬
     * 世界座標：x 沿光行進方向（光源 → 狹縫 → 屏幕），y 為水平橫向（縫距方向），z 朝上（沿狹縫長度）。
     * 狹縫在 x = 0，屏幕在 x = LV；波長以 550 nm 對應 LAM0 個單位放大示意。
     * 水平面 z = 0 上的光場由縫上排列的點波源（惠更斯子波）直接相加；屏幕條紋取同一組波源在 x = LV 的強度，
     * 所以平面上的亮線一定打在屏幕的亮紋上。
     * ====================================================================== */
    const LV = 16, WV = 7.5, XI = 3.6, PH = 4.2, SH = 3.2, LAM0 = 0.6;
    const PRESETS = {
        oblique: { yaw: -2.0, pitch: 0.50, zoom: 1, tx: LV * 0.42, D: 33 },
        top: { yaw: -Math.PI / 2, pitch: 1.45, zoom: 1, tx: LV * 0.42, D: 33 },
        screen: { yaw: Math.PI + 0.32, pitch: 0.22, zoom: 1.5, tx: LV, D: 13 },
        side: { yaw: -Math.PI / 2, pitch: 0.16, zoom: 1, tx: LV * 0.42, D: 33 }
    };
    const viewOf = (p) => p._view || (p._view = Object.assign({}, PRESETS[p.cam] || PRESETS.oblique));

    function camera(v, w, h) {
        const cyw = Math.cos(v.yaw), syw = Math.sin(v.yaw), cp = Math.cos(v.pitch), sp = Math.sin(v.pitch);
        const T = [v.tx, 0, 0.4];
        const E = [T[0] + v.D * cp * cyw, T[1] + v.D * cp * syw, T[2] + v.D * sp];
        const f = [-cp * cyw, -cp * syw, -sp], r = [-syw, cyw, 0], u = [-sp * cyw, -sp * syw, cp];
        const F = Math.min(w * 1.25, h * 1.9) * (v.D / 33) * (w < 560 ? 0.92 : 0.74) * v.zoom;
        const cx = w / 2, cy = h * 0.46;
        const project = (P) => {
            const dx = P[0] - E[0], dy = P[1] - E[1], dz = P[2] - E[2];
            const zc = dx * f[0] + dy * f[1] + dz * f[2];
            return [cx + F * (dx * r[0] + dy * r[1] + dz * r[2]) / zc, cy - F * (dx * u[0] + dy * u[1] + dz * u[2]) / zc, zc];
        };
        return { E, f, r, u, F, cx, cy, project };
    }

    /* 縫上的子波源：每條縫依縫寬放 1～NSmax 個同相點波源 */
    function sources(cfg, lamMin) {
        const out = [];
        cfg.slits.forEach((yc) => {
            const ns = Math.max(1, Math.min(cfg.nsMax || 9, Math.round(cfg.a / (lamMin * 0.32)) + 1));
            for (let i = 0; i < ns; i++) out.push({ y: ns === 1 ? yc : yc + cfg.a * (i / (ns - 1) - 0.5), w: 1 / ns });
        });
        return out;
    }

    /* 各波長在一點的複數振幅（2D 柱面波：振幅 ∝ 1/√r）。白光的波數等間隔，用旋轉遞推省下三角函數。 */
    function makeAmp(lines, srcs) {
        const ks = lines.map((L) => 2 * Math.PI / (LAM0 * L.lam / 550));
        const n = ks.length;
        const uniform = n > 2;
        const dk = uniform ? ks[1] - ks[0] : 0;
        return (x, y, re, im) => {
            for (let j = 0; j < n; j++) { re[j] = 0; im[j] = 0; }
            for (const s of srcs) {
                const r = Math.max(0.12, Math.hypot(x, y - s.y)), a = s.w / Math.sqrt(r);
                if (uniform) {
                    let c = Math.cos(ks[0] * r), sn = Math.sin(ks[0] * r);
                    const cd = Math.cos(dk * r), sd = Math.sin(dk * r);
                    for (let j = 0; j < n; j++) {
                        re[j] += a * c; im[j] += a * sn;
                        const c2 = c * cd - sn * sd; sn = sn * cd + c * sd; c = c2;
                    }
                } else {
                    for (let j = 0; j < n; j++) { const ph = ks[j] * r; re[j] += a * Math.cos(ph); im[j] += a * Math.sin(ph); }
                }
            }
        };
    }

    /* 平面光場的貼圖與屏幕強度：只在參數改變時重算（旋轉視角不用重算） */
    function buildField(cfg) {
        const key = JSON.stringify([cfg.slits, cfg.a, cfg.lines.map((L) => Math.round(L.lam * 10))]);
        if (cfg.cache && cfg.cache.key === key) return cfg.cache;
        const lines = cfg.lines, n = lines.length;
        const lamMin = LAM0 * Math.min(...lines.map((L) => L.lam)) / 550;
        const srcs = sources(cfg, lamMin);
        const amp = makeAmp(lines, srcs);
        const re = new Float64Array(n), im = new Float64Array(n);
        /* 屏幕 */
        const NS = 240, scr = lines.map(() => new Float32Array(NS));
        let peak = 1e-12;
        for (let i = 0; i < NS; i++) {
            const y = -WV + 2 * WV * (i + 0.5) / NS;
            amp(LV, y, re, im);
            for (let j = 0; j < n; j++) { scr[j][i] = re[j] * re[j] + im[j] * im[j]; }
        }
        const stripLin = new Float32Array(NS * 3);
        const total = new Float32Array(NS);
        for (let i = 0; i < NS; i++) {
            let r = 0, g = 0, b = 0, t = 0;
            for (let j = 0; j < n; j++) {
                const I = scr[j][i], c = lines[j].c;
                r += c[0] * I; g += c[1] * I; b += c[2] * I;
                t += I * (n > 2 ? (0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]) : 1);
            }
            stripLin[i * 3] = r; stripLin[i * 3 + 1] = g; stripLin[i * 3 + 2] = b; total[i] = t;
            peak = Math.max(peak, r, g, b);
        }
        for (let i = 0; i < NS * 3; i++) stripLin[i] /= peak;
        const tMax = Math.max(...total) || 1;
        for (let i = 0; i < NS; i++) total[i] /= tMax;
        const lineMax = scr.map((a) => Math.max(...a) || 1);
        /* 平面貼圖（x ∈ [0, LV]、y ∈ [−WV, WV]） */
        const tex = lamMin / 4.2;
        const NX = Math.ceil(LV / tex) + 1, NY = Math.ceil(2 * WV / tex) + 1;
        const Re = lines.map(() => new Float32Array(NX * NY)), Im = lines.map(() => new Float32Array(NX * NY));
        const avg = new Float32Array(NX * NY * 3);
        /* 顯示增益：以屏幕上最亮處（乘上距離補償）為準，讓遠處條紋也看得清楚 */
        const comp = (x) => x + 1.2;
        let aMax = 0;
        for (let i = 0; i < NS; i++) { let s = 0; for (let j = 0; j < n; j++) s += scr[j][i] * (n > 2 ? 1 / n * 3 : 1); aMax = Math.max(aMax, s); }
        aMax = Math.sqrt(aMax * comp(LV)) || 1;
        const gainA = 1.6 / (aMax * aMax);
        for (let ix = 0; ix < NX; ix++) {
            const x = ix * LV / (NX - 1), cx = comp(x);
            for (let iy = 0; iy < NY; iy++) {
                const y = -WV + iy * 2 * WV / (NY - 1), id = ix * NY + iy;
                amp(x, y, re, im);
                let r = 0, g = 0, b = 0;
                for (let j = 0; j < n; j++) {
                    Re[j][id] = re[j]; Im[j][id] = im[j];
                    const I = (re[j] * re[j] + im[j] * im[j]) * cx * gainA, c = lines[j].c;
                    r += c[0] * I; g += c[1] * I; b += c[2] * I;
                }
                const k = n > 2 ? 3 : 1;
                avg[id * 3] = 1 - Math.exp(-r * k); avg[id * 3 + 1] = 1 - Math.exp(-g * k); avg[id * 3 + 2] = 1 - Math.exp(-b * k);
            }
        }
        const res = { key, NS, scr, lineMax, stripLin, total, NX, NY, Re, Im, avg, gainI: 1.05 / aMax, comp, nSrc: srcs.length };
        if (cfg.store) cfg.store(res);
        return res;
    }

    /* 遠看（L ≫ d）：整排狹縫相對於屏幕距離小到可視為一點，各點的亮度只由方向 θ 決定（夫朗和斐近似）。
     * 以 u = sinθ 等間隔建表：I = [sin β / β]² · [sin(Nφ/2) / (N sin(φ/2))]²，β = π a u / λ、φ = 2π d u / λ。
     * 縫很多時亮紋極細，比一個像素還窄：每個像素依它涵蓋的 u 範圍取平均（前綴和），細亮紋才不會消失。 */
    function buildFar(cfg) {
        const key = JSON.stringify(['far', cfg.N, cfg.dl, cfg.al, cfg.lines.map((L) => Math.round(L.lam * 10))]);
        if (cfg.cache && cfg.cache.key === key) return cfg.cache;
        const NT = 32768, lines = cfg.lines, n = lines.length, N = cfg.N;
        const P = new Float64Array((NT + 1) * 3), Pl = lines.map(() => new Float64Array(NT + 1)), Pt = new Float64Array(NT + 1);
        const lum = lines.map((L) => (n > 2 ? lumOf(L.c) : 1));
        for (let i = 0; i < NT; i++) {
            const u = -1 + 2 * (i + 0.5) / NT;
            let r = 0, g = 0, b = 0, tot = 0;
            for (let j = 0; j < n; j++) {
                const k = 550 / lines[j].lam;
                const env = cfg.al > 0 ? sinc2(Math.PI * cfg.al * u * k) : 1;
                let gr = 1;
                if (N > 1) {
                    const h2 = Math.PI * cfg.dl * u * k, sd = Math.sin(h2);
                    gr = Math.abs(sd) < 1e-9 ? 1 : (Math.sin(N * h2) / (N * sd)) ** 2;
                }
                const I = env * gr, c = lines[j].c;
                r += c[0] * I; g += c[1] * I; b += c[2] * I; tot += lum[j] * I;
                Pl[j][i + 1] = Pl[j][i] + I;
            }
            P[(i + 1) * 3] = P[i * 3] + r; P[(i + 1) * 3 + 1] = P[i * 3 + 1] + g; P[(i + 1) * 3 + 2] = P[i * 3 + 2] + b;
            Pt[i + 1] = Pt[i] + tot;
        }
        const idx = (u) => Math.max(0, Math.min(NT, (u + 1) / 2 * NT));
        const span = (u0, u1) => {
            let a = idx(Math.min(u0, u1)), b = idx(Math.max(u0, u1));
            if (b - a < 1) { const m = (a + b) / 2; a = Math.max(0, m - 0.5); b = Math.min(NT, m + 0.5); }
            return [Math.floor(a), Math.max(Math.floor(a) + 1, Math.round(b))];
        };
        const avgRGB = (u0, u1, out) => {
            const [a, b] = span(u0, u1), d = b - a;
            out[0] = (P[b * 3] - P[a * 3]) / d; out[1] = (P[b * 3 + 1] - P[a * 3 + 1]) / d; out[2] = (P[b * 3 + 2] - P[a * 3 + 2]) / d;
            return out;
        };
        // θ = 0 處每一色都最亮（I = 1），以那裡的最大色頻當亮度基準
        const c0 = [0, 0, 0];
        lines.forEach((L) => L.c.forEach((v, i) => { c0[i] += v; }));
        const norm = Math.max(...c0, 1e-9);
        /* 屏幕：320 個直條，每條取它涵蓋的 u 範圍平均 */
        const NS = 320, scr = lines.map(() => new Float32Array(NS)), total = new Float32Array(NS), stripLin = new Float32Array(NS * 3);
        const uY = (y) => y / Math.hypot(y, LV);
        const tmp = [0, 0, 0];
        for (let i = 0; i < NS; i++) {
            const u0 = uY(-WV + 2 * WV * i / NS), u1 = uY(-WV + 2 * WV * (i + 1) / NS);
            const [a, b] = span(u0, u1), d = b - a;
            for (let j = 0; j < n; j++) scr[j][i] = (Pl[j][b] - Pl[j][a]) / d;
            total[i] = (Pt[b] - Pt[a]) / d;
            avgRGB(u0, u1, tmp);
            stripLin[i * 3] = tmp[0]; stripLin[i * 3 + 1] = tmp[1]; stripLin[i * 3 + 2] = tmp[2];
        }
        const sMax = Math.max(...stripLin) || 1;
        for (let i = 0; i < NS * 3; i++) stripLin[i] /= sMax;
        const tMax = Math.max(...total) || 1;
        for (let i = 0; i < NS; i++) total[i] /= tMax;
        const lineMax = scr.map((a) => Math.max(...a) || 1);
        const res = { key, far: true, NS, scr, total, stripLin, lineMax, avgRGB, norm };
        if (cfg.store) cfg.store(res);
        return res;
    }

    function draw3D(ctx, w, h, p, t, cfg) {
        const v = viewOf(p);
        const cam = camera(v, w, h);
        const far = !!cfg.far;
        const F = far ? buildFar(cfg) : buildField(cfg);
        const lines = cfg.lines, n = lines.length;
        const instant = !far && cfg.show === 'instant' && n <= 2;
        const lamV = lines.map((L) => LAM0 * L.lam / 550);
        const om = lines.map((L) => 3.4 * 550 / L.lam);
        const cs = om.map((o) => Math.cos(o * t)), sn = om.map((o) => Math.sin(o * t));

        ctx.fillStyle = '#eef3f5'; ctx.fillRect(0, 0, w, h);

        /* ---------- 物件（多邊形）：以 z = 0 為界分成下半與上半 ---------- */
        const lower = [], upper = [];
        const quad = (pts, fill, stroke, lw) => {
            const P = pts.map(cam.project);
            if (P.some((q) => q[2] < 0.4)) return;
            const zc = P.reduce((s, q) => s + q[2], 0) / P.length;
            const zMid = pts.reduce((s, q) => s + q[2], 0) / pts.length;
            (zMid < 0 ? lower : upper).push({ type: 'poly', P, fill, stroke, lw, zc });
        };
        const vpanel = (x, ya, yb, za, zb, fill, stroke) => {
            // 垂直面板（法線沿 x），跨過 z = 0 時切成兩半
            if (za < 0 && zb > 0) {
                quad([[x, ya, za], [x, yb, za], [x, yb, 0], [x, ya, 0]], fill, stroke);
                quad([[x, ya, 0], [x, yb, 0], [x, yb, zb], [x, ya, zb]], fill, stroke);
            } else quad([[x, ya, za], [x, yb, za], [x, yb, zb], [x, ya, zb]], fill, stroke);
        };

        /* 光源：一片發光面板（平行光） */
        let mix = [0, 0, 0];
        lines.forEach((L) => { mix = mix.map((m, i) => m + L.c[i]); });
        const mm = Math.max(...mix, 1e-6);
        mix = mix.map((m) => m / mm);
        vpanel(-XI - 0.15, -WV * 0.85, WV * 0.85, -PH * 0.55, PH * 0.55, css(mix, 0.85), 'rgba(18,49,58,0.45)');

        /* 狹縫板：扣掉狹縫後的直條 */
        const edges = [];
        if (far) edges.push([-0.09, 0.09]);      // 遠看：整排狹縫小到只剩中間一道細縫（放大圖見左上）
        else cfg.slits.forEach((yc) => edges.push([yc - cfg.a / 2, yc + cfg.a / 2]));
        edges.sort((a, b) => a[0] - b[0]);
        const plateFill = 'rgba(52,78,88,0.94)', plateEdge = 'rgba(18,49,58,0.6)';
        let ycur = -WV;
        edges.forEach(([ya, yb]) => {
            if (ya > ycur) vpanel(0, ycur, ya, -PH, PH, plateFill, plateEdge);
            vpanel(0, ya, yb, SH, PH, plateFill, plateEdge);
            vpanel(0, ya, yb, -PH, -SH, plateFill, plateEdge);
            ycur = yb;
        });
        if (ycur < WV) vpanel(0, ycur, WV, -PH, PH, plateFill, plateEdge);

        /* 屏幕：一條一條直條紋 */
        const NS = F.NS, NSd = far ? NS : Math.min(NS, 160);
        for (let i = 0; i < NSd; i++) {
            const ya = -WV + 2 * WV * i / NSd, yb = -WV + 2 * WV * (i + 1) / NSd + 0.002;
            const si = Math.min(NS - 1, Math.floor((i + 0.5) / NSd * NS));
            const c = [F.stripLin[si * 3], F.stripLin[si * 3 + 1], F.stripLin[si * 3 + 2]];
            const base = 0.05;
            const fill = css(c.map((q) => base + (1 - base) * q));
            vpanel(LV, ya, yb, -PH, PH, fill, null);
        }
        quad([[LV + 0.01, -WV, -PH], [LV + 0.01, WV, -PH], [LV + 0.01, WV, 0], [LV + 0.01, -WV, 0]], null, 'rgba(18,49,58,0.5)', 1.2);
        quad([[LV + 0.01, -WV, 0], [LV + 0.01, WV, 0], [LV + 0.01, WV, PH], [LV + 0.01, -WV, PH]], null, 'rgba(18,49,58,0.5)', 1.2);

        /* 屏幕上方的強度曲線（畫在屏幕所在的直立面上） */
        if (cfg.curve) {
            const z0 = PH + 0.35, Hc = 2.4;
            const add = (arr, scale, col, lw) => {
                const pts = [];
                for (let i = 0; i < NS; i += 2) pts.push([LV, -WV + 2 * WV * (i + 0.5) / NS, z0 + arr[i] * scale * Hc]);
                const P = pts.map(cam.project);
                if (P.some((q) => q[2] < 0.4)) return;
                upper.push({ type: 'line', P, col, lw, zc: P.reduce((s, q) => s + q[2], 0) / P.length - 0.01 });
            };
            const base = [[LV, -WV, z0], [LV, WV, z0]].map(cam.project);
            if (base.every((q) => q[2] > 0.4)) upper.push({ type: 'line', P: base, col: 'rgba(18,49,58,0.35)', lw: 1, zc: (base[0][2] + base[1][2]) / 2 });
            if (n <= 2) F.scr.forEach((a, j) => add(a, 1 / F.lineMax[j], ink(lines[j].lam), 2));
            if (n !== 1) add(F.total, 1, C.ink, n > 2 ? 2.4 : 1.6);
        }

        const paintList = (list) => {
            list.sort((a, b) => b.zc - a.zc);
            list.forEach((o) => {
                ctx.beginPath();
                o.P.forEach((q, i) => (i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1])));
                if (o.type === 'poly') {
                    ctx.closePath();
                    if (o.fill) { ctx.fillStyle = o.fill; ctx.fill(); }
                    if (o.stroke) { ctx.strokeStyle = o.stroke; ctx.lineWidth = o.lw || 0.8; ctx.stroke(); }
                } else { ctx.strokeStyle = o.col; ctx.lineWidth = o.lw; ctx.stroke(); }
            });
        };
        paintList(lower);

        /* ---------- 水平面 z = 0 的光場：逐像素光線投射 ---------- */
        const step = w >= 640 ? 3 : 2;
        const iw = Math.ceil(w / step), ih = Math.ceil(h / step);
        const off = getOffscreen(iw, ih);
        const img = off.ctx.createImageData(iw, ih);
        const d8 = img.data;
        const NX = F.NX, NY = F.NY, sx = (NX - 1) / LV, sy = (NY - 1) / (2 * WV);
        const kIn = lamV.map((l) => 2 * Math.PI / l);
        const gI = F.gainI;
        const vals = new Float32Array(n);
        const rowU = new Float32Array(iw).fill(NaN), farTmp = [0, 0, 0];
        let prevOk = false, prevU = 0;
        for (let j2 = 0; j2 < ih; j2++) {
            const py = (j2 + 0.5) * step;
            prevOk = false;
            for (let i2 = 0; i2 < iw; i2++) {
                const px = (i2 + 0.5) * step;
                const ax = (px - cam.cx) / cam.F, ay = -(py - cam.cy) / cam.F;
                const dz = cam.f[2] + ax * cam.r[2] + ay * cam.u[2];
                if (dz >= -1e-6) { prevOk = false; rowU[i2] = NaN; continue; }
                const tt = -cam.E[2] / dz;
                const X = cam.E[0] + tt * (cam.f[0] + ax * cam.r[0] + ay * cam.u[0]);
                const Y = cam.E[1] + tt * (cam.f[1] + ax * cam.r[1] + ay * cam.u[1]);
                if (X < -XI || X > LV || Y < -WV || Y > WV) { prevOk = false; rowU[i2] = NaN; continue; }
                let r = 0, g = 0, b = 0;
                if (X < 0) {
                    prevOk = false; rowU[i2] = NaN;
                    // 狹縫前：沿 +x 前進的平面波
                    for (let j = 0; j < n; j++) {
                        const c = lines[j].c;
                        const val = instant ? Math.abs(Math.cos(kIn[j] * X - om[j] * t)) * 0.85 : 0.55;
                        const k = n > 2 ? 1 : 1;
                        r += c[0] * val * k; g += c[1] * val * k; b += c[2] * val * k;
                    }
                } else if (far) {
                    // 方向 u = sinθ；像素涵蓋的 u 範圍取平均，細亮紋才不會漏掉
                    const rr = Math.hypot(X, Y);
                    const u = rr > 1e-6 ? Y / rr : 0;
                    let du = 2 / 32768;
                    if (prevOk) du = Math.max(du, Math.abs(u - prevU));
                    const up = rowU[i2];
                    if (!Number.isNaN(up)) du = Math.max(du, Math.abs(u - up));
                    prevOk = true; prevU = u; rowU[i2] = u;
                    F.avgRGB(u - du / 2, u + du / 2, farTmp);
                    const fade = Math.min(1, rr / 0.25);
                    r = (1 - Math.exp(-2.6 * farTmp[0] / F.norm)) * fade;
                    g = (1 - Math.exp(-2.6 * farTmp[1] / F.norm)) * fade;
                    b = (1 - Math.exp(-2.6 * farTmp[2] / F.norm)) * fade;
                } else {
                    const fx = X * sx, fy = (Y + WV) * sy;
                    const ix = Math.min(NX - 2, fx | 0), iy = Math.min(NY - 2, fy | 0);
                    const tx = fx - ix, ty = fy - iy;
                    const i00 = ix * NY + iy, i01 = i00 + 1, i10 = i00 + NY, i11 = i10 + 1;
                    const w00 = (1 - tx) * (1 - ty), w01 = (1 - tx) * ty, w10 = tx * (1 - ty), w11 = tx * ty;
                    if (instant) {
                        const cc = Math.sqrt(F.comp(X)) * gI;
                        for (let j = 0; j < n; j++) {
                            const R = F.Re[j], I = F.Im[j];
                            const re = R[i00] * w00 + R[i01] * w01 + R[i10] * w10 + R[i11] * w11;
                            const im = I[i00] * w00 + I[i01] * w01 + I[i10] * w10 + I[i11] * w11;
                            vals[j] = Math.min(1.4, Math.abs(re * cs[j] + im * sn[j]) * cc);
                            const c = lines[j].c;
                            r += c[0] * vals[j]; g += c[1] * vals[j]; b += c[2] * vals[j];
                        }
                    } else {
                        const A = F.avg;
                        r = A[i00 * 3] * w00 + A[i01 * 3] * w01 + A[i10 * 3] * w10 + A[i11 * 3] * w11;
                        g = A[i00 * 3 + 1] * w00 + A[i01 * 3 + 1] * w01 + A[i10 * 3 + 1] * w10 + A[i11 * 3 + 1] * w11;
                        b = A[i00 * 3 + 2] * w00 + A[i01 * 3 + 2] * w01 + A[i10 * 3 + 2] * w10 + A[i11 * 3 + 2] * w11;
                    }
                }
                const o = (j2 * iw + i2) * 4;
                // 暗底（深藍綠）＋光
                d8[o] = enc(0.004 + r); d8[o + 1] = enc(0.010 + g); d8[o + 2] = enc(0.016 + b); d8[o + 3] = 255;
            }
        }
        off.ctx.putImageData(img, 0, 0);
        ctx.save();
        ctx.imageSmoothingEnabled = true;
        ctx.drawImage(off.canvas, 0, 0, iw, ih, 0, 0, iw * step, ih * step);
        ctx.restore();
        // 平面外框
        const rim = [[-XI, -WV, 0], [LV, -WV, 0], [LV, WV, 0], [-XI, WV, 0]].map(cam.project);
        if (rim.every((q) => q[2] > 0.4)) {
            ctx.strokeStyle = 'rgba(18,49,58,0.35)'; ctx.lineWidth = 1;
            ctx.beginPath(); rim.forEach((q, i) => (i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]))); ctx.closePath(); ctx.stroke();
        }

        paintList(upper);

        /* ---------- 尺寸標示與文字 ---------- */
        const P = cam.project;
        const ok = (...q) => q.every((a) => a[2] > 0.4);
        const seg = (a, b, col, lw, dash) => {
            const A = P(a), B = P(b);
            if (!ok(A, B)) return;
            ctx.save(); if (dash) ctx.setLineDash(dash);
            ctx.strokeStyle = col; ctx.lineWidth = lw || 1.4;
            ctx.beginPath(); ctx.moveTo(A[0], A[1]); ctx.lineTo(B[0], B[1]); ctx.stroke(); ctx.restore();
        };
        const tag = (q, text, col, dx = 0, dy = 0, align = 'center') => {
            const A = P(q);
            if (!ok(A)) return;
            labelFit(ctx, text, A[0] + dx, A[1] + dy, col, 11, align, { plate: 'rgba(255,255,255,0.86)', clampW: w, maxW: w * 0.42, min: 9 });
        };
        // 縫距 d 或縫寬 a（畫在板子上緣之上）
        const zT = PH + 0.45;
        const nSl = far ? cfg.N : cfg.slits.length;
        if (far) { /* 遠看：尺寸畫在左上的放大圖 */ }
        else if (cfg.slits.length >= 2) {
            const ya = cfg.slits[0], yb = cfg.slits[cfg.slits.length - 1];
            seg([0, ya, zT], [0, yb, zT], C.orange, 1.6);
            seg([0, ya, zT - 0.25], [0, ya, zT + 0.25], C.orange, 1.6);
            seg([0, yb, zT - 0.25], [0, yb, zT + 0.25], C.orange, 1.6);
            tag([0, (ya + yb) / 2, zT + 0.35], 'd', C.orange, 0, -2);
        } else {
            const ya = cfg.slits[0] - cfg.a / 2, yb = cfg.slits[0] + cfg.a / 2;
            seg([0, ya, zT], [0, yb, zT], C.orange, 1.6);
            seg([0, ya, zT - 0.25], [0, ya, zT + 0.25], C.orange, 1.6);
            seg([0, yb, zT - 0.25], [0, yb, zT + 0.25], C.orange, 1.6);
            tag([0, (ya + yb) / 2, zT + 0.35], 'a', C.orange, 0, -2);
        }
        // L
        seg([0, -WV - 0.6, 0], [LV, -WV - 0.6, 0], C.muted, 1.2, [5, 4]);
        tag([LV * 0.5, -WV - 0.6, 0], far ? 'L ≫ d（實際約一萬倍）' : 'L（縮短示意）', C.muted, 0, 14);
        tag([-XI - 0.15, 0, PH * 0.55 + 0.35], '平行光', C.ink, 0, -4);
        tag([0, WV, PH], nSl >= 2 ? (nSl === 2 ? '雙狹縫' : `${nSl} 條狹縫`) : '單狹縫', C.ink, 0, -6);
        if (far) {
            seg([0, 0, SH + 0.1], [0, 0, PH + 1.1], C.orange, 1.2);
            tag([0, 0, PH + 1.3], '狹縫在這裡（太小，看左下放大圖）', C.orange, 0, -2);
            ctx.font = '11px Outfit, "Noto Sans TC", sans-serif';
            const nLines = [].concat(...(cfg.notes || []).map((t) => wrapText(ctx, t, w - 24))).length;
            drawSlitInset(ctx, w, cfg, h - 8 - nLines * 14 - 8);
        }
        tag([LV, -WV, -PH], '屏幕', C.ink, 0, 16);
        if (cfg.curve) tag([LV, WV, PH + 0.35 + 2.4], '強度', C.muted, 0, -6);

        /* 標題與說明（固定在畫布上，不隨視角移動） */
        const tw = w - 20;
        labelFit(ctx, cfg.title, 10, 18, C.ink, 12, 'left', { maxW: tw, min: 10, plate: 'rgba(238,243,245,0.9)', clampW: w });
        labelFit(ctx, '拖曳旋轉・滾輪或雙指縮放', 10, 34, C.muted, 10, 'left', { maxW: tw, min: 9, plate: 'rgba(238,243,245,0.9)', clampW: w });
        // 底部說明：放不下就換行（不截字），先量出總行數再由下往上排
        const notes = cfg.notes || [];
        ctx.font = '11px Outfit, "Noto Sans TC", sans-serif';
        const noteLines = [].concat(...notes.map((s) => wrapText(ctx, s, tw - 4)));
        let ny = h - 8 - (noteLines.length - 1) * 14;
        ctx.fillStyle = 'rgba(238,243,245,0.92)';
        ctx.fillRect(6, ny - 13, w - 12, noteLines.length * 14 + 6);
        noteLines.forEach((ln) => { label(ctx, ln, 10, ny, C.ink, 11); ny += 14; });
    }

    /* 遠看時的狹縫放大圖：真實的 d、a 和 L 相比小到看不見，另外畫在左上角 */
    function drawSlitInset(ctx, w, cfg, yBottom) {
        // 放在左下角、底部說明的上方（那裡通常是空白，不會蓋住狹縫板與屏幕的標示）
        const narrow = w < 560;
        const N = cfg.N, bw = narrow ? 150 : Math.min(210, Math.max(160, w * 0.26)), bh = narrow ? 100 : 118, x0 = 10, y0 = Math.max(44, yBottom - bh);
        ctx.fillStyle = 'rgba(255,255,255,0.94)'; ctx.fillRect(x0, y0, bw, bh);
        ctx.strokeStyle = 'rgba(201,117,15,0.6)'; ctx.lineWidth = 1; ctx.strokeRect(x0, y0, bw, bh);
        labelFit(ctx, '狹縫放大圖', x0 + 6, y0 + 14, C.orange, 11, 'left', { maxW: bw - 12, min: 9 });
        const px = x0 + 46, top = y0 + 24, bot = y0 + bh - 26, span = bot - top;
        for (let i = 0; i < 3; i++) arrow(ctx, x0 + 6, top + span * (i + 0.5) / 3, px - 8, top + span * (i + 0.5) / 3, 'rgba(11,111,146,0.55)', 1.2);
        ctx.fillStyle = '#3b5a66'; ctx.fillRect(px - 3, top - 4, 6, span + 8);
        const cy = (top + bot) / 2;
        if (N <= 1) {
            const g = Math.max(4, Math.min(span * 0.6, cfg.al * 10));
            ctx.fillStyle = '#fff'; ctx.fillRect(px - 4, cy - g / 2, 8, g);
        } else {
            const gap = span * 0.9 / (N - 1), sw = Math.max(1, Math.min(gap * 0.5, (cfg.al / cfg.dl) * gap));
            ctx.fillStyle = '#fff';
            for (let i = 0; i < N; i++) ctx.fillRect(px - 4, cy - span * 0.45 + i * gap - sw / 2, 8, sw);
            if (N <= 12) {
                ctx.strokeStyle = C.orange; ctx.lineWidth = 1.1;
                const ya = cy - span * 0.45, yb = ya + gap;
                ctx.beginPath(); ctx.moveTo(px - 10, ya); ctx.lineTo(px - 10, yb); ctx.stroke();
                label(ctx, 'd', px - 13, (ya + yb) / 2 + 4, C.orange, 10, 'right');
            }
        }
        // 往屏幕的光：從每條縫出發、互相平行
        const th = 0.32, L = bw - (px - x0) - 14;
        ctx.save(); ctx.beginPath(); ctx.rect(px, y0 + 20, bw - (px - x0) - 4, bh - 38); ctx.clip();
        ctx.strokeStyle = 'rgba(194,38,74,0.75)'; ctx.lineWidth = 1;
        const k = Math.max(1, Math.ceil(N / 8));
        for (let i = 0; i < Math.max(1, N); i += k) {
            const y = N <= 1 ? cy : cy - span * 0.45 + i * span * 0.9 / (N - 1);
            ctx.beginPath(); ctx.moveTo(px + 3, y); ctx.lineTo(px + 3 + L * Math.cos(th), y - L * Math.sin(th)); ctx.stroke();
        }
        ctx.restore();
        const info = N <= 1 ? `a = ${cfg.al} λ₀` : `N = ${N}，d = ${cfg.dl} λ₀，a = ${cfg.al} λ₀`;
        labelFit(ctx, info, x0 + 6, y0 + bh - 12, C.ink, 10, 'left', { maxW: bw - 12, min: 8 });
        labelFit(ctx, '到屏幕的光幾乎平行', x0 + bw - 6, y0 + 14, 'rgba(194,38,74,0.9)', 10, 'right', { maxW: bw - 80, min: 8 });
    }

    /* 依寬度換行：優先在「，；→」之後斷開（不截字、不切斷數字） */
    function wrapText(ctx, text, maxW) {
        const out = [];
        let cur = '';
        for (const ch of String(text)) {
            if (ctx.measureText(cur + ch).width <= maxW || !cur) { cur += ch; continue; }
            let cut = Math.max(cur.lastIndexOf('，'), cur.lastIndexOf('；'), cur.lastIndexOf('→'), cur.lastIndexOf('：'));
            if (cut < cur.length * 0.45) {
                cut = cur.length - 1;
                while (cut > 0 && /[0-9A-Za-z.=λ₀₁₂ ]/.test(cur[cut]) && /[0-9A-Za-z.=λ₀₁₂ ]/.test(cur[cut - 1])) cut--;
                if (cut <= 0) cut = cur.length - 1;
                out.push(cur.slice(0, cut)); cur = cur.slice(cut) + ch;
            } else { out.push(cur.slice(0, cut + 1)); cur = cur.slice(cut + 1) + ch; }
        }
        if (cur) out.push(cur);
        return out;
    }

    /* 3D 視圖的拖曳旋轉與縮放（只有在 isOn(params) 為真時接管指標） */
    function bind3D({ canvas, params, disposers, paint, host }, isOn) {
        const pts = new Map();
        let last = null, pinch = null;
        const local = (e) => { const r = canvas.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
        const syncTouch = () => { canvas.style.touchAction = isOn(params) ? 'none' : ''; canvas.style.cursor = isOn(params) ? 'grab' : ''; };
        if (host) host.querySelectorAll('[data-mode]').forEach((b) => disposers.addEventListener(b, 'click', syncTouch));
        syncTouch();
        disposers.addEventListener(canvas, 'pointerdown', (e) => {
            if (!isOn(params)) return;
            pts.set(e.pointerId, local(e));
            if (pts.size === 2) {
                const [a, b] = [...pts.values()];
                pinch = { d: Math.hypot(a[0] - b[0], a[1] - b[1]), z: viewOf(params).zoom };
                last = null;
            } else last = local(e);
            canvas.style.cursor = 'grabbing';
            try { canvas.setPointerCapture(e.pointerId); } catch (_) { /* 不支援時略過 */ }
        });
        disposers.addEventListener(canvas, 'pointermove', (e) => {
            if (!isOn(params) || !pts.has(e.pointerId)) return;
            const pt = local(e);
            pts.set(e.pointerId, pt);
            const v = viewOf(params);
            if (pts.size >= 2 && pinch) {
                const [a, b] = [...pts.values()];
                const d = Math.hypot(a[0] - b[0], a[1] - b[1]);
                v.zoom = Math.max(0.5, Math.min(2.6, pinch.z * d / Math.max(pinch.d, 1)));
                paint(); return;
            }
            if (!last) { last = pt; return; }
            v.yaw -= (pt[0] - last[0]) * 0.008;
            v.pitch = Math.max(0.08, Math.min(1.5, v.pitch + (pt[1] - last[1]) * 0.008));
            last = pt; paint();
        });
        const end = (e) => {
            pts.delete(e.pointerId);
            if (pts.size < 2) pinch = null;
            if (!pts.size) { last = null; canvas.style.cursor = isOn(params) ? 'grab' : ''; }
        };
        disposers.addEventListener(canvas, 'pointerup', end);
        disposers.addEventListener(canvas, 'pointercancel', end);
        disposers.addEventListener(canvas, 'wheel', (e) => {
            if (!isOn(params)) return;
            e.preventDefault();
            const v = viewOf(params);
            v.zoom = Math.max(0.5, Math.min(2.6, v.zoom * Math.exp(-e.deltaY * 0.0012)));
            paint();
        }, { passive: false });
    }

    /* ======================================================================
     * 各實驗的模式：雙狹縫多波長、單狹縫多波長、3D、多狹縫 → 單狹縫
     * ====================================================================== */
    const mm = (m) => `${(m * 1000).toFixed(2)} mm`;
    const sinT = (y, L) => y / Math.hypot(y, L);
    const sinc2 = (b) => { if (Math.abs(b) < 1e-7) return 1; const s = Math.sin(b) / b; return s * s; };
    const lumOf = (c) => 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];

    /* 白光分開看：把光譜切成幾個色段，每段各畫一條色帶 */
    const WHITE_BANDS = [[400, 440, '紫'], [440, 485, '藍'], [485, 530, '青綠'], [530, 575, '綠黃'], [575, 620, '橙'], [620, 701, '紅']];
    const whiteGroups = (lines) => WHITE_BANDS.map(([a, b, nm]) => ({
        name: `${nm} ${a}–${Math.min(b, 700)} nm`, lines: lines.filter((L) => L.mix !== false && L.lam >= a && L.lam < b)
    }));

    /* ---- 雙狹縫：多波長疊加（實際單位） ---- */
    function youngColorInfo(p) {
        const d = p.d * 1e-6, L = p.L;
        const dy = (l) => L * l * 1e-9 / d;
        const src = p.src;
        if (src === 'two') {
            const l1 = Number(p.lam1), l2 = Number(p.lam2);
            const co = l1 === l2 ? null : coincide(l1, l2, 12);
            return { d, L, dy, src, l1, l2, co, yco: co ? co.n1 * dy(l1) : null };
        }
        return { d, L, dy, src, lam: Number(p.lam), s: Number(p.shift) || 0 };
    }
    function youngColors(ctx, w, h, p) {
        const q = youngColorInfo(p), { d, L, dy } = q;
        const I = (l, ph = 0) => (y) => { const c = Math.cos(Math.PI * d * sinT(y, L) / (l * 1e-9) - ph); return c * c; };
        const orders = (l, col, Y) => {
            const out = [];
            for (let n = 1; n * dy(l) <= Y * 1.02 && n < 40; n++) out.push({ y: n * dy(l), col }, { y: -n * dy(l), col });
            return out;
        };
        let opt;
        if (q.src === 'two') {
            const { l1, l2, co } = q, lmax = Math.max(l1, l2);
            let Y = 3.4 * dy(lmax);
            const cap = 9.5 * dy(lmax);
            if (co && co.n1 * dy(l1) * 1.15 <= cap) Y = Math.max(Y, co.n1 * dy(l1) * 1.15);
            const I1 = I(l1), I2 = I(l2);
            const vl = [];
            if (co && co.n1 * dy(l1) <= Y) {
                vl.push({ y: co.n1 * dy(l1), col: C.rose, text: `λ₁ 第 ${co.n1} 亮紋 ＝ λ₂ 第 ${co.n2} 亮紋${co.exact ? '' : '（幾乎）'}` });
                vl.push({ y: -co.n1 * dy(l1), col: C.rose });
            }
            opt = {
                Y, axisMax: 2,
                lines: [{ lam: l1, c: pure(l1), I: I1, curve: 'solid' }, { lam: l2, c: pure(l2), I: I2, curve: 'solid' }],
                total: { fn: (y) => I1(y) + I2(y) },
                marks: orders(l1, ink(l1), Y).concat(orders(l2, ink(l2), Y)),
                vlines: vl,
                legend: [{ text: `λ₁ = ${l1} nm 的 I₁`, col: ink(l1) }, { text: `λ₂ = ${l2} nm 的 I₂`, col: ink(l2) }, { text: '合成 I₁ + I₂', col: C.ink, lw: 2.6 }],
                groups: [{ name: `λ₁ = ${l1} nm 單獨`, lines: [{ lam: l1, c: pure(l1), I: I1 }] }, { name: `λ₂ = ${l2} nm 單獨`, lines: [{ lam: l2, c: pure(l2), I: I2 }] }],
                foot: [
                    '兩種顏色頻率不同，相位差一直在變，彼此不會產生穩定干涉：各自形成條紋，屏幕上「強度相加」。',
                    co ? `中央 n = 0 兩色都是亮紋（混色）；往外第一次重合在 n₁λ₁ = n₂λ₂ = ${Math.round(co.path)} nm 的光程差處。`
                        : (l1 === l2 ? '兩個波長相同：兩組條紋完全重合。' : '在前 12 級內沒有完全重合的亮紋：除了中央以外，兩色亮紋永遠錯開。')
                ]
            };
        } else if (q.src === 'white') {
            const sp = spectrum('white', p, 31);
            const lines = sp.map((s) => ({ lam: s.lam, c: s.c, I: I(s.lam), curve: false }));
            const Ysum = sp.reduce((a, s) => a + lumOf(s.c), 0);
            const Y = 4.2 * dy(550);
            [450, 550, 650].forEach((l) => lines.push({ lam: l, c: [0, 0, 0], I: I(l), curve: 'solid', mix: false, lw: 1.1, col: ink(l, 0.55) }));
            const bands = [];
            [1, -1].forEach((sg) => {
                const a = sg * dy(400), b = sg * dy(700);
                bands.push({ y0: Math.min(a, b), y1: Math.max(a, b), col: 'rgba(107,70,193,0.08)', text: sg > 0 ? '第 1 級：內紫外紅' : '', row: 0 });
                const c1 = sg * 3 * dy(400), c2 = sg * 2 * dy(700);
                bands.push({ y0: Math.min(c1, c2), y1: Math.max(c1, c2), col: 'rgba(194,38,74,0.10)', text: sg > 0 ? '2、3 級開始重疊' : '', tcol: C.rose, row: 1 });
            });
            opt = {
                Y, axisMax: 1, lines, bands, groups: whiteGroups(lines),
                total: { fn: (y) => sp.reduce((a, s) => a + lumOf(s.c) * I(s.lam)(y), 0) / Ysum },
                legend: [{ text: '450／550／650 nm 各自的 I', col: 'rgba(18,49,58,0.45)', lw: 1.2 }, { text: '白光合成亮度', col: C.ink, lw: 2.6 }],
                foot: [
                    '中央 n = 0：每一色的光程差都是 0，全部亮 → 白色。往外 Δy ∝ λ：紫光的亮紋離中央最近、紅光最遠。',
                    '第 2 級紅光（2 × 700 = 1400 nm）已超過第 3 級紫光（3 × 400 = 1200 nm）：級次互相重疊，顏色混雜、條紋變模糊。'
                ]
            };
        } else if (q.src === 'pair') {
            const l = q.lam, s = q.s, IA = I(l), IB = I(l, Math.PI * s);
            const Y = 3.4 * dy(l);
            opt = {
                Y, axisMax: 2,
                lines: [{ lam: l, c: pure(l), I: IA, curve: 'solid' }, { lam: l, c: pure(l), I: IB, curve: 'dash' }],
                total: { fn: (y) => IA(y) + IB(y) },
                marks: orders(l, ink(l), Y),
                legend: [{ text: '光源 A 的條紋', col: ink(l) }, { text: '光源 B（平移 ' + s.toFixed(2) + ' Δy）', col: ink(l), dash: true }, { text: '合成 I_A + I_B', col: C.ink, lw: 2.6 }],
                groups: [{ name: '只開光源 A', lines: [{ lam: l, c: pure(l), I: IA }] }, { name: '只開光源 B', lines: [{ lam: l, c: pure(l), I: IB }] }],
                foot: [
                    '兩盞燈各自發光，彼此沒有固定相位差：各自在屏幕上形成條紋，再把強度相加。',
                    s > 0.45 && s < 0.55 ? '平移半個 Δy：A 的亮紋剛好落在 B 的暗紋上，條紋完全消失（一片均勻）。'
                        : '兩組條紋錯開愈多，亮暗對比愈差。光源太寬（許多點光源）也是同一回事 → 楊氏用 S₀ 單狹縫讓光源變「窄」。'
                ]
            };
        } else {
            const l = q.lam, Y = 3.4 * dy(l);
            opt = {
                Y, axisMax: 1, lines: [{ lam: l, c: pure(l), I: I(l), curve: 'solid' }],
                marks: orders(l, ink(l), Y),
                legend: [{ text: `λ = ${l} nm`, col: ink(l) }],
                foot: ['對照組：單一顏色時，中央附近亮紋等間距 Δy = Lλ/d（忽略單縫包絡）。改選雙色或白光，比較兩組條紋怎麼疊在一起。']
            };
        }
        opt.layout = p.layout;
        draw2D(ctx, w, h, opt);
    }
    function youngColorReadouts(p) {
        const q = youngColorInfo(p), { dy } = q;
        if (q.src === 'two') {
            return [
                { label: 'Δy₁ = Lλ₁/d', value: mm(dy(q.l1)) },
                { label: 'Δy₂ = Lλ₂/d', value: mm(dy(q.l2)) },
                { label: '第一次亮紋重合', value: q.co ? `λ₁ 第 ${q.co.n1} 亮 ＝ λ₂ 第 ${q.co.n2} 亮，y = ${mm(q.yco)}` : (q.l1 === q.l2 ? '兩波長相同' : '前 12 級內沒有') },
                { label: '疊加方式', value: 'I = I₁ + I₂（強度相加）' }
            ];
        }
        if (q.src === 'white') {
            return [
                { label: '中央 n = 0', value: '各色重合 → 白色' },
                { label: '第 1 級光譜', value: `紫 ${mm(dy(400))} → 紅 ${mm(dy(700))}` },
                { label: '級次重疊', value: '第 2 級紅 1400 nm > 第 3 級紫 1200 nm' },
                { label: '遠離中央', value: '各色混雜 → 條紋模糊、偏白' }
            ];
        }
        if (q.src === 'pair') {
            const V = Math.abs(Math.cos(Math.PI * q.s));
            return [
                { label: '兩組條紋錯開', value: `${q.s.toFixed(2)} Δy = ${mm(q.s * dy(q.lam))}` },
                { label: '亮暗對比 (I_max−I_min)/(I_max+I_min)', value: `${(V * 100).toFixed(0)}%` },
                { label: '疊加方式', value: 'I = I_A + I_B（兩光源不同調）' },
                { label: 'Δy = Lλ/d', value: mm(dy(q.lam)) }
            ];
        }
        return [
            { label: 'Δy = Lλ/d', value: mm(dy(q.lam)) },
            { label: '第 1 亮紋', value: `y = ±${mm(dy(q.lam))}` },
            { label: '中央亮紋', value: '只有 1 條（n = 0）' },
            { label: '下一步', value: '改選雙色或白光比較' }
        ];
    }

    /* ---- 單狹縫：多波長疊加（實際單位） ---- */
    function singleColorInfo(p) {
        const a = p.a * 1e-6, L = p.L;
        const y1 = (l) => L * l * 1e-9 / a;
        if (p.src === 'two') {
            const l1 = Number(p.lam1), l2 = Number(p.lam2);
            const co = l1 === l2 ? null : coincide(l1, l2, 12);
            return { a, L, y1, src: 'two', l1, l2, co, yco: co ? co.n1 * y1(l1) : null };
        }
        return { a, L, y1, src: p.src, lam: Number(p.lam) };
    }
    function singleColors(ctx, w, h, p) {
        const q = singleColorInfo(p), { a, L, y1 } = q;
        const I = (l) => (y) => sinc2(Math.PI * a * sinT(y, L) / (l * 1e-9));
        const darks = (l, col, Y) => {
            const out = [];
            for (let m = 1; m * y1(l) <= Y * 1.02 && m < 30; m++) out.push({ y: m * y1(l), col }, { y: -m * y1(l), col });
            return out;
        };
        let opt;
        if (q.src === 'two') {
            const { l1, l2, co } = q, lmax = Math.max(l1, l2);
            let Y = 3.4 * y1(lmax);
            const cap = 8 * y1(lmax);
            if (co && co.n1 * y1(l1) * 1.15 <= cap) Y = Math.max(Y, co.n1 * y1(l1) * 1.15);
            const I1 = I(l1), I2 = I(l2);
            const vl = [];
            if (co && co.n1 * y1(l1) <= Y) {
                vl.push({ y: co.n1 * y1(l1), col: C.rose, text: `λ₁ 第 ${co.n1} 暗紋 ＝ λ₂ 第 ${co.n2} 暗紋${co.exact ? '' : '（幾乎）'}` });
                vl.push({ y: -co.n1 * y1(l1), col: C.rose });
            }
            opt = {
                Y, axisMax: 2,
                lines: [{ lam: l1, c: pure(l1), I: I1, curve: 'solid' }, { lam: l2, c: pure(l2), I: I2, curve: 'solid' }],
                total: { fn: (y) => I1(y) + I2(y) }, vlines: vl,
                marks: darks(l1, ink(l1), Y).concat(darks(l2, ink(l2), Y)),
                legend: [{ text: `λ₁ = ${l1} nm`, col: ink(l1) }, { text: `λ₂ = ${l2} nm`, col: ink(l2) }, { text: '合成 I₁ + I₂', col: C.ink, lw: 2.6 }],
                groups: [{ name: `λ₁ = ${l1} nm 單獨`, lines: [{ lam: l1, c: pure(l1), I: I1 }] }, { name: `λ₂ = ${l2} nm 單獨`, lines: [{ lam: l2, c: pure(l2), I: I2 }] }],
                foot: [
                    '三角形是各色的暗紋 a sinθ = mλ。兩色不同調，屏幕上強度相加：某色的暗紋處，只剩另一色的光。',
                    `中央亮紋寬 2Lλ/a：λ₁ ${mm(2 * y1(l1))}、λ₂ ${mm(2 * y1(l2))}，波長長的中央亮紋比較寬。`
                ]
            };
        } else if (q.src === 'white') {
            const sp = spectrum('white', p, 31);
            const lines = sp.map((s) => ({ lam: s.lam, c: s.c, I: I(s.lam), curve: false }));
            const Ysum = sp.reduce((acc, s) => acc + lumOf(s.c), 0);
            [450, 550, 650].forEach((l) => lines.push({ lam: l, c: [0, 0, 0], I: I(l), curve: 'solid', mix: false, lw: 1.1, col: ink(l, 0.55) }));
            const bands = [];
            [1, -1].forEach((sg) => {
                const lo = sg * y1(400), hi = sg * y1(700);
                bands.push({ y0: Math.min(lo, hi), y1: Math.max(lo, hi), col: 'rgba(194,38,74,0.09)', text: sg > 0 ? '紫已暗、紅仍亮 → 偏紅' : '', tcol: C.rose });
            });
            opt = {
                Y: 3.6 * y1(550), axisMax: 1, lines, bands, groups: whiteGroups(lines),
                total: { fn: (y) => sp.reduce((acc, s) => acc + lumOf(s.c) * I(s.lam)(y), 0) / Ysum },
                legend: [{ text: '450／550／650 nm 各自的 I', col: 'rgba(18,49,58,0.45)', lw: 1.2 }, { text: '白光合成亮度', col: C.ink, lw: 2.6 }],
                foot: [
                    '中央（θ = 0）每一色都最亮 → 白色。紫光的第一暗紋 Lλ/a 最靠近中央，紅光最遠：中央亮紋邊緣偏紅、外側出現彩色。',
                    '側亮紋本來就暗，又被各色錯開，所以白光的單狹縫只看得到一條明顯的白色中央亮紋。'
                ]
            };
        } else {
            const l = q.lam;
            opt = {
                Y: 3.4 * y1(l), axisMax: 1, lines: [{ lam: l, c: pure(l), I: I(l), curve: 'solid' }],
                marks: darks(l, ink(l), 3.4 * y1(l)),
                legend: [{ text: `λ = ${l} nm`, col: ink(l) }],
                foot: ['對照組：三角形是暗紋 a sinθ = mλ；中央亮紋寬 2Lλ/a，是側亮紋的兩倍。改選雙色或白光比較。']
            };
        }
        opt.compress = 0.55;
        opt.layout = p.layout;
        if (p.layout === 'merge' || !opt.groups) opt.title = '屏幕上看到的條紋（各色強度相加；亮度已壓縮，看得出暗淡的側亮紋）';
        draw2D(ctx, w, h, opt);
    }
    function singleColorReadouts(p) {
        const q = singleColorInfo(p), { y1 } = q;
        if (q.src === 'two') {
            return [
                { label: '中央寬 2Lλ₁/a', value: mm(2 * y1(q.l1)) },
                { label: '中央寬 2Lλ₂/a', value: mm(2 * y1(q.l2)) },
                { label: '第一次暗紋重合', value: q.co ? `λ₁ 第 ${q.co.n1} 暗 ＝ λ₂ 第 ${q.co.n2} 暗，y = ${mm(q.yco)}` : (q.l1 === q.l2 ? '兩波長相同' : '前 12 級內沒有') },
                { label: '疊加方式', value: 'I = I₁ + I₂（強度相加）' }
            ];
        }
        if (q.src === 'white') {
            return [
                { label: '中央', value: '各色都最亮 → 白色' },
                { label: '第一暗紋', value: `紫 ${mm(y1(400))} → 紅 ${mm(y1(700))}` },
                { label: '中央亮紋邊緣', value: '偏紅（紅光的中央亮紋最寬）' },
                { label: '側亮紋', value: '暗且彩色、互相重疊' }
            ];
        }
        return [
            { label: '第一暗紋 Lλ/a', value: mm(y1(q.lam)) },
            { label: '中央亮紋寬 2Lλ/a', value: mm(2 * y1(q.lam)) },
            { label: '暗紋', value: 'a sinθ = mλ（m = 1, 2, …）' },
            { label: '下一步', value: '改選雙色或白光比較' }
        ];
    }

    /* ---- 3D ---- */
    const src3Lines = (p) => {
        const L = spectrum(p.src3, p, 16);
        if (p.src3 === 'two' && p.comp3 === 'l1') return [L[0]];
        if (p.src3 === 'two' && p.comp3 === 'l2') return [L[1]];
        return L;
    };
    const lamText = (p) => p.src3 === 'white' ? '白光' : p.src3 === 'two'
        ? (p.comp3 === 'l1' ? `只看 λ₁ = ${p.lam1} nm` : p.comp3 === 'l2' ? `只看 λ₂ = ${p.lam2} nm` : `${p.lam1} + ${p.lam2} nm 合併`) : `${p.lam} nm`;
    function young3D(ctx, w, h, p, t, holder) {
        const far = p.scale3 !== 'near';
        const Nset = Math.max(2, Math.round(p.n3 || 2));
        const N = far ? Nset : Math.min(Nset, 8);           // 近看要逐點算波，縫太多算不動也放不下
        const dv = p.dl * LAM0, av = Math.min(p.al * LAM0, dv * 0.95);
        let slits = [];
        for (let i = 0; i < N; i++) slits.push((i - (N - 1) / 2) * dv);
        const oneOpen = p.open3 === 'one';
        if (oneOpen) slits = [slits[0]];
        const instantOk = p.src3 !== 'white';
        const notes = far ? [
            oneOpen ? '只開一條縫：只剩單縫繞射的寬亮帶。打開所有縫，同一道光振幅相加 → 寬亮帶裡出現亮紋。'
                : `遠看：d 比 L 小很多，從各縫到屏幕同一點的光幾乎平行，所以亮紋只由方向決定：d sinθ = nλ。${Nset > 2 ? `N = ${Nset}：縫愈多，亮紋愈細愈銳利。` : ''}`,
            '水平面畫的是平均亮度（波長太小，瞬間的波看不出來）；想看波怎麼疊加，「比例」切到「近看」。'
        ] : [
            oneOpen ? '只開一條縫：屏幕上只有單縫繞射的寬亮帶，沒有細條紋。把縫都打開，亮度不是兩個單縫相加，而是振幅相加 → 出現亮暗條紋（同一道光、同調）。'
                : '狹縫沿上下很長，每個高度的光干涉情形都一樣 → 屏幕上是與狹縫平行的「直條紋」。',
            !instantOk && p.show3 === 'instant' ? '白光各色頻率不同，瞬間圖沒有意義，這裡改畫平均亮度。'
                : p.src3 === 'two' ? (p.comp3 && p.comp3 !== 'all' ? '分開看：這是其中一色單獨形成的條紋；切回「合併」，兩色的亮度直接相加。' : '兩色頻率不同、各走各的：各自形成條紋，亮度相加，不會互相干涉。')
                    : (p.show3 === 'instant' ? '水平面上：從縫放射出去、一直亮著的線是腹線，打到屏幕就是亮紋。' : '平均亮度：從縫放射出去的亮帶，就是屏幕上亮紋的來源。')
        ];
        if (!far && Nset > 8) notes[1] = `近看最多畫 8 條縫（設定 ${Nset} 條）；要看 100 條縫，「比例」切到「遠看：L ≫ d」。`;
        draw3D(ctx, w, h, p, t, {
            far, N: oneOpen ? 1 : N, dl: p.dl, al: Math.min(p.al, p.dl * 0.95),
            slits, a: av, lines: src3Lines(p), show: p.show3, curve: !!p.curve, nsMax: 6,
            cache: holder._f3, store: (r) => { holder._f3 = r; },
            title: `3D${far ? '（遠看：L ≫ d）' : '（近看：放大示意）'}：${oneOpen ? '只開 1 條縫' : (N === 2 ? '雙' : N + ' 條') + '狹縫'}，${lamText(p)}`,
            notes
        });
    }
    function young3DReadouts(p) {
        const lam = p.src3 === 'white' ? 550 : p.src3 === 'two' ? Number(p.lam1) : Number(p.lam);
        const r = lam / 550;
        const th1 = r / p.dl <= 1 ? Math.asin(r / p.dl) * 180 / Math.PI : null;
        const a = Math.min(p.al, p.dl * 0.95);
        const env = r / a <= 1 ? Math.asin(r / a) * 180 / Math.PI : null;
        const N = Math.max(2, Math.round(p.n3 || 2));
        return [
            { label: '條紋形狀', value: '直條紋（與狹縫平行）' },
            { label: `第 1 亮紋方向 d sinθ = λ${p.src3 === 'two' ? '₁' : ''}`, value: th1 === null ? '無（d < λ）' : `θ₁ = ${th1.toFixed(1)}°` },
            { label: '單縫包絡第一暗紋 a sinθ = λ', value: env === null ? '無（a < λ）：包絡很寬' : `θ = ${env.toFixed(1)}°` },
            { label: '縫數 N', value: p.open3 === 'one' ? '只開 1 條：單縫繞射，沒有細條紋' : N === 2 ? '2（雙狹縫）' : `${N}：主亮紋寬約 2/N，之間有 ${N - 1} 個暗紋、${N - 2} 個小亮紋${p.scale3 === 'near' && N > 8 ? '（近看只畫 8 條）' : ''}` }
        ];
    }
    function single3D(ctx, w, h, p, t, holder) {
        const av = p.aw3 * LAM0;
        const far = p.scale3 !== 'near';
        draw3D(ctx, w, h, p, t, {
            far, N: 1, dl: 0, al: p.aw3,
            slits: [0], a: av, lines: src3Lines(p), show: p.show3, curve: !!p.curve, nsMax: 26,
            cache: holder._f3, store: (r) => { holder._f3 = r; },
            title: `3D${far ? '（遠看：L ≫ a）' : '（近看：放大示意）'}：單狹縫，${lamText(p)}（a = ${p.aw3} λ₀）`,
            notes: far ? [
                '遠看：縫寬 a 比 L 小很多，亮度只由方向決定；a sinθ = mλ 的方向是暗紋，中央亮帶最寬最亮。',
                '水平面畫的是平均亮度；想看縫上各點的子波怎麼疊加，「比例」切到「近看」。'
            ] : [
                '縫上每一點都發出子波（惠更斯）；縫沿上下很長，所以屏幕上同樣是直條紋。',
                p.src3 === 'white' && p.show3 === 'instant' ? '白光各色頻率不同，瞬間圖沒有意義，這裡改畫平均亮度。'
                    : 'a 愈小，中央亮帶張得愈開；a sinθ = λ 的方向子波成對抵消，是第一暗紋。'
            ]
        });
    }
    function single3DReadouts(p) {
        const lam = p.src3 === 'white' ? 550 : p.src3 === 'two' ? Number(p.lam1) : Number(p.lam);
        const r = lam / 550 / p.aw3;
        const th = r <= 1 ? Math.asin(r) * 180 / Math.PI : null;
        return [
            { label: '條紋形狀', value: '直條紋（與狹縫平行）' },
            { label: `第一暗紋 a sinθ = λ${p.src3 === 'two' ? '₁' : ''}`, value: th === null ? '無：a < λ，光幾乎向各方向展開' : `θ₁ = ${th.toFixed(1)}°` },
            { label: '中央亮紋的角寬', value: th === null ? '—' : `2θ₁ = ${(2 * th).toFixed(1)}°` },
            { label: '操作', value: '拖曳旋轉；「視角」可快速切換' }
        ];
    }

    /* ---- 多狹縫 → 單狹縫：相量（箭頭）相加 ----
     * 寬 a 的縫 =「N 條等間距細縫」的極限。相鄰兩縫在 θ 方向的光程差 d sinθ、相位差 δ = 2π d sinθ / λ。
     * 每條縫的波用一根等長箭頭表示，箭頭依序轉 δ、頭尾相接；合成箭頭長度就是振幅。
     *   N 條：I/I_max = [sin(Nδ/2) / (N sin(δ/2))]²
     *   固定總寬 a、d = a/N：N δ = 2π a sinθ / λ，N → ∞ 時趨近單狹縫 sinc²(π a sinθ/λ)。 */
    function multiInfo(p) {
        const N = Math.max(1, Math.round(p.mN));
        const fill = p.mkind !== 'grating';
        const d = fill ? p.ma / N : p.md;          // 以 λ 為單位
        const aTot = fill ? p.ma : p.md * N;
        const s = Math.sin(p.mth * Math.PI / 180);
        const delta = 2 * Math.PI * d * s;
        const amp = (dl) => {
            const h2 = dl / 2;
            if (Math.abs(Math.sin(h2)) < 1e-9) return 1;
            return Math.sin(N * h2) / (N * Math.sin(h2));
        };
        return { N, fill, d, aTot, s, delta, amp, I: amp(delta) ** 2, Isl: sinc2(Math.PI * aTot * s) };
    }
    function multiDraw(ctx, w, h, p) {
        const q = multiInfo(p), { N, fill, d, s, delta } = q;
        const wide = w >= 640;
        ctx.fillStyle = '#f7f9fa'; ctx.fillRect(0, 0, w, h);
        const hue = (i, a = 1) => `hsla(${Math.round(N <= 1 ? 200 : 200 + 150 * i / (N - 1))},70%,42%,${a})`;
        const topH = wide ? Math.round(h * 0.52) : Math.round(h * 0.6);
        const sw = wide ? Math.round(w * 0.56) : w, sh = wide ? topH : Math.round(topH * 0.5);
        const px0 = wide ? sw + 8 : 0, py0 = wide ? 0 : sh + 4, pw = wide ? w - sw - 8 : w, ph = wide ? topH : topH - sh - 4;

        /* --- 左：狹縫與往 θ 方向的平行光線 --- */
        labelFit(ctx, fill ? `把寬 a = ${p.ma} λ 的縫切成 N = ${N} 條細縫` : `N = ${N} 條細縫，縫距 d = ${p.md} λ`, 10, 18, C.ink, 12, 'left', { maxW: sw - 20, min: 10, clampW: w });
        const xp = Math.max(40, sw * 0.16), cyS = 26 + (sh - 44) * (0.5 + 0.2 * s);
        const span = Math.min(sh * 0.5, 170);
        // 固定總寬：縫排滿同一段寬度；固定縫距：縫愈多、整排愈寬（間距有上限，避免超出畫面）
        const gap = N > 1 ? (fill ? span / (N - 1) : Math.min(span / (N - 1), 26)) : 0;
        const ys = [];
        for (let i = 0; i < N; i++) ys.push(cyS + ((N - 1) / 2 - i) * gap);
        ctx.fillStyle = '#3b5a66';
        ctx.fillRect(xp - 4, 28, 8, sh - 52);
        ctx.fillStyle = '#f7f9fa';
        const slitH = Math.max(2, Math.min(6, gap * 0.35 || 6));
        if (N > 60) { ctx.fillStyle = 'rgba(255,255,255,0.85)'; ctx.fillRect(xp - 5, ys[N - 1] - 1, 10, ys[0] - ys[N - 1] + 2); }
        else {
            ys.forEach((y) => ctx.fillRect(xp - 5, y - slitH / 2, 10, slitH));
            ys.forEach((y, i) => { ctx.fillStyle = hue(i); ctx.beginPath(); ctx.arc(xp, y, N > 14 ? 2 : 3, 0, Math.PI * 2); ctx.fill(); });
        }
        for (let i = 0; i < 4; i++) { const yy = 34 + (sh - 46) * (i + 0.5) / 4; arrow(ctx, 6, yy, xp - 10, yy, 'rgba(11,111,146,0.55)', 1.3); }
        // 光線：往 θ 方向（畫面上往右上為正）
        const th = p.mth * Math.PI / 180;
        const ux = Math.cos(th), uy = -Math.sin(th);
        const Lr = Math.max(60, sw - xp - 20);
        ctx.save(); ctx.beginPath(); ctx.rect(0, 26, sw, sh - 44); ctx.clip();
        // 垂直於光線、通過最上方（i = N−1）或最下方縫的參考線：光程差從這裡量
        const iRef = s >= 0 ? N - 1 : 0;
        const rayK = Math.max(1, Math.ceil(N / 30));           // 縫很多時只畫一部分光線
        ys.forEach((y, i) => {
            if (i % rayK && i !== N - 1) return;
            const proj = (ys[iRef] - y) * uy;                 // 到參考波前多走的路（像素）
            ctx.strokeStyle = hue(i, N > 14 ? 0.55 : 0.85); ctx.lineWidth = N > 14 ? 1 : 1.6;
            ctx.beginPath(); ctx.moveTo(xp, y); ctx.lineTo(xp + ux * Lr, y + uy * Lr); ctx.stroke();
            if (Math.abs(proj) > 0.5 && N <= 16) {
                ctx.strokeStyle = hue(i); ctx.lineWidth = 3.2;
                ctx.beginPath(); ctx.moveTo(xp, y); ctx.lineTo(xp + ux * proj, y + uy * proj); ctx.stroke();
            }
        });
        if (N > 1) {
            const A = { x: xp, y: ys[iRef] };
            const far = s >= 0 ? 0 : N - 1;
            const pr = (ys[iRef] - ys[far]) * uy;
            dashed(ctx, A.x, A.y, xp + ux * pr, ys[far] + uy * pr, 'rgba(107,70,193,0.8)');
            // d 標示
            if (N <= 12) {
                ctx.strokeStyle = C.orange; ctx.lineWidth = 1.2;
                const y0 = ys[0], y1 = ys[1];
                ctx.beginPath(); ctx.moveTo(xp - 16, y0); ctx.lineTo(xp - 16, y1); ctx.moveTo(xp - 20, y0); ctx.lineTo(xp - 12, y0); ctx.moveTo(xp - 20, y1); ctx.lineTo(xp - 12, y1); ctx.stroke();
                label(ctx, 'd', xp - 22, (y0 + y1) / 2 + 4, C.orange, 11, 'right');
            }
        }
        ctx.restore();
        {
            const ym = (ys[0] + ys[N - 1]) / 2, rr = Math.min(Lr * 0.55, 150);
            const ty = Math.max(44, Math.min(sh - 34, ym + uy * rr + (uy < 0 ? -8 : 16)));
            labelFit(ctx, `θ = ${p.mth.toFixed(1)}°`, xp + ux * rr + 6, ty, C.ink, 11, 'left', { plate: 'rgba(247,249,250,0.9)', clampW: sw });
        }
        labelWrap(ctx, N === 1 ? '只有一條極窄的縫：沒有別的縫和它干涉，各方向一樣亮' : `粗線：每條縫比最${s >= 0 ? '上' : '下'}方那條多走的路，相鄰差 d sinθ = ${(d * s).toFixed(2)} λ`, 10, sh - 6, C.violet, 10, 13, sw - 20);

        /* --- 右：相量圖（箭頭頭尾相接） --- */
        ctx.fillStyle = '#ffffff'; ctx.fillRect(px0, py0 + 4, pw - 6, ph - 8);
        ctx.strokeStyle = 'rgba(18,49,58,0.15)'; ctx.lineWidth = 1; ctx.strokeRect(px0, py0 + 4, pw - 6, ph - 8);
        labelFit(ctx, '每條縫的波 = 一根箭頭；相鄰兩根轉 δ', px0 + 8, py0 + 20, C.ink, 11, 'left', { maxW: pw - 20, min: 9, clampW: w });
        // 先讓「全部同向」時的總長度剛好放得下面板寬度；捲起來後若超出高度再整體縮小
        let ell = (pw - 46) * 0.9 / N, pts;
        const chain = () => {
            pts = [[0, 0]];
            for (let i = 0; i < N; i++) {
                const a = i * delta;
                const [x, y] = pts[pts.length - 1];
                pts.push([x + ell * Math.cos(a), y - ell * Math.sin(a)]);
            }
        };
        chain();
        const hgt = Math.max(...pts.map((v) => v[1])) - Math.min(...pts.map((v) => v[1]));
        if (hgt > ph - 76) { ell *= (ph - 76) / hgt; chain(); }
        const xs = pts.map((v) => v[0]), yv = pts.map((v) => v[1]);
        const bx = (Math.min(...xs) + Math.max(...xs)) / 2, by = (Math.min(...yv) + Math.max(...yv)) / 2;
        const ox = px0 + (pw - 6) / 2 - bx, oy = py0 + 4 + (ph - 8) / 2 + 6 - by;
        // δ ≈ 180° 時箭頭來回重疊，往兩側錯開一點才分得出是兩根
        const back = Math.cos(delta) < -0.97 ? 4 : 0;
        for (let i = 0; i < N; i++) {
            const [x1, y1] = pts[i], [x2, y2] = pts[i + 1];
            const nx = 0, ny = back * (i % 2 ? -1 : 1);
            if (N > 40) {
                ctx.strokeStyle = hue(i); ctx.lineWidth = 1.6;
                ctx.beginPath(); ctx.moveTo(ox + x1, oy + y1); ctx.lineTo(ox + x2, oy + y2); ctx.stroke();
            } else arrow(ctx, ox + x1 + nx, oy + y1 + ny, ox + x2 + nx, oy + y2 + ny, hue(i), N > 16 ? 1.4 : 2);
        }
        const [xe, ye] = pts[N];
        const R = Math.hypot(xe, ye);
        if (R > 3) arrow(ctx, ox, oy, ox + xe, oy + ye, C.ink, 3);
        else { ctx.fillStyle = C.rose; ctx.beginPath(); ctx.arc(ox, oy, 4, 0, Math.PI * 2); ctx.fill(); }
        const dd = ((delta * 180 / Math.PI) % 360 + 360) % 360;
        const nTurn = N * delta / (2 * Math.PI);
        labelFit(ctx, `δ = ${dd.toFixed(0)}°　N × δ = ${(N * delta * 180 / Math.PI).toFixed(0)}°（= 360° × a sinθ/λ）`, px0 + 8, py0 + ph - 26, C.muted, 10, 'left', { maxW: pw - 20, min: 9, clampW: w });
        // 以合成振幅判斷：幾乎全部同向 → 主亮紋；合成幾乎為 0 → 箭頭繞成封閉多邊形
        const ampAbs = Math.abs(q.amp(delta));
        const allIn = N > 1 && ampAbs > 0.985;
        const closed = N > 1 && ampAbs < 0.03;
        void nTurn;
        labelFit(ctx, allIn ? '箭頭全部同方向 → 主亮紋（最亮）' : closed ? '箭頭繞成封閉多邊形 → 合成為 0：暗紋' : `合成箭頭長度 ＝ 最大值的 ${(Math.abs(q.amp(delta)) * 100).toFixed(0)}%`,
            px0 + 8, py0 + ph - 10, allIn ? C.green : closed ? C.rose : C.ink, 11, 'left', { maxW: pw - 20, min: 9, clampW: w });

        /* --- 下：強度對 sinθ --- */
        const legRow = w < 560 ? 16 : 0;                    // 窄畫布：圖例另起一行
        const gx0 = 34, gx1 = w - 12, gy0 = topH + 34 + legRow, gy1 = h - 30;
        const xOf = (v) => gx0 + (v + 1) / 2 * (gx1 - gx0);
        const yOf = (v) => gy1 - v * (gy1 - gy0);
        labelFit(ctx, `屏幕上的強度（對 sinθ 作圖，最亮 = 1）`, gx0, topH + 18, C.ink, 11, 'left', { maxW: (gx1 - gx0) * 0.6, min: 9, clampW: w });
        ctx.strokeStyle = 'rgba(18,49,58,0.25)'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(gx0, gy1); ctx.lineTo(gx1, gy1); ctx.moveTo(xOf(0), gy0); ctx.lineTo(xOf(0), gy1); ctx.stroke();
        [-1, -0.5, 0, 0.5, 1].forEach((v) => label(ctx, String(v), xOf(v), gy1 + 13, C.muted, 9, 'center'));
        labelFit(ctx, 'sinθ', gx1, gy1 + 24, C.muted, 9, 'right', { clampW: w });
        const plot = (fn, col, lw, dash) => {
            ctx.save(); if (dash) ctx.setLineDash(dash);
            ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.beginPath();
            // 縫很多時亮紋比一個像素還細：每個像素取 8 個點的最大值，亮紋才不會漏畫
            const n = Math.round(gx1 - gx0);
            for (let i = 0; i <= n; i++) {
                let m = 0;
                for (let k = 0; k < 8; k++) m = Math.max(m, fn(-1 + 2 * (i + (k - 3.5) / 8) / n));
                const Y = yOf(m);
                i ? ctx.lineTo(gx0 + i, Y) : ctx.moveTo(gx0, Y);
            }
            ctx.stroke(); ctx.restore();
        };
        if (fill) plot((v) => sinc2(Math.PI * p.ma * v), 'rgba(194,38,74,0.75)', 1.6, [6, 4]);
        plot((v) => q.amp(2 * Math.PI * d * v) ** 2, C.blue, 2);
        // 單狹縫暗紋 a sinθ = mλ
        if (fill) {
            for (let m = 1; m / p.ma <= 1; m++) [1, -1].forEach((sg) => {
                const x = xOf(sg * m / p.ma);
                ctx.fillStyle = C.rose; ctx.beginPath(); ctx.moveTo(x, gy1 + 1); ctx.lineTo(x - 3.5, gy1 + 6); ctx.lineTo(x + 3.5, gy1 + 6); ctx.closePath(); ctx.fill();
            });
        }
        const cx = xOf(s);
        ctx.strokeStyle = C.orange; ctx.lineWidth = 1.4;
        ctx.beginPath(); ctx.moveTo(cx, gy0 - 4); ctx.lineTo(cx, gy1); ctx.stroke();
        ctx.fillStyle = C.orange; ctx.beginPath(); ctx.arc(cx, yOf(q.I), 4.5, 0, Math.PI * 2); ctx.fill();
        // 圖例
        ctx.font = '10px Outfit, "Noto Sans TC", sans-serif';
        const legs = [[`${N} 條細縫`, C.blue, null]];
        if (fill) legs.push(['單狹縫 sinc²（N → ∞）', 'rgba(194,38,74,0.85)', [5, 3]]);
        let lx = gx1;
        for (let i = legs.length - 1; i >= 0; i--) {
            const [tx, col, dash] = legs[i], tw = ctx.measureText(tx).width + 26;
            ctx.save(); if (dash) ctx.setLineDash(dash); ctx.strokeStyle = col; ctx.lineWidth = 2;
            ctx.beginPath(); ctx.moveTo(lx - tw, topH + 14 + legRow); ctx.lineTo(lx - tw + 18, topH + 14 + legRow); ctx.stroke(); ctx.restore();
            label(ctx, tx, lx - tw + 22, topH + 18 + legRow, C.ink, 10);
            lx -= tw + 8;
        }
    }
    function multiReadouts(p) {
        const q = multiInfo(p), { N, fill, d, s, delta } = q;
        const dd = ((delta * 180 / Math.PI) % 360 + 360) % 360;
        const out = [
            { label: '相鄰兩縫光程差 d sinθ', value: `${(d * s).toFixed(3)} λ（d = ${d.toFixed(2)} λ）` },
            { label: '相鄰兩縫相位差 δ', value: `${dd.toFixed(1)}°` },
            { label: '強度 I / I_max', value: q.I.toFixed(3) }
        ];
        if (fill) out.push({ label: '最上與最下的光程差 a sinθ', value: `${(p.ma * s).toFixed(2)} λ　（單狹縫極限 I = ${q.Isl.toFixed(3)}）` });
        else out.push({ label: '主亮紋 d sinθ = nλ', value: `sinθ = ${[1, 2, 3].filter((n) => n / p.md <= 1).map((n) => (n / p.md).toFixed(2)).join('、') || '—'}；之間有 ${Math.max(0, N - 1)} 個暗紋` });
        return out;
    }

    window.SlitOptics = {
        LAM0, LV, WV, PRESETS,
        pure, ink, css, enc, spectrum, coincide, gcd,
        draw2D, draw3D, bind3D,
        youngColors, youngColorReadouts, singleColors, singleColorReadouts,
        young3D, young3DReadouts, single3D, single3DReadouts,
        multiDraw, multiReadouts,
        setView: (p, key) => { p._view = Object.assign({}, PRESETS[key] || PRESETS.oblique); }
    };
})();
