/*
 * modulesData.js
 * 四個章節模組（波動、聲波、幾何光學、物理光學）的知識節點教材內容。
 * 每個節點依「核心公式 → 解題特徵 → 跨章延伸 → 大考題型」四層編排。
 */

const nodeMeta = {
    N01: { module: 1, section: '§1-1', title: '波動的性質與繩波波速', lab: 'travelling' },
    N02: { module: 1, section: '§1-2', title: '週期波與波速公式', lab: 'travelling' },
    N03: { module: 1, section: '§1-3', title: '波的反射與透射', lab: 'reflection' },
    N04: { module: 1, section: '§1-4', title: '疊加原理與駐波', lab: 'standing' },
    N05: { module: 1, section: '§1-5', title: '波前與惠更斯原理', lab: 'huygens' },
    N06: { module: 1, section: '§1-6', title: '水波的反射與折射', lab: 'huygens' },
    N07: { module: 1, section: '§1-6', title: '水波的干涉與繞射', lab: 'ripple' },
    N08: { module: 2, section: '§2-1', title: '聲波的傳播與聲速', lab: 'longitudinal' },
    N09: { module: 2, section: '§2-1', title: '聲波的波形：位移與壓力', lab: 'longitudinal' },
    N10: { module: 2, section: '§2-2', title: '管弦樂器的駐波', lab: 'pipes' },
    N11: { module: 2, section: '§2-2', title: '音調、響度與音色', lab: 'timbre' },
    N12: { module: 2, section: '§2-3', title: '共振、共鳴與空氣柱', lab: 'pipes' },
    N13: { module: 3, section: '§3-1', title: '光的反射與折射定律', lab: 'snell' },
    N14: { module: 3, section: '§3-1', title: '視深現象與光的色散', lab: 'snell' },
    N15: { module: 3, section: '§3-2', title: '全反射與臨界角', lab: 'snell' },
    N16: { module: 3, section: '§3-3', title: '透鏡成像與薄透鏡公式', lab: 'lens' },
    N17: { module: 3, section: '§3-3', title: '光學儀器與視力矯正', lab: 'lens' },
    N18: { module: 4, section: '§4-1', title: '光的波動說與科學史', lab: null },
    N19: { module: 4, section: '§4-2', title: '楊氏雙狹縫干涉', lab: 'fringe' },
    N20: { module: 4, section: '§4-3', title: '單狹縫繞射', lab: 'fringe' }
};

const labMeta = {
    travelling: { name: '行進波與質點振動', desc: '調整振幅、波長、頻率，觀察波形前進時介質質點只作上下簡諧運動。' },
    reflection: { name: '繩波的反射與透射', desc: '切換固定端／自由端，或設定兩段繩的線密度比，比較反射波與透射波。' },
    standing: { name: '駐波的形成', desc: '兩列反向行進波疊加成駐波，標出波節與波腹並比較各諧音。' },
    huygens: { name: '惠更斯原理與折射', desc: '以子波包絡線畫出新波前，觀察深淺水區交界的波長與偏折變化。' },
    ripple: { name: '水波槽雙波源干涉', desc: '調整波源間距與波長，即時計算腹線與節線的條數與位置。' },
    longitudinal: { name: '縱波的疏密與波形', desc: '把空氣分子的縱向位移轉成位移圖與壓力圖，找出密部與疏部中央。' },
    pipes: { name: '弦、開管與閉管的諧音', desc: '比較兩端固定弦、開管與閉管的駐波圖形、波長與可存在的諧音。' },
    timbre: { name: '諧音疊加與音色', desc: '調整各諧音的振幅比，觀察合成波形改變但基音頻率不變。' },
    snell: { name: '司乃耳定律與全反射', desc: '調整入射角與兩側折射率，觀察折射線偏折方向與臨界角。' },
    lens: { name: '薄透鏡成像作圖', desc: '拖曳物體位置與焦距，即時完成三條主要光線的成像作圖。' },
    fringe: { name: '雙狹縫干涉與單狹縫繞射', desc: '調整波長、縫距與縫寬，比較兩種條紋的寬度與亮度分布。' }
};

