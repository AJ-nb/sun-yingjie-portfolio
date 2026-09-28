---
title: "秋日单镜头时装片"
category: "experiments"
summary: "一支 30 秒 9:16 超写实秋日时装片，以固定 90° 顶视角和吊扇遮挡完成三次连续换装。"
role: "方向设定、单镜头规则、造型与材质约束、提示词组织、成片审阅"
credits: "孙英杰个人项目 · Codex 辅助内容结构 · Seedance 2.5 视频"
status: "成片与完整提示词"
cover: "/works/autumn-fashion-film/poster.webp"
tags: ["AI film", "Fashion film", "Continuous take", "Occlusion transition"]
---
## 项目概念与媒介特征

这是一支 30 秒、9:16 的超写实秋日时装影片。整片坚持 ONE CONTINUOUS SHOT：相机锁定在人物正上方的 90° 顶视角，镜头位置、角度、焦段和构图从第一帧到最后一帧不变。唯一的换装方式是真实木质吊扇叶片经过人物时形成完整前景遮挡，在遮挡窗口内完成衣服替换。

Seedance 2.5 生成视频；Codex 辅助提示词组织、内容结构和发布检查。我负责人物身份锁定、镜头规则、秋日场景与材质方向、四套造型的节奏选择、输出审阅与发布判断。

## 完整成片

30.045 秒 · 720 × 1280 · 24 fps · H.264/AAC 网页播放副本。页面默认使用兼容性更好的播放副本；[下载原始 HEVC/AAC 文件](/works/autumn-fashion-film/film-source.hevc.mp4)。

<video controls playsinline preload="metadata" poster="/works/autumn-fashion-film/poster.webp" src="/works/autumn-fashion-film/film.mp4"><track kind="captions" src="/works/autumn-fashion-film/visual.zh.vtt" srclang="zh" label="中文视觉说明"></track><track kind="captions" src="/works/autumn-fashion-film/visual.en.vtt" srclang="en" label="English visual description"></track></video>

## 固定相机、场景与角色锁定

固定 90° 顶视角把人物、胡桃木地板、秋色 Persian-inspired rug 和边缘家具组织成一张平面构图。吊扇位于相机和人物之间，三片深胡桃木叶片持续旋转并在地毯与人物身上形成同步的 moving blade shadow。角色为同一位成年韩国女性，面部骨骼、发型、肤色、身体比例与年龄保持一致；变化只发生在服装。

![秋日时装片关键帧：固定顶视角、秋色地毯与木质吊扇形成前景层](/works/autumn-fashion-film/frame-01.webp)

## 四套造型与三次遮挡换装

### 00:00–00:07｜Look 1

巧克力色罗纹背心、驼色麂皮 bomber、酒红百褶短裙、espresso 色连裤袜、烟草棕 slouch boots、酒红肩包、金色耳环与龟纹太阳镜建立第一套秋日编辑造型。人物躺在地毯上，遥控器动作克制，直视顶上相机。

### 00:07–00:14｜Look 1 → Look 2

第一次完整遮挡发生在约 07 秒：宽木质扇叶扫过躯干和腰部，遮住主要服装区域后继续离开；脸、身体中心和光线方向保持连续，Look 2 在遮挡后自然出现。

### 00:14–00:21｜Look 2 → Look 3

第二次完整遮挡重复同一物理逻辑。造型变化服从前景遮挡，不使用 cross dissolve、flash、glitch、数字擦除或 body morph。

### 00:21–00:30｜Look 3 → Look 4

第三次遮挡约发生在 21 秒，Look 4 在最后一段保持编辑节奏。人物只允许很小的手臂、腿部、肩部与头部连续变化，不允许坐起、站立、漂移或瞬移。

![秋日时装片后段关键帧：服装替换后，人物与扇叶阴影仍保持同一空间关系](/works/autumn-fashion-film/frame-02.webp)

## 提示词结构与材质连续性

提示词把相机矩阵、人物身份、地毯纤维、胡桃木地板、家具位置、暖秋日光、扇叶体积和阴影同步写成连续约束，再将 07 / 14 / 21 秒的 FULL OCCLUSION TRANSITION EVENT 作为唯一换装窗口。颜色集中在 burgundy、tobacco、camel、moss、espresso、cream 与 muted gold，避免五颜六色的游戏式变化。

