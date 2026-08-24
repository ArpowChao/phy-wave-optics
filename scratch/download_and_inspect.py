import os
import urllib3
import requests
import fitz # PyMuPDF

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

os.makedirs('scratch/temp_pdfs', exist_ok=True)

pdf_urls = {
    '113_AST': 'https://www.ceec.edu.tw/files/file_pool/1/0o221353890776620070/113%e5%88%86%e7%a7%91%e6%b8%ac%e9%a9%97%e7%89%a9%e7%90%86%e8%a9%a6%e9%a1%8c.pdf',
    '112_AST': 'https://www.ceec.edu.tw/files/file_pool/1/0n214393840237822585/05-112%e5%88%86%e7%a7%91%e6%b8%ac%e9%a9%97%e7%89%a9%e7%90%86%e8%80%83%e7%a7%91%e8%a9%a6%e9%a1%8c.pdf',
    '111_AST': 'https://www.ceec.edu.tw/files/file_pool/1/0m223498466755949741/05-111%e5%88%86%e7%a7%91%e6%b8%ac%e9%a9%97%e7%89%a9%e7%90%86%e8%a9%a6%e5%8d%b7%e5%ae%9a%e7%a8%bf.pdf',
    '110_DRTE': 'https://www.ceec.edu.tw/files/file_pool/1/0l251613285357490464/08-110%e6%8c%87%e8%80%83%e7%89%a9%e7%90%86%e7%a7%91%e8%a9%a6%e5%8d%b7%e5%ae%9a%e7%a8%bf%20.pdf',
    '109_DRTE': 'https://www.ceec.edu.tw/files/file_pool/1/0k220535511712162219/08-109%e6%8c%87%e8%80%83%e7%89%a9%e7%90%86%e7%a7%91-%e5%ae%9a%e7%a8%bf.pdf',
}

session = requests.Session()
session.headers.update({'User-Agent': 'Mozilla/5.0'})

for name, url in pdf_urls.items():
    dest = f"scratch/temp_pdfs/{name}.pdf"
    if not os.path.exists(dest):
        print(f"Downloading {name}...")
        r = session.get(url, verify=False, timeout=30)
        with open(dest, 'wb') as f:
            f.write(r.content)
        print(f"  Saved {dest} ({len(r.content)} bytes)")
    else:
        print(f"Already downloaded: {dest}")

    # Inspect PDF with PyMuPDF
    doc = fitz.open(dest)
    print(f"=== {name}: {len(doc)} pages ===")
    for p_no, page in enumerate(doc):
        text = page.get_text()
        first_line = text.split('\n')[0] if text else ''
        print(f"  Page {p_no + 1}: length {len(text)}, first line: {first_line[:40]}")
