---
title: "Mini DV 早晨咖啡 Vlog"
category: "experiments"
summary: "一支 30 秒 4:3 Mini DV 早晨咖啡记录，把家用摄像机的偶然性、声音近感和动作顺序保留下来。"
role: "方向设定、角色参考图选择、镜头与声音脚本、提示词组织、成片审阅"
credits: "孙英杰个人项目 · Codex 辅助内容结构 · Image 2.5 角色参考图 · Seedance 2.5 视频"
status: "成片与完整提示词"
cover: "/works/mini-dv-coffee/character-reference.jpg"
tags: ["AI film", "Mini DV", "Coffee vlog", "Sound design"]
---
## 项目概念与媒介特征

这是一支由主角本人随手记录的 30 秒早晨咖啡 vlog。它保持 4:3 家用 Mini DV / Handycam 的视角：构图偶尔偏移，水平线并不稳定，自动曝光、自动对焦、轻微数字噪点和自然 motion blur 都成为叙事的一部分。它不是商业咖啡广告，也不把日常动作包装成专业表演。

角色参考图由 Image 2.5 生成；Seedance 2.5 生成视频；Codex 辅助提示词组织、内容结构和发布检查。我负责角色与生活场景方向、镜头顺序、声音优先级、素材选择、输出审阅与发布判断。

## 完整成片

30.045 秒 · 960 × 720 · 24 fps · H.264/AAC 网页播放副本。页面默认使用兼容性更好的播放副本；[下载原始 HEVC/AAC 文件](/works/mini-dv-coffee/film-source.hevc.mp4)。

<video controls playsinline preload="metadata" poster="/works/mini-dv-coffee/poster.webp" src="/works/mini-dv-coffee/film.mp4"><track kind="captions" src="/works/mini-dv-coffee/visual.zh.vtt" srclang="zh" label="中文视觉说明"></track><track kind="captions" src="/works/mini-dv-coffee/visual.en.vtt" srclang="en" label="English visual description"></track></video>

## 角色参考与生活空间

![AREN SATO 角色参考图：刚起床的年轻男性，穿着宽松素色 T 恤](/works/mini-dv-coffee/character-reference.jpg)

角色保持 25 岁左右、刚起床不久的松弛状态，不看镜头表演，也不承担广告式产品展示。场景是一间有自然晨光和生活痕迹的小型家庭厨房；咖啡机、磨豆机、咖啡豆、把手、压粉器、奶缸与马克杯构成完整但克制的动作道具。

## 分镜、摄影与动作

### 00:00–00:12｜从启动到萃取

镜头从被放在台面的固定中景开始，人物进入并打开咖啡机；随后切到手持俯拍倒豆、研磨，再以近距离压粉、锁定把手和启动萃取完成动作顺序。机器启动、磨豆和金属碰撞声承担节奏，镜头保留 autofocus breathing 与轻微构图寻找。

### 00:12–00:23｜咖啡与蒸汽

镜头在咖啡流、杯沿、牛奶和蒸汽棒之间寻找焦点。剪辑保持 hard cut，磨豆机与蒸汽声可以跨镜头提前进入；蒸汽启动时允许近距离 Mini DV 麦克风出现轻微自动增益变化。

![咖啡制作中段关键帧：萃取、杯沿与自然焦点寻找](/works/mini-dv-coffee/frame-01.webp)

### 00:23–00:30｜倒奶、饮用与结束

奶缸轻敲、旋转并倒入 espresso，杯子碰桌成为剪辑点。人物喝一口后短暂微笑，拿着咖啡靠近摄像机，用手遮住画面，最后留下 click。结尾不把普通早晨变成仪式化广告。

![结尾关键帧：喝咖啡后走向镜头，手掌即将遮住画面](/works/mini-dv-coffee/frame-02.webp)

## 提示词结构与声音设计

