/*
 * mediaData.js
 * Manim 動畫講解的資料層：影片、章節時間戳、靜態力圖與重點結論。
 * 影片原檔為 1080p30，此處收錄的是 720p 網頁版（無音軌，全片以字幕講解）。
 * 來源專案：3b1b（Manim Community 0.21，純 Python 生成，無外部素材）。
 */

const animData = {
    ropeReflection: {
        title: '繩波的反射：固定端與自由端',
        nodes: ['N03'],
        video: 'assets/video/rope_reflection.mp4',
        poster: 'assets/images/anim/rope_reflection.jpg',
        seconds: 166,
        lead: '全片沒有公式，只用繩形和力圖回答一個問題：為什麼固定端反射會上下顛倒，自由端不會。',
        chapters: [
            { t: 0, label: '同一個脈衝，兩種繩端' },
            { t: 24, label: '張力沿繩拉：力的方向 ≠ 位移方向' },
            { t: 34, label: '固定接點的受力圖' },
            { t: 48, label: '固定端：入射 + 反射 = 實際繩形' },
            { t: 79, label: '「靜止的端點怎麼會往上動？」' },
            { t: 99, label: '保留環的質量：向上合力使它加速' },
            { t: 119, label: '輕環 → 更輕的環 → 無質量端點' },
            { t: 141, label: '理想自由端：末端傾斜互相抵消' },
            { t: 162, label: '兩種反射並排重播' }
        ],
        figures: [
            { src: 'assets/images/anim/rope_reflection_fixed_forces.png', cap: '固定端：繩的張力把接點往左上拉，支架提供帶向下分量的力，兩者作用在同一點而平衡，接點因此不動。注意這兩個箭頭是平衡力，不是作用力與反作用力。' },
            { src: 'assets/images/anim/rope_reflection_free_forces.png', cap: '理想自由端：光滑直桿只能水平推輕環，上下都沒有分量。無質量的環不承受未平衡的力，所以末端必須保持水平。' },
            { src: 'assets/images/anim/rope_reflection_comparison.png', cap: '兩種邊界的結論：固定端守住「位置」，回波上下顛倒；自由端守住「末端水平」，回波不顛倒。' }
        ],
        points: [
            '固定端的限制是<b>位置不動</b>，所以入射與反射的上下位移必須互相抵消 → 波峰反射成波谷。',
            '自由端的限制是<b>末端水平</b>，所以入射與反射的末端傾斜互相抵消 → 波峰反射仍是波峰。',
            '「自由端沒有上下支持力」不等於「有質量的環沒有上下合力」。環還有質量時，張力的向上分量正是它開始加速的原因；質量與所需合力一起趨近零，才得到末端水平的理想模型。',
            '圖解中的兩列虛線不是兩條真實的繩。真正的繩形只有最下面那條實線。'
        ]
    },

    boundary: {
        title: '穿越界面：什麼變，什麼不變？',
        nodes: ['N03', 'N08', 'N13', 'N02'],
        video: 'assets/video/boundary.mp4',
        poster: 'assets/images/anim/boundary.jpg',
        seconds: 55,
        misconception: '以為波換了介質，頻率就跟著變；或把光的「進密介質變慢」直接套到聲音上。',
        lead: '本站四章的第二條主軸，一支影片講完：頻率為什麼永遠不變，而波長為什麼一定得跟著波速走。',
        chapters: [
            { t: 0, label: '波過去之後，哪些量變了？' },
            { t: 12, label: '同一列波，從細繩進入粗繩' },
            { t: 18, label: '在交界處架閘門，數波峰' },
            { t: 28, label: '兩邊每秒通過的波峰數相同 ⇒ f 不變' },
            { t: 33, label: 'f 不能變，波速卻變了 ⇒ 波長讓步' },
            { t: 42, label: '繩波、聲波、光：同一條規則' },
            { t: 48, label: '聲與光的快慢方向相反' }
        ],
        points: [
            '<b>為什麼 f 不變</b>：交界點是兩邊共用的一個點。左邊每秒送 f 個波峰進來，波峰不會在交界處堆積、也不會憑空消失，所以右邊每秒也必須送出 f 個。這是本片的核心論證，不是背來的。',
            '<b>為什麼 λ 一定要變</b>：由 v = fλ，f 被鎖住而 v 換了，只剩 λ 能動 ⇒ λ = v / f，波速減半波長就減半。',
            '<b>聲與光方向相反</b>：聲波空氣→水是<b>變快、變長</b>；光空氣→玻璃是<b>變慢、變短</b>。別把光的直覺套到聲音上——這是本節失分最多的地方。',
            '影片為聚焦在 f、v、λ，略去了交界處必然存在的反射波，振幅也未按實際比例。'
        ]
    },

    mediumStays: {
        title: '波在動，介質不動',
        nodes: ['N01', 'N02'],
        video: 'assets/video/medium_stays.mp4',
        poster: 'assets/images/anim/medium_stays.jpg',
        seconds: 65,
        misconception: '以為波會把介質帶著走；以及把「質點速度」和「波速」當成同一件事。',
        lead: '盯著一顆塗紅的質點看完整個過程，順便把最容易混淆的兩個「速度」分開。',
        chapters: [
            { t: 0, label: '波往前跑，水會被推過去嗎？' },
            { t: 11, label: '一排質點，紅色那顆是要盯的' },
            { t: 21, label: '波形走了兩個波長，紅點回到原位' },
            { t: 32, label: '這裡有兩個速度，不要混在一起' },
            { t: 41, label: '紅點在波峰的那一刻，速度是零' },
            { t: 50, label: '通過平衡位置時，質點跑得最快' },
            { t: 55, label: '考題：下一刻往上還往下？鬼影法' }
        ],
        points: [
            '<b>介質不隨波前進</b>：紅點只在一條鉛直線上上下移動，波形走了兩個波長之後，它仍在原來的位置。波傳遞的是能量與相位，不是介質本身。',
            '<b>波速</b>是「波形平移」的速度，由介質決定，全程固定，也與振幅無關。',
            '<b>質點速度</b> $v_y$ 每一刻都不同：在波峰與波谷恰好是<b>零</b>（正在轉向），通過平衡位置時<b>最大</b>。看到波峰跑得快就以為那顆質點也在快速移動，是最常見的誤解。',
            '<b>判斷質點下一刻往哪動</b>：把整條波形沿傳播方向平移一點點得到「鬼影」，鬼影比原波形高就是往上、低就是往下。'
        ]
    },

    rippleTankReal: {
        title: '真實水波槽的干涉圖樣：節線特寫',
        nodes: ['N07'],
        youtubeId: 'wUZ6jtH6IEQ',
        youtubeUrl: 'https://www.youtube.com/watch?v=wUZ6jtH6IEQ',
        isVertical: false,
        seconds: 0,
        credit: 'YouTube 頻道 koko spice — "interference pattern - water waves"',
        misconception: '以為節線只是「比較暗的地方」或「振幅比較小的地方」。實際上節線上的水面是<b>完全不動</b>的，那是兩列波恰好抵消的結果。',
        lead: '模擬畫得再像，學生仍會懷疑「真的有那麼剛好嗎」。這是真實水波槽拍下來的干涉圖樣，可以直接對照三維模式裡那條平坦的水道。',
        chapters: [
            { t: 10, label: '節線特寫：水面完全不動' }
        ],
        points: [
            '<b>約 10 秒處的節線特寫</b>：鏡頭停在一條節線上，該處水面自始至終沒有起伏——不是振幅小，是<b>完全不振動</b>。兩側的腹線則清楚地上下翻動。',
            '這正是模擬器「三維水面起伏」模式想讓你看見的：節線是一條<b>平坦不動的水道</b>，浮標高度恆為 0；旁邊的腹線是連續起伏的山脊與深谷。',
            '對照判準：節線滿足 $\\Delta \\ell = \\left(m - \\frac{1}{2}\\right)\\lambda$，兩列波抵達時恰好反相，合成位移<b>恆為零</b>——與時間無關，所以永遠靜止。',
            '腹線滿足 $\\Delta \\ell = n\\lambda$，兩列波永遠同相，該處以 <b>2A</b> 的振幅上下振動，在水波槽的白紙上呈現亮暗交替向外移動的紋路。'
        ]
    },

    interference: {
        title: '干涉：為什麼是雙曲線，又為什麼變成亮紋',
        nodes: ['N07', 'N19'],
        video: 'assets/video/interference.mp4',
        poster: 'assets/images/anim/interference.jpg',
        seconds: 61,
        misconception: '「腹線是雙曲線」和「水波腹線就是光的亮紋」兩句話都背得出來，卻沒有一句看得見——結果遇到變化題就接不上。',
        lead: '把課本直接給結論的兩句話推導出來，順便解決「腹線總共有幾條」這個常考卻少人講清楚的問題。',
        chapters: [
            { t: 0, label: '課本兩句話，哪一句看得見？' },
            { t: 13, label: '先找波程差 = 0 的點' },
            { t: 22, label: '讓 Δℓ = 1λ 的軌跡自己長出來' },
            { t: 32, label: '這就是雙曲線的定義' },
            { t: 38, label: '腹線總共有幾條？n ≤ d / λ' },
            { t: 45, label: 'nλ = d 時退化成兩條射線' },
            { t: 50, label: '放一面屏幕：交點就是亮紋' }
        ],
        points: [
            '<b>為什麼是雙曲線</b>：到兩個定點的距離差為定值的所有點，這就是雙曲線的<b>定義本身</b>。腹線的條件 $|r_1 - r_2| = n\\lambda$ 恰好是「距離差為定值」，所以它不是碰巧長得像雙曲線，它就是雙曲線，$S_1$、$S_2$ 就是兩個焦點。',
            '<b>腹線有幾條</b>：三角不等式給出 $|r_1 - r_2| \\le d$，所以 $n\\lambda \\le d$，即 $n \\le d/\\lambda$。影片中 $d = 2.5\\lambda$，$n$ 只能取 0、1、2 ⇒ 腹線共 5 條。',
            '<b>退化</b>：$n\\lambda$ 剛好等於 $d$ 時雙曲線退化成兩波源連線<b>外側的兩條射線</b>——此時 P 只能落在連線的延長線上，距離差才可能剛好等於 $d$。',
            '<b>亮紋是怎麼來的</b>：屏幕只是一條直線，它把整個平面上的雙曲線族「切」出一排交點，那排交點就是亮紋。水波看的是整個平面，光看的是屏幕那一條線——同一組雙曲線。',
            '<b>等間距的條件</b>：影片裡 $d$ 只有 $2.5\\lambda$，交點明顯不等距。真實雙狹縫的 $d$ 是波長的上千倍，$\\theta$ 小到 $\\sin\\theta \\approx \\tan\\theta$，才得到 $\\Delta y = L\\lambda/d$。'
        ]
    },

    twoSlits: {
        title: '雙狹縫與單狹縫：長得一樣，結論相反',
        nodes: ['N19', 'N20'],
        video: 'assets/video/two_slits.mp4',
        poster: 'assets/images/anim/two_slits.jpg',
        seconds: 55,
        misconception: 'd sinθ = nλ 與 a sinθ = mλ 外型幾乎相同，卻一個算亮紋、一個算暗紋，考場上經常記反。',
        lead: '差別不在公式，在「縫後面有幾個波源」。看懂這一點就不必再背哪個是亮、哪個是暗。',
        chapters: [
            { t: 0, label: '兩條式子長得一樣，為什麼結論相反？' },
            { t: 11, label: '同樣是波程差等於整數個波長' },
            { t: 17, label: '雙狹縫：只有兩個點波源 ⇒ 同相相加 ⇒ 亮' },
            { t: 28, label: '單狹縫：縫上連續無限多個波源' },
            { t: 33, label: '上下對切，兩兩配對，每對差 λ/2' },
            { t: 42, label: '全部抵消 ⇒ 暗紋' },
            { t: 46, label: '對照表與一眼分辨的特徵' }
        ],
        points: [
            '<b>雙狹縫</b>只有兩個點波源。波程差 $d\sin\theta = n\lambda$ 時兩波同相抵達、相加 ⇒ <b>亮紋</b>（$n = 0, 1, 2, \dots$）。',
            '<b>單狹縫</b>是連續無限多個波源。當上緣到下緣的波程差 $a\sin\theta = \lambda$ 時，把縫上下對切，上半每一點都能在下半找到波程差恰為 $\lambda/2$ 的搭檔 ⇒ 兩兩抵消 ⇒ <b>暗紋</b>（$m = 1, 2, 3, \dots$，沒有 $m=0$）。',
            '所以 $a\sin\theta = \lambda$ <b>不是</b>「大家同相」，而是「剛好可以配對抵消」——這才是它算暗紋的原因。',
            '<b>考場上一眼分辨</b>：單狹縫的中央亮紋寬度是其他亮紋的兩倍。'
        ]
    },

    standingWave: {
        title: '駐波的形成',
        nodes: ['N04', 'N10', 'N12'],
        video: 'assets/video/standing_wave.mp4',
        poster: 'assets/images/anim/standing_wave.jpg',
        seconds: 71,
        lead: '把兩列反向行進的波分開畫，再一格一格相加，看節點與腹點怎麼「長」出來。',
        points: [
            '節點：兩列波在該處<b>永遠反相</b>，相加恆為零，所以完全不動。',
            '腹點：兩列波在該處<b>永遠同相</b>，相加後振幅加倍。',
            '節點不動不是因為那裡沒有波，而是因為兩列波都在、剛好抵消。',
            '相鄰兩節點相距 λ/2，節點到最近腹點相距 λ/4。'
        ]
    },

    diffraction: {
        title: '單狹縫繞射：把子波實際加起來',
        nodes: ['N20', 'N05'],
        video: 'assets/video/diffraction.mp4',
        poster: 'assets/images/anim/diffraction.jpg',
        seconds: 98,
        lead: '不背公式，直接把縫上每一點的惠更斯子波疊加出來，看繞射圖樣自己浮現。',
        figures: [
            { src: 'assets/images/anim/diffraction_huygens_chart.png', cap: '三種尺度的對照：λ ≫ a 時縫等效成單一點波源、強烈繞射；λ ~ a 時出現典型的中央極大加側條紋；λ ≪ a 時波幾乎直線前進，形成銳利的幾何陰影。（此圖以 d 代表狹縫寬度，即本站其他各處的 a。）' }
        ],
        points: [
            '繞射明顯與否只看一個比值：<b>λ / a</b>。縫寬遠大於波長時就退化成直線傳播，這正是幾何光學的適用條件。',
            '第一暗紋的條件 a sinθ = λ，來自「把縫等分成上下兩半，每一點都能在另一半找到相位差 λ/2 的搭檔而成對抵消」。',
            '中央亮紋的寬度是其他亮紋的兩倍——這是單狹縫繞射與雙狹縫干涉最容易分辨的特徵。'
        ]
    },

    doppler: {
        title: '都卜勒效應',
        nodes: ['N21'],
        video: 'assets/video/doppler.mp4',
        poster: 'assets/images/anim/doppler.jpg',
        seconds: 68,
        lead: '波源移動時，波前不再同心。前方被擠密、後方被拉疏，接收到的頻率因此改變。',
        points: [
            '波源移動<b>不改變波速</b>（波速仍由介質決定），改變的是波前之間的間隔，也就是波長。',
            '波源接近觀察者：前方波長變短 → 頻率變高（音調變尖）。',
            '波源遠離觀察者：後方波長變長 → 頻率變低（音調變低）。',
            '救護車經過身邊的瞬間，音調由高轉低——轉折點正是它與你距離最近、徑向速度為零的時刻。'
        ]
    },

    photoelectric: {
        title: '光電效應：波動說解釋不了的實驗',
        nodes: ['N18'],
        video: 'assets/video/photoelectric.mp4',
        poster: 'assets/images/anim/photoelectric.jpg',
        seconds: 71,
        lead: '看完前面整章的干涉與繞射之後，這支影片給出光的另一面：一個波動說完全無法解釋的實驗。',
        points: [
            '把光調亮一倍：光子數變多，電子也變多，<b>飽和電流加倍</b>——但每顆電子的最大動能完全不變。',
            '波動說預期「光越亮，電子動能越大」，實驗結果不是這樣。',
            '決定電子最大動能的是<b>光的頻率</b>，不是強度；低於底限頻率時無論多亮都打不出電子。',
            '干涉繞射證明光是波，光電效應證明光是粒子。兩者都對，這就是光的二象性。'
        ]
    },

    shm: {
        title: '簡諧運動與能量',
        nodes: ['N01', 'N02'],
        video: 'assets/video/vertical_shm.mp4',
        poster: 'assets/images/anim/vertical_shm.jpg',
        seconds: 45,
        lead: '波上的每一個質點做的就是簡諧運動。先看清楚單一質點怎麼動，整條繩的波形才有意義。',
        extraVideos: [
            { src: 'assets/video/shm_energy_full.mp4', title: '簡諧運動的能量交換（105 秒）', poster: 'assets/images/anim/shm_energy_full.jpg' },
            { src: 'assets/video/energy_position_aligned.mp4', title: '能量與位置的對應關係（33 秒）', poster: 'assets/images/anim/energy_position_aligned.jpg' }
        ],
        figures: [
            { src: 'assets/images/anim/energy_position_chart.png', cap: '位能與動能隨位置的變化：兩者互補，總和恆定。位移最大處速率為零、位能最大；通過平衡點時速率最大、動能最大。' }
        ],
        points: [
            '質點只在原處上下振動，<b>不隨波前進</b>。波傳遞的是能量與相位，不是介質。',
            '質點在最大位移處速率為零、在平衡點速率最大——這正是駐波「波形拉成直線那一瞬間質點最快」的原因。',
            '振動的週期 T 由波源決定；波形在空間中重複的距離 λ 則等於 v·T。'
        ]
    },

    earthquakeResonance: {
        title: '地震與大樓共振實驗：為什麼同場地震不同高度大樓晃動程度不同？',
        nodes: ['N12'],
        youtubeId: 'WwC0fEPp8w4',
        youtubeUrl: 'https://youtube.com/shorts/WwC0fEPp8w4',
        isVertical: true,
        seconds: 58,
        misconception: '以為地震時所有建築物晃動程度都一樣，或以為越高的大樓一定晃得越厲害。',
        lead: '透過震動台上的三棟不同高度模型大樓，直接展示外界震動頻率與大樓固有頻率相符時引發的強烈共振現象，並介紹大樓調諧質量阻尼器（TMD）的防震原理。',
        points: [
            '<b>固有頻率與建築高度</b>：大樓越高，剛度相對較柔、自振週期越長（固有頻率越低）；矮樓自振週期短（固有頻率較高）。',
            '<b>共振發生條件</b>：當地震波的擾動頻率恰好等於某棟大樓的固有頻率時（$f_{\\text{地震}} = f_{\\text{固有}}$），該棟大樓振幅劇烈放大；其他頻率不符的樓房則幾乎保持靜止。',
            '<b>低頻震波 vs 高頻震波</b>：遠處大地震傳來的低頻慢波容易引發高樓共振；近處淺層地震的高頻震動則容易重創低矮透天房屋。',
            '<b>調諧質量阻尼器（TMD）</b>：如台北 101 的巨型阻尼球，設計其擺動頻率接近大樓固有頻率，在大樓搖晃時以反相位慣性擺動消耗動能，大幅降低大樓受震時的危險振幅。'
        ]
    },

    glassResonance: {
        title: '聲音共振震碎玻璃杯：杯緣駐波與固有頻率實驗',
        nodes: ['N12', 'N04'],
        youtubeId: 'RYChFBrRuvg',
        youtubeUrl: 'https://youtube.com/shorts/RYChFBrRuvg',
        isVertical: true,
        seconds: 42,
        misconception: '以為只要聲音「夠大聲」就能震碎玻璃杯，忽略了「聲波頻率必須與杯子固有頻率精確吻合」才是引發共振破壞的核心。',
        lead: '將高分貝揚聲器對準酒杯，當聲音頻率調至與玻璃杯固有頻率（自然頻率）完全相同時，杯壁產生強烈共振。在高速攝影下可清晰觀察到杯緣形成顯著的閉合圓周駐波（波節與波腹劇烈晃動），最終因形變應力超越玻璃極限而瞬間碎裂！',
        points: [
            '<b>固有頻率的決定因素</b>：玻璃杯的材質密度、彈性係數、杯口直徑與杯壁厚度決定了它的固有自振頻率；手指沾水摩擦杯緣或輕彈杯壁聽到的清脆音高，就是該杯子的基頻。',
            '<b>杯緣的閉合圓周駐波</b>：聲波與杯體共振時，杯口並非整體均勻縮放，而是形成圓周駐波——四個波節與四個波腹交互在相互垂直的軸向上拉伸成橢圓形。',
            '<b>共振能量累積條件</b>：外加頻率不吻合時，外力做功有正有負，振幅始終微小；只有當外加擾動頻率 $f_{\\text{聲音}} = f_{\\text{固有}}$ 時，每週期輸入的能量皆與震動方向同相位相長疊加，振幅急劇攀升直至材料斷裂。'
        ]
    },

    tacomaBridge: {
        title: '塔可馬海峽吊橋崩塌：風致共振、空氣動力顫振與扭轉駐波',
        nodes: ['N12', 'N04'],
        youtubeId: 'yoIAPy9QcxI',
        youtubeUrl: 'https://youtu.be/yoIAPy9QcxI',
        isVertical: false,
        seconds: 150,
        misconception: '以為吊橋只是單純被強風「直接吹斷」，忽略了側向強風激發卡門渦街與氣動彈性顫振，產生週期性外力引發強烈共振與劇烈扭轉駐波。',
        lead: '1940 年美國塔可馬海峽吊橋（Tacoma Narrows Bridge）在僅約時速 68 公里的風速下發生劇烈扭動並最終崩塌，是物理與工程史上最著名的共振與駐波實例。畫面中可清晰看到橋面兩端為固定波節，中央形成強烈反向扭動的扭轉駐波（波腹上下劇烈翻轉）！',
        points: [
            '<b>扭轉駐波模態（Torsional Standing Wave）</b>：吊橋兩端主塔與錨碇端為位移固定波節（Node），強風擾動下橋面中心線形成節線，兩側車道交替上下翻滾，形成極為清晰的二維扭轉駐波波腹（Antinode），扭曲角度高達 45 度。',
            '<b>共振與氣動彈性顫振（Aeroelastic Flutter）</b>：橫風掠過橋面鋼梁邊緣產生週期性交替脫落的卡門渦街（Kármán vortex street）。當渦流脫落頻率接近吊橋扭轉固有頻率時，結構從氣流中持續吸取能量，形成正回饋自激發顫振，振幅急劇發散。',
            '<b>工程啟示與現代流線設計</b>：塔可馬吊橋原設計採用實心鋼板梁，極易阻擋氣流形成大尺度旋渦；現代大跨度懸索橋（如明石海峽大橋、青馬大橋）皆改用開放式鋼桁架或扁平流線型鋼箱梁，徹底破除渦流激振並大幅提高扭轉固有頻率。'
        ]
    }
};

/* 節點 → 動畫的反查表 */
const animByNode = (() => {
    const map = {};
    Object.keys(animData).forEach((key) => {
        (animData[key].nodes || []).forEach((n) => {
            (map[n] = map[n] || []).push(key);
        });
    });
    return map;
})();
