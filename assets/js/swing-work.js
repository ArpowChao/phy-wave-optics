/* 盪鞦韆與做功。固定波形只比較功；受迫模型另解運動與能量帳。 */
(function (global) {
    'use strict';
    const constants = Object.freeze({ m:20, L:2, g:9.81, A:0.3, initialA:0.18, duration:40, dt:1/240 });
    const defaults = Object.freeze({ mode:'compare', ratio:1, phase:0, force:2.4, damping:0.18 });
    const omega0 = Math.sqrt(constants.g / constants.L);
    const colors = { force:'#bf770a', velocity:'#176fa5', positive:'#188064', negative:'#bd3c58', work:'#7956ac', loss:'#7c8790', text:'#243e43', muted:'#68797b' };
    const clamp = (n,lo,hi) => Math.max(lo, Math.min(hi,n));
    const finite = (n,fallback) => Number.isFinite(Number(n)) ? Number(n) : fallback;
    const heightFor = width => width < 620 ? 820 : 554;

    function build(input = {}) {
        const config = { ...defaults, ...input };
        config.mode = config.mode === 'dynamic' ? 'dynamic' : 'compare';
        config.ratio = clamp(finite(config.ratio,1),0.25,3);
        config.phase = finite(config.phase,0);
        config.force = clamp(finite(config.force,2.4),0,3);
        config.damping = clamp(finite(config.damping,0.18),0,0.6);
        const { m, A, initialA, dt, duration } = constants;
        const wd = config.ratio * omega0, phi = config.phase * Math.PI / 180;
        const force = t => config.force * Math.cos(wd*t + phi);
        const integralCos = (w,t) => Math.abs(w) < 1e-10 ? t*Math.cos(phi) : (Math.sin(w*t + phi)-Math.sin(phi))/w;
        const samples = [];
        let state = [0,initialA*omega0,0,0]; // x, v, external work, dissipated energy
        const derivative = (t,s) => [s[1], force(t)/m - config.damping*s[1] - omega0*omega0*s[0], force(t)*s[1], m*config.damping*s[1]*s[1]];
        const shifted = (s,k,h) => s.map((v,i) => v+h*k[i]);
        for (let i=0, count=Math.round(duration/dt); i<=count; i++) {
            const t=i*dt;
            let x,v,W,D;
            if (config.mode === 'compare') {
                x=A*Math.sin(omega0*t); v=A*omega0*Math.cos(omega0*t);
                W=config.force*A*omega0/2*(integralCos(wd-omega0,t)+integralCos(wd+omega0,t)); D=0;
            } else { [x,v,W,D]=state; }
            const F=force(t), E=0.5*m*(v*v + omega0*omega0*x*x);
            samples.push({ t,x,v,F,P:F*v,W,D,E });
            if (config.mode === 'dynamic' && i<count) {
                const k1=derivative(t,state), k2=derivative(t+dt/2,shifted(state,k1,dt/2));
                const k3=derivative(t+dt/2,shifted(state,k2,dt/2)), k4=derivative(t+dt,shifted(state,k3,dt));
                state=state.map((value,j) => value+dt/6*(k1[j]+2*k2[j]+2*k3[j]+k4[j]));
            }
        }
        const peakV=samples.reduce((max,s) => Math.max(max,Math.abs(s.v)),0);
        return { config,samples,dt,duration,omega0,peakV };
    }
    function sample(series,t) {
        const at=clamp(finite(t,0),0,series.duration)/series.dt;
        const i=Math.min(Math.floor(at),series.samples.length-1), a=series.samples[i];
        const b=series.samples[Math.min(i+1,series.samples.length-1)], mix=at-i;
        return Object.fromEntries(Object.keys(a).map(key => [key,a[key]+mix*(b[key]-a[key])]));
    }
    const number = (value,digits=2) => (Math.abs(value)<0.5*Math.pow(10,-digits) ? 0 : value).toFixed(digits);
    function text(ctx,value,x,y,color,size,maxW,align='left') {
        labelFit(ctx,value,x,y,color,size,align,{maxW,min:10,clampW:ctx.canvas.width / Math.min(global.devicePixelRatio || 1,2)});
    }
    function panel(ctx,r,background='#fff') {
        ctx.fillStyle=background; ctx.fillRect(r.x,r.y,r.w,r.h);
        ctx.strokeStyle='#dce7e4'; ctx.lineWidth=1; ctx.strokeRect(r.x+0.5,r.y+0.5,r.w-1,r.h-1);
    }
    function arrow(ctx,x,y,dx,dy,color) {
        if (Math.hypot(dx,dy)<2) { ctx.fillStyle=color; ctx.beginPath(); ctx.arc(x,y,3,0,Math.PI*2); ctx.fill(); return; }
        const angle=Math.atan2(dy,dx), tipX=x+dx, tipY=y+dy;
        ctx.strokeStyle=color; ctx.fillStyle=color; ctx.lineWidth=4; ctx.lineCap='round';
        ctx.beginPath(); ctx.moveTo(x,y); ctx.lineTo(tipX,tipY); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(tipX,tipY); ctx.lineTo(tipX-9*Math.cos(angle-0.45),tipY-9*Math.sin(angle-0.45)); ctx.lineTo(tipX-9*Math.cos(angle+0.45),tipY-9*Math.sin(angle+0.45)); ctx.closePath(); ctx.fill();
    }
    function drawSwing(ctx,r,series,s,compact) {
        panel(ctx,r,'#eef5f1');
        const pad=16;
        text(ctx,series.config.mode==='compare' ? '固定擺幅：看推力做功' : '受迫鞦韆：看能量改變',r.x+pad,r.y+26,colors.text,14,r.w-2*pad);
        text(ctx,'橙色 → 推力 F　藍色 → 速度 v',r.x+pad,r.y+49,colors.muted,11,r.w-2*pad);
        const cx=r.x+r.w/2, py=r.y+80, length=compact ? 143 : 190;
        const angle=3*s.x/constants.L; // diagram only: the small physical angle is magnified 3x
        ctx.strokeStyle='#a6bdb4'; ctx.lineWidth=5; ctx.lineCap='round';
        ctx.beginPath(); ctx.moveTo(cx-0.37*r.w,py+length+35); ctx.lineTo(cx-12,py-12); ctx.lineTo(cx+12,py-12); ctx.lineTo(cx+0.37*r.w,py+length+35); ctx.stroke();
        ctx.strokeStyle='#bacfc5'; ctx.lineWidth=1; ctx.setLineDash([3,5]);
        ctx.beginPath(); ctx.arc(cx,py,length,Math.PI/2-0.6,Math.PI/2+0.6); ctx.stroke(); ctx.setLineDash([]);
        ctx.strokeStyle='#bfd3c8'; ctx.beginPath(); ctx.moveTo(cx,py); ctx.lineTo(cx,py+length+8); ctx.stroke();
        const sx=cx+length*Math.sin(angle), sy=py+length*Math.cos(angle);
        ctx.strokeStyle='#577873'; ctx.lineWidth=2;
        [-8,8].forEach(offset => { ctx.beginPath(); ctx.moveTo(cx+offset,py); ctx.lineTo(sx+offset,sy); ctx.stroke(); });
        ctx.save(); ctx.translate(sx,sy);
        ctx.strokeStyle='#214f52'; ctx.fillStyle='#24696c'; ctx.lineWidth=9;
        ctx.beginPath(); ctx.moveTo(-20,0); ctx.lineTo(20,0); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(-8,-4); ctx.lineTo(-4,-32); ctx.lineTo(3,-32); ctx.lineTo(10,-7); ctx.stroke();
        ctx.lineWidth=5; ctx.beginPath(); ctx.moveTo(-4,-23); ctx.lineTo(-16,-14); ctx.moveTo(3,-23); ctx.lineTo(17,-14); ctx.moveTo(4,-4); ctx.lineTo(17,13); ctx.lineTo(28,15); ctx.stroke();
        ctx.fillStyle='#e0ad67'; ctx.beginPath(); ctx.arc(0,-43,10,0,Math.PI*2); ctx.fill(); ctx.restore();
        ctx.fillStyle='#426862'; ctx.beginPath(); ctx.arc(cx,py,5,0,Math.PI*2); ctx.fill();
        const scale=Math.min(60,r.w*0.2), tangent=[Math.cos(angle),-Math.sin(angle)];
        const f=series.config.force>0 ? s.F/series.config.force : 0, v=s.v/Math.max(series.peakV,0.01);
        arrow(ctx,sx,sy+23,scale*f*tangent[0],scale*f*tangent[1],colors.force);
        arrow(ctx,sx,sy+45,scale*v*tangent[0],scale*v*tangent[1],colors.velocity);
        if (!compact) {
            const baseY=r.y+length+141, lineH=25;
            text(ctx,'P = Fv',cx,baseY,colors.text,23,r.w-2*pad,'center');
            const result=s.P>0.001 ? '同向：外力做正功' : s.P < -0.001 ? '反向：外力做負功' : '此刻：瞬時功率為零';
            text(ctx,result,cx,baseY+lineH+7,s.P<0 ? colors.negative : colors.positive,14,r.w-2*pad,'center');
            text(ctx,'比較推力與速度的方向',cx,baseY+2*lineH+12,colors.muted,12,r.w-2*pad,'center');
            text(ctx,'轉折點 v = 0，當下 P = 0',cx,baseY+3*lineH+12,colors.muted,11,r.w-2*pad,'center');
        }
    }
    function drawPlot(ctx,r,series,t,kind,start,end) {
        panel(ctx,r);
        const {config}=series, dynamic=config.mode==='dynamic';
        const title=kind===0 ? (dynamic ? '推力與速度：追蹤相位' : '推力與速度：比較正弦波') : kind===1 ? '瞬時功率 P = Fv（W）' : dynamic ? '外力功、耗散與能量變化（J）' : '累積外力功 W（J）';
        text(ctx,title,r.x+13,r.y+22,colors.text,13,r.w-26);
        const legend=kind===0 ? 'F/F₀（橙）　v/v峰值（藍）' : kind===1 ? '綠：正功　紅：負功' : dynamic ? 'W（紫）　D（灰）　ΔE（綠）' : '從 t = 0 開始，正負功相加';
        text(ctx,legend,r.x+13,r.y+43,colors.muted,11,r.w-26);
        const plot={x:r.x+39,y:r.y+60,w:r.w-54,h:r.h-88};
        const a=Math.floor(start/series.dt), b=Math.min(series.samples.length-1,Math.ceil(end/series.dt));
        const values=kind===0 ? [s=>s.F/Math.max(config.force,0.01),s=>s.v/Math.max(series.peakV,0.01)] : kind===1 ? [s=>s.P] : dynamic ? [s=>s.W,s=>s.D,s=>s.E-series.samples[0].E] : [s=>s.W];
        let max=kind===0 ? 1.15 : 0.1, min=kind===0 ? -1.15 : 0;
        if (kind!==0) {
            for (let i=a;i<=b;i+=4) values.forEach(fn=>{ const y=fn(series.samples[i]); max=Math.max(max,y); min=Math.min(min,y); });
            const pad=(max-min)*0.1; max+=pad; min-=pad;
            if (kind===1) { const sym=Math.max(Math.abs(max),Math.abs(min)); max=sym; min=-sym; }
        }
        const px=tm=>plot.x+(tm-start)/(end-start)*plot.w, py=value=>plot.y+(max-value)/(max-min)*plot.h;
        ctx.strokeStyle='#e2eae7'; ctx.lineWidth=1;
        // Keep zero only when it has a full text row of separation from both end ticks.
        const ticks=kind===0 ? [1,0,-1] : [max,min];
        if(kind!==0 && Math.min(Math.abs(py(0)-py(max)),Math.abs(py(0)-py(min)))>=20) ticks.push(0);
        ticks.filter((v,i,all)=>all.indexOf(v)===i).forEach(value=>{
            const y=py(value); ctx.beginPath(); ctx.moveTo(plot.x,y); ctx.lineTo(plot.x+plot.w,y); ctx.stroke();
            text(ctx,kind===0 ? (value>0?'1':value<0?'−1':'0') : number(value,1),plot.x-7,y+4,colors.muted,10,32,'right');
        });
        [start,(start+end)/2,end].forEach((tm,i)=>{
            const x=px(tm); ctx.strokeStyle='#e2eae7'; ctx.beginPath(); ctx.moveTo(x,plot.y); ctx.lineTo(x,plot.y+plot.h); ctx.stroke();
            text(ctx,number(tm,1)+(i===2 ? ' s' : ''),x,plot.y+plot.h+18,colors.muted,10,60,i===2 ? 'right' : i===0 ? 'left' : 'center');
        });
        ctx.save(); ctx.beginPath(); ctx.rect(plot.x-1,plot.y-2,plot.w+2,plot.h+4); ctx.clip();
        const step=Math.max(1,Math.floor((b-a)/Math.max(plot.w,1)));
        if (kind===1) {
            for (let i=a;i<b;i+=step) {
                const p=series.samples[i], q=series.samples[Math.min(i+step,b)];
                ctx.fillStyle=p.P>=0 ? '#ccebdd' : '#f2d5dd';
                ctx.beginPath(); ctx.moveTo(px(p.t),py(0)); ctx.lineTo(px(p.t),py(p.P)); ctx.lineTo(px(q.t),py(q.P)); ctx.lineTo(px(q.t),py(0)); ctx.closePath(); ctx.fill();
            }
        }
        values.forEach((fn,index)=>{
            ctx.strokeStyle=kind===0 ? [colors.force,colors.velocity][index] : kind===1 ? colors.text : [colors.work,colors.loss,colors.positive][index];
            ctx.lineWidth=2; ctx.setLineDash(kind===0 && index===1 || kind===2 && index===1 ? [5,3] : []);
            ctx.beginPath(); for (let i=a;i<=b;i+=step) { const s=series.samples[i]; if(i===a) ctx.moveTo(px(s.t),py(fn(s))); else ctx.lineTo(px(s.t),py(fn(s))); } ctx.stroke();
        });
        ctx.setLineDash([]); ctx.strokeStyle='#32494c'; ctx.lineWidth=1;
        ctx.beginPath(); ctx.moveTo(px(t),plot.y); ctx.lineTo(px(t),plot.y+plot.h); ctx.stroke();
        values.forEach((fn,index)=>{ ctx.fillStyle=kind===0 ? [colors.force,colors.velocity][index] : kind===1 ? (sample(series,t).P<0 ? colors.negative : colors.positive) : [colors.work,colors.loss,colors.positive][index]; ctx.beginPath(); ctx.arc(px(t),py(fn(sample(series,t))),3,0,2*Math.PI); ctx.fill(); });
        ctx.restore();
    }
    function render(ctx,w,h,series,t) {
        ctx.clearRect(0,0,w,h); ctx.fillStyle='#f3f7f5'; ctx.fillRect(0,0,w,h);
        const compact=w<620, margin=12, gap=12;
        const scene={x:margin,y:margin,w:compact ? w-2*margin : Math.min(300,w*0.34),h:compact ? 287 : h-2*margin};
        drawSwing(ctx,scene,series,sample(series,t),compact);
        const chartX=compact ? margin : scene.x+scene.w+gap, chartY=compact ? scene.y+scene.h+gap : margin;
        const chartW=compact ? w-2*margin : w-chartX-margin, chartH=(h-chartY-margin-2*gap)/3;
        const span=4*2*Math.PI/omega0, start=clamp(t-span*0.55,0,Math.max(0,series.duration-span)),end=start+span;
        for(let i=0;i<3;i++) drawPlot(ctx,{x:chartX,y:chartY+i*(chartH+gap),w:chartW,h:chartH},series,t,i,start,end);
    }
    function html() {
        return `<section class="swing-work" id="swing-work" data-swing-work aria-labelledby="swing-work-title">
            <h3 class="section-title" id="swing-work-title">盪鞦韆：什麼時候越推越高？</h3>
            <p class="swing-lead">先比較推力與速度，再看外力如何改變鞦韆的能量。判斷做功要用速度 v，而不是位移 x。</p>
            <div class="swing-modes" role="group" aria-label="鞦韆觀察模式"><button type="button" data-mode="compare" aria-pressed="true">① 正弦波做功對照</button><button type="button" data-mode="dynamic" aria-pressed="false">② 受迫鞦韆與共振</button></div>
            <p class="swing-mode-note" data-mode-note></p>
            <div class="swing-presets" role="group" aria-label="推力情境"><button type="button" data-preset="along">同頻・順推</button><button type="button" data-preset="against">同頻・反推</button><button type="button" data-preset="quarter">同頻・差 90°</button><button type="button" data-preset="detuned">不同頻率・1.5 倍</button></div>
            <div class="swing-layout"><div class="swing-stage"><canvas id="swing-work-canvas" role="img" aria-label="盪鞦韆、推力速度波形、功率及累積做功同步動畫">推力和速度同向時做正功，反向時做負功。請使用下方文字數值和操作按鈕。</canvas></div></div>
            <p class="swing-current"><span data-direction></span>　<span>F = <output data-value="F">0</output> N</span>　<span>v = <output data-value="v">0</output> m/s</span></p>
            <div class="swing-readouts">
                <article><span>時間 t</span><b data-readout="time">0.00 s</b></article><article><span>瞬時功率 P = Fv</span><b data-readout="power">0.00 W</b></article><article><span>累積外力功 W</span><b data-readout="work">0.00 J</b></article>
                <article data-dynamic><span>機械能 E</span><b data-readout="energy">0.00 J</b></article><article data-dynamic><span>阻尼耗散 D</span><b data-readout="loss">0.00 J</b></article><article data-dynamic><span>淨能量變化 ΔE = W − D</span><b data-readout="balance">0.00 J</b></article>
            </div>
            <div class="swing-transport"><button type="button" data-action="play">暫停</button><button type="button" data-action="step">前進 0.1 s</button><button type="button" data-action="reset">回到起點</button><label>播放速度<select data-speed aria-label="鞦韆播放速度"><option value="0.5">0.5×</option><option value="1" selected>1×</option><option value="2">2×</option></select></label></div>
            <label class="swing-timeline">時間軸：拖曳比較不同時刻<input type="range" data-time min="0" max="40" step="0.01" value="0" aria-label="鞦韆時間軸"></label>
            <div class="swing-controls">
                <label class="swing-control"><span>推力頻率／固有頻率 <output data-param-value="ratio">1.00</output></span><input data-param="ratio" type="range" min="0.5" max="2" step="0.05" value="1" aria-label="推力頻率比"></label>
                <label class="swing-control"><span><span data-phase-label>推力相對速度的相位 φ</span> <output data-param-value="phase">0°</output></span><input data-param="phase" type="range" min="0" max="360" step="5" value="0" aria-label="推力相位"></label>
                <label class="swing-control"><span>推力峰值 F₀ <output data-param-value="force">2.4 N</output></span><input data-param="force" type="range" min="0" max="3" step="0.1" value="2.4" aria-label="推力峰值"></label>
                <label class="swing-control" data-dynamic><span>阻尼係數 b/m <output data-param-value="damping">0.18 s⁻¹</output></span><input data-param="damping" type="range" min="0.15" max="0.6" step="0.01" value="0.18" aria-label="鞦韆阻尼"></label>
            </div>
            <div class="swing-equations"><p><b>做功的關係：</b>P = Fv，W = ∫ Fv dt。正功把能量傳入；負功把能量取出。</p><p data-frequency></p></div>
            <p class="swing-explain" data-explain role="status" aria-live="polite"></p>
            <details class="swing-model"><summary>看模型條件與相位公式</summary><div>
                <p>做功對照：指定 x = A sin(ω₀t)、v = Aω₀ cos(ω₀t)，F = F₀ cos(ωdt + φ)。固定擺幅只用來比較正負功；累積功不會在這個模式中直接改變擺幅。若實際保持這個擺幅，需要其他作用補償能量收支。</p>
                <p>同頻時，一整週期的平均功率為 ½F₀Aω₀ cos φ：0° 為正、180° 為負、90° 為零。不同頻率時相對相位會漂移；長時間平均趨近零，短時間仍可有淨功。</p>
                <p>受迫鞦韆：m x¨ + b x˙ + m(g/L)x = F。切向位移 x ≈ Lθ，機械能 E = ½mv² + ½m(g/L)x²，耗散 D = ∫ bv² dt；能量帳是 E − E₀ = W − D。</p>
                <p>模型採小角度、切向正弦推力：m = 20 kg、L = 2.0 m、g = 9.81 m/s²。示意擺角放大 3 倍；受迫模式開始時 x = 0、v &gt; 0。改變情境會重新從起點比較。波形各自除以峰值，只比較節奏與相位，兩條曲線的高度不代表相同物理量。</p>
                <p><a href="https://ocw.mit.edu/courses/8-03sc-physics-iii-vibrations-and-waves-fall-2016/pages/part-i-mechanical-vibrations-and-waves/lecture-3/" target="_blank" rel="noopener">物理參考：MIT 受迫振動與共振 ↗</a></p>
            </div></details>
        </section>`;
    }
    function explanation(config) {
        if (config.force===0) return config.mode==='dynamic' ? '現在沒有推力。阻尼持續耗散機械能，鞦韆振幅逐漸減小；外力做功為零。' : '現在沒有推力，外力功率與外力做功都為零。';
        if (config.mode==='dynamic') return Math.abs(config.ratio-1)<0.001
            ? '推力節奏等於固有頻率。相位控制的是開始推動的時刻；反向開始可先減能，但實際鞦韆之後會調整相位。有阻尼時，長期輸入與耗散平衡，振幅趨於有限穩態。'
            : '推力與固有頻率不同，反應通常較弱。受迫鞦韆會調整成驅動頻率的穩態；阻尼存在時仍需平均正功補回耗散，並非完全不做功。';
        if (Math.abs(config.ratio-1)>0.001) return '兩條正弦波頻率不同，相對相位會隨時間漂移：有時順推、有時反推。固定波形的長時間平均功率趨近零；目前累積功可正可負。切到受迫鞦韆看真實振幅如何回應。';
        const avg=0.5*config.force*constants.A*omega0*Math.cos(config.phase*Math.PI/180);
        return `同頻不代表一定加能。這個相位下一整週期的平均功率為 ${number(avg)} W。${Math.abs(avg)<0.001 ? '正負功相抵；瞬時功率仍會交替。' : avg>0 ? '淨功為正，外力整週把能量傳入。' : '淨功為負，外力整週把能量取出。'}此模式固定擺幅；實際能量與振幅請看受迫鞦韆。`;
    }
    function mount(host,disposers) {
        const canvas=host?.querySelector('canvas');
        if (!canvas || typeof canvas.getContext!=='function') return; // DOM-only startup audit has no canvas renderer
        let series=build(), time=0, speed=1, playing=!WaveRuntime.prefersReducedMotion(), visible=true, raf=null, disposed=false;
        const clock=WaveRuntime.createFixedClock({stepHz:60});
        let geometry;
        const readouts=Object.fromEntries(Array.from(host.querySelectorAll('[data-readout]')).map(el=>[el.dataset.readout,el]));
        const values=Object.fromEntries(Array.from(host.querySelectorAll('[data-value]')).map(el=>[el.dataset.value,el]));
        const play=host.querySelector('[data-action="play"]'), timeline=host.querySelector('[data-time]'), direction=host.querySelector('[data-direction]');
        function paint() {
            if(disposed || !geometry) return;
            render(geometry.ctx,geometry.width,geometry.height,series,time);
            const s=sample(series,time);
            readouts.time.textContent=number(time)+' s'; readouts.power.textContent=number(s.P)+' W'; readouts.work.textContent=number(s.W)+' J';
            readouts.energy.textContent=number(s.E)+' J'; readouts.loss.textContent=number(s.D)+' J'; readouts.balance.textContent=number(s.E-series.samples[0].E)+' J';
            values.F.textContent=number(s.F); values.v.textContent=number(s.v);
            const sign=Math.abs(s.P)<0.001 ? 'zero' : s.P>0 ? 'positive' : 'negative';
            direction.dataset.sign=sign; direction.textContent=sign==='positive' ? '正做功：正在傳入能量' : sign==='negative' ? '負做功：正在取出能量' : '此刻功率為零';
            timeline.value=String(time); play.textContent=playing ? '暫停' : time>=series.duration ? '重新播放' : '播放';
        }
        function stop() { if(raf!==null) global.cancelAnimationFrame(raf); raf=null; clock.reset(); }
        function frame(timestamp) {
            raf=null;
            if(disposed || !playing || !visible || document.hidden) return;
            clock.advance(timestamp,dt=>{time=Math.min(series.duration,time+dt*speed);});
            if(time>=series.duration) playing=false;
            paint(); if(playing) raf=global.requestAnimationFrame(frame);
        }
        function syncLoop() { stop(); if(playing && visible && !document.hidden) raf=global.requestAnimationFrame(frame); paint(); }
        function refresh() {
            const dynamic=series.config.mode==='dynamic';
            host.querySelectorAll('[data-mode]').forEach(el=>el.setAttribute('aria-pressed',String(el.dataset.mode===series.config.mode)));
            host.querySelectorAll('[data-dynamic]').forEach(el=>{el.hidden=!dynamic;});
            host.querySelector('[data-phase-label]').textContent=dynamic || Math.abs(series.config.ratio-1)>0.001 ? '開始推力的相位 φ' : '推力相對速度的相位 φ';
            host.querySelector('[data-mode-note]').textContent=dynamic ? '推力真的改變運動：觀察振幅、外力功與阻尼耗散。改變參數會重新比較；圖中的直線標示目前時刻。' : '固定擺幅，只比較兩條正弦波的做功。想看振幅如何改變，切到②受迫鞦韆；圖中的直線標示目前時刻。';
            host.querySelector('[data-preset="against"]').textContent=dynamic ? '同頻・先反向推' : '同頻・反推';
            host.querySelector('[data-preset="quarter"]').textContent=dynamic ? '同頻・起始相差 90°' : '同頻・差 90°';
            const presetStates={along:[1,0],against:[1,180],quarter:[1,90],detuned:[1.5,0]};
            host.querySelectorAll('[data-preset]').forEach(el=>{const [ratio,phase]=presetStates[el.dataset.preset];el.setAttribute('aria-pressed',String(series.config.ratio===ratio && series.config.phase%360===phase));});
            for(const key of ['ratio','phase','force','damping']) {
                host.querySelector(`[data-param="${key}"]`).value=String(series.config[key]);
                host.querySelector(`[data-param-value="${key}"]`).textContent=key==='phase' ? series.config[key]+'°' : key==='force' ? number(series.config[key],1)+' N' : key==='damping' ? number(series.config[key])+' s⁻¹' : number(series.config[key]);
            }
            host.querySelector('[data-frequency]').textContent=`固有頻率 f₀ = ${number(omega0/(2*Math.PI),3)} Hz，推力頻率 fd = ${number(series.config.ratio*omega0/(2*Math.PI),3)} Hz。擺角示意放大 3 倍。`;
            host.querySelector('[data-explain]').textContent=explanation(series.config);
            canvas.setAttribute('aria-label',dynamic ? '受迫鞦韆及推力、速度、功率、能量變化圖。下方提供數值。' : '固定擺幅鞦韆及推力、速度、功率、累積做功圖。下方提供數值。');
        }
        function change(config) { series=build(config); time=0; refresh(); syncLoop(); }
        disposers.addEventListener(host,'click',event=>{
            const target=event.target.closest('button'); if(!target || !host.contains(target)) return;
            if(target.dataset.mode) change({...series.config,mode:target.dataset.mode});
            if(target.dataset.preset) {
                const presets={along:{ratio:1,phase:0},against:{ratio:1,phase:180},quarter:{ratio:1,phase:90},detuned:{ratio:1.5,phase:0}};
                change({...series.config,...presets[target.dataset.preset]});
            }
            if(target.dataset.action==='play') { if(time>=series.duration) time=0; playing=!playing; syncLoop(); }
            if(target.dataset.action==='step') { playing=false; time=Math.min(series.duration,time+0.1); syncLoop(); }
            if(target.dataset.action==='reset') { time=0; syncLoop(); }
        });
        disposers.addEventListener(host,'input',event=>{
            if(event.target.dataset.param) change({...series.config,[event.target.dataset.param]:Number(event.target.value)});
            if(event.target.hasAttribute('data-time')) { playing=false; time=Number(event.target.value); syncLoop(); }
        });
        disposers.addEventListener(host,'change',event=>{ if(event.target.hasAttribute('data-speed')) { speed=Number(event.target.value); syncLoop(); } });
        function resize() { const width=canvas.clientWidth || canvas.parentElement.clientWidth || 640; geometry=WaveRuntime.fitCanvas(canvas,heightFor(width)); paint(); }
        disposers.addEventListener(global,'resize',resize);
        disposers.addEventListener(document,'visibilitychange',syncLoop);
        if(global.ResizeObserver) { const observer=new global.ResizeObserver(resize); observer.observe(canvas.parentElement); disposers.add(()=>observer.disconnect()); }
        if(global.IntersectionObserver) { const observer=new global.IntersectionObserver(entries=>{visible=entries[0].isIntersecting; syncLoop();}); observer.observe(canvas); disposers.add(()=>observer.disconnect()); }
        disposers.add(()=>{disposed=true;stop();});
        refresh(); resize(); syncLoop();
    }
    global.SwingWork={constants,defaults,heightFor,build,sample,render,html,mount};
})(window);
