import os
import fitz # PyMuPDF
from PIL import Image

# Coordinates on PDF page points (72 points/inch)
# We can crop page with clip=fitz.Rect(x0, y0, x1, y1) and dpi=300

targets = [
    {
        'id': 'ast-113-02',
        'pdf': 'scratch/temp_pdfs/113_AST.pdf',
        'page': 2, # 1-indexed -> page index 1
        'rect': fitz.Rect(50, 110, 545, 250),
        'desc': '113 分科 第 2 題 (光跨介質、肥皂泡、彩虹)'
    },
    {
        'id': 'ast-113-14',
        'pdf': 'scratch/temp_pdfs/113_AST.pdf',
        'page': 5, # 1-indexed -> page index 4
        'rect': fitz.Rect(50, 240, 545, 360),
        'desc': '113 分科 第 14 題 (雙狹縫干涉、白光條紋)'
    },
    {
        'id': 'ast-112-11',
        'pdf': 'scratch/temp_pdfs/112_AST.pdf',
        'page': 4, # 1-indexed -> page index 3
        'rect': fitz.Rect(50, 370, 545, 615),
        'desc': '112 分科 第 11 題 (機車排氣管消音器、圖3)'
    },
    {
        'id': 'ast-112-18',
        'pdf': 'scratch/temp_pdfs/112_AST.pdf',
        'page': 6, # 1-indexed -> page index 5
        'rect': fitz.Rect(50, 80, 545, 320),
        'desc': '112 分科 第 18 題 (圓柱塑膠瓶裝水聚光、圖5)'
    },
    {
        'id': 'ast-111-16',
        'pdf': 'scratch/temp_pdfs/111_AST.pdf',
        'page': 5, # 1-indexed -> page index 4
        'rect': fitz.Rect(50, 435, 545, 650),
        'desc': '111 分科 第 16 題 (透明壓克力隔板視位移、圖8)'
    },
    {
        'id': 'ast-111-25',
        'pdf': 'scratch/temp_pdfs/111_AST.pdf',
        'page': 8, # 1-indexed -> page index 7
        'rect': fitz.Rect(50, 400, 545, 655),
        'desc': '111 分科 第 25 題 (瑞立矩形擴音器、圖13)'
    },
    {
        'id': 'drte-110-17',
        'pdf': 'scratch/temp_pdfs/110_DRTE.pdf',
        'page': 5, # 1-indexed -> page index 4
        'rect': fitz.Rect(50, 540, 545, 805),
        'desc': '110 指考 第 17 題 (水波槽深淺水界面ab、圖6)'
    },
    {
        'id': 'drte-110-23',
        'pdf': 'scratch/temp_pdfs/110_DRTE.pdf',
        'page': 7, # 1-indexed -> page index 6
        'rect': fitz.Rect(50, 385, 545, 570),
        'desc': '110 指考 第 23 題 (雙狹縫干涉與單狹縫繞射)'
    },
    {
        'id': 'drte-109-06',
        'pdf': 'scratch/temp_pdfs/109_DRTE.pdf',
        'page': 5, # 1-indexed -> page index 4
        'rect': fitz.Rect(50, 320, 545, 430),
        'desc': '109 指考 第 15 題 (長笛開管 vs 單簧管閉管)'
    },
    {
        'id': 'drte-109-14',
        'pdf': 'scratch/temp_pdfs/109_DRTE.pdf',
        'page': 5, # 1-indexed -> page index 4
        'rect': fitz.Rect(50, 165, 545, 335),
        'desc': '109 指考 第 14 題 (直角三角形玻璃塊倒置夾層)'
    },
]

out_dir = 'assets/images/exams'
os.makedirs(out_dir, exist_ok=True)

# Render each at 300 DPI for ultra crisp quality
matrix = fitz.Matrix(300 / 72, 300 / 72)

for t in targets:
    doc = fitz.open(t['pdf'])
    page = doc[t['page'] - 1]
    
    # Let's get pixmap for the clip rectangle
    pix = page.get_pixmap(matrix=matrix, clip=t['rect'])
    
    png_path = os.path.join(out_dir, f"{t['id']}.png")
    pix.save(png_path)
    print(f"Rendered {t['id']}.png ({pix.width}x{pix.height}) -> {png_path}")
