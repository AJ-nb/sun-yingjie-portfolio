"""Authored translations for publication pages; source artwork is unchanged."""
import json,re
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1];DATA=ROOT/'web/src/data'
p=DATA/'publication-pages.json';m=json.loads(p.read_text(encoding='utf-8'))
copy={
'karimoku':[
 ('foundation','Brand foundations','Woodcraft, furniture and everyday life frame this retrospective design study. The material does not establish an official commission.'),
 ('material','A material system','Wood, surface, joints and edges organise the material language. Species, finishes and durability require samples and engineering validation.'),
 ('space','Void and layers','Spacing, layers, movement and light connect objects with their photographic representation. These images are design studies.')],
'hermes':[
 ('summer','Summer: props connect the merchandise','Fishing rods, hands and folding chairs create a viewing path. Compare product position, prop scale and background contrast so the narrative keeps merchandise legible.'),
 ('autumn','Autumn: familiar frames, unfamiliar scale','Doors, windows and walls establish spatial references. Oversized animals disrupt those references while framing and suspension separate merchandise from large props.'),
 ('winter','Winter: different rhythms for different windows','Wide windows connect products across snow planes. Tall windows build a vertical hierarchy around the horse. Each format requires a new composition.'),
 ('delivery','From visual direction to spatial relationships','My contribution was 3D design and visual presentation within BENWU. The retrospective diagram compares composition and merchandise hierarchy; individual production and store-delivery responsibility is not established.')],
'arcteryx':[
 ('layers','Terrain, body and equipment','A rock face anchors the background, layered contours form the middle ground and a mannequin establishes human scale. Their boundaries and overlap help equipment remain readable.'),
 ('coordination','Communicate spatial relationships','Compare the rock face, curves and equipment as distinct layers. Window format, lighting and product visibility guide the spatial reading.'),
 ('installation','The window in its retail context','Additional installation views connect the window with the interior. Rock, directional lines, mannequins and moss surfaces extend the mountain language around clothing and circulation.')],
'biyuan':[
 ('home','Understand the service, then take action','The VI/UI connects brand expression with service entry points. The homepage introduces the offer before presenting the main action.'),
 ('models','Support browsing and deliberate search','Model lists and name search support two different tasks. Hierarchy helps users identify a model, understand its entry point and continue.'),
 ('mobile','Preserve the main action on mobile','I designed and iterated the VI/UI. The mobile study rearranges content by priority, checking text, actions and scrolling. This archive does not establish ownership of the deployed service.'),
 ('interface','One identity across desktop and mobile','Desktop and mobile views share naming and brand rules. The smaller screen rearranges information around the primary action.')],
'periastra':[
 ('exploration','Build the system around recognition','Compare the photography-equipment context, name recognition and small-scale legibility. The wordmark anchors the visual and information system.'),
 ('wordmark','Compare the wordmark at different scales','The PERIASTRA wordmark study, dated 9 June 2026, supports comparison of letterforms, hierarchy, application scale and production direction.')],
'yelisi':[
 ('identity','From historical exploration to a private seal','The earlier Songnasty exploration and current YELISI mark show a shift in identity language. Seal, folded line and cut-corner forms connect naming, graphics and product context.'),
 ('product','Connect identity, products and CMF','Collaborative brand and product-concept work shares a material direction. The archive supports comparison of form and surface; no manufacture or market launch is claimed.')],
'lighting':[
 ('family','A shared section across different uses','Table and floor lights share a linear body, luminous strips and distinctive ends. Support, length and direction change around the use scenario.'),
 ('materials','Separate material and functional cues','Metal channels, luminous surfaces and circular controls explain different roles. Renderings support comparison of reflection and proportion; optical performance requires testing.'),
 ('space','Check the object against the room','Wall recesses and long tables provide scale references. Scenes help compare length, mounting and visual centre in an actual use context.')],
'huhu-care':[
 ('study','Turn a child’s use into form constraints','Sketches and physical models explore grip, mouthpiece position and approachability. Clinical performance and manufacture remain outside the validated scope.'),
 ('parts','Separate contact, grip and charging','Mouth contact, handheld volume and charging base have different requirements. Their separation makes the relationship between position and action available for review.'),
 ('system','Connect the product and its feedback','The device and base form a use unit. Interface feedback addresses children, carers and clinicians. Models and renderings document the concept stage.')],
'go-glow':[
 ('journey','From travel preparation to maintenance','Carrying, changing modules, cleaning and storage create different tasks. The journey gives the product system concrete design criteria.'),
 ('modules','Organise the system around use','The handle, replaceable modules and supporting information respond to carrying, switching, cleaning and storage. The diagram analyses original concept evidence.'),
 ('interface','Connect the object and its instructions','The companion interface organises care guidance and module recognition. Naming, colour and hierarchy remain consistent across the product and instructions.')],
'plumber':[
 ('service','Define the roles before the equipment','The service blueprint separates public participation, professional operation and equipment maintenance. Permissions and information flows frame the scanning, transport and return tasks.'),
 ('assembly','Explain the robot through its parts','Overall and exploded views connect the body, actuators and tail. This concept does not establish sealing, power or pipe-traversal performance.'),
 ('workflow','Connect equipment and interface','The station, device and control interface support parking, execution and monitoring. Their relationship makes it possible to review entry, feedback and recovery.')],
'resume-formatter':[
 ('review','Make automated rewriting reviewable','Before-and-after differences let the user choose which changes to keep. Confirmation and undo preserve control over the text.'),
 ('versions','Give the master and variants distinct roles','The master retains stable facts; role-specific versions choose emphasis. Evidence links keep wording close to its supporting record.'),
 ('layout','Make layout changes visible and reversible','Templates change presentation rather than silently changing facts. This tool builds on an MIT upstream fork; this portfolio’s independent Word-export pipeline is not a feature claim about that editor.')],
'formline':[
 ('desktop','Keep spatial input and feedback together','Objects, parameters and views share one editor. Drawing, selection and constraints help users understand the next action.'),
 ('mobile','Preserve the spatial task on a small screen','Mobile reallocates attention between tools and canvas. X-Ray exposes internal relationships while retaining an explicit way back.')],
'xintiao':[
 ('onboarding','Make the income model understandable','A clear first-run configuration connects home-screen values to user inputs. Native WeChat developer-tool captures document this interface.'),
 ('detail','Let users inspect the number','The detail view explains a result; the calendar handles days without records. Empty states are part of the workflow.'),
 ('settings','Let users control appearance and motion','Themes and motion controls accommodate preferences. The native mini-program reuses PayDance’s AGPL-3.0-only calculation core, credited separately from interface work.')],
'lensflow':[
 ('guide','Establish input context before the task','Guidance and sample material provide a starting point. Material, task and result share a workspace that supports stepwise progress and recovery.'),
 ('analysis','Reuse structured material analysis','Structured output helps analysis feed later tasks. This public demonstration uses precomputed results and does not claim live model inference.')],
'ai-video-systems':[
 ('control','A controllable creative workflow','A film-language reference, a new story and two character inputs become a storyboard, Blender blocking, controlled imagery and prompts, then a Seedance 2.5 render. The 11 storyboard units and 20+ characters are my process-log counts.'),
 ('evaluation','Review relationships, then revise the right layer','Check identity, action, camera motivation, spatial continuity and the ending. Independently adapted with reference to LearnPrompt’s Awesome Seedance and the credited article. The supplied 22.08-second film is a process record, not a general performance benchmark.')]
}
# Add the approved merged interface page and the two AI research spreads.
if not any(x['id']=='interface' for x in m['casePages']['biyuan']):
 m['casePages']['biyuan'].append({'id':'interface','title':'同一识别 桌面与移动','body':'桌面与移动端共享品牌和命名规则，小屏幕围绕主要行动重排信息。','images':[m['casePages']['biyuan'][0]['images'][0],m['casePages']['biyuan'][2]['images'][0]]})
