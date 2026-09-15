# Sun Yingjie — original 3D avatar, revision 2

Status: **Technical delivery verified. Personal likeness remains subject to user review.**

The current model is `sun-yingjie-avatar-draft-v2.blend`. The first version remains at `sun-yingjie-avatar-draft.blend`; its renders are preserved in `review-v1/`.

## Source and construction

The original photograph is `D:/OneDrive/桌面/文件/作品集/照片1.jpg`. The user then provided five generated visual references: front, three-quarter, side, back and landscape. Their unmodified files, original paths and SHA256 hashes are archived in `references/user-generated/manifest.json`.

All spatial geometry is original: a continuous head, jaw and neck surface, independent curved eyes with anatomical pivots, ear cartilage, layered dark hair, a substantial torso, folded quarter-zip collar, zipper and knit details. The model is not a photographic plane, a cutout portrait, or a borrowed human mesh. No sen personal character asset is included.

The face, eyes and clothing use UV textures prepared from the user's supplied references. Front facial features blend into sampled side-skin detail; clothing combines front, side and back projections. A separate knit sample covers the folded collar. These are color textures on actual three-dimensional surfaces. Hair uses clean dark materials and authored clumps; the experimental hair projection image in `textures/` is **not used by the delivered model**.

The source views are generated artistic references, not anatomical scans. Their pixels already contain lighting. The resulting textures are not measured albedo, and the side/back geometry is an approximation guided by those references.

## Files

- `sun-yingjie-avatar-draft-v2.blend`: editable parts, embedded textures, four studio lights, semantic anchors and `CameraAction`.
- `../web/public/models/avatar.glb`: **6,803,224 bytes / 6.488 MiB**, 23 mesh nodes, 19 materials, 123,504 exported vertices and 241,898 triangles. Four color textures are embedded; the file has no external texture dependency.
- `../web/public/images/avatar/front.png`, `three-quarter.png`, `side.png`, `back.png`: actual Blender renders, 1200 × 1200, transparent backgrounds.
- `../web/public/images/avatar/multi-angle.png`: 2400 × 2400 neutral-background sheet; front, three-quarter, side and back in reading order.
- `../web/public/images/avatar/before-after-v2.png`: first version on the left, second version on the right, assembled from unmodified front renders.
- `../web/public/images/avatar/turntable.mp4`: 1200 × 1200 H.264 video, 4 seconds, presenting 12 actual rendered angles held for one third of a second each and encoded at 30 fps. It does not contain 120 distinct rendered views.
- `../scripts/avatar/`: original generator, source-evidence bindings, texture preparation and independent validation.

## Revision 2 review

Compared with the first render, the visible neck was shortened, cheeks/jaw widened, eye relief reduced, and the eye opening and mouth rest shape revised. Repetitive fringe locks were replaced with asymmetric overlapping layers. The narrow shirt points became a broad folded knit collar. User-reference skin and fabric detail replaced uniform color on the primary surfaces.

Actual front/three-quarter/side/back renders exposed projection artifacts during work. The final version removes duplicate geometric lips/brows, side-face photographic ear patches, contaminated hair pixels and circular flyaway strands. Head and neck are now one continuous surface, without the earlier disconnected intersection at the back of the jaw. Rear UV seams were corrected per face corner.

**The front result is materially closer to the chosen reference than version 1, but it is not a photo-level reconstruction or an approved personal likeness.** The silhouette, hair and proportions remain stylized approximations. Ear depth, side jaw anatomy, rear head shape, head-to-neck transitions and shoulder/arm definition remain inferred. Compared with the original photograph, the supplied generated side/back views do not constitute independent evidence of real anatomy. Some source lighting and soft color variation remain in the projected skin and knit textures. There is no facial-expression rig, blinking rig, hand geometry or lower body.

## Integration

GLB uses Y-up and faces positive Z. Authoring scale is artistic, not measured human stature. The head was lowered by 0.15 authoring units relative to version 1.

Animation: `CameraAction`, verified 8 seconds with translation and rotation on `Camera`. The private scene uses frames 1–240 at 30 fps.

Anchors: `focus-start`, `focus-1`, `focus-2`, `focus-3`, `focus-works`.

Eye roots: `eye_left | curved sclera`, `eye_right | curved sclera`. Iris/pupil meshes are children. Rotate these two roots only for restrained gaze; eyelids stay attached to the head. Large eye rotations need additional rigging.

The web export batches geometry by material. It is heavier than version 1 because it contains surface textures and more knit/hair detail. Real-device frame rate and thermal behavior have not been measured. Load the GLB on demand, cap pixel ratio and suspend rendering when off screen; review PNG/MP4 assets should not all be downloaded by the homepage.

## Verification

Runtime: Blender **5.0.1** at `D:/blender-5.0.1-windows-x64/blender.exe`. The installed skill's API snapshot is 5.2; actual material/image node sockets and runtime behavior were checked on the selected executable.

`evidence/plan.json` contains source reads and line bindings. `evidence/texture-runtime.json` records observed UV/image node sockets. All generated meshes passed Blender's mesh validation. `evidence/glb-validation.json` independently verifies binary bounds, finite geometry/UVs, valid triangle indices, three-axis depth, independent eyes, anchors, embedded textures and camera animation. `evidence/reopen-report.json` records a fresh process reopening the saved revision 2 file and evaluating five camera poses. `evidence/delivery-v2.json` records final file hashes and image/video properties.

These checks establish artifact structure and persistence. They do not certify personal likeness, scan accuracy or mobile performance.
