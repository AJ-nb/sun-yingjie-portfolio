"""Create display derivatives; originals remain in the private source archive."""
from pathlib import Path
import json
import re
import sys
from PIL import Image

sys.stdout.reconfigure(encoding='utf-8')
ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / 'web/public'
THUMBS = PUBLIC / 'thumbnails'
THUMBS.mkdir(parents=True, exist_ok=True)
manifest = []
for doc in sorted((ROOT / 'web/src/content/works').glob('*.zh.md')):
    text = doc.read_text(encoding='utf-8-sig')
    match = re.search(r'^cover:\s*"?([^"\n\r]+)', text, re.M)
    if not match:
        raise ValueError(f'No cover: {doc}')
    source = PUBLIC / match[1].strip().lstrip('/')
    image = Image.open(source).convert('RGB')
    image.thumbnail((1100, 1100), Image.Resampling.LANCZOS)
    output = THUMBS / f'{doc.name[:-6]}.webp'
    image.save(output, 'WEBP', quality=87, method=6)
    manifest.append({'case': doc.name[:-6], 'cover': match[1].strip(), 'thumbnail': '/' + output.relative_to(PUBLIC).as_posix(), 'width': image.width, 'height': image.height, 'bytes': output.stat().st_size})

portrait = ROOT / 'avatar/references/user-generated/landscape.png'
if portrait.exists():
    (PUBLIC / 'avatar').mkdir(exist_ok=True)
    image = Image.open(portrait).convert('RGB')
    image.thumbnail((1800, 1200), Image.Resampling.LANCZOS)
    image.save(PUBLIC / 'avatar/portrait.webp', 'WEBP', quality=91, method=6)

(ROOT / 'private/sources/thumbnail-manifest.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding='utf-8')
print(json.dumps({'thumbnails': len(manifest), 'thumbnailBytes': sum(item['bytes'] for item in manifest)}, ensure_ascii=False))
