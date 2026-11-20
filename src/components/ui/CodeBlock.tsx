import { Check, Copy, Terminal } from 'lucide-react'
import { useState } from 'react'

interface CodeBlockProps {
  label: string
  code: string
}

export function CodeBlock({ label, code }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="code-surface my-5">
      <div className="flex items-center justify-between gap-3 border-b border-sky-400/10 bg-sky-400/[0.04] px-4 py-2.5">
        <div className="flex min-w-0 items-center gap-2 text-accent-300">
          <Terminal size={15} className="shrink-0" />
          <span className="truncate font-mono text-[0.75rem]" dir="rtl">
            {label}
          </span>
        </div>
        <button
          type="button"
          onClick={copy}
          className="flex shrink-0 items-center gap-1.5 rounded-md border border-sky-400/15 px-2.5 py-1 text-[0.72rem] text-slate-300 transition hover:border-accent-400/40 hover:text-accent-300"
          aria-label="نسخ الأوامر"
        >
          {copied ? <Check size={13} className="text-mint" /> : <Copy size={13} />}
          <span>{copied ? 'اتنسخ' : 'نسخ'}</span>
        </button>
      </div>
      <pre>
        <code>{code}</code>
      </pre>
    </div>
  )
}
