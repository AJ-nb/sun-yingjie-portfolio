#target photoshop
// Native Photoshop JSX entry point; source documents are never saved.
// Conversion and JPEG export follow the installed Adobe Image Processor / Export Layers scripts.
var root='D:/OneDrive/桌面/文件/项目/sun-yingjie-portfolio/.sites-runtime/verified-url-checkout';
var output=root+'/.production-runtime/model-worksets/psd-native';
new Folder(output).create();
var log=new File(root+'/private/sources/refinement-v2/photoshop-native-log.txt');
log.encoding='UTF8';log.open('w');
function note(s){log.writeln(new Date().toUTCString()+' '+s);log.close();log.open('a');}
function json(v){
  if(v===null)return 'null';
  if(typeof v==='string')return '"'+v.replace(/\\/g,'\\\\').replace(/"/g,'\\"').replace(/\r/g,'\\r').replace(/\n/g,'\\n').replace(/\t/g,'\\t')+'"';
  if(typeof v==='number'||typeof v==='boolean')return String(v);
  var r=[],i;if(v instanceof Array){for(i=0;i<v.length;i++)r.push(json(v[i]));return '['+r.join(',')+']';}
  for(i in v)if(v.hasOwnProperty(i))r.push(json(i)+':'+json(v[i]));return '{'+r.join(',')+'}';
}
function write(name,data){var f=new File(root+'/private/sources/refinement-v2/'+name);f.encoding='UTF8';f.open('w');f.write(json(data));f.close();}
function layers(owner,parent,result){
 for(var i=0;i<owner.layers.length;i++){
  var l=owner.layers[i],path=parent.concat([i]),b=[],t='';
  try{for(var j=0;j<4;j++)b.push(l.bounds[j].as('px'));}catch(e){}
  try{if(l.kind===LayerKind.TEXT)t=l.textItem.contents;}catch(e){}
  result.push({path:path,name:l.name,typename:l.typename,visible:l.visible,bounds:b,text:t});
  if(l.typename==='LayerSet')layers(l,path,result);
 }
}
var files=[['lingmu','D:/OneDrive/桌面/文件/作品集/发/发/无臂人士便捷洗浴用品.psd'],['jimu','D:/OneDrive/桌面/文件/作品集/发/发/玉米芯板材模块化家具.psd']];
var oldDialogs=app.displayDialogs;app.displayDialogs=DialogModes.NO;
try{
 for(var f=0;f<files.length;f++){
  note('OPEN '+files[f][0]);
  var doc=app.open(new File(files[f][1]));
  var records=[];layers(doc,[],records);
  write(files[f][0]+'-photoshop-layers.json',{source:files[f][1],photoshopVersion:app.version,name:doc.name,width:doc.width.as('px'),height:doc.height.as('px'),mode:String(doc.mode),profile:doc.colorProfileName,layerCount:records.length,layers:records});
  note('LAYERS '+files[f][0]+' '+records.length);
  var flat=doc.duplicate(files[f][0]+'-native-srgb',true);
  flat.flatten();
  flat.convertProfile('sRGB IEC61966-2.1',Intent.RELATIVECOLORIMETRIC,true,true);
  var opts=new JPEGSaveOptions();opts.quality=12;opts.embedColorProfile=true;
  flat.saveAs(new File(output+'/'+files[f][0]+'-native-srgb.jpg'),opts,true,Extension.LOWERCASE);
  flat.close(SaveOptions.DONOTSAVECHANGES);
  doc.close(SaveOptions.DONOTSAVECHANGES);
  note('DONE '+files[f][0]);
 }
}catch(e){note('ERROR '+String(e)+' LINE '+e.line);}finally{app.displayDialogs=oldDialogs;log.close();}
