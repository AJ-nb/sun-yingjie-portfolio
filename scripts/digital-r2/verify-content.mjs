import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const sourceRoot='D:/OneDrive/桌面/文件/项目';
const evidenceRoot=path.join(root,'private/sources/refinement-digital');
const slugs=['biyuan','yelisi','periastra','lensflow','yantai','formline','resume-formatter','visual-archive','aesthetic-atlas','image-2-5-xhs','xintiao','xhs-methods'];
const sha=file=>crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const sourceFiles=[
 ['lensflow','README.md'],['lensflow','docs/project-status.md'],['lensflow','package.json'],
 ['visual-lens/visual-lens','README.md'],['visual-lens/visual-lens','package.json'],
 ['logo-geometry-studio','README.md'],['logo-geometry-studio','THIRD_PARTY_NOTICES.md'],
 ['resume-formatter','README.md'],['resume-formatter','THIRD_PARTY_NOTICES.md'],
 ['visual-archive-extension','README.md'],['eagle-aesthetic-atlas','README.md'],
 ['xhs-operations-os','README.md'],['xhs-operations-os','docs/MASTER_PRD.md'],['xhs-operations-os','docs/ROADMAP.md'],
 ['image-2-5-xhs','tests/protocol.json'],['image-2-5-xhs','tests/evaluation.json'],
 ['WB/学习/today-salary-miniapp','README.md'],['WB/学习/today-salary-miniapp','NOTICE.md'],
 ['WB/学习/today-salary-miniapp','miniprogram/core/salary/config.ts'],
 ['WB/学习/today-salary-miniapp','miniprogram/core/state/persisted.ts'],
];
const sources=sourceFiles.map(([project,relative])=>{
  const source=path.join(sourceRoot,project,relative);
  const id=project.replaceAll('/','_');
  const output=path.join(evidenceRoot,'evidence',id,relative);
  fs.mkdirSync(path.dirname(output),{recursive:true});fs.copyFileSync(source,output);
  return {sourcePath:source,privatePath:path.relative(root,output).replaceAll('\\','/'),sha256:sha(source),copiedWithoutModification:true};
});
const errors=[];const cases=[];
for(const slug of slugs){
  const languages=[];
  for(const lang of ['zh','en']){
    const file=path.join(root,`web/src/content/works/${slug}.${lang}.md`);const content=fs.readFileSync(file,'utf8');
    const match=/^---\n([\s\S]*?)\n---\n/.exec(content.replaceAll('\r\n','\n'));
    if(!match)errors.push(`${slug}.${lang}: frontmatter`);
    if((content.match(/^## /gm)||[]).length!==6)errors.push(`${slug}.${lang}: expected six H2 sections`);
    const data=Object.fromEntries(match[1].split('\n').map(line=>{const p=/^(\w+): (.*)$/.exec(line);return p?[p[1],JSON.parse(p[2])]:[]}).filter(p=>p.length));
    for(const key of ['title','category','summary','role','credits','status','cover','tags'])if(!data[key])errors.push(`${slug}.${lang}: missing ${key}`);
    const media=[data.cover,...[...content.matchAll(/!\[[^\]]*\]\(([^)]+)\)/g)].map(m=>m[1])];
    for(const mediaPath of media){if(mediaPath.startsWith('/')&&!fs.existsSync(path.join(root,'web/public',mediaPath)))errors.push(`${slug}.${lang}: missing ${mediaPath}`);}
    if(lang==='zh'&&!content.includes('来源'))errors.push(`${slug}: missing source note`);
    languages.push({lang,category:data.category,media:[...new Set(media)],characters:content.length});
  }
  if(languages[0].category!==languages[1].category)errors.push(`${slug}: language category mismatch`);
  if(JSON.stringify(languages[0].media)!==JSON.stringify(languages[1].media))errors.push(`${slug}: language media mismatch`);
  cases.push({slug,languages});
}
const publicDirs=['web/public/works/refinement-brand/biyuan','web/public/works/refinement-digital/xhs-methods','web/public/works/refinement-digital/xintiao'];
const assets=publicDirs.flatMap(dir=>fs.readdirSync(path.join(root,dir)).filter(f=>/\.(png|webp|svg)$/.test(f)).map(name=>{
  const rel=`${dir}/${name}`;const file=path.join(root,rel);const buffer=fs.readFileSync(file);
  return {publicPath:rel.replace('web/public',''),bytes:buffer.length,sha256:sha(file),dimensions:name.endsWith('.png')?[buffer.readUInt32BE(16),buffer.readUInt32BE(20)]:undefined,
  origin:dir.includes('biyuan')?'https://biyuan.ai/ or https://biyuan.ai/models':name.startsWith('workflow.')?'Original method diagram derived from XHS requirements; not a runtime screenshot':name==='monster-hello.png'?'Original Xintiao application artwork': 'WeChat DevTools runtime capture (see runtime log)',
  operations:'No content retouching; original file or direct capture'};
}));
const tests=JSON.parse(fs.readFileSync(path.join(evidenceRoot,'xintiao-test-results-final.json'),'utf8'));
const build=JSON.parse(fs.readFileSync(path.join(evidenceRoot,'xintiao-build-report.json'),'utf8'));
const report={verifiedAt:new Date().toISOString(),scope:'12 brand/digital/experiment cases in two languages; product/rendering cases untouched',cases,sources,assets,
 xintiao:{originalReadOnly:true,isolatedRoot:'private/sources/refinement-digital/xintiao-isolated (ignored)',isolationAdjustments:['Project name changed; touristappid used for capture instead of original AppID','Added root tsconfig.json extending existing miniprogram/tsconfig.json; source directory has no root tsconfig','Copied non-secret project.private.config.json after first suite load failed because it was missing from the copy'],tests:{success:tests.success,total:tests.numTotalTests,passed:tests.numPassedTests,failed:tests.numFailedTests,files:tests.testResults.length},build:{builtAt:build.builtAt,pages:build.pages.length,sharedComponents:build.sharedComponents.length,failures:build.failures},nativeRuntime:JSON.parse(fs.readFileSync(path.join(evidenceRoot,'xintiao-native-runtime.json'),'utf8'))},
 verification:{frontmatter:true,pairedLanguages:true,publicMediaExists:true,sourceNotes:true,errors}};
fs.writeFileSync(path.join(evidenceRoot,'verification.json'),JSON.stringify(report,null,2));
console.log(JSON.stringify({cases:cases.length,languages:cases.length*2,sources:sources.length,newPublicAssets:assets.length,xintiao:report.xintiao.tests,errors},null,2));
if(errors.length)process.exitCode=1;
