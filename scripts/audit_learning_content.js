// Checks the new learner metadata and script syntax without a browser dependency.
const fs = require('fs');
const vm = require('vm');
const assert = require('assert/strict');
const ctx = vm.createContext({});
for (const file of ['data/modulesData.js','data/learningGuide.js','data/questionBank.js','data/mediaData.js']) {
    vm.runInContext(fs.readFileSync(file,'utf8'),ctx,{filename:file});
}
const content = vm.runInContext('({nodeMeta,labMeta,learningGuide,questionBank,animData,animByNode})',ctx);
const {nodeMeta,labMeta,learningGuide,questionBank,animData,animByNode} = content;
function assertText(value, field) {
    assert.ok(typeof value === 'string' && value.trim(), `${field} must be nonempty text`);
}
function assertHttpsUrl(value, field) {
    assertText(value, field);
    const url = new URL(value);
    assert.equal(url.protocol, 'https:', `${field} must use HTTPS`);
    assert.ok(!url.username && !url.password, `${field} must not contain credentials`);
    return url;
}
function auditResonanceGuide(code, guide) {
    for (const field of ['resonanceSteps','resonanceCases','resonanceChecks','resonanceSources']) {
        if (guide[field] === undefined) continue;
        assert.ok(Array.isArray(guide[field]) && guide[field].length, `${code}.${field} must be a nonempty array`);
    }
    for (const [index, step] of (guide.resonanceSteps || []).entries()) {
        for (const field of ['title','text']) assertText(step[field], `${code}.resonanceSteps[${index}].${field}`);
    }
    const mediaKeys = new Set();
    const youtubeIds = new Set();
    for (const [index, item] of (guide.resonanceCases || []).entries()) {
        const label = `${code}.resonanceCases[${index}]`;
        for (const field of ['mediaKey','category','title','question','explanation']) assertText(item[field], `${label}.${field}`);
        assert.ok(!mediaKeys.has(item.mediaKey), `${label}: duplicate media key ${item.mediaKey}`);
        mediaKeys.add(item.mediaKey);
        const media = animData[item.mediaKey];
        assert.ok(media, `${label}: unknown media ${item.mediaKey}`);
        assert.ok((animByNode[code] || []).includes(item.mediaKey), `${label}: media must be assigned to ${code}`);
        assert.match(media.youtubeId, /^[\w-]{11}$/, `${label}: invalid YouTube ID`);
        assert.ok(!youtubeIds.has(media.youtubeId), `${label}: duplicate YouTube ID ${media.youtubeId}`);
        youtubeIds.add(media.youtubeId);
        for (const field of ['title','credit','lead','misconception']) assertText(media[field], `${label}.media.${field}`);
        assert.equal(typeof media.isVertical, 'boolean', `${label}.media.isVertical`);
        assert.ok(Array.isArray(media.points) && media.points.length, `${label}.media.points`);
        media.points.forEach((point, pointIndex) => assertText(point, `${label}.media.points[${pointIndex}]`));
        const url = assertHttpsUrl(media.youtubeUrl, `${label}.media.youtubeUrl`);
        assert.equal(url.hostname, 'www.youtube.com', `${label}: canonical YouTube hostname`);
        const canonical = url.pathname === '/watch' ? `https://www.youtube.com/watch?v=${media.youtubeId}` : `https://www.youtube.com/shorts/${media.youtubeId}`;
        assert.equal(url.href, canonical, `${label}: YouTube URL must match its ID without tracking parameters`);
    }
    for (const [index, check] of (guide.resonanceChecks || []).entries()) {
        const label = `${code}.resonanceChecks[${index}]`;
        for (const field of ['q','explanation']) assertText(check[field], `${label}.${field}`);
        assert.ok(Array.isArray(check.opts) && check.opts.length >= 2, `${label}.opts`);
        check.opts.forEach((option, choice) => assertText(option, `${label}.opts[${choice}]`));
        assert.equal(new Set(check.opts).size, check.opts.length, `${label}: duplicate answer choices`);
        assert.ok(Number.isInteger(check.answer) && check.answer >= 0 && check.answer < check.opts.length, `${label}.answer`);
    }
    const sourceUrls = new Set();
    for (const [index, source] of (guide.resonanceSources || []).entries()) {
        const label = `${code}.resonanceSources[${index}]`;
        assertText(source.title, `${label}.title`);
        const url = assertHttpsUrl(source.url, `${label}.url`);
        assert.ok(!sourceUrls.has(url.href), `${label}: duplicate source URL`);
        sourceUrls.add(url.href);
    }
}
assert.equal(Object.keys(nodeMeta).length,21);
assert.deepEqual(Object.keys(learningGuide).sort(),Object.keys(nodeMeta).sort());
for (const [code,guide] of Object.entries(learningGuide)) {
    if (guide.labObserve !== undefined) assertText(guide.labObserve, `${code}.labObserve`);
    for (const field of ['goal','observe','takeaway']) assert.ok(guide[field]?.trim(), `${code}.${field}`);
    assert.ok(['核心','延伸'].includes(guide.level), `${code}.level`);
    assert.ok(Array.isArray(guide.prerequisites),`${code}.prerequisites`);
    for (const prereq of guide.prerequisites) assert.ok(nodeMeta[prereq] && prereq !== code,`${code} prerequisite ${prereq}`);
    assert.ok(guide.example?.given && guide.example.result && guide.example.title,`${code}.example`);
    assert.ok(guide.example.steps.length > 0 && guide.example.steps.every(s => typeof s === 'string' && s.length),`${code}.steps`);
    const check = guide.check;
    assert.ok(check.q && check.explanation && check.opts.length >= 2,`${code}.check`);
    assert.ok(Number.isInteger(check.answer) && check.answer >= 0 && check.answer < check.opts.length,`${code}.answer`);
    for (const lab of [].concat(nodeMeta[code].lab || [])) assert.ok(labMeta[lab],`${code}.lab ${lab}`);
    for (const animation of animByNode[code] || []) assert.ok(animData[animation],`${code}.animation ${animation}`);
    auditResonanceGuide(code, guide);
}
function visit(code,path=[]) {
    assert.ok(!path.includes(code),`Prerequisite cycle: ${[...path,code].join(' -> ')}`);
    learningGuide[code].prerequisites.forEach(c => visit(c,[...path,code]));
}
Object.keys(nodeMeta).forEach(c => visit(c));
assert.equal(learningGuide.N21.level,'延伸');
for (const q of questionBank) {
    assert.ok(nodeMeta[q.node],`Question node ${q.node}`);
    assert.ok(q.opts.some(o => o.c),`No answer: ${q.id || q.node + q.level}`);
    assert.ok(q.opts.every(o => o.why),`Missing feedback ${q.node}`);
    if (q.type !== 'multi') assert.equal(q.opts.filter(o => o.c).length,1,`Single-choice answer count ${q.node}`);
}
for (const file of ['wave_optics_review.html','water_interference.html']) {
    const html = fs.readFileSync(file,'utf8');
    const scripts = [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)];
    scripts.forEach((m,i) => new vm.Script(m[1],{filename:`${file}:script${i}`}));
}
for (const file of ['assets/js/learner-ui.js','scripts/lab-selftest.js']) new vm.Script(fs.readFileSync(file,'utf8'),{filename:file});
console.log(`PASS: ${Object.keys(learningGuide).length} complete lesson guides, valid prerequisite graph, ${questionBank.length} answer keys, resonance media/check/source metadata, all frontend script syntax.`);
