import type { Lang } from './workDocs'
import publication from './publication.json'

export const DEEP_CASES = publication.selected.map(item => item.slug)
export const chapterIdeas: Record<string, Record<Lang, { word: string; question: string; detail: string }>> = {
  windows: { zh: { word: '空间的秩序', question: '让商品，成为故事的主角。', detail: '在道具、色彩与观看距离之间，组织前景、中景和背景。' }, en: { word: 'Space', question: 'Give the object a place in the story.', detail: 'Props, color and viewing distance establish the foreground, middle ground and background.' } },
  lighting: { zh: { word: '光的形态', question: '一种截面，怎样长成一个系列？', detail: '从型材与发光面出发，观察支撑、方向与空间的变化。' }, en: { word: 'Light', question: 'How does one profile become a family?', detail: 'Follow an extrusion and its luminous surface through changes in support, direction and setting.' } },
  products: { zh: { word: '物的关系', question: '形态，回应怎样的使用？', detail: '把角色、动作和部件放在一起，解释产品为什么这样组织。' }, en: { word: 'Objects', question: 'What kind of use gives form its meaning?', detail: 'Bring people, actions and components together to explain the organization of a product.' } },
  rendering: { zh: { word: '材料的表情', question: '让光线，说清材料。', detail: '通过表面、边缘与接触关系，观察一张图如何建立体积和尺度。' }, en: { word: 'Material', question: 'Let the light describe the material.', detail: 'Surface, edges and contact reveal how an image communicates volume and scale.' } },
  brands: { zh: { word: '识别的规则', question: '把一个想法，放进不同尺度。', detail: '从图形母题到负形、载体与应用，寻找品牌持续成立的规则。' }, en: { word: 'Identity', question: 'An idea, at different scales.', detail: 'From a graphic motif to negative space and applications, find the rules that hold an identity together.' } },
  ai: { zh: { word: '体验的逻辑', question: '让判断，进入可操作的流程。', detail: '在输入、确认、反馈与恢复之间，保留使用者的选择。' }, en: { word: 'Experience', question: 'Make judgment part of the workflow.', detail: 'Keep the user in control of input, review, feedback and recovery.' } },
}

export function mediaLabel(src: string, lang: Lang): string {
  const kind = src.includes('/ai-v3/') ? 'ai' : src.endsWith('.svg') ? 'diagram' : src.includes('/documents/') || src.includes('/psd-') ? 'board' : /\/digital\/|refinement-brand|refinement-digital/.test(src) ? 'screen' : 'original'
  const labels = { ai: ['AI辅助概念表现', 'AI-assisted concept image'], diagram: ['设计说明图', 'Design diagram'], board: ['原始项目展板', 'Original project board'], screen: ['界面与流程记录', 'Interface / workflow record'], original: ['原始项目图', 'Original project visual'] }
  return labels[kind][lang === 'zh' ? 0 : 1]
}

export function relatedCases(slug: string): string[] {
  const relations: Record<string, string[]> = {
    hermes: ['lighting', 'arcteryx'], lighting: ['hermes', 'periastra'], plumber: ['huhu-care', 'lensflow'],
    'huhu-care': ['plumber', 'resume-formatter'], biyuan: ['periastra', 'lensflow'], periastra: ['lighting', 'biyuan'],
    lensflow: ['resume-formatter', 'biyuan'], 'resume-formatter': ['lensflow', 'xintiao'],
  }
  return relations[slug] ?? ['periastra', 'lensflow'].filter(value => value !== slug)
}
