const sharp = require('C:/Users/LENOVO/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const fs = require('node:fs/promises');
(async()=>{
  let svg=await fs.readFile(process.argv[2],'utf8');
  const embeds=[...new Set(svg.match(/data:image\/webp;base64,[A-Za-z0-9+/=]+/g)||[])];
  for(const uri of embeds){
    const png=await sharp(Buffer.from(uri.split(',')[1],'base64')).png().toBuffer();
    svg=svg.replaceAll(uri,'data:image/png;base64,'+png.toString('base64'));
  }
  await sharp(Buffer.from(svg), { density: 144 }).resize({ width: 2200, height: 1800, fit: 'inside' }).png().toFile(process.argv[3]);
})().catch(e=>{process.stderr.write(String(e));process.exit(1)});
