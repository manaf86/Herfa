import re
with open('/tmp/market.html', encoding='utf-8') as f:
    s = f.read()
labels = re.findall(r'aria-label="([^"]+)"', s)
target = ['الرسائل', 'طلباتي', 'الوضع', 'لوحة']
order = [l for l in labels if any(k in l for k in target)]
for i, l in enumerate(order[:6], 1):
    print(f'  {i}. {l}')
