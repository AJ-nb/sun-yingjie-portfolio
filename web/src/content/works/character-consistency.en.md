---
title: "Character Consistency | A Visual Definition System"
category: "experiments"
summary: "Five complete character sheets organise views, expressions, clothing and details into reusable visual definitions."
role: "Character definition, prompt structure, image organisation and visual review"
credits: "Personal project by Yingjie Sun · Codex-assisted creation · Image 2.5 imagery"
status: "Visual method and image experiments"
cover: "/works/character-consistency/cover.webp"
tags: ["Character sheets", "Identity consistency", "Visual systems", "Image 2.5"]
---

## Project goal

This experiment turns a character reference into a visual definition that can be revisited throughout production. A single attractive image describes one moment; a character sheet also needs to explain structure, clothing, expression and the range of possible poses.

I directed the content and visual judgment, with Codex assistance and Image 2.5 image generation. Five complete images document the method through distinct examples.

![Character-sheet overview: the main identity with views, expressions and detail modules](/works/character-consistency/01.jpg)

## Define a recognisable structure

Front, side, rear and three-quarter views constrain facial features, hair, proportions and clothing silhouette. The main figure takes visual priority; supporting modules explain that identity rather than introducing a new character in each panel.

![Structural example: full-body views, colour palette and facial details](/works/character-consistency/02.jpg)

Review shoulder width, waist placement, garment length and footwear before inspecting individual facial details. Proportion lines and silhouettes support visual comparison; they are not precise anthropometric measurements.

## Bound expressions and movement

Expression grids, micro-expressions, hands and poses describe how a character communicates emotion. Calmness, tension and curiosity should alter expression and posture while preserving identity.

![Expressive example: a separate character with multiple views, expressions and poses](/works/character-consistency/03.jpg)

This is a different character from the preceding example. It demonstrates reuse of the sheet structure, rather than repeated generation of one person. Read clothing choices within their respective examples.

## Specify details and materials

Separate modules describe hair layers, garment folds, footwear and accessories. They give later prompts concrete areas to reference. Details become useful when they relate to a stable overall structure.

![Detail example: relationships between hair, clothing, hand poses and expression modules](/works/character-consistency/04.jpg)

Each sheet is a separate visual-definition example. Names and profile text inside the images belong to fictional character settings, not real-person identity records.

## Input template and complete example

Supply a reference, then specify style, proportions and emotional keywords. Request a shared composition covering views, silhouettes, expressions, head angles, clothing and hands. Compare every generated module back to the main figure.

![Complete example: extending the main identity into poses, hands and garment details](/works/character-consistency/05.jpg)

The original Chinese template is preserved below. Bracketed values are fields to replace for a new character. Its requested modules are identity, palette, full-body views, silhouettes, expressions, micro-expressions, head angles, poses, close-up, clothing and hands.

```text
【任务】
基于参考图生成一张高精度角色设定板(Character Sheet)锁定角色ID，不允许生成新角色，所有画面必须基于同一角色结构

【基础设定】
风格:[写实3D/风格化3D/动漫/半写实/IP设计]
角色描述:[填写你的角色描述或上传参考图]
性别:[男/女/中性]
年龄:[数值]
体型:[瘦/标准/健壮/夸张比例]
风格关键词:[高级感/时尚/潮流/科技感/情绪化等】

【画面结构】
- 画面比例:4:3横版
- 背景:纯白/米白/极简
- U1:干净技术排版,无logo,无水印
- 字体:清晰可读英文标签

【必须包含模块】
1. 顶部信息
    - 名字(可自动生成)
    - 角色身份
    - 年龄
    - 性格关键词(3-5个)
    - 核心主题(1句)
2. 配色系统-6~8个色块(无文字)
3. 主身份展示(最大区域) 重点:锁定角色
    - 正面/3/4/侧面/背面
    - 标准站姿
    - 带比例线(身高刻度)
    - 无道具
4. 轮廓剪影
    - 正面剪影
    - 侧面剪影
5. 表情系统(8张)
    - 平静/好奇/紧张/惊讶/害怕/悲伤/坚定/放松
6. 微表情(5张)
    - 眼部紧张/微笑/嘴部用力/微恐惧/呼吸控制
7. 头部结构
    - 多角度(3/4/侧面/仰视/俯视)
8. 姿态变化
    - 放松/紧张/自信
9. 特写镜头(1张)
    - 胸部以上
    - 强情绪表达
10. 服装细节(4张)
    - 发型/材质/配饰/鞋
11. 手部动作
    - 放松/紧张/指向/抓握/面部动作

【一致性要求】
- 所有画面角色完全一致(脸/发型/比例/服装)
- 不允许风格漂移
- 主展示区域必须最大【质量要求】
- 0G级细节
- 材质真实(皮肤/布料/金属)
- 影视级光影
```

## Results and reuse

The project contains five complete images and a reusable input template. It breaks identity control into facial, hair, proportion, clothing and viewpoint relationships that can be inspected before further image or video generation.

The sheets establish a reference for consistency; these examples alone do not quantify long-term generation stability. Video use also requires reviewing turns, occlusion, close-ups and fast movement continuously.

Connect this approach to [Ink Realm](/work/ink-realm), and use the [lighting experiment](/work/portrait-lighting) to distinguish identity changes from changes in illumination.
