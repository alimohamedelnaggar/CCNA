import { motion } from 'framer-motion'
import { Pause, Play, RotateCcw, SkipBack, SkipForward } from 'lucide-react'
import { useEffect, useState, type ReactNode } from 'react'
import { RichText } from '../ui/RichText'
import { LinkLine } from './ArchitectureDiagrams'
import { SvgText } from './FiberDiagrams'

interface StepPlayback {
  stage: number
  playing: boolean
  toggle: () => void
  next: () => void
  previous: () => void
  reset: () => void
}

function useStepPlayback(length: number): StepPlayback {
  const [stage, setStage] = useState(0)
  const [playing, setPlaying] = useState(false)
  useEffect(() => {
    if (!playing) return
    const timer = window.setInterval(() => setStage((current) => (current + 1) % length), 2500)
    return () => window.clearInterval(timer)
  }, [playing, length])
  return {
    stage,
    playing,
    toggle: () => setPlaying((value) => !value),
    next: () => setStage((current) => (current + 1) % length),
    previous: () => setStage((current) => (current - 1 + length) % length),
    reset: () => {
      setPlaying(false)
      setStage(0)
    },
  }
}

function StepControls({ playback }: { playback: StepPlayback }) {
  const base = 'flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[0.75rem] transition'
  return (
    <div className="flex flex-wrap items-center gap-2">
      <button type="button" onClick={playback.toggle} className={`${base} border-accent-400/30 bg-accent-500/10 font-bold text-accent-300 hover:bg-accent-500/20`}>
        {playback.playing ? <Pause size={13} /> : <Play size={13} />}
        {playback.playing ? 'إيقاف' : 'شغّل'}
      </button>
      <button type="button" onClick={playback.previous} className={`${base} border-sky-400/15 text-slate-300 hover:border-accent-400/40`}><SkipBack size={13} /> السابق</button>
      <button type="button" onClick={playback.next} className={`${base} border-sky-400/15 text-slate-300 hover:border-accent-400/40`}><SkipForward size={13} /> التالي</button>
      <button type="button" onClick={playback.reset} className={`${base} border-sky-400/15 text-slate-300 hover:border-accent-400/40`}><RotateCcw size={13} /> إعادة</button>
    </div>
  )
}

function StepShell({ title, playback, legend, children }: { title: string; playback: StepPlayback; legend: string; children: ReactNode }) {
  return (
    <div className="my-6 overflow-hidden rounded-2xl border border-sky-400/12 bg-navy-950/70">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-sky-400/10 px-4 py-3">
        <span className="font-display text-[0.78rem] font-bold text-slate-300" dir="ltr">{title}</span>
        <StepControls playback={playback} />
      </div>
      <div className="diagram-grid overflow-x-auto px-2 py-4" dir="ltr">{children}</div>
      <div className="border-t border-sky-400/10 bg-sky-400/[0.03] px-4 py-3 text-[0.85rem] leading-[1.9] text-slate-300" dir="rtl">
        <span className="ml-2 rounded bg-accent-500/15 px-1.5 py-0.5 font-display text-[0.7rem] font-bold text-accent-300" dir="ltr">{playback.stage + 1}</span>
        <RichText>{legend}</RichText>
      </div>
    </div>
  )
}

interface Choice {
  id: string
  label: string
}

function ChoiceButtons({ items, selected, onSelect }: { items: Choice[]; selected: string; onSelect: (id: string) => void }) {
  const base = 'rounded-lg border px-2.5 py-1.5 text-[0.74rem] transition'
  return (
    <div className="flex flex-wrap items-center gap-2">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onSelect(item.id)}
          className={`${base} ${selected === item.id ? 'border-accent-400/50 bg-accent-500/15 font-bold text-accent-200' : 'border-sky-400/15 text-slate-300 hover:border-accent-400/40'}`}
          dir="ltr"
        >
          {item.label}
        </button>
      ))}
    </div>
  )
}

function ChoiceShell({ title, controls, legend, children }: { title: string; controls: ReactNode; legend: string; children: ReactNode }) {
  return (
    <div className="my-6 overflow-hidden rounded-2xl border border-sky-400/12 bg-navy-950/70">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-sky-400/10 px-4 py-3">
        <span className="font-display text-[0.78rem] font-bold text-slate-300" dir="ltr">{title}</span>
        <div dir="rtl">{controls}</div>
      </div>
      <div className="diagram-grid overflow-x-auto px-2 py-4" dir="ltr">{children}</div>
      <motion.div key={legend} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="border-t border-sky-400/10 bg-sky-400/[0.03] px-4 py-3 text-[0.85rem] leading-[1.9] text-slate-300" dir="rtl">
        <RichText>{legend}</RichText>
      </motion.div>
    </div>
  )
}

function Box({ x, y, w, h, title, sub, color, active = false }: { x: number; y: number; w: number; h: number; title: string; sub: string; color: string; active?: boolean }) {
  return (
    <g opacity={active ? 1 : 0.4}>
      <rect x={x} y={y} width={w} height={h} rx="11" fill="#0b1224" stroke={color} strokeWidth={active ? 2.2 : 1.2} />
      <SvgText x={x + w / 2} y={y + 25} color={color} size={10} bold>{title}</SvgText>
      <SvgText x={x + w / 2} y={y + 45} color="#cbd5e1" size={8.3}>{sub}</SvgText>
    </g>
  )
}

function Badge({ x, y, text, color = '#38bdf8', active = true, w = 500 }: { x: number; y: number; text: string; color?: string; active?: boolean; w?: number }) {
  return (
    <g opacity={active ? 1 : 0.38}>
      <rect x={x} y={y} width={w} height={24} rx="7" fill="#0a1730" stroke={color} strokeWidth={active ? 1.8 : 1} />
      <SvgText x={x + w / 2} y={y + 16} color={color} size={8} bold>{text}</SvgText>
    </g>
  )
}

function FlowDot({ x1, y1, x2, y2, color, active }: { x1: number; y1: number; x2: number; y2: number; color: string; active: boolean }) {
  return (
    <motion.circle
      r={7}
      fill={color}
      initial={false}
      animate={active ? { cx: [x1, x2], cy: [y1, y2], opacity: [0.25, 1, 0.25] } : { cx: x1, cy: y1, opacity: 0.22 }}
      transition={{ duration: 1.9, repeat: active ? Infinity : 0, ease: 'easeInOut' }}
    />
  )
}

function ClickNode({ x, y, w, h, title, sub, color, selected, onClick }: {
  x: number
  y: number
  w: number
  h: number
  title: string
  sub: string
  color: string
  selected: boolean
  onClick: () => void
}) {
  return (
    <motion.g
      role="button"
      tabIndex={0}
      aria-pressed={selected}
      onClick={onClick}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onClick()
        }
      }}
      className="cursor-pointer"
      animate={{ opacity: selected ? 1 : 0.56 }}
      transition={{ duration: 0.25 }}
    >
      <rect x={x} y={y} width={w} height={h} rx="9" fill="#0b1224" stroke={selected ? '#f59e0b' : color} strokeWidth={selected ? 2.5 : 1.2} />
      {selected && <rect x={x - 3} y={y - 3} width={w + 6} height={h + 6} rx="11" fill="none" stroke="#f59e0b" strokeOpacity="0.35" strokeWidth="1.5" />}
      <SvgText x={x + w / 2} y={y + 25} color={selected ? '#fbbf24' : color} size={8.8} bold>{title}</SvgText>
      <SvgText x={x + w / 2} y={y + h - 11} color="#cbd5e1" size={7.2}>{sub}</SvgText>
    </motion.g>
  )
}

interface InfoItem {
  id: string
  label: string
  sub: string
  detail: string
  color: string
}

function gridLayout(columns: number, count: number) {
  const gapX = columns === 4 ? 222 : columns === 2 ? 430 : 300
  const width = columns === 4 ? 195 : columns === 2 ? 390 : 275
  const startX = columns === 4 ? 18 : columns === 2 ? 60 : 45
  return { gapX, width, startX, rows: Math.ceil(count / columns) }
}

function SelectorBoard({ items, selected, onSelect, focusTitle, columns = 3 }: {
  items: InfoItem[]
  selected: string
  onSelect: (id: string) => void
  focusTitle: string
  columns?: number
}) {
  const item = items.find((entry) => entry.id === selected) ?? items[0]
  const { gapX, width, startX } = gridLayout(columns, items.length)
  return (
    <svg viewBox="0 0 920 400" className="h-auto w-full min-w-[880px]" role="img" aria-label={`${focusTitle} interactive selector`}>
      <Badge x={190} y={16} text={focusTitle} color="#a78bfa" active w={540} />
      {items.map((entry, index) => {
        const col = index % columns
        const row = Math.floor(index / columns)
        return (
          <ClickNode
            key={entry.id}
            x={startX + col * gapX}
            y={100 + row * 82}
            w={width}
            h={66}
            title={entry.label}
            sub={entry.sub}
            color={entry.color}
            selected={entry.id === selected}
            onClick={() => onSelect(entry.id)}
          />
        )
      })}
      <Badge x={55} y={350} text={`SELECTED: ${item.label} - ${item.sub}`} color={item.color} active w={810} />
    </svg>
  )
}

