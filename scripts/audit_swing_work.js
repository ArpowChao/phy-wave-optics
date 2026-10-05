// Physics checks for the resonance-page animation. Uses only its public model API;
// expected work, free motion and steady amplitudes come from independent formulae.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');

const filename = path.resolve(__dirname, '../assets/js/swing-work.js');
const sandbox = { console };
sandbox.window = sandbox;
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(filename, 'utf8'), sandbox, { filename, timeout: 5000 });
const model = sandbox.SwingWork;
assert.ok(model, 'SwingWork public API exists');
for (const name of ['build', 'sample', 'render', 'mount', 'html', 'heightFor']) assert.equal(typeof model[name], 'function', `${name} API`);
const { m, L, g, A, duration, dt } = model.constants;
assert.ok([m, L, g, A, duration, dt].every(value => Number.isFinite(value) && value > 0), 'Positive physical constants');
const omega0 = Math.sqrt(g / L);
const period = 2 * Math.PI / omega0;
const force = 2.4;

function close(actual, expected, tolerance, description) {
    assert.ok(Number.isFinite(actual), `${description}: finite value required`);
    assert.ok(Math.abs(actual - expected) <= tolerance,
        `${description}: got ${actual}, expected ${expected} ± ${tolerance}`);
}
function build(config) {
    const series = model.build(config);
    assert.ok(series.samples.length > 100, 'Enough samples to represent oscillations');
    close(series.samples[0].t, 0, 1e-12, 'Starts at time zero');
    close(series.samples.at(-1).t, duration, dt / 10, 'Includes full animation duration');
    for (let i = 0; i < series.samples.length; i++) {
        const sample = series.samples[i];
        for (const field of ['t', 'x', 'v', 'F', 'P', 'W', 'D', 'E']) assert.ok(Number.isFinite(sample[field]), `${config.mode} ${field} at ${i}`);
        if (i) assert.ok(sample.t > series.samples[i - 1].t, 'Strictly increasing timestamps');
        const settings = series.config;
        close(sample.F, settings.force * Math.cos(settings.ratio * omega0 * sample.t + settings.phase * Math.PI / 180), 1e-9, 'Specified force frequency and phase');
        close(sample.P, sample.F * sample.v, 1e-9, 'Instantaneous power is Fv');
        close(sample.E, m * (sample.v ** 2 + omega0 ** 2 * sample.x ** 2) / 2, 1e-8, 'Kinetic plus potential energy');
    }
    return series;
}

const inPhase = build({ mode: 'compare', ratio: 1, phase: 0, force });
const opposite = build({ mode: 'compare', ratio: 1, phase: 180, force });
const quadrature = build({ mode: 'compare', ratio: 1, phase: 90, force });
const cycleWork = Math.PI * force * A;
close(model.sample(inPhase, period).W, cycleWork, 1e-5, 'Same frequency and velocity phase: positive work per cycle');
close(model.sample(opposite, period).W, -cycleWork, 1e-5, 'Same frequency, opposite velocity phase: negative work per cycle');
close(model.sample(quadrature, period).W, 0, 1e-5, 'Ninety degrees from velocity: zero net full-cycle work');
close(model.sample(quadrature, period / 4).W, -force * A / 2, 1e-5, 'Quadrature still transfers energy within a cycle');
for (let i = 0; i < inPhase.samples.length; i += 117) {
    const sample = inPhase.samples[i];
    close(sample.x, A * Math.sin(omega0 * sample.t), 1e-10, 'Reference displacement');
    close(sample.v, A * omega0 * Math.cos(omega0 * sample.t), 1e-10, 'Velocity leads displacement by ninety degrees');
    assert.ok(sample.P >= -1e-12, 'Same-phase reference power is never negative');
    assert.ok(opposite.samples[i].P <= 1e-12, 'Opposite-phase reference power is never positive');
}
console.log('PASS: positive/negative work, quadrature, and velocity/displacement phase.');

// Each test uses a complete shared repeat period. Different frequencies do not
// imply zero work over arbitrary short intervals.
for (const ratio of [0.5, 2]) {
    const sharedPeriod = ratio === 0.5 ? 2 * period : period;
    for (const phase of [0, 180]) {
        const series = build({ mode: 'compare', ratio, phase, force });
        close(model.sample(series, sharedPeriod).W, 0, 1e-5, `Different frequency ${ratio}, phase ${phase}: common-period work`);
    }
}
const slower = model.build({ mode: 'compare', ratio: 0.5, phase: 0, force });
close(model.sample(slower, period / 2).W, 2 * force * A / 3, 1e-5, 'Different frequencies can produce nonzero short-interval work');

