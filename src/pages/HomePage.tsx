import { motion } from 'framer-motion'
import {
  ArrowLeft,
  BookOpen,
  Bot,
  CheckCircle2,
  CirclePlay,
  GitBranch,
  Network,
  Route,
  Server,
  ShieldCheck,
  Sparkles,
  Wifi,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ProgressRing } from '../components/ui/ProgressRing'
import { allTopics, domains, totalTopics } from '../data/curriculum'
import { lessons } from '../data/lessons'
import { useProgress } from '../hooks/useProgress'

const domainIcons: LucideIcon[] = [Network, Wifi, Route, Server, ShieldCheck, Bot]

const teachingPoints = [
  'إيه اللي بيحصل وليه',
  'الآلية والتشبيه',
  'على مستوى الحزمة',
  'إعداد Cisco IOS',
  'أوامر التحقق',
  'الأخطاء وحلّها',
  'لاب Packet Tracer',
  'أسئلة الامتحان',
  'الخلاصة',
]

function HeroNetwork() {
  const center = { x: 200, y: 150 }
  const nodes = [
    { x: 68, y: 62, label: 'PC', color: '#38bdf8' },
    { x: 336, y: 62, label: 'SW', color: '#60a5fa' },
    { x: 60, y: 238, label: 'AP', color: '#34d399' },
    { x: 340, y: 238, label: 'FW', color: '#fb7185' },
  ]

  return (
    <div className="relative mx-auto w-full max-w-[470px]" dir="ltr">
      <div className="surface relative overflow-hidden rounded-[28px] p-4">
        <div className="diagram-grid absolute inset-0 opacity-60" />
        <svg viewBox="0 0 400 300" className="relative h-auto w-full" role="img" aria-label="Network topology illustration">
          <defs>
            <radialGradient id="core-glow">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
            </radialGradient>
          </defs>

          <circle cx={center.x} cy={center.y} r="105" fill="url(#core-glow)" />
          {[65, 100, 138].map((radius, index) => (
            <motion.circle
              key={radius}
              cx={center.x}
              cy={center.y}
              r={radius}
              fill="none"
              stroke="rgba(56,189,248,0.16)"
              strokeWidth="1"
              strokeDasharray="3 7"
              animate={{ rotate: index % 2 === 0 ? 360 : -360 }}
              transition={{ duration: 28 + index * 8, repeat: Infinity, ease: 'linear' }}
              style={{ transformOrigin: `${center.x}px ${center.y}px` }}
            />
          ))}

          {nodes.map((node, index) => (
            <g key={node.label}>
              <line x1={center.x} y1={center.y} x2={node.x} y2={node.y} stroke={node.color} strokeOpacity="0.22" strokeWidth="1.5" />
              <motion.circle
                r="4"
                fill={node.color}
                animate={{
                  cx: [center.x, node.x, center.x],
                  cy: [center.y, node.y, center.y],
                  opacity: [0, 1, 0],
                }}
                transition={{ duration: 2.8, repeat: Infinity, delay: index * 0.6, ease: 'easeInOut' }}
              />
              <circle cx={node.x} cy={node.y} r="21" fill="#0a1730" stroke={node.color} strokeOpacity="0.7" strokeWidth="1.5" />
              <text x={node.x} y={node.y + 4} textAnchor="middle" fill={node.color} fontFamily="JetBrains Mono, monospace" fontSize="11" fontWeight="700">
                {node.label}
              </text>
            </g>
          ))}

          <motion.circle
            cx={center.x}
            cy={center.y}
            r="35"
            fill="#0b1c3c"
            stroke="#38bdf8"
            strokeWidth="2"
            animate={{ filter: ['drop-shadow(0 0 6px #38bdf866)', 'drop-shadow(0 0 20px #38bdf8aa)', 'drop-shadow(0 0 6px #38bdf866)'] }}
            transition={{ duration: 2.6, repeat: Infinity }}
          />
          <text x={center.x} y={center.y - 2} textAnchor="middle" fill="#7dd3fc" fontFamily="JetBrains Mono, monospace" fontSize="10" fontWeight="700">
            R1
          </text>
          <text x={center.x} y={center.y + 12} textAnchor="middle" fill="#94a3b8" fontFamily="JetBrains Mono, monospace" fontSize="7">
            ROUTER
          </text>
        </svg>

        <div className="absolute bottom-3 left-3 rounded-lg border border-sky-400/15 bg-navy-950/85 px-3 py-1.5 font-mono text-[0.68rem] text-accent-300 backdrop-blur">
          TCP/IP · OSPF · VLAN · NAT
        </div>
      </div>
    </div>
  )
}

