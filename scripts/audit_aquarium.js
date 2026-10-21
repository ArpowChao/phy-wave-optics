// Verify Snell invariants, exact ray intersections and the near-axis limit.
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const html = fs.readFileSync('wave_optics_review.html', 'utf8');
const start = html.indexOf('LABS.apparent_depth = {');
const end = html.indexOf('/* 10. 薄透鏡', start);
assert.ok(start > 0 && end > start, 'Apparent-depth model must be found');
const rad = d => d * Math.PI / 180;
const ctx = vm.createContext({ LABS: {}, rad, deg: r => r * 180 / Math.PI });
vm.runInContext(html.slice(start, end), ctx);
const lab = ctx.LABS.apparent_depth;
const close = (a, b, message, tolerance = 1e-9) => assert.ok(Math.abs(a - b) < tolerance, `${message}: ${a} vs ${b}`);
const defaults = Object.fromEntries(lab.controls.map(c => [c.key, c.value]));
assert.equal(defaults.steps, 'final');
const p = { ...defaults, mode: 'layers' };
const base = lab.layers(p, rad(10));
close(base.fAir, 167.15446333955694, 'near-axis distance');
close(base.imgAir, 165.09225219312233, 'finite-angle intersection');
assert.ok(lab.readouts(p).some(r => r.value === '165.1 cm'));
assert.ok(lab.readouts(p).some(r => r.value === '167.2 cm'));
let count = 0;
for (const ng of [1.4, 1.49, 1.52, 1.6]) for (const t of [0.5, 1, 25, 60, 70]) {
    for (const d of [10, 30, 200, 800]) for (const angle of [1, 10, 30, 48, 49, 70]) {
        const g = lab.layers({ ng, t, d }, rad(angle));
        close(g.nw * Math.sin(g.a), ng * Math.sin(g.b), 'water/window Snell invariant');
        assert.ok(g.b < g.a, 'water to window must bend toward normal');
        if (angle >= 49) {
            assert.ok(g.tir && g.g === null && g.imgAir === null, 'TIR must not produce an air ray or image');
        } else {
            assert.ok(!g.tir && g.g > g.b);
            close(Math.sin(g.g), ng * Math.sin(g.b), 'window/air Snell invariant');
            close(g.y0 - g.imgAir * Math.tan(g.g), 0, 'back-projected ray hits the image');
            close(g.y1 - g.imgGlass * Math.tan(g.b), 0, 'first-interface image intersection');
            assert.ok(g.imgAir > 0 && g.imgAir < t + d);
        }
        const near = lab.layers({ ng, t, d }, 1e-6);
        close(near.imgAir, near.fAir, 'small-angle limit', 1e-6);
        count++;
    }
}
console.log(`PASS: ${count} aquarium cases, Snell invariants, TIR, ray intersections, defaults and readout consistency.`);
