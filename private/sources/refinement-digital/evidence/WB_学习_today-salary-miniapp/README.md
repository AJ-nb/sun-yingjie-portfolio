# 薪跳 · 微信小程序

> 有点怪，还挺有用。

**薪跳**：打开就知道今天已经赚了多少。

- **首页 = 实时工资主体**（Salary First），不是二级入口：今日已赚金额第一视觉，
  依次是工作 Tag + 倒计时、今日进度、三列统计、「查看今日明细」。
- 金额只由工资核心产出，**真实时间是唯一计算依据**：心跳只决定多久重算一次，
  从不后台累加；跨零点夜班不会在 00:00 清零。
- 桌上的小玩意（Tool Window，双列）目前只有 **反悔币**，Registry 驱动，后续可直接加。
- IP「面包机小怪」10 姿态透明 PNG，`desk-monster` 是全局唯一角色出口。

- 原生微信小程序 + TypeScript，非网页缩小版、非 WebView、非桌面端模拟
- 工资计算核心迁移自 [PayDance](https://github.com/MrBaoboer/PayDance)（`src/lib/salary/`，AGPL-3.0-only），保持平台无关；本产品不是 PayDance 官方产品
- 数据只写本机：无账号、无登录、无云同步、无广告、无任何权限申请

## V2 增量升级

- 一级导航只有 **今天 / 日子**；设置从右上角进入，反悔币保留在首页「桌上小玩意」。
- 首页继续以实时工资为第一视觉，并增加中性倍率、工资速度、到点确认、独立加班段与事件节点提醒。
- 「日子」提供极简薪资月历、月度三项汇总与薪资小票；日期格只放日期、实际收入、倍率 Badge 和小型心情标记。
- 点击日期进入 Daily Capsule，可查看实际收入、有效工时、正常收入、加班时长与工资估算，并记录五档面包机心情和 40 字短句。
- 日期类型独立建模为普通工作日、休息日、法定节假日、调休补班和用户覆盖。2026 数据已按国务院公告更新；2027–2028 标为预估，可由用户逐日覆盖。
- 本地 Storage Schema 为 **v4**，会迁移旧薪资配置与历史数据，并增加 Day Record、加班规则、节假日开关、调休余额、提醒偏好、心情和短句索引。
- 当前提醒为应用内提醒。微信订阅消息尚未接入，因为还没有可用的消息模板 ID；接入后也必须由用户主动点击单次提醒入口再申请授权。

## 在微信开发者工具中运行

1. 微信开发者工具 → 导入项目
2. 目录选择本仓库根目录（**不是** `miniprogram/`）
3. AppID 选「测试号」或填自己的 AppID
4. 自动读取 `project.config.json`（`miniprogramRoot: miniprogram/`，已开启 TypeScript 编译插件）
5. 启动即进入首页并显示实时工资；未配置时会落到三步引导

> 无需联网：小程序不发任何网络请求，开发者工具里不需要配置域名。

## 命令

```bash
npm install

npm run typecheck   # TypeScript 类型检查（含小程序全局类型、noUnusedLocals）
npm test            # 单元测试（295 项 / 15 个文件）
npm run build       # 构建校验：类型 + 结构 + 导入解析 + 架构约束 + 包体积
npm run verify      # 以上三项依次执行
```

## 目录结构

```
miniprogram/
├── core/                       # 平台无关（禁 wx / Page / Storage / UI）
│   ├── salary/                 # 原实时工资核心：快照 / 工时段 / 夜班 / 校验（迁移自 PayDance）
│   ├── calendar/               # 日期类型、年度节假日数据与逐日覆盖
│   ├── overtime/               # 加班倍率、到点确认与跨午夜估算
│   ├── records/                # Day Record、月历、月度小票、心情事实统计
│   ├── reminders/              # 平台无关的应用内提醒节点
│   ├── presentation/           # Presentation：真实时间 → 界面语言（workState / 文案 / 层级）
│   ├── format/                 # 金额 / 时长 / 倒计时格式化（不依赖 Intl）
│   └── state/                  # 偏好与本地存储 Schema 归一化（v4，向前兼容迁移）
├── modules/
│   └── tools/                  # Tool Registry：新增工具 = 新分包模块 + 一条 Manifest
├── design/
│   └── tokens.ts               # 品牌设计令牌 v2.0
├── services/                   # 微信能力唯一出口：存储 / 时钟 / 主题 / 视图模型装配
├── components/                 # 主包共享组件
│   ├── desk-monster/           # IP V3：10 姿态 + 姿态 crossfade + 贴地椭圆
│   ├── rolling-amount/         # 里程表式金额（等宽数字列，不左右跳位）
│   ├── status-tag/             # 工作状态 Tag
│   ├── doodle-button/          # 品牌按钮（primary / secondary / plain）
│   ├── tool-icon/              # 手绘图标（纯 WXSS）
│   └── page-shell/             # 页面骨架（状态栏 / 返回 / 标题）
├── pages/                      # 主包：home / calendar / daily-capsule / settings / about
├── packages/
│   ├── salary/                 # 实时工资：onboarding / salary-detail / settings
│   └── regret-coin/            # 反悔币：index + coin / choice-input + domain 状态机
└── assets/
    └── ip/                     # 10 姿态 PNG-8（老内核兼容，不用 WebP）
        └── poses/              # 单套 320px，所有展示尺寸复用
```

## 兼容红线（有测试守护，别破）

- 不用 flex 间距属性、不用 grid 布局（老 X5 / iOS 内核）；双列一律负 margin + `calc(50% - N)`。
- 图片只用 PNG，不用 WebP；不用 `lazy-load`（fixed 容器内不触发，会白屏）。
- 不用 3D 变换做硬币翻面（改两段 `scaleX`）。
- `ignoreUploadUnusedFiles: false`（动态拼接的资源路径不能被裁）。

## 新增第三个 Tool

1. 创建 `packages/tool-03/`（pages / components / domain）
2. 在 `modules/tools/registry.ts` 的 `TOOLS` 数组追加一条 Manifest
3. 在 `app.json` 的 `subpackages` 登记分包路由

首页 Tool Window、关于页署名会自动出现，无需改任何主包页面。

## FAQ

### 微信开发者工具提示「WAAutoService.js / WAServiceMainContext.js preload 未使用」

这是**微信开发者工具 IDE 自身注入**的两个本地脚本，仅在「真机调试 / 自动预览」模式出现
（URL 来自 IDE 本地代理 `http://127.0.0.1:xxxx/`），与项目代码无关：

- 不影响真机运行与生产发布；`as` 属性无法从项目侧修复。
- 消除方式：关闭 IDE 的真机调试自动注入，或升级到 3.16.2+ 的开发者工具。

### 「手机上组件大量丢失」如何排查

1. 页面引用的**自定义组件没在 page.json 的 `usingComponents` 注册**。
2. **分包路由**相对路径写错，导致分包页面找不到主包组件（统一用 `/components/...` 绝对路径）。
3. `tests/layout-guard.test.ts` 守护四条兼容红线：gap / grid / webp / lazy-load。

## 法律

- 工资计算核心源自 PayDance（GNU AGPL-3.0-only），署名见 `NOTICE.md` 与「关于」页。
- 追加条款见 `legal/ADDITIONAL_TERMS.md`（**上线前需法务确认**）。
- 本仓库其余代码为「薪跳」项目原创。
