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
assert.equal(Object.keys(nodeMeta).length,21);
assert.deepEqual(Object.keys(learningGuide).sort(),Object.keys(nodeMeta).sort());
for (const [code,guide] of Object.entries(learningGuide)) {
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
console.log(`PASS: ${Object.keys(learningGuide).length} complete lesson guides, valid prerequisite graph, ${questionBank.length} answer keys, all frontend script syntax.`);
