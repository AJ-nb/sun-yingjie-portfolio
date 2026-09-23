"""Measured bilingual download metadata, including localized cover previews."""
import hashlib,json
from pathlib import Path
from datetime import datetime,timezone
from pypdf import PdfReader
ROOT=Path(__file__).resolve().parents[1];PUBLIC=ROOT/'web/public'
def main():
    items=[];labels={'overview':('总览','Overview'),'brand':('品牌视觉','Visual systems'),'physical':('实体产品','Physical products'),'digital':('数字体验','Digital experience')}
    def add(stem,key,variant,kind,ext,lang,label):
        suffix='' if lang=='zh' else '-en';name=stem+suffix+'.'+ext;p=PUBLIC/'downloads'/name
        reader=PdfReader(p.with_suffix('.pdf'))
        preview='/media/v9/downloads/'+stem+suffix+'.webp'
        items.append({'id':key+'-'+lang+'-'+ext,'variant':variant,'type':kind,'format':ext,'lang':lang,'label':label,'path':'/downloads/'+name,'preview':preview,'pages':len(reader.pages),'bytes':p.stat().st_size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()})
    for lang in ['zh','en']:
        for variant,(zh,en) in labels.items():
            suffix='' if variant=='overview' else '-'+variant
            for ext in ['pdf','docx']:add('sun-yingjie-resume'+suffix,'resume-'+variant,variant,'resume',ext,lang,{'zh':zh+'简历','en':en+' résumé'})
            stem='sun-yingjie-selected-portfolio' if variant=='overview' else 'sun-yingjie-portfolio-'+variant
            add(stem,'portfolio-'+variant,variant,'portfolio','pdf',lang,{'zh':zh+'精选作品集','en':en+' selected portfolio'})
        add('sun-yingjie-full-portfolio','full','overview','portfolio','pdf',lang,{'zh':'完整作品档案','en':'Complete project archive'})
    result={'edition':'v9','updatedAt':datetime.now(timezone.utc).isoformat(),'items':items}
    text=json.dumps(result,ensure_ascii=False,indent=2)+'\n'
    (ROOT/'web/src/data/downloads.json').write_text(text,encoding='utf-8');(PUBLIC/'downloads/manifest.json').write_text(text,encoding='utf-8')
    print(f'{len(items)} downloads: 18 PDFs and 8 editable DOCX files')
if __name__=='__main__':main()