function StageBoard({ stages, stage, ariaLabel }: { stages: string[]; stage: number; ariaLabel: string }) {
  const columns = Math.min(4, stages.length)
  const gapX = columns === 4 ? 220 : 420
  const width = columns === 4 ? 195 : 300
  const startX = columns === 4 ? 20 : 110
  return (
    <svg viewBox="0 0 920 400" className="h-auto w-full min-w-[880px]" role="img" aria-label={ariaLabel}>
      {stages.map((label, index) => {
        const col = index % columns
        const row = Math.floor(index / columns)
        const x = startX + col * gapX
        const y = 92 + row * 85
        const done = index < stage
        const active = index === stage
        return (
          <motion.g key={label} animate={{ opacity: active ? 1 : done ? 0.78 : 0.4 }} transition={{ duration: 0.3 }}>
            <rect x={x} y={y} width={width} height={62} rx="9" fill="#0b1224" stroke={active ? '#f59e0b' : done ? '#34d399' : '#475569'} strokeWidth={active ? 2.4 : 1.2} />
            <SvgText x={x + width / 2} y={y + 25} color={active ? '#fbbf24' : done ? '#6ee7b7' : '#cbd5e1'} size={8.2} bold>{label}</SvgText>
            <SvgText x={x + width / 2} y={y + 46} color="#94a3b8" size={7.2}>{active ? 'current stage' : done ? 'completed' : 'upcoming'}</SvgText>
          </motion.g>
        )
      })}
      <Badge x={185} y={350} text="Educational simulation - fictional patterns only, no real passwords" color="#fb7185" active w={550} />
    </svg>
  )
}

interface VerdictItem extends InfoItem {
  verdict: 'risk' | 'stronger'
}

function VerdictBoard({ items, selected, onSelect, focusTitle }: {
  items: VerdictItem[]
  selected: string
  onSelect: (id: string) => void
  focusTitle: string
}) {
  const item = items.find((entry) => entry.id === selected) ?? items[0]
  const { gapX, width, startX } = gridLayout(2, items.length)
  return (
    <svg viewBox="0 0 920 400" className="h-auto w-full min-w-[880px]" role="img" aria-label={`${focusTitle} interactive decision`}>
      <Badge x={190} y={16} text={focusTitle} color="#a78bfa" active w={540} />
      {items.map((entry, index) => {
        const col = index % 2
        const row = Math.floor(index / 2)
        return (
          <ClickNode
            key={entry.id}
            x={startX + col * gapX}
            y={100 + row * 82}
            w={width}
            h={66}
            title={entry.label}
            sub={entry.sub}
            color={entry.color}
            selected={entry.id === selected}
            onClick={() => onSelect(entry.id)}
          />
        )
      })}
      <Badge x={55} y={350} text={`EVALUATION: ${item.verdict === 'risk' ? 'ضعيف / خطر' : 'أقوى / أفضل'} - ${item.label}`} color={item.verdict === 'risk' ? '#fb7185' : '#34d399'} active w={810} />
    </svg>
  )
}

interface LabOption {
  id: string
  label: string
  correct: boolean
  detail: string
}

interface LabScenario {
  prompt: string
  options: LabOption[]
  hint: string
}

function ScenarioLab({ title, scenarios, ariaLabel }: { title: string; scenarios: LabScenario[]; ariaLabel: string }) {
  const [stage, setStage] = useState(0)
  const [picked, setPicked] = useState<string | null>(null)
  const scenario = scenarios[stage]
  const option = scenario.options.find((entry) => entry.id === picked)
  const navBase = 'flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[0.75rem] transition'
  const optionBase = 'rounded-lg border px-3 py-2 text-[0.8rem] transition'

  return (
    <div className="my-6 overflow-hidden rounded-2xl border border-sky-400/12 bg-navy-950/70">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-sky-400/10 px-4 py-3">
        <span className="font-display text-[0.78rem] font-bold text-slate-300" dir="ltr">{title}</span>
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" onClick={() => { setStage((current) => (current - 1 + scenarios.length) % scenarios.length); setPicked(null) }} className={`${navBase} border-sky-400/15 text-slate-300 hover:border-accent-400/40`}><SkipBack size={13} /> السابق</button>
          <button type="button" onClick={() => { setStage((current) => (current + 1) % scenarios.length); setPicked(null) }} className={`${navBase} border-sky-400/15 text-slate-300 hover:border-accent-400/40`}><SkipForward size={13} /> التالي</button>
          <button type="button" onClick={() => { setStage(0); setPicked(null) }} className={`${navBase} border-sky-400/15 text-slate-300 hover:border-accent-400/40`}><RotateCcw size={13} /> إعادة</button>
        </div>
      </div>
      <div className="diagram-grid overflow-x-auto px-2 py-4" dir="ltr">
        <StageBoard stages={scenarios.map((_, index) => `Case ${index + 1}`)} stage={stage} ariaLabel={ariaLabel} />
      </div>
      <div className="flex flex-wrap gap-2 border-t border-sky-400/10 px-4 py-3" dir="rtl">
        {scenario.options.map((entry) => (
          <button
            key={entry.id}
            type="button"
            aria-pressed={picked === entry.id}
            onClick={() => setPicked(entry.id)}
            className={`${optionBase} ${picked === entry.id ? 'border-accent-400/50 bg-accent-500/15 font-bold text-accent-200' : 'border-sky-400/15 text-slate-300 hover:border-accent-400/40'}`}
            dir="ltr"
          >
            {entry.label}
          </button>
        ))}
      </div>
      <motion.div key={`${stage}-${picked ?? 'none'}`} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="border-t border-sky-400/10 bg-sky-400/[0.03] px-4 py-3 text-[0.85rem] leading-[1.9] text-slate-300" dir="rtl">
        <span className="ml-2 rounded bg-accent-500/15 px-1.5 py-0.5 font-display text-[0.7rem] font-bold text-accent-300" dir="ltr">{stage + 1}</span>
        <RichText>{scenario.prompt}</RichText>
        {option ? (
          <p className={`mt-2 font-bold ${option.correct ? 'text-emerald-300' : 'text-rose-300'}`}>
            <RichText>{`${option.correct ? 'صح — ' : 'راجع — '}${option.detail}`}</RichText>
          </p>
        ) : (
          <p className="mt-2 text-slate-400"><RichText>{`تلميح: ${scenario.hint}`}</RichText></p>
        )}
      </motion.div>
    </div>
  )
}

const overviewStages = [
  'كلمات المرور لسه مستخدمة لأنها سهلة التوزيع ومعروفة لكل النظم، بس لوحدها مش كفاية.',
  'المشكلة إن البيانات بتتسرب، والباسورد يتخمّن، أو المستخدم يعيد استخدامه في مواقع كتير.',
  'الدفاع الأول هو سياسة قوية: طول، عدم توقع، تفرد، وإدارة آمنة للباسورد.',
  'المستوى التاني هو MFA: إضافة عامل تاني من فئة مختلفة زي جهاز أو بصمة.',
  'المستوى التالت في الاتصالات الآمنة هو digital certificates اللي بتتحقق من هوية السيرفر.',
  'الـ biometrics ممكن يضاف كعامل «Something you are»، لكن ليه حدود ومخاطر خصوصية.',
  'الفكرة النهائية: طبقات حماية متكاملة، مش حل واحد سحري.',
]

export function PasswordSecurityOverviewDiagram() {
  const playback = useStepPlayback(overviewStages.length)
  const s = playback.stage
  return (
    <StepShell title="PASSWORD SECURITY OVERVIEW" playback={playback} legend={overviewStages[s]}>
      <svg viewBox="0 0 920 400" className="h-auto w-full min-w-[880px]" role="img" aria-label="Password security overview from password policy to MFA certificates and biometrics">
        <Box x={25} y={150} w={175} h={90} title="Password policy" sub="complexity + uniqueness" color="#38bdf8" active />
        <Box x={255} y={150} w={175} h={90} title="Management" sub="manager + hashing" color="#a78bfa" active={s >= 2} />
        <Box x={485} y={150} w={175} h={90} title="MFA" sub="different factors" color="#34d399" active={s >= 3} />
        <Box x={715} y={150} w={175} h={90} title="Certificates" sub="identity + trust" color="#f59e0b" active={s >= 4} />
        <LinkLine x1={200} y1={195} x2={255} y2={195} color="#38bdf8" active />
        <LinkLine x1={430} y1={195} x2={485} y2={195} color="#a78bfa" active={s >= 2} />
        <LinkLine x1={660} y1={195} x2={715} y2={195} color="#34d399" active={s >= 3} />
        <FlowDot x1={200} y1={195} x2={715} y2={195} color="#f59e0b" active={s >= 5} />
        <Badge x={170} y={312} text="Biometrics add a factor - not a replacement for all other controls" color="#fb7185" active={s >= 5} w={580} />
      </svg>
    </StepShell>
  )
}

