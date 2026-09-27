import { useRef, useState, type ReactNode } from 'react'
import type { Lang } from '../data/workDocs'
import './prompt-block.css'

export function PromptBlock({ children, lang }: { children: ReactNode; lang: Lang }) {
  const content = useRef<HTMLPreElement>(null)
  const [status, setStatus] = useState<'idle' | 'copied' | 'select'>('idle')
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(content.current?.textContent ?? '')
      setStatus('copied')
    } catch {
      if (content.current) {
        const range = document.createRange()
        range.selectNodeContents(content.current)
        const selection = window.getSelection()
        selection?.removeAllRanges()
        selection?.addRange(range)
      }
      setStatus('select')
    }
  }
  return <div className="case-prompt">
    <div className="case-prompt-actions"><button type="button" onClick={copy}>{lang === 'zh' ? '复制提示词' : 'Copy prompt'}</button><span role="status">{status === 'copied' ? (lang === 'zh' ? '已复制' : 'Copied') : status === 'select' ? (lang === 'zh' ? '已选中文本，请手动复制' : 'Text selected; copy manually') : ''}</span></div>
    <pre ref={content} tabIndex={0}>{children}</pre>
  </div>
}
