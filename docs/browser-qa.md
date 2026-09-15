# 第二轮网站检查

生产预览检查完成于 2026-09-15T02:37:44.165Z：15/15 通过，普通流程异常数 0。
当前入口SHA256：`d2b30315b24b98a24ab988d99266a1f0111081ef5d4f5ac1997b67556e85456d`。构建选择246项素材，共111,631,869字节。

| 检查 | 结果 |
|---|---|
| All catalog cards and every thumbnail decode | 通过 |
| All categories match source counts; normalized query; empty-state reset | 通过 |
| All deep routes load and every case image decodes | 通过 |
| Malformed and missing case routes show the fallback and recover | 通过 |
| Case next/back preserves filter, query and scroll; browser forward/back | 通过 |
| Cross-page about/contact/top anchors reach their target | 通过 |
| Keyboard lightbox: next/previous, zoom, Escape and focus restoration | 通过 |
| Video metadata and muted playback advance | 通过 |
| Language changes home/case copy and URL; both PDFs download | 通过 |
| 320/390/1440 widths: home, index, case and English have no horizontal overflow | 通过 |
| Reduced motion makes no Three or GLB request until explicit click | 通过 |
| Normal motion loads a live GLB scene; poster remains visible during delayed GLB | 通过 |
| Failed model request restores the static portrait | 通过 |
| sen gallery has six ordered chapters, accessible stops, mobile fallback and reverse scroll | 通过 |
| No unexpected console errors or uncaught page errors in functional checks | 通过 |

独立普通动态专项复核 7/7 通过：详情离场保持原位置，下一案例重新入场，返回保留筛选与搜索；641/680/700像素中英文顶部导航和章节按钮可用。专项检查屏蔽GLB；实际模型加载、延迟和失败回退由上述整站检查覆盖。

独立审阅修复了详情缺少离场、性能检测仅采样一次、641–700像素底栏重叠，以及详情离场期间头部提前变更导致的101像素跳动。复看最终页面后还修正了静态人物手机裁切偏移，并调整网页中性填光。

截图包括桌面实时首屏、手机静态首屏、六章和五个履历节点，已人工查看。完整测量记录保存在browser-results-r2.json、sen-route-review-r2.json；复现脚本为scripts/qa/browser-qa.mjs与scripts/qa/sen-route-review.mjs。

环境为隔离的桌面Chrome与模拟视口，未等同于实体手机、Safari、屏幕阅读器或真实移动GPU/电池测试。视频为静音播放检查；人物相似度需要用户决定。构建仍有两个超过500kB的JS模块提示，3D模块延迟加载，未把构建大小等同实测性能。

远端访问、下载与新检出的验证单独记录，不以本地成功推断公开访问。
