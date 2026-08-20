/*
 * wave-runtime.js
 * 波動與光學互動實驗共用的執行層：
 *   1. 固定步長時鐘（避免不同螢幕更新率造成模擬速度不一致）
 *   2. 檢視生命週期的清理登記（切換路由時釋放 rAF 與事件監聽器）
 *   3. Canvas 的 devicePixelRatio 處理
 */
(function bootstrapWaveRuntime(global) {
    'use strict';

    class FixedStepClock {
        constructor({ stepHz = 60, maxFrameDelta = 0.25, maxSteps = 12 } = {}) {
            this.fixedDt = 1 / stepHz;
            this.maxFrameDelta = maxFrameDelta;
            this.maxSteps = maxSteps;
            this.accumulator = 0;
            this.lastTimestamp = null;
            this.simulationTime = 0;
        }

        reset(timestamp = null) {
            this.accumulator = 0;
            this.lastTimestamp = timestamp;
            this.simulationTime = 0;
        }

        advance(timestamp, update) {
            if (this.lastTimestamp === null) {
                this.lastTimestamp = timestamp;
                return { steps: 0, frameDelta: 0 };
            }
            const frameDelta = Math.min(Math.max((timestamp - this.lastTimestamp) / 1000, 0), this.maxFrameDelta);
            this.lastTimestamp = timestamp;
            this.accumulator += frameDelta;

            let steps = 0;
            while (this.accumulator >= this.fixedDt && steps < this.maxSteps) {
                update(this.fixedDt);
                this.simulationTime += this.fixedDt;
                this.accumulator -= this.fixedDt;
                steps += 1;
            }
            if (steps === this.maxSteps && this.accumulator >= this.fixedDt) {
                this.accumulator %= this.fixedDt;
            }
            return { steps, frameDelta };
        }
    }

    function createDisposerRegistry(label = 'view') {
        const disposers = new Set();
        return {
            label,
            add(fn) {
                if (typeof fn === 'function') disposers.add(fn);
                return fn;
            },
            addEventListener(target, type, listener, options) {
                if (!target) return () => {};
                target.addEventListener(type, listener, options);
                const off = () => target.removeEventListener(type, listener, options);
                disposers.add(off);
                return off;
            },
            runLoop(step) {
                let rafId = null;
                let running = true;
                const clock = new FixedStepClock();
                const frame = (timestamp) => {
                    if (!running) return;
                    clock.advance(timestamp, (dt) => step(dt, clock.simulationTime));
                    rafId = global.requestAnimationFrame(frame);
                };
                rafId = global.requestAnimationFrame(frame);
                const stop = () => {
                    running = false;
                    if (rafId !== null) global.cancelAnimationFrame(rafId);
                    rafId = null;
                };
                disposers.add(stop);
                return { stop, clock };
            },
            dispose() {
                disposers.forEach((fn) => {
                    try { fn(); } catch (err) { console.warn('[wave-runtime] disposer failed', err); }
                });
                disposers.clear();
            },
            get size() { return disposers.size; }
        };
    }

    function prefersReducedMotion() {
        return Boolean(global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches);
    }

    /* 依 devicePixelRatio 調整 canvas 解析度，回傳以 CSS 像素為單位的邏輯尺寸。 */
    function fitCanvas(canvas, cssHeight) {
        if (!canvas) return { width: 0, height: 0 };
        const dpr = Math.min(global.devicePixelRatio || 1, 2);
        const cssWidth = canvas.clientWidth || canvas.parentElement?.clientWidth || 640;
        const height = cssHeight || canvas.clientHeight || 320;
        canvas.width = Math.round(cssWidth * dpr);
        canvas.height = Math.round(height * dpr);
        canvas.style.height = `${height}px`;
        const ctx = canvas.getContext('2d');
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        return { width: cssWidth, height, ctx };
    }

    global.WaveRuntime = {
        FixedStepClock,
        createFixedClock: (options) => new FixedStepClock(options),
        createDisposerRegistry,
        prefersReducedMotion,
        fitCanvas
    };
})(window);
