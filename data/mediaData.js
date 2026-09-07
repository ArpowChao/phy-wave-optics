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

    twoSlits: {
        title: '雙狹縫與單狹縫：長得一樣，結論相反',
        nodes: ['N19', 'N20'],
        video: 'assets/video/two_slits.mp4',
        poster: 'assets/images/anim/two_slits.jpg',
        seconds: 56,
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
