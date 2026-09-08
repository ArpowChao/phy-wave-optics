/*
 * lab-selftest.js
 * 互動實驗的自動化視覺健檢。只有在網址帶 ?selftest=1 時才會被主頁載入。
 *
 * 檢查三件靜態掃描做不到、但 Console 也不會報錯的事（守則 §1）：
 *   1. 每個實驗的每個模式都跑得起來嗎（含動畫迴圈裡才會炸的錯）
 *   2. 畫布上的文字有沒有互相重疊
 *   3. 有沒有文字被畫到畫布外面
 *
 * 用法：在網址後加上 ?selftest=1，報告會直接印在頁面上，也會回傳到 console。
 * 開發時改完任何 draw 函式，跑一次再宣稱完成。
 */
(function () {
    'use strict';

    /* 攔截 fillText，記錄每段文字實際佔用的方塊 */
    const boxes = [];
    const proto = CanvasRenderingContext2D.prototype;
    const origFillText = proto.fillText;
    proto.fillText = function (text, x, y) {
        try {
            const m = this.measureText(text);
            const wid = m.width;
            const asc = m.actualBoundingBoxAscent || parseFloat(this.font) * 0.8;
            const desc = m.actualBoundingBoxDescent || parseFloat(this.font) * 0.2;
            let left = x;
            if (this.textAlign === 'center') left = x - wid / 2;
            else if (this.textAlign === 'right' || this.textAlign === 'end') left = x - wid;
            boxes.push({ t: String(text), x: left, y: y - asc, w: wid, h: asc + desc });
        } catch (err) { /* 量不到就略過，不要拖垮繪圖 */ }
        return origFillText.apply(this, arguments);
    };

    /* 兩個方塊的重疊面積，佔較小者的比例 */
    function overlapRatio(a, b) {
        const ox = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x);
        const oy = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y);
        if (ox <= 0 || oy <= 0) return 0;
        return (ox * oy) / Math.min(a.w * a.h, b.w * b.h);
    }

    function allRoutes() {
        /* LABS 是主頁的頂層 const：不會掛在 window 上，但同為 classic script 可直接取用 */
        const labs = (typeof LABS !== 'undefined') ? LABS : {};
        const out = [];
        Object.keys(labs).forEach((id) => {
            const modes = (labs[id].modes || []).map((m) => m.key);
            if (modes.length) modes.forEach((k) => out.push(id + ':' + k));
            else out.push(id);
        });
        return out;
    }

    /* 分頁在背景、或視窗沒有在重繪時，瀏覽器會把 requestAnimationFrame 節流到
     * 完全不觸發，單純 await rAF 會永遠卡住。加一條逾時退路，讓健檢在任何情況
     * 下都跑得完（畫面內容仍然正確，只是不等真正的重繪時機）。 */
    const nextFrame = () => new Promise((resolve) => {
        let done = false;
        const finish = () => { if (!done) { done = true; resolve(); } };
        requestAnimationFrame(() => requestAnimationFrame(finish));
        setTimeout(finish, 120);
    });

    async function scanAt(widthPx, routes) {
        const host = document.getElementById('main-content');
        host.style.maxWidth = widthPx + 'px';
        window.dispatchEvent(new Event('resize'));
        await new Promise((r) => setTimeout(r, 120));

        const problems = [];
        for (const route of routes) {
            const errs = [];
            const onErr = (e) => errs.push(e.message || String(e.reason || e));
            window.addEventListener('error', onErr);
            try {
                renderRoute('lab-' + route);
            } catch (e) {
                errs.push(e.message);
            }
            window.dispatchEvent(new Event('resize'));
            await nextFrame();
            boxes.length = 0;
            await nextFrame();
            /* 多等一拍，讓只有在動畫迴圈裡才會炸的錯浮出來 */
            await new Promise((r) => setTimeout(r, 160));
            window.removeEventListener('error', onErr);

            const snap = boxes.slice();
            const hits = new Set();
            for (let i = 0; i < snap.length; i++) {
                for (let j = i + 1; j < snap.length; j++) {
                    if (snap[i].t === snap[j].t) continue;
                    if (overlapRatio(snap[i], snap[j]) > 0.20) hits.add(snap[i].t + '  ✕  ' + snap[j].t);
                }
            }
            const oob = [...new Set(snap.filter((b) => b.x < -2).map((b) => b.t + ' (x=' + Math.round(b.x) + ')'))];
            if (errs.length || hits.size || oob.length) {
                problems.push({ route, errors: [...new Set(errs)], overlaps: [...hits], offCanvas: oob });
            }
        }
        host.style.maxWidth = '';
        return problems;
    }

    async function run() {
        const routes = allRoutes();
        const widths = [360, 560, 900];
        const result = {};
        for (const px of widths) result[px + 'px'] = await scanAt(px, routes);

        const total = widths.reduce((s, px) => s + result[px + 'px'].length, 0);
        const rows = widths.map((px) => {
            const list = result[px + 'px'];
            const body = list.length
                ? list.map((p) => `<li><b>${p.route}</b>${
                    p.errors.length ? `<br><span style="color:#c2264a">✖ ${p.errors.join('；')}</span>` : ''}${
                    p.overlaps.length ? `<br><span style="color:#c9750f">文字重疊：${p.overlaps.join('　')}</span>` : ''}${
                    p.offCanvas.length ? `<br><span style="color:#6b46c1">超出畫布：${p.offCanvas.join('　')}</span>` : ''
                  }</li>`).join('')
                : '<li style="color:#109169">全部通過</li>';
            return `<h3 style="margin:1.2rem 0 .4rem">畫布寬度 ${px}px　（${list.length} 個問題）</h3><ul style="line-height:1.9">${body}</ul>`;
        }).join('');

        document.getElementById('main-content').innerHTML = `
            <div class="view-header">
                <span class="view-eyebrow">自動化視覺健檢</span>
                <h2>互動實驗自我檢查</h2>
                <p>掃描 ${routes.length} 個實驗模式 × ${widths.length} 種畫布寬度，
                   檢查執行期錯誤、畫布文字重疊與超出邊界。</p>
            </div>
            <div class="callout ${total ? 'warn' : 'info'}">
                ${total ? `發現 ${total} 個問題，詳見下方。` : '全部通過：沒有執行期錯誤、沒有文字重疊、沒有文字被畫到畫布外。'}
            </div>
            ${rows}`;
        console.log('[selftest]', result);
        return result;
    }

    window.runLabSelfTest = run;
    if (/[?&]selftest=1/.test(location.search)) {
        window.addEventListener('load', () => setTimeout(run, 600));
    }
})();