const aaaItems: InfoItem[] = [
  { id: 'identification', label: 'Identification', sub: 'claim an identity', detail: 'المستخدم بيقول «أنا مين»، زي إنه يكتب username. ده إدعاء لسه مش متأكد منه.', color: '#38bdf8' },
  { id: 'authentication', label: 'Authentication', sub: 'prove the identity', detail: 'النظام بيتأكد من الإدعاء بعامل زي password أو OTP أو بصمة. هنا بنسأل: «إنت فعلاً مين قلت؟»', color: '#34d399' },
  { id: 'authorization', label: 'Authorization', sub: 'grant permissions', detail: 'بعد التحقق، النظام يحدد إيه اللي مسموح للمستخدم يعمله، زي صلاحية قراءة فقط أو وصول إداري.', color: '#a78bfa' },
]

export function AaaConceptsDiagram() {
  const [selected, setSelected] = useState('authentication')
  const item = aaaItems.find((entry) => entry.id === selected) ?? aaaItems[0]
  const controls = <ChoiceButtons items={aaaItems.map((entry) => ({ id: entry.id, label: entry.label }))} selected={selected} onSelect={setSelected} />
  return (
    <ChoiceShell title="IDENTIFICATION / AUTHENTICATION / AUTHORIZATION" controls={controls} legend={`**${item.label}** — ${item.detail}`}>
      <SelectorBoard items={aaaItems} selected={selected} onSelect={setSelected} focusTitle="IDENTIFICATION AUTHENTICATION AUTHORIZATION" />
    </ChoiceShell>
  )
}

const accessScenarioItems: InfoItem[] = [
  { id: 'workstation', label: 'Workstation login', sub: 'employee desk PC', detail: 'موظف بيفتح الكمبيوتر: بيكتب username وpassword، وبعدين النظام يقرر صلاحياته على الملفات والتطبيقات.', color: '#38bdf8' },
  { id: 'admin', label: 'Management system', sub: 'network administrator', detail: 'مسؤول شبكة بيدخل نظام إدارة: هنا مهم جداً MFA لأن الحساب ده يقدر يغيّر إعدادات أجهزة كتير.', color: '#fb7185' },
  { id: 'vpn', label: 'Remote VPN', sub: 'user outside office', detail: 'مستخدم من بره المكتب بيتصل بـ VPN: الباسورد لوحده مش كفاية، وبيتنصح بعامل تاني وحماية إضافية.', color: '#a78bfa' },
]

export function AccessScenariosDiagram() {
  const [selected, setSelected] = useState('vpn')
  const item = accessScenarioItems.find((entry) => entry.id === selected) ?? accessScenarioItems[0]
  const controls = <ChoiceButtons items={accessScenarioItems.map((entry) => ({ id: entry.id, label: entry.label }))} selected={selected} onSelect={setSelected} />
  return (
    <ChoiceShell title="WHERE PASSWORD SECURITY APPLIES" controls={controls} legend={`**${item.label}** — ${item.detail}`}>
      <SelectorBoard items={accessScenarioItems} selected={selected} onSelect={setSelected} focusTitle="PASSWORD SECURITY ACCESS SCENARIOS" />
    </ChoiceShell>
  )
}

const patternItems: VerdictItem[] = [
  { id: 'name-year', label: '<NAME>123', sub: 'personal + sequence', detail: 'ضعيف لأنه بيستخدم معلومة شخصية وتسلسل أرقام متوقع. أسهل حاجة يجرّبها المهاجم.', verdict: 'risk', color: '#fb7185' },
  { id: 'city-year', label: '<CITY>!2024', sub: 'dictionary word + year', detail: 'ضعيف رغم وجود رمز؛ كلمة من القاموس مع سنة متوقعة لسه قابلة للتخمين.', verdict: 'risk', color: '#f59e0b' },
  { id: 'short-complex', label: '<SHORT>!9', sub: 'short but has symbols', detail: 'ضعيف لأن الطول قصير. إضافة Symbols لوحدها ما بتخلّيش الباسورد قوي.', verdict: 'risk', color: '#fb7185' },
  { id: 'long-unique', label: '<LONG_UNIQUE_PHRASE>', sub: 'long unique passphrase', detail: 'أقوى لأنه طويل، فريد لهذا الحساب، وغير متوقع. العبارة الطويلة أسهل في التذكر من خليط قصير.', verdict: 'stronger', color: '#34d399' },
]

export function PasswordPatternsDiagram() {
  const [selected, setSelected] = useState('name-year')
  const item = patternItems.find((entry) => entry.id === selected) ?? patternItems[0]
  const controls = <ChoiceButtons items={patternItems.map((entry) => ({ id: entry.id, label: entry.label }))} selected={selected} onSelect={setSelected} />
  return (
    <ChoiceShell title="WEAK vs STRONGER PASSWORD PATTERNS" controls={controls} legend={`**${item.label}** — ${item.detail}`}>
      <VerdictBoard items={patternItems} selected={selected} onSelect={setSelected} focusTitle="FICTIONAL PASSWORD PATTERNS" />
    </ChoiceShell>
  )
}

const strengthItems: InfoItem[] = [
  { id: 'length', label: 'Password length', sub: 'more characters', detail: 'الطول بيزيّد مساحة البحث على المهاجم. كل حرف إضافي بيخلّي التخمين أصعب، لو الكلام مش متوقع.', color: '#38bdf8' },
  { id: 'complexity', label: 'Complexity', sub: 'varied character types', detail: 'التنوع بين حروف كبيرة وصغيرة وأرقام ورموز بيساعد، بس مش كفاية لوحده ومش ضمان للقوة.', color: '#a78bfa' },
  { id: 'entropy', label: 'Entropy', sub: 'unpredictability', detail: 'الإنتروبيا يعني «قد إيه النص مش متوقع». كلمة من قاموس إنتروبياتها منخفضة حتى لو طويلة شكلياً.', color: '#f59e0b' },
  { id: 'passphrase', label: 'Passphrase', sub: 'long memorable words', detail: 'الـ passphrase عبارة طويلة من كلمات غير متوقعة؛ سهلة التذكر وصعبة التخمين لو فريدة لكل حساب.', color: '#34d399' },
]

export function LengthEntropyDiagram() {
  const [selected, setSelected] = useState('passphrase')
  const item = strengthItems.find((entry) => entry.id === selected) ?? strengthItems[0]
  const controls = <ChoiceButtons items={strengthItems.map((entry) => ({ id: entry.id, label: entry.label }))} selected={selected} onSelect={setSelected} />
  return (
    <ChoiceShell title="LENGTH / COMPLEXITY / ENTROPY / PASSPHRASE" controls={controls} legend={`**${item.label}** — ${item.detail}`}>
      <SelectorBoard items={strengthItems} selected={selected} onSelect={setSelected} focusTitle="PASSWORD STRENGTH FACTORS" />
    </ChoiceShell>
  )
}

const attackItems: InfoItem[] = [
  { id: 'dictionary', label: 'Dictionary attack', sub: 'common word lists', detail: 'المهاجم يجرّب كلمات من قوائم جاهزة وأسماء وأرقام متوقعة. ضدها: كلمات غير متوقعة وطويلة.', color: '#fb7185' },
  { id: 'brute', label: 'Brute-force', sub: 'try every combination', detail: 'تجربة كل التركيبات حتى إيجاد الصحيح. الطول والإنتروبيا بيخلّوا الوقت المطلوب كبير جداً.', color: '#f59e0b' },
  { id: 'stuffing', label: 'Credential stuffing', sub: 'reuse leaked logins', detail: 'استخدام أسماء وباسوردات مسربة من موقع على مواقع تانية. ضدها: تفرد الباسورد وMFA.', color: '#a78bfa' },
  { id: 'defense', label: 'Rate limiting', sub: 'slow down attempts', detail: 'تحديد عدد المحاولات وإنذار/قفل مؤقت بيقلّل التخمين، بس القفل العدواني ممكن يتستخدم لـ DoS.', color: '#34d399' },
]

export function AttackComparisonDiagram() {
  const [selected, setSelected] = useState('stuffing')
  const item = attackItems.find((entry) => entry.id === selected) ?? attackItems[0]
  const controls = <ChoiceButtons items={attackItems.map((entry) => ({ id: entry.id, label: entry.label }))} selected={selected} onSelect={setSelected} />
  return (
    <ChoiceShell title="PASSWORD ATTACK COMPARISON" controls={controls} legend={`**${item.label}** — ${item.detail}`}>
      <SelectorBoard items={attackItems} selected={selected} onSelect={setSelected} focusTitle="PASSWORD ATTACK COMPARISON" />
    </ChoiceShell>
  )
}

const stuffingStages = [
  'موقع اتعرض للاختراق واتسربت قائمة أسماء وباسوردات.',
  'المهاجم يكتب القائمة في أداة آلية تجرب الدخول على خدمات تانية.',
  'لو المستخدم استخدم نفس الباسورد، المهاجم يدخل حسابه من غير ما يخمّن حاجة.',
  'حتى لو الباسورد قوي، إعادة استخدامه في مكان مسرب بيفقده قيمته.',
  'الدفاع: باسورد فريد لكل خدمة + password manager + MFA + مراقبة محاولات الدخول.',
]

