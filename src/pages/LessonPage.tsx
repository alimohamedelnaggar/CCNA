import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  ChevronLeft,
  CircleCheck,
  Clock3,
  Compass,
  FlaskConical,
  Layers3,
  ListChecks,
  Package,
  ScanSearch,
  Sparkles,
  Terminal,
  Wrench,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { LessonSidebar } from '../components/layout/LessonSidebar'
import { LessonToc } from '../components/layout/LessonToc'
import { LessonBlockRenderer } from '../components/ui/LessonBlockRenderer'
import { getDomain, getNextTopic, getPreviousTopic, getTopic } from '../data/curriculum'
import { getLesson } from '../data/lessons'
import { useProgress } from '../hooks/useProgress'

const stepIcons: LucideIcon[] = [
  Compass,
  Layers3,
  Package,
  Terminal,
  ScanSearch,
  Wrench,
  FlaskConical,
  ListChecks,
  Sparkles,
]

export function LessonPage() {
  const { topicId = '' } = useParams()
  const topic = getTopic(topicId)
  const domain = getDomain(topicId)
  const lesson = getLesson(topicId)
  const { isComplete, toggleComplete, setLastTopic } = useProgress()

  const previousTopic = getPreviousTopic(topicId)
  const nextTopic = getNextTopic(topicId)

  useEffect(() => {
    if (topic) setLastTopic(topic.id)
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [topicId, topic, setLastTopic])

  const scrollToStep = (index: number) => {
    if (!lesson) return
    const target = lesson.steps[Math.min(Math.max(index, 0), lesson.steps.length - 1)]
    document.getElementById(`step-${target.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  if (!topic || !domain) {
    return (
      <main dir="rtl" className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-slate-100">الموضوع ده مش موجود في الخريطة</h1>
        <Link to="/course" className="mt-5 inline-flex items-center gap-2 text-accent-300">
          ارجع لخريطة الكورس <ArrowLeft size={16} />
        </Link>
      </main>
    )
  }

  const complete = isComplete(topic.id)

  if (!lesson) {
    return (
      <main dir="ltr" className="mx-auto flex max-w-[1500px] gap-6 px-4 py-6 sm:px-6">
        <LessonSidebar topicId={topic.id} />
        <article dir="rtl" className="surface min-w-0 flex-1 rounded-2xl p-6 sm:p-9">
          <nav className="mb-6 flex flex-wrap items-center gap-2 text-[0.78rem] text-slate-500">
            <Link to="/" className="hover:text-accent-300">
              الرئيسية
            </Link>
            <ChevronLeft size={13} />
            <Link to="/course" className="hover:text-accent-300">
              خريطة الكورس
            </Link>
            <ChevronLeft size={13} />
            <span>{domain.titleAr}</span>
          </nav>
          <div className="mb-4 flex items-center gap-2">
            <span className="font-display text-sm font-bold text-accent-300" dir="ltr">
              {topic.id}
            </span>
            <span className="h-1 w-1 rounded-full bg-slate-600" />
            <span className="text-[0.8rem] text-slate-500">{domain.titleAr}</span>
          </div>
          <h1 className="text-[1.9rem] font-extrabold text-slate-50">{topic.titleAr}</h1>
          <p className="mt-2 font-mono text-[0.8rem] text-accent-300/70" dir="ltr">
            {topic.titleEn}
          </p>

          <div className="mt-7 rounded-2xl border border-amber-400/20 bg-amber-400/[0.05] px-5 py-4">
            <h2 className="text-[1rem] font-bold text-amber-200">الشرح الكامل للموضوع ده لسه بيكتب</h2>
            <p className="mt-2 text-[0.9rem] leading-[1.95] text-slate-300">
              عشان نحافظ على دقة المحتوى، الموضوعات اللي لسه مفيهاش شرح مش هتلاقي فيها كلام عام أو حشو. الـ objective الرسمي موجود هنا، والموضوع 1.1 هو أول درس مكتوب بالكامل بتسع خطوات.
            </p>
          </div>

          <div className="mt-6">
            <h3 className="mb-3 flex items-center gap-2 text-[0.95rem] font-bold text-slate-200">
              <ListChecks size={17} className="text-accent-400" /> أهداف الـ blueprint
            </h3>
            {topic.objectives.length > 0 ? (
              <ul className="space-y-2">
                {topic.objectives.map((objective) => (
                  <li key={objective.code} className="flex items-start gap-3 rounded-lg border border-sky-400/10 bg-navy-950/50 px-3.5 py-2.5">
                    <span className="font-display text-[0.75rem] font-bold text-accent-300" dir="ltr">
                      {objective.code}
                    </span>
                    <span className="font-mono text-[0.82rem] text-slate-300" dir="ltr">
                      {objective.text}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="rounded-lg border border-sky-400/10 bg-navy-950/50 px-3.5 py-2.5 font-mono text-[0.82rem] text-slate-300" dir="ltr">
                {topic.titleEn}
              </p>
            )}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/lesson/1.1"
              className="flex items-center gap-2 rounded-xl bg-gradient-to-l from-accent-500 to-electric px-4 py-2.5 text-[0.86rem] font-bold text-white"
            >
              ابدأ بالدرس 1.1 <ArrowLeft size={15} />
            </Link>
            <Link to="/course" className="rounded-xl border border-sky-400/15 px-4 py-2.5 text-[0.86rem] font-bold text-slate-300 hover:border-accent-400/40">
              ارجع للخريطة
            </Link>
          </div>
        </article>
      </main>
    )
  }

  return (
    <main dir="ltr" className="mx-auto flex max-w-[1500px] items-start gap-6 px-4 py-6 sm:px-6">
      <LessonSidebar topicId={topic.id} />

      <div className="min-w-0 flex-1" dir="rtl">
        <nav className="mb-5 flex flex-wrap items-center gap-2 text-[0.78rem] text-slate-500">
          <Link to="/" className="hover:text-accent-300">
            الرئيسية
          </Link>
          <ChevronLeft size={13} />
          <Link to="/course" className="hover:text-accent-300">
            خريطة الكورس
          </Link>
          <ChevronLeft size={13} />
          <Link to={`/lesson/${topic.id}`} className="text-accent-300/80">
            {domain.titleAr}
          </Link>
        </nav>

        <div className="surface relative overflow-hidden rounded-2xl px-5 py-6 sm:px-7">
          <span
            className="absolute -left-16 -top-16 h-40 w-40 rounded-full opacity-10 blur-3xl"
            style={{ background: domain.accent }}
          />
          <div className="relative flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="mb-2 flex flex-wrap items-center gap-2.5">
                <span className="rounded-lg border border-accent-400/30 bg-accent-500/10 px-2.5 py-1 font-display text-[0.78rem] font-bold text-accent-300" dir="ltr">
                  {topic.id}
                </span>
                <span className="text-[0.78rem] text-slate-400">{domain.titleAr}</span>
                <span className="h-1 w-1 rounded-full bg-slate-600" />
                <span className="flex items-center gap-1.5 text-[0.78rem] text-slate-500">
                  <Clock3 size={14} /> {lesson.estimatedTime}
                </span>
              </div>
              <h1 className="text-[1.75rem] font-extrabold leading-tight text-slate-50 sm:text-[2.1rem]">{lesson.title}</h1>
              <p className="mt-2 font-mono text-[0.76rem] text-accent-300/60" dir="ltr">
                {topic.titleEn}
              </p>
              <p className="mt-4 max-w-2xl text-[0.9rem] leading-[1.95] text-slate-400">{lesson.description}</p>
            </div>

            <button
              type="button"
              onClick={() => toggleComplete(topic.id)}
              className={`flex shrink-0 items-center gap-2 rounded-xl border px-4 py-2.5 text-[0.85rem] font-bold transition ${
                complete
                  ? 'border-mint/40 bg-mint/10 text-mint'
                  : 'border-sky-400/20 bg-white/[0.03] text-slate-300 hover:border-accent-400/40 hover:text-accent-300'
              }`}
            >
              {complete ? <CircleCheck size={17} /> : <Check size={17} />}
              {complete ? 'مكتمل' : 'حدّد كمكتمل'}
            </button>
          </div>

          <div className="relative mt-6 grid grid-cols-3 gap-1.5 sm:grid-cols-9">
            {lesson.steps.map((step, index) => (
              <button
                key={step.id}
                type="button"
                onClick={() => scrollToStep(index)}
                className="rounded-lg border border-sky-400/10 bg-navy-950/60 px-1 py-2 text-center transition hover:border-accent-400/40"
                title={step.title}
              >
                <span className="block font-display text-[0.7rem] font-bold text-accent-300" dir="ltr">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="mt-0.5 block truncate text-[0.68rem] text-slate-400">{step.short}</span>
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence initial={false}>
          {lesson.steps.map((step, index) => (
            <motion.section
              key={step.id}
              id={`step-${step.id}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: index * 0.03 }}
              className="surface mt-5 scroll-mt-24 rounded-2xl px-5 py-6 sm:px-7 sm:py-7"
            >
              <div className="mb-5 flex flex-wrap items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-accent-400/30 bg-accent-500/10 font-display text-[0.9rem] font-bold text-accent-300" dir="ltr">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[0.72rem] font-bold uppercase tracking-wider text-accent-400/70">
                    Step {index + 1} / {lesson.steps.length}
                  </p>
                  <h2 className="text-[1.25rem] font-extrabold text-slate-100 sm:text-[1.4rem]">{step.title}</h2>
                </div>
                <span className="rounded-lg bg-white/[0.04] p-2 text-slate-500">
                  {(() => {
                    const Icon = stepIcons[index]
                    return <Icon size={17} />
                  })()}
                </span>
              </div>

              <div className="lesson-prose">
                {step.blocks.map((block, blockIndex) => (
                  <LessonBlockRenderer key={blockIndex} block={block} />
                ))}
              </div>

              <div className="mt-7 flex items-center justify-between border-t border-sky-400/10 pt-4">
                <button
                  type="button"
                  disabled={index === 0}
                  onClick={() => scrollToStep(index - 1)}
                  className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[0.8rem] font-bold text-slate-400 transition hover:bg-sky-400/[0.06] hover:text-accent-300 disabled:opacity-25"
                >
                  <ArrowRight size={15} /> الخطوة السابقة
                </button>
                <span className="font-display text-[0.72rem] text-slate-600" dir="ltr">
                  {index + 1} / {lesson.steps.length}
                </span>
                {index === lesson.steps.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => toggleComplete(topic.id)}
                    className="flex items-center gap-1.5 rounded-lg bg-mint/10 px-3 py-1.5 text-[0.8rem] font-bold text-mint transition hover:bg-mint/20"
                  >
                    <CircleCheck size={15} /> أنهيت الدرس
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => scrollToStep(index + 1)}
                    className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[0.8rem] font-bold text-accent-300 transition hover:bg-sky-400/[0.06]"
                  >
                    الخطوة التالية <ArrowLeft size={15} />
                  </button>
                )}
              </div>
            </motion.section>
          ))}
        </AnimatePresence>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {previousTopic ? (
            <Link to={`/lesson/${previousTopic.id}`} className="surface group rounded-xl p-4 transition hover:border-accent-400/35">
              <span className="flex items-center gap-1.5 text-[0.75rem] text-slate-500">
                <ArrowRight size={14} /> الموضوع السابق
              </span>
              <span className="mt-1.5 flex items-center gap-2 text-[0.9rem] font-bold text-slate-200 group-hover:text-accent-300">
                <span className="font-display text-[0.8rem] text-accent-300" dir="ltr">
                  {previousTopic.id}
                </span>
                {previousTopic.titleAr}
              </span>
            </Link>
          ) : (
            <div className="surface-soft rounded-xl p-4 text-[0.8rem] text-slate-600">مفيش موضوع قبله</div>
          )}
          {nextTopic ? (
            <Link to={`/lesson/${nextTopic.id}`} className="surface group rounded-xl p-4 text-left transition hover:border-accent-400/35">
              <span className="flex items-center gap-1.5 text-[0.75rem] text-slate-500">
                الموضوع التالي <ArrowLeft size={14} />
              </span>
              <span className="mt-1.5 flex items-center gap-2 text-[0.9rem] font-bold text-slate-200 group-hover:text-accent-300">
                <span className="font-display text-[0.8rem] text-accent-300" dir="ltr">
                  {nextTopic.id}
                </span>
                {nextTopic.titleAr}
              </span>
            </Link>
          ) : (
            <div className="surface-soft rounded-xl p-4 text-[0.8rem] text-slate-600">خلصت الخريطة، أحسنت!</div>
          )}
        </div>

        <div className="mt-4 flex items-center justify-center gap-2 text-[0.78rem] text-slate-500">
          <BookOpen size={14} />
          <Link to="/course" className="hover:text-accent-300">
            ارجع لخريطة الكورس
          </Link>
        </div>
      </div>

      <LessonToc steps={lesson.steps} />
    </main>
  )
}
