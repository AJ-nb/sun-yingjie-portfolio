---
title: "From Light to Prompt | AI Portrait Lighting"
category: "experiments"
summary: "Nine complete images connect lighting types, directions and visible outcomes into reusable portrait prompts."
role: "Lighting specification, prompt organisation, image comparison and visual evaluation"
credits: "Personal project by Yingjie Sun · Codex-assisted creation · Image 2.5 imagery"
status: "Visual method and image experiments"
cover: "/works/portrait-lighting/cover.webp"
tags: ["AI portraits", "Lighting", "Prompts", "Visual evaluation"]
---

## Project goal

Translate photographic lighting into short prompts that a generative model can interpret and a creator can inspect. The method names the light, its direction and a visible result on the face or background.

I led visual judgment in this personal experiment, with Codex-assisted content organisation and Image 2.5 image generation. All nine images are retained, including the cover and every comparison.

![Experiment cover: translating photographic lighting into short prompts](/works/portrait-lighting/01.jpg)

## Basic lighting: direction and shadow

### Soft and hard light

![Soft and hard light comparison](/works/portrait-lighting/02.jpg)

Shadows are shallow on the left; the nose and chin shadows are clearer on the right. The source reference already favours soft lighting, so this pair does not isolate the reference image’s influence.

```text
Overcast diffuse light. The sky lights the face evenly, with shallow, soft shadows. Outdoor grey-wall background.
```

```text
Direct hard sunlight from the upper left, with clear edges on the nose and chin shadows. Outdoor grey-wall background.
```

### Direct and bounced flash

![Direct and bounced flash comparison](/works/portrait-lighting/03.jpg)

The direct-flash example has a visible wall shadow and more direct highlights; bounced light gives gentler tonal transitions. Naming the white ceiling makes the reflection path more specific than the technique name alone.

```text
On-camera direct flash, frontal hard light, with a clear hard shadow on the grey wall behind the subject.
```

```text
Bounce flash reflected from a white ceiling, softly illuminating the face with gradual shadow transitions. Mid-grey background.
```

### Side backlight

![Side backlight comparison](/works/portrait-lighting/04.jpg)

Warm edges on the hair and shoulders separate the subject from the background, while facial detail remains visible.

```text
Golden-hour side backlight. Low warm sunlight comes from the rear right, adding golden edges to hair and shoulders while preserving facial detail.
```

### Top light

![Top light comparison](/works/portrait-lighting/05.jpg)

The eye sockets, underside of the nose and chin become darker while features remain readable. Top light emphasises modelling; a welcoming, bright portrait may call for another choice.

```text
Top light from one lamp directly above the head. Deepen eye-socket and chin shadows while keeping facial features readable. Mid-grey background.
```


## Creative lighting: position and extent

### Two-colour gel light

![Two-colour gel light comparison](/works/portrait-lighting/06.jpg)

Blue and orange appear strongly at the hair and face edges, while the centre stays relatively neutral. The image supports a warm-cool mood, not a strict half-blue, half-orange split.

```text
Two-colour gel lighting: blue on the left, orange on the right, illuminating the respective sides of the face. Mid-grey background.
```

### Blind-pattern projection

![Blind-pattern projection comparison](/works/portrait-lighting/07.jpg)

Parallel bands cross the face and shoulders. Evaluate their position and direction; the same structure can describe other projected patterns.

```text
Hard light from above and to the side passes through blinds, projecting parallel light and dark stripes onto the face and shoulders. Mid-grey background.
```

### Narrow beam

![Narrow beam comparison](/works/portrait-lighting/08.jpg)

The face becomes the brightness centre while the chest and background darken. Check whether the lit area concentrates attention on the face, rather than merely darkening the whole image.

```text
A narrow beam of hard light illuminates only the face, with the chest and background distinctly darker.
```


## Description precision and skin texture

### From a lighting name to an observable result

![From a lighting name to an observable result comparison](/works/portrait-lighting/09.jpg)

The left example uses only “split lighting” in its lighting segment, alongside other subject and skin requirements. The right specifies a hard lamp at 90 degrees left, a dark right half and no fill. This is not a strictly controlled single-variable experiment, but it illustrates the value of concrete directions and visible outcomes.

```text
Split lighting.
```

```text
Split lighting from one hard lamp at 90 degrees on the left. Keep the right half of the face deeply shadowed, with no fill.

Use the reference only for the same person and clothes. Frontal bust portrait, grey background, 3:4. Preserve real skin texture and let T-zone reflections follow the light source.
```

Freckles remain visible and the forehead and nose respond to light, but fine skin texture still appears smooth. Visible freckles do not establish fully realistic pores or microtexture, and the T-zone does not need to be uniformly matte.

The following noise-reduction addition remains a suggestion to test. This image set does not contain an isolated before-and-after comparison for it.

```text
Clean digital imaging, reduce visible noise while preserving fine skin texture.
```

## Reusable prompts and iteration

Combine a lighting name, a direction and one visible result. Add a background only when it matters. After generation, locate the result you specified; if it is absent, revise the corresponding sentence.

```text
[Light type], arriving from [direction], producing [one visible result on the face, background or hair]. [Background].

Real skin texture; T-zone reflections follow the light source naturally.
```

A complete input example:

```text
Direct hard sunlight from the upper left, with clear edges on the nose and chin shadows. Outdoor grey-wall background.

Use the reference only for the same person and clothes. Upper-chest portrait, 3:4. Preserve real skin texture; T-zone reflections follow the light source naturally.
```

Check nose shadows, wall shadows, hair highlights and skin texture again whenever the person, background or generation environment changes. Adjust one area at a time and retain the preceding version for comparison.

## Results and application

The result is nine images, a set of short prompts and a practical observation method. Abstract lighting names become positions and tonal relationships in the image, giving the next revision a concrete target.

These comparisons describe the supplied examples, without implying a universal model success rate. In [character-sheet design](/work/character-consistency), distinguish changes in light from changes in anatomy. For [Ink Realm](/work/ink-realm), extend the review to the continuity of light direction across shots.
