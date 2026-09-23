import { useId, useReducer, useState } from 'react'
import { motion } from 'framer-motion'
import { copy, experiments, initialReview, initialTasks, resumeSamples, reviewReducer, taskReducer, type Experiment, type ExperimentLang } from '../data/experiments'
import { asset } from '../data/workDocs'
import './case-experiments.css'

type Props = { slug: string; lang: ExperimentLang; reduced?: boolean }
const text = (lang: ExperimentLang, zh: string, en: string) => lang === 'zh' ? zh : en
const easing = [0.23, 1, 0.32, 1] as const
const annotations = {
  summer: [{ x: 59, y: 49, zh: '商品：绿色包袋以真实体积突出于平面道具。', en: 'Product: the green bag brings real volume against flat props.' }, { x: 36, y: 72, zh: '道具：鱼竿与折叠椅连接前后景。', en: 'Props: rod and folding chair connect foreground and background.' }, { x: 73, y: 31, zh: '背景：放射线与色块将观看方向引向场景内部。', en: 'Background: radiating lines and colour fields direct attention inward.' }],
  autumn: [{ x: 78, y: 66, zh: '商品：橙色包袋落在鱼形道具的前侧。', en: 'Product: an orange bag sits in front of the fish prop.' }, { x: 70, y: 53, zh: '道具：放大的鱼形穿过门框，形成错位尺度。', en: 'Prop: an oversized fish crosses the frame, creating unexpected scale.' }, { x: 29, y: 33, zh: '背景：墙面与装饰门框为复杂前景提供稳定基底。', en: 'Background: the wall and doorway anchor the complex foreground.' }],
  winter: [{ x: 83, y: 79, zh: '商品：黄色包袋形成蓝白场景中的色彩停靠点。', en: 'Product: the yellow bag creates a colour accent in a blue-and-white scene.' }, { x: 59, y: 37, zh: '道具：层叠马形通过轮廓与接触阴影呈现深度。', en: 'Prop: horse layers establish depth through contours and contact shadows.' }, { x: 73, y: 65, zh: '背景：蓝色留白将前景的白色轮廓分离。', en: 'Background: blue space separates the white foreground silhouettes.' }],
  structure: [{ x: 59, y: 34, zh: '外壳：分离的外形件说明包覆关系。', en: 'Housing: separated exterior parts reveal the enclosing relationship.' }, { x: 73, y: 76, zh: '履带区域：原图中的行走部件组织。', en: 'Track area: the locomotion components as arranged in the source image.' }, { x: 39, y: 77, zh: '作业端：前向部件与主体保持明显方向关系。', en: 'Working end: the forward components give the body a clear direction.' }],
}

function WorkflowDemo({ lang }: { lang: ExperimentLang }) {
  const [tasks, dispatch] = useReducer(taskReducer, undefined, initialTasks)
  const started = tasks.some(task => task.status !== 'queued')
  const hasFailed = tasks.some(task => task.status === 'failed')
  const done = tasks.filter(task => task.status === 'success').length
  return <div className="ce-workflow" data-testid="batch-demo">
    <div className="ce-demo-heading"><span>{text(lang, '固定样例 / 批次状态', 'FIXED FIXTURE / BATCH STATE')}</span><strong aria-live="polite">{done} / 3 {text(lang, '已保留', 'retained')}</strong></div>
    <ol className="ce-task-list">
      {tasks.map(task => <li key={task.id} className={`ce-task ce-task--${task.status}`} data-task={task.id} data-status={task.status} data-result={task.result ?? ''}>
        <div className="ce-task-heading"><span className="ce-task-letter">{task.id}</span><span>{task.status === 'queued' ? text(lang, '等待演示', 'Ready') : task.status === 'failed' ? text(lang, '模拟失败', 'Simulated failure') : text(lang, '结果保留', 'Result retained')}</span></div>
        <div className="ce-task-art" aria-hidden="true"><i /><i /><i /><span>{task.status === 'success' ? '✓' : task.status === 'failed' ? '!' : '·'}</span></div>
        <p>{task.result ? text(lang, `样例结果 ${task.id} · 版本1`, `Fixture ${task.id} · version 1`) : task.status === 'failed' ? text(lang, '等待手动补全', 'Awaiting manual recovery') : text(lang, '尚无结果', 'No output yet')}</p>
        <small>{text(lang, '尝试次数', 'Attempts')} <b>{task.attempts}</b></small>
      </li>)}
    </ol>
    <div className="ce-actions">
      {!started && <button type="button" className="ce-primary" onClick={() => dispatch('run')}>{text(lang, '演示一次部分失败', 'Simulate a partial failure')} <span aria-hidden="true">↗</span></button>}
      {hasFailed && <button type="button" className="ce-primary" onClick={() => dispatch('retry')}>{text(lang, '只补全失败项 C', 'Recover failed item C only')} <span aria-hidden="true">↻</span></button>}
      {started && <button type="button" onClick={() => dispatch('reset')}>{text(lang, '重置批次', 'Reset batch')}</button>}
    </div>
    <p className="ce-feedback" role="status">{!started ? text(lang, '三个位置独立记录。点击开始观察恢复机制。', 'Three positions are tracked independently. Start to explore recovery.') : hasFailed ? text(lang, 'A、B已完成；C等待补全。成功项不会重新运行。', 'A and B completed; C awaits recovery. Completed items are not rerun.') : text(lang, 'C已补全；A、B的结果与尝试次数保持不变。', 'C recovered; A and B retain their results and attempt counts.')}</p>
  </div>
}

