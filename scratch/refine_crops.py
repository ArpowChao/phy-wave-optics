import fitz

targets = [
    {
        'id': 'ast-113-02',
        'pdf': 'scratch/temp_pdfs/113_AST.pdf',
        'page': 2,
        'start_text': '2.',
        'end_text': '(E)',
    },
    {
        'id': 'ast-113-14',
        'pdf': 'scratch/temp_pdfs/113_AST.pdf',
        'page': 5,
        'start_text': '14.',
        'end_text': '(E)',
    },
    {
        'id': 'ast-112-11',
        'pdf': 'scratch/temp_pdfs/112_AST.pdf',
        'page': 4,
        'start_text': '11.',
        'end_text': '(E)',
    },
    {
        'id': 'ast-112-18',
        'pdf': 'scratch/temp_pdfs/112_AST.pdf',
        'page': 6,
        'start_text': '18.',
        'end_text': '(E)',
    },
    {
        'id': 'ast-111-16',
        'pdf': 'scratch/temp_pdfs/111_AST.pdf',
        'page': 5,
        'start_text': '16.',
        'end_text': '(E)',
    },
    {
        'id': 'ast-111-25',
        'pdf': 'scratch/temp_pdfs/111_AST.pdf',
        'page': 8,
        'start_text': '25.',
        'end_text': '(E)',
    },
    {
        'id': 'drte-110-17',
        'pdf': 'scratch/temp_pdfs/110_DRTE.pdf',
        'page': 5,
        'start_text': '17.',
        'end_text': '(E)',
    },
    {
        'id': 'drte-110-23',
        'pdf': 'scratch/temp_pdfs/110_DRTE.pdf',
        'page': 7,
        'start_text': '23.',
        'end_text': '(E)',
    },
    {
        'id': 'drte-109-06',
        'pdf': 'scratch/temp_pdfs/109_DRTE.pdf',
        'page': 5,
        'start_text': '15.',
        'end_text': '(E)',
    },
    {
        'id': 'drte-109-14',
        'pdf': 'scratch/temp_pdfs/109_DRTE.pdf',
        'page': 5,
        'start_text': '14.',
        'end_text': '(E)',
    },
]

for t in targets:
    doc = fitz.open(t['pdf'])
    page = doc[t['page'] - 1]
    blocks = page.get_text("blocks")
    print(f"\n==========================================")
    print(f"Target {t['id']} on Page {t['page']}")
    for b in blocks:
        # b: (x0, y0, x1, y1, text, block_no, block_type)
        txt = b[4].strip()
        print(f"  Block y: [{b[1]:.1f} - {b[3]:.1f}]: {txt[:60]}...")
