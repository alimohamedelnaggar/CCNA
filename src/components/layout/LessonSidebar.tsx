import { Check, ChevronDown, Circle, CircleCheck, ListTree } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { domains } from '../../data/curriculum'
import { lessons } from '../../data/lessons'
import { useProgress } from '../../hooks/useProgress'

export function LessonSidebar({ topicId }: { topicId: string }) {
  const { isComplete, toggleComplete, completedCount } = useProgress()
  const currentDomain = topicId.split('.')[0]
  const [openDomains, setOpenDomains] = useState<string[]>([currentDomain])

  useEffect(() => {
    setOpenDomains((current) => (current.includes(currentDomain) ? current : [...current, currentDomain]))
  }, [currentDomain])

  const toggleDomain = (id: string) =>
    setOpenDomains((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]))

  return (
    <aside
      dir="rtl"
      className="surface sticky top-[84px] max-h-[calc(100vh-104px)] w-full overflow-y-auto rounded-2xl p-3 lg:w-[290px] lg:shrink-0"
    >
      <div className="mb-3 flex items-center justify-between px-2 py-1.5">
        <div className="flex items-center gap-2 text-slate-200">
          <ListTree size={17} className="text-accent-400" />
          <span className="text-[0.88rem] font-bold">مسار الدورة</span>
        </div>
        <span className="rounded-md bg-accent-500/10 px-2 py-0.5 font-display text-[0.7rem] text-accent-300" dir="ltr">
          {completedCount} done
        </span>
      </div>

      <div className="space-y-1.5">
        {domains.map((domain) => {
          const isOpen = openDomains.includes(domain.id)
          const domainDone = domain.topics.filter((topic) => isComplete(topic.id)).length

          return (
            <div key={domain.id} className="overflow-hidden rounded-xl border border-sky-400/[0.07]">
              <button
                type="button"
                onClick={() => toggleDomain(domain.id)}
                className="flex w-full items-center gap-2 bg-navy-850/70 px-3 py-2.5 text-right transition hover:bg-sky-400/[0.06]"
              >
                <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: domain.accent }} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[0.82rem] font-bold text-slate-200">{domain.titleAr}</span>
                  <span className="block font-mono text-[0.64rem] text-slate-500" dir="ltr">
                    {domain.titleEn} · {domain.weight}%
                  </span>
                </span>
                <span className="font-display text-[0.7rem] text-slate-500" dir="ltr">
                  {domainDone}/{domain.topics.length}
                </span>
                <ChevronDown
                  size={15}
                  className={`shrink-0 text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {isOpen && (
                <div className="space-y-0.5 bg-navy-950/50 p-1.5">
                  {domain.topics.map((topic) => {
                    const isActive = topic.id === topicId
                    const done = isComplete(topic.id)
                    return (
                      <div
                        key={topic.id}
                        className={`group flex items-center gap-1 rounded-lg px-1.5 transition ${
                          isActive ? 'bg-accent-500/12 ring-1 ring-accent-400/25' : 'hover:bg-white/[0.04]'
                        }`}
                      >
                        <Link
                          to={`/lesson/${topic.id}`}
                          className="flex min-w-0 flex-1 items-center gap-2 py-2 text-right"
                          title={topic.titleEn}
                        >
                          <span
                            className={`w-9 shrink-0 font-display text-[0.7rem] font-bold ${isActive ? 'text-accent-300' : 'text-slate-500'}`}
                            dir="ltr"
                          >
                            {topic.id}
                          </span>
                          <span
                            className={`min-w-0 flex-1 truncate text-[0.79rem] ${isActive ? 'font-bold text-slate-100' : 'text-slate-400 group-hover:text-slate-200'}`}
                          >
                            {topic.titleAr}
                          </span>
                          {lessons[topic.id] && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent-400" />}
                        </Link>
                        <button
                          type="button"
                          onClick={() => toggleComplete(topic.id)}
                          className="shrink-0 rounded-md p-1 text-slate-500 transition hover:bg-mint/10 hover:text-mint"
                          title={done ? 'إلغاء علامة الإنجاز' : 'تحديد كمكتمل'}
                          aria-label={done ? `إلغاء إنجاز ${topic.id}` : `تحديد ${topic.id} كمكتمل`}
                        >
                          {done ? <CircleCheck size={15} className="text-mint" /> : <Circle size={15} />}
                        </button>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="mt-3 flex items-start gap-2 rounded-xl border border-sky-400/10 bg-sky-400/[0.04] px-3 py-2.5 text-[0.75rem] leading-relaxed text-slate-400">
        <Check size={14} className="mt-0.5 shrink-0 text-mint" />
        <span>تقدّمك محفوظ تلقائياً في المتصفح عبر LocalStorage.</span>
      </div>
    </aside>
  )
}
