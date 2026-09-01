import re
for path, name in [('/tmp/home.html', 'marketing (/)'), ('/tmp/market.html', 'app (/marketplace)')]:
    with open(path, encoding='utf-8') as f:
        s = f.read()
    m = re.search(r'<header[^>]*>.*?</header>', s, flags=re.S)
    if not m:
        print(f'{name}: no header found')
        continue
    hdr = m.group(0)
    print(f'\n=== {name} ===')
    checks = ['sticky top-0', 'max-w-7xl', 'ابحث عن خدمة', 'الرسائل', 'طلباتي', 'MarketingCenter']
    for k in checks:
        print(f'  {k!r:22s}: ' + ('found' if k in hdr else '---'))