function ResumeDemo({ lang }: { lang: ExperimentLang }) {
  const [state, dispatch] = useReducer(reviewReducer, undefined, initialReview)
  const [index, setIndex] = useState(0)
  const sample = resumeSamples[index]
  const choice = state.choices[index]
  return <div className="ce-review" data-testid="review-demo">
    <div className="ce-demo-heading"><span>{text(lang, '虚构简历 / 审阅工作台', 'FICTIONAL RÉSUMÉ / REVIEW DESK')}</span><strong>{state.choices.filter(item => item !== 'pending').length} / 3</strong></div>
    <div className="ce-review-layout">
      <div>
        <div className="ce-small-tabs" role="group" aria-label={text(lang, '选择改写建议', 'Choose a suggestion')}>{resumeSamples.map((item, itemIndex) => <button type="button" key={itemIndex} aria-pressed={index === itemIndex} onClick={() => setIndex(itemIndex)}>{String(itemIndex + 1).padStart(2, '0')} {copy(item.label, lang)}</button>)}</div>
        <div className="ce-diff">
          <div><span className="ce-field-label">{text(lang, '原文', 'ORIGINAL')}</span><p>{copy(sample.original, lang)}</p></div>
          <div className="ce-diff-suggestion"><span className="ce-field-label">{text(lang, '建议', 'SUGGESTION')}</span><p>{copy(sample.suggestion, lang)}</p></div>
        </div>
        <p className="ce-reason">{copy(sample.reason, lang)}</p>
        <div className="ce-actions">
          <button type="button" className="ce-primary" disabled={choice !== 'pending'} onClick={() => dispatch({ type: 'accept', index })}>{text(lang, '接受建议', 'Accept suggestion')}</button>
          <button type="button" disabled={choice !== 'pending'} onClick={() => dispatch({ type: 'reject', index })}>{text(lang, '保留原文', 'Keep original')}</button>
          <button type="button" disabled={!state.history.length} onClick={() => dispatch({ type: 'undo' })}>{text(lang, '撤销最近决定', 'Undo last decision')}</button>
        </div>
        <p role="status" className="ce-feedback">{choice === 'pending' ? text(lang, '尚未决定：当前简历仍保留原文。', 'Pending: the current résumé still contains the original.') : choice === 'accepted' ? text(lang, '已接受：右侧简历已更新，可撤销。', 'Accepted: the current résumé is updated. You can undo this.') : text(lang, '已拒绝建议：原文保持不变，可撤销。', 'Suggestion rejected: the original remains. You can undo this.')}</p>
      </div>
      <aside className="ce-resume-paper" aria-label={text(lang, '当前简历样例', 'Current résumé sample')}>
        <div className="ce-resume-paper-header"><span>{text(lang, '林同学', 'Lin · Student')}</span><small>{text(lang, '虚构样例', 'FICTIONAL SAMPLE')}</small></div>
        <span className="ce-field-label">{text(lang, '校园项目 / 当前版本', 'CAMPUS PROJECT / CURRENT VERSION')}</span>
        {resumeSamples.map((item, itemIndex) => <p key={itemIndex} data-choice={state.choices[itemIndex]}><span aria-hidden="true">{String(itemIndex + 1).padStart(2, '0')}</span>{copy(state.choices[itemIndex] === 'accepted' ? item.suggestion : item.original, lang)}</p>)}
        <button type="button" className="ce-text-button" onClick={() => { dispatch({ type: 'reset' }); setIndex(0) }}>{text(lang, '重置全部建议 ↺', 'Reset all suggestions ↺')}</button>
      </aside>
    </div>
  </div>
}

