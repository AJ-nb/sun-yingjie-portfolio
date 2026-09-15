"""Read the supplied scene through the installed Cinema 4D Python application."""
from pathlib import Path
import c4d, json, time, traceback

ROOT=Path(__file__).resolve().parents[2]
OUT=ROOT/'private/sources/refinement-v2/plumber-c4d-inspection.json'
worksets=json.loads((ROOT/'private/sources/refinement-v2/model-extraction-manifest.json').read_text(encoding='utf-8'))
entry=next(x for x in worksets if x['slug']=='plumber')
scene=ROOT/next(x['extractedPath'] for x in entry['files'] if x['extractedPath'].endswith('/render.c4d'))
report={'engine':'Cinema 4D c4dpy','version':c4d.GetC4DVersion(),'source':str(scene),'method':'documents.LoadDocument with object and material flags; dialogs disabled for asset inspection','loaded':False,'newRender':False,'sourceSaved':False,'stages':[]}
def stage(name):
    report['stages'].append({'stage':name,'unixTime':time.time()})
    OUT.write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
    print(name,flush=True)
doc=None
try:
    stage('starting-native-load')
    doc=c4d.documents.LoadDocument(str(scene),c4d.SCENEFILTER_OBJECTS|c4d.SCENEFILTER_MATERIALS,None)
    if doc is None:raise RuntimeError('Cinema 4D returned no document')
    report['loaded']=True;stage('native-load-complete')
    nodes=[]
    def walk(node,depth=0):
        while node:
            item={'name':node.GetName(),'typeId':node.GetType(),'typeName':node.GetTypeName(),'depth':depth}
            if isinstance(node,c4d.PolygonObject):item.update(points=node.GetPointCount(),polygons=node.GetPolygonCount())
            nodes.append(item)
            if node.GetDown():walk(node.GetDown(),depth+1)
            node=node.GetNext()
    walk(doc.GetFirstObject())
    report['objects']=nodes
    report['objectCount']=len(nodes)
    report['polygonObjectCount']=sum('polygons' in n for n in nodes)
    report['pointCount']=sum(n.get('points',0) for n in nodes)
    report['polygonCount']=sum(n.get('polygons',0) for n in nodes)
    report['materials']=[{'name':m.GetName(),'typeId':m.GetType(),'typeName':m.GetTypeName()} for m in doc.GetMaterials()]
    stage('geometry-and-material-inventory-complete')
    assets=[]
    report['assetCollectionResult']=c4d.documents.GetAllAssetsNew(doc,False,'',c4d.ASSETDATA_FLAG_NONE,assets)
    report['assets']=[{k:(v.GetName() if k=='owner' and hasattr(v,'GetName') else v if isinstance(v,(str,int,float,bool,type(None))) else str(v)) for k,v in a.items()} for a in assets]
    report['missingAssets']=[a for a in report['assets'] if a.get('exists') is False]
    report['limitations']='Native hierarchy and dependency inspection only. No dynamics, engineering, manufacturability or renderer-output equivalence claimed.'
    stage('asset-inspection-complete')
except Exception as exc:
    report['error']=str(exc);report['traceback']=traceback.format_exc();stage('failed')
finally:
    if doc is not None:c4d.documents.KillDocument(doc)
    stage('closed-without-saving')