export function CredentialStuffingFlowDiagram() {
  const playback = useStepPlayback(stuffingStages.length)
  const s = playback.stage
  return (
    <StepShell title="CREDENTIAL STUFFING WORKFLOW" playback={playback} legend={stuffingStages[s]}>
      <svg viewBox="0 0 920 400" className="h-auto w-full min-w-[880px]" role="img" aria-label="Credential stuffing workflow from leaked credentials to reused password compromise">
        <Box x={30} y={150} w={190} h={90} title="Leaked list" sub="breached service" color="#fb7185" active />
        <Box x={285} y={150} w={190} h={90} title="Automated logins" sub="many services" color="#f59e0b" active={s >= 1} />
        <Box x={540} y={150} w={165} h={90} title={s >= 4 ? 'Blocked' : 'Reuse hit'} sub={s >= 4 ? 'unique + MFA' : 'same password'} color={s >= 4 ? '#34d399' : '#a78bfa'} active={s >= 2} />
        <Box x={770} y={150} w={125} h={90} title={s >= 4 ? 'Safe' : 'Access'} sub={s >= 4 ? 'defenses work' : 'account taken'} color={s >= 4 ? '#34d399' : '#fb7185'} active={s >= 3} />
        <LinkLine x1={220} y1={195} x2={285} y2={195} color="#fb7185" active />
        <LinkLine x1={475} y1={195} x2={540} y2={195} color="#f59e0b" active={s >= 1} />
        <LinkLine x1={705} y1={195} x2={770} y2={195} color="#a78bfa" active={s >= 2} />
        <FlowDot x1={220} y1={195} x2={770} y2={195} color="#f59e0b" active={s >= 3} />
        <Badge x={175} y={312} text="Uniqueness per service breaks this attack chain" color="#34d399" active={s >= 4} w={570} />
      </svg>
    </StepShell>
  )
}

const lockoutItems: InfoItem[] = [
  { id: 'rate', label: 'Rate limiting', sub: 'limit attempts per time', detail: 'النظام بيقلّل سرعة أو عدد محاولات الدخول، فالتخمين يبقى بطيء وملحوظ.', color: '#38bdf8' },
  { id: 'lockout', label: 'Account lockout', sub: 'temporary block', detail: 'بعد عدد محاولات فاشلة بيتم قفل الحساب مؤقتاً. ده بيوقف التخمين المتواصل.', color: '#34d399' },
  { id: 'abuse', label: 'DoS abuse', sub: 'attacker locks users out', detail: 'لو القفل عدواني جداً، المهاجم يقدر يتعمّد يفشل الدخول عشان يقفل حساب مستخدم شرعي.', color: '#fb7185' },
  { id: 'balance', label: 'Balanced policy', sub: 'detection + MFA', detail: 'السياسة المتوازنة بتجمع حدود معقولة وتنبيهات وMFA بدل الاعتماد على قفل قاسي فقط.', color: '#a78bfa' },
]

export function RateLimitingDiagram() {
  const [selected, setSelected] = useState('abuse')
  const item = lockoutItems.find((entry) => entry.id === selected) ?? lockoutItems[0]
  const controls = <ChoiceButtons items={lockoutItems.map((entry) => ({ id: entry.id, label: entry.label }))} selected={selected} onSelect={setSelected} />
  return (
    <ChoiceShell title="RATE LIMITING AND ACCOUNT LOCKOUT" controls={controls} legend={`**${item.label}** — ${item.detail}`}>
      <SelectorBoard items={lockoutItems} selected={selected} onSelect={setSelected} focusTitle="RATE LIMITING AND LOCKOUT" />
    </ChoiceShell>
  )
}

const managementStages = [
  'السياسة تحدد القواعد: طول، تفرد، وعدم مشاركة كلمات المرور.',
  'المستخدم يولّد باسورد فريد لكل خدمة باستخدام مولّد موثوق.',
  'الباسورد يتخزّن في vault مشفّر ويحميه master password قوي.',
  'وقت الدخول، الـ manager بيملأ البيانات تلقائياً من غير ما المستخدم يكتبها.',
  'التغيير بيحصل عند الشك في تسريب أو حسب سياسة المؤسسة، مش لمجرد تقويم أسبوعي.',
  'على الخادم، الباسورد يتخزّن كـ hash مع salt مش كنص عادي.',
]

export function PasswordManagementFlowDiagram() {
  const playback = useStepPlayback(managementStages.length)
  const s = playback.stage
  return (
    <StepShell title="SECURE PASSWORD MANAGEMENT WORKFLOW" playback={playback} legend={managementStages[s]}>
      <StageBoard stages={['Policy', 'Generate unique', 'Encrypted vault', 'Autofill', 'Change on risk', 'Server-side hash']} stage={s} ariaLabel="Secure password management workflow from policy to server-side hashing" />
    </StepShell>
  )
}

const managerItems: InfoItem[] = [
  { id: 'vault', label: 'Encrypted vault', sub: 'protected storage', detail: 'قاعدة بيانات مشفّرة تحفظ البيانات. لو الجهاز أو الملف اتسرق، التشفير بيقلّل خطر القراءة المباشرة.', color: '#38bdf8' },
  { id: 'master', label: 'Master password', sub: 'unlocks the vault', detail: 'باسورد واحد قوي جداً لفتح الـ vault. لازم يحفظه المستخدم ويحميه بـ MFA لو متاح.', color: '#fb7185' },
  { id: 'generator', label: 'Secure generator', sub: 'unique per service', detail: 'بيولّد قيم طويلة وعشوائية ومختلفة لكل موقع، فتخمين أو تسريب موقع ما بيأثرش على الباقي.', color: '#34d399' },
  { id: 'sync', label: 'Sync and recovery', sub: 'backup + account recovery', detail: 'المزامنة بتخلي البيانات متاحة على أجهزة المستخدم، واستعادة الحساب لازم تكون محمية بقوة.', color: '#a78bfa' },
  { id: 'risk', label: 'Unprotected manager', sub: 'single point of failure', detail: 'لو_master password ضعيف أو الـ vault مفتوح على جهاز مش مؤمن، كل الحسابات المخزنة بتتعرض للخطر.', color: '#f59e0b' },
]

export function PasswordManagerArchitectureDiagram() {
  const [selected, setSelected] = useState('master')
  const item = managerItems.find((entry) => entry.id === selected) ?? managerItems[0]
  const controls = <ChoiceButtons items={managerItems.map((entry) => ({ id: entry.id, label: entry.label }))} selected={selected} onSelect={setSelected} />
  return (
    <ChoiceShell title="PASSWORD MANAGER ARCHITECTURE" controls={controls} legend={`**${item.label}** — ${item.detail}`}>
      <SelectorBoard items={managerItems} selected={selected} onSelect={setSelected} focusTitle="PASSWORD MANAGER ARCHITECTURE" />
    </ChoiceShell>
  )
}

const handlingItems: InfoItem[] = [
  { id: 'share', label: 'Never share', sub: 'one user per account', detail: 'المشاركة بتمنع تتبع المسؤولية وتخلي إلغاء الوصول صعب. استخدم حسابات فردية وصلاحيات مناسبة.', color: '#fb7185' },
  { id: 'code', label: 'No code or config files', sub: 'avoid plaintext secrets', detail: 'ما تكتبش كلمات مرور داخل source code أو ملفات إعداد عادية؛ استخدم آلية أسرار معتمدة من المؤسسة.', color: '#f59e0b' },
  { id: 'reset', label: 'Secure reset', sub: 'verify identity first', detail: 'إعادة التعيين لازم تتأكد من الهوية عبر قناة موثوقة، وترسل رابط لمرة واحدة بدل إعطاء الباسورد.', color: '#a78bfa' },
  { id: 'hash', label: 'Server-side hashing', sub: 'hash + salt', detail: 'الخادم يخزّن hash مع salt، مش الباسورد نفسه. كده تسريب قاعدة البيانات ما بيعطيش الباسورد مباشرة.', color: '#34d399' },
]

export function SecurePasswordHandlingDiagram() {
  const [selected, setSelected] = useState('hash')
  const item = handlingItems.find((entry) => entry.id === selected) ?? handlingItems[0]
  const controls = <ChoiceButtons items={handlingItems.map((entry) => ({ id: entry.id, label: entry.label }))} selected={selected} onSelect={setSelected} />
  return (
    <ChoiceShell title="SECURE PASSWORD HANDLING" controls={controls} legend={`**${item.label}** — ${item.detail}`}>
      <SelectorBoard items={handlingItems} selected={selected} onSelect={setSelected} focusTitle="SECURE PASSWORD HANDLING" />
    </ChoiceShell>
  )
}

const hashingStages = [
  'المستخدم يختار قيمة قوية، والخادم يستقبلها عند إنشاء الحساب.',
  'الخادم يضيف salt عشوائي فريد لكل حساب.',
  'يحسب hash للقيمة مع الـ salt ويخزّن النتيجة فقط.',
  'وقت الدخول، الخادم يحسب hash للإدخال مع نفس الـ salt ويقارن النتيجتين.',
  'التشفير (encryption) مختلف: بعض الخوارزميات قابلة للعكس بمفتاح، والـ hash مش كده.',
  'الـ hash الحديث المقاوم لكلمات المرور بيبطّئ التخمين، لكنه مش بديل عن MFA.',
]

