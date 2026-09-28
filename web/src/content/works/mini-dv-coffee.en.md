---
title: "Mini DV Morning Coffee Vlog"
category: "experiments"
summary: "A 30-second 4:3 Mini DV morning coffee record that keeps consumer-camera accident, close sound and correct action order."
role: "Direction, character-reference selection, shot and sound script, prompt organisation, output review"
credits: "Personal project by Yingjie Sun · Codex-assisted content structure · Image 2.5 character reference · Seedance 2.5 video"
status: "Film and complete prompt"
cover: "/works/mini-dv-coffee/character-reference.jpg"
tags: ["AI film", "Mini DV", "Coffee vlog", "Sound design"]
---
## Concept and medium

This is a 30-second morning coffee vlog recorded as if the subject had just turned on a consumer Mini DV / Handycam. It stays in 4:3: framing drifts, the horizon is imperfect, autofocus, auto-exposure, small digital noise and natural motion blur become part of the story. It is not a coffee advertisement and it does not turn a domestic action into a performance.

Image 2.5 generated the character reference; Seedance 2.5 generated the video; Codex assisted prompt organisation, content structure and release checks. My responsibilities include direction, shot order, sound priorities, asset selection, output review and release judgment.

## Complete film

30.045 seconds · 960 × 720 · 24 fps · H.264/AAC web playback copy. The page uses the broadly compatible copy by default; [download the original HEVC/AAC file](/works/mini-dv-coffee/film-source.hevc.mp4).

<video controls playsinline preload="metadata" poster="/works/mini-dv-coffee/poster.webp" src="/works/mini-dv-coffee/film.mp4"><track kind="captions" src="/works/mini-dv-coffee/visual.zh.vtt" srclang="zh" label="中文视觉说明"></track><track kind="captions" src="/works/mini-dv-coffee/visual.en.vtt" srclang="en" label="English visual description"></track></video>

## Character reference and domestic space

![AREN SATO character reference: a young man in a loose plain T-shirt, just after waking](/works/mini-dv-coffee/character-reference.jpg)

The character stays relaxed and unperformed, without addressing the camera or presenting a product. Natural morning light enters a small lived-in kitchen; an espresso machine, grinder, beans, portafilter, tamper, steel pitcher and simple cup make the action sequence legible.

## Shots, camera and action

### 00:00–00:12 | Start to extraction

A fixed counter shot begins as if the camera has just been put down. The subject starts the machine, then switches to handheld top view for beans and grinding, close tamping, locking and extraction. Machine hum, grinder noise and metal contact carry the rhythm while autofocus and imperfect framing remain visible.

### 00:12–00:23 | Coffee and steam

Focus searches between the stream, cup rim, milk and steam wand. Hard cuts preserve sound continuity; grinder and steam can lead into the next shot, with a small consumer-microphone gain change when steam starts.

![Mid-process frame: extraction, cup rim and a natural focus search](/works/mini-dv-coffee/frame-01.webp)

### 00:23–00:30 | Pour, sip and end

The pitcher is tapped, rotated and poured into espresso; a ceramic clink becomes an edit point. The subject takes a sip, smiles briefly, approaches with the cup and covers the lens, ending on a click. The ordinary morning stays ordinary.

![End frame: after the sip, the subject approaches and covers the lens](/works/mini-dv-coffee/frame-02.webp)

## Prompt structure and sound

The prompt first locks the medium, character state and kitchen objects, then orders beans → grinding → dosing → tamping → locking → extraction → milk → steaming → pouring → drinking. It explicitly excludes commercial polish, stabilizer movement, decorative transitions and implausible object changes. Sound is part of the method: machine hum, grinder, tamp, steam, pour, cup and room tone establish distance and tactility.

The complete source prompt is preserved below for copying, or [download it](/works/mini-dv-coffee/prompt.txt).

## Observations, limits and human review

The output keeps consumer-camera movement, imperfect white balance, domestic performance and close sound. Review focuses on action order, the subject’s consistent everyday state, and whether focus changes support the action.

The generated film still requires shot-by-shot review of hands, tool contact, liquid continuity and dialogue-to-sound alignment. It is an edited 30-second record rather than a complete real-time process; the actual film governs what is observed.

## Public assets and rights boundary

The public folder retains the author-supplied character reference, original HEVC/AAC video, H.264/AAC playback copy, keyframes, captions and complete prompt. The playback copy is transcoded from the original, with hashes, dimensions, duration and codecs recorded in the public asset register. GitHub and X are cited as method research only; no third-party media is copied or hosted.

---

<details><summary>Expand the complete prompt</summary>

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
