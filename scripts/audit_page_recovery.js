// Fault-inject the real page scripts without a browser dependency.
// This checks startup recovery; browser screenshots cover the rendered layout.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');

const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'wave_optics_review.html'), 'utf8');
const scripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)].map((match, index) => {
    const src = /\bsrc=["']([^"']+)["']/i.exec(match[1])?.[1];
    return { src, attributes: match[1], source: match[2], name: src || `inline-${index}`, offset: match.index };
});

function runPage({ missing = '', omitted = '', syntaxError = '', rendererThrows = false, route = 'node-N07' } = {}) {
    const elements = new Map();
    const timers = new Map();
    const listeners = new Map();
    const errors = [];
    let timerId = 0;
    let context;
    let earlyResourceFailure = false;

    class Element {
        constructor(tagName = 'div') {
            this.tagName = tagName.toUpperCase();
            this.attributes = new Map();
            this.dataset = {};
            this.style = {};
            this.children = [];
            this._html = '';
            this.scrollTop = 0;
            this.hidden = false;
            this.classList = {
                add: (...classes) => this.setAttribute('class', [...new Set([...this.className.split(/\s+/), ...classes])].join(' ').trim()),
                remove: (...classes) => this.setAttribute('class', this.className.split(/\s+/).filter(c => !classes.includes(c)).join(' ')),
                contains: cls => this.className.split(/\s+/).includes(cls),
                toggle: (cls, force) => {
                    const add = force ?? !this.classList.contains(cls);
                    this.classList[add ? 'add' : 'remove'](cls);
                    return add;
                }
            };
        }
        get className() { return this.attributes.get('class') || ''; }
        set className(value) { this.setAttribute('class', value); }
        get id() { return this.attributes.get('id') || ''; }
        set id(value) { this.setAttribute('id', value); }
        get innerHTML() { return this._html; }
        set innerHTML(value) { this._html = String(value); indexHtml(this._html); }
        get textContent() { return this._html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(); }
        set textContent(value) { this._html = String(value); }
        setAttribute(name, value) {
            value = String(value);
            this.attributes.set(name, value);
            if (name === 'id') elements.set(value, this);
            if (name.startsWith('data-')) this.dataset[name.slice(5).replace(/-([a-z])/g, (_, c) => c.toUpperCase())] = value;
            if (name === 'src' || name === 'href') this[name] = new URL(value, 'https://example.test/wave_optics_review.html').href;
        }
        getAttribute(name) { return this.attributes.get(name) ?? null; }
        hasAttribute(name) { return this.attributes.has(name); }
        removeAttribute(name) { this.attributes.delete(name); }
        appendChild(child) { this.children.push(child); child.parentElement = this; return child; }
        replaceChildren(...children) { this.children = []; this._html = ''; children.forEach(child => this.appendChild(child)); }
        addEventListener() {}
        removeEventListener() {}
        querySelectorAll(selector) { return selectAll(selector); }
        querySelector(selector) { return selectAll(selector)[0] || null; }
        closest() { return null; }
        focus() {}
        scrollIntoView() {}
        getBoundingClientRect() { return { width: 960, height: 500 }; }
    }
    class ScriptElement extends Element {
        constructor() { super('script'); }
    }

    function parseAttributes(element, attributes) {
        for (const match of attributes.matchAll(/([\w:-]+)(?:\s*=\s*(["'])(.*?)\2)?/g)) element.setAttribute(match[1], match[3] ?? '');
    }
    function indexHtml(markup) {
        for (const match of markup.matchAll(/<([a-z][\w-]*)\b([^>]*)>/gi)) {
            if (!/\bid=/.test(match[2])) continue;
            const element = new Element(match[1]);
            parseAttributes(element, match[2]);
        }
    }
    function matches(element, selector) {
        const id = /#([\w-]+)/.exec(selector)?.[1];
        if (id && element.id !== id) return false;
        const cls = /\.([\w-]+)/.exec(selector)?.[1];
        if (cls && !element.classList.contains(cls)) return false;
        const attr = /\[([\w-]+)(?:=["']([^"']+)["'])?\]/.exec(selector);
        if (attr && (element.getAttribute(attr[1]) === null || (attr[2] && element.getAttribute(attr[1]) !== attr[2]))) return false;
        const tag = /^[a-z][\w-]*/i.exec(selector)?.[0];
        if (tag && element.tagName !== tag.toUpperCase()) return false;
        return true;
    }
    function selectAll(selector) {
        // The learner navigation uses descendant selectors; the final part is enough
        // here because the harness asserts page content, not layout or focus order.
        return [...elements.values()].filter(element => selector.split(',').some(part => matches(element, part.trim().split(/\s+/).at(-1))));
    }
    function listen(owner, type, callback) {
        const key = `${owner}:${type}`;
        if (!listeners.has(key)) listeners.set(key, []);
        listeners.get(key).push(callback);
    }
    function dispatch(owner, type, event = {}) {
        const payload = { type, preventDefault() {}, ...event };
        for (const callback of [...(listeners.get(`${owner}:${type}`) || [])]) {
            try { callback(payload); }
            catch (error) { recordError(error); }
        }
    }
    function recordError(error) {
        errors.push(error);
        dispatch('window', 'error', { message: error.message, error, target: context });
    }

    indexHtml(html);
    const main = elements.get('main-content');
    const mainMatch = /<main\b[^>]*id=["']main-content["'][^>]*>([\s\S]*?)<\/main>/i.exec(html);
    main._html = mainMatch?.[1] || '';
    // Head scripts run before <main> has been parsed. Keep that timing for the
    // early-resource-failure cases; restore <main> when the parser reaches it.
    elements.delete('main-content');
    const document = {
        readyState: 'loading',
        getElementById: id => elements.get(id) || null,
        querySelectorAll: selectAll,
        querySelector: selector => selectAll(selector)[0] || null,
        createElement: tag => tag.toLowerCase() === 'script' ? new ScriptElement() : new Element(tag),
        addEventListener: (type, callback) => listen('document', type, callback),
        removeEventListener() {},
        documentElement: new Element('html'),
        body: new Element('body'),
        head: new Element('head')
    };
    context = {
        document,
        HTMLScriptElement: ScriptElement,
        URL,
        URLSearchParams,
        console: { log() {}, warn() {}, error() {} },
        location: { hash: `#${route}`, search: '', href: `https://example.test/wave_optics_review.html#${route}`, reload() {} },
        history: { length: 1, replaceState() {}, pushState() {}, back() {} },
        localStorage: { getItem() { return null; }, setItem() {} },
        MutationObserver: class { observe() {} },
        addEventListener: (type, callback) => listen('window', type, callback),
        removeEventListener() {},
        scrollTo() {},
        matchMedia() { return { matches: false }; },
        setTimeout(callback) { const id = ++timerId; timers.set(id, callback); return id; },
        clearTimeout(id) { timers.delete(id); },
        requestAnimationFrame() { return 1; },
        cancelAnimationFrame() { context.cancelledFrames = (context.cancelledFrames || 0) + 1; }
    };
    context.window = context;
    vm.createContext(context);

    for (const script of scripts) {
        if (script.offset > mainMatch.index) elements.set('main-content', main);
        if (script.src && /^https?:/.test(script.src)) continue; // MathJax is optional for startup.
        const asset = script.src?.split('?')[0];
        if (asset === omitted) continue;
        if (asset === missing) {
            earlyResourceFailure = !elements.has('main-content');
            const target = new ScriptElement();
            parseAttributes(target, script.attributes);
            dispatch('window', 'error', { target });
            continue;
        }
        try {
            const source = asset === syntaxError ? 'function (' : script.src ? fs.readFileSync(path.join(root, asset), 'utf8') : script.source;
            vm.runInContext(source, context, { filename: script.name, timeout: 5000 });
        } catch (error) { recordError(error); }
    }
    if (rendererThrows) vm.runInContext(`renderNodeView = function () {
        activeDisposers.runLoop(() => {});
        activeDisposers.add(() => { window.injectedCleanupCount = (window.injectedCleanupCount || 0) + 1; });
        throw new Error("Injected renderer failure");
    };`, context);
    document.readyState = 'interactive';
    dispatch('document', 'DOMContentLoaded');
    document.readyState = 'complete';
    dispatch('window', 'load');
    // Drain one-shot recovery deadlines. The simulation loops use rAF, which is
    // intentionally inert because these assertions are about page boot/recovery.
    for (let round = 0; timers.size && round < 10; round++) {
        const pending = [...timers.values()];
        timers.clear();
        pending.forEach(callback => { try { callback(); } catch (error) { recordError(error); } });
    }
    return { main, elements, errors, context, markup: main.innerHTML, earlyResourceFailure };
}

if (require.main === module) {
    const normal = runPage();
    assert.match(normal.markup, /水波的干涉與繞射/);
    assert.match(normal.markup, /這節要學會/);
    assert.doesNotMatch(normal.markup, /正在載入|學習內容未能載入/);
    assert.equal(normal.errors.length, 0, normal.errors.map(error => error.stack).join('\n'));
    assert.equal(normal.context.WavePageStatus.failed, false);
    console.log('PASS: N07 renders normally without optional MathJax.');

    function assertRecovery(result, name) {
        assert.match(result.markup, /role="alert"/, name);
        assert.match(result.markup, /學習內容未能載入/, name);
        assert.match(result.markup, /onclick="location\.reload\(\)"/, name);
        assert.match(result.markup, /href="water_interference\.html"/, name);
        assert.doesNotMatch(result.markup, /正在載入/, name);
        assert.equal(result.context.WavePageStatus.failed, true, name);
        console.log(`PASS: ${name} gives visible recovery and the independent water link.`);
    }
    const requiredAssets = scripts.filter(script => /\bdata-page-required\b/.test(script.attributes)).map(script => script.src.split('?')[0]);
    assert.ok(requiredAssets.includes('assets/js/learner-ui.js'));
    assert.ok(requiredAssets.includes('data/modulesData.js'));
    assert.ok(requiredAssets.includes('assets/js/wave-runtime.js'));
    for (const asset of requiredAssets) {
        const result = runPage({ missing: asset });
        assertRecovery(result, `Missing ${asset}`);
        if (asset === 'data/modulesData.js' || asset === 'assets/js/wave-runtime.js') assert.equal(result.earlyResourceFailure, true, `${asset}: failure must occur before main exists`);
    }
    assertRecovery(runPage({ omitted: 'assets/js/learner-ui.js' }), 'Silently omitted learner UI');
    assertRecovery(runPage({ syntaxError: 'assets/js/learner-ui.js' }), 'Learner UI syntax error');
    const rendererFailure = runPage({ rendererThrows: true });
    assertRecovery(rendererFailure, 'N07 renderer exception');
    assert.equal(rendererFailure.context.injectedCleanupCount, 1, 'Failed render disposes registered resources');
    assert.equal(rendererFailure.context.cancelledFrames, 1, 'Failed render stops its animation');
}
module.exports = { runPage };
