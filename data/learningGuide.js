/*
 * 初學導讀：每節只先抓一個目標、一個觀察與一個例題。
 * 核心範圍依自然科學領域課綱 PKa-Ⅴa-1～13；N21 為自選延伸。
 * prerequisite 是節點 ID；check.answer 是從 0 起算的正確選項索引。
 */
const learningGuide = {
    N01: {
        level: '核心',
        goal: '分清楚「波往前傳」與「質點在振動」，並算出繩波波速。',
        prerequisites: [],
        observe: '盯著一顆紅色質點：波峰走到右方時，它也跟著往右走嗎？',
        takeaway: '小振幅繩波中，質點上下振動；波速由張力與線密度決定。',
        example: {
            title: '先求每公尺繩子的質量',
            given: '均勻繩長 $L=2.0\\,\\mathrm{m}$、質量 $m=0.020\\,\\mathrm{kg}$、張力 $F=4.0\\,\\mathrm{N}$。',
            steps: ['$\\mu=m/L=0.010\\,\\mathrm{kg/m}$。', '$v=\\sqrt{F/\\mu}=\\sqrt{4.0/0.010}$。'],
            result: '波速 $v=20\\,\\mathrm{m/s}$；這是波形傳播的速率。'
        },
        check: {
            q: '張力與線密度都不變，把波源頻率加倍，波速如何？',
            opts: ['加倍', '不變', '減半'], answer: 1,
            explanation: '$v=\\sqrt{F/\\mu}$ 不含頻率；由 $v=f\\lambda$，改變的是波長。'
        }
    },
    N02: {
        level: '核心',
        goal: '從位置圖讀波長、從時間圖讀週期，再用 $v=f\\lambda$ 連起來。',
        prerequisites: ['N01'],
        observe: '把波源頻率調高：同一條繩上的波峰間距怎麼變？',
        takeaway: '先看橫軸。距離的重複間隔是 $\\lambda$；時間的重複間隔是 $T$。',
        example: {
            title: '兩張圖，各讀一個量',
            given: '位置圖上相鄰波峰相距 $0.80\\,\\mathrm{m}$；同一質點的時間圖上相鄰波峰相隔 $0.20\\,\\mathrm{s}$。',
            steps: ['$\\lambda=0.80\\,\\mathrm{m}$，$T=0.20\\,\\mathrm{s}$，$f=1/T=5.0\\,\\mathrm{Hz}$。', '$v=f\\lambda=5.0\\times0.80$。'],
            result: '波速 $v=4.0\\,\\mathrm{m/s}$。'
        },
        check: {
            q: '時間圖的橫軸單位是秒，兩個相鄰波峰的間隔代表什麼？',
            opts: ['波長', '週期', '振幅'], answer: 1,
            explanation: '同一質點經過一段時間回到相同振動狀態，這段時間就是週期。'
        }
    },
    N03: {
        level: '核心',
        goal: '判斷反射脈衝是否倒轉，並追蹤透射波的頻率、波速與波長。',
        prerequisites: ['N01', 'N02'],
        observe: '將端點切換成固定端與自由端，向上的脈衝回來時各是什麼方向？',
        takeaway: '固定端反射倒轉，自由端反射不倒轉；靜止界面上的透射波頻率不變。',
        example: {
            title: '換繩子，頻率保留下來',
            given: '頻率 $f=5.0\\,\\mathrm{Hz}$ 的波，從波速 $20\\,\\mathrm{m/s}$ 的繩傳入波速 $10\\,\\mathrm{m/s}$ 的繩。',
            steps: ['兩側頻率皆為 $5.0\\,\\mathrm{Hz}$。', '$\\lambda_1=20/5.0=4.0\\,\\mathrm{m}$；$\\lambda_2=10/5.0=2.0\\,\\mathrm{m}$。'],
            result: '透射波變慢、波長減半；頻率沒有減半。'
        },
        check: {
            q: '理想固定端反射時，端點的實際位移是多少？',
            opts: ['入射振幅的兩倍', '零', '隨入射波上下移動'], answer: 1,
            explanation: '固定端必須保持不動，所以入射波與反射波在端點的位移互相抵消。'
        }
    },
    N04: {
        level: '核心',
        goal: '逐點相加兩列波，並由波節、波腹辨認駐波。',
        prerequisites: ['N02', 'N03'],
        observe: '駐波拉直的一瞬間，波腹附近的質點是停止，還是通過平衡位置？',
        takeaway: '波節始終不動，波腹振幅最大；相鄰波節的距離是 $\\lambda/2$。',
        example: {
            title: '數波腹，求波長',
            given: '長 $L=0.60\\,\\mathrm{m}$ 的兩端固定弦形成 3 個波腹，弦上波速 $v=120\\,\\mathrm{m/s}$。',
            steps: ['$L=3\\lambda/2$，所以 $\\lambda=2L/3=0.40\\,\\mathrm{m}$。', '$f=v/\\lambda=120/0.40$。'],
            result: '振動頻率 $f=300\\,\\mathrm{Hz}$；這是第三諧音。'
        },
        check: {
            q: '兩脈衝在某點的位移分別為 $+3\\,\\mathrm{cm}$ 與 $-2\\,\\mathrm{cm}$，合成位移為何？',
            opts: ['$+5\\,\\mathrm{cm}$', '$+1\\,\\mathrm{cm}$', '$-1\\,\\mathrm{cm}$'], answer: 1,
            explanation: '疊加的是帶正負號的位移：$3+(-2)=1$。'
        }
    },
    N05: {
        level: '核心',
        goal: '用波前與子波作圖，理解下一刻的波形如何傳出去。',
        prerequisites: ['N02'],
        observe: '同一條直線波前上的子波，經過相同時間後半徑相同嗎？',
        takeaway: '波前連接同相位的點；均勻各向同性介質中，傳播方向垂直於波前。',
        example: {
            title: '下一個波前在哪裡？',
            given: '直線水波在均勻水區以 $v=0.20\\,\\mathrm{m/s}$ 前進，經過 $\\Delta t=0.50\\,\\mathrm{s}$。',
            steps: ['波前各點發出的子波半徑 $r=v\\Delta t=0.20\\times0.50$。'],
            result: '新的前進波前在原波前前方 $0.10\\,\\mathrm{m}$，仍與原波前平行。'
        },
        check: {
            q: '同一波前上的點，必定相同的是哪一項？',
            opts: ['振幅', '相位', '到波源的直線距離'], answer: 1,
            explanation: '波前的定義是同相位的點所形成的線或面；一般情況不保證各點振幅相同。'
        }
    },
    N06: {
        level: '核心',
        goal: '由波長與法線判斷水波進入深、淺水區的偏折。',
        prerequisites: ['N02', 'N05'],
        observe: '水波由深區進入淺區後，波峰間距與射線對法線的夾角如何改變？',
        takeaway: '一般水波槽中，進入淺水區變慢、波長變短；斜入射時偏向法線。',
        example: {
            title: '用波長比求折射角',
            given: '頻率相同，深水區 $\\lambda_1=4.0\\,\\mathrm{cm}$、淺水區 $\\lambda_2=2.0\\,\\mathrm{cm}$；入射角 $\\theta_1=30^\\circ$。',
            steps: ['$\\sin\\theta_1/\\sin\\theta_2=\\lambda_1/\\lambda_2=2$。', '$\\sin\\theta_2=\\sin30^\\circ/2=0.25$。'],
            result: '$\\theta_2\\approx14.5^\\circ$，角度變小，偏向法線。'
        },
        check: {
            q: '水波垂直入射深、淺水界面，哪個敘述正確？',
            opts: ['波速改變，但方向不偏折', '頻率改變', '波速與波長都不變'], answer: 0,
            explanation: '入射角為零時折射角也為零；波速與波長仍可因水深改變。'
        }
    },
    N07: {
        level: '核心',
        goal: '用波程差判斷相長、相消，並看見狹縫使波展開。',
        prerequisites: ['N04', 'N05'],
        observe: '兩同相波源的中垂線上，兩列波走的距離相同嗎？合成振幅如何？',
        takeaway: '同相波源的波程差為整數倍波長時相長；半整數倍時相消。完全相消還需兩波抵達時振幅相同。',
        example: {
            title: '先算路程差，再除以波長',
            given: '兩同相波源到 P 點的距離是 $18\\,\\mathrm{cm}$、$12\\,\\mathrm{cm}$，波長 $\\lambda=4.0\\,\\mathrm{cm}$；兩波在 P 振幅相同。',
            steps: ['$\\Delta\\ell=|18-12|=6.0\\,\\mathrm{cm}$。', '$\\Delta\\ell/\\lambda=6.0/4.0=1.5$，是半整數。'],
            result: '兩波在 P 反相，完全相消；P 位於節線上。'
        },
        check: {
            q: '同一水區中，把狹縫縮窄到與波長相近，通常會看到什麼？',
            opts: ['波長變短', '通過狹縫後展開得更明顯', '頻率變高'], answer: 1,
            explanation: '繞射改變波的展開程度；介質與波源沒變，波速、頻率與波長維持不變。'
        }
    },
    N08: {
        level: '核心',
        goal: '理解聲波需要介質，並用來回時間求回聲距離。',
        prerequisites: ['N01', 'N02'],
        observe: '改變音調時，空氣中的聲波波長怎麼變？波速是否一起變？',
        takeaway: '空氣中的聲波是縱波；同一條件下，音調高不代表傳得快。',
        example: {
            title: '回聲走了兩趟',
            given: '空氣聲速 $v=340\\,\\mathrm{m/s}$，發聲後 $t=0.50\\,\\mathrm{s}$ 聽到牆面回聲。',
            steps: ['總路程 $vt=340\\times0.50=170\\,\\mathrm{m}$。', '到牆的單程距離 $d=vt/2$。'],
            result: '牆面距離 $d=85\\,\\mathrm{m}$。'
        },
        check: {
            q: '在相同溫度的空氣中，高音與低音誰傳得比較快？',
            opts: ['高音', '低音', '近似一樣快'], answer: 2,
            explanation: '高中使用的空氣聲波模型中，聲速由介質條件決定，頻率改變主要影響波長。'
        }
    },
    N09: {
        level: '核心',
        goal: '把分子的左右位移與空氣的疏密、壓力變化分開讀。',
        prerequisites: ['N02', 'N08'],
        observe: '比較分子的平衡位置與現在位置：密部中央兩側的位移箭頭，是否指向密部中央？',
        takeaway: '正弦行進聲波中，位移圖與壓力變化圖相差 $\\lambda/4$；密部中央的位移是零。',
        example: {
            title: '用兩側箭頭辨認密部',
            given: '某瞬間 P 左側分子向右位移、右側分子向左位移，P 本身位移為零。',
            steps: ['兩側的位移都指向 P，表示附近分子間距比平衡時小；這是在讀位移，不是在讀當下速度。'],
            result: 'P 是密部中央：密度與壓力較大，卻不是位移最大的地方。'
        },
        check: {
            q: '正弦行進聲波中，分子位移達正的最大值時，壓力變化 $\\Delta P$ 是多少？',
            opts: ['正的最大值', '零', '負的最大值'], answer: 1,
            explanation: '位移極值與壓力變化極值相差四分之一波長；此處壓力等於未擾動時的壓力。'
        }
    },
    N10: {
        level: '核心',
        goal: '先畫管口的位移節點、腹點，再推基音與諧音。',
        prerequisites: ['N04', 'N09'],
        observe: '同樣管長下，開管與一端封閉的管，基音波長各容得下幾分之幾？',
        takeaway: '理想開管 $\\lambda_1=2L$；一端封閉管 $\\lambda_1=4L$，只允許奇數諧音。',
        example: {
            title: '同長度的兩支管',
            given: '管長 $L=0.50\\,\\mathrm{m}$、聲速 $v=340\\,\\mathrm{m/s}$，忽略管口修正。',
            steps: ['開管基頻 $f_1=v/(2L)=340\\,\\mathrm{Hz}$。', '閉管基頻 $f_1=v/(4L)=170\\,\\mathrm{Hz}$。'],
            result: '閉管基頻是同長開管的一半；閉管第一泛音是 $3f_1=510\\,\\mathrm{Hz}$。'
        },
        check: {
            q: '一端封閉管的第一泛音，是基音頻率的幾倍？',
            opts: ['2 倍', '3 倍', '4 倍'], answer: 1,
            explanation: '理想閉管依序允許第一、第三、第五諧音；第一泛音是第三諧音。'
        }
    },
    N11: {
        level: '核心',
        goal: '用頻率、振幅與諧音組合區分音調、響度與音色。',
        prerequisites: ['N02', 'N10'],
        observe: '保留基音，只調整泛音振幅，合成波形與音色如何改變？',
        takeaway: '保留基音時，泛音比例影響音色而不改變基本週期；同一頻率下，振幅影響響度。',
        example: {
            title: '同一個音，不同樂器',
            given: '甲、乙的基頻皆為 $200\\,\\mathrm{Hz}$；甲只有基音，乙另含 $400\\,\\mathrm{Hz}$、$600\\,\\mathrm{Hz}$ 諧音。',
            steps: ['兩者基本週期皆為 $T=1/200=0.0050\\,\\mathrm{s}$。', '乙的諧音使合成波形不同於甲的正弦波。'],
            result: '音調相同，音色可以不同；不能只憑頻率判定誰比較響。'
        },
        check: {
            q: '保持各頻率不變，只將所有諧音振幅一起放大，主要改變哪項特性？',
            opts: ['音調', '響度', '聲速'], answer: 1,
            explanation: '頻率組合未改變，波形比例不變；聲音強度增加，通常感覺更響。'
        }
    },
    N12: {
        level: '核心',
        goal: '理解共鳴為何增強振動，並從相鄰共鳴長度求聲速。',
        prerequisites: ['N10', 'N11'],
        observe: '同一閉管切換第 1、第 2 個可存在的諧音，管內各容得下幾個四分之一波長？',
        takeaway: '驅動頻率接近固有頻率時振動較強；同一音叉的相鄰共鳴長度差約為 $\\lambda/2$。',
        example: {
            title: '用差值避開管口修正',
            given: '音叉頻率 $f=400\\,\\mathrm{Hz}$，相鄰兩次共鳴長度為 $0.20\\,\\mathrm{m}$ 與 $0.62\\,\\mathrm{m}$。',
            steps: ['$\\lambda=2(0.62-0.20)=0.84\\,\\mathrm{m}$。', '$v=f\\lambda=400\\times0.84$。'],
            result: '聲速 $v=336\\,\\mathrm{m/s}$；兩次相近的管口修正會在差值中抵消。'
        },
        check: {
            q: '同一音叉下一次共鳴的空氣柱長度，比前一次增加多少？',
            opts: ['$\\lambda/4$', '$\\lambda/2$', '$\\lambda$'], answer: 1,
            explanation: '閉管可容納 $\\lambda/4$、$3\\lambda/4$、$5\\lambda/4$……，相鄰長度差為 $\\lambda/2$。'
        }
    },
    N13: {
        level: '核心',
        goal: '從法線量角，使用折射率與司乃耳定律預測光線方向。',
        prerequisites: ['N02', 'N06'],
        observe: '光由空氣斜射入較高折射率的玻璃，折射線靠近法線還是遠離法線？',
        takeaway: '角度一律從法線量；$n=c/v$，$n_1\\sin\\theta_1=n_2\\sin\\theta_2$。',
        example: {
            title: '空氣進玻璃',
            given: '空氣 $n_1=1.0$、玻璃 $n_2=1.5$，入射角 $\\theta_1=30^\\circ$。',
            steps: ['$\\sin\\theta_2=(n_1/n_2)\\sin30^\\circ=1/3$。'],
            result: '$\\theta_2\\approx19.5^\\circ$，光偏向法線；頻率不變。'
        },
        check: {
            q: '光進入折射率較高的介質，哪個量保持不變？',
            opts: ['光速', '波長', '頻率'], answer: 2,
            explanation: '靜止界面的折射波頻率與入射波相同；光速下降，所以波長也縮短。'
        }
    },
    N14: {
        level: '核心',
        goal: '用折射解釋水中物體看起來變淺，以及白光經稜鏡分色。',
        prerequisites: ['N13'],
        observe: '從水射向空氣的光線偏離法線時，試著在心中反向延長折射線：看到的位置會比水中物體深還是淺？',
        takeaway: '近乎正上方看水中物體，視深較小；色散來自不同色光的折射率不同。',
        example: {
            title: '魚看起來在哪個深度？',
            given: '魚在水面下 $h=0.80\\,\\mathrm{m}$，水的 $n=4/3$，觀察者在空氣中且近乎正上方。',
            steps: ['$h^{\\prime}=h(n_{\\text{空氣}}/n_{\\text{水}})=0.80\\times3/4$。'],
            result: '視深 $h^{\\prime}=0.60\\,\\mathrm{m}$；魚的實際位置仍在 $0.80\\,\\mathrm{m}$ 深處。'
        },
        check: {
            q: '白光通過一般玻璃稜鏡時，為何不同色光分開？',
            opts: ['各色光的頻率在稜鏡內改變', '玻璃對各色光的折射率不同', '紅光在真空比紫光快'], answer: 1,
            explanation: '一般可見光的正常色散中，紫光折射率較大、偏折較多；各色光頻率在界面不變。'
        }
    },
    N15: {
        level: '核心',
        goal: '同時檢查介質方向與入射角，判斷能否全反射。',
        prerequisites: ['N13'],
        observe: '光從玻璃射向空氣，逐漸增大入射角：折射角到 $90^\\circ$ 後會發生什麼？',
        takeaway: '必須從高 $n$ 到低 $n$，且入射角大於臨界角；等於臨界角時折射角為 $90^\\circ$。',
        example: {
            title: '玻璃到空氣的臨界角',
            given: '玻璃 $n_1=1.5$、空氣 $n_2=1.0$，入射角 $\\theta_i=50^\\circ$。',
            steps: ['$\\sin\\theta_c=n_2/n_1=2/3$，所以 $\\theta_c\\approx41.8^\\circ$。', '$50^\\circ>41.8^\\circ$，且光由高折射率射向低折射率。'],
            result: '符合兩項條件，發生全反射。'
        },
        check: {
            q: '光由空氣射入玻璃，入射角 $80^\\circ$，會全反射嗎？',
            opts: ['會，角度夠大', '不會，介質方向不符合', '一定要先知道波長'], answer: 1,
            explanation: '全反射必須從較高折射率介質射向較低折射率介質；這裡方向相反。'
        }
    },
    N16: {
        level: '核心',
        goal: '用薄透鏡公式求像距，再以符號判讀實像、虛像與放大率。',
        prerequisites: ['N13'],
        observe: '把物體從凸透鏡的 $2f$ 外移向焦點，實像的位置與大小如何改變？',
        takeaway: '本課符號：實物 $p>0$、凸透鏡 $f>0$；$q>0$ 為實像，$q<0$ 為虛像。',
        example: {
            title: '求像距後，再說像的性質',
            given: '凸透鏡 $f=10\\,\\mathrm{cm}$，實物距離 $p=30\\,\\mathrm{cm}$。',
            steps: ['$1/q=1/f-1/p=1/10-1/30=1/15\\,\\mathrm{cm^{-1}}$。', '$q=15\\,\\mathrm{cm}$，$m=-q/p=-0.50$。'],
            result: '鏡後 $15\\,\\mathrm{cm}$ 得到倒立、縮小為一半的實像，可用屏幕承接。'
        },
        check: {
            q: '計算得到 $q=-20\\,\\mathrm{cm}$，代表什麼？',
            opts: ['鏡後的實像', '與物體同側的虛像', '公式一定算錯'], answer: 1,
            explanation: '本課像距的負號表示虛像，光線的反向延長線相交在物體同側。'
        }
    },
    N17: {
        level: '核心',
        goal: '將透鏡成像連到相機、放大鏡與近視、遠視矯正。',
        prerequisites: ['N16'],
        observe: '把物體移到凸透鏡焦點內，屏幕接不到像時，從另一側看仍能看到放大的像嗎？',
        takeaway: '相機需要實像；放大鏡利用正立放大虛像。近視用發散鏡，遠視用會聚鏡。',
        example: {
            title: '放大鏡的物體要放哪裡？',
            given: '凸透鏡焦距 $f=10\\,\\mathrm{cm}$，物距 $p=5.0\\,\\mathrm{cm}$。',
            steps: ['$1/q=1/10-1/5.0=-1/10\\,\\mathrm{cm^{-1}}$，故 $q=-10\\,\\mathrm{cm}$。', '$m=-q/p=+2.0$。'],
            result: '物體同側有正立、放大 2 倍的虛像；屏幕無法直接承接。'
        },
        check: {
            q: '近視眼看遠方時像落在視網膜前，應用哪種鏡片矯正？',
            opts: ['凸透鏡', '凹透鏡', '平面玻璃'], answer: 1,
            explanation: '凹透鏡先讓光線發散，降低整體會聚能力，使成像位置移回視網膜。'
        }
    },
    N18: {
        level: '核心',
        goal: '辨認哪些觀察提供光具有波動性的證據。',
        prerequisites: ['N07'],
        observe: '觀察雙狹縫後相間的亮、暗紋：光在有些地方相消，單純的直行小球模型能說明嗎？',
        takeaway: '干涉、繞射支持光的波動性；歷史模型的成敗要由實驗證據判斷。',
        example: {
            title: '從現象挑證據',
            given: '三個觀察：① 物體後方有影子；② 鏡面反射；③ 雙狹縫形成相間亮、暗紋。',
            steps: ['① 可用直進光線描述，② 可用反射定律描述。', '③ 要用波的相長與相消疊加說明。'],
            result: '③ 是本單元最直接的波動性證據；①、② 本身不足以區分兩種歷史模型。'
        },
        check: {
            q: '誰用實驗產生並偵測電磁波，支持馬克士威的理論？',
            opts: ['牛頓', '赫茲', '惠更斯'], answer: 1,
            explanation: '馬克士威建立電磁波理論，赫茲以實驗驗證；兩人的角色不同。'
        }
    },
    N19: {
        level: '核心',
        goal: '從兩縫的波程差判斷亮暗，再計算條紋間距。',
        prerequisites: ['N07', 'N13', 'N18'],
        observe: '把兩縫間距 $d$ 調小，屏幕上的相鄰亮紋靠近還是分開？',
        takeaway: '同相雙縫：亮紋 $\\Delta\\ell=n\\lambda$，暗紋為半整數倍；遠屏小角度時 $\\Delta y=L\\lambda/d$。',
        example: {
            title: '先把 nm、mm 都換成 m',
            given: '$\\lambda=600\\,\\mathrm{nm}=6.0\\times10^{-7}\\,\\mathrm{m}$，$d=0.20\\,\\mathrm{mm}=2.0\\times10^{-4}\\,\\mathrm{m}$，$L=1.0\\,\\mathrm{m}$。',
            steps: ['$\\Delta y=L\\lambda/d=(1.0)(6.0\\times10^{-7})/(2.0\\times10^{-4})$。'],
            result: '相鄰亮紋間距 $\\Delta y=3.0\\times10^{-3}\\,\\mathrm{m}=3.0\\,\\mathrm{mm}$。'
        },
        check: {
            q: '波長與屏距不變，縫距減半，條紋間距如何變？',
            opts: ['減半', '不變', '加倍'], answer: 2,
            explanation: '$\\Delta y=L\\lambda/d$ 與縫距成反比；用同一單位代入即可看出。'
        }
    },
    N20: {
        level: '核心',
        goal: '辨認單狹縫的暗紋條件，並求中央亮紋寬度。',
        prerequisites: ['N05', 'N19'],
        observe: '把單狹縫縮窄，中央亮紋會變寬還是變窄？',
        takeaway: '單狹縫 $a\\sin\\theta=m\\lambda$ 算暗紋，$m=\\pm1,\\pm2,\\ldots$；$m=0$ 是中央亮紋，不是暗紋。',
        example: {
            title: '中央寬度要算兩側',
            given: '$\\lambda=500\\,\\mathrm{nm}=5.0\\times10^{-7}\\,\\mathrm{m}$，$a=0.10\\,\\mathrm{mm}=1.0\\times10^{-4}\\,\\mathrm{m}$，$L=1.0\\,\\mathrm{m}$，採小角近似。',
            steps: ['第一暗紋距中央 $y_1=L\\lambda/a=5.0\\,\\mathrm{mm}$。', '中央亮紋由 $-y_1$ 到 $+y_1$，寬度為 $2y_1$。'],
            result: '中央亮紋寬度 $10\\,\\mathrm{mm}$，不是 $5.0\\,\\mathrm{mm}$。'
        },
        check: {
            q: '單狹縫滿足 $a\\sin\\theta=\\lambda$ 的方向，對應哪個位置？',
            opts: ['中央亮紋中心', '第一暗紋', '第一側亮紋中心'], answer: 1,
            explanation: '把狹縫分成兩半，對應子波光程差為 $\\lambda/2$，能成對相消。'
        }
    },
    N21: {
        level: '延伸',
        goal: '理解聲源或接收者移動時，接收到的頻率如何改變。',
        prerequisites: ['N02', 'N08'],
        observe: '聲源向右移動時，前方與後方波峰的間距有什麼不同？',
        takeaway: '接近通常聽到較高音，遠離較低音；聲速仍由空氣決定。公式中的速度以介質為參考。',
        example: {
            title: '沿一直線接近的聲源',
            given: '空氣靜止，$v=340\\,\\mathrm{m/s}$；聲源以 $v_s=20\\,\\mathrm{m/s}$ 朝靜止接收者前進，發聲頻率 $f=640\\,\\mathrm{Hz}$。',
            steps: ['前方波長 $\\lambda=(v-v_s)/f=320/640=0.50\\,\\mathrm{m}$。', '接收頻率 $f^{\\prime}=v/\\lambda=340/0.50$。'],
            result: '$f^{\\prime}=680\\,\\mathrm{Hz}$，比發聲頻率高；適用沿一直線且聲源低於聲速的情境。'
        },
        check: {
            q: '只有接收者朝靜止聲源移動時，空氣中的波長會改變嗎？',
            opts: ['會，波長變短', '不會，但接收到的頻率提高', '不會，接收到的頻率也不變'], answer: 1,
            explanation: '聲源未移動，波前間距不變；接收者每秒遇到更多波前，因此測得較高頻率。'
        }
    }
};
