from pathlib import Path
from datetime import datetime,timezone
import json
ROOT=Path(__file__).resolve().parents[2]
folder=ROOT/'private/sources/refinement-v2'
workset=next(x for x in json.loads((folder/'model-extraction-manifest.json').read_text(encoding='utf-8')) if x['slug']=='plumber')
scene=next(x for x in workset['files'] if x['extractedPath'].endswith('/render.c4d'))
textures=[x for x in workset['files'] if '/tex/' in x['extractedPath']]
report={
 'recordedAt':datetime.now(timezone.utc).isoformat(),
 'status':'blocked-before-script-execution',
 'application':'D:/c4d/c4dpy.exe',
 'fileProductVersion':'2026.0.0',
 'source':scene['extractedPath'],
 'sourceBytes':scene['bytes'],
 'script':'scripts/source-r2/c4d_inspect_plumber.py',
 'interface':'Installed official Cinema 4D Python interpreter; local API documentation consulted for LoadDocument, GetAllAssetsNew and KillDocument',
 'attempts':[
   {'method':'noninteractive process','result':'Interpreter showed license-method menu before executing script; input stream was closed; own idle process stopped without opening a document'},
   {'method':'interactive terminal process, option 1 Maxon App','observedOutput':'Please fix the license in the MaxonApp, press return to try again:','result':'Existing local license method did not permit execution. Script never reached its starting-native-load marker. Own process stopped without opening a document'}
 ],
 'nativeOpenVerified':False,'geometryInspectionPerformed':False,'textureResolutionVerified':False,
 'sourceSaved':False,'newRender':False,
 'extractedTextureFiles':textures,
 'textureFileInventoryOnly':'Files were selectively extracted and size-checked. Presence is not proof that the renderer resolves dependencies or that the scene loads.',
 'requiredNextStep':'Repair or configure a valid Cinema 4D license in Maxon App, then rerun the prepared read-only inspection script.',
 'limitations':'This failure does not establish that the scene itself is broken, nor that the workstation has no license. It establishes that this official c4dpy invocation could not proceed with the selected Maxon App method. Existing project renders are not evidence of a native-open check.'
}
(folder/'plumber-c4d-inspection.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
(folder/'plumber-c4d-license-transcript.txt').write_text('Observed terminal excerpts from native c4dpy 2026.0.0 attempts:\n\nEnter the license method:\n  1) Maxon App\n  2) Maxon Account\n  3) Maxon License Server\n  4) RLM\n  Q) Quit\nPlease select: 1\nPlease fix the license in the MaxonApp, press return to try again:\n\nThe model-inspection script did not start. No scene save or render occurred.\n',encoding='utf-8')
print(json.dumps({'status':report['status'],'nativeOpenVerified':False,'textureFilesPresent':len(textures)}))
