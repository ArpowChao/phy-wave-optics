# 波動與光學・學習筆記

給台灣高三剛開始學習選修物理 III 的純前端教材。以「觀察現象 → 理解關係 → 做一題檢核」為主線，涵蓋波動、聲波、幾何光學與物理光學。

## 使用

開啟 `index.html`，或在專案資料夾啟動本機伺服器：

```bash
python -m http.server 8000
```

瀏覽 `http://localhost:8000/`。不需建置或註冊；MathJax 與字型由 CDN 載入，完整數學排版需要網路。

## 學習方式

- 首頁可從第一節開始，或依課堂進度選章節；側欄只展開目前章節。
- 20 節核心教材各有目標、先備連結、觀察問題、短例題與附理由的檢核。N21 都卜勒效應為延伸選讀。
- 核心關係先呈現；公式適用條件、動畫、解題提醒、大考題型與跨章延伸按需展開。
- 導讀會開啟相應實驗模式。水波干涉直接進入含 2D／3D／1D 的完整實驗；`water_interference.html` 也提供自由操作與可選的三步導讀。
- 94 題題庫以主題、難度與來源篩選，每頁最多 5 題；「記憶 → 理解 → 應用 → 分析」逐步練習。
- 自行確認理解與錯題紀錄只保存在目前瀏覽器。看過頁面不會自動算作理解；已確認的節點可以取消。
- 公式、動畫與大考題型可依章節查找；對照表一次展開一個主題。

16 個互動實驗保留原有調參、時間軸、逐格播放及 0.1×–1.5× 速度控制；3D 多元件光學工作臺列為延伸。小振幅橫波實驗固定介質波速時，調整頻率會同步改變波長。諧音疊加也處理缺少基音或全部振幅為零的情形。

水波圖保留 d 尺寸線與 λ 比例尺，可切換 λ／cm／兩者／隱藏，並操作亮暗紋、腹節線、相位、衰減與隨機出題。P 的量測使用模型座標，改變視窗大小時仍維持相同路徑讀數。獨立水波頁另可切換「瞬間位移」與「振幅分布」，避免把某瞬間水面為零誤判成節線。完全相消必須考慮相位與抵達振幅是否相同。

主頁水波操作分為「波源間距與長度顯示」及「水波與圖示」兩張卡片，手機改為單欄。必要腳本載入失敗或頁面渲染中斷時，會顯示重載按鈕與獨立水波頁入口。

共振頁 N12 收錄玻璃杯、慢動作杯壁、建築震動、節拍器同步與塔可馬吊橋五段影片，以觀察問題和判讀區分受迫共振、耦合同步與自激顫振。保留共鳴空氣柱實驗與例題，另附三題檢核及來源。影片展開時才載入，收合後移除播放器；也可直接開啟 YouTube 原始連結。

N12 的盪鞦韆動畫提供「正弦波做功對照」與「受迫鞦韆」兩種視角。可調推力頻率比、相位、推力與阻尼，暫停、逐步或拖曳時間；同步看推力 F、速度 v、功率 Fv 及累積做功。固定波形不把累積功當作振幅；受迫小角度模型以 RK4 同時計算運動、外力功與耗散，驗證 E − E₀ = W − D。

N13–N15 的司乃耳實驗分為「單一光線」「水下光扇」「斯涅爾窗（水下仰望）」三種模式。單一光線依非偏振光的菲涅耳公式顯示反射率 R，可看到 R 在臨界角處連續升到 100%。水下光扇對應水槽光扇實驗，標出出光圓 r = h·tanθc。斯涅爾窗左側為側視光路，右側以逐像素光線追蹤算出魚眼仰望影像，可切換泳池／深海與水面波動；畫布下方附真實照片對照，按「套用到模擬」即可把參數調成接近照片的情況。

N14 的視深實驗分為「拖曳眼睛：看魚也看鳥」「岸上看水中」「斜看池底」「水中看岸上」「水族箱：空氣—玻璃—水」五種模式。拖曳模式中眼睛可放在水面上或水面下，魚在水中游、鳥在空中飛，同時比較直射、折射成像與水面倒影（眼睛在水下且入射角大於臨界角時為全反射）。像點一律由兩條進入瞳孔上、下緣的折射光線反向延長的交點求得；其他模式的動畫先讓光從物體走到眼睛，再由眼睛沿直線反推到像。斜看模式畫出整片池底「看起來的位置」；水族箱模式提供家用魚缸（玻璃 1 cm）、大型水族館（壓克力 25 cm）與美ら海黑潮之海（壓克力 60 cm）三種實際情境，可逐面成像，驗證總視距 = Σ 厚度／折射率。

## 檔案