原始英文提示词已完整保留，可展开复制，或[下载完整提示词](/works/autumn-fashion-film/prompt.txt)。

![秋日时装片封面关键帧：固定相机下的完整造型与空间边缘](/works/autumn-fashion-film/poster.webp)

## 成片观察、限制与人工审阅

实际成片最需要检查的是固定相机是否真的没有移动、三次遮挡是否完整、脸部和身体是否连续、扇叶阴影是否跟随叶片方向，以及材料纹理在不同造型之间是否保持可信。研究索引中的 continuous take、top-down camera、character reference lock、occlusion wardrobe transition 和 material / shadow continuity 都被转译成了可逐项检查的提示词结构。

生成模型对多次遮挡换装、手指结构、边缘家具和细微阴影仍可能产生偏差；因此页面把方向约束与成片观察分开书写，不把未逐帧复测的模型能力表述成保证。输出发布前由人工选择素材、确认提示词、复看画面并判断公开边界。

## 公开素材与版权边界

公开目录保留作者提供的原始 HEVC/AAC 视频、网页 H.264/AAC 播放副本、poster、派生关键帧、字幕和完整提示词。网页播放副本由原始文件转码生成；原始文件哈希、尺寸、时长与编码记录在公开素材清单中。GitHub 与 X 只作为方法研究来源，不复制或托管第三方媒体。

---

<details><summary>展开完整提示词</summary>

