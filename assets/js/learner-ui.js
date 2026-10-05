/* 學習介面與原有模擬分離；所有實驗仍沿用 WaveRuntime 的清理機制。 */
const CORE_NODES = ALL_NODES.filter(c => c !== 'N21');
const LEARNING_KEY = 'waveOptics.learning.v1';
const CHAPTER_INTROS = {
    1: ['波動', '看懂波形，分清波在前進與質點在振動。', 'N01'],
    2: ['聲波', '用疏密、駐波與共振，解釋聲音和樂器。', 'N08'],
    3: ['幾何光學', '先畫光線，再判斷折射方向與透鏡成像。', 'N13'],
    4: ['物理光學', '從波程差出發，分清干涉亮紋與繞射暗紋。', 'N18']
};
let quizPage = 0;
let formulaChapter = '1';
let mediaChapter = '1';
let examChapter = '1';
const QUIZ_PAGE_SIZE = 5;
const LESSON_LABS = {
    N01:{id:'transverse'}, N02:{id:'transverse'}, N03:{id:'reflection',mode:'fixed'},
    N04:{id:'standing',mode:'both'}, N05:{id:'huygens',mode:'lineHuygens'},
    N06:{id:'ripple',mode:'refract'}, N07:{id:'water_interference',mode:'2D'},
    N08:{id:'sound',mode:'medium'}, N09:{id:'longitudinal'},
    N10:{id:'pipes',mode:'open',params:{idx:1}}, N11:{id:'timbre'}, N12:{id:'pipes',mode:'closed',params:{idx:1}},
    N13:{id:'snell',params:{n1:1,n2:1.5,th1:30}}, N14:{id:'snell',params:{n1:1.35,n2:1,th1:20}},
    N15:{id:'snell',params:{n1:1.5,n2:1,th1:35}}, N16:{id:'lens'},N17:{id:'lens',params:{p:5,f:10}},
    N18:{id:'young',mode:'setup'},N19:{id:'young',mode:'setup'},N20:{id:'diffraction',mode:'huygens'}
};

function readLearning() {
    try {
        const saved = JSON.parse(localStorage.getItem(LEARNING_KEY) || '{}');
        return { done: Array.isArray(saved.done) ? saved.done.filter(c => ALL_NODES.includes(c)) : [], last: ALL_NODES.includes(saved.last) ? saved.last : null };
    } catch (_) { return { done: [], last: null }; }
}
function saveLearning(state) {
    try { localStorage.setItem(LEARNING_KEY, JSON.stringify(state)); return true; }
    catch (_) { return false; }
}
function followRoute(event, route) {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    switchMainView(null, route);
}
function routeLink(route, label, cls = '') {
    return `<a class="${cls}" href="#${encodeURIComponent(route)}" onclick="followRoute(event,'${route}')">${label}</a>`;
}
function lessonGuide(code) { return typeof learningGuide === 'undefined' ? null : learningGuide[code]; }
function nextCore(code) { const i = CORE_NODES.indexOf(code); return i >= 0 && i < CORE_NODES.length - 1 ? CORE_NODES[i + 1] : null; }

function buildNodeSidebar() {
    document.getElementById('node-nav-container').innerHTML = Object.keys(CHAPTER_INTROS).map(m => `
        <details class="chapter-nav" data-chapter="${m}">
            <summary>${m.padStart(2, '0')}　${CHAPTER_INTROS[m][0]}</summary>
            <ul class="nav-list">
                <li><a class="nav-item" href="#module-${m}" data-route="module-${m}" onclick="followRoute(event,'module-${m}')">本章學習順序</a></li>
                ${nodesOfModule(m).map(code => `<li><a class="nav-item nav-item-node" href="#node-${code}" data-route="node-${code}" onclick="followRoute(event,'node-${code}')"><span class="node-code-badge">${code.slice(1)}</span>${nodeMeta[code].title}${code === 'N21' ? '・延伸' : ''}</a></li>`).join('')}
            </ul>
        </details>`).join('');
    document.querySelectorAll('#sidebar [data-route]').forEach(a => a.setAttribute('href', `#${a.dataset.route}`));
}