function LogoChecks({ image, lang }: { image: string; lang: ExperimentLang }) {
  const [inverse, setInverse] = useState(false)
  return <div className={`ce-logo-checks${inverse ? ' is-inverse' : ''}`}>
    <div className="ce-demo-heading"><span>{text(lang, '选定字体标志方向 / 完整字标尺寸检查', 'Selected wordmark direction / full-width size check')}</span><button type="button" aria-pressed={inverse} onClick={() => setInverse(value => !value)}>{text(lang, '黑白反转', 'Invert colours')} <span aria-hidden="true">◐</span></button></div>
    <div className="ce-logo-sizes">{[64, 128, 256].map(size => <figure key={size}><div className="ce-wordmark-size" style={{ width: size }}><img src={asset(image)} alt={text(lang, `${size}像素宽的完整 PERIASTRA 字体标志`, `Full PERIASTRA wordmark at ${size} CSS pixels wide`)} loading="lazy" decoding="async" /></div><figcaption>{size}px</figcaption></figure>)}</div>
    <p>{text(lang, '固定检查 2026-06-09 选定方向研究稿，完整显示名称。宽度为 CSS 像素；上方可独立比较历史方案。', 'This check uses the selected 9 June 2026 wordmark direction in full. Widths are CSS pixels; historical alternatives can be compared above.')}</p>
  </div>
}