const modulesData = {
    1: {
        title: '模組一：波動',
        badge: '選修物理 Ch1',
        subtitle: '從單一脈衝到週期波、駐波與水波槽現象，建立「波速由介質決定、頻率由波源決定」的主軸。',
        formulas: [
            {
                node: 'N01',
                name: '波動的定義與分類',
                formula: '力學波（需介質）：繩波、水波、聲波　／　電磁波（不需介質）：光波、無線電波',
                anchor: '波動傳遞的是能量與動量，介質只在原處振動、不隨波前進。',
                desc: '<b>依需不需要介質分</b>：力學波必須靠介質振動傳遞；電磁波藉電場與磁場交替變化傳遞，可在真空中前進。<br><b>依振動方向分</b>：質點振動方向與傳播方向垂直者為橫波（繩波），平行者為縱波（空氣中的聲波）。<br><b>最常考的一句話</b>：波只傳遞能量，水面上的樹葉只在原處上下振動，不會被水波帶向岸邊。'
            },
            {
                node: 'N01',
                name: '繩波的波速',
                formula: 'v = \\sqrt{\\dfrac{F}{\\mu}}\\quad,\\quad \\mu = \\dfrac{m}{L}',
                anchor: '繩波波速只由張力與線密度決定，與振幅、頻率、波長完全無關。',
                probe: {
                    q: '同一條繩子上，把波源的振動頻率調成兩倍，波速會如何改變？',
                    opts: [
                        { t: '(A) 變成兩倍' },
                        { t: '(B) 不變，但波長變成一半', c: 1 },
                        { t: '(C) 變成一半' }
                    ]
                },
                desc: '線密度 $\\mu = m/L$，SI 單位為 kg/m。<br>• 同材質、同張力：細繩（$\\mu$ 小）波速快，粗繩（$\\mu$ 大）波速慢。<br>• 同一條繩：張力愈大波速愈快。<br>• 波速與波源無關 $\\Rightarrow$ 改變頻率時 $v$ 固定，只有波長跟著改變（$\\lambda = v/f$）。'
            },
            {
                node: 'N02',
                name: '週期波的波速公式',
                formula: 'v = \\dfrac{\\lambda}{T} = f\\lambda \\quad,\\quad f = \\dfrac{1}{T}',
                anchor: '波速由介質決定、頻率由波源決定，波長是兩者相除的結果。',
                desc: '波源作簡諧運動時產生正弦波。一個週期 $T$ 內波恰前進一個波長 $\\lambda$，故 $v = \\lambda / T = f\\lambda$。<br><b>圖形判讀是最大陷阱</b>：$y$–$x$ 圖上兩波峰的橫向距離是<b>波長 $\\lambda$</b>；$y$–$t$ 圖上兩波峰的間隔則是<b>週期 $T$</b>。題目常把兩張圖混在一起考。'
            },
            {
                node: 'N02',
                name: '質點振動方向的判定',
                formula: '波向 +x 前進 \\Rightarrow 質點下一刻會複製「它左邊」現在的位移',
                anchor: '把波形整體平移一小段，質點的新位置就告訴你它現在往哪動。',
                desc: '<b>作圖法</b>：將波形沿傳播方向平移一小段（虛線），比較該質點原位置與新位置的高低，即得瞬時速度方向。<br><b>速率大小</b>：質點在平衡位置速率最大，在波峰、波谷速率為零——這與波速 $v$ 是完全不同的物理量。'
            },
            {
                node: 'N03',
                name: '繩波在端點的反射',
                formula: '固定端：上下顛倒、左右相反　／　自由端：上下不顛倒、左右相反',
                anchor: '固定端反射有半波損失（相位反轉），自由端沒有。',
                desc: '<b>固定端</b>：繩對牆施力，牆依牛頓第三定律回施反向力，使繩向下振動 $\\Rightarrow$ 反射波上下顛倒。<br><b>自由端</b>：小環被拉起後回拉繩子，反射波上下不顛倒；入射波與反射波在端點疊加，小環最大高度約為入射振幅的 <b>2 倍</b>。<br>兩者的<b>振幅、波長、波速、頻率皆不變</b>，只有波形上下是否顛倒不同。'
            },
            {
                node: 'N03',
                name: '兩繩交界處的反射與透射',
                formula: '\\text{輕} \\to \\text{重}：反射波上下顛倒、透射波變慢變短　／　\\text{重} \\to \\text{輕}：反射波不顛倒、透射波變快變長',
                anchor: '把「重繩」想成固定端、「輕繩」想成自由端，反射波的顛倒與否立刻判定。',
                desc: '兩繩相接，<b>張力相同</b>，故 $v = \\sqrt{F/\\mu} \\propto 1/\\sqrt{\\mu}$。<br>• 反射波仍在原繩上 $\\Rightarrow$ <b>波速、波長、頻率皆不變</b>，振幅變小。<br>• 透射波進入新介質 $\\Rightarrow$ <b>頻率不變</b>（由波源決定），波速與波長同增同減。<br>• 由輕繩傳向重繩：透射波變慢、波長變短、振幅變小；由重繩傳向輕繩：透射波變快、波長變長、振幅變大（但能量仍小於入射波）。'
            },
            {
                node: 'N04',
                name: '波的疊加原理',
                formula: 'y_{\\text{合}} = y_1 + y_2 \\quad(\\text{向量和})',
                anchor: '兩波交會期間位移相加，交會之後各自維持原波形前進，宛如從未相遇。',
                desc: '振幅不大時，重疊區各質點的位移等於兩成分波位移的<b>代數（向量）和</b>：位移變大稱建設性干涉、變小稱破壞性干涉。<br><b>波的獨立性</b>：交會後兩波維持原本的波形、振幅與行進方向繼續前進。'
            },
            {
                node: 'N04',
                name: '駐波的波節與波腹',
                formula: '\\overline{NN} = \\overline{AA} = \\dfrac{\\lambda}{2} \\quad,\\quad \\overline{NA} = \\dfrac{\\lambda}{4}',
                anchor: '駐波的波形不前進，能量被鎖在波節之間，以動能與位能來回互換。',
                probe: {
                    q: '形成駐波的兩列波，下列哪一項「必須不同」？',
                    opts: [
                        { t: '(A) 振幅' },
                        { t: '(B) 頻率' },
                        { t: '(C) 行進方向', c: 1 }
                    ]
                },
                desc: '<b>形成條件</b>：振幅、波長、頻率相同但<b>行進方向相反</b>的兩正弦波疊加。<br>• 波節（N）位移恆為零；波腹（A）振幅為原行進波的 <b>2 倍</b>。<br>• 相鄰波節（或相鄰波腹）間距 $=\\lambda/2$；相鄰波節與波腹間距 $=\\lambda/4$。<br>• 駐波的頻率與波長皆與原行進波相同，但<b>不傳遞能量</b>。<br>• 波形成一直線的瞬間，除節點外各質點都在平衡位置，振動速率最大（不是為零）。'
            },
            {
                node: 'N04',
                name: '兩端固定弦的駐波',
                formula: 'L = n\\dfrac{\\lambda}{2} \\;\\Rightarrow\\; \\lambda_n = \\dfrac{2L}{n},\\; f_n = \\dfrac{nv}{2L}\\quad(n = 1,2,3,\\dots)',
                anchor: '兩端必為波節，所以弦長一定是半波長的整數倍。',
                desc: '$n=1$ 為<b>基音（第一諧音）</b>，$n=2,3,\\dots$ 為<b>泛音（高次諧音）</b>。<br><b>命名規則</b>：第幾諧音看 $n$；第幾泛音看順序。$n=2$ 是第二諧音、第一泛音。<br>兩端固定的弦<b>奇偶諧音都有</b>，這點與閉管樂器（只有奇數諧音）恰成對比。'
            },
            {
                node: 'N04',
                name: '一端固定、一端自由的駐波',
                formula: 'L = m\\dfrac{\\lambda}{4} \\;\\Rightarrow\\; \\lambda_m = \\dfrac{4L}{m},\\; f_m = \\dfrac{mv}{4L}\\quad(m = 1,3,5,\\dots)',
                anchor: '固定端必為波節、自由端必為波腹，於是只剩下奇數諧音。',
                desc: '固定端 $=$ 節點、自由端 $=$ 腹點，最短的駐波是 $1/4$ 個波長。<br>$m$ 只能取<b>奇數</b> $\\Rightarrow$ 只有第一、三、五、七…諧音，<b>沒有偶數諧音</b>。此結構與第二章的<b>閉管樂器</b>完全相同。'
            },
            {
                node: 'N05',
                name: '波前與惠更斯原理',
                formula: '\\text{波前上每一點} \\to \\text{新的點波源} \\to \\text{子波的包絡面} = \\text{新波前}',
                anchor: '波的傳播方向恆與波前垂直，這是所有折射、繞射作圖的起點。',
                desc: '<b>波前</b>：振動情形相同（同相）的點所連成的線或面。直線波的波前是一系列平行直線，圓形波的波前是同心圓；相鄰兩波峰波前的距離就是波長。<br><b>惠更斯原理</b>：波前上每一點都可視為新的點波源，各自發出子波；這些子波的<b>包絡線（面）</b>就是下一刻的新波前。折射、繞射都能用這一句話解釋。'
            },
            {
                node: 'N06',
                name: '水波的反射定律',
                formula: '\\theta_i = \\theta_r',
                anchor: '反射前後在同一介質，波速、波長、頻率全部不變。',
                desc: '入射線、反射線與法線共平面且分居法線兩側，入射角等於反射角。<br>入射角也等於<b>入射波前與反射面的夾角</b>——考題常直接給波前而不給射線。<br>直線波反射後仍為直線波前，圓形波反射後仍為圓形波前。'
            },
            {
                node: 'N06',
                name: '水波的折射與司乃耳定律',
                formula: '\\dfrac{\\sin\\theta_1}{\\sin\\theta_2} = \\dfrac{v_1}{v_2} = \\dfrac{\\lambda_1}{\\lambda_2} = \\text{定值}',
                anchor: '折射的唯一原因是波速改變；頻率由波源決定，穿越界面時絕不改變。',
                desc: '水波在<b>深水區波速快、波長長</b>；<b>淺水區波速慢、波長短</b>，頻率兩區相同。<br>• 深水 $\\to$ 淺水：波速變慢，折射線<b>偏向</b>法線。<br>• 淺水 $\\to$ 深水：波速變快，折射線<b>偏離</b>法線。<br>口訣：<b>波速快者波長長、與法線夾角大</b>。'
            },
            {
                node: 'N07',
                name: '兩同相點波源的腹線',
                formula: '\\Delta \\ell = |\\overline{PS_1} - \\overline{PS_2}| = n\\lambda \\quad(n = 0,1,2,\\dots)',
                anchor: '波程差是整數倍波長即完全建設性干涉，腹點振幅為單一波源的兩倍。',
                desc: '波程差為 $n\\lambda$ 的點連成<b>腹線</b>（$A_n$）：$n=0$ 為中央腹線（兩波源連線的中垂線），其餘左右對稱。<br>腹線是以 $S_1$、$S_2$ 為焦點的<b>雙曲線</b>（通過波源時退化為直線）。<br>腹點並非永遠停在最大位移，而是以 <b>2 倍振幅</b>在原處作簡諧運動 $\\Rightarrow$ 在水波槽白紙上呈現<b>亮暗交替</b>向外移動的紋路，不是一條固定亮線。'
            },
            {
                node: 'N07',
                name: '兩同相點波源的節線',
                formula: '\\Delta \\ell = \\left(m - \\dfrac{1}{2}\\right)\\lambda \\quad(m = 1,2,3,\\dots)',
                anchor: '波程差是半波長的奇數倍即完全破壞性干涉，該處水面完全靜止。',
                probe: {
                    q: '兩同相點波源產生干涉時，總腹線數必為？',
                    opts: [
                        { t: '(A) 奇數條', c: 1 },
                        { t: '(B) 偶數條' },
                        { t: '(C) 不一定' }
                    ]
                },
                desc: '節線上任一點合成位移恆為零，水面靜止 $\\Rightarrow$ 白紙上是<b>沒有明暗變化的灰色曲線</b>。<br><b>條數的算法</b>：兩波源連線上滿足駐波條件，相鄰節點間距 $\\lambda/2$、節點與腹點間距 $\\lambda/4$。同相波源的中央必為腹點 $\\Rightarrow$ <b>腹線總數必為奇數條</b>，節線總數必為偶數條。'
            },
            {
                node: 'N07',
                name: '水波的繞射',
                formula: '\\dfrac{d}{\\lambda} \\to 1 \\;\\Rightarrow\\; \\text{繞射愈明顯}',
                anchor: '狹縫或障礙物尺寸與波長愈接近，繞射愈明顯。',
                desc: '波通過障礙物、障礙物邊緣或狹縫時波前形狀改變、行進方向偏折，稱為繞射。<br>• $d/\\lambda = 12$：幾乎直線穿越，障礙物後方平靜無波。<br>• $d/\\lambda = 1$：通過狹縫後接近<b>圓形波</b>，原本的陰影區被填滿。<br><b>用惠更斯原理解釋</b>：抵達狹縫的波前上每一點各自發出圓形子波，向外傳播即形成繞射。'
            }
        ],
        conceptMap: `
            <div class="concept-map-container">
                <div class="map-node">
                    <div class="map-node-title">1. 波是能量的傳遞（§1-1）</div>
                    <div class="map-node-desc">介質只在原處振動。繩波波速 $v=\\sqrt{F/\\mu}$ 只由介質決定，與波源無關。</div>
                </div>
                <div class="map-connector">↓ 波源作規則的簡諧振動</div>
                <div class="map-node">
                    <div class="map-node-title">2. 週期波與 $v = f\\lambda$（§1-2）</div>
                    <div class="map-node-desc">頻率由波源決定、波速由介質決定，波長是兩者相除的結果。這條式子貫穿之後全部四章。</div>
                </div>
                <div class="map-connector">↓ 波遇到界面</div>
                <div class="map-node">
                    <div class="map-node-title">3. 反射與透射（§1-3）</div>
                    <div class="map-node-desc">反射波留在原介質（$v$、$\\lambda$ 不變）；透射波換介質（$f$ 不變、$v$ 與 $\\lambda$ 同增同減）。</div>
                </div>
                <div class="map-connector">↓ 入射波與反射波相遇</div>
                <div class="map-node">
                    <div class="map-node-title">4. 疊加與駐波（§1-4）</div>
                    <div class="map-node-desc">反向兩波疊加成駐波。兩端固定 $f_n = nv/2L$；一端自由 $f_m = mv/4L$（僅奇數）。第二章的弦樂器與管樂器直接沿用。</div>
                </div>
                <div class="map-connector">↓ 需要一個能作圖的波動模型</div>
                <div class="map-node">
                    <div class="map-node-title">5. 惠更斯原理（§1-5）</div>
                    <div class="map-node-desc">波前上每點都是新點波源，子波包絡面即新波前。折射、繞射、單狹縫繞射全都由此推得。</div>
                </div>
                <div class="map-connector">↓ 在水波槽中實際觀察</div>
                <div class="map-node">
                    <div class="map-node-title">6. 水波的四大現象（§1-6）</div>
                    <div class="map-node-desc">反射（$\\theta_i=\\theta_r$）、折射（司乃耳定律）、干涉（波程差）、繞射（$d/\\lambda$）。第三、四章的光學現象是同一套規則換成光。</div>
                </div>
            </div>
        `,
        keyFeatures: [
            {
                node: 'N01',
                feature: '題目給「繩長、質量、張力」，或比較粗細繩、不同掛重的波速。',
                bridge: '先算線密度 $\\mu = m/L$，再代 $v=\\sqrt{F/\\mu}$；跨過滑輪的懸掛物，張力量值等於物重。',
                trap: '⚡ 避坑指南：波速與「振幅、頻率、波長」通通無關。看到「把頻率調高，波速會不會變快」直接答不變。'
            },
            {
                node: 'N02',
                feature: '題目同時出現兩張圖，或只給一張圖卻問週期／波長。',
                bridge: '先確認橫軸是 $x$ 還是 $t$：$y$–$x$ 圖讀<b>波長</b>，$y$–$t$ 圖讀<b>週期</b>，再用 $v=f\\lambda$ 串起來。',
                trap: '⚡ 避坑指南：把 $y$–$t$ 圖上兩波峰的間隔誤讀成波長，是這一節最高頻的失分點。'
            },
            {
                node: 'N02',
                feature: '題目問「某瞬間繩上 P 點往哪個方向運動」。',
                bridge: '沿波前進方向把整個波形平移一小段，看 P 點的新高度是升是降。或用口訣：波向 +x 走，質點複製它左邊的位移。',
                trap: '⚡ 避坑指南：質點只上下振動，永遠不會有「向左」或「向右」的速度分量；把波速方向誤當質點速度方向即全錯。'
            },
            {
                node: 'N03',
                feature: '題目畫出脈衝波打到牆、打到小環，或打到兩段粗細不同的繩子交界。',
                bridge: '先問「反射端相當於固定端還是自由端」：牆與重繩 $\\to$ 固定端（上下顛倒）；小環與輕繩 $\\to$ 自由端（不顛倒）。反射波一律左右相反。',
                trap: '⚡ 避坑指南：透射波<b>永遠不會上下顛倒</b>，只有反射波才需要判斷顛倒與否。'
            },
            {
                node: 'N04',
                feature: '兩個脈衝波相向而行，問經過某段時間後的合成波形。',
                bridge: '先算各自前進的距離 $v\\Delta t$ 把兩個波形畫到新位置，再逐點做位移的代數和。交會後兩波恢復原狀繼續前進。',
                trap: '⚡ 避坑指南：疊加是「位移相加」不是「振幅相加」；一正一負的脈衝重疊時會互相抵消而非變高。'
            },
            {
                node: 'N04',
                feature: '題目給弦長與波腹數（或波節數），問波長、頻率或起振器頻率。',
                bridge: '直接數圖：$n$ 個波腹 $\\Rightarrow L = n\\lambda/2$。若需要頻率，再用 $v=\\sqrt{F/\\mu}$ 求波速後代 $f=v/\\lambda$。',
                trap: '⚡ 避坑指南：弦上駐波的頻率 $f = nv/2L$ 算出的 $v$ 是<b>弦上的波速</b>，不是聲音在空氣中的波速（約 340 m/s）。'
            },
            {
                node: 'N06',
                feature: '水波槽中放厚玻璃片形成深淺水區，題目給波前圖問波長、波速或偏折方向。',
                bridge: '先辨認深淺：<b>波長長的是深水區</b>。頻率兩區相同，用 $v=f\\lambda$ 換波速，再用 $\\sin\\theta_1/\\sin\\theta_2 = \\lambda_1/\\lambda_2$ 求角度。',
                trap: '⚡ 避坑指南：入射角是<b>射線與法線</b>的夾角，也等於<b>波前與界面</b>的夾角；圖上給的角度到底是哪一個，務必先看清楚。'
            },
            {
                node: 'N07',
                feature: '題目給兩個喇叭或兩個點波源，問某位置聽到的聲音最強或最弱、或問位於第幾條腹（節）線。',
                bridge: '算波程差 $\\Delta\\ell = |PS_1 - PS_2|$，再除以 $\\lambda$：整數倍 $\\Rightarrow$ 第 $n$ 腹線；半整數倍 $\\Rightarrow$ 第 $m$ 節線。',
                trap: '⚡ 避坑指南：都是完全建設性干涉的點，離波源愈遠振幅愈小，所以「最強」不一定在最外側的腹線上。'
            },
            {
                node: 'N07',
                feature: '題目比較不同狹縫寬度（或障礙物大小）下的繞射圖形。',
                bridge: '只看一個比值 $d/\\lambda$：愈接近 1 繞射愈明顯，通過狹縫後愈接近圓形波。',
                trap: '⚡ 避坑指南：繞射前後<b>波長與頻率都不變</b>，改變的只有波前形狀與傳播方向。'
            }
        ],
        extensions: `
            <div class="edu-table-container">
                <table class="edu-table">
                    <thead>
                        <tr>
                            <th style="width: 24%">延伸主題</th>
                            <th style="width: 38%">與本章的連結</th>
                            <th>解題提示</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><strong>駐波 → 第二章樂器</strong></td>
                            <td>兩端固定弦（$f_n = nv/2L$）＝弦樂器；一端固定一端自由（$f_m = mv/4L$，僅奇數）＝閉管樂器。</td>
                            <td>不必硬背四條公式，會畫駐波圖就能當場推導出波長與管（弦）長的關係。</td>
                        </tr>
                        <tr>
                            <td><strong>水波折射 → 第三章光的折射</strong></td>
                            <td>$\\sin\\theta_1/\\sin\\theta_2 = v_1/v_2 = \\lambda_1/\\lambda_2$ 原封不動搬到光學，只是把「波速比」寫成折射率的倒數比。</td>
                            <td>深水區 $\\leftrightarrow$ 光疏介質（快）；淺水區 $\\leftrightarrow$ 光密介質（慢）。偏向或偏離法線的判準完全一樣。</td>
                        </tr>
                        <tr>
                            <td><strong>雙波源干涉 → 第四章雙狹縫</strong></td>
                            <td>波程差 $n\\lambda$ 為亮紋、$(m-\\frac{1}{2})\\lambda$ 為暗紋，與水波的腹線、節線是同一條判準。</td>
                            <td>楊氏實驗的 $\\Delta\\ell = d\\sin\\theta \\approx dy/L$ 只是把水波的波程差換成小角近似後的形式。</td>
                        </tr>
                        <tr>
                            <td><strong>惠更斯原理 → 單狹縫繞射</strong></td>
                            <td>把狹縫上的波前視為無數個點波源，才有第四章「將狹縫等分成兩區成對抵消」的暗紋分析法。</td>
                            <td>凡是題目要你「解釋為什麼」波會轉彎或形成條紋，答案幾乎都要回到惠更斯原理。</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        `,
        examQuestions: [
            { node: ['N01'], year: '學測', title: '波動的一般特性（單選）', desc: '<strong>解題特徵引導：</strong>四個選項分別檢驗「可傳遞能量與動量」「有干涉與繞射」「遇不同介質有反射與折射」「介質會隨波傳播出去」。最後一項是唯一錯誤敘述——介質只在原處振動。這題把波動的四個共同性質一次考完，適合當作本章的自我檢核。' },
            { node: ['N02'], year: '102 指考（答對率 89%）', title: '繩上質點 P 的瞬時運動方向', desc: '<strong>解題特徵引導：</strong>給 $y$–$x$ 圖並標出恰在 $x$ 軸上的質點 P，問這一瞬間 P 的運動方向。把波形沿傳播方向平移一小段畫成虛線，即可看出 P 將向上。答錯的人多半誤選了「向右」——那是波速的方向而非質點速度。' },
            { node: ['N02'], year: '105 學測（答對率 51%）', title: '鉛直位移之和恆為零的兩點', desc: '<strong>解題特徵引導：</strong>題目說相距 1.5 cm 的甲、乙兩點鉛直位移之和恆為零 $\\Rightarrow$ 兩點必為一峰一谷的關係，距離為 $(n-\\frac{1}{2})\\lambda$，波長不唯一。再由 $y$–$t$ 圖讀出 $T = 0.4$ s 得 $f = 2.5$ Hz，逐一代入 $v=f\\lambda$ 檢查哪個選項可能。答對率僅五成，關鍵在於「波長有多組解」這個轉折。' },
            { node: ['N04'], year: '指考（答對率 61%）', title: '兩個不等高脈衝波交會後的波形', desc: '<strong>解題特徵引導：</strong>先用 $v\\Delta t$ 算出兩波各自前進的距離，把波形移到新位置，再逐點做代數和。此題只要老實作圖就一定對，錯誤多半來自沒有把「不等高」的兩波正確對齊。' },
            { node: ['N04'], year: '100 指考（答對率 86%）', title: '兩端固定弦上的駐波波長', desc: '<strong>解題特徵引導：</strong>由圖數出波腹數 $n$，直接套 $L = n\\lambda/2$。這是本章最基本、也最不該失分的題型。' },
            { node: ['N04'], year: '103 指考（答對率 60%）', title: '弦的基頻與泛音（多考點整合）', desc: '<strong>解題特徵引導：</strong>長 1.50 m 兩端固定的弦最低音頻 264 Hz。要同時判斷：基頻就是最低頻率（264 Hz 而非 132 Hz）、基頻波長為 $2L$、音頻愈高波長愈短、可產生基頻整數倍的頻率、以及 $f\\lambda$ 算出的是<b>弦上波速</b>而非空氣中的聲速。最後一項是最經典的誘答。' },
            { node: ['N04'], year: '指考（答對率 31%）', title: '起振器頻率與掛重的駐波', desc: '<strong>解題特徵引導：</strong>先由掛重求張力 $F = mg$、由總長與總質量求 $\\mu$，得 $v=\\sqrt{F/\\mu}$；再由「三個波節（不含兩端）」判斷 $n=4$，用 $f = nv/2L$ 求解。答對率只有三成，難點在於<b>弦長要用 PQ 段的 4.0 m，線密度卻要用整條 5.0 m 的線</b>去算。' },
            { node: ['N06'], year: '103 指考（答對率 74%）', title: '深淺水區的波前與傳播方向', desc: '<strong>解題特徵引導：</strong>正確的圖必須同時滿足三個條件：深水區波長較長、傳播方向與波前垂直、深水進淺水時折射線偏向法線。用這三把尺逐一刪去選項即可。' },
            { node: ['N07'], year: '指考（答對率 42%）', title: '兩喇叭前五位聽者的音量比較', desc: '<strong>解題特徵引導：</strong>題目給某瞬間兩波谷的波前，先判斷各位置是腹點還是節點。關鍵轉折在於：三個都是完全建設性干涉的位置，仍要再比較「離波源的遠近」才知道誰聽到最強。這正是答對率偏低的原因。' }
        ]
    },

    2: {
        title: '模組二：聲波',
        badge: '選修物理 Ch2',
        subtitle: '把第一章的縱波、駐波與共振觀念放進真實樂器：聲速、疏密波形、開閉管諧音與共鳴空氣柱實驗。',
        formulas: [
            {
                node: 'N08',
                name: '空氣中的聲速與溫度',
                formula: 'v = 331 + 0.6\\,T \\;\\;(\\text{m/s},\\; T \\text{ 為攝氏溫度})',
                anchor: '聲速只由介質種類與溫度決定，與頻率、振幅、音色全部無關。',
                probe: {
                    q: '三人同時在操場說話，聲音又尖又高的人，聲音傳得比較快嗎？',
                    opts: [
                        { t: '(A) 是，頻率高傳得快' },
                        { t: '(B) 不是，三人一樣快', c: 1 },
                        { t: '(C) 要看音量大小' }
                    ]
                },
                desc: '$0^\\circ$C 乾燥空氣中聲速約 331 m/s，溫度每升高 $1^\\circ$C 約增加 0.6 m/s；$15^\\circ$C 時約 340 m/s、$20^\\circ$C 時約 343 m/s。<br><b>不同介質的聲速</b>：固體 $>$ 液體 $>$ 氣體（鋼 5950、海水 1533、空氣 343 m/s）。<br>同一介質中 $v$ 為定值 $\\Rightarrow$ $f$ 加倍則 $\\lambda$ 減半。'
            },
            {
                node: 'N08',
                name: '聲波的性質',
                formula: '\\text{空氣中的聲波：縱波、力學波，需要介質}',
                anchor: '真空不能傳聲——抽真空的鐘罩實驗是這句話的標準證據。',
                desc: '空氣分子的振動方向與傳播方向<b>平行</b>（縱波），分子只在原處來回振動、不隨波前進。<br>聲波同樣具有反射（回聲、聲納）、折射、干涉與繞射。<br><b>折射時頻率不變</b>：由空氣進入水或玻璃，聲速變快 $\\Rightarrow$ 波長變長。這與光由空氣進入玻璃（變慢、變短）方向相反，極易搞混。'
            },
            {
                node: 'N09',
                name: '位移波形與壓力波形的相位差',
                formula: '\\text{位移最大處} \\Rightarrow \\Delta P = 0 \\quad,\\quad \\text{位移為零處} \\Rightarrow |\\Delta P| \\text{ 最大}',
                anchor: '位移圖與壓力圖相差四分之一波長，密部與疏部中央的分子位移都是零。',
                desc: '把縱波的分子位移 $\\Delta x$（向右為正）畫成 $y$–$x$ 圖後：<br>• <b>密部中央</b>：位移 0、密度與壓力<b>最大</b>、振動速率最大。<br>• <b>疏部中央</b>：位移 0、密度與壓力<b>最小</b>、振動速率最大。<br>• <b>疏密之間</b>：位移量值最大、壓力與未擾動時相同、振動速率為零。<br><b>判圖技巧</b>：在位移圖上找「兩側箭頭互相指向」的位置就是密部中央，「互相背離」的就是疏部中央。'
            },
            {
                node: 'N10',
                name: '弦樂器與開管樂器',
                formula: 'f_n = \\dfrac{nv}{2L}\\quad(n = 1,2,3,4,\\dots)',
                anchor: '兩端條件相同（都固定或都開口），弦長／管長就是半波長的整數倍。',
                desc: '<b>弦樂器</b>（提琴、吉他）：兩端固定 $\\Rightarrow$ 兩端皆為波節。<br><b>開管樂器</b>（長笛、直笛、簫）：兩端開口與大氣相通，壓力等於大氣壓 $\\Rightarrow$ 兩端皆為<b>位移的腹點、壓力的節點</b>。<br>兩者的駐波條件都是 $L = n\\lambda/2$，<b>奇偶諧音齊全</b>。'
            },
            {
                node: 'N10',
                name: '閉管樂器',
                formula: 'f_m = \\dfrac{mv}{4L}\\quad(m = 1,3,5,7,\\dots)',
                anchor: '閉口端是位移節點、開口端是位移腹點，因此只有奇數諧音。',
                probe: {
                    q: '把一支開管與一支閉管的長度都減半，基音頻率各會如何？',
                    opts: [
                        { t: '(A) 都變成 2 倍', c: 1 },
                        { t: '(B) 開管變 2 倍、閉管變 4 倍' },
                        { t: '(C) 都不變' }
                    ]
                },
                desc: '閉口端空氣分子受限，近似為<b>固定端</b>（位移節點、壓力腹點）；開口端為<b>自由端</b>（位移腹點、壓力節點）。<br>基音波長 $\\lambda_1 = 4L$，是管長的 <b>4 倍</b>；諧音頻率只有基頻的<b>奇數倍</b>（1、3、5、7 …），<b>沒有偶數諧音</b>。<br>同樣長度時，閉管基頻是開管基頻的一半（低八度）。'
            },
            {
                node: 'N11',
                name: '音調、響度與音色',
                formula: '\\text{音調} \\leftarrow f \\quad,\\quad \\text{響度} \\leftarrow \\text{振幅} \\quad,\\quad \\text{音色} \\leftarrow \\text{波形}',
                anchor: '各諧音疊加後的合成波形，其頻率仍等於基音頻率——所以音調由基音決定。',
                desc: '樂器發聲時基音與泛音同時出現，聽到的是它們<b>疊加後的波形</b>。<br>• 無論開管或閉管、也無論泛音強度是否大於基音，合成波的<b>週期就是基音的週期</b>。<br>• 音叉、小提琴、鋼琴奏同一個音時音調相同（頻率相同），但波形不同 $\\Rightarrow$ 音色不同。<br><b>常考判圖</b>：兩個波形在相同時間內波數相同 $\\Rightarrow$ 頻率相同 $\\Rightarrow$ 音調相同，與波形長相如何無關。'
            },
            {
                node: 'N12',
                name: '固有頻率與共振',
                formula: 'f_{\\text{外界擾動}} = f_{\\text{固有}} \\;\\Rightarrow\\; \\text{振幅大幅增加}',
                anchor: '共振要求「頻率相同」，不要求振幅相同。',
                desc: '物體受微擾後自行振盪的頻率稱為<b>固有頻率（自然頻率）</b>；一個系統可以有很多個固有頻率（例如弦上所有的駐波頻率）。<br>外界週期性擾動的頻率與固有頻率相同時，即使擾動很小也會產生大幅振盪 $\\Rightarrow$ <b>共振</b>；聲音的共振稱為<b>共鳴</b>。<br><b>實例</b>：單擺共振（等長的擺才會被帶動）、1940 年塔可馬吊橋被風吹毀、吉他與提琴的共鳴箱增強響度。'
            },
            {
                node: 'N12',
                name: '共鳴空氣柱實驗',
                formula: '\\ell_m = m\\dfrac{\\lambda}{4}\\;(m=1,3,5,\\dots) \\quad\\Rightarrow\\quad \\Delta \\ell_{\\text{連續兩次}} = \\dfrac{\\lambda}{2}',
                anchor: '解題一律用「連續兩次共鳴點相距半波長」，避開管口修正造成的誤差。',
                desc: '共鳴管等效於<b>閉管</b>：水面為固定端（節點）、管口為自由端（腹點）。<br><b>管口修正</b>：真正的腹點不在管口，而在管口上方約 $0.61r$（$r$ 為管半徑）處。<br>$\\Rightarrow$ 第一個共鳴點 $\\lambda/4$ 的量測誤差最大，<b>解題時應改用相鄰兩共鳴點的差值 $\\lambda/2$</b>，再由 $v = f\\lambda$ 求聲速或未知音叉頻率。'
            }
        ],
        conceptMap: `
            <div class="concept-map-container">
                <div class="map-node">
                    <div class="map-node-title">1. 聲波是縱波（§2-1）</div>
                    <div class="map-node-desc">分子沿傳播方向來回振動形成疏密相間，需要介質，$v = 331+0.6T$ 只與介質與溫度有關。</div>
                </div>
                <div class="map-connector">↓ 把縱波畫成看得懂的圖</div>
                <div class="map-node">
                    <div class="map-node-title">2. 位移圖與壓力圖（§2-1）</div>
                    <div class="map-node-desc">兩張圖相差 $\\lambda/4$：位移為零處壓力變化最大（密部／疏部中央），位移最大處壓力變化為零。</div>
                </div>
                <div class="map-connector">↓ 讓聲波在管或弦中來回反射</div>
                <div class="map-node">
                    <div class="map-node-title">3. 駐波與樂器（§2-2）</div>
                    <div class="map-node-desc">弦與開管 $f_n = nv/2L$（奇偶諧音齊全）；閉管 $f_m = mv/4L$（僅奇數諧音）。這正是第一章駐波的兩種端點條件。</div>
                </div>
                <div class="map-connector">↓ 諧音一起出現</div>
                <div class="map-node">
                    <div class="map-node-title">4. 音調與音色（§2-2）</div>
                    <div class="map-node-desc">合成波的頻率＝基音頻率（決定音調）；諧音的振幅比決定波形，也就決定音色。</div>
                </div>
                <div class="map-connector">↓ 如何讓特定頻率被放大</div>
                <div class="map-node">
                    <div class="map-node-title">5. 共振與共鳴空氣柱（§2-3）</div>
                    <div class="map-node-desc">外界頻率＝固有頻率時振幅大增。共鳴管是閉管，連續兩共鳴點相距 $\\lambda/2$，可用來量聲速。</div>
                </div>
            </div>
        `,
        keyFeatures: [
            {
                node: 'N08',
                feature: '題目比較不同音調、不同音量的聲音誰傳得快，或問回聲、聲納的距離。',
                bridge: '先寫下「聲速只與介質與溫度有關」。回聲與聲納一律注意<b>來回路徑</b>：距離 $= v \\times t/2$。',
                trap: '⚡ 避坑指南：聲音由空氣進入水或固體，聲速<b>變快</b>、波長<b>變長</b>；別套用光「進入密介質變慢」的直覺。'
            },
            {
                node: 'N09',
                feature: '題目給空氣分子的位移－位置圖，問哪裡是密部、哪裡壓力最大，或要求畫出 $\\Delta P$–$x$ 圖。',
                bridge: '把 $\\pm y$ 翻譯成分子的左右位移箭頭：兩側箭頭「面對面」處是密部中央，「背對背」處是疏部中央。',
                trap: '⚡ 避坑指南：疏部中央的壓力是「最小」而不是「零」，位移也是零而不是最大——這兩個選項年年出現。'
            },
            {
                node: 'N10',
                feature: '題目同時出現長笛（開管）與單簧管（閉管），要求比較某個諧音的頻率或管長。',
                bridge: '直接寫兩條式子：開管 $f = nv/2L$（$n$ 任意整數）、閉管 $f = mv/4L'+"'"+'$（$m$ 為奇數），再依題意令兩者相等。',
                trap: '⚡ 避坑指南：閉管的「第一泛音」是 $m=3$（第三諧音），不是 $m=2$。把泛音序號直接當成 $m$ 會全錯。'
            },
            {
                node: 'N11',
                feature: '題目給兩個波形圖，問音調、響度或音色何者相同。',
                bridge: '數相同時間內的波數 $\\Rightarrow$ 頻率 $\\Rightarrow$ 音調；看高度 $\\Rightarrow$ 振幅 $\\Rightarrow$ 響度；看形狀 $\\Rightarrow$ 音色。',
                trap: '⚡ 避坑指南：波形不同<b>不代表</b>音調不同。合成波的頻率永遠等於基音的頻率。'
            },
            {
                node: 'N12',
                feature: '共鳴空氣柱實驗給出連續三次共鳴的空氣柱長度表格。',
                bridge: '取相鄰兩次的差值 $=\\lambda/2$ 求波長，再用 $v=f\\lambda$；要問還能找到幾個共鳴點，就一直加 $\\lambda/2$ 直到超過管長。',
                trap: '⚡ 避坑指南：不要用第一個共鳴點去算 $\\lambda/4$——管口修正（腹點在管口上方 $0.61r$）會讓這個數字系統性偏小。'
            }
        ],
        extensions: `
            <div class="edu-table-container">
                <table class="edu-table">
                    <thead>
                        <tr>
                            <th style="width: 24%">延伸主題</th>
                            <th style="width: 38%">與本章的連結</th>
                            <th>解題提示</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><strong>生物：聽覺與可聽頻率</strong></td>
                            <td>人耳可聽範圍約 20～20000 Hz；高於此為超聲波、低於此為聲下波。狗約 50000 Hz、貓約 70000 Hz、蝙蝠可發出約 120000 Hz。</td>
                            <td>比較「誰聽得到誰」時，先把各自的<b>發出頻率</b>與<b>可聽上限</b>列表，再用 $\\lambda = v/f$ 換算波長。</td>
                        </tr>
                        <tr>
                            <td><strong>工程：塔可馬吊橋與建築防震</strong></td>
                            <td>1940 年塔可馬吊橋因風致振動頻率接近橋的固有頻率而崩塌，是共振最著名的工程案例。</td>
                            <td>共振題只要抓住「兩個頻率是否相同」，與振幅、能量大小無關。</td>
                        </tr>
                        <tr>
                            <td><strong>海洋：聲納與海底地形</strong></td>
                            <td>海水中聲速約 1500 m/s，發射脈衝到收到反射波的時間差可換算深度。</td>
                            <td>聲納能測<b>海底地形與魚群</b>（反射），但無法直接測水溫、鹽度或溶氧量。</td>
                        </tr>
                        <tr>
                            <td><strong>音樂：為什麼閉管低八度</strong></td>
                            <td>同長度時閉管基頻 $v/4L$ 只有開管 $v/2L$ 的一半，而且缺少偶數諧音，音色明顯不同。</td>
                            <td>把「開管↔兩端固定弦」「閉管↔一端固定一端自由」對照記憶，四條公式只需要記兩張圖。</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        `,
        examQuestions: [
            { node: ['N08'], year: '學測', title: '三人在操場說話，誰的聲音傳得最快', desc: '<strong>解題特徵引導：</strong>題幹用「又尖又高」「宏亮大聲」「又快又急」分別暗示頻率、振幅與語速，全都與聲速無關。答案是三人一樣快。這題檢驗的是「聲速只由介質與溫度決定」這一句話有沒有真的記住。' },
            { node: ['N08'], year: '學測', title: '浴室唱歌為何比較好聽（多選）', desc: '<strong>解題特徵引導：</strong>正確選項是「瓷磚表面光滑易反射」與「空間狹窄門窗緊閉」，兩者都指向<b>回聲與駐波的加強</b>。「心情愉快」與「浴室聲速較快」皆為誘答。' },
            { node: ['N08'], year: '學測', title: '潛艇聲納測海底深度', desc: '<strong>解題特徵引導：</strong>由強度－時間圖分辨出「強度較大的是發射波、較小的是反射波」，讀出時間差 6 s，再用 $d = v\\,t/2 = 1500 \\times 3 = 4500$ m。關鍵在於<b>除以 2</b>。' },
            { node: ['N09'], year: '指考', title: '位移－位置圖判讀疏密與壓力', desc: '<strong>解題特徵引導：</strong>把 $y>0$ 讀成分子向右、$y<0$ 讀成向左，畫出箭頭後判斷密部與疏部中央，再據此畫出 $\\Delta P$–$x$ 圖。位移圖與壓力圖相差 $\\lambda/4$ 是本題的核心。' },
            { node: ['N10'], year: '109 指考（答對率 56%）', title: '長笛基音與單簧管第一泛音同頻', desc: '<strong>解題特徵引導：</strong>長笛為開管取 $n=1$、單簧管為閉管的第一泛音取 $m=3$，令 $\\dfrac{v}{2L} = \\dfrac{3v}{4L'+"'"+'}$ 得 $L : L'+"'"+' = 2 : 3$。答對率不到六成，失分主因是把閉管第一泛音誤取成 $m=2$。' },
            { node: ['N10'], year: '段考經典', title: '開管與閉管基音的比較（多選）', desc: '<strong>解題特徵引導：</strong>需同時判斷：只有特定頻率能形成駐波、開管基音 $L=\\lambda/2$、閉管基音 $L=\\lambda/4$（波長為管長 4 倍）、基頻與波速有關故受溫度影響、以及 $f \\propto 1/L$ 使管長減半時兩種管的基頻都加倍。' },
            { node: ['N12'], year: '段考經典', title: '共鳴空氣柱求聲速與未知頻率', desc: '<strong>解題特徵引導：</strong>表格給出兩支音叉各三次的共鳴長度。用相鄰差值求 $\\lambda/2$：甲為 42 cm $\\Rightarrow \\lambda = 0.84$ m，$v = 0.84 \\times 400 = 336$ m/s；乙為 28 cm $\\Rightarrow \\lambda = 0.56$ m，$f = 336/0.56 = 600$ Hz。再持續加 28 cm 判斷還剩幾個共鳴點未超過管長。' }
        ]
    }
,

    3: {
        title: '模組三：幾何光學',
        badge: '選修物理 Ch3',
        subtitle: '把水波的折射定律換成光：折射率、視深、色散、全反射與薄透鏡成像，全部用「光速改變」一條線串起來。',
        formulas: [
            {
                node: 'N13',
                name: '光的反射定律與兩種反射',
                formula: '\\theta_i = \\theta_r',
                anchor: '鏡面反射與漫反射都遵守反射定律，差別只在表面各點的法線方向是否平行。',
                desc: '<b>鏡面反射</b>：平滑表面各點法線平行 $\\Rightarrow$ 平行光反射後仍為平行光，可成清晰的像。<br><b>漫反射（漫射）</b>：粗糙表面各點法線方向不同 $\\Rightarrow$ 反射光射向四面八方。我們能從各個角度看見不發光的物體，正是漫射的結果。<br>兩者都是<b>逐點遵守反射定律</b>，不是「漫射不遵守定律」。'
            },
            {
                node: 'N13',
                name: '折射率與光速',
                formula: 'n = \\dfrac{c}{v} \\quad\\Rightarrow\\quad v = \\dfrac{c}{n} \\propto \\dfrac{1}{n}',
                anchor: '折射率是「真空光速比介質光速」，所以任何介質的 n 都大於 1。',
                probe: {
                    q: '光由空氣進入水中，下列哪一個量「不會」改變？',
                    opts: [
                        { t: '(A) 波速' },
                        { t: '(B) 波長' },
                        { t: '(C) 頻率', c: 1 }
                    ]
                },
                desc: '常用數值：空氣 $n \\approx 1$、水 $n = 4/3$（$v \\approx 2.3\\times10^8$ m/s）、玻璃 $n = 3/2$（$v = 2.0\\times10^8$ m/s）、鑽石 $n = 2.4$。<br><b>折射時頻率永遠不變</b>（由波源決定）$\\Rightarrow$ $\\lambda_{\\text{介質}} = \\lambda_{\\text{真空}}/n$，光速變慢、波長變短，顏色不變。'
            },
            {
                node: 'N13',
                name: '司乃耳定律的一般式',
                formula: 'n_1 \\sin\\theta_1 = n_2 \\sin\\theta_2 \\quad,\\quad \\dfrac{\\sin\\theta_1}{\\sin\\theta_2} = \\dfrac{v_1}{v_2} = \\dfrac{\\lambda_1}{\\lambda_2} = \\dfrac{n_2}{n_1}',
                anchor: '光疏（n 小、光速快）→ 光密（n 大、光速慢）時折射線偏向法線。',
                desc: '<b>光疏介質</b>：光速較快、折射率較小。<b>光密介質</b>：光速較慢、折射率較大。兩者是<b>相對</b>的：水對空氣是光密，對玻璃卻是光疏。<br>• 疏 $\\to$ 密（$n_1 < n_2$）：$\\theta_1 > \\theta_2$，<b>偏向</b>法線。<br>• 密 $\\to$ 疏（$n_1 > n_2$）：$\\theta_1 < \\theta_2$，<b>偏離</b>法線。<br><b>平行板結論</b>：$n_1\\sin\\theta_1 = n_2\\sin\\theta_2 = n_3\\sin\\theta_3$，中間夾幾層平行介質都不影響最後的折射角，出射線必<b>平行</b>入射線，只產生側位移。'
            },
            {
                node: 'N13',
                name: '平行板的側位移',
                formula: 'D = \\dfrac{t}{\\cos\\theta_2}\\sin(\\theta_1 - \\theta_2)',
                anchor: '入射線與出射線平行，只是被平移了一段距離 D。',
                desc: '厚度 $t$ 的平行板，光以 $\\theta_1$ 入射、板內折射角 $\\theta_2$，射出時角度回復為 $\\theta_1$。<br>常見特例：$\\theta_1 = 60^\\circ$、$n = \\sqrt{3}$ 時 $\\theta_2 = 30^\\circ$，側位移 $D = t\\tan 30^\\circ$。<br><b>應用</b>：兩塊相同直角三角形玻璃夾一層介質，比較中間介質折射率大小時，只需判斷光線是不偏折、偏向或偏離即可。'
            },
            {
                node: 'N14',
                name: '視深公式',
                formula: '\\dfrac{h\'}{h} = \\dfrac{n\'}{n} \\quad(\\text{觀察者幾乎在正上方})',
                anchor: '在空氣中看水裡的魚會覺得變淺；在水中看岸上的鳥會覺得變高。',
                desc: '$h$ 為實深、$h'+"'"+'$ 為視深，$n$ 為物體所在介質、$n'+"'"+'$ 為觀察者所在介質的折射率。<br>• 空氣看水中物（$n=4/3 \\to n'+"'"+'=1$）：$h'+"'"+' = \\frac{3}{4}h$，<b>變淺</b>。<br>• 水中看空氣中物（$n=1 \\to n'+"'"+'=4/3$）：$h'+"'"+' = \\frac{4}{3}h$，<b>變高</b>。<br><b>連帶效應</b>：垂直方向的長度與速度都會依同一比例縮放，水平方向則不變 $\\Rightarrow$ 插在水杯中的鉛筆看起來被折斷。'
            },
            {
                node: 'N14',
                name: '光的色散',
                formula: 'f \\uparrow \\Rightarrow n \\uparrow \\Rightarrow \\text{偏折愈大}\\quad(\\text{紫光偏折最多、紅光最少})',
                anchor: '色散的成因是同一介質對不同波長的光折射率不同，而不是頻率改變。',
                desc: '白光通過三稜鏡經兩次折射後分成紅橙黃綠藍靛紫，稱為<b>色散</b>；這些顏色稱為光譜色。<br><b>虹</b>：陽光在水滴內經<b>兩次折射、一次反射</b>，紅光在外、紫光在內。<br><b>霓</b>：經<b>兩次折射、兩次反射</b>，顏色順序相反且亮度較弱（多一次反射損失能量）。<br><b>關鍵陷阱</b>：光進入稜鏡時波速與波長改變，但<b>頻率不變</b>——顏色由頻率決定，所以顏色不會變。'
            },
            {
                node: 'N15',
                name: '臨界角與全反射條件',
                formula: '\\sin\\theta_c = \\dfrac{n_2}{n_1}\\;(n_1 > n_2) \\quad,\\quad \\text{全反射條件}: n_1\\sin\\theta \\ge n_2',
                anchor: '兩個條件缺一不可：必須由光密進入光疏，且入射角不小於臨界角。',
                probe: {
                    q: '光由空氣（n=1）射入水（n=4/3），入射角很大時會發生全反射嗎？',
                    opts: [
                        { t: '(A) 會，只要角度夠大' },
                        { t: '(B) 不會，方向錯了', c: 1 },
                        { t: '(C) 要看光的顏色' }
                    ]
                },
                desc: '由 $n_1\\sin\\theta_c = n_2\\sin 90^\\circ$ 得 $\\sin\\theta_c = n_2/n_1$。<br><b>好用的判別式</b>：直接檢查 $n_1\\sin\\theta \\ge n_2$ 是否成立，不必先算出臨界角。<br><b>多層平行介質</b>：因 $n_A\\sin\\theta_A = n_C\\sin\\theta_C$，中間層不影響；要在某界面全反射，必須<b>折射前每一層的折射率都大於折射層</b>。<br>折射率愈大 $\\Rightarrow$ 臨界角愈小 $\\Rightarrow$ 愈容易全反射（鑽石 $n=2.4$，$\\theta_c \\approx 24.6^\\circ$）。'
            },
            {
                node: 'N15',
                name: '全反射的應用',
                formula: '\\text{光纖、稜鏡望遠鏡、安全反射鏡、鑽石的火光}',
                anchor: '全反射不損失能量，這是光纖能長距離傳訊的物理基礎。',
                desc: '<b>光纖</b>：纖芯折射率大於包層，光在纖芯內反覆全反射前進，能量幾乎不逸散 $\\Rightarrow$ 通訊與醫療內視鏡。<br><b>雙筒望遠鏡</b>：以兩個稜鏡的全反射摺疊光路，縮短鏡身。<br><b>腳踏車安全反射鏡</b>：經兩次全反射後沿原方向返回。<br><b>鑽石</b>：$n$ 高使臨界角極小，切割出多面後光在內部多次全反射並色散，因而閃耀。'
            },
            {
                node: 'N16',
                name: '薄透鏡成像公式與符號法則',
                formula: '\\dfrac{1}{p} + \\dfrac{1}{q} = \\dfrac{1}{f} \\quad,\\quad m = \\dfrac{h_i}{h_o} = -\\dfrac{q}{p}',
                anchor: '符號法則就是全部：凸透鏡 f 取正、凹透鏡 f 取負；實像 q 取正、虛像 q 取負。',
                desc: '<b>符號法則</b>：<br>• 焦距 $f$：凸透鏡（會聚）取<b>正</b>，凹透鏡（發散）取<b>負</b>。<br>• 物距 $p$：高中只討論鏡前實物，一律取<b>正</b>。<br>• 像距 $q$：實像取<b>正</b>（鏡後），虛像取<b>負</b>（鏡前）。<br><b>放大率</b>：$|m|>1$ 放大、$|m|<1$ 縮小；$m>0$ 正立、$m<0$ 倒立。<br><b>共軛成像</b>：固定物與屏的距離移動透鏡，$p$ 與 $q$ 互換時可得到兩個大小不同的清晰像。'
            },
            {
                node: 'N16',
                name: '凸透鏡的成像作圖與六種情形',
                formula: '\\text{三條主要光線：平行光} \\to F \\;;\\; \\text{過} F \\to \\text{平行光} \\;;\\; \\text{過鏡心} \\to \\text{不偏折}',
                anchor: '物體從遠處靠近焦點，像愈跑愈遠、愈變愈大；一旦進入焦點內就翻成正立放大虛像。',
                desc: '<table class="edu-table"><thead><tr><th>物體位置</th><th>像的位置</th><th>像的性質</th></tr></thead><tbody><tr><td>$\\infty$</td><td>鏡後焦點</td><td>一點實像</td></tr><tr><td>$p > 2f$</td><td>鏡後 $f \\sim 2f$</td><td>倒立縮小實像</td></tr><tr><td>$p = 2f$</td><td>鏡後 $2f$</td><td>倒立等大實像</td></tr><tr><td>$f < p < 2f$</td><td>鏡後 $2f$ 外</td><td>倒立放大實像</td></tr><tr><td>$p = f$</td><td>—</td><td>折射光平行，無法成像</td></tr><tr><td>$p < f$</td><td>鏡前（同側）</td><td>正立放大虛像</td></tr></tbody></table><b>凹透鏡</b>：不論物體放在哪裡，永遠在鏡前虛焦點內成<b>正立縮小虛像</b>。'
            },
            {
                node: 'N17',
                name: '光學顯微鏡與相機',
                formula: '\\text{顯微鏡：物鏡成倒立放大實像} \\to \\text{落在目鏡焦點內} \\to \\text{再成放大虛像}',
                anchor: '相機的「對焦」不是改變焦距，而是移動透鏡組去改變物距與像距。',
                desc: '<b>顯微鏡</b>：物鏡焦距極短、目鏡焦距較長。物體置於物鏡焦點外極靠近焦點處，先成倒立放大實像並落在目鏡焦點內，再由目鏡成放大虛像 $\\Rightarrow$ 最後看到的是與原物上下顛倒、左右相反的放大虛像。<br><b>相機</b>：鏡頭等效為凸透鏡，感光元件上必須是<b>實像</b>，且面積有限 $\\Rightarrow$ 物體須在 $2f$ 外才能成縮小的倒立實像。對焦在無窮遠時，$q = f$。<br><b>手機相機模組</b>：多為固定焦距、固定光圈，真實焦距僅約 4～10 mm，靠多顆不同焦距的模組達成「等效 24 mm／85 mm」等視角。'
            },
            {
                node: 'N17',
                name: '視力矯正',
                formula: '\\text{近視} \\to \\text{凹透鏡}\\;;\\quad \\text{遠視} \\to \\text{凸透鏡}',
                anchor: '成像落在視網膜「前」用發散透鏡拉回來，落在「後」用會聚透鏡推上去。',
                desc: '<b>近視</b>：眼球太長或水晶體焦距太短，遠物成像於視網膜<b>之前</b> $\\Rightarrow$ 配戴<b>凹透鏡</b>增加發散性。<br><b>遠視</b>：眼球太短或水晶體焦距太長，成像於視網膜<b>之後</b> $\\Rightarrow$ 配戴<b>凸透鏡</b>增加會聚性。'
            }
        ],
        conceptMap: `
            <div class="concept-map-container">
                <div class="map-node">
                    <div class="map-node-title">1. 光速改變 → 折射（§3-1）</div>
                    <div class="map-node-desc">$n = c/v$，$n_1\\sin\\theta_1 = n_2\\sin\\theta_2$。這就是第一章水波折射定律，只是把波速比寫成折射率的倒數比。</div>
                </div>
                <div class="map-connector">↓ 折射造成的視覺效果</div>
                <div class="map-node">
                    <div class="map-node-title">2. 視深與色散（§3-1）</div>
                    <div class="map-node-desc">視深 $h'+"'"+'/h = n'+"'"+'/n$ 讓水中的魚變淺；不同頻率的光 $n$ 不同，於是白光被稜鏡分開成光譜。</div>
                </div>
                <div class="map-connector">↓ 折射角被推到 90°</div>
                <div class="map-node">
                    <div class="map-node-title">3. 全反射（§3-2）</div>
                    <div class="map-node-desc">$\\sin\\theta_c = n_2/n_1$。必須由光密進入光疏且入射角 $\\ge \\theta_c$。光纖、稜鏡望遠鏡與鑽石的閃耀都靠它。</div>
                </div>
                <div class="map-connector">↓ 用兩個折射面控制光線</div>
                <div class="map-node">
                    <div class="map-node-title">4. 薄透鏡成像（§3-3）</div>
                    <div class="map-node-desc">$\\frac{1}{p}+\\frac{1}{q}=\\frac{1}{f}$、$m=-q/p$。三條主要光線作圖與公式互相驗證，符號法則是解題核心。</div>
                </div>
                <div class="map-connector">↓ 把透鏡組合起來</div>
                <div class="map-node">
                    <div class="map-node-title">5. 光學儀器與眼睛（§3-3）</div>
                    <div class="map-node-desc">顯微鏡、相機、手機鏡頭模組與近視／遠視矯正，都是同一組公式在不同物距下的應用。</div>
                </div>
            </div>
        `,
        keyFeatures: [
            {
                node: 'N13',
                feature: '題目給多層平行介質的光路圖，要求排列折射率或光速的大小。',
                bridge: '寫下 $n_1\\sin\\theta_1 = n_2\\sin\\theta_2 = n_3\\sin\\theta_3$：角度愈大的介質折射率愈小、光速愈快、波長愈長，頻率則全部相同。',
                trap: '⚡ 避坑指南：只要界面互相平行，中間夾幾層都不影響最終折射角；千萬別逐層重算而算錯方向。'
            },
            {
                node: 'N14',
                feature: '題目問水中的魚看起來變淺多少、岸上的鳥在魚眼中變高多少。',
                bridge: '套 $h'+"'"+'/h = n'+"'"+'/n$，先確認「物在哪個介質、眼睛在哪個介質」。空氣看水中 $\\times \\frac{3}{4}$；水中看空氣 $\\times \\frac{4}{3}$。',
                trap: '⚡ 避坑指南：視深只影響<b>垂直方向</b>的長度與速度，水平方向不變——鉛筆看起來被折斷正是這個原因。'
            },
            {
                node: 'N15',
                feature: '題目問光在某界面會不會發生全反射，或求臨界角。',
                bridge: '先確認方向是「光密 → 光疏」，再直接檢驗 $n_1\\sin\\theta \\ge n_2$。多層介質時，折射前每一層的 $n$ 都必須大於折射層的 $n$。',
                trap: '⚡ 避坑指南：司乃耳定律只在<b>有折射光</b>時適用；一旦全反射就沒有折射角可以代入了。'
            },
            {
                node: 'N16',
                feature: '題目給物距與焦距求像距、像長，或反過來由成像性質推透鏡種類。',
                bridge: '一律先列符號法則再代 $\\frac{1}{p}+\\frac{1}{q}=\\frac{1}{f}$。算出 $q<0$ 就是鏡前虛像，$m>0$ 就是正立。',
                trap: '⚡ 避坑指南：凹透鏡的 $f$ 要代<b>負值</b>。忘記負號會得到「凹透鏡成實像」這種不可能的結論。'
            },
            {
                node: 'N16',
                feature: '題目說「把透鏡遮住一半」或「換成較大的透鏡」。',
                bridge: '遮住一半只減少進光量 $\\Rightarrow$ 像變暗但<b>位置、大小、完整性都不變</b>，因為焦距沒有改變。',
                trap: '⚡ 避坑指南：不會只看到「一半的像」。這是段考與大考都很愛的觀念題。'
            },
            {
                node: 'N17',
                feature: '手機或相機題：給像距的可調範圍，問焦距或可對焦的最近物距。',
                bridge: '對焦到無窮遠時 $q = f$，所以像距範圍的<b>最小值就是焦距</b>；再把像距的最大值代入成像公式即得最近可對焦物距。',
                trap: '⚡ 避坑指南：對焦是移動透鏡改變 $p$ 與 $q$，不是改變焦距 $f$；固定焦距模組的 $f$ 從頭到尾是常數。'
            }
        ],
        extensions: `
            <div class="edu-table-container">
                <table class="edu-table">
                    <thead>
                        <tr>
                            <th style="width: 24%">延伸主題</th>
                            <th style="width: 38%">與本章的連結</th>
                            <th>解題提示</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><strong>水波折射 → 光的折射</strong></td>
                            <td>$\\frac{\\sin\\theta_1}{\\sin\\theta_2} = \\frac{v_1}{v_2} = \\frac{\\lambda_1}{\\lambda_2}$ 與第一章完全相同，只是多定義了 $n = c/v$。</td>
                            <td>深水區 $\\leftrightarrow$ 光疏介質、淺水區 $\\leftrightarrow$ 光密介質，偏向或偏離法線的判準一模一樣。</td>
                        </tr>
                        <tr>
                            <td><strong>氣象：虹與霓</strong></td>
                            <td>虹＝兩次折射一次反射（紅在外）；霓＝兩次折射兩次反射（紅在內、較暗）。兩者都是色散加上全反射邊界效應。</td>
                            <td>被問到顏色順序時，先數反射次數：每多一次反射，內外順序就顛倒一次、亮度也下降。</td>
                        </tr>
                        <tr>
                            <td><strong>通訊：光纖與內視鏡</strong></td>
                            <td>纖芯 $n$ 大於包層 $n$，滿足全反射條件後光能長距離低損耗傳輸。</td>
                            <td>光纖題常問「為什麼能量不損失」——因為是<b>全</b>反射，沒有折射光帶走能量。</td>
                        </tr>
                        <tr>
                            <td><strong>生物：顯微鏡的極限</strong></td>
                            <td>光學顯微鏡受可見光波長（約 $10^{-7}$ m）的繞射限制，看不到病毒；這一點要用第四章的繞射觀念補完。</td>
                            <td>幾何光學只能告訴你像在哪裡、多大；能不能「解析」得出來，要看第四章。</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        `,
        examQuestions: [
            { node: ['N13'], year: '109 指考（答對率 62%）', title: '兩塊三角玻璃夾一層介質的折射光線', desc: '<strong>解題特徵引導：</strong>因兩斜面平行，入射線與出射線必平行，答案只可能落在同一組平行線中。再分三種情況：$n_1 = n_2$ 不偏折、$n_1 < n_2$ 與 $n_1 > n_2$ 各偏一邊，故答案為中間那一組（4、5、6）。' },
            { node: ['N13'], year: '段考經典', title: '平行板不改變最終折射角', desc: '<strong>解題特徵引導：</strong>先寫 $1\\cdot\\sin 53^\\circ = n\\sin\\beta$、$n\\sin\\beta = \\frac{4}{3}\\sin\\alpha'+"'"+'$，兩式相乘消去 $n$ 與 $\\beta$，得到與沒有平行板時完全相同的結果。這是「中間介質不影響」最直接的證明。' },
            { node: ['N14'], year: '學測', title: '三稜鏡色散中哪個量改變了', desc: '<strong>解題特徵引導：</strong>各色光進入稜鏡後波速與波長都改變（紫光變化最大），但<b>頻率不變</b>。選項中說「頻率發生改變」的即為錯誤敘述。' },
            { node: ['N14'], year: '段考經典', title: '虹與霓的成因比較（多選）', desc: '<strong>解題特徵引導：</strong>虹與霓都是陽光經水滴色散所致；霓多一次反射故較暗、顏色順序相反。判斷時只需回到「折射次數與反射次數」的組合。' },
            { node: ['N15'], year: '95、100 指考', title: '臨界角是否算全反射', desc: '<strong>解題特徵引導：</strong>入射角恰等於臨界角時，折射光沿界面行進、能量不逸散到光疏介質。歷屆指考採<b>等號成立即發生全反射</b>的立場，故數學條件寫成 $\\theta \\ge \\theta_c$。作答時依此標準即可。' },
            { node: ['N15'], year: '段考經典', title: '半圓形玻璃磚的全反射判斷', desc: '<strong>解題特徵引導：</strong>光由圓心射向弧面時入射角為 $0^\\circ$ 不折射，只需判斷平面那一側的入射角是否超過臨界角。先由幾何關係求出 $\\sin\\theta$，再與 $\\sin\\theta_c = n_2/n_1$ 比較。' },
            { node: ['N16'], year: '段考經典', title: '凸透鏡與凹透鏡同條件下的成像對照', desc: '<strong>解題特徵引導：</strong>同一個物體（$p = 30$ cm、$h_o = 10$ cm）分別放在 $f = +20$ 與 $f = -20$ 的透鏡前：凸透鏡得 $q = 60$、$m = -2$（倒立放大實像）；凹透鏡得 $q = -12$、$m = +2/5$（正立縮小虛像）。一題同時檢驗符號法則的兩個方向。' },
            { node: ['N16'], year: '段考進階', title: '兩點光源成像於同一位置（共軛）', desc: '<strong>解題特徵引導：</strong>兩個像重合代表一個是焦點內的正立虛像、一個是焦點外的倒立實像，故透鏡必為凸透鏡。列出兩條成像方程後相加，會得到一個二次方程 $p^2 - 24p + 108 = 0$，解出 $p = 6$ 或 18 cm，再依圖上相對位置取捨。' },
            { node: ['N17'], year: '109 指考（得分率 43%）', title: '智慧型手機的照相裝置（多選）', desc: '<strong>解題特徵引導：</strong>像距在 4.0～4.5 mm 間變動且能對焦到無窮遠 $\\Rightarrow$ $f \\approx 4.0$ mm（像距的最小值）。再由 $\\frac{1}{p} + \\frac{1}{4.5} = \\frac{1}{4}$ 得最近可對焦物距 $p = 36$ mm。得分率僅四成，關鍵在於認出「像距最小值＝焦距」。' },
            { node: ['N17'], year: '學測', title: '顯微鏡物鏡焦距為何要遠短於目鏡', desc: '<strong>解題特徵引導：</strong>目的是讓物鏡先產生<b>放大的實像</b>並落在目鏡的焦距內，再由目鏡二次放大成虛像。四個選項只在「實像／虛像」與「放大／縮小」上作變化，逐一比對即可。' }
        ]
    },

    4: {
        title: '模組四：物理光學',
        badge: '選修物理 Ch4',
        subtitle: '干涉與繞射是光的波動性最直接的證據；雙狹縫與單狹縫的公式長得很像，差別全在「中央亮紋」。',
        formulas: [
            {
                node: 'N18',
                name: '微粒說與波動說',
                formula: '\\text{牛頓（1666）微粒說} \\;\\;vs.\\;\\; \\text{惠更斯（1678）波動說}',
                anchor: '兩派都能解釋直進、反射與折射；只有干涉與繞射能分出勝負。',
                probe: {
                    q: '下列哪一個現象「無法」用牛頓的微粒說解釋？',
                    opts: [
                        { t: '(A) 針孔成像上下顛倒' },
                        { t: '(B) 肥皂泡的絢麗色彩', c: 1 },
                        { t: '(C) 物體背光處的影子' }
                    ]
                },
                desc: '<b>微粒說（牛頓）</b>：光由具彈性的微小粒子組成、直線前進。可解釋直進、反射、折射，但<b>預測光在介質中比在真空中快</b>——後來證實錯誤，且無法解釋干涉與繞射。<br><b>波動說（惠更斯）</b>：光如水波、聲波般是波動。同樣可解釋直進、反射、折射，當時的缺點只是還沒觀測到干涉與繞射（1801 年由楊氏補上）。<br><b>切勿混淆</b>：近代物理的「光子」是電磁場的量子、具波粒二象性，與牛頓力學中的彈性小球完全不同。'
            },
            {
                node: 'N18',
                name: '光本質的科學史序列',
                formula: '\\text{牛頓} \\to \\text{惠更斯} \\to \\text{楊氏(1801)} \\to \\text{馬克士威(理論)} \\to \\text{赫茲(實驗)} \\to \\text{愛因斯坦(光子)}',
                anchor: '馬克士威「建立」電磁波理論，赫茲「證實」電磁波存在——兩人角色不可對調。',
                desc: '• <b>楊氏</b>：雙狹縫干涉實驗，首次成功觀測光的干涉，確立波動說。<br>• <b>馬克士威</b>：以方程組預測電磁波存在並算出其速度等於光速。<br>• <b>赫茲</b>：以實驗產生並偵測電磁波，證實馬克士威的理論。<br>• <b>愛因斯坦</b>：提出光子理論解釋光電效應，開啟波粒二象性。'
            },
            {
                node: 'N19',
                name: '同調光與同相光',
                formula: '\\text{同調：頻率相同且相位差固定} \\;\\;\\supset\\;\\; \\text{同相：同時產生波峰}',
                anchor: '同調不要求振幅相同，也不要求同相；只要求相位差是定值。',
                desc: '頻率相同、產生波峰或波谷的時間差為定值的光稱為<b>同調光</b>，才能產生穩定的干涉條紋。<br>同相是同調的特例（相位差為 0）；高中課程只討論<b>同相且同振幅</b>的情形。<br><b>楊氏的巧思</b>：先讓平行光通過單狹縫 $S_0$ 成為新線光源，再讓 $S_1$、$S_2$ 落在來自 $S_0$ 的同一波前上 $\\Rightarrow$ 保證同相。現代實驗直接用雷射（本身即同相同調光）照射雙狹縫。'
            },
            {
                node: 'N19',
                name: '雙狹縫干涉的亮暗紋位置',
                formula: '\\Delta \\ell = d\\sin\\theta \\approx \\dfrac{dy}{L} \\quad\\Rightarrow\\quad y_n = n\\dfrac{L\\lambda}{d},\\quad y_m = \\left(m - \\dfrac{1}{2}\\right)\\dfrac{L\\lambda}{d}',
                anchor: '亮紋 = 波程差為整數倍波長；暗紋 = 半波長的奇數倍。與第一章水波的腹線、節線同一條判準。',
                desc: '實驗中 $d < 1$ mm、$L \\approx 1$ m，故 $L \\gg d$，$\\theta \\to 0$，可用 $\\sin\\theta \\approx \\tan\\theta = y/L$ 的小角近似。<br>• 亮紋：$y_n = n\\frac{L\\lambda}{d}$，$n = 0$ 為中央亮紋（只有 1 條），$n \\ge 1$ 上下各 1 條。<br>• 暗紋：$y_m = (m-\\frac{1}{2})\\frac{L\\lambda}{d}$，$m = 1,2,3,\\dots$。'
            },
            {
                node: 'N19',
                name: '干涉條紋的間距',
                formula: '\\Delta y = \\dfrac{L\\lambda}{d} \\quad(\\text{所有亮紋寬度與間距皆相等})',
                anchor: '雙狹縫的每一條亮紋一樣寬、一樣亮——這正是它與單狹縫繞射最大的差別。',
                desc: '$\\Delta y \\propto \\lambda$、$\\Delta y \\propto L$、$\\Delta y \\propto 1/d$。<br>• 縫距 $d$ 愈小 $\\Rightarrow$ 條紋愈寬。<br>• 波長愈短（藍光）$\\Rightarrow$ 條紋愈窄。<br>• <b>白光光源</b>：中央仍為白色（各色光的 $n=0$ 亮紋重合），兩側則為彩色條紋。<br>• <b>浸在折射率 $n$ 的液體中</b>：$\\lambda_{\\text{液}} = \\lambda/n$ $\\Rightarrow$ 間距變為原來的 $1/n$ 倍。'
            },
            {
                node: 'N20',
                name: '單狹縫繞射的暗紋位置',
                formula: 'a\\sin\\theta = m\\lambda \\quad\\Rightarrow\\quad y_m = m\\dfrac{L\\lambda}{a}\\quad(m = 1,2,3,\\dots)',
                anchor: '注意這是「暗紋」公式：最大光程差為整數倍波長時，狹縫兩半的子波恰好成對抵消。',
                probe: {
                    q: '單狹縫繞射中，$a\\sin\\theta = \\lambda$ 的位置是？',
                    opts: [
                        { t: '(A) 第一亮紋' },
                        { t: '(B) 第一暗紋', c: 1 },
                        { t: '(C) 中央亮紋邊緣的最亮處' }
                    ]
                },
                desc: '<b>推導邏輯</b>：由惠更斯原理，狹縫上的波前是無數個同相點光源。把狹縫等分成上下兩區，若上下對應點的光程差恰為 $\\lambda/2$，則兩兩成對完全抵消 $\\Rightarrow$ 暗紋。<br>此時<b>上下緣</b>（最大光程差）$\\Delta\\ell_{AB} = a\\sin\\theta = \\lambda$，即第一暗紋。等分成四區則得 $\\Delta\\ell_{AB} = 2\\lambda$ 的第二暗紋，依此類推。'
            },
            {
                node: 'N20',
                name: '中央亮紋的寬度',
                formula: '\\Delta y_{\\text{中央}} = \\dfrac{2L\\lambda}{a} = 2\\,\\Delta y_{\\text{其他}}',
                anchor: '中央亮紋寬度是其他亮紋的兩倍，亮度也由中央向兩側迅速遞減。',
                desc: '其他亮紋位置約在 $y_n = (n + \\frac{1}{2})\\frac{L\\lambda}{a}$，寬度與相鄰暗紋間距皆為 $\\frac{L\\lambda}{a}$。<br>$\\Delta y \\propto \\lambda$、$\\propto 1/a$：<b>縫寬愈窄，中央亮紋愈寬</b>（繞射愈明顯），這與第一章「$d/\\lambda$ 愈接近 1 繞射愈明顯」是同一件事。<br>浸在折射率 $n$ 的液體中，所有寬度都變為 $1/n$ 倍。'
            },
            {
                node: 'N20',
                name: '干涉與繞射的關係',
                formula: '\\text{少數波源} \\to \\text{稱干涉}\\;;\\quad \\text{大量波源} \\to \\text{稱繞射}',
                anchor: '費曼：兩者在物理上沒有本質差別，只是名詞如何使用的問題。',
                desc: '繞射本身就是「許多子波源互相干涉」的結果。<br><b>生活中的例子</b>：孔雀、蜂鳥羽毛的結構色，光碟片的彩色紋路（表面細微結構產生大量子光源），肥皂薄膜的彩色圖案（薄膜上下表面反射光的干涉）。<br><b>實驗與理論的落差</b>：理論假設縫寬極小、各亮紋等亮；實際雷射實驗中縫寬約 0.1～0.3 mm，繞射效應使中央條紋特別亮，稱為<b>雙狹縫繞射</b>。'
            }
        ],
        conceptMap: `
            <div class="concept-map-container">
                <div class="map-node">
                    <div class="map-node-title">1. 光到底是什麼（§4-1）</div>
                    <div class="map-node-desc">微粒說與波動說都能解釋直進、反射、折射；只有干涉與繞射能決定勝負。楊氏 1801 年的實驗是關鍵一戰。</div>
                </div>
                <div class="map-connector">↓ 需要穩定的干涉條紋</div>
                <div class="map-node">
                    <div class="map-node-title">2. 同調光（§4-2）</div>
                    <div class="map-node-desc">頻率相同、相位差固定。楊氏用單狹縫 $S_0$ 製造同相波前，現代直接用雷射。</div>
                </div>
                <div class="map-connector">↓ 兩個點波源的波程差</div>
                <div class="map-node">
                    <div class="map-node-title">3. 雙狹縫干涉（§4-2）</div>
                    <div class="map-node-desc">$\\Delta\\ell = dy/L$；亮紋 $n\\lambda$、暗紋 $(m-\\frac{1}{2})\\lambda$，間距 $\\Delta y = L\\lambda/d$，各亮紋等寬等亮。</div>
                </div>
                <div class="map-connector">↓ 把狹縫加寬成無數個子波源</div>
                <div class="map-node">
                    <div class="map-node-title">4. 單狹縫繞射（§4-3）</div>
                    <div class="map-node-desc">暗紋 $y_m = mL\\lambda/a$，中央亮紋寬度 $2L\\lambda/a$ 為其他亮紋的兩倍，亮度向兩側遞減。</div>
                </div>
                <div class="map-connector">↓ 回到日常生活</div>
                <div class="map-node">
                    <div class="map-node-title">5. 處處可見的干涉與繞射</div>
                    <div class="map-node-desc">光碟片的彩色紋路、孔雀羽毛的結構色、肥皂膜的彩色圖案。費曼：干涉與繞射只是波源數量多寡的用詞差異。</div>
                </div>
            </div>
        `,
        keyFeatures: [
            {
                node: 'N18',
                feature: '題目列出一串光學現象，問哪些「無法」用微粒說解釋。',
                bridge: '把現象分兩堆：直進類（針孔成像、影子）與反射折射類 $\\to$ 兩說皆可；干涉、繞射、以及「光在介質中變慢」$\\to$ 只有波動說可以。',
                trap: '⚡ 避坑指南：微粒說預測光在介質中<b>更快</b>，與事實相反，所以「水中光速較慢」也是微粒說解釋不了的項目。'
            },
            {
                node: 'N19',
                feature: '題目給 $\\lambda$、$d$、$L$ 求某條亮紋或暗紋的位置、或求條紋間距。',
                bridge: '先統一單位（nm、$\\mu$m 換成 m），再套 $\\Delta y = L\\lambda/d$；要第 $n$ 條亮紋就乘 $n$，第 $m$ 條暗紋就乘 $(m-\\frac{1}{2})$。',
                trap: '⚡ 避坑指南：中央亮紋只有<b>一條</b>，第一、第二…亮紋則是上下各一條共兩條。數「總共幾條亮紋」時務必留意。'
            },
            {
                node: 'N19',
                feature: '題目把整套裝置浸入折射率為 $n$ 的液體中。',
                bridge: '只有一個量改變：$\\lambda_{\\text{液}} = \\lambda/n$。於是所有條紋間距、中央亮紋寬度全部乘 $1/n$，頻率與顏色不變。',
                trap: '⚡ 避坑指南：不要去改 $L$ 或 $d$，它們是幾何長度不受介質影響。'
            },
            {
                node: 'N20',
                feature: '題目同時給雙狹縫與單狹縫，或要求比較兩種圖案。',
                bridge: '列出對照表：雙狹縫 $y_n = nL\\lambda/d$ 是<b>亮紋</b>公式；單狹縫 $y_m = mL\\lambda/a$ 是<b>暗紋</b>公式。中央亮紋寬度雙狹縫為 $L\\lambda/d$、單狹縫為 $2L\\lambda/a$。',
                trap: '⚡ 避坑指南：兩條公式外型幾乎一樣，把單狹縫的暗紋公式誤當亮紋公式是本節最大的失分來源。'
            },
            {
                node: 'N20',
                feature: '題目用白光做干涉或繞射實驗，問條紋顏色。',
                bridge: '各色光在 $n=0$（或中央）處全部重合 $\\Rightarrow$ 正中央為<b>白色</b>；兩側因 $\\Delta y \\propto \\lambda$ 而分開 $\\Rightarrow$ <b>彩色</b>條紋，紫在內、紅在外。',
                trap: '⚡ 避坑指南：中央是白色不是彩色；很多人反射性地寫「彩虹狀」而漏掉中央白紋。'
            }
        ],
        extensions: `
            <div class="edu-table-container">
                <table class="edu-table">
                    <thead>
                        <tr>
                            <th style="width: 24%">延伸主題</th>
                            <th style="width: 38%">與本章的連結</th>
                            <th>解題提示</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><strong>水波干涉 → 雙狹縫</strong></td>
                            <td>第一章的腹線（$n\\lambda$）與節線（$(m-\\frac{1}{2})\\lambda$）就是這裡的亮紋與暗紋，只是加上 $L \\gg d$ 的小角近似。</td>
                            <td>忘記公式時，回去畫水波的波程差圖，一樣可以推出來。</td>
                        </tr>
                        <tr>
                            <td><strong>惠更斯原理 → 單狹縫</strong></td>
                            <td>把縫上的波前視為無數同相點光源，才有「等分成兩區成對抵消」的暗紋論證。</td>
                            <td>被問「為什麼會有繞射條紋」時，標準答案就是惠更斯原理加上疊加原理。</td>
                        </tr>
                        <tr>
                            <td><strong>近似的代價</strong></td>
                            <td>雙狹縫解題有兩條路：嚴格用 $\\sin\\theta = \\lambda/d$ 求 $\\tan\\theta$，或用 $\\sin\\theta \\approx \\tan\\theta$ 的小角近似。</td>
                            <td>當 $\\sin\\theta$ 達 0.25 時，兩法差異約 3.5%。混合題若問「哪個較正確」，答案是<b>不使用近似</b>的那個。</td>
                        </tr>
                        <tr>
                            <td><strong>生活中的結構色</strong></td>
                            <td>光碟片、孔雀羽毛、肥皂膜的色彩，都是大量子波源干涉（即繞射）或薄膜上下表面反射光干涉的結果。</td>
                            <td>共同特徵：<b>觀察角度一改變，顏色就跟著變</b>，因為干涉條件隨角度改變。</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        `,
        examQuestions: [
            { node: ['N18'], year: '103 學測（得分率 55%）', title: '哪些現象無法用微粒說解釋（應選 2 項）', desc: '<strong>解題特徵引導：</strong>針孔成像與影子屬光的直進、凸面鏡屬反射，微粒說都能解釋。無法解釋的是<b>肥皂泡的絢麗色彩</b>（干涉）與<b>光進入玻璃速率變慢</b>（微粒說預測會變快）。得分率僅五成五，多數人漏掉後者。' },
            { node: ['N18'], year: '段考經典', title: '光學史人物與貢獻配對（多選）', desc: '<strong>解題特徵引導：</strong>牛頓－微粒說、惠更斯－波動說、愛因斯坦－光子理論皆正確；<b>馬克士威建立</b>電磁波理論、<b>赫茲證實</b>電磁波存在，把兩人對調的選項即為錯誤。' },
            { node: ['N19'], year: '段考經典', title: '雙狹縫條紋間距的比例推理', desc: '<strong>解題特徵引導：</strong>只需盯住 $\\Delta y = L\\lambda/d$ 三個變數的正反比：$d$ 減半則條紋變寬一倍；換成波長較短的藍光則變窄；浸入折射率 $n$ 的液體則變為 $1/n$ 倍。' },
            { node: ['N19'], year: '混合題型', title: '嚴格解與小角近似的差異', desc: '<strong>解題特徵引導：</strong>$\\lambda = 550$ nm、$d = 2.20\\ \\mu$m、$L = 0.5$ m。方法一由 $\\sin\\theta = \\lambda/d = 1/4$ 求 $\\tan\\theta = 1/\\sqrt{15}$ 得 $y \\approx 12.9$ cm；方法二用近似得 $\\Delta y = L\\lambda/d = 12.5$ cm。<b>方法一較正確</b>，因為它沒有使用 $\\sin\\theta \\approx \\tan\\theta$ 的近似。這類「比較兩種算法」的混合題近年很常見。' },
            { node: ['N20'], year: '段考經典', title: '單狹縫中央亮紋寬度的變化', desc: '<strong>解題特徵引導：</strong>$\\Delta y_{\\text{中央}} = 2L\\lambda/a$。縫寬 $a$ 變窄 $\\Rightarrow$ 中央亮紋變寬（繞射更明顯）；換藍光 $\\Rightarrow$ 變窄。務必記得中央亮紋是其他亮紋的<b>兩倍寬</b>。' },
            { node: ['N19', 'N20'], year: '段考經典', title: '雙狹縫與單狹縫圖案的辨識', desc: '<strong>解題特徵引導：</strong>看兩個特徵即可分辨：條紋是否<b>等寬</b>、亮度是否<b>等亮</b>。雙狹縫兩者皆是；單狹縫的中央亮紋兩倍寬且亮度向兩側迅速遞減。' }
        ]
    }
};
