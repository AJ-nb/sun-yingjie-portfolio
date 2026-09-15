"""Rebuild the self-hosted Chinese font subset from current public copy.

Requires fonttools[woff] (fonttools + brotli). The OFL font source is installed
by npm ci in web/. Keep the full OFL notice in web/public/licenses/.
"""
from pathlib import Path
from fontTools import subset

ROOT = Path(__file__).resolve().parents[1]
source = ROOT / 'web/src'
text = ''.join(path.read_text(encoding='utf-8') for path in source.rglob('*')
               if path.suffix in {'.tsx', '.ts', '.md', '.json'})
text += ''.join(chr(code) for code in range(32, 127))
target = source / 'assets'
target.mkdir(exist_ok=True)
for weight in (400, 600):
    path = ROOT / f'web/node_modules/@fontsource/noto-sans-sc/files/noto-sans-sc-chinese-simplified-{weight}-normal.woff2'
    options = subset.Options()
    options.flavor = 'woff2'
    font = subset.load_font(str(path), options)
    sub = subset.Subsetter(options=options)
    sub.populate(text=text)
    sub.subset(font)
    output = target / f'portfolio-sans-{weight}.woff2'
    subset.save_font(font, str(output), options)
    print(f'{output.name}: {output.stat().st_size:,} bytes')