export function HashingVsEncryptionDiagram() {
  const playback = useStepPlayback(hashingStages.length)
  const s = playback.stage
  return (
    <StepShell title="PASSWORD HASHING vs ENCRYPTION (CONCEPTUAL)" playback={playback} legend={hashingStages[s]}>
      <StageBoard stages={['Receive', 'Add salt', 'Compute hash', 'Compare', 'Not reversible', 'Still use MFA']} stage={s} ariaLabel="Conceptual password hashing with salt compared with reversible encryption" />
    </StepShell>
  )
}

const factorItems: InfoItem[] = [
  { id: 'know', label: 'Something you know', sub: 'password or PIN', detail: 'معلومة في دماغ المستخدم زي باسورد أو PIN. سهل النسيان أو التخمين أو السرقة.', color: '#38bdf8' },
  { id: 'have', label: 'Something you have', sub: 'key / app / card', detail: 'حاجة مادية أو رقمية يملكها المستخدم: hardware security key، authenticator app، أو smart card.', color: '#34d399' },
  { id: 'are', label: 'Something you are', sub: 'fingerprint / face', detail: 'خاصية بيومترية زي بصمة الإصبع أو الوجه أو القزحية. مش ممكن نغيرها زي ما نغيّر الباسورد.', color: '#a78bfa' },
]

export function AuthFactorsDiagram() {
  const [selected, setSelected] = useState('know')
  const item = factorItems.find((entry) => entry.id === selected) ?? factorItems[0]
  const controls = <ChoiceButtons items={factorItems.map((entry) => ({ id: entry.id, label: entry.label }))} selected={selected} onSelect={setSelected} />
  return (
    <ChoiceShell title="AUTHENTICATION FACTOR CATEGORIES" controls={controls} legend={`**${item.label}** — ${item.detail}`}>
      <SelectorBoard items={factorItems} selected={selected} onSelect={setSelected} focusTitle="AUTHENTICATION FACTOR CATEGORIES" />
    </ChoiceShell>
  )
}

const sfaItems: InfoItem[] = [
  { id: 'sfa', label: 'SFA', sub: 'one factor only', detail: 'Single-factor authentication: عامل واحد بس، زي باسورد لوحده. أضعف خيار.', color: '#fb7185' },
  { id: '2fa', label: '2FA', sub: 'two factors', detail: 'Two-factor authentication: عاملان من فئتين مختلفتين، زي باسورد + OTP من تطبيق.', color: '#34d399' },
  { id: 'mfa', label: 'MFA', sub: 'two or more factors', detail: 'Multifactor authentication: عاملان أو أكتر من فئات مختلفة. 2FA حالة خاصة من MFA.', color: '#38bdf8' },
  { id: 'twopass', label: 'Two passwords', sub: 'still one factor', detail: 'باسوردين متعاقبين مش MFA، لأن الاتنين من نفس الفئة «Something you know».', color: '#f59e0b' },
]

export function Sfa2faMfaDiagram() {
  const [selected, setSelected] = useState('twopass')
  const item = sfaItems.find((entry) => entry.id === selected) ?? sfaItems[0]
  const controls = <ChoiceButtons items={sfaItems.map((entry) => ({ id: entry.id, label: entry.label }))} selected={selected} onSelect={setSelected} />
  return (
    <ChoiceShell title="SFA vs 2FA vs MFA" controls={controls} legend={`**${item.label}** — ${item.detail}`}>
      <SelectorBoard items={sfaItems} selected={selected} onSelect={setSelected} focusTitle="SFA 2FA MFA COMPARISON" />
    </ChoiceShell>
  )
}

const mfaFlowStages = [
  'المستخدم بيكتب username وباسورد.',
  'النظام بيتحقق من العامل الأول «Something you know».',
  'النظام بيطلب عامل تاني من فئة مختلفة.',
  'المستخدم بيقدّم OTP من التطبيق أو يلمس hardware security key.',
  'النظام بيتحقق من العامل التاني.',
  'لو الاتنين صح يتسمح بالدخول، وإلا الدخول يترفض.',
]

export function MfaFlowDiagram() {
  const playback = useStepPlayback(mfaFlowStages.length)
  const s = playback.stage
  return (
    <StepShell title="MFA AUTHENTICATION FLOW" playback={playback} legend={mfaFlowStages[s]}>
      <svg viewBox="0 0 920 400" className="h-auto w-full min-w-[880px]" role="img" aria-label="MFA authentication flow validating a first and second factor before access">
        <Box x={30} y={150} w={175} h={90} title="User + password" sub="first factor" color="#38bdf8" active />
        <Box x={260} y={150} w={175} h={90} title="Validate #1" sub="know category" color="#a78bfa" active={s >= 1} />
        <Box x={490} y={150} w={175} h={90} title={s >= 5 ? 'Denied' : 'Second factor'} sub={s >= 5 ? 'validation failed' : 'have / are'} color={s >= 5 ? '#fb7185' : '#f59e0b'} active={s >= 2} />
        <Box x={720} y={150} w={175} h={90} title={s >= 5 ? 'No access' : 'Granted'} sub={s >= 5 ? 'try again' : 'session starts'} color={s >= 5 ? '#fb7185' : '#34d399'} active={s >= 4} />
        <LinkLine x1={205} y1={195} x2={260} y2={195} color="#38bdf8" active />
        <LinkLine x1={435} y1={195} x2={490} y2={195} color="#a78bfa" active={s >= 1} />
        <LinkLine x1={665} y1={195} x2={720} y2={195} color="#f59e0b" active={s >= 3} />
        <FlowDot x1={205} y1={195} x2={720} y2={195} color="#f59e0b" active={s >= 3} />
        <Badge x={185} y={312} text="Two steps are only MFA when they use different factor categories" color="#34d399" active w={550} />
      </svg>
    </StepShell>
  )
}

const mfaMethodItems: InfoItem[] = [
  { id: 'sms', label: 'SMS OTP', sub: 'phone text message', detail: 'سهل الاستخدام لكن أضعف: ممكن SIM swap أو اعتراض الرسائل، وما ينصحش لحسابات إدارية حساسة.', color: '#fb7185' },
  { id: 'email', label: 'Email OTP', sub: 'code by email', detail: 'لو بريد المستخدم اتخترق، الكود يوصل للمهاجم. مفيد كطبقة إضافية بس مش أقوى الخيارات.', color: '#f59e0b' },
  { id: 'totp', label: 'Authenticator app TOTP', sub: 'time-based code', detail: 'كود بيتغيّر كل فترة على الجهاز. أقوى من SMS لأنه مش مرتبط بشبكة الجوال.', color: '#34d399' },
  { id: 'push', label: 'Push notification', sub: 'approve on device', detail: 'مريح وسريع، بس فيه خطر Push fatigue: المستخدم يوافق على إشعار مزيف وهو مش منتبه.', color: '#a78bfa' },
  { id: 'key', label: 'Hardware security key', sub: 'FIDO2 / U2F', detail: 'مفتاح مادي بيوقّع طلب الدخول. مقاوم للتصيد لأنه بيربط التوقيع بموقع الخدمة الحقيقي.', color: '#22d3ee' },
  { id: 'card', label: 'Smart card', sub: 'certificate + PIN', detail: 'بطاقة ذكية مع PIN، شائعة في المؤسسات والجهات الحكومية. بتجمع «Have» و«Know» وتدعم الشهادات.', color: '#38bdf8' },
]

export function MfaMethodsDiagram() {
  const [selected, setSelected] = useState('sms')
  const item = mfaMethodItems.find((entry) => entry.id === selected) ?? mfaMethodItems[0]
  const controls = <ChoiceButtons items={mfaMethodItems.map((entry) => ({ id: entry.id, label: entry.label }))} selected={selected} onSelect={setSelected} />
  return (
    <ChoiceShell title="MFA METHOD TRADE-OFFS" controls={controls} legend={`**${item.label}** — ${item.detail}`}>
      <SelectorBoard items={mfaMethodItems} selected={selected} onSelect={setSelected} focusTitle="MFA METHOD TRADE-OFFS" />
    </ChoiceShell>
  )
}

const keyStages = [
  'المستخدم يفتح موقع الخدمة ويكتب بيانات الدخول الأولى.',
  'الخدمة بترسل تحدي (challenge) مرتبط بعنوان الموقع الحقيقي.',
  'المفتاح المادي بيوقّع التحدي باستخدام مفتاح خاص موجود جوه الجهاز.',
  'الخدمة بتتحقق من التوقيع باستخدام المفتاح العام المسجّل للمستخدم.',
  'موقع تصيدي ما يقدرش ياخد توقيع صالح لأن العنوان مختلف.',
  'النتيجة: دخول مقاوم للتصيد ومفيش كود ينسخه المهاجم.',
]

