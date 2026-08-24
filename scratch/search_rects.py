import fitz

targets = [
    {
        'id': 'ast-113-02',
        'pdf': 'scratch/temp_pdfs/113_AST.pdf',
        'page': 2,
        'start_text': '2. 下列有關光的性質',
        'end_text': '(E) 雙狹縫干涉與光電效應皆可證實光的波動性',
    },
    {
        'id': 'ast-113-14',
        'pdf': 'scratch/temp_pdfs/113_AST.pdf',
        'page': 5,
        'start_text': '14. 下列有關雙狹縫干涉',
        'end_text': '(E) 屏幕上相鄰兩暗紋的位置',
    },
    {
        'id': 'ast-112-11',
        'pdf': 'scratch/temp_pdfs/112_AST.pdf',
        'page': 4,
        'start_text': '11. 機車在排放廢氣時',
        'end_text': '(E) 0.60',
    },
    {
        'id': 'ast-112-18',
        'pdf': 'scratch/temp_pdfs/112_AST.pdf',
        'page': 6,
        'start_text': '18. 據新聞報導',
        'end_text': 'sinθw = (na / nw)sinθa',
    },
    {
        'id': 'ast-111-16',
        'pdf': 'scratch/temp_pdfs/111_AST.pdf',
        'page': 5,
        'start_text': '16. 因為新冠肺炎的流行',
        'end_text': '(E) 測量Δy 與h 的比值',
    },
    {
        'id': 'ast-111-25',
        'pdf': 'scratch/temp_pdfs/111_AST.pdf',
        'page': 8,
        'start_text': '第 24-26 題為題組',
        'end_text': '(E) 180°',
    },
    {
        'id': 'drte-110-17',
        'pdf': 'scratch/temp_pdfs/110_DRTE.pdf',
        'page': 5,
        'start_text': '17. 在水波槽實驗中',
        'end_text': '(E)',
    },
    {
        'id': 'drte-110-23',
        'pdf': 'scratch/temp_pdfs/110_DRTE.pdf',
        'page': 7,
        'start_text': '23. 在「狹縫干涉和繞射」',
        'end_text': '(E) 單狹縫的縫寬為',
    },
    {
        'id': 'drte-109-06',
        'pdf': 'scratch/temp_pdfs/109_DRTE.pdf',
        'page': 5,
        'start_text': '15. 長笛與單簧管為常見',
        'end_text': '(E) 3 / 2',
    },
    {
        'id': 'drte-109-14',
        'pdf': 'scratch/temp_pdfs/109_DRTE.pdf',
        'page': 5,
        'start_text': '14. 兩塊完全相同的直角三角形',
        'end_text': '(E) 3、6、9中的任一條',
    },
]

for t in targets:
    doc = fitz.open(t['pdf'])
    page = doc[t['page'] - 1]
    
    # search for start and end text
    r_start = page.search_for(t['start_text'].split()[0])
    r_end = page.search_for(t['end_text'].split()[0])
    
    print(f"\nTarget {t['id']}:")
    print(f"  Start search results ({t['start_text'][:15]}):", r_start)
    print(f"  End search results ({t['end_text'][:15]}):", r_end)
