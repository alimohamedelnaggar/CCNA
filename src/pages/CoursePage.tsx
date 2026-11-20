import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ChevronDown, Circle, CircleCheck, Layers3, ListChecks } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ProgressRing } from '../components/ui/ProgressRing'
import { domains, totalTopics } from '../data/curriculum'
import { lessons } from '../data/lessons'
import { useProgress } from '../hooks/useProgress'

export function CoursePage() {
  const { completedCount, completedSet, toggleComplete } = useProgress()
  const [open, setOpen] = useState<string[]>(['1'])
  const percent = Math.round((completedCount / totalTopics) * 100)

  const toggle = (id: string) => setOpen((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]))

  const jumpTo = (id: string) => {
    setOpen((current) => (current.includes(id) ? current : [...current, id]))
    window.setTimeout(() => document.getElementById(`domain-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 40)
  }

  return (
    <main dir="rtl" className="mx-auto max-w-[1500px] px-4 py-12 sm:px-6">
      <div className="mb-9 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-accent-400/20 bg-accent-500/[0.07] px-3 py-1.5 text-[0.76rem] font-bold text-accent-300">
            <Layers3 size={14} /> خريطة CCNA 200-301 v1.1
          </div>
          <h1 className="text-[2.1rem] font-extrabold leading-tight text-slate-50 sm:text-[2.75rem]">خريطة الكورس الكاملة</h1>
          <p className="mt-3 max-w-2xl text-[0.94rem] leading-[1.95] text-slate-400">
            كل الـ objectives مرتّبة بنفس ترتيب الـ blueprint الرسمي من Cisco. افتح أي دومين، تابع الموضوعات، وحدّد المكتمل منها — تقدّمك هيحفظ نفسه في المتصفح.
          </p>
        </div>

        <div className="surface flex items-center gap-4 rounded-2xl px-5 py-4">
          <ProgressRing value={percent} size={76} stroke={6}>
            <span className="font-display text-lg font-bold text-accent-300">{percent}%</span>
          </ProgressRing>
          <div>
            <p className="text-[0.88rem] font-bold text-slate-200">تقدّمك الحالي</p>
            <p className="mt-1 text-[0.8rem] text-slate-400">
              {completedCount} / {totalTopics} موضوع مكتمل
            </p>
            <button
              type="button"
              onClick={() => setOpen(domains.map((domain) => domain.id))}
              className="mt-2 text-[0.78rem] font-bold text-accent-300 hover:text-accent-200"
            >
              افتح كل الدومينات
            </button>
          </div>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {domains.map((domain) => (
          <button
            key={domain.id}
            type="button"
            onClick={() => jumpTo(domain.id)}
            className="rounded-lg border border-sky-400/12 bg-navy-900/60 px-3 py-2 text-[0.78rem] font-bold text-slate-300 transition hover:border-accent-400/40 hover:text-accent-300"
          >
            <span className="font-display" style={{ color: domain.accent }} dir="ltr">
              {domain.id}.0
            </span>{' '}
            {domain.titleAr}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setOpen([])}
          className="rounded-lg border border-sky-400/12 px-3 py-2 text-[0.78rem] text-slate-500 transition hover:text-slate-300"
        >
          إغلاق الكل
        </button>
      </div>

      <div className="space-y-4">
        {domains.map((domain) => {
          const isOpen = open.includes(domain.id)
          const done = domain.topics.filter((topic) => completedSet.has(topic.id)).length
          const domainPercent = Math.round((done / domain.topics.length) * 100)

          return (
            <section
              key={domain.id}
              id={`domain-${domain.id}`}
              className="surface scroll-mt-24 overflow-hidden rounded-2xl"
            >
              <button
                type="button"
                onClick={() => toggle(domain.id)}
                className="flex w-full items-center gap-4 px-4 py-4 text-right transition hover:bg-sky-400/[0.04] sm:px-6"
              >
                <span
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border font-display text-[1rem] font-bold"
                  style={{ borderColor: `${domain.accent}50`, background: `${domain.accent}14`, color: domain.accent }}
                  dir="ltr"
                >
                  {domain.id}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="text-[1.02rem] font-bold text-slate-100">{domain.titleAr}</span>
                    <span className="rounded-full px-2 py-0.5 font-display text-[0.7rem] font-bold" style={{ background: `${domain.accent}1c`, color: domain.accent }} dir="ltr">
                      {domain.weight}%
                    </span>
                  </span>
                  <span className="mt-0.5 block truncate font-mono text-[0.73rem] text-slate-500" dir="ltr">
                    {domain.titleEn}
                  </span>
                </span>
                <span className="hidden w-32 sm:block">
                  <span className="mb-1 block text-left font-display text-[0.7rem] text-slate-500" dir="ltr">
                    {done}/{domain.topics.length}
                  </span>
                  <span className="block h-1.5 overflow-hidden rounded-full bg-sky-400/10">
                    <motion.span
                      className="block h-full rounded-full"
                      style={{ background: domain.accent }}
                      animate={{ width: `${domainPercent}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </span>
                </span>
                <ChevronDown size={18} className={`shrink-0 text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.28 }}
                    className="overflow-hidden border-t border-sky-400/10"
                  >
                    <div className="grid gap-2 p-3 sm:p-4">
                      {domain.topics.map((topic) => {
                        const available = Boolean(lessons[topic.id])
                        const complete = completedSet.has(topic.id)
                        return (
                          <div
                            key={topic.id}
                            className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 transition sm:px-4 ${
                              complete
                                ? 'border-mint/20 bg-mint/[0.04]'
                                : 'border-sky-400/[0.08] bg-navy-950/40 hover:border-accent-400/25 hover:bg-sky-400/[0.04]'
                            }`}
                          >
                            <span className="w-10 shrink-0 font-display text-[0.8rem] font-bold text-accent-300/70" dir="ltr">
                              {topic.id}
                            </span>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-[0.88rem] font-bold text-slate-200">{topic.titleAr}</p>
                              <p className="truncate font-mono text-[0.7rem] text-slate-500" dir="ltr" title={topic.titleEn}>
                                {topic.titleEn}
                              </p>
                            </div>
                            <span
                              className={`hidden shrink-0 rounded-md px-2 py-1 text-[0.7rem] font-bold sm:block ${
                                available ? 'bg-accent-500/12 text-accent-300' : 'bg-white/[0.04] text-slate-500'
                              }`}
                            >
                              {available ? 'درس جاهز' : 'قريباً'}
                            </span>
                            <button
                              type="button"
                              onClick={() => toggleComplete(topic.id)}
                              className="shrink-0 rounded-lg p-1.5 text-slate-500 transition hover:bg-mint/10 hover:text-mint"
                              aria-label={complete ? `إلغاء إنجاز ${topic.id}` : `تحديد ${topic.id} كمكتمل`}
                            >
                              {complete ? <CircleCheck size={18} className="text-mint" /> : <Circle size={18} />}
                            </button>
                            <Link
                              to={`/lesson/${topic.id}`}
                              className="flex shrink-0 items-center gap-1 rounded-lg border border-sky-400/15 px-2.5 py-1.5 text-[0.75rem] font-bold text-slate-300 transition hover:border-accent-400/40 hover:text-accent-300"
                            >
                              افتح <ArrowLeft size={13} />
                            </Link>
                          </div>
                        )
                      })}
                    </div>
                    <div className="flex items-center gap-2 border-t border-sky-400/[0.07] bg-sky-400/[0.02] px-4 py-2.5 text-[0.75rem] text-slate-500">
                      <ListChecks size={14} />
                      {domain.description}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </section>
          )
        })}
      </div>
    </main>
  )
}