export function HardwareKeyFlowDiagram() {
  const playback = useStepPlayback(keyStages.length)
  const s = playback.stage
  return (
    <StepShell title="HARDWARE SECURITY KEY AUTHENTICATION" playback={playback} legend={keyStages[s]}>
      <svg viewBox="0 0 920 400" className="h-auto w-full min-w-[880px]" role="img" aria-label="Hardware security key flow using a private key signature and public key verification">
        <Box x={30} y={150} w={175} h={90} title="Service" sub="sends challenge" color="#38bdf8" active />
        <Box x={260} y={150} w={175} h={90} title="Security key" sub="private key signs" color="#a78bfa" active={s >= 2} />
        <Box x={490} y={150} w={175} h={90} title="Signature" sub="bound to origin" color="#f59e0b" active={s >= 3} />
        <Box x={720} y={150} w={175} h={90} title="Verify" sub="public key check" color="#34d399" active={s >= 4} />
        <LinkLine x1={205} y1={195} x2={260} y2={195} color="#38bdf8" active />
        <LinkLine x1={435} y1={195} x2={490} y2={195} color="#a78bfa" active={s >= 2} />
        <LinkLine x1={665} y1={195} x2={720} y2={195} color="#f59e0b" active={s >= 3} />
        <FlowDot x1={205} y1={195} x2={720} y2={195} color="#f59e0b" active={s >= 4} />
        <Badge x={185} y={312} text="Phishing-resistant: a fake site cannot obtain a valid signature" color="#34d399" active={s >= 4} w={550} />
      </svg>
    </StepShell>
  )
}

const recoveryItems: InfoItem[] = [
  { id: 'phish', label: 'Phishing resistance', sub: 'origin-bound authentication', detail: 'المفتاح المادي أو الشهادة بتربط التحقق بالموقع الحقيقي، فصفحة تصيدية ما تقدرش تعيد استخدامه.', color: '#34d399' },
  { id: 'sim', label: 'SIM swapping', sub: 'SMS OTP weakness', detail: 'المهاجم ينقل رقم الجوال لشريحته ويستقبل SMS. عشان كده SMS مش كافي للحسابات الحساسة.', color: '#fb7185' },
  { id: 'fatigue', label: 'Push fatigue', sub: 'repeated approval prompts', detail: 'إشعارات موافقة متكررة ممكن تخدع المستخدم يوافق وهو متعب. استخدم قيود ومراجعة للأجهزة.', color: '#f59e0b' },
  { id: 'codes', label: 'Recovery codes', sub: 'backup when device is lost', detail: 'رموز احتياطية تُحفظ في مكان آمن. لازم إجراءات الاستعادة تتحقق من الهوية بقوة لأنها نقطة ضعف.', color: '#a78bfa' },
]

export function PhishingRecoveryDiagram() {
  const [selected, setSelected] = useState('sim')
  const item = recoveryItems.find((entry) => entry.id === selected) ?? recoveryItems[0]
  const controls = <ChoiceButtons items={recoveryItems.map((entry) => ({ id: entry.id, label: entry.label }))} selected={selected} onSelect={setSelected} />
  return (
    <ChoiceShell title="PHISHING RESISTANCE AND ACCOUNT RECOVERY" controls={controls} legend={`**${item.label}** — ${item.detail}`}>
      <SelectorBoard items={recoveryItems} selected={selected} onSelect={setSelected} focusTitle="PHISHING RESISTANCE AND RECOVERY" />
    </ChoiceShell>
  )
}

const pkiItems: InfoItem[] = [
  { id: 'ca', label: 'Certificate Authority', sub: 'issues and signs certs', detail: 'الجهة الموثوقة اللي بتوقع على الشهادات بعد التحقق من هوية صاحبها. التوقيع بيسمح للعملاء يتحققوا من الشهادة.', color: '#a78bfa' },
  { id: 'keys', label: 'Public / private key', sub: 'asymmetric pair', detail: 'المفتاح العام بيتكتب في الشهادة ويتشارك، والمفتاح الخاص يفضل سري عند صاحبه. الشهادة ما تحتويش المفتاح الخاص.', color: '#38bdf8' },
  { id: 'subject', label: 'Subject and issuer', sub: 'who and who signed', detail: 'Subject بيقول «مين صاحب الشهادة» وIssuer بيقول «مين وقّع عليها». الاتنين بيتقارنوا وقت التحقق.', color: '#34d399' },
  { id: 'trust', label: 'Trust store', sub: 'trusted root CAs', detail: 'قائمة الجذور الموثوقة عند العميل. لو الشهادة تنتهي لواحد من الجذور دي، يبدأ يثق فيها.', color: '#f59e0b' },
]

export function PkiArchitectureDiagram() {
  const [selected, setSelected] = useState('keys')
  const item = pkiItems.find((entry) => entry.id === selected) ?? pkiItems[0]
  const controls = <ChoiceButtons items={pkiItems.map((entry) => ({ id: entry.id, label: entry.label }))} selected={selected} onSelect={setSelected} />
  return (
    <ChoiceShell title="PUBLIC KEY INFRASTRUCTURE ARCHITECTURE" controls={controls} legend={`**${item.label}** — ${item.detail}`}>
      <SelectorBoard items={pkiItems} selected={selected} onSelect={setSelected} focusTitle="PKI ARCHITECTURE" />
    </ChoiceShell>
  )
}

const caStages = [
  'Root CA في أعلى الهرم ومفتاحه الخاص محفوظ بحماية شديدة.',
  'Root CA يوقّع على شهادات Intermediate CA.',
  'Intermediate CA يوقّع على شهادة السيرفر الفعلية.',
  'العميل عنده Root CA موثوق في الـ trust store.',
  'العميل يبني سلسلة من شهادة السيرفر لحد الجذر الموثوق.',
  'لو أي حلقة ناقصة أو غير موثوقة، التحقق يفشل.',
]

export function CaHierarchyDiagram() {
  const playback = useStepPlayback(caStages.length)
  const s = playback.stage
  return (
    <StepShell title="ROOT CA / INTERMEDIATE CA / SERVER CERT" playback={playback} legend={caStages[s]}>
      <StageBoard stages={['Root CA', 'Signs intermediate', 'Signs server cert', 'Client trust store', 'Build chain', 'Trust or fail']} stage={s} ariaLabel="Certificate authority hierarchy from root CA to server certificate validation" />
    </StepShell>
  )
}

const certItems: InfoItem[] = [
  { id: 'subject', label: 'Subject', sub: 'certificate owner', detail: 'بيحدد صاحب الشهادة، زي اسم المضيف أو المؤسسة. العميل بيقارنه بالاسم اللي اتصل بيه.', color: '#38bdf8' },
  { id: 'issuer', label: 'Issuer', sub: 'CA that signed', detail: 'اسم الجهة اللي وقّعت على الشهادة. بيستخدم لبناء سلسلة الثقة.', color: '#a78bfa' },
  { id: 'pubkey', label: 'Public key', sub: 'shared key', detail: 'المفتاح العام للصاحب. المفتاح الخاص بتاعه مش موجود هنا أبداً.', color: '#34d399' },
  { id: 'validity', label: 'Validity period', sub: 'not before / after', detail: 'تاريخ بداية ونهاية الصلاحية. الشهادة المنتهية مرفوضة.', color: '#f59e0b' },
  { id: 'signature', label: 'Digital signature', sub: 'signed by CA', detail: 'توقيع الـ CA على بيانات الشهادة. أي تعديل في البيانات بيخلي التوقيع غير صالح.', color: '#22d3ee' },
  { id: 'serial', label: 'Serial number', sub: 'unique identifier', detail: 'رقم فريد للشهادة، وبيتستخدم في قوائم الإلغاء (revocation).', color: '#fb7185' },
]

export function CertificateStructureDiagram() {
  const [selected, setSelected] = useState('pubkey')
  const item = certItems.find((entry) => entry.id === selected) ?? certItems[0]
  const controls = <ChoiceButtons items={certItems.map((entry) => ({ id: entry.id, label: entry.label }))} selected={selected} onSelect={setSelected} />
  return (
    <ChoiceShell title="DIGITAL CERTIFICATE STRUCTURE" controls={controls} legend={`**${item.label}** — ${item.detail}`}>
      <SelectorBoard items={certItems} selected={selected} onSelect={setSelected} focusTitle="DIGITAL CERTIFICATE STRUCTURE" />
    </ChoiceShell>
  )
}

const validationStages = [
  'العميل بيتصل بالسيرفر ويبدأ جلسة آمنة.',
  'السيرفر بيقدّم شهادته الرقمية.',
  'العميل بيفحص المُصدِر والسلسلة لحد جذر موثوق.',
  'العميل بيتأكد إن التاريخ داخل فترة الصلاحية.',
  'العميل بيقارن اسم المضيف بالموجود في الشهادة.',
  'العميل بيفحص حالة الإلغاء لو متاحة زي CRL أو OCSP.',
  'لو كل حاجة تمام يكمل الاتصال الآمن، وإلا يرفض الشهادة.',
]

export function CertificateValidationFlowDiagram() {
  const playback = useStepPlayback(validationStages.length)
  const s = playback.stage
  return (
    <StepShell title="CERTIFICATE VALIDATION FLOW" playback={playback} legend={validationStages[s]}>
      <StageBoard stages={['Connect', 'Present cert', 'Chain', 'Validity dates', 'Hostname', 'Revocation', 'Trust / reject']} stage={s} ariaLabel="Certificate validation flow checking issuer chain dates hostname and revocation" />
    </StepShell>
  )
}

