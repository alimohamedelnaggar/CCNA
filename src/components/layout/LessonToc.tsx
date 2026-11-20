import { List } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { LessonStep, StepId } from '../../data/types'

export function LessonToc({ steps }: { steps: LessonStep[] }) {
  const [active, setActive] = useState<StepId | undefined>(steps[0]?.id)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActive(visible[0].target.id.replace('step-', '') as StepId)
      },
      { rootMargin: '-110px 0px -65% 0px', threshold: 0 },
    )

    steps.forEach((step) => {
      const element = document.getElementById(`step-${step.id}`)
      if (element) observer.observe(element)
    })
    return () => observer.disconnect()
  }, [steps])

  const goTo = (id: string) => document.getElementById(`step-${id}`)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <aside dir="rtl" className="sticky top-[84px] hidden w-[210px] shrink-0 xl:block">
      <div className="mb-3 flex items-center gap-2 px-2 text-slate-300">
        <List size={16} className="text-accent-400" />
        <span className="text-[0.85rem] font-bold">محتويات الدرس</span>
      </div>
      <div className="space-y-0.5 border-r border-sky-400/10 pr-3">
        {steps.map((step, index) => {
          const isActive = active === step.id
          return (
            <button
              key={step.id}
              type="button"
              onClick={() => goTo(step.id)}
              className={`relative flex w-full items-start gap-2 rounded-l-lg px-2 py-2 text-right text-[0.79rem] leading-relaxed transition ${
                isActive ? 'bg-accent-500/10 font-bold text-accent-300' : 'text-slate-500 hover:bg-white/[0.03] hover:text-slate-300'
              }`}
            >
              {isActive && <span className="absolute -right-[13px] top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-accent-400" />}
              <span className="font-display text-[0.7rem] opacity-70">{index + 1}</span>
              <span>{step.title}</span>
            </button>
          )
        })}
      </div>
      <div className="mt-5 rounded-xl border border-sky-400/10 bg-sky-400/[0.04] px-3 py-3 text-[0.75rem] leading-relaxed text-slate-400">
        كل درس مقسّم لـ 9 خطوات ثابتة عشان تدرس بنفس الترتيب في كل موضوع.
      </div>
    </aside>
  )
}
