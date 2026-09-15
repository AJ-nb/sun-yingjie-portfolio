#target photoshop
var root='D:/OneDrive/桌面/文件/项目/sun-yingjie-portfolio/.sites-runtime/verified-url-checkout';
var output=root+'/.production-runtime/model-worksets/psd-native';
var log=new File(root+'/private/sources/refinement-v2/photoshop-groups-log.txt');log.encoding='UTF8';log.open('w');
function note(s){log.writeln(new Date().toUTCString()+' '+s);log.close();log.open('a');}
function esc(s){return String(s).replace(/\\/g,'\\\\').replace(/"/g,'\\"').replace(/\r/g,'\\r').replace(/\n/g,'\\n').replace(/\t/g,'\\t');}
function groupExport(doc,slug,index,name){
 for(var j=0;j<doc.layers.length;j++)doc.layers[j].visible=(j===index||doc.layers[j].name==='背景');
 var flat=doc.duplicate(slug+'-'+name,true);flat.flatten();
 flat.convertProfile('sRGB IEC61966-2.1',Intent.RELATIVECOLORIMETRIC,true,true);
 var opts=new JPEGSaveOptions();opts.quality=12;opts.embedColorProfile=true;
 var filename=slug+'-group-'+('0'+index).slice(-2)+'.jpg';
 flat.saveAs(new File(output+'/'+filename),opts,true,Extension.LOWERCASE);flat.close(SaveOptions.DONOTSAVECHANGES);
 note('EXPORTED '+filename+' '+name);return '{"index":'+index+',"name":"'+esc(name)+'","file":"'+filename+'"}';
}
function isolatedExport(doc,slug,path,filename){
 var owner=doc;
 for(var depth=0;depth<path.length;depth++){
  for(var j=0;j<owner.layers.length;j++)owner.layers[j].visible=(j===path[depth]);
  owner=owner.layers[path[depth]];
 }
 var name=owner.name,b=owner.bounds;
 var l=Math.max(0,b[0].as('px')),t=Math.max(0,b[1].as('px')),r=Math.min(doc.width.as('px'),b[2].as('px')),bottom=Math.min(doc.height.as('px'),b[3].as('px'));
 var flat=doc.duplicate(slug+'-'+filename,true);
 flat.crop([UnitValue(l,'px'),UnitValue(t,'px'),UnitValue(r,'px'),UnitValue(bottom,'px')]);flat.flatten();
 flat.convertProfile('sRGB IEC61966-2.1',Intent.RELATIVECOLORIMETRIC,true,true);
 var opts=new JPEGSaveOptions();opts.quality=12;opts.embedColorProfile=true;
 flat.saveAs(new File(output+'/'+slug+'-'+filename+'.jpg'),opts,true,Extension.LOWERCASE);flat.close(SaveOptions.DONOTSAVECHANGES);
 note('ISOLATED '+slug+'-'+filename+' '+name);
 return '{"path":['+path.join(',')+'],"name":"'+esc(name)+'","file":"'+slug+'-'+filename+'.jpg","crop":['+[l,t,r,bottom].join(',')+']}';
}
var oldDialogs=app.displayDialogs;app.displayDialogs=DialogModes.NO;
var files=[['lingmu','D:/OneDrive/桌面/文件/作品集/发/发/无臂人士便捷洗浴用品.psd'],['jimu','D:/OneDrive/桌面/文件/作品集/发/发/玉米芯板材模块化家具.psd']];
try{
 for(var f=0;f<files.length;f++){
  app.purge(PurgeTarget.ALLCACHES);
  note('OPEN '+files[f][0]);var doc=app.open(new File(files[f][1]));var rows=[];
  // Export the native top-level boards before isolated layers change child visibility.
  for(var i=0;i<doc.layers.length;i++)if(doc.layers[i].typename==='LayerSet'){rows.push(groupExport(doc,files[f][0],i,doc.layers[i].name));app.purge(PurgeTarget.ALLCACHES);}
  var isolates=[];
  if(files[f][0]==='lingmu'){
   isolates.push(isolatedExport(doc,'lingmu',[6,8],'head-module'));
   isolates.push(isolatedExport(doc,'lingmu',[6,44],'body-module'));
   isolates.push(isolatedExport(doc,'lingmu',[5,2,0,47],'front-view'));
  }else{
   isolates.push(isolatedExport(doc,'jimu',[4,21],'materials-exploded'));
   isolates.push(isolatedExport(doc,'jimu',[4,25],'product-arrangement'));
   isolates.push(isolatedExport(doc,'jimu',[4,26],'dimension-view'));
   isolates.push(isolatedExport(doc,'jimu',[4,36],'cabinet-detail'));
  }
  var mf=new File(root+'/private/sources/refinement-v2/'+files[f][0]+'-photoshop-exports.json');mf.encoding='UTF8';mf.open('w');mf.write('{"source":"'+esc(files[f][1])+'","engine":"Adobe Photoshop '+app.version+'","profile":"sRGB IEC61966-2.1","groups":['+rows.join(',')+'],"isolatedLayers":['+isolates.join(',')+']}');mf.close();
  doc.close(SaveOptions.DONOTSAVECHANGES);app.purge(PurgeTarget.ALLCACHES);note('DONE '+files[f][0]);
 }
}catch(e){note('ERROR '+String(e)+' LINE '+e.line);}finally{app.displayDialogs=oldDialogs;log.close();}
