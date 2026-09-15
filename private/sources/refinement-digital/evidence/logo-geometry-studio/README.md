# 构线 Formline

构线是一个本地优先的几何 Logo 设计器。它把可求解的基础几何与可撤销的光学校正分开保存，让设计师同时检查构造逻辑和最终视觉结果。几何是约束与解释工具，不是审美评分。

## 运行

要求 Node.js 20+，首批验证浏览器为当前 Windows 环境中的 Chrome / Edge。

```powershell
npm install
npm run dev
```

质量检查：

```powershell
npm test
npm run lint
npm run build
npm run test:e2e
```

## 已实现

- 圆、椭圆、矩形、圆角矩形、直线、圆弧、多边形与自由贝塞尔路径；锚点和入/出手柄可数值编辑。
- 图层显隐、锁定、排序、复制、编组，以及可解除的非破坏性布尔节点。
- 网格吸附、标尺、轴线、同心圆、径向线与黄金矩形参考。
- 17 类约束，PlaneGCS Web Worker 求解，修订号 latest-wins，冲突时保留稳定几何。
- 几何 / 最终 / X-Ray 三种视图；每个对象独立保存 `optical` 修正并可一键重置。
- 命名尺寸、自定义数值比例及 1:1、φ、√2、3:2 预设。
- 分项诊断：约束、开放路径、自交采样、近重复圆心、半径漂移、面积质心、四向重量、负空间、最小特征和导出可见性。没有总分。
- 最终 SVG、构造 SVG、透明或带背景 PNG、自定义尺寸 PNG 和工程 JSON。
- IndexedDB 自动保存；导入由 Zod 验证，损坏或未来版本不会覆盖当前工程。
- 原创 `Aperture 01` 示例，不包含 Apple 或附件图形。

## 工程格式

`ProjectDocumentV1` 使用无单位的本地小数，默认 `1000 × 1000` viewBox。业务状态是纯可序列化数据；Paper.js 对象只存在于渲染投影中。参考图使用工程内 Data URL 保存，但永不进入最终 SVG / PNG。

主要目录：

- `src/domain`：工程 Schema、几何投影、诊断、导出与持久化。
- `src/store`：Zustand 命令历史与撤销/重做。
- `src/solver`：PlaneGCS 映射、WASM Worker 和 latest-wins 协调。
- `src/components`：桌面与移动端编辑器界面。
- `docs/research.md`：调研结论、证据边界和产品原则。

## 当前边界

- 第一版不包含字标、云同步、多人协作、AI 位图拟合或任意 SVG 往返编辑。
- 贝塞尔端点切线通过控制边的等价 PlaneGCS 平行约束求解；当前不提供闭合路径任意位置的切线约束。
- 自交、视觉重量和负空间诊断是复核线索，不能替代设计判断。
- Safari 未验证。压力目标和浏览器验收结果记录在 `docs/verification.md`。

第三方版本、许可和 PlaneGCS 源码获取方式见 `THIRD_PARTY_NOTICES.md`；完整 LGPL 文本随应用分发在 `public/licenses/planegcs-LGPL-2.1.txt`。
