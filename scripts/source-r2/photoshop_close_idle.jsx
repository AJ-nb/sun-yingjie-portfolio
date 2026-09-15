#target photoshop
if(app.documents.length===0){
 app.purge(PurgeTarget.ALLCACHES);
 executeAction(charIDToTypeID('quit'),undefined,DialogModes.NO);
}