| 檔案 | 用途 |
| --- | --- |
| `wave_optics_review.html` | 主頁、路由、Canvas 實驗與播放器 |
| `assets/js/learner-ui.js` | 初學導讀、章節介面、練習篩選與學習紀錄 |
| `assets/css/learner.css` | 資訊層次、響應式排版與鍵盤焦點 |
| `data/learningGuide.js` | 21 節導讀、例題與檢核 |
| `data/modulesData.js` | 教材、公式、概念圖與題型 |
| `data/questionBank.js` | 分級題與歷屆試題；保留舊識別碼以維持錯題紀錄 |
| `data/mediaData.js` | 本機動畫與外部實拍影片 |
| `water_interference.html` | 水波干涉自由操作與可選導讀 |
| `assets/js/wave-runtime.js` | 時鐘、高 DPI 畫布與切換頁面的資源清理 |
| `assets/js/swing-work.js` | 共振頁盪鞦韆的模型、做功動畫與操作 |
| `assets/css/swing-work.css` | 鞦韆控制與數值的響應式排版 |
| `assets/images/snell/` | 斯涅爾窗真實照片對照（來源見下方） |
| `assets/video/real/`、`assets/images/real/` | 真實影片對照（泳池水下全反射、水槽光扇）與封面 |

## 修改後驗證

```bash
python scripts/audit_codebase.py
node scripts/audit_learning_content.js
node scripts/audit_page_recovery.js
node scripts/audit_swing_work.js
```

靜態健檢驗證題號、資源、DPR 繪圖原則；導讀健檢驗證每節資料、先備圖、答案鍵與前端語法。

頁面復原健檢以實際 HTML／JS 做故障注入，涵蓋必要腳本缺檔、語法錯誤與渲染例外；復原入口另需瀏覽器操作核對。

另開啟 `wave_optics_review.html?selftest=1`，掃描所有實驗模式的 **實際 360 / 560 / 900px 畫布**。文字碰撞逐幀比較，檢查左右上下四邊及執行期錯誤；跨幀不同文字不視為同時重疊。此健檢不涵蓋獨立水波頁，也不取代手機畫面、參數邊界與實際操作的視覺核對。

專案 UI 守則見 `.agents/rules/ui_canvas_verification.md`。測試截圖與臨時檔放在 `scratch/`。

## 內容查核與來源

課程範圍以 [國家教育研究院自然科學領域課綱](https://stv.naer.edu.tw/data/course_outline/pta_18538_240851_60502.pdf) 的「波動、光及聲音」條目為依據；章節順序是本教材的教學編排，並非所有版本課本的章號。

物理敘述比對 [OpenStax 波的反射與疊加](https://openstax.org/books/university-physics-volume-1/pages/16-5-interference-of-waves)、[聲速](https://openstax.org/books/university-physics-volume-1/pages/17-2-speed-of-sound)、[共振](https://openstax.org/books/college-physics-2e/pages/16-8-forced-oscillations-and-resonance) 與 [有限縫寬雙縫繞射](https://openstax.org/books/university-physics-volume-3/pages/4-3-double-slit-diffraction)。塔可馬吊橋影片採 [WSDOT 的扭轉顫振說明](https://www.wsdot.wa.gov/TNBhistory/bridges-failure.htm)，列為延伸，不當作簡單受迫共振。

歷屆試題圖片來自大考中心公開試卷；題意整理與補充題以文字標示，未經佐證的答對率已移除。109 年樂器題是第 15 題；資源檔名 `drte-109-06.png` 與識別碼 `DRTE-109-06` 是舊名稱，保留以避免破壞既有錯題紀錄。

美ら海水族館「黑潮之海」壓克力板尺寸（22.5 m × 8.2 m × 60 cm）依[日本政府廣報 Highlighting Japan 2024 年 9 月號](https://gov-online.go.jp/hlj/en/september_2024/september_2024-07.html)；壓克力折射率 n_d ≈ 1.49 依 [Shimadzu PMMA 折射率資料](https://www.shimadzu.com/opt/products/ref/ref-app03.html)。

真實影片：泳池水下影片轉載自 Instagram @myswimpro（畫面含 Little Rock 標誌），只保留前 26 秒水下片段並移除音軌；水槽光扇影片為 Rosa Brígida，A.I.F.–E.S.T.T.（2010）〈Reflection, refraction and total internal reflection in water/air surface〉，移除音軌。兩支影片分別附在斯涅爾窗／視深拖曳模式與水下光扇模式的對照區。

斯涅爾窗照片：夕陽與 Lembeh、Manado 照片為 Andrew Marriott 所攝，出自 [DivePhotoGuide〈An In-Depth Guide to Shooting Snell's Window〉](https://www.divephotoguide.com/underwater-photography-techniques/article/underwater-photographer-s-guide-snell-s-window/)，其中 Lembeh 與 Manado 兩組以原文圖片連結載入；泳池中仰望（窗內的人、窗外的磁磚）亦為 Andrew Marriott 所攝；鯊魚與自由潛水者兩張由使用者提供，來源待補。權利歸原作者所有。

感謝新竹市立成德高中陳家騏老師提供水波干涉探究模擬器原始設計。本機動畫由原專案以 Manim 製作；外部影片保留原始來源。原創動畫角色與試題圖片的既有權利歸屬不因介面更新而改變。