提示词先锁定媒介（4:3 consumer Mini DV）、角色状态与厨房道具，再按 beans → grinding → dosing → tamping → locking → extraction → milk → steaming → pouring → drinking 组织动作，最后明确禁止商业广告、稳定器、花哨转场和不可信的物体变化。声音是方法的一部分：咖啡机低频、磨豆、压粉、蒸汽、倒奶、杯子与 room tone 共同建立真实距离。

原始中文提示词已完整保留，可展开复制，或[下载完整提示词](/works/mini-dv-coffee/prompt.txt)。

## 成片观察、限制与人工审阅

可见结果保留了 4:3 家用影像的轻微手持、不完全稳定的白平衡、生活化的动作和近距离声音关系。关键判断来自动作顺序是否可信、角色是否持续保持同一生活状态、焦点变化是否服务于动作，而不是是否像一支精致广告。

生成视频仍需逐镜人工复看：手部、器具接触、咖啡液体连续性、对白与声音是否准确对应，都不能只凭一张关键帧判断。时间省略使它不是完整实时记录；30 秒内的剪辑顺序和声音连续性是方向约束，输出表现以实际成片为准。

## 公开素材与版权边界

公开目录保留作者提供的角色参考图、原始 HEVC/AAC 视频、网页 H.264/AAC 播放副本、派生关键帧、字幕和完整提示词。网页播放副本由原始文件转码生成；原始文件哈希、尺寸、时长与编码记录在公开素材清单中。GitHub 与 X 只作为方法研究来源，不复制或托管第三方媒体。

---

<details><summary>展开完整提示词</summary>

