import { AlertTriangle, Info, Lightbulb, ShieldAlert } from 'lucide-react'
import type { CalloutTone } from '../../data/types'
import { RichText } from './RichText'

const tones: Record<CalloutTone, { icon: typeof Info; classes: string; label: string }> = {
  info: {
    icon: Info,
    classes: 'border-sky-400/25 bg-sky-400/[0.07] text-sky-200',
    label: 'معلومة',
  },
  tip: {
    icon: Lightbulb,
    classes: 'border-emerald-400/25 bg-emerald-400/[0.06] text-emerald-200',
    label: 'نصيحة',
  },
  warning: {
    icon: AlertTriangle,
    classes: 'border-amber-400/25 bg-amber-400/[0.06] text-amber-200',
    label: 'انتبه',
  },
  danger: {
    icon: ShieldAlert,
    classes: 'border-rose-400/25 bg-rose-400/[0.06] text-rose-200',
    label: 'خطأ شائع',
  },
}

export function Callout({ tone, title, text }: { tone: CalloutTone; title: string; text: string }) {
  const { icon: Icon, classes, label } = tones[tone]

  return (
    <aside className={`my-5 flex gap-3 rounded-xl border px-4 py-3.5 text-[0.94rem] leading-[1.9] ${classes}`}>
      <Icon size={19} className="mt-1 shrink-0" />
      <div>
        <div className="mb-0.5 flex items-center gap-2">
          <span className="text-[0.7rem] font-bold uppercase tracking-wider opacity-60">{label}</span>
          <span className="opacity-30">•</span>
          <strong className="font-bold">{title}</strong>
        </div>
        <p className="text-slate-200/90">
          <RichText>{text}</RichText>
        </p>
      </div>
    </aside>
  )
}
