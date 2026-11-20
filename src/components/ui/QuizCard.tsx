import { AnimatePresence, motion } from 'framer-motion'
import { Check, Send, X } from 'lucide-react'
import { useState } from 'react'
import type { QuizQuestion } from '../../data/types'
import { QuizDiagram } from './QuizDiagram'
import { RichText } from './RichText'

export function QuizCard({ question, number }: { question: QuizQuestion; number: number }) {
  const multiple = question.kind === 'multiple'
  const submitMode = question.requireSubmit === true
  const correct = question.correctIndices ?? (question.correctIndex !== undefined ? [question.correctIndex] : [])

  const [single, setSingle] = useState<number | null>(null)
  const [multi, setMulti] = useState<number[]>([])
  const [submitted, setSubmitted] = useState(false)

  const ready = multiple ? multi.length > 0 : single !== null
  const answered = submitMode ? submitted : ready
  const isCorrectAnswer = multiple
    ? multi.length === correct.length && multi.every((index) => correct.includes(index))
    : single === (question.correctIndex ?? -1)

  const select = (index: number) => {
    if (answered) return
    if (multiple) {
      setMulti((current) => (current.includes(index) ? current.filter((item) => item !== index) : [...current, index]))
    } else {
      setSingle(index)
    }
  }

  return (
    <div className="my-4 rounded-2xl border border-sky-400/12 bg-navy-900/60 p-5">
      <div className="mb-4 flex items-start gap-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent-500/15 font-display text-sm font-bold text-accent-300">
          {number}
        </span>
        <div className="min-w-0">
          <p className="text-[0.98rem] font-semibold leading-[1.9] text-slate-100">
            <RichText>{question.prompt}</RichText>
          </p>
          {multiple && <p className="mt-1 text-[0.76rem] text-accent-300/80">اختر أكثر من إجابة صحيحة.</p>}
        </div>
      </div>

      {question.diagram && <QuizDiagram variant={question.diagram} />}

      <div className="grid gap-2" dir="rtl">
        {question.options.map((option, index) => {
          const isCorrect = correct.includes(index)
          const isSelected = multiple ? multi.includes(index) : single === index
          let state = 'border-sky-400/10 bg-navy-850/70 hover:border-accent-400/40 hover:bg-sky-400/[0.06]'
          if (answered && isCorrect) state = 'border-emerald-400/50 bg-emerald-400/10 text-emerald-100'
          else if (answered && isSelected) state = 'border-rose-400/50 bg-rose-400/10 text-rose-100'
          else if (answered) state = 'border-sky-400/10 bg-navy-850/40 opacity-55'
          else if (submitMode && isSelected) state = 'border-accent-400/50 bg-accent-500/10 text-accent-100'

          return (
            <button
              key={index}
              type="button"
              disabled={answered}
              onClick={() => select(index)}
              aria-pressed={isSelected}
              className={`flex w-full items-center gap-3 rounded-lg border px-3.5 py-2.5 text-right text-[0.9rem] leading-relaxed transition ${state}`}
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-current/20 font-display text-[0.75rem] opacity-70">
                {String.fromCharCode(65 + index)}
              </span>
              <span className="flex-1">
                <RichText>{option}</RichText>
              </span>
              {answered && isCorrect && <Check size={16} className="shrink-0 text-emerald-300" />}
              {answered && isSelected && !isCorrect && <X size={16} className="shrink-0 text-rose-300" />}
            </button>
          )
        })}
      </div>

      {submitMode && !answered && (
        <button
          type="button"
          disabled={!ready}
          onClick={() => setSubmitted(true)}
          className="mt-4 flex items-center gap-2 rounded-lg bg-gradient-to-l from-accent-500 to-electric px-4 py-2 text-[0.82rem] font-bold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-30"
        >
          تحقق من الإجابة <Send size={14} />
        </button>
      )}

      <AnimatePresence>
        {answered && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
            className={`mt-4 overflow-hidden rounded-lg border-r-2 px-4 py-3 text-[0.88rem] leading-[1.9] ${
              isCorrectAnswer
                ? 'border-emerald-400 bg-emerald-400/[0.06] text-emerald-100/90'
                : 'border-rose-400 bg-rose-400/[0.06] text-rose-100/90'
            }`}
          >
            <strong className="mb-1 block">
              {isCorrectAnswer
                ? 'إجابة صح! أحسنت.'
                : multiple
                  ? 'الإجابة الصح هي الخيارات اللي بالأخضر.'
                  : 'الإجابة الصح هي الخيار اللي بالأخضر.'}
            </strong>
            <RichText>{question.explanation}</RichText>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