```text
# 30s Mini DV Morning Coffee Vlog

## 核心概念

一支由主角本人随手记录的 **30 秒早晨咖啡 vlog**。

不是商业咖啡广告，不是精致 lifestyle 广告，也不是专业咖啡教学视频。

它应该像某个人早上刚起床，在自己很小的厨房里，用一台旧 Mini DV / Handycam 随手记录自己做第一杯咖啡。

画面略显笨拙，但真实、安静、舒服。

---

## 摄影语言

Handheld consumer Mini DV camcorder footage.

真实家用摄像机观感：

- 4:3 画幅
- 轻微手持抖动
- 偶尔不稳定的水平线
- 构图并不完美
- 主体偶尔略微偏离画面中心
- 自然、不精确的推拉变焦
- 偶尔重新寻找焦点
- autofocus breathing
- focus hunting
- 明亮窗户进入画面时出现轻微自动曝光波动
- 高光略微溢出
- 暗部信息有限
- 柔和的 DV 数码噪点
- 极轻微磁带颗粒与 chroma noise
- 运动时存在自然 motion blur
- 白平衡并非完全稳定
- 肤色真实自然
- 禁止现代电影级锐利 HDR
- 禁止过度浅景深
- 禁止电影灯光
- 禁止稳定器感
- 禁止广告级运镜

镜头像一个真实的人在生活，而不是摄影师在“拍作品”。

---

## 人物

25 岁左右年轻男性。

素色、稍微宽松的 T 恤。

头发略微凌乱，像刚刚起床不久。

无明显造型。

极少配饰。

身体状态松弛。

动作熟练但没有表演感。

做咖啡时安静、专注。

偶尔因为看到咖啡状态不错而产生很轻微的笑。

不要一直看镜头。

不要刻意展示产品。

不要 exaggerated acting。

---

## 场景

安静的小型家庭厨房。

早晨。

窗外自然日光照进厨房。

台面上只有：

- 家用意式咖啡机
- 磨豆机
- 新鲜咖啡豆
- portafilter
- tamper
- 小型不锈钢奶缸
- 简单马克杯或陶瓷咖啡杯

环境略有真实生活痕迹。

不是样板间。

没有品牌露出。

没有多余装饰。

---

# 30 秒完整分镜

## SHOT 01
### 00:00–00:03

**固定在厨房台面的中景。**

相机明显刚刚被主人放到台面上。

画面轻轻晃动一下。

人物从画面外进入。

伸手打开咖啡机。

机器指示灯亮起。

窗户区域稍微过曝，相机自动曝光轻微调整。

人物低声说：

**“Morning.”**

停顿一下。

**“Coffee first.”**

没有背景音乐。

只听见：

按钮声。

机器启动的低频嗡鸣。

厨房远处极轻的环境声。

---

## SHOT 02
### 00:03–00:06

**手持俯拍。**

主人一只手拿相机，一只手把咖啡豆倒进磨豆机。

镜头没有完全对准。

轻微调整一次构图。

按下磨豆按钮。

磨豆机突然响起。

相机因为声音和手部动作产生非常轻的震动。

咖啡粉开始落入 portafilter。

这里让：

**GRINDER SOUND 成为主角。**

不说话。

---

## SHOT 03
### 00:06–00:09

**非常近的手持特写。**

咖啡粉已经装满。

手指轻轻整理边缘。

tamper 压下。

**咚。**

停顿半秒。

稍微旋转。

抬起。

金属与台面出现一个非常清晰但柔和的：

**tap。**

镜头短暂失焦。

随后重新找到咖啡粉表面。

无对白。

---

## SHOT 04
### 00:09–00:12

**肩部高度的随手手持镜头。**

主人拿起 portafilter。

插入咖啡机。

向右旋转锁定。

**咔。**

镜头自然跟随动作。

不是精准 tracking。

启动萃取。

主人很轻地说：

**“Okay.”**

画面直接切走。

---

## SHOT 05
### 00:12–00:16

**咖啡出口极近距离特写。**

一开始只有几滴深色咖啡。

随后变成稳定的细流。

深棕色 espresso 缓慢进入小杯。

crema 逐渐形成。

不要慢动作。

使用真实时间中的一个片段，而不是完整展示整个萃取过程。

镜头轻微前后寻找焦点：

咖啡流 →

杯沿 →

重新回到咖啡流。

声音：

液体落入陶瓷杯的轻声。

咖啡机水泵。

厨房底噪。

无对白。

---

## SHOT 06
### 00:16–00:19

**固定台面中近景。**

已经完成的 espresso 在画面一侧。

主人打开冰箱。

拿出牛奶。

倒进小型不锈钢奶缸。

牛奶撞击金属：

**soft metallic liquid sound。**

镜头里的主人没有看摄像机。

极轻地说：

**“Milk.”**

关闭冰箱。

直接切镜。

---

## SHOT 07
### 00:19–00:23

**手持微距。**

蒸汽棒进入牛奶。

开启蒸汽。

瞬间：

**SSSSSSHHHHH—**

成为整个视频最大的声音。

奶液快速形成旋涡。

主人一只手扶奶缸。

手指根据温度自然移动。

镜头稍微靠近。

自动对焦短暂落在蒸汽棒上，又重新找到奶液。

蒸汽让画面出现非常轻微的 haze。

没有对白。

只有：

蒸汽声。

金属震动。

奶液旋转。

---

## SHOT 08
### 00:23–00:27

**相机重新放回台面。**

一个稍微歪斜、不完美的中近景。

主人轻轻晃动奶缸。

在台面上：

**tap。**

再旋转两次。

然后立即把奶倒进 espresso。

镜头没有刻意展示复杂拉花。

只形成非常简单、自然的浅色奶咖分层。

倒奶过程中出现一次很短的谨慎停顿。

杯子碰到台面：

**clink。**

无对白。

---

## SHOT 09
### 00:27–00:30

**温暖但仍然非常普通的固定镜头。**

主人拿起咖啡。

喝一小口。

停半秒。

非常轻微地笑一下。

不是面对镜头表演。

只是觉得味道不错。

他说：

**“Yeah.”**

停顿。

走向摄像机。

另一只手还拿着咖啡。

靠近之后轻声：

**“See you.”**

手伸向镜头。

手掌逐渐遮住画面。

画面变黑。

最后听到：

**click。**

录像结束。

---

# 声音设计

声音必须成为这支影片的重要组成部分。

禁止持续背景音乐。

禁止广告音乐。

禁止 cinematic soundtrack。

允许极轻微自然 room tone。

主要声音：

- 咖啡机启动嗡鸣
- 咖啡豆倒入机器
- grinder 运转
- 咖啡粉落入 portafilter
- tamper 压粉
- 金属件碰撞
- portafilter 锁定的咔声
- espresso 滴落
- 牛奶倒入金属奶缸
- steam wand 嘶声
- 牛奶旋转
- pitcher tap
- 倒奶
- 陶瓷杯碰撞
- 衣服摩擦
- 轻微呼吸
- 房间环境音

所有声音必须略带近距离 Mini DV microphone 的特点。

偶尔稍微过响。

动态范围不完美。

蒸汽启动瞬间可以产生非常轻微的自动增益调整。

---

# 表演要求

人物不是主播。

不是专业咖啡师表演。

不是广告演员。

他说话的时候甚至不一定看摄像机。

对白必须像自己跟自己说话。

自然眨眼。

偶尔抿嘴。

思考时视线停留在咖啡机上。

锁 portafilter 时稍微用力。

蒸奶时明显更加专注。

倒奶时出现一次自然迟疑。

喝到咖啡之后的笑容非常短。

不要夸张点头。

不要闭眼享受。

不要“广告式满足表情”。

---

# 剪辑逻辑

整个 30 秒并非真实制作过程的完整实时记录。

使用自然时间省略。

但动作顺序必须正确：

beans  
→ grinding  
→ dosing  
→ tamping  
→ locking portafilter  
→ extraction  
→ milk  
→ steaming  
→ pouring  
→ drinking

剪辑以声音连续性连接镜头。

例如：

磨豆机声音可以提前 2–3 帧进入下一镜头。

蒸汽声可以在切到微距之前提前出现。

杯子放在桌面的 clink 可以成为下一次剪辑点。

避免：

- 快节奏 MV 剪辑
- 每一镜完全相同时长
- 花哨 transition
- whip pan
- speed ramp
- glitch transition
- cinematic montage

只允许简单直接的：

**hard cut。**

---

# Mini DV 真实感

画面不是简单叠加 VHS filter。

它应该真正表现为消费级 Mini DV 摄像机：

轻微数字噪点。

有限动态范围。

高光偶尔 clipping。

肤色自然。

自动白平衡轻微漂移。

自动曝光会因为窗户和人物位置发生变化。

autofocus 不总是立即找到主体。

偶尔出现 0.2–0.5 秒 focus hunting。

变焦由手指操作。

速度并不完全稳定。

偶尔停早一点或多推了一点。

画面整体干净，但不完美。

---

# Negative Prompt / 严格禁止

禁止：

commercial coffee advertisement

cinematic commercial

luxury lifestyle advertisement

perfect latte art

professional barista performance

perfect composition

perfect symmetrical framing

perfect camera stabilization

gimbal footage

crane shot

drone shot

dramatic camera movement

extreme shallow depth of field

anamorphic lens flare

teal and orange grading

heavy film grain

VHS distortion

retro music video styling

excessive bloom

excessive halation

overexposed dreamy aesthetic

slow motion

speed ramp

fashion model posing

constant smiling

looking into camera constantly

AI-perfect hands

unnaturally smooth body motion

floating objects

changing kitchen layout

changing clothes

changing hairstyle

extra fingers

duplicated utensils

espresso machine changing shape

cup changing shape

teleporting objects

unrealistically fast coffee preparation

---

## 最终效果

像是在某个人 Mini DV 磁带里偶然发现的一段：

**“一个普通早晨，他给自己做了一杯咖啡。”**

画面不精致。

动作不表演。

声音很近。

晨光真实变化。

偶尔失焦。

偶尔构图歪一点。

但人物、空间、咖啡制作过程都非常可信。

整体关键词：

**intimate / quiet / tactile / imperfect / domestic / spontaneous / warm morning / Mini DV / personal diary / coffee ASMR / real life**
```

</details>
