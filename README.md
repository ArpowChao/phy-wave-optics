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

## 修改後驗證

```bash
python scripts/audit_codebase.py
node scripts/audit_learning_content.js
node scripts/audit_page_recovery.js
```

靜態健檢驗證題號、資源、DPR 繪圖原則；導讀健檢驗證每節資料、先備圖、答案鍵與前端語法。

頁面復原健檢以實際 HTML／JS 做故障注入，涵蓋必要腳本缺檔、語法錯誤與渲染例外；復原入口另需瀏覽器操作核對。

另開啟 `wave_optics_review.html?selftest=1`，掃描所有實驗模式的 **實際 360 / 560 / 900px 畫布**。文字碰撞逐幀比較，檢查左右上下四邊及執行期錯誤；跨幀不同文字不視為同時重疊。此健檢不涵蓋獨立水波頁，也不取代手機畫面、參數邊界與實際操作的視覺核對。

專案 UI 守則見 `.agents/rules/ui_canvas_verification.md`。測試截圖與臨時檔放在 `scratch/`。

## 內容查核與來源

課程範圍以 [國家教育研究院自然科學領域課綱](https://stv.naer.edu.tw/data/course_outline/pta_18538_240851_60502.pdf) 的「波動、光及聲音」條目為依據；章節順序是本教材的教學編排，並非所有版本課本的章號。

物理敘述比對 [OpenStax 波的反射與疊加](https://openstax.org/books/university-physics-volume-1/pages/16-5-interference-of-waves)、[聲速](https://openstax.org/books/university-physics-volume-1/pages/17-2-speed-of-sound)、[共振](https://openstax.org/books/college-physics-2e/pages/16-8-forced-oscillations-and-resonance) 與 [有限縫寬雙縫繞射](https://openstax.org/books/university-physics-volume-3/pages/4-3-double-slit-diffraction)。塔可馬吊橋影片採 [WSDOT 的扭轉顫振說明](https://www.wsdot.wa.gov/TNBhistory/bridges-failure.htm)，列為延伸，不當作簡單受迫共振。

歷屆試題圖片來自大考中心公開試卷；題意整理與補充題以文字標示，未經佐證的答對率已移除。109 年樂器題是第 15 題；資源檔名 `drte-109-06.png` 與識別碼 `DRTE-109-06` 是舊名稱，保留以避免破壞既有錯題紀錄。

感謝新竹市立成德高中陳家騏老師提供水波干涉探究模擬器原始設計。本機動畫由原專案以 Manim 製作；外部影片保留原始來源。原創動畫角色與試題圖片的既有權利歸屬不因介面更新而改變。
