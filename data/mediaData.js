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
