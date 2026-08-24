import os
import fitz # PyMuPDF
from PIL import Image

crops = [
    {
        'id': 'ast-113-02',
        'pdf': 'scratch/temp_pdfs/113_AST.pdf',
        'page': 2,
        'rect': fitz.Rect(55, 221, 540, 345),
        'title': '113 分科 第 2 題'
    },
    {
        'id': 'ast-113-14',
        'pdf': 'scratch/temp_pdfs/113_AST.pdf',
        'page': 5,
        'rect': fitz.Rect(55, 248, 540, 354),
        'title': '113 分科 第 14 題'
    },
    {
        'id': 'ast-112-11',
        'pdf': 'scratch/temp_pdfs/112_AST.pdf',
        'page': 4,
        'rect': fitz.Rect(55, 376, 540, 523),
        'title': '112 分科 第 11 題'
    },
    {
        'id': 'ast-112-18',
        'pdf': 'scratch/temp_pdfs/112_AST.pdf',
        'page': 6,
        'rect': fitz.Rect(55, 85, 540, 338),
        'title': '112 分科 第 18 題'
    },
    {
        'id': 'ast-111-16',
        'pdf': 'scratch/temp_pdfs/111_AST.pdf',
        'page': 5,
        'rect': fitz.Rect(55, 442, 540, 624),
        'title': '111 分科 第 16 題'
    },
    {
        'id': 'ast-111-25',
        'pdf': 'scratch/temp_pdfs/111_AST.pdf',
        'page': 8,
        'rect': fitz.Rect(55, 374, 540, 658),
        'title': '111 分科 第 25 題 (含題組圖 13)'
    },
    {
        'id': 'drte-110-17',
        'pdf': 'scratch/temp_pdfs/110_DRTE.pdf',
        'page': 5,
        'rect': fitz.Rect(55, 544, 540, 780),
        'title': '110 指考 第 17 題'
    },
    {
        'id': 'drte-110-23',
        'pdf': 'scratch/temp_pdfs/110_DRTE.pdf',
        'page': 7,
        'rect': fitz.Rect(55, 390, 540, 578),
        'title': '110 指考 第 23 題'
    },
    {
        'id': 'drte-109-06',
        'pdf': 'scratch/temp_pdfs/109_DRTE.pdf',
        'page': 5,
        'rect': fitz.Rect(55, 324, 540, 428),
        'title': '109 指考 第 15 題'
    },
    {
        'id': 'drte-109-14',
        'pdf': 'scratch/temp_pdfs/109_DRTE.pdf',
        'page': 5,
        'rect': fitz.Rect(55, 170, 540, 324),
        'title': '109 指考 第 14 題'
    },
]

out_dir = 'assets/images/exams'
os.makedirs(out_dir, exist_ok=True)

# 300 DPI for ultra crisp quality
matrix = fitz.Matrix(300 / 72, 300 / 72)

for c in crops:
    doc = fitz.open(c['pdf'])
    page = doc[c['page'] - 1]
    pix = page.get_pixmap(matrix=matrix, clip=c['rect'])
    
    out_file = os.path.join(out_dir, f"{c['id']}.png")
    pix.save(out_file)
    print(f"Generated {out_file}: {pix.width}x{pix.height} px")
