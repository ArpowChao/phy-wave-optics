import os
import fitz # PyMuPDF

questions_info = [
    {
        'id': 'AST-113-02',
        'pdf': 'scratch/temp_pdfs/113_AST.pdf',
        'year': '113 分科',
        'q_num': '2',
        'search_terms': ['2.', '單色光自空氣進入玻璃', '肥皂泡']
    },
    {
        'id': 'AST-113-14',
        'pdf': 'scratch/temp_pdfs/113_AST.pdf',
        'year': '113 分科',
        'q_num': '14',
        'search_terms': ['14.', '雙狹縫', '白光']
    },
    {
        'id': 'AST-112-11',
        'pdf': 'scratch/temp_pdfs/112_AST.pdf',
        'year': '112 分科',
        'q_num': '11',
        'search_terms': ['11.', '消音器', '圖 3', '圖3']
    },
    {
        'id': 'AST-112-18',
        'pdf': 'scratch/temp_pdfs/112_AST.pdf',
        'year': '112 分科',
        'q_num': '18',
        'search_terms': ['18.', '塑膠瓶', '圖 5', '圖5']
    },
    {
        'id': 'AST-111-16',
        'pdf': 'scratch/temp_pdfs/111_AST.pdf',
        'year': '111 分科',
        'q_num': '16',
        'search_terms': ['16.', '透明壓克力', '圖 8', '圖8']
    },
    {
        'id': 'AST-111-25',
        'pdf': 'scratch/temp_pdfs/111_AST.pdf',
        'year': '111 分科',
        'q_num': '25',
        'search_terms': ['25.', '擴音器', '3000']
    },
    {
        'id': 'DRTE-110-17',
        'pdf': 'scratch/temp_pdfs/110_DRTE.pdf',
        'year': '110 指考',
        'q_num': '17',
        'search_terms': ['17.', '水波槽', '圖 6', '圖6']
    },
    {
        'id': 'DRTE-110-23',
        'pdf': 'scratch/temp_pdfs/110_DRTE.pdf',
        'year': '110 指考',
        'q_num': '23',
        'search_terms': ['23.', '圖 7', '圖7', '雙狹縫']
    },
    {
        'id': 'DRTE-109-06',
        'pdf': 'scratch/temp_pdfs/109_DRTE.pdf',
        'year': '109 指考',
        'q_num': '6',
        'search_terms': ['6.', '長笛', '圖 2', '圖2']
    },
    {
        'id': 'DRTE-109-14',
        'pdf': 'scratch/temp_pdfs/109_DRTE.pdf',
        'year': '109 指考',
        'q_num': '14',
        'search_terms': ['14.', '圖 4', '圖4', '玻璃']
    },
]

for q in questions_info:
    doc = fitz.open(q['pdf'])
    print(f"\n==========================================")
    print(f"Locating {q['id']} ({q['year']} 第 {q['q_num']} 題) in {q['pdf']}")
    found = False
    for pno, page in enumerate(doc):
        text = page.get_text()
        if any(term in text for term in q['search_terms']):
            # Let's inspect blocks on this page
            blocks = page.get_text("blocks")
            print(f"  Found on Page {pno + 1} (dimensions: {page.rect}):")
            for b in blocks:
                # b is (x0, y0, x1, y1, text, block_no, block_type)
                b_text = b[4].strip()
                if any(term in b_text for term in q['search_terms']) or (q['q_num'] + '.' in b_text):
                    print(f"    Block [{b[0]:.1f}, {b[1]:.1f}, {b[2]:.1f}, {b[3]:.1f}]: {b_text[:80]}")
            found = True
    if not found:
        print(f"  WARNING: Not found with terms {q['search_terms']}")
