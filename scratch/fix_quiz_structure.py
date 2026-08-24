import re

html_path = 'wave_optics_review.html'

with open(html_path, 'r', encoding='utf-8') as f:
    text = f.read()

# Clean up and reconstruct the quiz section properly
correct_section = r"""        function questionId(q) {
            return q.id || `${q.node}-${q.level}`;
        }

        function getQuizLabConfig(q) {
            if (!q) return null;
            const qid = questionId(q);
            const specificOverrides = {
                'AST-113-02': { lab: 'snell', mode: 'snell', guide: '💡 <b>光跨介質折射輔助思考</b>：調整折射率 $n$，觀察單色光由空氣進入玻璃時波長縮短、光速變慢，但振動頻率維持恆定！' },
                'AST-113-14': { lab: 'young', mode: 'young', guide: '💡 <b>雙狹縫干涉推理輔助思考</b>：拖曳波長 $\\lambda$、狹縫間隔 $d$ 與屏幕距離 $L$，觀察條紋間距 $\\Delta y = \\frac{\\lambda L}{d}$ 的增減，親自驗證 (A)(B)(C)(D) 選項！' },
                'AST-112-11': { lab: 'standing', mode: 'standing', guide: '💡 <b>干涉型消音器輔助思考</b>：聲波分流再會合，當兩路徑差滿足 $\\Delta L = (n+\\frac{1}{2})\\lambda$ 時產生破壞性干涉反相相消，達到最大降噪！' },
                'AST-112-18': { lab: 'snell', mode: 'snell', guide: '💡 <b>圓柱水瓶折射輔助思考</b>：調整入射角 $\\theta_1$ 與水折射率 $n_2$，觀察司乃耳定律 $\\frac{\\sin\\theta_1}{\\sin\\theta_2} = \\frac{v_1}{v_2} = \\frac{\\lambda_1}{\\lambda_2}$ 及跨介質週期 $T$ 不變！' },
                'AST-111-16': { lab: 'snell', mode: 'snell', guide: '💡 <b>平板壓克力折射輔助思考</b>：光線穿過平行厚平板時經兩次折射，出射方向與原入射光平行，但產生側向視位移！' },
                'AST-111-25': { lab: 'diffraction', mode: 'diffraction', guide: '💡 <b>開口繞射張角輔助思考</b>：由繞射暗紋公式 $a\\sin\\theta = n\\lambda$，當波長大於縫寬（$\\lambda > a$）時無暗紋解，波形呈 $180^\\circ$ 半球面均勻展開！' },
                'DRTE-110-17': { lab: 'ripple', mode: 'refract', guide: '💡 <b>水波深淺水折射輔助思考</b>：切換至「水波折射」模式，觀察直線波由深水進入淺水時波速變慢、波長縮短（波前變密）並偏向法線！' },
                'DRTE-110-23': { lab: 'young', mode: 'young', guide: '💡 <b>雙狹縫干涉 vs 單狹縫繞射</b>：對照雙狹縫條紋間距 $\\frac{\\lambda L}{d}$ 與單狹縫中央亮紋寬度 $2\\frac{\\lambda L}{a}$，在實驗中實測條紋寬度！' },
                'DRTE-109-06': { lab: 'pipes', mode: 'closed', guide: "💡 <b>開管 vs 閉管諧音輔助思考</b>：切換「開管」與「閉管」，比較開管基音 $f = \\frac{v}{2L}$ 與閉管第一泛音/第三諧音 $f = \\frac{3v}{4L'}$ 的管長比！" },
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

        function quizCardHtml(q, index) {
            const qid = questionId(q);
            const opts = q.opts.map((o, i) =>
                `<button type="button" class="quiz-opt" data-i="${i}" onclick="pickQuizOption('${qid}', ${i})">${o.t}<span class="quiz-why" style="display:none;">${o.why}</span></button>`
            ).join('');
            const examBadge = q.examYear ? `<span class="quiz-tag exam-badge">🎯 ${q.examYear}</span>` : '';
            const sourceBadge = q.source ? `<span class="quiz-tag source-badge">${q.source}</span>` : '';
            const figHtml = q.image ? `
                <div class="quiz-fig-box">
                    <div class="quiz-fig-header">
                        <span class="quiz-fig-seal">🏛️ 大考中心官方試題卷原始截圖</span>
                        <span class="quiz-fig-src">${q.source || q.examYear}</span>
                    </div>
                    <img src="${q.image}" alt="${q.imageCaption || '試題配圖'}" class="quiz-fig-img" loading="lazy" />
                    ${q.imageCaption ? `<div class="quiz-fig-cap">📌 ${q.imageCaption}</div>` : ''}
                </div>` : '';

            const labConf = getQuizLabConfig(q);
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
                </div>`;
        }"""

# Find the start of function questionId(q) and end before function findQuestion(qid)
pattern = r"function questionId\(q\)\s*\{[\s\S]*?function findQuestion\(qid\)"
match = re.search(pattern, text)
if match:
    text = text[:match.start()] + correct_section + "\n\n        function findQuestion(qid)" + text[match.end():]
    with open(html_path, 'w', encoding='utf-8') as f:
        f.write(text)
    print("Successfully structured quizCardHtml and quiz lab functions!")
else:
    print("Error: Could not find regex pattern match!")
