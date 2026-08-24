import os

# 1. Update data/questionBank.js
qb_path = 'data/questionBank.js'
with open(qb_path, 'r', encoding='utf-8') as f:
    qb_content = f.read()

# Replace .svg with .png in questionBank.js
qb_content = qb_content.replace('.svg', '.png')

# Update DRTE-109-06 source to 第 15 題
qb_content = qb_content.replace('109 學年度指考 第 6 題', '109 學年度指考 第 15 題')
qb_content = qb_content.replace('【圖 2】長笛（兩端開管）基音 vs. 單簧管（一開一閉）第一泛音駐波圖', '【109 指考 第 15 題】大考中心官方試題卷原始截圖（長笛開管基音 vs 單簧管閉管第一泛音管長比）')
qb_content = qb_content.replace('【圖 4】兩直角三稜鏡平行夾層介質之連續折射光路圖', '【109 指考 第 14 題】大考中心官方試題卷原始截圖（含圖 6 兩直角三角形玻璃塊夾層折射線）')
qb_content = qb_content.replace('【圖 6】水波槽直線界面 ab 之深淺水折射偏折圖', '【110 指考 第 17 題】大考中心官方試題卷原始截圖（水波槽深淺水界面 ab 折射選項圖）')
qb_content = qb_content.replace('【圖 7】雙狹縫干涉與單狹縫繞射屏幕條紋對照分析圖', '【110 指考 第 23 題】大考中心官方試題卷原始截圖（雙狹縫干涉與單狹縫繞射綜合運算）')
qb_content = qb_content.replace('【圖 8】透明壓克力隔板與方格紙水平線視位移現象', '【111 分科 第 16 題】大考中心官方試題卷原始截圖（含圖 8 壓克力隔板視位移實景照片）')
qb_content = qb_content.replace('【111 分科 第 25 題】聲波開口繞射張角與單狹縫極小值模型', '【111 分科 第 25 題】大考中心官方試題卷原始截圖（含圖 13 瑞立矩形擴音器題組模型）')
qb_content = qb_content.replace('【圖 3】機車排氣管干涉型消音器路徑差與減噪示意圖', '【112 分科 第 11 題】大考中心官方試題卷原始截圖（含圖 4 機車干涉型消音器）')
qb_content = qb_content.replace('【圖 5】圓柱形裝水塑膠瓶橫截面與司乃耳折射光路圖', '【112 分科 第 18 題】大考中心官方試題卷原始截圖（含圖 5 裝水塑膠瓶光路與表 2）')
qb_content = qb_content.replace('【113 分科 第 2 題】光波跨介質波長變化、薄膜干涉與彩虹成因分析圖', '【113 分科 第 2 題】大考中心官方試題卷原始截圖（光跨介質、薄膜干涉與波粒二象性）')
qb_content = qb_content.replace('【113 分科 第 14 題】楊氏雙狹縫干涉光程差與白光條紋分佈圖', '【113 分科 第 14 題】大考中心官方試題卷原始截圖（雙狹縫干涉條紋間距與光程差）')

with open(qb_path, 'w', encoding='utf-8') as f:
    f.write(qb_content)
print("Updated questionBank.js")

# 2. Update data/modulesData.js
mod_path = 'data/modulesData.js'
with open(mod_path, 'r', encoding='utf-8') as f:
    mod_content = f.read()

mod_content = mod_content.replace('.svg', '.png')
mod_content = mod_content.replace('109 指考 第 6 題', '109 指考 第 15 題')
mod_content = mod_content.replace('【圖 3】機車干涉型消音器示意圖', '【112 分科 第 11 題】大考中心原卷試題圖（含圖 4 機車消音器）')
mod_content = mod_content.replace('【圖 2】長笛（開管）基音 vs. 單簧管（閉管）第一泛音駐波對照', '【109 指考 第 15 題】大考中心原卷試題圖（長笛開管基音 vs 單簧管閉管第一泛音）')
mod_content = mod_content.replace('【圖 4】兩直角三稜鏡平行夾層之折射光路圖', '【109 指考 第 14 題】大考中心原卷試題圖（含圖 6 稜鏡夾層折射線條選填）')
mod_content = mod_content.replace('【圖 5】圓柱形裝水塑膠瓶折射光路圖', '【112 分科 第 18 題】大考中心原卷試題圖（含圖 5 圓柱塑膠瓶光路與表 2）')
mod_content = mod_content.replace('【圖 8】透明壓克力隔板與方格紙視位移現象', '【111 分科 第 16 題】大考中心原卷試題圖（含圖 8 壓克力隔板實景照片）')
mod_content = mod_content.replace('【圖 6】水波槽深水進淺水之折射與波前關係', '【110 指考 第 17 題】大考中心原卷試題圖（水波槽深淺水界面 ab 折射選項圖）')
mod_content = mod_content.replace('【圖 7】雙狹縫干涉與單狹縫繞射屏幕條紋對照分析', '【110 指考 第 23 題】大考中心原卷試題圖（雙狹縫干涉與單狹縫繞射綜合運算）')
mod_content = mod_content.replace('【113 分科 第 2 題】光波跨介質波長變化與薄膜干涉', '【113 分科 第 2 題】大考中心原卷試題圖（光跨介質、薄膜干涉與波粒二象性）')
mod_content = mod_content.replace('【113 分科 第 14 題】雙狹縫干涉條紋間距與光程差分析', '【113 分科 第 14 題】大考中心原卷試題圖（雙狹縫干涉條紋間距與光程差）')
mod_content = mod_content.replace('【111 分科 第 25 題】聲波開口繞射張角與單狹縫極小值模型', '【111 分科 第 25 題】大考中心原卷試題圖（含題組圖 13 瑞立擴音器與理論模型）')

with open(mod_path, 'w', encoding='utf-8') as f:
    f.write(mod_content)
print("Updated modulesData.js")
