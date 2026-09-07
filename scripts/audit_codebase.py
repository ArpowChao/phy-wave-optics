import os
import re
import sys

def run_audit():
    print("=== [AUDIT] 專案代碼與視覺相容性自動化健檢 ===")
    errors = []

    # 1. 檢查 HTML/JS 中是否殘留未封裝的 putImageData
    with open('wave_optics_review.html', 'r', encoding='utf-8') as f:
        html = f.read()

    # 檢查 putImageData 是否都是對 off.ctx 呼叫
    lines = html.split('\n')
    for idx, line in enumerate(lines):
        if 'putImageData' in line:
            if 'off.ctx.putImageData' not in line and 'offCtx.putImageData' not in line:
                errors.append(f"[Canvas DPR 違規] 第 {idx+1} 行發現直接對主 ctx 調用 putImageData: {line.strip()}，應改用 off.ctx.putImageData + ctx.drawImage")

    # 2. 檢查大考圖片資源是否存在且尺寸大於 0
    with open('data/questionBank.js', 'r', encoding='utf-8') as f:
        qb = f.read()

    img_paths = re.findall(r'image:\s*\"([^\"]+)\"', qb)
    for img in img_paths:
        if not os.path.exists(img):
            errors.append(f"[缺失圖片] 題庫引用的圖片不存在: {img}")
        elif os.path.getsize(img) < 1000:
            errors.append(f"[異常圖片] 圖片大小過小 (<1KB): {img}")

    # 3. 檢查題庫 ID 是否唯一
    #    真題用官方題號（id 欄位），分級題庫的識別碼是「節點-層級」，兩者都要檢查。
    qids = re.findall(r'id:\s*\"([^\"]+)\"', qb)
    graded = re.findall(r'node:\s*\"(N\d+)\",\s*level:\s*\"([^\"]+)\"', qb)
    all_ids = qids + [f"{n}-{lv}" for n, lv in graded]
    seen = set()
    for qid in all_ids:
        if qid in seen:
            errors.append(f"[重複題號] 發現重複的 Question ID: {qid}（會導致錯題本記錯題）")
        seen.add(qid)

    # 4. 檢查離屏快取函式是否存在
    if 'function getOffscreen(' not in html:
        errors.append("[缺失核心函式] wave_optics_review.html 中找不到 getOffscreen 輔助函式")

    # 5. 檢查動畫資源是否齊全
    if os.path.exists('data/mediaData.js'):
        with open('data/mediaData.js', 'r', encoding='utf-8') as f:
            md = f.read()
        media = re.findall(r"(?:video|poster|src):\s*'(assets/[^']+)'", md)
        for m in media:
            if not os.path.exists(m):
                errors.append(f"[缺失動畫資源] mediaData.js 引用的檔案不存在: {m}")
            elif os.path.getsize(m) < 1000:
                errors.append(f"[異常動畫資源] 檔案過小 (<1KB): {m}")
    else:
        media = []

    print(f"掃描完成：共檢測 {len(img_paths)} 張試題圖片、{len(all_ids)} 道題目"
          f"（{len(qids)} 道真題 + {len(graded)} 道分級題）、{len(media)} 個動畫資源"
          f"與所有 Canvas 繪圖常規。")

    if errors:
        print("\n❌ 發現以下違規或錯誤：")
        for e in errors:
            print("  -", e)
        sys.exit(1)
    else:
        print("\n✅ 所有靜態與架構相容性檢查全部通過！")
        sys.exit(0)

if __name__ == '__main__':
    run_audit()
