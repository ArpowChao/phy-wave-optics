import os
import re

html_path = 'wave_optics_review.html'

with open(html_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update CSS to include styles for embedded quiz labs
css_addon = """
        .quiz-lab-btn {
            border-color: #0b6f92 !important;
            background: rgba(11, 111, 146, 0.08) !important;
            color: #0b6f92 !important;
            font-weight: 600;
        }
        .quiz-lab-btn:hover {
            background: #0b6f92 !important;
            color: #ffffff !important;
        }
        .quiz-lab-btn.is-open {
            background: #0b6f92 !important;
            color: #ffffff !important;
        }
        .quiz-lab-box {
            margin-top: 1rem;
            border: 1.5px solid rgba(11, 111, 146, 0.25);
            border-radius: 12px;
            background: #fdfefe;
            padding: 0.85rem;
            box-shadow: 0 4px 16px rgba(11, 111, 146, 0.06);
            animation: fadeInLab 0.24s ease-out;
        }
        .quiz-lab-guide {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.55rem 0.85rem;
            margin-bottom: 0.75rem;
            background: rgba(14, 139, 147, 0.1);
            border-left: 3.5px solid var(--accent-cyan);
            border-radius: 0 8px 8px 0;
            font-size: 0.84rem;
            color: #12313a;
            line-height: 1.6;
        }
        @keyframes fadeInLab {
            from { opacity: 0; transform: translateY(-6px); }
            to { opacity: 1; transform: translateY(0); }
        }
"""

if '.quiz-lab-btn' not in content:
    content = content.replace('.quiz-empty { padding: 2rem; text-align: center; color: var(--text-muted); font-size: 0.9rem; }',
                              '.quiz-empty { padding: 2rem; text-align: center; color: var(--text-muted); font-size: 0.9rem; }' + css_addon)

# 2. Add activeQuizLabDisposers & cleanupCurrentView update
old_cleanup = """        function cleanupCurrentView() {
            activeDisposers.dispose();
            activeDisposers = WaveRuntime.createDisposerRegistry('view');
        }"""

new_cleanup = """        const activeQuizLabDisposers = new Map();

        function cleanupCurrentView() {
            activeQuizLabDisposers.forEach((d) => { try { d.dispose(); } catch (e) {} });
            activeQuizLabDisposers.clear();
            activeDisposers.dispose();
            activeDisposers = WaveRuntime.createDisposerRegistry('view');
        }"""

if 'const activeQuizLabDisposers' not in content:
    content = content.replace(old_cleanup, new_cleanup)

# 3. Update labShellHtml and mountLab to support prefix & customDisposers
old_lab_shell_mount = """        function labShellHtml(id) {
            const lab = LABS[id];
            const controls = (lab.controls || []).map((c) => `
                <div class="lab-control" id="${id}-${c.key}-wrap">
                    <label for="${id}-${c.key}">${c.label}<b id="${id}-${c.key}-out"></b></label>
                    <input type="range" id="${id}-${c.key}" min="${c.min}" max="${c.max}" step="${c.step}" value="${c.value}">
                </div>`).join('');
            const modes = (lab.modes || []).map((m, i) =>
                `<button type="button" class="lab-btn ${i === 0 ? 'is-active' : ''}" data-mode="${m.key}">${m.label}</button>`
            ).join('');
            const scrub = lab.cycle ? `
                    <div class="lab-scrub">
                        <span class="scrub-label">⏱ 時間軸</span>
                        <button type="button" class="scrub-btn" data-role="step-back" aria-label="退一格">⏴</button>
                        <input type="range" id="${id}-scrub" min="0" max="1000" step="1" value="0" aria-label="拖曳以慢慢看過程">
                        <button type="button" class="scrub-btn" data-role="step-fwd" aria-label="進一格">⏵</button>
                        <b id="${id}-scrub-out">0.00 s</b>
                    </div>` : '';
            return `
                <div class="lab-shell" id="lab-${id}">
                    <div class="lab-title"><h4>${lab.name}</h4><span class="lab-tag">${lab.tag}</span></div>
                    <div class="lab-hint">${lab.hint}</div>
                    ${modes ? `<div class="lab-buttons" data-role="modes">${modes}</div>` : ''}
                    <div class="lab-stage"><canvas id="${id}-canvas"></canvas></div>
                    ${scrub}
                    <div class="lab-controls">${controls}</div>
                    <div class="lab-buttons">
                        <button type="button" class="lab-btn" data-role="toggle">⏸ 暫停</button>
                        <button type="button" class="lab-btn" data-role="reset">↺ 回到預設值</button>
                    </div>
                    <div class="lab-readout" id="${id}-readout"></div>
                    ${lab.note ? `<div class="lab-note">${lab.note}</div>` : ''}
                </div>`;
        }

        function mountLab(id, initialMode) {
            const lab = LABS[id];
            const host = document.getElementById(`lab-${id}`);
            const canvas = document.getElementById(`${id}-canvas`);
            if (!lab || !host || !canvas) return;

            const params = {};
            (lab.controls || []).forEach((c) => { params[c.key] = Number(c.value); });
            const modeKeys = lab.modes ? lab.modes.map((m) => m.key) : [];
            params.mode = lab.modes
                ? (modeKeys.includes(initialMode) ? initialMode : lab.modes[0].key)
                : null;
            if (lab.modes) {
                host.querySelectorAll('[data-mode]').forEach((b) => {
                    b.classList.toggle('is-active', b.dataset.mode === params.mode);
                });
            }

            let running = !WaveRuntime.prefersReducedMotion();
            let simTime = 0;
            let geom = WaveRuntime.fitCanvas(canvas, lab.height || 320);

            const syncOutputs = () => {
                (lab.controls || []).forEach((c) => {
                    const out = document.getElementById(`${id}-${c.key}-out`);
                    if (out) out.textContent = c.fmt ? c.fmt(params[c.key], params) : params[c.key];
                    const wrap = document.getElementById(`${id}-${c.key}-wrap`);
                    if (wrap && c.only) wrap.style.display = c.only.includes(params.mode) ? '' : 'none';
                });
                const ro = document.getElementById(`${id}-readout`);
                if (ro && lab.readouts) {
                    ro.innerHTML = lab.readouts(params).map((r) => `<div><span>${r.label}</span><strong>${r.value}</strong></div>`).join('');
                }
            };

            const paint = () => {
                const ctx = canvas.getContext('2d');
                ctx.clearRect(0, 0, geom.width, geom.height);
                lab.draw(ctx, geom.width, geom.height, params, simTime);
            };

            (lab.controls || []).forEach((c) => {
                const input = document.getElementById(`${id}-${c.key}`);
                activeDisposers.addEventListener(input, 'input', () => {
                    params[c.key] = Number(input.value);
                    syncOutputs(); paint();
                });
            });

            host.querySelectorAll('[data-mode]').forEach((btn) => {
                activeDisposers.addEventListener(btn, 'click', () => {
                    host.querySelectorAll('[data-mode]').forEach((b) => b.classList.remove('is-active'));
                    btn.classList.add('is-active');
                    params.mode = btn.dataset.mode;
                    if (lab.onMode) lab.onMode(params);
                    syncOutputs(); paint();
                });
            });

            const toggleBtn = host.querySelector('[data-role="toggle"]');
            activeDisposers.addEventListener(toggleBtn, 'click', () => {
                running = !running;
                toggleBtn.textContent = running ? '⏸ 暫停' : '▶ 播放';
            });
            if (!running) toggleBtn.textContent = '▶ 播放';

            /* 時間軸：拖曳或逐格前後時自動暫停，讓學生慢慢看疊加、反射的過程 */
            const scrubInput = lab.cycle ? document.getElementById(`${id}-scrub`) : null;
            const scrubOut = lab.cycle ? document.getElementById(`${id}-scrub-out`) : null;
            // cycle 可以是數字，也可以是依參數計算的函式（例如週期 T = 1/f）
            const cycleOf = () => {
                const c = (typeof lab.cycle === 'function') ? lab.cycle(params) : lab.cycle;
                return (Number.isFinite(c) && c > 0.02) ? c : 2;
            };
            const showScrub = () => {
                if (!scrubInput) return;
                const cyc = cycleOf();
                const phase = ((simTime % cyc) + cyc) % cyc;
                scrubInput.value = String(Math.round(phase / cyc * 1000));
                if (scrubOut) scrubOut.textContent = `${phase.toFixed(2)} s`;
            };
            const pausePlayback = () => {
                if (!running) return;
                running = false;
                toggleBtn.textContent = '▶ 播放';
            };
            if (scrubInput) {
                activeDisposers.addEventListener(scrubInput, 'input', () => {
                    pausePlayback();
                    simTime = Number(scrubInput.value) / 1000 * cycleOf();
                    if (scrubOut) scrubOut.textContent = `${simTime.toFixed(2)} s`;
                    syncOutputs(); paint();
                });
                const stepBy = (frac) => {
                    pausePlayback();
                    const cyc = cycleOf();
                    simTime = (((simTime + frac * cyc) % cyc) + cyc) % cyc;
                    showScrub(); paint();
                };
                activeDisposers.addEventListener(host.querySelector('[data-role="step-back"]'), 'click', () => stepBy(-1 / 48));
                activeDisposers.addEventListener(host.querySelector('[data-role="step-fwd"]'), 'click', () => stepBy(1 / 48));
                showScrub();
            }

            activeDisposers.addEventListener(host.querySelector('[data-role="reset"]'), 'click', () => {
                (lab.controls || []).forEach((c) => {
                    params[c.key] = Number(c.value);
                    const input = document.getElementById(`${id}-${c.key}`);
                    if (input) input.value = c.value;
                });
                simTime = 0;
                showScrub();
                syncOutputs(); paint();
            });

            activeDisposers.addEventListener(window, 'resize', () => {
                geom = WaveRuntime.fitCanvas(canvas, lab.height || 320);
                paint();
            });

            let scrubTick = 0;
            activeDisposers.runLoop((dt) => {
                if (running) {
                    simTime += dt;
                    if (scrubInput && (scrubTick = (scrubTick + 1) % 6) === 0) showScrub();
                }
                paint();
            });

            syncOutputs();
            paint();
        }"""

new_lab_shell_mount = """        function labShellHtml(id, prefix = '') {
            const lab = LABS[id];
            if (!lab) return '';
            const controls = (lab.controls || []).map((c) => `
                <div class="lab-control" id="${prefix}${id}-${c.key}-wrap">
                    <label for="${prefix}${id}-${c.key}">${c.label}<b id="${prefix}${id}-${c.key}-out"></b></label>
                    <input type="range" id="${prefix}${id}-${c.key}" min="${c.min}" max="${c.max}" step="${c.step}" value="${c.value}">
                </div>`).join('');
            const modes = (lab.modes || []).map((m, i) =>
                `<button type="button" class="lab-btn ${i === 0 ? 'is-active' : ''}" data-mode="${m.key}">${m.label}</button>`
            ).join('');
            const scrub = lab.cycle ? `
                    <div class="lab-scrub">
                        <span class="scrub-label">⏱ 時間軸</span>
                        <button type="button" class="scrub-btn" data-role="step-back" aria-label="退一格">⏴</button>
                        <input type="range" id="${prefix}${id}-scrub" min="0" max="1000" step="1" value="0" aria-label="拖曳以慢慢看過程">
                        <button type="button" class="scrub-btn" data-role="step-fwd" aria-label="進一格">⏵</button>
                        <b id="${prefix}${id}-scrub-out">0.00 s</b>
                    </div>` : '';
            return `
                <div class="lab-shell" id="${prefix}lab-${id}">
                    <div class="lab-title"><h4>${lab.name}</h4><span class="lab-tag">${lab.tag}</span></div>
                    <div class="lab-hint">${lab.hint}</div>
                    ${modes ? `<div class="lab-buttons" data-role="modes">${modes}</div>` : ''}
                    <div class="lab-stage"><canvas id="${prefix}${id}-canvas"></canvas></div>
                    ${scrub}
                    <div class="lab-controls">${controls}</div>
                    <div class="lab-buttons">
                        <button type="button" class="lab-btn" data-role="toggle">⏸ 暫停</button>
                        <button type="button" class="lab-btn" data-role="reset">↺ 回到預設值</button>
                    </div>
                    <div class="lab-readout" id="${prefix}${id}-readout"></div>
                    ${lab.note ? `<div class="lab-note">${lab.note}</div>` : ''}
                </div>`;
        }

        function mountLab(id, initialMode, prefix = '', customDisposers = null) {
            const lab = LABS[id];
            const host = document.getElementById(prefix ? `${prefix}lab-${id}` : `lab-${id}`);
            const canvas = document.getElementById(prefix ? `${prefix}${id}-canvas` : `${id}-canvas`);
            if (!lab || !host || !canvas) return;

            const disposers = customDisposers || activeDisposers;

            const params = {};
            (lab.controls || []).forEach((c) => { params[c.key] = Number(c.value); });
            const modeKeys = lab.modes ? lab.modes.map((m) => m.key) : [];
            params.mode = lab.modes
                ? (modeKeys.includes(initialMode) ? initialMode : lab.modes[0].key)
                : null;
            if (lab.modes) {
                host.querySelectorAll('[data-mode]').forEach((b) => {
                    b.classList.toggle('is-active', b.dataset.mode === params.mode);
                });
            }

            let running = !WaveRuntime.prefersReducedMotion();
            let simTime = 0;
            let geom = WaveRuntime.fitCanvas(canvas, lab.height || 320);

            const syncOutputs = () => {
                (lab.controls || []).forEach((c) => {
                    const out = document.getElementById(prefix ? `${prefix}${id}-${c.key}-out` : `${id}-${c.key}-out`);
                    if (out) out.textContent = c.fmt ? c.fmt(params[c.key], params) : params[c.key];
                    const wrap = document.getElementById(prefix ? `${prefix}${id}-${c.key}-wrap` : `${id}-${c.key}-wrap`);
                    if (wrap && c.only) wrap.style.display = c.only.includes(params.mode) ? '' : 'none';
                });
                const ro = document.getElementById(prefix ? `${prefix}${id}-readout` : `${id}-readout`);
                if (ro && lab.readouts) {
                    ro.innerHTML = lab.readouts(params).map((r) => `<div><span>${r.label}</span><strong>${r.value}</strong></div>`).join('');
                }
            };

            const paint = () => {
                const ctx = canvas.getContext('2d');
                ctx.clearRect(0, 0, geom.width, geom.height);
                lab.draw(ctx, geom.width, geom.height, params, simTime);
            };

            (lab.controls || []).forEach((c) => {
                const input = document.getElementById(prefix ? `${prefix}${id}-${c.key}` : `${id}-${c.key}`);
                if (input) {
                    disposers.addEventListener(input, 'input', () => {
                        params[c.key] = Number(input.value);
                        syncOutputs(); paint();
                    });
                }
            });

            host.querySelectorAll('[data-mode]').forEach((btn) => {
                disposers.addEventListener(btn, 'click', () => {
                    host.querySelectorAll('[data-mode]').forEach((b) => b.classList.remove('is-active'));
                    btn.classList.add('is-active');
                    params.mode = btn.dataset.mode;
                    if (lab.onMode) lab.onMode(params);
                    syncOutputs(); paint();
                });
            });

            const toggleBtn = host.querySelector('[data-role="toggle"]');
            if (toggleBtn) {
                disposers.addEventListener(toggleBtn, 'click', () => {
                    running = !running;
                    toggleBtn.textContent = running ? '⏸ 暫停' : '▶ 播放';
                });
                if (!running) toggleBtn.textContent = '▶ 播放';
            }

            /* 時間軸：拖曳或逐格前後時自動暫停，讓學生慢慢看疊加、反射的過程 */
            const scrubInput = lab.cycle ? document.getElementById(prefix ? `${prefix}${id}-scrub` : `${id}-scrub`) : null;
            const scrubOut = lab.cycle ? document.getElementById(prefix ? `${prefix}${id}-scrub-out` : `${id}-scrub-out`) : null;
            const cycleOf = () => {
                const c = (typeof lab.cycle === 'function') ? lab.cycle(params) : lab.cycle;
                return (Number.isFinite(c) && c > 0.02) ? c : 2;
            };
            const showScrub = () => {
                if (!scrubInput) return;
                const cyc = cycleOf();
                const phase = ((simTime % cyc) + cyc) % cyc;
                scrubInput.value = String(Math.round(phase / cyc * 1000));
                if (scrubOut) scrubOut.textContent = `${phase.toFixed(2)} s`;
            };
            const pausePlayback = () => {
                if (!running) return;
                running = false;
                if (toggleBtn) toggleBtn.textContent = '▶ 播放';
            };
            if (scrubInput) {
                disposers.addEventListener(scrubInput, 'input', () => {
                    pausePlayback();
                    simTime = Number(scrubInput.value) / 1000 * cycleOf();
                    if (scrubOut) scrubOut.textContent = `${simTime.toFixed(2)} s`;
                    syncOutputs(); paint();
                });
                const stepBy = (frac) => {
                    pausePlayback();
                    const cyc = cycleOf();
                    simTime = (((simTime + frac * cyc) % cyc) + cyc) % cyc;
                    showScrub(); paint();
                };
                const backBtn = host.querySelector('[data-role="step-back"]');
                const fwdBtn = host.querySelector('[data-role="step-fwd"]');
                if (backBtn) disposers.addEventListener(backBtn, 'click', () => stepBy(-1 / 48));
                if (fwdBtn) disposers.addEventListener(fwdBtn, 'click', () => stepBy(1 / 48));
                showScrub();
            }

            const resetBtn = host.querySelector('[data-role="reset"]');
            if (resetBtn) {
                disposers.addEventListener(resetBtn, 'click', () => {
                    (lab.controls || []).forEach((c) => {
                        params[c.key] = Number(c.value);
                        const input = document.getElementById(prefix ? `${prefix}${id}-${c.key}` : `${id}-${c.key}`);
                        if (input) input.value = c.value;
                    });
                    simTime = 0;
                    showScrub();
                    syncOutputs(); paint();
                });
            }

            disposers.addEventListener(window, 'resize', () => {
                geom = WaveRuntime.fitCanvas(canvas, lab.height || 320);
                paint();
            });

            let scrubTick = 0;
            disposers.runLoop((dt) => {
                if (running) {
                    simTime += dt;
                    if (scrubInput && (scrubTick = (scrubTick + 1) % 6) === 0) showScrub();
                }
                paint();
            });

            syncOutputs();
            paint();
        }"""

content = content.replace(old_lab_shell_mount, new_lab_shell_mount)

# 4. Add quiz lab toggle and configuration logic
quiz_lab_helpers = """
        function getQuizLabConfig(q) {
            if (!q) return null;
            const qid = questionId(q);
            const specificOverrides = {
                'AST-113-02': { lab: 'snell', mode: 'snell', guide: '💡 <b>光跨介質折射輔助思考</b>：調整折射率 $n$，觀察單色光由空氣進入玻璃時波長縮短、光速變慢，但振動頻率維持恆定！' },
                'AST-113-14': { lab: 'young', mode: 'young', guide: '💡 <b>雙狹縫干涉推理輔助思考</b>：拖曳波長 $\\\\lambda$、狹縫間隔 $d$ 與屏幕距離 $L$，觀察條紋間距 $\\\\Delta y = \\\\frac{\\\\lambda L}{d}$ 的增減，親自驗證 (A)(B)(C)(D) 選項！' },
                'AST-112-11': { lab: 'standing', mode: 'standing', guide: '💡 <b>干涉型消音器輔助思考</b>：聲波分流再會合，當兩路徑差滿足 $\\\\Delta L = (n+\\\\frac{1}{2})\\\\lambda$ 時產生破壞性干涉反相相消，達到最大降噪！' },
                'AST-112-18': { lab: 'snell', mode: 'snell', guide: '💡 <b>圓柱水瓶折射輔助思考</b>：調整入射角 $\\\\theta_1$ 與水折射率 $n_2$，觀察司乃耳定律 $\\\\frac{\\\\sin\\\\theta_1}{\\\\sin\\\\theta_2} = \\\\frac{v_1}{v_2} = \\\\frac{\\\\lambda_1}{\\\\lambda_2}$ 及跨介質週期 $T$ 不變！' },
                'AST-111-16': { lab: 'snell', mode: 'snell', guide: '💡 <b>平板壓克力折射輔助思考</b>：光線穿過平行厚平板時經兩次折射，出射方向與原入射光平行，但產生側向視位移！' },
                'AST-111-25': { lab: 'diffraction', mode: 'diffraction', guide: '💡 <b>開口繞射張角輔助思考</b>：由繞射暗紋公式 $a\\\\sin\\\\theta = n\\\\lambda$，當波長大於縫寬（$\\\\lambda > a$）時無暗紋解，波形呈 $180^\\\\circ$ 半球面均勻展開！' },
                'DRTE-110-17': { lab: 'ripple', mode: 'refract', guide: '💡 <b>水波深淺水折射輔助思考</b>：切換至「水波折射」模式，觀察直線波由深水進入淺水時波速變慢、波長縮短（波前變密）並偏向法線！' },
                'DRTE-110-23': { lab: 'young', mode: 'young', guide: '💡 <b>雙狹縫干涉 vs 單狹縫繞射</b>：對照雙狹縫條紋間距 $\\\\frac{\\\\lambda L}{d}$ 與單狹縫中央亮紋寬度 $2\\\\frac{\\\\lambda L}{a}$，在實驗中實測條紋寬度！' },
                'DRTE-109-06': { lab: 'pipes', mode: 'closed', guide: '💡 <b>開管 vs 閉管諧音輔助思考</b>：切換「開管」與「閉管」，比較開管基音 $f = \\\\frac{v}{2L}$ 與閉管第一泛音/第三諧音 $f = \\\\frac{3v}{4L\'}$ 的管長比！' },
                'DRTE-109-14': { lab: 'snell', mode: 'snell', guide: '💡 <b>平行斜面夾層折射輔助思考</b>：光線穿過兩側介質相同的平行夾層，出射光方向必與入射光平行（4、5、6 號線條）！' }
            };

            if (specificOverrides[qid]) {
                return {
                    labId: specificOverrides[qid].lab,
                    mode: specificOverrides[qid].mode,
                    guide: specificOverrides[qid].guide
                };
            }

            const nodeMetaLab = nodeMeta[q.node] ? nodeMeta[q.node].lab : null;
            if (!nodeMetaLab) return null;
            const labId = Array.isArray(nodeMetaLab) ? nodeMetaLab[0] : nodeMetaLab;
            if (!LABS[labId]) return null;

            return {
                labId,
                mode: null,
                guide: `💡 <b>觀念實作驗證</b>：動手調整下方實驗參數，即時觀察物理現象與波形變化，輔助思考本題解法！`
            };
        }

        function toggleQuizLab(qid, targetLabId, suggestedMode) {
            const box = document.getElementById(`quiz-lab-box-${qid}`);
            const btn = document.getElementById(`quiz-lab-btn-${qid}`);
            if (!box || !btn) return;

            if (box.style.display !== 'none') {
                if (activeQuizLabDisposers.has(qid)) {
                    activeQuizLabDisposers.get(qid).dispose();
                    activeQuizLabDisposers.delete(qid);
                }
                box.style.display = 'none';
                box.innerHTML = '';
                btn.classList.remove('is-open');
                btn.innerHTML = `🔬 動手做實驗：${labMeta[targetLabId] ? labMeta[targetLabId].name : '互動模擬'}`;
                return;
            }

            if (activeQuizLabDisposers.has(qid)) {
                activeQuizLabDisposers.get(qid).dispose();
                activeQuizLabDisposers.delete(qid);
            }

            const q = findQuestion(qid);
            const labConf = q ? getQuizLabConfig(q) : { labId: targetLabId, mode: suggestedMode, guide: '' };
            const labId = labConf ? labConf.labId : targetLabId;
            const mode = (labConf && labConf.mode) || suggestedMode || null;
            const guideHtml = (labConf && labConf.guide) ? `<div class="quiz-lab-guide">${labConf.guide}</div>` : '';

            const prefix = `q-${qid}-`;
            box.innerHTML = `
                ${guideHtml}
                ${labShellHtml(labId, prefix)}
            `;
            box.style.display = 'block';
            btn.classList.add('is-open');
            btn.innerHTML = `🔼 收合實驗（${labMeta[labId] ? labMeta[labId].name : '互動模擬'}）`;

            const disposers = WaveRuntime.createDisposerRegistry(`quiz-${qid}`);
            activeQuizLabDisposers.set(qid, disposers);
            mountLab(labId, mode, prefix, disposers);
            scheduleMathJax(box);
        }
"""

# Replace quizCardHtml to include the lab button and container
old_quiz_card = """            return `
                <div class="card quiz-card" id="quiz-${qid}" data-qid="${qid}">
                    <div class="quiz-meta">
                        ${examBadge}
                        ${sourceBadge}
                        <span class="quiz-tag" style="cursor:pointer;" onclick="navigateTo('node-${q.node}')">${q.node}　${nodeMeta[q.node].title}</span>
                        <span class="quiz-tag level-${q.level}">${q.level}</span>
                        <span class="quiz-tag">${q.type === 'multi' ? '多選' : '單選'}</span>
                        <span class="quiz-tag">${nodeMeta[q.node].section}</span>
                    </div>
                    <div class="quiz-q">${index + 1}. ${q.q}</div>
                    ${figHtml}
                    <div class="quiz-opts">${opts}</div>
                    <div class="quiz-actions">
                        <button class="chip-btn" onclick="submitQuiz('${qid}')">送出作答</button>
                        <button class="chip-btn" onclick="revealQuiz('${qid}')">直接看答案</button>
                        <button class="chip-btn" onclick="resetQuiz('${qid}')">重做</button>
                    </div>
                    <div class="quiz-exp" style="display:none;"><b>觀念總結：</b>${q.exp}</div>
                </div>`;"""

new_quiz_card = """            const labConf = getQuizLabConfig(q);
            const labBtn = labConf ? `<button type="button" class="chip-btn quiz-lab-btn" id="quiz-lab-btn-${qid}" onclick="toggleQuizLab('${qid}', '${labConf.labId}', '${labConf.mode || ''}')">🔬 動手做實驗：${labMeta[labConf.labId] ? labMeta[labConf.labId].name : '互動模擬'}</button>` : '';

            return `
                <div class="card quiz-card" id="quiz-${qid}" data-qid="${qid}">
                    <div class="quiz-meta">
                        ${examBadge}
                        ${sourceBadge}
                        <span class="quiz-tag" style="cursor:pointer;" onclick="navigateTo('node-${q.node}')">${q.node}　${nodeMeta[q.node].title}</span>
                        <span class="quiz-tag level-${q.level}">${q.level}</span>
                        <span class="quiz-tag">${q.type === 'multi' ? '多選' : '單選'}</span>
                        <span class="quiz-tag">${nodeMeta[q.node].section}</span>
                    </div>
                    <div class="quiz-q">${index + 1}. ${q.q}</div>
                    ${figHtml}
                    <div class="quiz-opts">${opts}</div>
                    <div class="quiz-actions">
                        <button class="chip-btn" onclick="submitQuiz('${qid}')">送出作答</button>
                        <button class="chip-btn" onclick="revealQuiz('${qid}')">直接看答案</button>
                        <button class="chip-btn" onclick="resetQuiz('${qid}')">重做</button>
                        ${labBtn}
                    </div>
                    <div class="quiz-exp" style="display:none;"><b>觀念總結：</b>${q.exp}</div>
                    <div class="quiz-lab-box" id="quiz-lab-box-${qid}" style="display:none;"></div>
                </div>`;"""

if 'quiz_lab_helpers' not in content:
    content = content.replace(old_quiz_card, quiz_lab_helpers + '\n' + new_quiz_card)

with open(html_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Successfully integrated quiz interactive labs into wave_optics_review.html!")