m['casePages']['ai-video-systems']=[
 {'id':'control','title':'让创作过程可以控制','body':'电影运镜参考、新剧情与两张角色输入，经过分镜、Blender 白模、视觉输入和提示词，进入 Seedance 2.5 渲染。11 个分镜单元和 20 余个角色为本人过程记录。','images':[{'src':'/works/ai-video-systems/workflow-map.svg','caption':'从参考、分镜和白模到生成与评审的自绘工作流'},{'src':'/works/ai-video-systems/ai-video-systems-blocking.webp','caption':'作者视频中的 Blender 白模画面'}]},
 {'id':'evaluation','title':'检查关系 再修改对应层','body':'逐项检查角色、动作、镜头动机、空间连续性与结束状态。独立改编的工作流参考 LearnPrompt 的 Awesome Seedance 与署名文章；22.08 秒成片是过程记录，不是通用性能基准。','images':[{'src':'/works/ai-video-systems/control-layers.svg','caption':'自绘六层控制模型'},{'src':'/works/ai-video-systems/ai-video-systems-cover.webp','caption':'作者提供的 22.08 秒视频封面；完整视频见网页'}]}]
translations={}
for slug,rows in copy.items():
 translations[slug]={id:{'title':title,'body':body} for id,title,body in rows}
 # Obtain the English captions from the English case, keyed by original path.
 raw=(ROOT/f'web/src/content/works/{slug}.en.md').read_text(encoding='utf-8-sig')
 alts={src:alt for alt,src in re.findall(r'!\[([^\]]*)\]\(([^\s)]+)\)',raw)}
 for spec in m['casePages'][slug]:
  en=translations[slug][spec['id']]
  en['captions']=[alts.get(pic['src'],en['title']) for pic in spec['images']]
 # Original-language board text remains evidence, with English captions.
 for pic in m['archiveImages'].get(slug,[]):pic['captionEn']=alts.get(pic['src'],next(iter(translations[slug].values()))['title'])
for spec in m['casePages']['ai-video-systems']:
 for pic in spec['images']:
  if not any(x['src']==pic['src'] for x in m['archiveImages'].get('ai-video-systems',[])):
   m['archiveImages'].setdefault('ai-video-systems',[]).append(pic)
p.write_text(json.dumps(m,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
(DATA/'publication-locales.json').write_text(json.dumps(translations,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print('Added bilingual publication copy and AI-video/merged-interface pages.')