const cryptoItems: InfoItem[] = [
  { id: 'encryption', label: 'Encryption', sub: 'confidentiality', detail: 'بيخلي البيانات مقروءة لطرف مخول فقط. بيعتمد على خوارزمية ومفتاح، ومش بيثبت هوية طرف لوحده.', color: '#38bdf8' },
  { id: 'signature', label: 'Digital signature', sub: 'integrity + origin', detail: 'توقيع رقمي بيثبت إن البيانات ما اتغيرتش ومن وقّعها. الشهادة نفسها موقّعة من الـ CA.', color: '#a78bfa' },
  { id: 'auth', label: 'Authentication', sub: 'prove an identity', detail: 'التحقق من هوية المستخدم أو السيرفر. الشهادة بتساعد في تحقق السيرفر، مش بديل عن تحقق المستخدم.', color: '#34d399' },
  { id: 'validation', label: 'Certificate validation', sub: 'is the cert trusted?', detail: 'فحص السلسلة والتواريخ واسم المضيف والإلغاء. نجاح التحقق معناها إننا نقدر نثق بالمفتاح العام.', color: '#f59e0b' },
]

export function EncryptionVsSignatureDiagram() {
  const [selected, setSelected] = useState('validation')
  const item = cryptoItems.find((entry) => entry.id === selected) ?? cryptoItems[0]
  const controls = <ChoiceButtons items={cryptoItems.map((entry) => ({ id: entry.id, label: entry.label }))} selected={selected} onSelect={setSelected} />
  return (
    <ChoiceShell title="ENCRYPTION / SIGNATURE / AUTHENTICATION / VALIDATION" controls={controls} legend={`**${item.label}** — ${item.detail}`}>
      <SelectorBoard items={cryptoItems} selected={selected} onSelect={setSelected} focusTitle="ENCRYPTION SIGNATURE AUTHENTICATION VALIDATION" />
    </ChoiceShell>
  )
}

const biometricStages = [
  'مرحلة Enrollment: المستخدم بيسجّل عينة بصمة أو وجه لأول مرة.',
  'النظام بيحوّل العينة إلى Biometric template مش صورة خام كاملة.',
  'وقت الدخول، الحسّاس بيقرأ عينة جديدة.',
  'النظام بيقارن العينة بالـ template المخزّن.',
  'النتيجة Accept أو Reject حسب درجة التطابق والحد المحدد.',
  'الـ liveness detection بيحاول يمنع صورة أو نسخة مقلدة.',
]

export function BiometricFlowDiagram() {
  const playback = useStepPlayback(biometricStages.length)
  const s = playback.stage
  return (
    <StepShell title="BIOMETRIC AUTHENTICATION WORKFLOW" playback={playback} legend={biometricStages[s]}>
      <svg viewBox="0 0 920 400" className="h-auto w-full min-w-[880px]" role="img" aria-label="Biometric authentication workflow from enrollment and template to match accept or reject">
        <Box x={25} y={150} w={170} h={90} title="Enrollment" sub="capture sample" color="#38bdf8" active />
        <Box x={250} y={150} w={170} h={90} title="Template" sub="stored reference" color="#a78bfa" active={s >= 1} />
        <Box x={475} y={150} w={170} h={90} title="Capture + match" sub="liveness check" color="#f59e0b" active={s >= 2} />
        <Box x={705} y={150} w={180} h={90} title={s >= 5 ? 'Reject spoof' : s >= 4 ? 'Accept' : 'Pending'} sub={s >= 5 ? 'liveness failed' : 'decision'} color={s >= 4 && s < 5 ? '#34d399' : '#fb7185'} active={s >= 4} />
        <LinkLine x1={195} y1={195} x2={250} y2={195} color="#38bdf8" active />
        <LinkLine x1={420} y1={195} x2={475} y2={195} color="#a78bfa" active={s >= 1} />
        <LinkLine x1={645} y1={195} x2={705} y2={195} color="#f59e0b" active={s >= 3} />
        <FlowDot x1={195} y1={195} x2={705} y2={195} color="#f59e0b" active={s >= 3} />
        <Badge x={185} y={312} text="Biometrics work best together with another factor" color="#34d399" active={s >= 5} w={550} />
      </svg>
    </StepShell>
  )
}

const farFrrItems: InfoItem[] = [
  { id: 'far', label: 'False Acceptance Rate', sub: 'wrongly accepts', detail: 'FAR: النظام يقبل شخص مش هو صاحب البصمة. كل ما الفار صغير، ما فيش حد غلط يتدخل.', color: '#fb7185' },
  { id: 'frr', label: 'False Rejection Rate', sub: 'wrongly rejects', detail: 'FRR: النظام يرفض صاحب الحق نفسه. كل ما الـ FRR صغير، المستخدم يتدخل بسهولة أكتر.', color: '#f59e0b' },
  { id: 'threshold', label: 'Matching threshold', sub: 'tune the balance', detail: 'رفع مستوى الصرامة بيقلّل FAR بس بيزيّد FRR، والعكس. لازم نختار حسب حساسية النظام.', color: '#a78bfa' },
  { id: 'liveness', label: 'Liveness detection', sub: 'anti-spoof checks', detail: 'بيحاول يتأكد إن العينة من شخص حي مش صورة أو قناع. مش كامل، بس بيقلّل السبوفنج.', color: '#34d399' },
]

export function FarFrrDiagram() {
  const [selected, setSelected] = useState('threshold')
  const item = farFrrItems.find((entry) => entry.id === selected) ?? farFrrItems[0]
  const controls = <ChoiceButtons items={farFrrItems.map((entry) => ({ id: entry.id, label: entry.label }))} selected={selected} onSelect={setSelected} />
  return (
    <ChoiceShell title="FAR vs FRR TRADE-OFF" controls={controls} legend={`**${item.label}** — ${item.detail}`}>
      <SelectorBoard items={farFrrItems} selected={selected} onSelect={setSelected} focusTitle="FAR vs FRR TRADE-OFF" />
    </ChoiceShell>
  )
}

const biometricLimitItems: InfoItem[] = [
  { id: 'privacy', label: 'Privacy concerns', sub: 'sensitive personal data', detail: 'البيانات البيومترية خاصة جداً، وجمعها وتخزينها محكوم بسياسات خصوصية وقوانين.', color: '#a78bfa' },
  { id: 'spoof', label: 'Spoofing attempts', sub: 'photos, masks, replicas', detail: 'محاولات خداع بالصور أو الأقنعة أو نسخة مطبوعة. الـ liveness detection بيقللها بس مش بيمنعها تماماً.', color: '#fb7185' },
  { id: 'sensor', label: 'Sensor and environment', sub: 'light, dirt, injury', detail: 'الإضاءة أو أتربة أو إصابة في الإصبع ممكن تسبب رفض خاطئ أو قراءة ضعيفة.', color: '#f59e0b' },
  { id: 'permanent', label: 'Cannot be reset', sub: 'unlike a password', detail: 'ما تقدرش تغيّر بصمتك زي ما تغيّر باسورد. لو البيانات اتسربت، الأثر طويل المدى.', color: '#fb7185' },
  { id: 'combine', label: 'Combine factors', sub: 'biometric + PIN or key', detail: 'أفضل استخدام إن البصمة تكون جزء من MFA مع عامل تاني، مش بديل عن كل الحماية.', color: '#34d399' },
]

export function BiometricLimitsDiagram() {
  const [selected, setSelected] = useState('permanent')
  const item = biometricLimitItems.find((entry) => entry.id === selected) ?? biometricLimitItems[0]
  const controls = <ChoiceButtons items={biometricLimitItems.map((entry) => ({ id: entry.id, label: entry.label }))} selected={selected} onSelect={setSelected} />
  return (
    <ChoiceShell title="BIOMETRIC LIMITATIONS" controls={controls} legend={`**${item.label}** — ${item.detail}`}>
      <SelectorBoard items={biometricLimitItems} selected={selected} onSelect={setSelected} focusTitle="BIOMETRIC LIMITATIONS" />
    </ChoiceShell>
  )
}

const passwordLabScenarios: LabScenario[] = [
  {
    prompt: 'نموذج `<NAME>123`: موظف استخدم اسمه مع تسلسل أرقام. إيه التقييم؟',
    options: [
      { id: 'strong', label: 'Strong', correct: false, detail: 'غلط: الاسم معلومة شخصية والـ 123 تسلسل متوقع، فالنموذج ضعيف.', },
      { id: 'weak', label: 'Weak', correct: true, detail: 'صح: معلومة شخصية + تسلسل متوقع = خطر Dictionary/Targeted guessing.', },
    ],
    hint: 'اسأل: هل المحتوى متوقع أو مرتبط بالشخص؟',
  },
  {
    prompt: 'نموذج `<CITY>!2024`: كلمة مدينة مع علامة تعجب وسنة. إيه التقييم؟',
    options: [
      { id: 'strong', label: 'Strong', correct: false, detail: 'غلط: الرمز والسنة مش بيخلّوا كلمة القاموس قوية.', },
      { id: 'weak', label: 'Weak', correct: true, detail: 'صح: كلمة من القاموس + سنة متوقعة لسه قابلة للتخمين.', },
    ],
    hint: 'وجود Symbol لوحده مش ضمان للقوة.',
  },
  {
    prompt: 'نموذج `<LONG_UNIQUE_PHRASE>`: عبارة طويلة وفريدة لهذا الحساب فقط. إيه التقييم؟',
    options: [
      { id: 'strong', label: 'Strong', correct: true, detail: 'صح: الطول والتفرد وعدم التوقع خصائص مهمة للباسورد القوي.', },
      { id: 'weak', label: 'Weak', correct: false, detail: 'غلط: العبارة الطويلة الفريدة أقوى من الكلمات القصيرة المتوقعة.', },
    ],
    hint: 'قارن الطول والتفرد مش عدد الرموز بس.',
  },
  {
    prompt: 'موظف استخدم نفس القيمة في بريد العمل وحساب تسوق شخصي. إيه الخطر؟',
    options: [
      { id: 'reuse', label: 'Reuse risk', correct: true, detail: 'صح: تسريب موقع واحد بيخلي حساب التاني مكشوف (Credential stuffing).', },
      { id: 'safe', label: 'No risk', correct: false, detail: 'غلط: إعادة الاستخدام هي المشكلة حتى لو القيمة نفسها طويلة.', },
    ],
    hint: 'فكّر في تسريب البيانات من موقع لآخر.',
  },
]