function activateNavForRoute(route) {
    document.querySelectorAll('#sidebar .nav-item').forEach(el => { el.classList.remove('active'); el.removeAttribute('aria-current'); });
    const node = route.startsWith('node-') ? nodeMeta[route.slice(5)] : null;
    const chapter = node ? node.module : route.startsWith('module-') ? Number(route.slice(7)) : null;
    document.querySelectorAll('.chapter-nav').forEach(el => { el.open = Number(el.dataset.chapter) === chapter; });
    const target = Array.from(document.querySelectorAll('#sidebar [data-route]')).find(el => el.dataset.route === route || (route.startsWith('lab-') && el.dataset.route === 'tool-lab'));
    if (target) { target.classList.add('active'); target.setAttribute('aria-current', 'page'); const group = target.closest('details'); if (group) group.open = true; }
}

function renderHomeView() {
    const state = readLearning();
    const finished = CORE_NODES.filter(c => state.done.includes(c)).length;
    const start = state.last && !state.done.includes(state.last) ? state.last : CORE_NODES.find(c => !state.done.includes(c)) || 'N01';
    document.getElementById('main-content').innerHTML = `
        <div class="home-hero">
            <span class="view-eyebrow">高三・選修物理 III・波動與光學</span>
            <h2>從一個波，<br>看懂聲音與光。</h2>
            <p>先觀察現象，再用公式說明，最後做一道檢核。每次讀一小節，慢慢把四章串起來。</p>
            ${routeLink(`node-${start}`, `${state.last ? '接著學' : '從波動開始'} →`, 'lesson-primary')}
            <div class="lesson-actions"><span class="progress-note">${state.last ? `${nodeMeta[start].title}　｜　` : ''}已自行確認理解 ${finished} / ${CORE_NODES.length} 節</span></div>
            <div class="learning-progress" role="progressbar" aria-label="已自行確認理解的核心節數" aria-valuemin="0" aria-valuemax="${CORE_NODES.length}" aria-valuenow="${finished}"><span style="width:${finished / CORE_NODES.length * 100}%"></span></div>
        </div>
        <div class="study-flow" aria-label="每節學習順序">
            <div><b>01　看現象</b><p>帶著一個問題觀察實驗。</p></div>
            <div><b>02　懂關係</b><p>讀重點與例題，留意公式條件。</p></div>
            <div><b>03　試著解釋</b><p>答檢核，再決定是否往下學。</p></div>
        </div>
        <h3 class="section-title">依照課堂進度，選一章</h3>
        <div class="chapter-grid">${Object.entries(CHAPTER_INTROS).map(([m, [name, description]]) => {
            const count = nodesOfModule(m).filter(c => c !== 'N21').length;
            const done = nodesOfModule(m).filter(c => c !== 'N21' && state.done.includes(c)).length;
            return `<article class="chapter-card"><span class="chapter-number">CHAPTER ${m.padStart(2, '0')}</span><h3>${name}</h3><p>${description}</p>${routeLink(`module-${m}`, `學習順序 →　<span class="progress-note">${done} / ${count} 節</span>`)}</article>`;
        }).join('')}</div>
        <h3 class="section-title">需要時再用</h3>
        <div class="tool-shortcuts">${routeLink('tool-formula','找公式')}${routeLink('tool-lab','做實驗')}${routeLink('tool-compare','分清容易混淆的觀念')}${routeLink('tool-wrong','重練錯題')}</div>
        <details class="lesson-disclosure"><summary>先備工具：常用符號與單位</summary><div class="disclosure-content"><div class="edu-table-container"><table class="edu-table"><thead><tr><th>物理量</th><th>符號・單位</th><th>怎麼讀</th></tr></thead><tbody>
            <tr><td>波速</td><td>$v$・m/s</td><td>波形每秒前進多遠。</td></tr><tr><td>頻率</td><td>$f$・Hz</td><td>每秒振動幾次；$1\\,\\mathrm{Hz}=1\\,\\mathrm{s^{-1}}$。</td></tr><tr><td>週期</td><td>$T$・s</td><td>振動一次所需時間；$T=1/f$。</td></tr><tr><td>波長</td><td>$\\lambda$・m</td><td>同時刻沿傳播方向，相鄰同相位位置的距離。</td></tr><tr><td>振幅</td><td>$A$・m</td><td>質點偏離平衡位置的最大距離。</td></tr><tr><td>折射率</td><td>$n$・無單位</td><td>真空光速與介質光速的比值。</td></tr><tr><td>透鏡</td><td>$p,q,f$・m 或 cm</td><td>物距、像距、焦距；這裡的 $f$ 表示焦距，要依情境區分。</td></tr>
            </tbody></table></div><p class="progress-note">換單位：1 cm = 10⁻² m，1 mm = 10⁻³ m，1 μm = 10⁻⁶ m，1 nm = 10⁻⁹ m。代公式前先統一長度單位。</p></div></details>
        <p class="progress-note" style="margin-top:1rem">學習紀錄只存在目前瀏覽器。延伸內容可等核心觀念熟悉後再看。</p>`;
}

