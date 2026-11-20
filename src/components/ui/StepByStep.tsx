import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useState } from 'react'
import { RichText } from './RichText'

interface StepByStepProps {
  items: { title: string; text: string }[]
}

export function StepByStep({ items }: StepByStepProps) {
  const [active, setActive] = useState(0)
  const current = items[active]

  return (
    <div className="my-6 rounded-2xl border border-sky-400/12 bg-navy-900/50 p-4 sm:p-5">
      <div className="mb-5 flex flex-wrap gap-2">
        {items.map((item, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setActive(index)}
            className={`flex h-9 w-9 items-center justify-center rounded-lg border font-display text-sm font-bold transition ${
              index === active
                ? 'border-accent-400/60 bg-accent-500/20 text-accent-300 shadow-[0_0_18px_-6px_rgba(56,189,248,0.8)]'
                : index < active
                  ? 'border-mint/30 bg-mint/10 text-mint'
                  : 'border-sky-400/10 bg-navy-850 text-slate-500 hover:border-sky-400/30'
            }`}
            aria-label={`الخطوة ${index + 1}: ${item.title}`}
          >
            {index + 1}
          </button>
        ))}
      </div>

      <div className="mb-4 h-1 overflow-hidden rounded-full bg-sky-400/10">
        <motion.div
          className="h-full rounded-full bg-gradient-to-l from-accent-400 to-cyan-300"
          animate={{ width: `${((active + 1) / items.length) * 100}%` }}
          transition={{ type: 'spring', stiffness: 220, damping: 26 }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 12 }}
          transition={{ duration: 0.22 }}
          className="min-h-[112px]"
          dir="rtl"
        >
          <h4 className="mb-2 font-bold text-accent-300">{current.title}</h4>
          <p className="text-[0.94rem] leading-[1.95] text-slate-300/90">
            <RichText>{current.text}</RichText>
          </p>
        </motion.div>
      </AnimatePresence>

      <div className="mt-4 flex items-center justify-between border-t border-sky-400/10 pt-3">
        <button
          type="button"
          disabled={active === 0}
          onClick={() => setActive((value) => Math.max(0, value - 1))}
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[0.82rem] text-slate-300 transition hover:bg-sky-400/[0.08] disabled:opacity-30"
        >
          <ArrowRight size={15} /> السابق
        </button>
        <span className="font-display text-[0.75rem] text-slate-500">
          {active + 1} / {items.length}
        </span>
        <button
          type="button"
          disabled={active === items.length - 1}
          onClick={() => setActive((value) => Math.min(items.length - 1, value + 1))}
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[0.82rem] text-accent-300 transition hover:bg-sky-400/[0.08] disabled:opacity-30"
        >
          التالي <ArrowLeft size={15} />
        </button>
      </div>
    </div>
  )
}