export function LabPasswordStrengthDiagram() {
  return (
    <ScenarioLab
      title="LAB 1 - PASSWORD STRENGTH ASSESSMENT"
      scenarios={passwordLabScenarios}
      ariaLabel="Password strength assessment lab with interactive weak and stronger decisions"
    />
  )
}

const mfaLabScenarios: LabScenario[] = [
  {
    prompt: 'موظف بعيد عن المكتب بيدخل VPN. إيه أنسب طريقة MFA؟',
    hint: 'ابحث عن توازن بين الأمان وسهولة الاستخدام.',
    options: [
      { id: 'sms', label: 'SMS OTP', correct: false, detail: 'SMS فيه خطر SIM swapping واعتراض، وغير مناسب كأقوى خيار.', },
      { id: 'totp', label: 'Authenticator app TOTP', correct: true, detail: 'صح: TOTP أقوى من SMS وسهل للمستخدمين عن بعد.', },
      { id: 'none', label: 'Password only', correct: false, detail: 'غلط: باسورد لوحده SFA، ومفيش عامل تاني.', },
    ],
  },
  {
    prompt: 'مسؤول شبكة بيدخل نظام إدارة أجهزة حساس. إيه أنسب طريقة؟',
    hint: 'الحسابات الإدارية محتاجة أعلى مستوى حماية.',
    options: [
      { id: 'key', label: 'Hardware security key', correct: true, detail: 'صح: المفتاح المادي مقاوم للتصيد ومناسب للحسابات الإدارية.', },
      { id: 'sms', label: 'SMS OTP', correct: false, detail: 'غلط: SMS أضعف وأقل ملاءمة لحساب إداري.', },
      { id: 'email', label: 'Email OTP', correct: false, detail: 'غلط: لو البريد اتخترق، الكود يوصل للمهاجم.', },
    ],
  },
  {
    prompt: 'موظف فقد جهاز المصادقة التابع له. إيه الإجراء الآمن؟',
    hint: 'الاستعادة لازم تتحقق من الهوية.',
    options: [
      { id: 'codes', label: 'Recovery codes + identity check', correct: true, detail: 'صح: رموز احتياطية مع تحقق قوي من الهوية قبل إعادة الربط.', },
      { id: 'share', label: 'Borrow a colleague code', correct: false, detail: 'غلط: مشاركة رموز الزملاء بتكسر مبدأ التفرد والمسؤولية.', },
      { id: 'disable', label: 'Disable MFA temporarily', correct: false, detail: 'غلط: تعطيل MFA بيفتح ثغرة لفترة، وده مش الحل المعتاد.', },
    ],
  },
  {
    prompt: 'مستخدم بيوافق على إشعار دخول وصل له وهو مش متوقع. إيه الخطر؟',
    hint: 'فكّر في الضغط النفسي أو التعب.',
    options: [
      { id: 'fatigue', label: 'Push fatigue', correct: true, detail: 'صح: الموافقة المتكررة ممكن تخلّي المستخدم يوافق على طلب مزيف.', },
      { id: 'totp', label: 'TOTP code', correct: false, detail: 'غلط: هنا المشكلة في إشعار الدفع مش في كود TOTP.', },
      { id: 'key', label: 'Security key', correct: false, detail: 'غلط: المفتاح المادي بيربط التوقيع بالموقع الصحيح.', },
    ],
  },
]

export function LabMfaChoiceDiagram() {
  return (
    <ScenarioLab
      title="LAB 2 - CHOOSE THE RIGHT MFA METHOD"
      scenarios={mfaLabScenarios}
      ariaLabel="MFA method selection lab with interactive organizational scenarios"
    />
  )
}

const certLabScenarios: LabScenario[] = [
  {
    prompt: 'شهادة سليمة: مُصدِر موثوق، تواريخ صحيحة، واسم المضيف مطابق. القرار؟',
    hint: 'راجع خطوات التحقق كلها.',
    options: [
      { id: 'trust', label: 'Trust', correct: true, detail: 'صح: كل فحوصات التحقق نجحت، يكمل الاتصال الآمن.', },
      { id: 'reject', label: 'Reject', correct: false, detail: 'غلط: مفيش سبب لرفض شهادة استوفت شروط التحقق.', },
    ],
  },
  {
    prompt: 'الشهادة منتهية الصلاحية (expired). القرار؟',
    hint: 'افحص تاريخ notAfter.',
    options: [
      { id: 'trust', label: 'Trust', correct: false, detail: 'غلط: الشهادة المنتهية مرفوضة حتى لو المُصدِر موثوق.', },
      { id: 'reject', label: 'Reject', correct: true, detail: 'صح: فحص فترة الصلاحية جزء أساسي من التحقق.', },
    ],
  },
  {
    prompt: 'المُصدِر مش موجود في الـ trust store. القرار؟',
    hint: 'مين وقّع على الشهادة؟',
    options: [
      { id: 'trust', label: 'Trust', correct: false, detail: 'غلط: من غير سلسلة لجذر موثوق مفيش ثقة.', },
      { id: 'reject', label: 'Reject', correct: true, detail: 'صح: Untrusted issuer معناها إن السلسلة ما وصلتش لجذر موثوق.', },
    ],
  },
  {
    prompt: 'اسم المضيف في الشهادة مختلف عن العنوان اللي العميل اتصل بيه. القرار؟',
    hint: 'قارن الاسم المطلوب بـ Subject.',
    options: [
      { id: 'trust', label: 'Trust', correct: false, detail: 'غلط: Hostname mismatch معناها إن الشهادة مش لهذا السيرفر.', },
      { id: 'reject', label: 'Reject', correct: true, detail: 'صح: فحص اسم المضيف بيمنع استخدام شهادة لسيرفر تاني.', },
    ],
  },
  {
    prompt: 'شهادة السيرفر موجودة بس الـ Intermediate CA ناقص من السلسلة. القرار؟',
    hint: 'السلسلة لازم توصل للجذر.',
    options: [
      { id: 'trust', label: 'Trust', correct: false, detail: 'غلط: غياب حلقة وسيطة بيمنع بناء السلسلة كاملة.', },
      { id: 'reject', label: 'Reject', correct: true, detail: 'صح: Missing intermediate certificate معناها إن التحقق ما اكتملش.', },
    ],
  },
  {
    prompt: 'الشهادة مبينة كـ revoked في قائمة الإلغاء. القرار؟',
    hint: 'افحص CRL أو OCSP.',
    options: [
      { id: 'trust', label: 'Trust', correct: false, detail: 'غلط: الشهادة الملغاة مرفوضة حتى لو كل الباقي تمام.', },
      { id: 'reject', label: 'Reject', correct: true, detail: 'صح: فحص الإلغاء بيمنع شهادات اللي اعتُبرت غير موثوقة قبل انتهائها.', },
    ],
  },
]

export function LabCertValidationDiagram() {
  return (
    <ScenarioLab
      title="LAB 3 - DIGITAL CERTIFICATE VALIDATION"
      scenarios={certLabScenarios}
      ariaLabel="Certificate validation lab with interactive trust and reject decisions"
    />
  )
}

const layeredStages = [
  'طبقة المعلومات: المستخدم بيقدّم هوية وباسورد طويل وفريد.',
  'طبقة إدارة: Password manager بيولّد ويحفظ قيمة مختلفة لكل خدمة.',
  'طبقة MFA: عامل تاني من فئة Have أو Are.',
  'طبقة الاتصال: digital certificate بيتحقق من هوية السيرفر ومفتاحه العام.',
  'طبقة Biometrics: ممكن يضاف كعامل إضافي مع قيود FAR وFRR.',
  'القرار النهائي: السماح بالدخول بعد نجاح الفحوص المطلوبة.',
]

export function LayeredAuthArchitectureDiagram() {
  const playback = useStepPlayback(layeredStages.length)
  const s = playback.stage
  return (
    <StepShell title="LAYERED PASSWORD + MFA + CERTIFICATE + BIOMETRIC AUTH" playback={playback} legend={layeredStages[s]}>
      <StageBoard stages={['Password', 'Manager', 'MFA', 'Certificate', 'Biometric', 'Access decision']} stage={s} ariaLabel="Layered authentication architecture combining password management MFA certificates and biometrics" />
    </StepShell>
  )
}