function renderModuleView(moduleNum) {
    const mod = modulesData[moduleNum];
    if (!mod) { renderHomeView(); return; }
    const state = readLearning();
    const core = nodesOfModule(moduleNum).filter(c => c !== 'N21');
    const extensions = nodesOfModule(moduleNum).filter(c => c === 'N21');
    const list = codes => `<div class="node-list">${codes.map(code => routeLink(`node-${code}`, `<span class="node-status">${state.done.includes(code) ? '✓ 已確認' : code.slice(1)}</span><div><strong>${nodeMeta[code].title}</strong><p>${lessonGuide(code)?.goal || ''}</p></div>`)).join('')}</div>`;
    document.getElementById('main-content').innerHTML = `
        <div class="view-header"><span class="view-eyebrow">CHAPTER ${String(moduleNum).padStart(2,'0')}・選修物理 III</span><h2>${CHAPTER_INTROS[moduleNum][0]}</h2><p>${CHAPTER_INTROS[moduleNum][1]}</p></div>
        <h3 class="section-title">本章學習順序</h3>${list(core)}
        <details class="lesson-disclosure"><summary>把本章串起來：概念圖</summary><div class="disclosure-content">${mod.conceptMap}</div></details>
        ${extensions.length ? `<details class="lesson-disclosure"><summary>延伸選讀：都卜勒效應</summary><div class="disclosure-content">${list(extensions)}</div></details>` : ''}
        <details class="lesson-disclosure"><summary>跨章與生活應用・延伸選讀</summary><div class="disclosure-content">${mod.extensions}</div></details>`;
}