function ExperimentBody({ experiment, lang, reduced }: { experiment: Experiment; lang: ExperimentLang; reduced: boolean }) {
  const [index, setIndex] = useState(0)
  const [focus, setFocus] = useState<number | null>(null)
  const [keyboard, setKeyboard] = useState(false)
  const [loadFailed, setLoadFailed] = useState(false)
  const id = useId()
  const view = experiment.views[index]
  const marks = experiment.slug === 'hermes' ? annotations[view.id as 'summer' | 'autumn' | 'winter'] : experiment.slug === 'plumber' && view.id === 'structure' ? annotations.structure : null
  const select = (next: number) => { setIndex(next); setFocus(null); setLoadFailed(false) }
  const duration = reduced || keyboard ? 0 : 0.24
  const digital = ['biyuan', 'lensflow', 'resume-formatter'].includes(experiment.slug)
  return <section className={`case-experiment ce-${experiment.slug}${digital ? ' ce-digital' : ''}`} aria-labelledby={`${id}-heading`} onPointerDownCapture={() => setKeyboard(false)} onKeyDownCapture={() => setKeyboard(true)} data-experiment={experiment.slug}>
    <header className="ce-header"><span className="ce-eyebrow">{text(lang, '设计如何形成', 'DESIGN, UNFOLDED')} <i aria-hidden="true">/</i> {experiment.number}</span><h2 id={`${id}-heading`}>{copy(experiment.title, lang)}</h2><p>{copy(experiment.intro, lang)}</p></header>
    <div className="ce-workbench">
      <div className="ce-controls"><div className="ce-selector" role="group" aria-label={text(lang, '探索设计视角', 'Explore design views')}>{experiment.views.map((item, itemIndex) => <button type="button" key={item.id} aria-pressed={index === itemIndex} aria-controls={`${id}-view`} onClick={() => select(itemIndex)}><span>{copy(item.label, lang)}</span>{index === itemIndex && <motion.i layoutId={`${id}-active`} aria-hidden="true" transition={{ duration, ease: easing }} />}</button>)}</div><button type="button" className="ce-reset" aria-label={text(lang, '重置视角', 'Reset view')} onClick={() => select(0)}>↺ <span>{text(lang, '重置', 'Reset')}</span></button></div>
      <div className="ce-main" id={`${id}-view`}>
        <figure className="ce-figure">
          <div className={`ce-image-stage${marks ? ' has-hotspots' : ''}`}>
            {loadFailed ? <div className="ce-image-error"><span aria-hidden="true">□</span><p>{text(lang, '此图暂时无法载入，设计说明仍可阅读。', 'This image could not load. The design explanation remains available.')}</p><button type="button" onClick={() => setLoadFailed(false)}>{text(lang, '重新加载图片', 'Retry image')}</button></div> : <motion.div key={view.image} className="ce-image-inner" initial={reduced || keyboard ? false : { opacity: 0.4 }} animate={{ opacity: 1 }} transition={{ duration, ease: easing }}>
              <img src={asset(view.image)} alt={copy(view.caption, lang)} loading="lazy" decoding="async" onError={() => setLoadFailed(true)} />
              {marks && marks.map((mark, markIndex) => <button type="button" key={markIndex} className={`ce-hotspot${focus === markIndex ? ' is-active' : ''}`} style={{ left: `${mark.x}%`, top: `${mark.y}%` }} onClick={() => setFocus(focus === markIndex ? null : markIndex)} aria-pressed={focus === markIndex} aria-label={text(lang, mark.zh, mark.en)} aria-describedby={focus === markIndex ? `${id}-annotation` : undefined}>{markIndex + 1}</button>)}
            </motion.div>}
          </div>
          <figcaption><span>{String(index + 1).padStart(2, '0')}</span>{copy(view.caption, lang)}</figcaption>
          {marks && <div className="ce-annotation" id={`${id}-annotation`} role="status"><span aria-hidden="true">{focus === null ? '+' : String(focus + 1).padStart(2, '0')}</span><p>{focus === null ? text(lang, '选择图中编号，查看构成关系。', 'Select a numbered point to inspect the composition.') : text(lang, marks[focus].zh, marks[focus].en)}</p></div>}
        </figure>
        <div className="ce-reading">
          <span className="ce-field-label">{text(lang, '当前观察', 'CURRENT OBSERVATION')}</span>
          <motion.div key={view.id} initial={reduced || keyboard ? false : { opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration, ease: easing }} aria-live="polite"><h3>{copy(view.title, lang)}</h3><p>{copy(view.body, lang)}</p></motion.div>
          {experiment.slug === 'lighting' && <div className="ce-shared-language"><span>{text(lang, '共同语言', 'SHARED LANGUAGE')}</span><p>{text(lang, '重复截面', 'Repeated section')}<br />{text(lang, '线性发光面', 'Linear light surface')}<br />{text(lang, '金属表面', 'Metal finish')}</p></div>}
          {experiment.slug === 'huhu-care' && <ol className="ce-contact-path" aria-label={text(lang, '概念接触点', 'Concept touchpoints')}>{[text(lang, '理解动作', 'Understand'), text(lang, '引导呼气', 'Guide exhalation'), text(lang, '反馈与整理', 'Feedback & reset')].map((label, itemIndex) => <li key={label} data-active={itemIndex === index}><span>{String(itemIndex + 1).padStart(2, '0')}</span>{label}</li>)}</ol>}
          {experiment.views.length > 1 && <div className="ce-navigation"><button type="button" onClick={() => select(Math.max(0, index - 1))} disabled={index === 0} aria-label={text(lang, '上一视角', 'Previous view')}>←</button><span aria-live="polite">{String(index + 1).padStart(2, '0')} <i>/</i> {String(experiment.views.length).padStart(2, '0')}</span><button type="button" onClick={() => select(Math.min(experiment.views.length - 1, index + 1))} disabled={index === experiment.views.length - 1} aria-label={text(lang, '下一视角', 'Next view')}>→</button></div>}
        </div>
      </div>
      {experiment.slug === 'periastra' && <LogoChecks image={experiment.views[0].image} lang={lang} />}
      {experiment.slug === 'lensflow' && <WorkflowDemo lang={lang} />}
      {experiment.slug === 'resume-formatter' && <ResumeDemo lang={lang} />}
    </div>
    <div className="ce-boundary" role="note"><span aria-hidden="true">↳</span><p>{copy(experiment.boundary, lang)}</p></div>
  </section>
}

export default function CaseExperiment({ slug, lang, reduced = false }: Props) {
  const experiment = experiments[slug]
  return experiment ? <ExperimentBody key={slug} experiment={experiment} lang={lang} reduced={reduced} /> : null
}
