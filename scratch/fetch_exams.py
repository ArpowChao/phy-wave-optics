import re
import urllib.parse
import urllib3
import requests

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
session = requests.Session()
session.headers.update({'User-Agent': 'Mozilla/5.0'})

url = "https://www.ceec.edu.tw/xmfile?xsmsid=0J052427633128416650&page=7"
r = session.get(url, verify=False, timeout=15)
rows = re.findall(r'<tr[\s\S]*?</tr>', r.text)
for row in rows:
    clean = re.sub(r'<[^>]+>', ' ', row).strip()
    clean = ' '.join(clean.split())
    if '109' in clean and '物理' in clean and '補考' not in clean:
        print("Row:", clean)
        pdfs = re.findall(r'href="([^"]+\.pdf)"', row)
        for p in pdfs:
            print("  PDF:", urllib.parse.unquote(p))
            print("  Full URL:", urllib.parse.urljoin("https://www.ceec.edu.tw", p))