// Independent Simpson quadrature of F(t)v(t) checks work away from special phases
// and endpoints, including the ratio range boundaries.
for (const ratio of [0.5, 1, 1.4, 2]) {
    const phase = 37;
    const time = 11.731;
    const series = model.build({ mode: 'compare', ratio, phase, force });
    const count = 12000;
    const step = time / count;
    const power = t => force * Math.cos(ratio * omega0 * t + phase * Math.PI / 180) * A * omega0 * Math.cos(omega0 * t);
    let integral = power(0) + power(time);
    for (let i = 1; i < count; i++) integral += (i % 2 ? 4 : 2) * power(i * step);
    integral *= step / 3;
    close(model.sample(series, time).W, integral, 2e-5, `Work equals integrated instantaneous power at ratio ${ratio}`);
}
console.log('PASS: unequal frequencies over shared and partial periods; work matches independent quadrature.');

const free = build({ mode: 'dynamic', ratio: 1, phase: 0, force: 0, damping: 0 });
const initial = free.samples[0];
for (let i = 0; i < free.samples.length; i += 73) {
    const point = free.samples[i];
    const exactX = initial.x * Math.cos(omega0 * point.t) + initial.v / omega0 * Math.sin(omega0 * point.t);
    close(point.x, exactX, 2e-7, 'Unforced undamped motion follows natural frequency');
    close(point.E, initial.E, 2e-7, 'Unforced undamped energy conserved');
    close(point.W, 0, 1e-12, 'No drive does no work');
    close(point.D, 0, 1e-12, 'No damping removes no energy');
}
const decaying = build({ mode: 'dynamic', ratio: 1, phase: 0, force: 0, damping: 0.18 });
for (let i = 1; i < decaying.samples.length; i++) {
    assert.ok(decaying.samples[i].E <= decaying.samples[i - 1].E + 1e-9, 'With only damping, energy does not increase');
    assert.ok(decaying.samples[i].D >= decaying.samples[i - 1].D - 1e-12, 'Dissipated energy accumulates');
}
assert.ok(decaying.samples.at(-1).E < decaying.samples[0].E / 100, 'Damping produces substantial energy decay');

for (const ratio of [0.5, 1, 2]) {
    for (const phase of [0, 180]) {
        const series = build({ mode: 'dynamic', ratio, phase, force, damping: 0.18 });
        const startE = series.samples[0].E;
        let maxResidual = 0;
        for (const point of series.samples) {
            maxResidual = Math.max(maxResidual, Math.abs(point.E - startE - point.W + point.D));
            assert.ok(point.D >= -1e-10, 'Damping never creates negative dissipated energy');
        }
        close(maxResidual, 0, 3e-6, `Energy balance ΔE = drive work − dissipation at ratio ${ratio}, phase ${phase}`);
    }
}
console.log('PASS: natural free motion, damping decay and driven energy balance at frequency/phase boundaries.');

// In steady motion, amplitude is fixed by the driven oscillator equation rather
// than by initial timing. Stronger damping makes the transient decay before t=32s.
for (const ratio of [0.5, 1, 2]) {
    const damping = 0.5;
    const series = build({ mode: 'dynamic', ratio, phase: 180, force, damping });
    const tail = series.samples.filter(point => point.t >= duration - 8);
    const amplitude = (Math.max(...tail.map(point => point.x)) - Math.min(...tail.map(point => point.x))) / 2;
    const driveOmega = ratio * omega0;
    const expected = force / (m * Math.sqrt((omega0 ** 2 - driveOmega ** 2) ** 2 + (damping * driveOmega) ** 2));
    close(amplitude, expected, expected * 0.02, `Steady forced amplitude at ratio ${ratio}`);
}

const midpointIndex = 107;
const left = inPhase.samples[midpointIndex];
const right = inPhase.samples[midpointIndex + 1];
const midpoint = model.sample(inPhase, (left.t + right.t) / 2);
for (const key of ['t', 'x', 'v', 'F', 'P', 'W', 'D', 'E']) close(midpoint[key], (left[key] + right[key]) / 2, 1e-10, `Scrub interpolation for ${key}`);
close(model.sample(inPhase, -1).t, 0, 1e-12, 'Scrub clamps before start');
close(model.sample(inPhase, duration + 1).t, duration, dt / 10, 'Scrub clamps after end');
console.log('PASS: independent steady amplitude prediction and scrub interpolation/clamping.');
