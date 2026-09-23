"""Preserve the installed OFL font outlines while converting WOFF to PDF-ready TTF."""
from pathlib import Path
from fontTools.ttLib import TTFont

root=Path(__file__).resolve().parents[1]
out=root/'web/public/fonts/documents';out.mkdir(parents=True,exist_ok=True)
for family,weight,dest in [('dm-sans',400,'DM-Sans-Regular'),('dm-sans',600,'DM-Sans-SemiBold'),('epilogue',500,'Epilogue-Medium')]:
    source=root/f'web/node_modules/@fontsource/{family}/files/{family}-latin-{weight}-normal.woff'
    font=TTFont(source);font.flavor=None;font.save(out/(dest+'.ttf'))
print('Converted three installed OFL fonts; outlines unchanged.')