function lessonTextHtml(value) {
    return String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
function resonanceCaseHtml(item, index) {
    const media = animData[item.mediaKey];
    if (!media?.youtubeId) return '';
    const title = lessonTextHtml(item.title);
    return `<article class="resonance-case">
        <span class="resonance-category">${lessonTextHtml(item.category)} · ${String(index + 1).padStart(2,'0')}</span>
        <h4>${title}</h4>
        <p class="resonance-question"><b>帶著問題看</b>${lessonTextHtml(item.question)}</p>
        <details class="resonance-player" ontoggle="toggleResonanceVideo(this)">
            <summary>觀看影片：${title}</summary>
            <div class="resonance-video ${media.isVertical ? 'resonance-video-vertical' : ''}" data-youtube-id="${media.youtubeId}" data-video-title="${title}"></div>
        </details>
        <a class="resonance-original" href="${media.youtubeUrl}" target="_blank" rel="noopener">在 YouTube 開啟：${title} ↗</a>
        <p class="resonance-credit">影片來源：${lessonTextHtml(media.credit || '')}</p>
        <details class="resonance-verdict"><summary>觀察後核對物理機制</summary><p>${lessonTextHtml(item.explanation)}</p></details>
    </article>`;
}
function resonanceCasesHtml(guide) {
    if (!guide?.resonanceCases?.length) return '';
    const cases = guide.resonanceCases;
    const group = extension => cases.map((item,index) => ({item,index})).filter(({item}) => item.category.includes('延伸') === extension).map(({item,index}) => resonanceCaseHtml(item,index)).join('');
    return `<section class="resonance-study" aria-labelledby="resonance-study-title">
        <h3 class="section-title" id="resonance-study-title">用五段影片，看懂振動為何增強</h3>
        <p class="resonance-intro">先預測，再看片；最後展開判讀，說明誰在驅動、誰在振動，以及能量從哪裡來。</p>
        <ol class="resonance-steps">${(guide.resonanceSteps || []).map(step => `<li><b>${lessonTextHtml(step.title)}</b><p>${lessonTextHtml(step.text)}</p></li>`).join('')}</ol>
        <div class="resonance-case-grid">${group(false)}</div>
        <div class="resonance-extension-heading"><h4>延伸辨析：同步與顫振</h4><p>觀察到整齊擺動或振幅變大，還需要辨認背後的機制。</p></div>
        <div class="resonance-case-grid">${group(true)}</div>
        <p class="resonance-intro">若內嵌影片無法播放，可使用各卡片的 YouTube 原始連結。</p>
    </section>`;
}
function toggleResonanceVideo(details) {
    const host = details.querySelector('[data-youtube-id]');
    if (!host) return;
    if (!details.open) { host.replaceChildren(); return; }
    if (host.querySelector('iframe')) return;
    const frame = document.createElement('iframe');
    frame.src = `https://www.youtube.com/embed/${host.dataset.youtubeId}`;
    frame.title = host.dataset.videoTitle;
    frame.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    frame.referrerPolicy = 'strict-origin-when-cross-origin';
    frame.allowFullscreen = true;
    host.appendChild(frame);
}
function resonanceChecksHtml(code, guide) {
    if (!guide?.resonanceChecks?.length) return '';
    return `<section class="resonance-review" aria-labelledby="resonance-review-title">
        <h3 class="section-title" id="resonance-review-title">看完影片，再判斷一次</h3>
        ${guide.resonanceChecks.map((check,index) => `<article class="lesson-check"><h4>${index + 1}. ${lessonTextHtml(check.q)}</h4><div class="check-options">${check.opts.map((option,choice) => `<button type="button" aria-pressed="false" onclick="answerResonanceCheck('${code}',${index},${choice},this)">${lessonTextHtml(option)}</button>`).join('')}</div><div class="check-feedback" id="resonance-feedback-${index}" role="status" aria-live="polite"></div></article>`).join('')}
        ${guide.resonanceSources?.length ? `<details class="lesson-disclosure"><summary>概念查核與延伸閱讀</summary><ul class="resonance-sources">${guide.resonanceSources.map(source => `<li><a href="${source.url}" target="_blank" rel="noopener">${lessonTextHtml(source.title)} ↗</a></li>`).join('')}</ul></details>` : ''}
    </section>`;
}
function answerResonanceCheck(code, index, choice, button) {
    const check = lessonGuide(code).resonanceChecks[index];
    button.closest('.check-options').querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
    document.getElementById(`resonance-feedback-${index}`).innerHTML = `<b>${choice === check.answer ? '答對了。' : '再想一想。'}</b> ${lessonTextHtml(check.explanation)}`;
}
function openResonanceStudy() {
    document.getElementById('resonance-study-title')?.scrollIntoView({behavior:WaveRuntime.prefersReducedMotion() ? 'instant' : 'smooth', block:'start'});
}
function openSwingWork() {
    document.getElementById('swing-work')?.scrollIntoView({behavior:WaveRuntime.prefersReducedMotion() ? 'instant' : 'smooth', block:'start'});
}

function renderNodeView(code) {
    const meta = nodeMeta[code];
    if (!meta) { renderHomeView(); return; }
    const guide = lessonGuide(code);
    const mod = modulesData[meta.module];
    const state = readLearning(); state.last = code; saveLearning(state);
    const formulas = itemsForNode(mod.formulas, code);
    const features = itemsForNode(mod.keyFeatures, code);
    const exams = itemsForNode(mod.examQuestions, code);
    const labs = labsOfNode(code).filter(l => labMeta[l]);
    const activity = LESSON_LABS[code];
    const primaryLab = activity?.id;
    const featuredMedia = (guide?.resonanceCases || []).map(item => item.mediaKey);
    const remainingMedia = (animByNode[code] || []).filter(key => !featuredMedia.includes(key));
    const activityLabel = code === 'N12' ? '觀察空氣柱的駐波 →' : '開啟實驗觀察 →';
    const activityButton = activity?.page ? `<a class="lesson-secondary" href="${activity.page}">${activityLabel}</a>` : primaryLab ? routeLink(`lab-${primaryLab}:${activity.mode || 'default'}:${code}`, activityLabel, 'lesson-secondary') : '';
    const observationActions = guide?.resonanceCases?.length
        ? `<div class="lesson-actions"><button type="button" class="lesson-primary" onclick="openSwingWork()">操作盪鞦韆 ↓</button><button type="button" class="lesson-secondary" onclick="openResonanceStudy()">看五段影片 ↓</button>${activityButton}</div>`
        : activityButton || ((animByNode[code] || []).length ? '<button class="lesson-secondary" onclick="openLessonMedia()">看動畫觀察 →</button>' : '');
    const sequence = code === 'N21' ? ['N21'] : CORE_NODES;
    const i = sequence.indexOf(code), prev = sequence[i - 1], next = sequence[i + 1];
    const formulaHtml = formulas.map(f => `<article class="card formula-card"><h4>${f.name}${[].concat(f.node).includes("N21") ? "・延伸選讀" : ""}</h4><div class="formula-box">$$${f.formula}$$</div><p class="formula-anchor">${f.anchor}</p><details class="formula-detail"><summary>公式怎麼用・條件與說明</summary><div class="formula-desc">${f.desc}</div></details></article>`).join('');
    const extraFeatures = features.length ? `<details class="lesson-disclosure"><summary>練習前再看：解題提醒</summary><div class="disclosure-content">${features.map(k => `<article class="card feature-card"><div class="feature-line"><span class="feature-label label-feature">看到什麼</span>${k.feature}</div><div class="feature-line"><span class="feature-label label-bridge">怎麼連結</span>${k.bridge}</div><div class="feature-line"><span class="feature-label label-trap">留意</span>${k.trap}</div></article>`).join('')}</div></details>` : '';
    const examHtml = exams.length ? `<details class="lesson-disclosure"><summary>進一步練習：大考與段考題型（${exams.length}）</summary><div class="disclosure-content">${exams.map(e => `<article class="card exam-card"><span class="exam-year">${e.year}</span><h4>${e.title}</h4>${e.image ? `<img class="quiz-fig-img" src="${e.image}" alt="${e.imageCaption || '題型分析圖'}" loading="lazy">` : ''}<p>${e.desc}</p></article>`).join('')}</div></details>` : '';
    document.getElementById('main-content').innerHTML = `
        <div class="view-header"><span class="view-eyebrow">${CHAPTER_INTROS[meta.module][0]}・${code === 'N21' ? '延伸選讀' : `第 ${nodesOfModule(meta.module).indexOf(code) + 1} 節`}</span><h2>${meta.title}</h2>${guide ? `<div class="lesson-goal"><span class="lesson-kicker">這節要學會</span><p>${guide.goal}</p></div>` : ''}
        ${guide?.prerequisites.length ? `<div class="prerequisites"><span>先備觀念</span>${guide.prerequisites.map(c => routeLink(`node-${c}`, nodeMeta[c].title)).join('')}</div>` : ''}</div>
        ${guide ? `<section class="observe-card"><span class="lesson-kicker">01　先觀察</span><p>${guide.observe}</p>${observationActions}</section>` : ''}
        ${code === 'N12' ? SwingWork.html() : ''}
        <h3 class="section-title">02　抓住核心關係</h3>${guide ? `<p class="takeaway">${guide.takeaway}</p>` : ''}${formulaHtml}
        ${resonanceCasesHtml(guide)}
        ${guide?.example ? `<section class="worked-example"><span class="lesson-kicker">跟著做一題</span><h3>${guide.example.title}</h3><p>${guide.example.given}</p><ol>${guide.example.steps.map(step => `<li>${step}</li>`).join('')}</ol><p class="example-result">${guide.example.result}</p></section>` : ''}
        ${guide?.check ? `<section class="lesson-check"><span class="lesson-kicker">03　檢查自己是否理解</span><h3>${guide.check.q}</h3><div class="check-options">${guide.check.opts.map((o, n) => `<button type="button" aria-pressed="false" onclick="answerLessonCheck('${code}',${n},this)">${o}</button>`).join('')}</div><div class="check-feedback" id="lesson-feedback" role="status" aria-live="polite"></div></section>` : ''}
        ${resonanceChecksHtml(code, guide)}
        ${remainingMedia.length ? `<details id="lesson-media" class="lesson-disclosure"><summary>用動畫再看一次</summary><div class="disclosure-content">${animSectionForNode(code, featuredMedia)}</div></details>` : ''}
        ${extraFeatures}${examHtml}
        ${labs.length > 1 ? `<details class="lesson-disclosure"><summary>其他相關實驗${labs.includes('optical_bench') ? '・含延伸工作臺' : ''}</summary><div class="disclosure-content tool-shortcuts">${labs.filter(l => l !== primaryLab).map(l => routeLink(`lab-${l}`,labMeta[l].name)).join('')}</div></details>` : ''}
        <section class="lesson-finish"><p>試著不用看公式，說明本節的重點。能說清楚再自行確認理解。</p><div class="lesson-actions"><button id="lesson-done" class="lesson-primary" aria-pressed="${state.done.includes(code)}" onclick="toggleLessonDone('${code}')">${state.done.includes(code) ? '✓ 已確認理解・點此取消' : '我能說明本節重點'}</button><button class="lesson-secondary" onclick="openBankForNode('${code}')">練本節觀念題</button></div><p id="learning-save-feedback" class="progress-note" role="status"></p><div class="lesson-neighbors">${prev ? routeLink(`node-${prev}`, `← ${nodeMeta[prev].title}`) : routeLink(`module-${meta.module}`, '← 本章學習順序')}${next ? routeLink(`node-${next}`, `${nodeMeta[next].title} →`) : routeLink('home', '回到學習首頁 →')}</div></section>`;
    bindAnimsIn(remainingMedia);
    if (code === 'N12') SwingWork.mount(document.getElementById('swing-work'), activeDisposers);
}

function openLessonMedia() {
    const details = document.getElementById('lesson-media');
    if (details) { details.open = true; details.scrollIntoView({behavior: WaveRuntime.prefersReducedMotion() ? 'instant' : 'smooth', block:'start'}); }
}
function answerLessonCheck(code, choice, button) {
    const check = lessonGuide(code).check;
    button.closest('.check-options').querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
    const feedback = document.getElementById('lesson-feedback');
    feedback.innerHTML = `<b>${choice === check.answer ? '答對了。' : '再想一想。'}</b> ${check.explanation}`;
    scheduleMathJax(feedback);
}
function toggleLessonDone(code) {
    const state = readLearning();
    const done = !state.done.includes(code);
    state.done = done ? [...state.done, code] : state.done.filter(c => c !== code);
    const saved = saveLearning(state);
    const button = document.getElementById('lesson-done');
    if (saved) { button.setAttribute('aria-pressed', String(done)); button.textContent = done ? '✓ 已確認理解・點此取消' : '我能說明本節重點'; }
    document.getElementById('learning-save-feedback').textContent = saved ? '已儲存在目前瀏覽器。' : '目前瀏覽器無法儲存，仍可繼續學習。';
}

function setQuizFilter(kind, value) {
    quizFilter[kind] = value; quizPage = 0;
    cleanupCurrentView(); renderQuizView(); scheduleMathJax();
}
function changeQuizPage(delta) {
    quizPage += delta; cleanupCurrentView(); renderQuizView(); scheduleMathJax();
    window.scrollTo({top:0, behavior:'instant'});
}
function openBankForNode(code) {
    quizFilter.node = code; quizFilter.level = '記憶'; quizFilter.source = 'concept'; quizPage = 0;
    if (lastRenderedRoute === 'tool-quiz') { cleanupCurrentView(); renderQuizView(); scheduleMathJax(); }
    else navigateTo('tool-quiz');
}
function renderQuizView() {
    const list = questionBank.filter(q => (quizFilter.node === 'all' || q.node === quizFilter.node) && (quizFilter.level === 'all' || q.level === quizFilter.level) && (quizFilter.source === 'all' || (quizFilter.source === 'exam' ? Boolean(q.examYear) : !q.examYear)));
    const pages = Math.max(1,Math.ceil(list.length / QUIZ_PAGE_SIZE));
    quizPage = Math.max(0,Math.min(quizPage,pages - 1));
    const start = quizPage * QUIZ_PAGE_SIZE;
    const options = (pairs, selected) => pairs.map(([value,label]) => `<option value="${value}" ${selected === value ? 'selected' : ''}>${label}</option>`).join('');
    document.getElementById('main-content').innerHTML = `
        <div class="view-header"><span class="view-eyebrow">觀念練習</span><h2>一次練一個重點</h2><p>第一次學，從「記憶」與「理解」開始。觀念穩定後，再練「應用」、 「分析」或歷屆試題。答錯會存入錯題本。</p></div>
        <div class="quiz-filter-bar">
            <label>學習主題<select onchange="setQuizFilter('node',this.value)">${options([['all','全部主題'],...ALL_NODES.map(c => [c, `${nodeMeta[c].title}${c === 'N21' ? '（延伸）' : ''}`])],quizFilter.node)}</select></label>
            <label>難度<select onchange="setQuizFilter('level',this.value)">${options([['all','全部難度'],...QUIZ_LEVELS.map(l => [l,l])],quizFilter.level)}</select></label>
            <label>題目來源<select onchange="setQuizFilter('source',this.value)">${options([['concept','觀念題'],['exam','歷屆試題'],['all','全部來源']],quizFilter.source)}</select></label>
        </div><p class="quiz-count">${list.length ? `共 ${list.length} 題・目前第 ${start + 1}–${Math.min(start + QUIZ_PAGE_SIZE,list.length)} 題` : '此篩選沒有題目，可切換難度或來源。'}${quizFilter.node !== 'all' ? `　${routeLink(`node-${quizFilter.node}`,'回看本節重點')}` : ''}</p>
        ${list.slice(start,start + QUIZ_PAGE_SIZE).map((q,i) => quizCardHtml(q,start+i)).join('')}
        ${pages > 1 ? `<div class="quiz-pagination"><button class="lesson-secondary" onclick="changeQuizPage(-1)" ${quizPage === 0 ? 'disabled' : ''}>上一頁</button><span class="progress-note">${quizPage + 1} / ${pages}</span><button class="lesson-secondary" onclick="changeQuizPage(1)" ${quizPage === pages - 1 ? 'disabled' : ''}>下一頁</button></div>` : ''}`;
}

function renderLabIndex() {
    const card = id => `<article class="chapter-card"><h3>${labMeta[id].name}</h3><p>${labMeta[id].desc}</p>${routeLink(`lab-${id}`,'開始觀察 →')}</article>`;
    const groups = Object.keys(CHAPTER_INTROS).map(m => {
        const ids = Object.keys(labMeta).filter(id => id !== 'optical_bench' && nodesOfLab(id).some(c => nodeMeta[c].module === Number(m)));
        return `<h3 class="section-title">${CHAPTER_INTROS[m][0]}</h3><div class="chapter-grid">${ids.map(card).join('')}</div>`;
    }).join('');
    document.getElementById('main-content').innerHTML = `<div class="view-header"><span class="view-eyebrow">互動實驗室</span><h2>把觀念變成看得見的現象</h2><p>一次只改一個參數，先預測結果，再觀察變化。可暫停、逐格播放，或回到預設值重看。</p></div>${groups}<details class="lesson-disclosure"><summary>延伸探究：3D 多元件光學工作臺</summary><div class="disclosure-content">${card('optical_bench')}</div></details>`;
}
function renderSingleLabView(rawId) {
    const [id,initialMode,fromCode] = String(rawId).split(':');
    if (!LABS[id]) { renderLabIndex(); return; }
    const nodes = nodesOfLab(id).slice();
    const modeCode = id === 'ripple' ? (initialMode === 'interfere' || initialMode === 'diffract' ? 'N07' : 'N06') : null;
    const code = ALL_NODES.includes(fromCode) && LESSON_LABS[fromCode]?.id === id ? fromCode : modeCode || nodes[0];
    if (code && !nodes.includes(code)) nodes.unshift(code);
    const guide = lessonGuide(code);
    const preset = code === fromCode ? LESSON_LABS[code]?.params : null;
    document.getElementById('main-content').innerHTML = `<div class="view-header"><span class="view-eyebrow">${id === 'optical_bench' ? '延伸探究' : '互動實驗'}</span><h2>${labMeta[id].name}</h2></div>${guide && id !== 'optical_bench' ? `<div class="lab-observation"><b>帶著一個問題看</b>${guide.labObserve || guide.observe}</div>` : ''}${labShellHtml(id)}<div class="lesson-actions">${nodes.map(c => routeLink(`node-${c}`, `回看：${nodeMeta[c].title}`, 'lesson-secondary')).join('')}${routeLink('tool-lab','其他實驗','lesson-secondary')}</div>`;
    mountLab(id,initialMode || null,'',null,preset);
}

function setFormulaChapter(value) { formulaChapter = value; renderFormulaSheet(); scheduleMathJax(); }
function setMediaChapter(value) { mediaChapter = value; cleanupCurrentView(); renderAnimIndex(); scheduleMathJax(); }
function setExamChapter(value) { examChapter = value; renderExamIndexView(); scheduleMathJax(); }
function chapterFilterHtml(selected, handler) {
    return `<label class="chapter-select">章節<select onchange="${handler}(this.value)">${[['1','波動'],['2','聲波'],['3','幾何光學'],['4','物理光學'],['all','全部章節']].map(([v,l]) => `<option value="${v}" ${selected === v ? 'selected' : ''}>${l}</option>`).join('')}</select></label>`;
}
function renderFormulaSheet() {
    const chapters = formulaChapter === 'all' ? Object.keys(modulesData) : [formulaChapter];
    const rows = chapters.map(m => `<h3 class="section-title">${CHAPTER_INTROS[m][0]}</h3>${modulesData[m].formulas.map(f => `<article class="card formula-card"><h4>${f.name}${[].concat(f.node).includes("N21") ? "・延伸選讀" : ""}</h4><div class="formula-box">$$${f.formula}$$</div><p class="formula-anchor">${f.anchor}</p><details class="formula-detail"><summary>適用條件與說明</summary><div class="formula-desc">${f.desc}</div></details><div class="prerequisites">${[].concat(f.node).map(c => routeLink(`node-${c}`,`回看：${nodeMeta[c].title}`)).join('')}</div></article>`).join('')}`).join('');
    document.getElementById('main-content').innerHTML = `<div class="view-header"><span class="view-eyebrow">複習工具</span><h2>公式速查</h2><p>先選章節，確認公式的物理意義與使用條件，再代入數值。</p></div><label class="chapter-select print-hide">章節<select onchange="setFormulaChapter(this.value)">${[['1','波動'],['2','聲波'],['3','幾何光學'],['4','物理光學'],['all','全部章節（列印用）']].map(([v,l]) => `<option value="${v}" ${formulaChapter === v ? 'selected' : ''}>${l}</option>`).join('')}</select></label>${rows}`;
}

/* 舊有資料中的可點卡片也能用鍵盤啟動；不改動模擬畫布與滑桿。 */
document.addEventListener('keydown', event => {
    if (event.target.matches('[role="button"][tabindex="0"]') && ['Enter',' '].includes(event.key)) { event.preventDefault(); event.target.click(); }
});
const learningObserver = new MutationObserver(() => {
    document.querySelectorAll('#main-content .module-card[onclick], #main-content .module-node-chip[onclick]').forEach(el => { if (!['A','BUTTON'].includes(el.tagName)) { el.setAttribute('role','button'); el.setAttribute('tabindex','0'); } });
});
learningObserver.observe(document.getElementById('main-content'), { childList:true, subtree:true });
