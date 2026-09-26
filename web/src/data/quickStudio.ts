export const QUICK_STUDIO = {
  path: '/tools/quick-studio',
  url: 'https://quick-studio-web.vercel.app/',
  guide: 'https://quick-studio-web.vercel.app/guide.html',
  title: { zh: 'Quick Studio · 服装视觉工作台', en: 'Quick Studio · Garment visual workbench' },
  summary: {
    zh: '上传商品正背面，生成模特上身图，经人工审核后整理成可交付文件。视频按需追加。',
    en: 'Upload garment front and back references, generate on-model imagery, review it, and package approved files. Add video when needed.',
  },
  steps: [
    { zh: ['准备商品', '选择上装、下装、套装或连衣裙。正面与背面是基础输入，其他视角按任务补充。'], en: ['Prepare the garment', 'Choose tops, bottoms, sets or dresses. Front and back references are required; other views depend on the task.'] },
    { zh: ['先试一张', '配置自己的图片 API、Key 和模型。选择模特与取景，点击生成后才发送请求。'], en: ['Make one proof', 'Connect your image API, key and model. Choose the model appearance and framing; requests start only when you submit.'] },
    { zh: ['审核与定稿', '对照实拍检查商品一致性、Logo、裁切构图和清晰度，人工确认后再交付。'], en: ['Review and approve', 'Compare against references for garment fidelity, logo, framing and clarity. A person approves every final image.'] },
    { zh: ['整理交付', '按需拼接详情长图，下载客户成品 ZIP；需要视频时再进入分镜、生成与审核。'], en: ['Package the delivery', 'Optionally stitch a detail image and download the client ZIP. Continue to storyboard, generate and review video only when needed.'] },
  ],
} as const