```text
# 30-SECOND HYPERREAL AUTUMN FASHION FILM

## 核心任务

创作一部 **30 秒、vertical 9:16、超写实高级时尚影片**。

整部影片必须是：

**ONE CONTINUOUS SHOT / SINGLE TAKE**

从第 0 秒到第 30 秒：

- 不切镜
- 不改变 camera position
- 不改变 camera angle
- 不推拉
- 不缩放
- 不摇移
- 不旋转 camera
- 不进行数字 crop animation
- 不使用隐藏剪辑以外的任何转场

唯一允许的服装转换方式：

**由真实木质吊扇叶片扫过人物身体时形成前景遮挡，并在完整遮挡窗口内完成无缝 wardrobe replacement。**

视觉上绝不能出现 morphing。

---

# 画幅与摄影机

Vertical **9:16**。

Ultra-high-resolution commercial fashion film.

摄影机严格位于人物正上方。

**Fixed 90-degree top-down / bird’s-eye camera。**

光轴与地面完全垂直。

人物身体几乎平行于画面纵轴，但保持非常轻微的 editorial diagonal。

Camera locked off。

从第一帧到最后一帧：

**camera matrix completely unchanged。**

建议视觉焦段：

约等效 40–50mm full-frame。

避免超广角畸变。

人物头部不能放大。

腿不能因为透视突然拉长。

家具边缘保持正常几何关系。

---

# CHARACTER IDENTITY LOCK

严格使用所提供的角色参考图片。

角色：

**成年韩国女性，约 24–27 岁。**

整个 30 秒只能出现同一个人物。

严格锁定：

- 相同面部骨骼
- 相同眼睛
- 相同鼻子
- 相同嘴唇
- 相同下颌
- 相同耳朵
- 相同肤色
- 相同发际线
- 相同发型
- 相同头发长度
- 相同身体比例
- 相同肩宽
- 相同腰臀比例
- 相同腿长
- 相同手部结构
- 相同年龄

所有 LOOK 只允许服装变化。

**人物本人绝不重新生成。**

保持自然韩国女性五官。

高级、克制、editorial。

不是 K-pop idol。

不是网红。

不是塑料感 AI beauty。

真实皮肤毛孔。

极轻微肤色不均匀。

真实眼部湿润感。

自然唇纹。

非常轻的生活化妆容。

---

# 人物状态

她始终仰面躺在地毯上。

头部位于画面偏上方。

腿部朝向画面下方。

身体中心位置从始至终基本不变。

允许每套 LOOK 后：

- 手臂移动 10–25 cm
- 腿部轻微交叠
- 膝盖轻微弯曲
- 脚尖改变方向
- 肩部略微转动
- 头部旋转 5–12°
- 手掌改变位置

但绝不能：

突然坐起。

突然站立。

身体漂移。

人物瞬移。

肢体跨越不可能的位置。

---

# 视线

整部影片的核心关系是：

**她始终知道摄影机就在自己正上方。**

大部分时间：

直接看向 overhead camera。

允许偶尔：

短暂看向遥控器。

看向旋转的扇叶。

闭眼约 0.3–0.5 秒。

随后重新与镜头建立 eye contact。

眼神：

calm

detached

confident

slightly playful

editorial

禁止持续夸张微笑。

---

# 场景

高档但低调的现代公寓客厅。

背景主体：

深暖色 **American walnut floor / 胡桃木实木地板**。

木纹真实。

表面为低光泽哑光油蜡质感。

人物躺在一张：

**奢华秋色 Persian-inspired rug**

上。

地毯尺寸足够完整承托人物。

色彩体系：

- muted burgundy
- oxblood
- tobacco brown
- camel
- moss green
- faded ochre
- espresso
- dusty cream
- antique muted blue accents

纹样精致但已经轻微褪色。

不是廉价印花。

真实羊毛纤维。

轻微起伏。

毛向因人物重量自然改变。

---

# 公寓家具

家具只出现在画面边缘。

永远不能抢人物。

例如：

画面左上角：

low-profile walnut side table。

上面只有一本合上的艺术书和一个浅茶色玻璃杯。

画面右缘：

一小部分低矮奶油色 bouclé sofa。

画面左下：

一角深棕色皮革 lounge chair。

边缘可出现少量：

brushed chrome

dark wood

cream textile

smoked glass

家具必须：

固定。

真实。

克制。

高档。

无品牌 logo。

整个 30 秒绝不改变位置。

---

# 吊扇

一台真实存在于场景中的：

**large premium wooden ceiling fan**

位于人物正上方、摄影机与人物之间。

吊扇必须具有真实三维体积。

不是 graphic overlay。

不是 UI。

不是 mask animation。

材质：

深暖 walnut wood。

略带 satin finish。

三片宽而修长的实木叶片。

叶片边缘略薄。

中央：

dark bronze / aged brass motor housing。

---

## 吊扇运动

吊扇从第一帧就在旋转。

直到影片结束仍持续旋转。

速度：

缓慢、稳定。

不是高速家用电扇。

不是 motion-blurred disc。

每片叶片都必须清晰可辨。

允许轻度真实 motion blur。

叶片会真实经过：

人物脸部。

上半身。

腰部。

腿部。

在不同旋转阶段对人物产生部分前景遮挡。

---

# 关键转换规则

虽然扇叶一直经过人物，

**但不是每一次经过都会换装。**

只有三个明确的：

**FULL OCCLUSION TRANSITION EVENT**

会触发 wardrobe change。

分别约发生在：

### 07 秒
LOOK 1 → LOOK 2

### 14 秒
LOOK 2 → LOOK 3

### 21 秒
LOOK 3 → LOOK 4

每次转换必须遵守完全相同的物理逻辑：

扇叶进入画面  
→ 实际扫过人物  
→ 宽大的木质叶片遮挡人物主要躯干  
→ 在被叶片遮挡的区域内完成服装替换  
→ 叶片继续移动  
→ 新 LOOK 自然显现

人物：

脸不改变。

身体不改变。

姿势只允许极轻微连续变化。

身体不能在扇叶后突然位移。

---

# 极重要

禁止：

cross dissolve。

flash。

glitch。

digital wipe。

particle transition。

magic transformation。

liquid morph。

body morph。

cloth morph。

frame interpolation artifacts。

必须让观众相信：

**只是扇叶经过了她，而她已经换了一套衣服。**

---

# LIGHTING

温暖秋日下午。

一个画外的大型落地窗位于：

**frame upper-left direction。**

下午约 3:30–4:30 PM 的低角度暖日光斜射进入室内。

阳光形成：

柔和但明确的自然阴影。

人物身体。

地毯。

家具。

包袋。

鞋。

吊扇叶片。

全部具有真实接触阴影。

---

## 吊扇阴影

由于风扇位于人物上方：

风扇叶片会在人物和地毯表面形成非常微妙的：

**moving blade shadow。**

阴影必须和叶片实际方向同步。

不是随机光斑。

阳光方向从头到尾不变。

曝光不跳变。

---

# COLOR SCIENCE

高级秋日 editorial color grading。

整体 palette：

espresso brown

chocolate

oxblood

burgundy

camel

tobacco

moss green

olive

charcoal

ivory

cream

gold

black

降低高饱和原色。

skin tone 始终自然。

暖而不黄。

黑色不能死黑。

阴影略带 neutral brown。

高光为 creamy warm white。

加入：

非常轻微 natural film grain。

subtle fine grain。

极少量 halation。

绝不能做成强烈复古 VHS。

---

# LOOK 1
## 00:00–00:07

人物已经躺在 Persian rug 上。

第一套造型：

### TOP
chocolate brown ribbed tank top。

清晰细罗纹针织。

贴身但自然。

---

### JACKET
oversized camel suede bomber jacket。

真正麂皮。

可以看见：

细微绒面方向。

袖口堆积。

宽松肩线。

立体 bomber 结构。

---

### SKIRT
burgundy pleated mini skirt。

细密规则百褶。

人物躺下后褶皱会自然展开。

不能像硬纸。

---

### HOSIERY
espresso-brown tights。

哑光。

具有极轻微皮肤透光感。

---

### BOOTS
tobacco brown relaxed slouch boots。

柔软皮革 / suede appearance。

靴筒自然堆积。

---

### BAG
oxblood shoulder bag。

放在身体侧边。

深酒红皮革。

轻微自然高光。

---

### ACCESSORIES

gold hoop earrings。

tortoiseshell sunglasses。

---

## ACTION

00:00–00:02

影片已经开始。

她安静地躺着。

一条腿略微弯曲。

另一条腿自然伸展。

右臂放在身体侧边。

左手位于腹部附近。

吊扇持续经过上方。

她直接看着 camera。

自然眨眼一次。

---

00:02–00:04

她非常随意地伸手拿起旁边的：

small minimal remote control。

动作不急。

手指结构完全真实。

---

00:04–00:06

她把遥控器稍微举向上方。

并没有真正按很多按钮。

拇指轻按一次。

随后视线从遥控器回到 camera。

嘴角只有非常微小的：

knowing expression。

---

00:06–00:07

一片宽木质扇叶开始扫过身体。

形成第一次完整遮挡。

---

# TRANSITION 01
## 约 00:07

吊扇叶片：

进入人物上半身  
→ 遮住 torso 与腰部  
→ 继续扫过腿部。

在叶片后方：

LOOK 1 已变为 LOOK 2。

人物本身保持完全一致。

---

# LOOK 2
## 00:07–00:14

### HEADWEAR
cream shearling hat。

柔软奶油色羊羔绒。

明显真实纤维。

---

### TOP
ivory knit sweater。

柔软粗细适中的针织结构。

---

### JACKET
olive utility jacket。

洗旧橄榄绿。

棉质 / canvas texture。

真实 pocket structure。

---

### PANTS
relaxed faded blue jeans。

中度褪色。

非 skinny。

自然宽松。

---

### SOCKS
cream socks。

柔软棉质。

---

### SHOES
leopard slingback shoes。

真实 leopard hair / printed leather texture。

低调。

不是廉价高饱和豹纹。

---

### BAG
espresso tote bag。

深咖啡色柔软皮革。

---

## ACTION

00:07–00:09

新造型出现后：

她没有惊讶。

就像本来就穿着这套衣服。

她重新调整左腿。

一条腿轻微跨过另一条腿。

头部向右转约 7°。

眼睛仍然看 camera。

---

00:09–00:11

她用两根手指非常轻地碰一下：

cream shearling hat 的边缘。

动作松弛。

帽子产生真实压缩和绒毛回弹。

---

00:11–00:13

另一只手自然落在 espresso tote bag 上。

皮革被手掌轻压出小范围形变。

她眨眼。

轻微呼吸。

胸腹产生极轻微自然运动。

---

00:13–00:14

下一次被指定的完整木质叶片 sweep 开始。

---

# TRANSITION 02
## 约 00:14

木叶片实际穿过 foreground。

形成明确遮挡。

LOOK 2 → LOOK 3。

禁止任何 visible morphing。

---

# LOOK 3
## 00:14–00:21

### TOP
oxblood asymmetric knit top。

深牛血红。

不对称领口。

真实针织纹理。

---

### COAT
chocolate faux-fur coat。

深巧克力色。

丰厚但高级。

每根长短不同的细纤维都存在自然方向。

禁止塑料毛绒玩具感。

---

### TROUSERS
charcoal fine pinstripe trousers。

深炭灰。

极细 vertical pinstripe。

宽松高级 tailoring。

---

### BOOTS
black kitten-heel ankle boots。

精致尖圆头。

短 kitten heel。

轻微抛光皮革。

---

### BAG
cherry-red structured handbag。

造型精致。

颜色是深樱桃红。

不是鲜红。

---

## ACTION

00:14–00:16

她稍微将肩膀向一侧旋转。

因为 faux fur 厚度变化：

肩部轮廓自然发生体积变化。

左臂放松伸开。

---

00:16–00:18

她把 cherry-red handbag：

从身体侧边缓慢拉近约 15 cm。

不要举起来展示。

只是随手拉近。

---

00:18–00:20

她重新直视 camera。

下巴非常轻地抬起。

形成更强的 editorial attitude。

头发在地毯上轻微摩擦移动。

---

00:20–00:21

宽大的木质叶片进入第三次指定遮挡。

---

# TRANSITION 03
## 约 00:21

风扇扫过。

LOOK 3 → LOOK 4。

仍然：

身体位置连续。

面部身份完全一致。

没有闪烁。

没有身体替换。

---

# LOOK 4
## 00:21–00:30

最终造型。

### HEADWEAR
charcoal grey beret。

精细羊毛毡材质。

---

### CARDIGAN
moss-green mohair cardigan。

明显 mohair halo。

柔软长毛纤维。

松弛 cardigan silhouette。

---

### INNER
chocolate brown tank top。

---

### TROUSERS
espresso-brown leather trousers。

深浓缩咖啡棕。

真实细皮纹。

低到中等 gloss。

绝不能塑料反光。

---

### SHOES
burgundy loafers。

深勃艮第红皮革。

---

### SOCKS
charcoal grey socks。

---

### BAG
cherry-red structured handbag。

保持 LOOK 3 的同一个包。

结构、尺寸、材质完全一致。

---

# FINAL PERFORMANCE

00:21–00:23

LOOK 4 显现。

她把一只手放到：

moss-green cardigan 的胸口区域。

轻轻整理一次领口。

Mohair fiber 随手移动，然后回落。

---

00:23–00:25

她轻微屈起一条腿。

burgundy loafer 与 charcoal sock 清楚进入构图。

另一条腿保持放松。

---

00:25–00:27

她用指尖非常轻地整理：

charcoal beret。

动作之后手缓慢落回地毯。

---

00:27–00:28

她完成最终 editorial pose：

头部略偏。

肩膀松弛。

腿部形成非常克制的 asymmetric geometry。

双眼直视 camera。

---

# FINAL HOLD
## 00:28–00:30

人物：

**完全静止。**

不再整理衣服。

不再移动手。

不再移动腿。

只允许：

极细微自然呼吸。

一次非常轻的眨眼。

她直视 overhead camera。

冷静、自信、安静。

吊扇：

**继续旋转。**

风扇成为画面中唯一明显运动。

最后一帧：

不淡出。

不出现文字。

不出现 logo。

保持 LOOK 4。

直接结束。

---

# PHYSICAL MATERIAL SIMULATION

所有材质必须真实响应：

重力。

人物身体重量。

手部接触。

身体姿态变化。

---

## SUEDE

Camel suede bomber：

绒面具有方向性。

随着褶皱改变亮暗。

无塑料高光。

---

## FAUX FUR

Chocolate faux fur：

独立毛束。

受重力和手臂压力产生自然压缩。

---

## MOHAIR

Moss green cardigan：

细软 halo fiber。

轮廓稍模糊但主体仍极清晰。

---

## LEATHER

包袋。

皮裤。

loafers。

boots。

全部必须根据皮种呈现不同：

roughness。

specular response。

grain size。

禁止所有皮革使用完全相同材质。

---

## KNIT

Ribbed tank。

ivory sweater。

asymmetric knit。

均必须有不同织法和 scale。

---

## DENIM

LOOK 2 jeans：

真实 warp/weft。

自然 wash。

膝盖和臀部因人物躺下产生合理褶皱。

---

## PLEATS

LOOK 1 skirt：

每一个 pleat 具有真实 cloth simulation。

躺下后受身体和地毯影响自然展开。

---

# HAIR PHYSICS

头发始终接触地毯。

人物头部轻微转动时：

头发不会整体像假发一样旋转。

应该出现：

底层头发被摩擦固定。

上层发丝缓慢滑动。

少量 loose strand 移动。

随后自然回落。

---

# HUMAN REALISM

保持：

自然眨眼。

微弱眼球 movement。

细微呼吸。

极小的手指调整。

真实肩颈重量。

躺下后衣服被身体压住的真实状态。

脚踝和膝盖符合真实人体活动范围。

人物不能像 CG mannequin。

也不能出现：

unnecessary body motion。

---

# 风扇与人物空间关系

吊扇绝不能看起来：

贴在人脸上。

穿过身体。

或者像二维蒙版。

摄影机位于风扇上方。

风扇位于 camera 与人物之间。

人物位于地毯上。

必须形成清晰的：

camera  
↓  
ceiling fan  
↓  
model  
↓  
Persian rug  
↓  
walnut floor

空间层级。

---

# SHADOW CONTINUITY

整个 30 秒：

太阳方向不改变。

Furniture shadow 不改变。

人物阴影只根据她轻微姿态发生合理变化。

换装后：

服装阴影必须立即与新 garment geometry 对应。

风扇移动阴影：

与旋转叶片严格同步。

禁止 lighting reset。

禁止每套 LOOK 重新打光。

---

# EDITORIAL MOOD

视觉参考不是：

TikTok outfit transition。

不是：

influencer haul。

不是：

快节奏换装。

而是：

luxury fashion film

editorial campaign

quiet apartment surrealism

autumn tactile fashion

high-end seasonal lookbook

controlled visual choreography

画面感觉：

**时装在变，但世界没有变。**

---

# SOUND DESIGN

无对白。

无旁白。

音乐可以非常克制。

建议：

minimal warm ambient electronic track。

非常低的节拍。

更多保留 room tone。

可以听见：

吊扇电机非常微弱的 hum。

衣料摩擦。

包袋落在地毯上的轻声。

遥控器按钮轻微 click。

皮革摩擦。

呼吸。

不要：

夸张 whoosh transition。

不要魔法声。

不要 glitch sound。

每次 outfit transition：

主要依靠风扇叶片经过时产生的：

自然低频空气 movement。

---

# STRICT CONTINUITY LOCK

从 frame 1 到最后 frame：

必须锁定：

CHARACTER_ID。

FACE_ID。

BODY_ID。

HAIR_ID。

CAMERA_ID。

SET_ID。

RUG_ID。

FURNITURE_ID。

FAN_ID。

LIGHTING_DIRECTION。

COLOR_GRADE。

---

# STRICT NEGATIVE CONSTRAINTS

绝对禁止：

cuts

jump cuts

hidden camera cuts

camera movement

camera shake

zoom

digital zoom

dolly

pan

tilt

orbit

angle change

lens change

perspective change

camera rotation

scene replacement

background change

floor change

rug change

furniture movement

morphing

body morph

face morph

face replacement

identity drift

age drift

hair change

hair length change

body proportion drift

skin-tone change

extra limbs

duplicated arms

duplicated legs

extra fingers

missing fingers

fused fingers

broken wrists

broken ankles

impossible joints

teleportation

floating handbags

disappearing accessories

wrong shoes

wrong bag

missing earrings

random accessories

clothing color drift

wrong garment layering

garment fusion

cloth clipping through body

bag clipping through body

fan clipping through body

fan changing shape

fan changing blade count

lighting reset

shadow inconsistency

fake 2D fan overlay

graphic transition

cross dissolve

flash transition

glitch

liquid morph

smoke transition

particle effects

speed ramp

slow motion

text

captions

logo

watermark

UI

frame border

beauty filter

plastic skin

CG doll appearance

extreme HDR

over-sharpening

over-saturation

---

# FINAL VISUAL TARGET

一部看起来真正由高端时装品牌制作的：

**30 秒秋季 fashion campaign film。**

观众第一眼注意到：

人物。

质感。

服装配色。

地毯。

秋日阳光。

然后才意识到：

所有换装都发生在同一个没有切镜的 overhead shot 中。

风扇不是装饰。

而是影片完整视觉语法。

最终效果：

**hyperreal / tactile / quiet / luxurious / editorial / autumnal / controlled / physically believable / premium fashion advertising / single-take illusion**
```

</details>
