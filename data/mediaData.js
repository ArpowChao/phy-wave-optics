/*
 * mediaData.js
 * Manim 動畫講解的資料層：影片、章節時間戳、靜態力圖與重點結論。
 * 影片原檔為 1080p30，此處收錄的是 720p 網頁版（無音軌，全片以字幕講解）。
 * 本機動畫以 Manim 生成；外部影片另列 youtubeUrl。
 */

const animData = {
    ropeReflection: {
        title: '繩波的反射：固定端與自由端',
        nodes: ['N03'],
        video: 'assets/video/rope_reflection.mp4',
        poster: 'assets/images/anim/rope_reflection.jpg',
        seconds: 166,
        lead: '看同一個脈衝遇到兩種繩端：固定端反射顛倒，自由端反射不顛倒。',
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
        lead: '波通過靜止界面時，頻率不變；再用 v = fλ 判斷波長如何改變。',
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
            '<b>頻率 f 不變</b>：靜止界面受入射波以相同節奏驅動，透射波也維持這個頻率。',
            '<b>波長跟著波速變</b>：由 λ = v / f，波速減半，波長也減半；即使垂直入射，這個規則仍成立。',
            '<b>先看是哪一種波</b>：聲波從空氣進入水時變快、變長；光從空氣進入玻璃時變慢、變短。聲速不能只由介質密度判斷。',
            '影片聚焦在 f、v、λ，略去一般界面上的反射波，振幅也未按實際比例。'
        ]
    },

    mediumStays: {
        title: '波形前進，質點振動',
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
            '<b>質點在原位附近振動</b>：在這個小振幅繩波模型裡，紅點上下振動，並不跟著波形一路前進。',
            '<b>波速</b>是波形前進的速度。均勻繩的張力與線密度不變時，小振幅波的波速固定。',
            '<b>質點的振動速率</b>：在波峰、波谷為零；通過平衡位置時最大。它與波形的傳播速率是不同的量。',
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
        misconception: '把某一瞬間較暗的地方當成節線，忽略了節線的位置持續固定。',
        lead: '觀察節線的位置是否固定，再對照模擬中的節線與腹線。',
        chapters: [
            { t: 10, label: '節線特寫：起伏很小、位置固定' }
        ],
        points: [
            '<b>先追蹤同一位置</b>：節線附近起伏很小，位置持續固定；旁邊的腹線則有明顯起伏。',
            '<b>理想節線</b>：同相波源、抵達時等振幅，且 $\\Delta \\ell = (m - \\frac{1}{2})\\lambda$ 時，兩波反相相消，合成位移恆為零。真實實驗受衰減與反射影響，可能仍有微小起伏。',
            '<b>理想腹線</b>：$\\Delta \\ell = n\\lambda$ 時兩波同相；若各波在該處振幅皆為 A，合成振幅為 2A，而不是一直停在波峰。'
        ]
    },

    interference: {
        title: '干涉：為什麼是雙曲線，又為什麼變成亮紋',
        nodes: ['N07', 'N19'],
        video: 'assets/video/interference.mp4',
        poster: 'assets/images/anim/interference.jpg',
        seconds: 61,
        misconception: '「腹線是雙曲線」和「水波腹線就是光的亮紋」兩句話都背得出來，卻沒有一句看得見——結果遇到變化題就接不上。',
        lead: '先找波程差固定的點，再看這些線與屏幕相交後如何形成亮紋。',
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
            '<b>為什麼是雙曲線</b>：$0 < |r_1-r_2| < d$ 且距離差固定的軌跡是雙曲線，兩波源是焦點。波程差為零時則是中垂線。',
            '<b>腹線有幾條</b>：三角不等式給出 $|r_1 - r_2| \\le d$，所以 $n\\lambda \\le d$，即 $n \\le d/\\lambda$。影片中 $d = 2.5\\lambda$，$n$ 只能取 0、1、2 ⇒ 腹線共 5 條。',
            '<b>退化</b>：$n\\lambda$ 剛好等於 $d$ 時雙曲線退化成兩波源連線<b>外側的兩條射線</b>——此時 P 只能落在連線的延長線上，距離差才可能剛好等於 $d$。',
            '<b>亮紋是怎麼來的</b>：屏幕只是一條直線，它把整個平面上的雙曲線族「切」出一排交點，那排交點就是亮紋。水波看的是整個平面，光看的是屏幕那一條線——同一組雙曲線。',
            '<b>等間距的條件</b>：屏幕要遠，並只看中央附近的小角度條紋，才能用 $\\sin\\theta \\approx \\tan\\theta$ 得到 $\\Delta y = L\\lambda/d$；狹縫間距大並不保證所有位置都是小角度。'
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
            '<b>雙狹縫</b>先視為兩個同相點波源。$d\\sin\\theta = n\\lambda$ 時兩波同相相加，形成亮紋（$n = 0, 1, 2, \\dots$）。',
            '<b>單狹縫第一暗紋</b>：$a\\sin\\theta = \\lambda$ 時把縫等分成兩半，上下對應的子波相差 $\\lambda/2$，成對抵消。',
            '<b>推廣到第 m 暗紋</b>：$a\\sin\\theta = m\\lambda$ 時等分成 2m 段、相鄰兩段配對；$m=1,2,3,\\dots$，中央的 $m=0$ 是亮紋。',
            '<b>看圖分辨</b>：遠屏幕、小角近似下，單狹縫的中央亮紋約為旁側亮紋的兩倍寬。'
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
            { src: 'assets/images/anim/diffraction_huygens_chart.png', cap: '尺度示意：λ 與縫寬 a 相近或更大時，波明顯向側方展開；a > λ 時可出現暗紋與旁側亮紋；a 遠大於 λ 時繞射角很小。（此圖的 d 是縫寬，即本站的 a。）' }
        ],
        points: [
            '繞射展開角度主要看 <b>λ / a</b>：波長較長、縫較窄，波散得較開。a 遠大於 λ 時角度很小，常可近似直線傳播。',
            '第一暗紋的條件 a sinθ = λ，來自「把縫等分成上下兩半，每一點都能在另一半找到相位差 λ/2 的搭檔而成對抵消」。',
            '遠屏幕、小角近似下，中央亮紋寬約為旁側亮紋的兩倍，且中央最亮。'
        ]
    },

    doppler: {
        title: '延伸：都卜勒效應',
        nodes: ['N21'],
        video: 'assets/video/doppler.mp4',
        poster: 'assets/images/anim/doppler.jpg',
        seconds: 68,
        lead: '波源移動時，波前不再同心。前方被擠密、後方被拉疏，接收到的頻率因此改變。',
        points: [
            '波源移動<b>不改變波速</b>（波速仍由介質決定），改變的是波前之間的間隔，也就是波長。',
            '波源接近觀察者：前方波長變短 → 頻率變高（音調變尖）。',
            '波源遠離觀察者：後方波長變長 → 頻率變低（音調變低）。',
            '波源沿直線從旁邊通過時，音調由較高逐漸變為較低。一般有側向距離時，接近與遠離由徑向運動判斷；聲音也需要時間才能傳到觀察者。'
        ]
    },

    photoelectric: {
        title: '延伸：光電效應與光子',
        nodes: ['N18'],
        video: 'assets/video/photoelectric.mp4',
        poster: 'assets/images/anim/photoelectric.jpg',
        seconds: 71,
        lead: '選修物理 III 先掌握光的干涉與繞射；這支影片延伸到之後量子現象課程中的光子模型。',
        points: [
            '保持頻率高於底限頻率，光強度加倍時，單位時間入射光子數加倍，理想模型的飽和電流也加倍；電子最大動能不變。',
            '單光子光電效應中，電子最大動能由光的頻率決定；低於底限頻率時不能逸出電子。',
            '干涉與繞射支持光的波動性；光電效應支持光與物質交換能量時以光子為單位。現代光子模型與牛頓的古典微粒說不同。'
        ]
    },

    shm: {
        title: '簡諧運動與能量',
        nodes: ['N01', 'N02'],
        video: 'assets/video/vertical_shm.mp4',
        poster: 'assets/images/anim/vertical_shm.jpg',
        seconds: 45,
        lead: '正弦繩波上的質點做簡諧運動。先看單一質點的位移與速率，再看整條繩的波形。',
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
        title: '模型大樓：頻率接近時振幅變大',
        nodes: ['N12'],
        youtubeId: 'WwC0fEPp8w4',
        youtubeUrl: 'https://youtube.com/shorts/WwC0fEPp8w4',
        isVertical: true,
        seconds: 58,
        misconception: '以為地震時所有建築物晃動程度都一樣，或以為越高的大樓一定晃得越厲害。',
        lead: '觀察震動台改變頻率時，哪一棟模型的振幅最大，再連回自然頻率與共振。',
        points: [
            '<b>自然頻率</b>：模型的質量與剛度不同，自然頻率也不同；相似結構中，較高的模型通常頻率較低。',
            '<b>共振</b>：外加震動頻率接近某模型的自然頻率時，它的振幅較大。其他模型仍可能振動，並非一定靜止。',
            '<b>模型的限制</b>：真實地震包含多種頻率，建築反應還與結構、阻尼和地盤有關，不能只看樓高判斷受損程度。'
        ]
    },

    glassResonance: {
        title: '玻璃杯：聲音頻率與共振',
        nodes: ['N12', 'N04'],
        youtubeId: 'RYChFBrRuvg',
        youtubeUrl: 'https://youtube.com/shorts/RYChFBrRuvg',
        isVertical: true,
        seconds: 42,
        misconception: '只看聲音夠不夠大，忽略聲波頻率與杯子自然頻率的關係。',
        lead: '當聲波頻率接近杯子的自然頻率，杯壁振幅會增加。注意頻率、振幅與破裂條件是三件不同的事。',
        points: [
            '<b>自然頻率</b>由杯子的材質、形狀與厚度決定；輕彈杯壁的音高，可作為主要振動頻率的線索。',
            '<b>振動模態</b>：杯緣不同位置的振幅不一樣，可用節點與腹點描述；節點的意思是振幅很小，不能說它劇烈晃動。',
            '<b>是否破裂</b>：頻率接近可增強振動，但仍需足夠的輸入能量。外力強弱、阻尼、作用時間與材料強度都會影響結果。'
        ]
    },

    tacomaBridge: {
        title: '延伸：塔可馬吊橋的氣動彈性顫振',
        nodes: ['N12', 'N04'],
        youtubeId: 'yoIAPy9QcxI',
        youtubeUrl: 'https://youtu.be/yoIAPy9QcxI',
        isVertical: false,
        seconds: 150,
        misconception: '把橋梁崩塌完全歸因於「風吹的頻率等於橋的自然頻率」，套用簡單受迫共振模型。',
        lead: '1940 年吊橋崩塌的重要機制是橋面運動與氣流互相影響，造成自激扭轉顫振。這是工程延伸，先學會音叉與空氣柱的共振即可。',
        points: [
            '<b>觀察扭轉</b>：橋面兩側交替升降，顯示結構的扭轉振動；不可直接把整座吊橋當作兩端固定的理想繩。',
            '<b>顫振機制</b>：橋面運動改變氣流與氣動力，氣動力又加強橋面運動，使振幅持續增大。這種自激振動不能只用外力頻率等於自然頻率解釋。',
            '<b>資料來源</b>：<a href="https://www.wsdot.wa.gov/TNBhistory/bridges-failure.htm" target="_blank" rel="noopener">華盛頓州交通局：吊橋失敗的工程教訓</a>。現代設計以結構、氣動外形及風洞測試共同降低失穩風險。'
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