export function HomePage() {
  const { completedCount, completedSet, lastTopicId } = useProgress()
  const percent = Math.round((completedCount / totalTopics) * 100)

  const continueTarget =
    lastTopicId && allTopics.some((topic) => topic.id === lastTopicId)
      ? lastTopicId
      : (allTopics.find((topic) => lessons[topic.id] && !completedSet.has(topic.id))?.id ?? '1.1')

  return (
    <main dir="rtl">
      <section className="mx-auto grid max-w-[1500px] items-center gap-10 px-4 pb-12 pt-14 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:pt-20">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent-400/25 bg-accent-500/[0.08] px-3.5 py-1.5 text-[0.78rem] font-bold text-accent-300"
          >
            <Sparkles size={14} />
            CCNA 200-301 v1.1 · مسار كامل
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="glow-text text-[2.4rem] font-extrabold leading-[1.35] sm:text-[3.4rem]"
          >
            ادرس الشبكات<span className="text-accent-400">.</span>
            <br />
            افهمها مش بس تحفظها
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12 }}
            className="mt-5 max-w-xl text-[1rem] leading-[2] text-slate-300/90 sm:text-[1.06rem]"
          >
            كورس CCNA 200-301 بترتيب الـ blueprint الرسمي، بشرح بالعربية المصرية ورسوم متحركة بتوضّح إزاي البيانات بتتمشّي فعلياً في الشبكة. كل موضوع مقسّم لتسع خطوات واضحة: من الفكرة لحد لاب الـ Packet Tracer وأسئلة الامتحان.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.18 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <Link
              to={`/lesson/${continueTarget}`}
              className="group flex items-center gap-2 rounded-xl bg-gradient-to-l from-accent-500 to-electric px-5 py-3 text-[0.92rem] font-bold text-white shadow-[0_12px_35px_-12px_rgba(56,189,248,0.9)] transition hover:brightness-110"
            >
              <CirclePlay size={18} />
              أكمل التعلّم
              <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
            </Link>
            <Link
              to="/course"
              className="flex items-center gap-2 rounded-xl border border-sky-400/20 bg-white/[0.03] px-5 py-3 text-[0.92rem] font-bold text-slate-200 transition hover:border-accent-400/50 hover:text-accent-300"
            >
              <BookOpen size={18} />
              استعرض خريطة الكورس
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-3 text-[0.82rem] text-slate-400"
          >
            <span className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-mint" /> مفيش تسجيل أو صداع
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-mint" /> التقدّم محفوظ تلقائياً
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-mint" /> كل المفاهيم بصور متحركة
            </span>
          </motion.div>
        </div>

        <HeroNetwork />
      </section>

      <section className="mx-auto max-w-[1500px] px-4 sm:px-6">
        <div className="surface grid grid-cols-2 gap-px overflow-hidden rounded-2xl sm:grid-cols-4">
          {[
            { value: '6', label: 'دومينات رئيسية' },
            { value: String(totalTopics), label: 'موضوع من الـ blueprint' },
            { value: '9', label: 'خطوات لكل درس' },
            { value: '9/9', label: 'خطوات تدريس لكل موضوع' },
          ].map((stat) => (
            <div key={stat.label} className="bg-navy-900/60 px-5 py-6 text-center">
              <div className="font-display text-2xl font-bold text-accent-300" dir="ltr">
                {stat.value}
              </div>
              <div className="mt-1 text-[0.78rem] text-slate-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1500px] px-4 py-14 sm:px-6">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-100">الدومينات الستة</h2>
            <p className="mt-1 text-[0.88rem] text-slate-400">نفس ترتيب وأوزان امتحان CCNA 200-301.</p>
          </div>
          <Link to="/course" className="flex items-center gap-1.5 text-[0.85rem] font-bold text-accent-300 hover:text-accent-200">
            كل الدومينات <ArrowLeft size={15} />
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {domains.map((domain, index) => {
            const Icon = domainIcons[index]
            const done = domain.topics.filter((topic) => completedSet.has(topic.id)).length
            const domainPercent = Math.round((done / domain.topics.length) * 100)
            return (
              <Link
                key={domain.id}
                to="/course"
                className="surface group relative overflow-hidden rounded-2xl p-5 transition hover:-translate-y-1 hover:border-accent-400/35"
              >
                <span
                  className="absolute -left-10 -top-10 h-32 w-32 rounded-full opacity-[0.12] blur-2xl transition group-hover:opacity-25"
                  style={{ background: domain.accent }}
                />
                <div className="relative flex items-start justify-between">
                  <span
                    className="flex h-11 w-11 items-center justify-center rounded-xl border"
                    style={{ borderColor: `${domain.accent}55`, background: `${domain.accent}18`, color: domain.accent }}
                  >
                    <Icon size={21} strokeWidth={1.8} />
                  </span>
                  <span className="rounded-full border border-sky-400/15 bg-navy-950/60 px-2.5 py-1 font-display text-[0.75rem] font-bold" style={{ color: domain.accent }} dir="ltr">
                    {domain.weight}%
                  </span>
                </div>
                <h3 className="relative mt-4 text-[1.05rem] font-bold text-slate-100">{domain.titleAr}</h3>
                <p className="relative mt-0.5 font-mono text-[0.72rem]" dir="ltr" style={{ color: `${domain.accent}bb` }}>
                  {domain.id}.0 {domain.titleEn}
                </p>
                <p className="relative mt-3 text-[0.83rem] leading-relaxed text-slate-400">{domain.description}</p>
                <div className="relative mt-4 flex items-center gap-3">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-sky-400/10">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: domain.accent }}
                      initial={{ width: 0 }}
                      animate={{ width: `${domainPercent}%` }}
                      transition={{ duration: 0.7, delay: index * 0.06 }}
                    />
                  </div>
                  <span className="font-display text-[0.72rem] text-slate-500" dir="ltr">
                    {done}/{domain.topics.length}
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      <section className="mx-auto max-w-[1500px] px-4 pb-6 sm:px-6">
        <div className="surface grid gap-6 overflow-hidden rounded-3xl p-6 sm:p-8 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 text-accent-300">
              <GitBranch size={17} />
              <span className="text-[0.8rem] font-bold">خريطة التعلّم</span>
            </div>
            <h2 className="text-2xl font-extrabold text-slate-100">من الأساسيات لحد الأتمتة</h2>
            <p className="mt-2 max-w-lg text-[0.9rem] leading-[1.95] text-slate-400">
              ابدأ بفهم الأجهزة والكابلات،ادخل على VLANs والـ STP، وبعدين التوجيه والخدمات، والأمان، وخلّص بالأتمتة. كل خطوة بتتبني اللي قبلها.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {domains.map((domain, index) => (
                <span
                  key={domain.id}
                  className="rounded-lg border px-2.5 py-1.5 font-mono text-[0.72rem]"
                  style={{ borderColor: `${domain.accent}40`, color: domain.accent, background: `${domain.accent}0d` }}
                >
                  {index + 1}. {domain.titleEn}
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-center gap-2" dir="ltr">
            <ProgressRing value={percent} size={124} stroke={9}>
              <span className="font-display text-2xl font-bold text-accent-300">{percent}%</span>
              <span className="text-[0.68rem] text-slate-500">مكتمل</span>
            </ProgressRing>
            <div className="space-y-2 text-[0.82rem]" dir="rtl">
              <p className="text-slate-300">
                أنجزت <strong className="text-accent-300">{completedCount}</strong> من {totalTopics} موضوع
              </p>
              <p className="text-slate-500">الموضوع الجاهز حالياً بالشرح الكامل: 1.1</p>
              <Link to={`/lesson/${continueTarget}`} className="inline-flex items-center gap-1.5 font-bold text-accent-300 hover:text-accent-200">
                تابع من هنا <ArrowLeft size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1500px] px-4 py-12 sm:px-6">
        <h2 className="mb-7 text-center text-2xl font-extrabold text-slate-100">كل درس بيتعلّم بنفس النظام</h2>
        <div className="grid gap-2.5 sm:grid-cols-3 lg:grid-cols-5">
          {teachingPoints.map((point, index) => (
            <div key={point} className="surface-soft flex items-center gap-3 rounded-xl px-3.5 py-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-accent-500/12 font-display text-[0.75rem] font-bold text-accent-300">
                {index + 1}
              </span>
              <span className="text-[0.8rem] text-slate-300">{point}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
