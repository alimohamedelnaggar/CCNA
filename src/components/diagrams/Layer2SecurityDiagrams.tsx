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

function ChoiceButtons({ items, selected, onSelect }: { items: { id: string; label: string }[]; selected: string; onSelect: (id: string) => void }) {
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
      <SvgText x={x + w / 2} y={y + 25} color={selected ? '#fbbf24' : color} size={8.6} bold>{title}</SvgText>
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

function SelectorBoard({ items, selected, onSelect, focusTitle, columns = 3 }: {
  items: InfoItem[]
  selected: string
  onSelect: (id: string) => void
  focusTitle: string
  columns?: number
}) {
  const item = items.find((entry) => entry.id === selected) ?? items[0]
  const gapX = columns === 4 ? 222 : columns === 2 ? 430 : 300
  const width = columns === 4 ? 195 : columns === 2 ? 390 : 275
  const startX = columns === 4 ? 18 : columns === 2 ? 60 : 45
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
      <Badge x={45} y={350} text={`SELECTED: ${item.label} - ${item.sub}`} color={item.color} active w={830} />
    </svg>
  )
}

function StageBoard({ stages, stage, ariaLabel, note }: { stages: string[]; stage: number; ariaLabel: string; note?: string }) {
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
      <Badge x={160} y={350} text={note ?? 'Educational simulation - fictional topology, no real device output'} color="#fb7185" active w={600} />
    </svg>
  )
}

interface BoardCase {
  id: string
  label: string
  detail: string
  stages: string[]
  focus: number
  verdict: string
  tone: 'good' | 'bad' | 'info'
}

function CaseBoard({ cases, selected, onSelect, title, ariaLabel }: {
  cases: BoardCase[]
  selected: string
  onSelect: (id: string) => void
  title: string
  ariaLabel: string
}) {
  const current = cases.find((entry) => entry.id === selected) ?? cases[0]
  const toneColor = current.tone === 'good' ? '#34d399' : current.tone === 'bad' ? '#fb7185' : '#22d3ee'
  const controls = <ChoiceButtons items={cases.map((entry) => ({ id: entry.id, label: entry.label }))} selected={selected} onSelect={onSelect} />
  return (
    <ChoiceShell title={title} controls={controls} legend={`**${current.label}** — ${current.detail}`}>
      <svg viewBox="0 0 920 400" className="h-auto w-full min-w-[880px]" role="img" aria-label={ariaLabel}>
        <Badge x={110} y={16} text={title} color="#a78bfa" active w={700} />
        {current.stages.map((label, index) => {
          const col = index % 4
          const row = Math.floor(index / 4)
          const x = 25 + col * 225
          const y = 88 + row * 82
          const active = index === current.focus
          const done = index < current.focus
          const color = active ? toneColor : done ? '#34d399' : '#475569'
          return (
            <motion.g key={label} animate={{ opacity: active ? 1 : done ? 0.78 : 0.44 }} transition={{ duration: 0.25 }}>
              <rect x={x} y={y} width={200} height={60} rx="9" fill="#0b1224" stroke={color} strokeWidth={active ? 2.4 : 1.2} />
              <SvgText x={x + 100} y={y + 25} color={active ? color : '#cbd5e1'} size={8.2} bold>{label}</SvgText>
              <SvgText x={x + 100} y={y + 45} color="#94a3b8" size={7.2}>{active ? 'DECISION POINT' : done ? 'completed' : 'upcoming'}</SvgText>
            </motion.g>
          )
        })}
        <Badge x={55} y={352} text={current.verdict} color={toneColor} active w={810} />
      </svg>
    </ChoiceShell>
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
        <StageBoard stages={scenarios.map((_, index) => `Scenario ${index + 1}`)} stage={stage} ariaLabel={ariaLabel} />
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

/* ---------- 1. Layer 2 security overview ---------- */
const overviewStages = [
  'Layer 2 هو مستوى الـ switch والـ MAC addresses، والهجوم هنا بيحصل جوه الـ LAN نفسها.',
  'الـ switch بيتعلم source MAC من الإطارات، ودي نقطة مهمة بيستغلها المهاجم.',
  'أي جهاز يتوصّل بـ access port ممكن يبعت إطارات أو رسائل DHCP وARP.',
  'Layer 3 security زي ACL بتفحص IP packets، لكن Layer 2 security بتحكم في الـ port والـ MAC والـ DHCP والـ ARP.',
  'Port Security بيقيد الـ MAC addresses المسموحة على الـ access port.',
  'DHCP Snooping بيمنع rogue DHCP server وبيبني binding database.',
  'DAI بيستخدم الـ bindings عشان يتحقق من ARP قبل ما يمرّره.',
  'الدائع مترابطة: defense in depth، مش حل واحد يمنع كل هجوم.',
]

export function L2OverviewDiagram() {
  const playback = useStepPlayback(overviewStages.length)
  const s = playback.stage
  return (
    <StepShell title="LAYER 2 SECURITY OVERVIEW" playback={playback} legend={overviewStages[s]}>
      <svg viewBox="0 0 920 400" className="h-auto w-full min-w-[880px]" role="img" aria-label="Layer 2 security overview for access switches and LAN threats">
        <Box x={20} y={145} w={165} h={95} title="Endpoint" sub="access port" color="#38bdf8" active />
        <Box x={235} y={145} w={190} h={95} title="Access Switch" sub="MAC table + controls" color="#a78bfa" active={s >= 1} />
        <Box x={475} y={145} w={190} h={95} title="Security Controls" sub="PortSec / Snooping / DAI" color={s >= 5 ? '#34d399' : '#f59e0b'} active={s >= 4} />
        <Box x={715} y={145} w={180} h={95} title="Trusted LAN" sub="server / uplink" color="#34d399" active={s >= 7} />
        <LinkLine x1={185} y1={192} x2={235} y2={192} color="#38bdf8" active />
        <LinkLine x1={425} y1={192} x2={475} y2={192} color="#a78bfa" active={s >= 4} />
        <LinkLine x1={665} y1={192} x2={715} y2={192} color="#34d399" active={s >= 7} />
        <FlowDot x1={185} y1={192} x2={715} y2={192} color="#f59e0b" active={s >= 4} />
        <Badge x={105} y={312} text="These features are defense-in-depth controls, not complete protection" color="#fb7185" active={s >= 7} w={710} />
      </svg>
    </StepShell>
  )
}

/* ---------- 2. Threat map ---------- */
const threatItems: InfoItem[] = [
  { id: 'flood', label: 'MAC Address Flooding', sub: 'fill the MAC table', detail: 'كثرة عناوين MAC مصدرية بتعمل overloaded MAC address table، فالسويتش يبدأ يفيض إطارات لكل المنافذ.', color: '#38bdf8' },
  { id: 'starve', label: 'DHCP Starvation', sub: 'consume the IP pool', detail: 'مهاجم بيطلب عناوين IP كتير عشان يستهلك DHCP pool، فالعملاء الشرعيين ما يلاقوش عنوان.', color: '#a78bfa' },
  { id: 'rogue', label: 'Rogue DHCP Server', sub: 'wrong gateway / DNS', detail: 'سيرفر DHCP مزيف بيدي العملاء gateway أو DNS غلط، فبيحوّل الترافيك أو يعطله.', color: '#fb7185' },
  { id: 'spoof', label: 'ARP Spoofing', sub: 'falsify identity', detail: 'المهاجم بيبعت ARP ببيانات مزيفة عشان يخلي الأجهزة تربط IP بـ MAC غلط.', color: '#f59e0b' },
  { id: 'poison', label: 'ARP Poisoning', sub: 'poison caches', detail: 'نتيجة الـ spoofing إن ARP cache يتسمّم، فالحزم تروح للمهاجم بدل صاحبها.', color: '#34d399' },
  { id: 'unauth', label: 'Unauthorized Device', sub: 'plug into access port', detail: 'أي جهاز يتوصّل بمنفذ وصول ممكن يبدأ يتواصل أو يهاجم من جوه الـ LAN.', color: '#22d3ee' },
]

export function L2ThreatMapDiagram() {
  const [selected, setSelected] = useState('rogue')
  const item = threatItems.find((entry) => entry.id === selected) ?? threatItems[0]
  const controls = <ChoiceButtons items={threatItems.map((entry) => ({ id: entry.id, label: entry.label }))} selected={selected} onSelect={setSelected} />
  return (
    <ChoiceShell title="LAN THREAT MAP" controls={controls} legend={`**${item.label}** — ${item.detail}`}>
      <SelectorBoard items={threatItems} selected={selected} onSelect={setSelected} focusTitle="LAYER 2 THREATS" />
    </ChoiceShell>
  )
}

/* ---------- 3. MAC flooding ---------- */
const floodStages = [
  'السويتش بيتعلم source MAC لكل إطار بيوصله على منفذ.',
  'الـ MAC address table ليها سعة محدودة.',
  'المهاجم بيبعت إطارات بعناوين MAC مصدرية كتير جداً.',
  'الجدول يمتلئ، فيضيع تعليم عناوين حقيقية.',
  'السويتش يبدأ يفيض الإطارات لكل منافذ الـ VLAN، فيمكن للمهاجم يشوف ترافيك مش له.',
]

export function L2MacFloodDiagram() {
  const playback = useStepPlayback(floodStages.length)
  const s = playback.stage
  return (
    <StepShell title="MAC ADDRESS FLOODING" playback={playback} legend={floodStages[s]}>
      <StageBoard stages={['Frame arrives','Learn source MAC','Send many fake MACs','MAC table full','Unknown unicast flood']} stage={s} ariaLabel="MAC address flooding concept overwhelming the switch MAC address table" />
    </StepShell>
  )
}

/* ---------- 4. Port Security operation ---------- */
const portSecStages = [
  'إطار وصل على access port Gi0/1.',
  'السويتش بيقرأ الـ source MAC من الإطار.',
  'بيراجع سياسة Port Security على المنفذ: maximum وsecure MAC addresses.',
  'لو العنوان مسموح وعدد الـ secure MAC أقل من الـ maximum، يتعلم كـ secure MAC.',
  'الإطار يتعالج عادي ويتForward حسب الـ MAC table.',
  'لو زاد العدد أو العنوان مش مسموح، يتطبّق violation mode.',
]

export function L2PortSecFlowDiagram() {
  const playback = useStepPlayback(portSecStages.length)
  const s = playback.stage
  return (
    <StepShell title="PORT SECURITY OPERATION" playback={playback} legend={portSecStages[s]}>
      <svg viewBox="0 0 920 400" className="h-auto w-full min-w-[880px]" role="img" aria-label="Port Security operation from frame arrival to violation action">
        <Box x={15} y={145} w={160} h={95} title="Frame" sub="source MAC" color="#38bdf8" active />
        <Box x={225} y={145} w={180} h={95} title="Gi0/1" sub="access port" color="#a78bfa" active={s >= 1} />
        <Box x={455} y={145} w={190} h={95} title="Security policy" sub="max + secure MACs" color={s >= 5 ? '#fb7185' : '#f59e0b'} active={s >= 2} />
        <Box x={695} y={145} w={200} h={95} title={s >= 5 ? 'Violation action' : 'Forward frame'} sub={s >= 5 ? 'protect / restrict / shutdown' : 'normal switching'} color={s >= 5 ? '#fb7185' : '#34d399'} active={s >= 4} />
        <LinkLine x1={175} y1={192} x2={225} y2={192} color="#38bdf8" active />
        <LinkLine x1={405} y1={192} x2={455} y2={192} color="#a78bfa" active={s >= 2} />
        <LinkLine x1={645} y1={192} x2={695} y2={192} color={s >= 5 ? '#fb7185' : '#34d399'} active={s >= 4} />
        <FlowDot x1={175} y1={192} x2={695} y2={192} color="#f59e0b" active={s >= 5} />
        <Badge x={130} y={312} text="Port Security restricts MAC addresses on an access port; it is not a complete Layer 2 defense" color="#22d3ee" active w={660} />
      </svg>
    </StepShell>
  )
}

/* ---------- 5. Normal vs secure learning ---------- */
const learningItems: InfoItem[] = [
  { id: 'normal', label: 'Normal MAC learning', sub: 'dynamic table entry', detail: 'السويتش بيضيف source MAC في الـ MAC address table بشكل dynamic، والدخول متاح لأي عنوان بيوصله الإطار.', color: '#38bdf8' },
  { id: 'secure', label: 'Secure MAC learning', sub: 'policy-controlled entry', detail: 'مع Port Security، الـ MAC بيتعلم بس لو السياسة سمحت، وعدد الـ secure MAC مقيد بـ maximum. الزيادة بتعمل violation.', color: '#34d399' },
  { id: 'aging', label: 'Aging concept', sub: 'safe to mention, platform-specific', detail: 'بعض المنصات بتدعم secure MAC aging؛ التفاصيل بتختلف حسب IOS والمنصة، فما نفترضش سلوك واحد في كل مكان.', color: '#a78bfa' },
]

export function L2LearningCompareDiagram() {
  const [selected, setSelected] = useState('normal')
  const item = learningItems.find((entry) => entry.id === selected) ?? learningItems[0]
  const controls = <ChoiceButtons items={learningItems.map((entry) => ({ id: entry.id, label: entry.label }))} selected={selected} onSelect={setSelected} />
  return (
    <ChoiceShell title="NORMAL vs SECURE MAC LEARNING" controls={controls} legend={`**${item.label}** — ${item.detail}`}>
      <SelectorBoard items={learningItems} selected={selected} onSelect={setSelected} focusTitle="MAC LEARNING COMPARISON" columns={2} />
    </ChoiceShell>
  )
}

/* ---------- 6. Secure MAC types ---------- */
const macTypeItems: InfoItem[] = [
  { id: 'static', label: 'Static secure MAC', sub: 'configured manually', detail: 'عنوان MAC بيكتبه المسؤول يدوياً في الـ running config. ثابت لحد ما يتشال أو يتغير.', color: '#38bdf8' },
  { id: 'dynamic', label: 'Dynamic secure MAC', sub: 'learned, not saved', detail: 'السويتش بيتعلمه من الإطارات، وبيفضل في الـ running config للجلسة الحالية فقط؛ ما بيتبقاش بعد reload.', color: '#a78bfa' },
  { id: 'sticky', label: 'Sticky secure MAC', sub: 'learned into running config', detail: 'بيتعلم ديناميكياً بس بيتكتب في الـ running config زي الـ static. لازم تحفظ الـ config عشان يبقى بعد reload.', color: '#34d399' },
]

export function L2MacTypesDiagram() {
  const [selected, setSelected] = useState('sticky')
  const item = macTypeItems.find((entry) => entry.id === selected) ?? macTypeItems[0]
  const controls = <ChoiceButtons items={macTypeItems.map((entry) => ({ id: entry.id, label: entry.label }))} selected={selected} onSelect={setSelected} />
  return (
    <ChoiceShell title="STATIC vs DYNAMIC vs STICKY" controls={controls} legend={`**${item.label}** — ${item.detail}`}>
      <SelectorBoard items={macTypeItems} selected={selected} onSelect={setSelected} focusTitle="SECURE MAC ADDRESS TYPES" columns={2} />
    </ChoiceShell>
  )
}

/* ---------- 7. Sticky persistence ---------- */
const stickyStages = [
  'المسؤول بيفعّل switchport port-security mac-address sticky على الـ access port.',
  'العميل بيرسل إطار، والسويتش بيتعلم source MAC كـ sticky secure address.',
  'العنوان بيظهر جوّه الـ running configuration.',
  'لو ما حفظتش الـ config، الـ sticky addresses تضيع بعد reload.',
  'لازم copy running-config startup-config عشان الـ learned sticky MACs تبقى.',
]

export function L2StickyPersistenceDiagram() {
  const playback = useStepPlayback(stickyStages.length)
  const s = playback.stage
  return (
    <StepShell title="STICKY MAC AND CONFIG PERSISTENCE" playback={playback} legend={stickyStages[s]}>
      <StageBoard stages={['Enable sticky','Learn from frame','Running config','Reload risk','Save config']} stage={s} ariaLabel="Sticky MAC learning and running configuration persistence across reload" note="Sticky is not automatically permanent - save the running configuration" />
    </StepShell>
  )
}

/* ---------- 8. Maximum secure MAC addresses ---------- */
const maxCases: BoardCase[] = [
  { id: 'max2', label: 'maximum 2, one device', detail: 'المنفذ مسموح له بـ 2 secure MAC، والجهاز الأول اعتُبر sticky. مفيش violation.', stages: ['Frame from PC1','Check secure MAC count','1 < maximum 2','Learn sticky MAC','Forward normally'], focus: 2, verdict: 'RESULT: ALLOWED - one secure MAC learned', tone: 'good' },
  { id: 'max2full', label: 'maximum 2, second device', detail: 'الجهاز التاني داخل في الحد المسموح، فبيتعلم كمان. لسه مفيش violation.', stages: ['Frame from PC2','Check secure MAC count','2 = maximum 2','Learn sticky MAC','Forward normally'], focus: 2, verdict: 'RESULT: ALLOWED - second secure MAC learned', tone: 'good' },
  { id: 'exceed', label: 'maximum 2, third device', detail: 'الجهاز التالت بيزيد عن الـ maximum، فالسويتش بيطبّق الـ violation mode المهيأ على المنفذ.', stages: ['Frame from unknown PC','Check secure MAC count','3 > maximum 2','Apply violation mode','Drop or err-disable'], focus: 2, verdict: 'RESULT: VIOLATION - configured action applies', tone: 'bad' },
]

export function L2MaximumDiagram() {
  const [selected, setSelected] = useState('max2')
  return <CaseBoard cases={maxCases} selected={selected} onSelect={setSelected} title="MAXIMUM SECURE MAC ADDRESSES" ariaLabel="Maximum secure MAC addresses interactive limit and violation decision" />
}

/* ---------- 9. Violation flow ---------- */
const violationStages = [
  'إطار وصل بمصدر MAC مش مسموح، أو بعد ما الـ maximum اتجاوز.',
  'السويتش بيقرأ الـ violation mode المهيأ على المنفذ.',
  'Protect بيدّي الإطار ويكمل شغال.',
  'Restrict بيدّي الإطار وبيزود العدّاد وقد يبعت تنبيه حسب المنصة.',
  'Shutdown بيحط المنفذ في error-disabled ويوقّف الترافيك.',
]

export function L2ViolationFlowDiagram() {
  const playback = useStepPlayback(violationStages.length)
  const s = playback.stage
  return (
    <StepShell title="PORT SECURITY VIOLATION FLOW" playback={playback} legend={violationStages[s]}>
      <StageBoard stages={['Violation detected','Read violation mode','Protect','Restrict','Shutdown']} stage={s} ariaLabel="Port Security violation handling flow from unauthorized source to action" />
    </StepShell>
  )
}

/* ---------- 10-12. Violation modes ---------- */
const protectCases: BoardCase[] = [
  { id: 'allowed', label: 'Allowed MAC', detail: 'العنوان ضمن الـ secure MAC addresses، فالإطار يعدي عادي.', stages: ['Frame arrives','Match secure MAC','Within maximum','Forward frame'], focus: 1, verdict: 'RESULT: FORWARDED', tone: 'good' },
  { id: 'unknown', label: 'Unknown MAC', detail: 'في Protect، الإطار يتدّى من غير ما المنفذ يتقفل. في كتير من التطبيقات مفيش نفس سلوك العدّاد والتنبيه الموجود في Restrict.', stages: ['Frame arrives','Unknown source MAC','Drop frame','Port stays up'], focus: 2, verdict: 'RESULT: DROPPED - port stays up, limited notification', tone: 'bad' },
]
export function L2ProtectModeDiagram() {
  const [selected, setSelected] = useState('unknown')
  return <CaseBoard cases={protectCases} selected={selected} onSelect={setSelected} title="PROTECT VIOLATION MODE" ariaLabel="Protect mode dropping unauthorized frames without port shutdown" />
}

const restrictCases: BoardCase[] = [
  { id: 'unknown', label: 'Unknown MAC', detail: 'Restrict بيوقّع الإطار، بيزوّد violation counter، وبيقدر يبعت تنبيه حسب إعداد المنصة.', stages: ['Frame arrives','Unknown source MAC','Drop frame','Increment counter','Notify if configured'], focus: 3, verdict: 'RESULT: DROPPED + COUNTER + OPTIONAL LOG', tone: 'bad' },
  { id: 'allowed', label: 'Allowed MAC', detail: 'العنوان المسموح ما بيعملش violation، فالإطار يتforward من غير أثر على العدّاد.', stages: ['Frame arrives','Match secure MAC','Within maximum','Forward frame'], focus: 1, verdict: 'RESULT: FORWARDED', tone: 'good' },
]
export function L2RestrictModeDiagram() {
  const [selected, setSelected] = useState('unknown')
  return <CaseBoard cases={restrictCases} selected={selected} onSelect={setSelected} title="RESTRICT VIOLATION MODE" ariaLabel="Restrict mode dropping frames incrementing violation counter and notifications" />
}

const shutdownCases: BoardCase[] = [
  { id: 'violation', label: 'Violation occurs', detail: 'Shutdown هو الافتراضي في كتير من Catalyst. بيحط المنفذ في error-disabled، فيتوقف كل الترافيك لحد التدخل.', stages: ['Frame arrives','Unknown source MAC','Violation detected','Port err-disabled','Investigate then recover'], focus: 3, verdict: 'RESULT: ERR-DISABLED - manual or policy-based recovery', tone: 'bad' },
  { id: 'recovery', label: 'Recovery view', detail: 'ما نفترضش استعادة تلقائية؛ لازم نفهم سبب المشكلة، ونراجع السياسة، وبعدين نقرر shutdown/no shutdown أو آلية استعادة مدروسة.', stages: ['Identify root cause','Check port-security address','Review policy','Recover intentionally','Verify traffic'], focus: 2, verdict: 'RESULT: RECOVER SAFELY - understand before enabling auto-recovery', tone: 'info' },
]
export function L2ShutdownModeDiagram() {
  const [selected, setSelected] = useState('violation')
  return <CaseBoard cases={shutdownCases} selected={selected} onSelect={setSelected} title="SHUTDOWN AND ERR-DISABLED" ariaLabel="Shutdown mode placing the port into error-disabled state" />
}

/* ---------- 13. Mode compare ---------- */
const modeItems: InfoItem[] = [
  { id: 'protect', label: 'Protect', sub: 'drop only', detail: 'بيسقط الإطار المخالف بس. المنفذ يفضل شغال، وتأثير العدّاد والتنبيه أقل وضوحاً من Restrict.', color: '#38bdf8' },
  { id: 'restrict', label: 'Restrict', sub: 'drop + counter', detail: 'بيسقط الإطار، بيزود العدّاد، وبيقدر يبعت تنبيه حسب المنصة والإعداد.', color: '#f59e0b' },
  { id: 'shutdown', label: 'Shutdown', sub: 'err-disabled', detail: 'بيحط المنفذ في error-disabled عند أول violation. افتراضي شائع على Catalyst، وتأثيره التشغيلي أكبر.', color: '#fb7185' },
]

export function L2ModeCompareDiagram() {
  const [selected, setSelected] = useState('restrict')
  const item = modeItems.find((entry) => entry.id === selected) ?? modeItems[0]
  const controls = <ChoiceButtons items={modeItems.map((entry) => ({ id: entry.id, label: entry.label }))} selected={selected} onSelect={setSelected} />
  return (
    <ChoiceShell title="PROTECT vs RESTRICT vs SHUTDOWN" controls={controls} legend={`**${item.label}** — ${item.detail}`}>
      <SelectorBoard items={modeItems} selected={selected} onSelect={setSelected} focusTitle="VIOLATION MODE COMPARISON" columns={2} />
    </ChoiceShell>
  )
}

/* ---------- 14. DHCP DORA ---------- */
const doraStages = [
  'DHCP Discover: العميل بيدور على أي DHCP server.',
  'DHCP Offer: السيرفر بيعرض عنوان IP.',
  'DHCP Request: العميل بيطلب العنوان اللي اختاره.',
  'DHCP ACK: السيرفر بيتأكيد، والعميل بيستخدم العنوان.',
]

export function L2DhcpDoraDiagram() {
  const playback = useStepPlayback(doraStages.length)
  const s = playback.stage
  return (
    <StepShell title="DHCP DORA PROCESS" playback={playback} legend={doraStages[s]}>
      <svg viewBox="0 0 920 400" className="h-auto w-full min-w-[880px]" role="img" aria-label="DHCP DORA process from discover to acknowledgment">
        <Box x={25} y={145} w={175} h={95} title="DHCP Client" sub="untrusted access port" color="#38bdf8" active />
        <Box x={370} y={145} w={180} h={95} title="Switch" sub="snooping checks" color="#a78bfa" active={s >= 1} />
        <Box x={715} y={145} w={180} h={95} title="DHCP Server" sub="trusted port" color="#34d399" active={s >= 1} />
        <LinkLine x1={200} y1={192} x2={370} y2={192} color="#38bdf8" active />
        <LinkLine x1={550} y1={192} x2={715} y2={192} color="#34d399" active={s >= 1} />
        <FlowDot x1={200} y1={192} x2={715} y2={192} color="#f59e0b" active />
        <Badge x={140} y={312} text={['DISCOVER','OFFER','REQUEST','ACK'][s]} color="#22d3ee" active w={640} />
      </svg>
    </StepShell>
  )
}

/* ---------- 15. Rogue DHCP ---------- */
const rogueCases: BoardCase[] = [
  { id: 'legit', label: 'Legitimate server', detail: 'الـ Offer جاي من Gi0/24 المتعرّف كـ trusted، فالسويتش يسمح بيه ويكمل الـ DORA.', stages: ['Client Discover','Offer from Gi0/24','Port is trusted','Allow offer','Binding created'], focus: 2, verdict: 'RESULT: ACCEPTED - trusted DHCP infrastructure', tone: 'good' },
  { id: 'rogue', label: 'Rogue server', detail: 'الـ Offer جاي من access port untrusted، فـ DHCP Snooping يوقّعه قبل ما يوصل للعميل.', stages: ['Client Discover','Rogue offer from Gi0/3','Port is untrusted','Drop offer','Client stays safe'], focus: 2, verdict: 'RESULT: DROPPED - rogue offer blocked', tone: 'bad' },
]
export function L2RogueDhcpDiagram() {
  const [selected, setSelected] = useState('rogue')
  return <CaseBoard cases={rogueCases} selected={selected} onSelect={setSelected} title="ROGUE DHCP SERVER ATTACK" ariaLabel="Rogue DHCP server attack and how snooping blocks the offer" />
}

/* ---------- 16. DHCP trusted vs untrusted ---------- */
const dhcpTrustItems: InfoItem[] = [
  { id: 'client', label: 'Untrusted client port', sub: 'default in many IOS', detail: 'منافذ العملاء غالباً untrusted بال	default. رسائل DHCP من العميل زي Discover وRequest مسموحة، بس Offer وACK من المنفذ ده مرفوضة.', color: '#38bdf8' },
  { id: 'server', label: 'Trusted server port', sub: 'authorized DHCP only', detail: 'المنفذ المتصل بسيرفر DHCP شرعي يتعرّف trusted بـ ip dhcp snooping trust. لازم يتطابق مع الطوبولوجيا الحقيقية.', color: '#34d399' },
  { id: 'uplink', label: 'Uplink / distribution', sub: 'decide by topology', detail: 'ما نعملش كل الـ uplinks trusted تلقائياً. لو الـ uplink بيوصل لسيرفر DHCP شرعي أو switch موثوق، ممكن يتعرّف trusted بعد تحليل المسار.', color: '#f59e0b' },
]

export function L2DhcpTrustDiagram() {
  const [selected, setSelected] = useState('client')
  const item = dhcpTrustItems.find((entry) => entry.id === selected) ?? dhcpTrustItems[0]
  const controls = <ChoiceButtons items={dhcpTrustItems.map((entry) => ({ id: entry.id, label: entry.label }))} selected={selected} onSelect={setSelected} />
  return (
    <ChoiceShell title="DHCP SNOOPING TRUSTED vs UNTRUSTED" controls={controls} legend={`**${item.label}** — ${item.detail}`}>
      <SelectorBoard items={dhcpTrustItems} selected={selected} onSelect={setSelected} focusTitle="DHCP SNOOPING PORT TRUST" columns={2} />
    </ChoiceShell>
  )
}

/* ---------- 17. DHCP message filtering ---------- */
const dhcpFilterCases: BoardCase[] = [
  { id: 'discover', label: 'Discover from client', detail: 'Discover والـ Request من عميل على منفذ untrusted مسموحين، لأن العميل بيدور على سيرفر.', stages: ['Frame from Gi0/1','DHCP Discover','Port untrusted','Client message allowed','Forward toward servers'], focus: 3, verdict: 'RESULT: ALLOWED - client DHCP request message', tone: 'good' },
  { id: 'offer-rogue', label: 'Offer from untrusted', detail: 'Offer أو ACK من منفذ untrusted مرفوض. كده بنمنع سيرفر DHCP مزيف.', stages: ['Frame from Gi0/3','DHCP Offer','Port untrusted','Server message blocked','No rogue lease'], focus: 3, verdict: 'RESULT: DROPPED - server message on untrusted port', tone: 'bad' },
  { id: 'offer-trust', label: 'Offer from trusted', detail: 'Offer من منفذ trusted مسموح، لأنه متصل بالبنية الشرعية لـ DHCP.', stages: ['Frame from Gi0/24','DHCP Offer','Port trusted','Server message allowed','Continue DORA'], focus: 3, verdict: 'RESULT: ALLOWED - trusted DHCP server', tone: 'good' },
  { id: 'ack-trust', label: 'ACK from trusted', detail: 'ACK النهائي من المنفذ trusted كمان مسموح، وبعدين الـ binding database يتسجل.', stages: ['Frame from Gi0/24','DHCP ACK','Port trusted','ACK allowed','Binding recorded'], focus: 3, verdict: 'RESULT: ALLOWED - binding is created', tone: 'good' },
]

export function L2DhcpFilterDiagram() {
  const [selected, setSelected] = useState('offer-rogue')
  return <CaseBoard cases={dhcpFilterCases} selected={selected} onSelect={setSelected} title="DHCP MESSAGE FILTERING" ariaLabel="DHCP snooping message filtering on trusted and untrusted interfaces" />
}

/* ---------- 18. Binding database ---------- */
const bindingItems: InfoItem[] = [
  { id: 'pc1', label: 'Binding: PC1', sub: '192.168.10.11 / MAC-A / Gi0/1', detail: 'بعد ACK ناجح، السويتش بيسجل IP والمـ MAC والـ VLAN والمنفذ ومدة الـ lease. DAI بيستخدم نفس البيانات للتحقق من ARP.', color: '#38bdf8' },
  { id: 'pc2', label: 'Binding: PC2', sub: '192.168.10.12 / MAC-B / Gi0/2', detail: 'كل عميل DHCP له binding مستقل. لو الـ ARP من Gi0/2 قال إن IP بتاع PC1، DAI يرفضه لأن الـ binding مختلف.', color: '#34d399' },
  { id: 'missing', label: 'No binding', sub: 'static IP endpoint', detail: 'جهاز بـ IP ثابت ما بيعملش DORA، فمفيش binding. غالباً محتاج ARP ACL أو خطة DAI تانية حسب التصميم.', color: '#fb7185' },
]

export function L2BindingDbDiagram() {
  const [selected, setSelected] = useState('pc1')
  const item = bindingItems.find((entry) => entry.id === selected) ?? bindingItems[0]
  const controls = <ChoiceButtons items={bindingItems.map((entry) => ({ id: entry.id, label: entry.label }))} selected={selected} onSelect={setSelected} />
  return (
    <ChoiceShell title="DHCP SNOOPING BINDING DATABASE" controls={controls} legend={`**${item.label}** — ${item.detail}`}>
      <SelectorBoard items={bindingItems} selected={selected} onSelect={setSelected} focusTitle="BINDING DATABASE ENTRIES" columns={2} />
    </ChoiceShell>
  )
}

/* ---------- 19. ARP ---------- */
const arpStages = [
  'Devices على نفس الـ IPv4 subnet محتاجين MAC address عشان التسليم المحلي.',
  'الجهاز بيرسل ARP Request: مين عنده العنوان ده؟',
  'صاحب العنوان بيرد بـ ARP Reply فيه IP والمـ MAC بتاعه.',
  'الجهاز بيحفظ النتيجة في الـ ARP cache ويرسل الإطار.',
  'ARP مصمم للعمل، مش مضعف حماية مدمج قوي، فالتزيف ممكن.',
]

export function L2ArpFlowDiagram() {
  const playback = useStepPlayback(arpStages.length)
  const s = playback.stage
  return (
    <StepShell title="ARP REQUEST AND REPLY" playback={playback} legend={arpStages[s]}>
      <svg viewBox="0 0 920 400" className="h-auto w-full min-w-[880px]" role="img" aria-label="ARP request and reply process for IPv4 local delivery">
        <Box x={25} y={145} w={180} h={95} title="Host A" sub="needs MAC for IP-B" color="#38bdf8" active />
        <Box x={370} y={145} w={180} h={95} title="Switch" sub="forwards ARP" color="#a78bfa" active={s >= 1} />
        <Box x={715} y={145} w={180} h={95} title="Host B" sub="owns IP-B" color="#34d399" active={s >= 2} />
        <LinkLine x1={205} y1={192} x2={370} y2={192} color="#38bdf8" active />
        <LinkLine x1={550} y1={192} x2={715} y2={192} color="#34d399" active={s >= 2} />
        <FlowDot x1={205} y1={192} x2={715} y2={192} color="#f59e0b" active={s >= 3} />
        <Badge x={150} y={312} text={['Need MAC','ARP Request','ARP Reply','Cache + send','Security weakness'][s]} color="#22d3ee" active w={620} />
      </svg>
    </StepShell>
  )
}

/* ---------- 20. ARP spoofing ---------- */
const spoofStages = [
  'المهاجم بيعرف عنوان IP للخادم أو الـ default gateway.',
  'بيبعت ARP Reply مزيف بيقول إن الـ MAC بتاعه هو الـ MAC للعنوان ده.',
  'الأجهزة بتحدّث الـ ARP cache بالمعلومة الغلط.',
  'الحزم تروح للمهاجم بدل الجهاز الصحيح، فبيقدر يتنصت أو يعدّل.',
  'دي ARP spoofing، ونتيجتها ARP poisoning للـ cache.',
]

export function L2ArpSpoofDiagram() {
  const playback = useStepPlayback(spoofStages.length)
  const s = playback.stage
  return (
    <StepShell title="ARP SPOOFING AND POISONING" playback={playback} legend={spoofStages[s]}>
      <StageBoard stages={['Choose target IP','Send forged reply','Cache poisoned','Traffic redirected','MITM possible']} stage={s} ariaLabel="ARP spoofing and poisoning attack with forged ARP reply" />
    </StepShell>
  )
}

/* ---------- 21. DAI operation ---------- */
const daiStages = [
  'ARP packet وصل على منفذ untrusted.',
  'DAI بيقرأ sender IP وsender MAC من الـ ARP.',
  'بيراجع DHCP Snooping binding database.',
  'لو IP/MAC والمنفذ متطابقين مع binding، الـ ARP يعدي.',
  'لو مفيش تطابق أو مفيش binding، الـ ARP يتدّى.',
  'المنافذ Trusted غالباً ما تتعرضش لنفس الفحص حسب التصميم.',
]

export function L2DaiOperationDiagram() {
  const playback = useStepPlayback(daiStages.length)
  const s = playback.stage
  return (
    <StepShell title="DYNAMIC ARP INSPECTION OPERATION" playback={playback} legend={daiStages[s]}>
      <svg viewBox="0 0 920 400" className="h-auto w-full min-w-[880px]" role="img" aria-label="Dynamic ARP inspection operation validating ARP packets">
        <Box x={15} y={145} w={155} h={95} title="ARP packet" sub="sender IP + MAC" color="#38bdf8" active />
        <Box x={220} y={145} w={175} h={95} title="Untrusted port" sub="client facing" color="#a78bfa" active={s >= 1} />
        <Box x={445} y={145} w={190} h={95} title="DAI check" sub="validate vs bindings" color={s >= 4 ? '#fb7185' : '#f59e0b'} active={s >= 2} />
        <Box x={685} y={145} w={210} h={95} title={s >= 4 ? 'Drop ARP' : 'Allow ARP'} sub={s >= 4 ? 'invalid information' : 'binding matches'} color={s >= 4 ? '#fb7185' : '#34d399'} active={s >= 3} />
        <LinkLine x1={170} y1={192} x2={220} y2={192} color="#38bdf8" active />
        <LinkLine x1={395} y1={192} x2={445} y2={192} color="#a78bfa" active={s >= 2} />
        <LinkLine x1={635} y1={192} x2={685} y2={192} color={s >= 4 ? '#fb7185' : '#34d399'} active={s >= 3} />
        <FlowDot x1={170} y1={192} x2={685} y2={192} color="#f59e0b" active={s >= 5} />
        <Badge x={110} y={312} text="DHCP Snooping builds the bindings that DAI uses for validation" color="#22d3ee" active w={700} />
      </svg>
    </StepShell>
  )
}

/* ---------- 22. DAI validation scenarios ---------- */
const daiCases: BoardCase[] = [
  { id: 'valid', label: 'Valid ARP', detail: 'sender IP 192.168.10.11 والمـ MAC-A والمنفذ Gi0/1 مطابقين للـ binding، فالـ ARP مسموح.', stages: ['ARP from Gi0/1','Read sender IP/MAC','Find binding','IP + MAC match','Forward ARP'], focus: 3, verdict: 'RESULT: ALLOWED - binding matches', tone: 'good' },
  { id: 'forged', label: 'Forged ARP', detail: 'المهاجم بيقول إن IP بتاع الخادم والمـ MAC بتاعه. مفيش binding يطابق، فـ DAI يوقّع الـ ARP.', stages: ['ARP from Gi0/3','Claim server IP','Find binding','Mismatch detected','Drop ARP'], focus: 3, verdict: 'RESULT: DROPPED - invalid IP-to-MAC binding', tone: 'bad' },
  { id: 'static', label: 'Static IP host', detail: 'الجهاز الثابت ما عملش DHCP، فمفيش binding. DAI هيوقّع ARP لحد ما يتضاف ARP ACL أو حل مناسب.', stages: ['ARP from static host','No DHCP binding','DAI cannot validate','Drop or design exception','Use ARP ACL if needed'], focus: 2, verdict: 'RESULT: DROP - static host needs extra configuration', tone: 'bad' },
  { id: 'wrongvlan', label: 'Wrong VLAN', detail: 'DAI مفعّل لـ VLAN 20 بس والعميل على VLAN 10، فمفيش فحص أصلاً على الترافيك.', stages: ['ARP on VLAN 10','DAI enabled VLAN 20','No inspection','ARP passes unchecked','Fix VLAN scope'], focus: 2, verdict: 'RESULT: NOT INSPECTED - wrong VLAN', tone: 'info' },
]

export function L2DaiValidationDiagram() {
  const [selected, setSelected] = useState('forged')
  return <CaseBoard cases={daiCases} selected={selected} onSelect={setSelected} title="DAI VALIDATION USING DHCP BINDINGS" ariaLabel="DAI validation using DHCP snooping bindings interactive scenarios" />
}

/* ---------- 23. DAI trust ---------- */
const daiTrustItems: InfoItem[] = [
  { id: 'client', label: 'Untrusted client port', sub: 'default for access', detail: 'منافذ العملاء غالباً untrusted، فـ DAI بيفحص ARP القادم منها مقابل الـ bindings.', color: '#38bdf8' },
  { id: 'uplink', label: 'Trusted uplink', sub: 'only if appropriate', detail: 'لو الـ uplink متصل بـ distribution موثوق ممكن يتعرّف trusted لـ DAI. القرار بيتبع الطوبولوجيا والسياسة، مش قاعدة عامة.', color: '#34d399' },
  { id: 'static', label: 'Static device port', sub: 'needs a plan', detail: 'جهاز بـ IP ثابت محتاج ARP ACL أو استثناء مدروس، لأن مفيش DHCP binding بيوصّف هويته.', color: '#f59e0b' },
]

export function L2DaiTrustDiagram() {
  const [selected, setSelected] = useState('client')
  const item = daiTrustItems.find((entry) => entry.id === selected) ?? daiTrustItems[0]
  const controls = <ChoiceButtons items={daiTrustItems.map((entry) => ({ id: entry.id, label: entry.label }))} selected={selected} onSelect={setSelected} />
  return (
    <ChoiceShell title="DAI TRUSTED vs UNTRUSTED INTERFACES" controls={controls} legend={`**${item.label}** — ${item.detail}`}>
      <SelectorBoard items={daiTrustItems} selected={selected} onSelect={setSelected} focusTitle="DAI PORT TRUST" columns={2} />
    </ChoiceShell>
  )
}

/* ---------- 24. Architecture ---------- */
const architectureStages = [
  'ابدأ بتحديد access ports وinfrastructure ports.',
  'Port Security على منافذ العملاء: maximum وsticky وviolation mode.',
  'DHCP Snooping globalاً وعلى VLAN المطلوبة.',
  'Gi0/24 للسيرفر الشرعي يتعرّف trusted، والعملاء يفضلوا untrusted.',
  'DAI على نفس الـ VLAN عشان يستخدم الـ binding database.',
  'تحقق بالأوامر، واختبر سلوك الترافيك قبل وبعد التطبيق.',
]

export function L2ArchitectureDiagram() {
  const playback = useStepPlayback(architectureStages.length)
  const s = playback.stage
  return (
    <StepShell title="COMPLETE LAYER 2 SECURITY ARCHITECTURE" playback={playback} legend={architectureStages[s]}>
      <svg viewBox="0 0 920 400" className="h-auto w-full min-w-[880px]" role="img" aria-label="Complete Layer 2 security architecture across access and distribution">
        <Box x={15} y={145} w={160} h={95} title="Clients" sub="Gi0/1 - Gi0/3" color="#38bdf8" active />
        <Box x={225} y={145} w={190} h={95} title="Port Security" sub="MAC restriction" color="#a78bfa" active={s >= 1} />
        <Box x={465} y={145} w={190} h={95} title="DHCP Snooping" sub="trust + bindings" color={s >= 3 ? '#34d399' : '#f59e0b'} active={s >= 2} />
        <Box x={705} y={145} w={190} h={95} title="DAI" sub="validate ARP" color="#34d399" active={s >= 4} />
        <LinkLine x1={175} y1={192} x2={225} y2={192} color="#38bdf8" active />
        <LinkLine x1={415} y1={192} x2={465} y2={192} color="#a78bfa" active={s >= 2} />
        <LinkLine x1={655} y1={192} x2={705} y2={192} color="#34d399" active={s >= 4} />
        <FlowDot x1={175} y1={192} x2={705} y2={192} color="#f59e0b" active={s >= 5} />
        <Badge x={120} y={312} text="Verify with show commands and traffic tests before declaring success" color="#22d3ee" active={s >= 5} w={680} />
      </svg>
    </StepShell>
  )
}

/* ---------- 25. Troubleshooting ---------- */
const troubleItems: InfoItem[] = [
  { id: 'errdisable', label: 'Port err-disabled', sub: 'shutdown violation', detail: 'لما Port Security يكون بـ shutdown، المنفذ بيدخل error-disabled. افحص show interfaces status وshow port-security interface قبل أي استعادة.', color: '#fb7185' },
  { id: 'sticky', label: 'Sticky MAC lost', sub: 'config not saved', detail: 'الـ sticky MACs بتضيع بعد reload لو الـ running config ما اتحفظش في startup config.', color: '#f59e0b' },
  { id: 'dhcp-offer', label: 'DHCP Offer dropped', sub: 'trust wrong', detail: 'السيرفر الشرعي متصل بمنفذ untrusted، فـ DHCP Snooping بيوقّع الـ Offer. راجع ip dhcp snooping trust.', color: '#38bdf8' },
  { id: 'no-binding', label: 'Empty bindings', sub: 'VLAN not enabled', detail: 'DHCP Snooping مفعّل globalاً بس مش على الـ VLAN، فمفيش bindings وDAI هيوقّع ARP شرعي.', color: '#a78bfa' },
  { id: 'dai-arp', label: 'DAI drops ARP', sub: 'static IP or mismatch', detail: 'جهاز ثابت أو IP/MAC غلط. راجع الـ bindings، واستخدم ARP ACL لو التصميم يحتاج استثناء.', color: '#34d399' },
  { id: 'uplink', label: 'Wrong uplink trust', sub: 'topology assumption', detail: 'تعليم كل uplinks trusted من غير فحص يفتح ثغرة. راجع المسار الحقيقي للسيرفر الشرعي.', color: '#22d3ee' },
]

export function L2TroubleshootingDiagram() {
  const [selected, setSelected] = useState('errdisable')
  const item = troubleItems.find((entry) => entry.id === selected) ?? troubleItems[0]
  const controls = <ChoiceButtons items={troubleItems.map((entry) => ({ id: entry.id, label: entry.label }))} selected={selected} onSelect={setSelected} />
  return (
    <ChoiceShell title="LAYER 2 SECURITY TROUBLESHOOTING" controls={controls} legend={`**${item.label}** — ${item.detail}`}>
      <SelectorBoard items={troubleItems} selected={selected} onSelect={setSelected} focusTitle="TROUBLESHOOTING DECISIONS" />
    </ChoiceShell>
  )
}

/* ---------- 26. Lab 1 - Port Security with mode switching ---------- */
function PortSecurityLab() {
  const [mode, setMode] = useState('restrict')
  const [stage, setStage] = useState(0)
  const [picked, setPicked] = useState<string | null>(null)
  const navBase = 'flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[0.75rem] transition'
  const optionBase = 'rounded-lg border px-3 py-2 text-[0.8rem] transition'
  const steps = ['Configure access port','Enable sticky max 2','PC1 connects','PC2 connects','Unknown device']
  const modeDetail: Record<string, string> = {
    protect: 'Protect بيسقط الإطار ويخلي المنفذ شغال، من غير نفس سلوك العدّاد والتنبيه في Restrict.',
    restrict: 'Restrict بيسقط الإطار وبيزود العدّاد، وبيقدر يبعت تنبيه حسب المنصة.',
    shutdown: 'Shutdown بيحط المنفذ في error-disabled، وبيوقف كل الترافيك لحد المراجعة والاستعادة.',
  }
  const scenarios = [
    { prompt: 'خطوة 1: أي أمر يهيّئ Gi0/1 كـ access port قبل تفعيل Port Security؟', hint: 'ابدأ بـ switchport mode access.', options: [
      { id: 'access', label: 'switchport mode access', correct: true, detail: 'صح:_access port هو المكان المناسب لتفعيل Port Security.' },
      { id: 'trunk', label: 'switchport mode trunk', correct: false, detail: 'راجع: الـ trunk مش السيناريو هنا.' },
    ] },
    { prompt: 'خطوة 2: ركّب maximum secure MAC = 2 مع sticky learning. إيه الأمر؟', hint: 'في أمرين: maximum وmac-address sticky.', options: [
      { id: 'both', label: 'maximum 2 + mac-address sticky', correct: true, detail: 'صح: الاتنين مع بعض بيسمحوا بتعلم جهازين كـ sticky secure MACs.' },
      { id: 'one', label: 'maximum 1 only', correct: false, detail: 'راجع: الحد المطلوب 2 مش 1.' },
    ] },
    { prompt: 'خطوة 3: PC1 بعت إطار بـ MAC-A. إيه المتوقع؟', hint: 'MAC-A أول عنوان، والـ maximum 2.', options: [
      { id: 'learn', label: 'Allowed and learned as sticky', correct: true, detail: 'صح: أول secure MAC بيتعلم ويتسجل في الـ running config.' },
      { id: 'drop', label: 'Dropped immediately', correct: false, detail: 'راجع: لسه مفيش تجاوز للحد.' },
    ] },
    { prompt: 'خطوة 4: PC2 بعت إطار بـ MAC-B. إيه المتوقع؟', hint: 'العدد دلوقتي 2 من 2.', options: [
      { id: 'learn2', label: 'Allowed and learned as sticky', correct: true, detail: 'صح: MAC-B جوه الحد المسموح.' },
      { id: 'violate', label: 'Violation', correct: false, detail: 'راجع: الـ maximum 2، والعدد ما زادش.' },
    ] },
    { prompt: `خطوة 5: جهاز تالت بـ MAC-C. الوضع الحالي: ${mode}. إيه المتوقع؟`, hint: `راجع سلوك ${mode}.`, options: [
      { id: mode === 'protect' ? 'protect' : mode === 'restrict' ? 'restrict' : 'shutdown', label: mode === 'protect' ? 'Frame dropped, port stays up' : mode === 'restrict' ? 'Frame dropped + counter' : 'Port err-disabled', correct: true, detail: `صح: ${modeDetail[mode]}` },
      { id: 'forward', label: 'Frame forwarded normally', correct: false, detail: 'راجع: الجهاز التالت كسر قاعدة Port Security.' },
    ] },
  ]
  const scenario = scenarios[stage]
  const option = scenario.options.find((entry) => entry.id === picked)
  const modeColor = mode === 'shutdown' ? '#fb7185' : mode === 'restrict' ? '#f59e0b' : '#38bdf8'
  return (
    <div className="my-6 overflow-hidden rounded-2xl border border-sky-400/12 bg-navy-950/70">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-sky-400/10 px-4 py-3">
        <span className="font-display text-[0.78rem] font-bold text-slate-300" dir="ltr">LAB 1 - PORT SECURITY</span>
        <div className="flex flex-wrap items-center gap-2" dir="rtl">
          <ChoiceButtons items={[{id:'protect',label:'Protect'},{id:'restrict',label:'Restrict'},{id:'shutdown',label:'Shutdown'}]} selected={mode} onSelect={(id) => { setMode(id); setPicked(null) }} />
          <button type="button" onClick={() => { setStage((c) => (c - 1 + steps.length) % steps.length); setPicked(null) }} className={`${navBase} border-sky-400/15 text-slate-300`}><SkipBack size={13} /> السابق</button>
          <button type="button" onClick={() => { setStage((c) => (c + 1) % steps.length); setPicked(null) }} className={`${navBase} border-sky-400/15 text-slate-300`}><SkipForward size={13} /> التالي</button>
          <button type="button" onClick={() => { setStage(0); setPicked(null) }} className={`${navBase} border-sky-400/15 text-slate-300`}><RotateCcw size={13} /> إعادة</button>
        </div>
      </div>
      <div className="diagram-grid overflow-x-auto px-2 py-4" dir="ltr">
        <StageBoard stages={steps} stage={stage} ariaLabel="Port security configuration lab with violation mode selection" note={`MODE: ${mode.toUpperCase()} - ${modeDetail[mode].slice(0, 58)}`} />
      </div>
      <div className="flex flex-wrap gap-2 border-t border-sky-400/10 px-4 py-3" dir="rtl">
        {scenario.options.map((entry) => (
          <button key={entry.id} type="button" aria-pressed={picked === entry.id} onClick={() => setPicked(entry.id)} className={`${optionBase} ${picked === entry.id ? 'border-accent-400/50 bg-accent-500/15 font-bold text-accent-200' : 'border-sky-400/15 text-slate-300'}`} dir="ltr">{entry.label}</button>
        ))}
      </div>
      <motion.div key={`${stage}-${mode}-${picked ?? 'none'}`} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="border-t border-sky-400/10 bg-sky-400/[0.03] px-4 py-3 text-[0.85rem] leading-[1.9] text-slate-300" dir="rtl">
        <span className="ml-2 rounded px-1.5 py-0.5 font-display text-[0.7rem] font-bold" style={{ color: modeColor, background: '#0a1730' }} dir="ltr">{stage + 1}</span>
        <RichText>{scenario.prompt}</RichText>
        {option ? (
          <p className={`mt-2 font-bold ${option.correct ? 'text-emerald-300' : 'text-rose-300'}`}><RichText>{`${option.correct ? 'صح — ' : 'راجع — '}${option.detail}`}</RichText></p>
        ) : (
          <p className="mt-2 text-slate-400"><RichText>{`تلميح: ${scenario.hint}`}</RichText></p>
        )}
      </motion.div>
    </div>
  )
}

export function L2LabPortSecurityDiagram() {
  return <PortSecurityLab />
}

/* ---------- 27. Lab 2 - Rogue DHCP ---------- */
const labDhcpScenarios: LabScenario[] = [
  { prompt: 'خطوة 1: عشان تفعّل DHCP Snooping، إيه أول أمر؟', hint: 'ابدأ globalاً قبل الـ VLAN.', options: [
    { id: 'global', label: 'ip dhcp snooping', correct: true, detail: 'صح: التفعيل العالمي أول خطوة.' },
    { id: 'trust', label: 'ip dhcp snooping trust', correct: false, detail: 'راجع: الـ trust بييجي بعد التفعيل.' },
  ] },
  { prompt: 'خطوة 2: العملاء على VLAN 10. إيه الأمر؟', hint: 'لازم تحدد الـ VLAN.', options: [
    { id: 'vlan10', label: 'ip dhcp snooping vlan 10', correct: true, detail: 'صح: من غير تحديد VLAN 10 مفيش فحص ولا bindings.' },
    { id: 'vlan20', label: 'ip dhcp snooping vlan 20', correct: false, detail: 'راجع: السياسة هنا لـ VLAN 10.' },
  ] },
  { prompt: 'خطوة 3: السيرفر الشرعي على Gi0/24. إيه إعداد المنفذ؟', hint: 'السيرفر الشرعي محتاح trust.', options: [
    { id: 'trust', label: 'ip dhcp snooping trust', correct: true, detail: 'صح: Gi0/24 بيتعرّف trusted عشان يسمح بـ Offer وACK.' },
    { id: 'untrust', label: 'leave it untrusted', correct: false, detail: 'راجع: الـ Offer هيترفض من منفذ untrusted.' },
  ] },
  { prompt: 'خطوة 4: DHCP Offer جاي من Gi0/24. إيه القرار؟', hint: 'المنفذ trusted.', options: [
    { id: 'accept', label: 'Accept offer', correct: true, detail: 'صح: Offer من trusted مسموح، وبعد ACK يتسجل binding.' },
    { id: 'drop', label: 'Drop offer', correct: false, detail: 'راجع: المنفذ trusted مش untrusted.' },
  ] },
  { prompt: 'خطوة 5: DHCP Offer جاي من المهاجم على Gi0/3. إيه القرار؟', hint: 'Gi0/3 client-facing untrusted.', options: [
    { id: 'drop', label: 'Drop rogue offer', correct: true, detail: 'صح: DHCP Snooping بيوقّع أي Offer أو ACK من منفذ untrusted.' },
    { id: 'accept', label: 'Accept and create binding', correct: false, detail: 'راجع: ده بالظبط اللي بنمنعه.' },
  ] },
]
export function L2LabDhcpDiagram() {
  return <ScenarioLab title="LAB 2 - ROGUE DHCP PREVENTION" scenarios={labDhcpScenarios} ariaLabel="DHCP snooping rogue server prevention lab with offer decisions" />
}

/* ---------- 28. Lab 3 - DAI ---------- */
const labDaiScenarios: LabScenario[] = [
  { prompt: 'خطوة 1: قبل DAI، إيه لازم يكون شغال عشان نملك bindings؟', hint: 'DAI بيستخدم DHCP Snooping.', options: [
    { id: 'snooping', label: 'DHCP Snooping with bindings', correct: true, detail: 'صح: من غير binding database مفيش أساس للتحقق من ARP.' },
    { id: 'portsec', label: 'Port Security only', correct: false, detail: 'راجع: Port Security بيقيد MAC، مش بيبني IP-to-MAC bindings.' },
  ] },
  { prompt: 'خطوة 2: العملاء على VLAN 10. إيه أمر تفعيل DAI؟', hint: 'لازم الـ VLAN تكون هي نفسها.', options: [
    { id: '10', label: 'ip arp inspection vlan 10', correct: true, detail: 'صح: تفعيل DAI على VLAN 10.' },
    { id: '20', label: 'ip arp inspection vlan 20', correct: false, detail: 'راجع: VLAN غلط يعني مفيش فحص على VLAN 10.' },
  ] },
  { prompt: 'خطوة 3: ARP من PC1 (192.168.10.11 / MAC-A / Gi0/1) ومطابق للـ binding. إيه القرار؟', hint: 'قارن بالـ binding table.', options: [
    { id: 'accept', label: 'Accept ARP', correct: true, detail: 'صح: sender IP وMAC والمنفذ متطابقين مع الـ binding.' },
    { id: 'drop', label: 'Drop ARP', correct: false, detail: 'راجع: الـ ARP ده شرعي.' },
  ] },
  { prompt: 'خطوة 4: مهاجم على Gi0/3 بيبعت ARP بيقول إنه 192.168.10.1 بـ MAC غلط. إيه القرار؟', hint: 'مفيش binding يطابق.', options: [
    { id: 'drop', label: 'Drop forged ARP', correct: true, detail: 'صح: DAI يكتشف عدم تطابق IP/MAC ويوقّع الـ ARP.' },
    { id: 'accept', label: 'Accept and cache it', correct: false, detail: 'راجع: ده بالظبط اللي DAI بيمنعه.' },
  ] },
  { prompt: 'خطوة 5: جهاز بـ IP ثابت (مفيش DHCP binding) بيبعت ARP. إيه المتوقع؟', hint: 'مفيش binding يعني مفيش تحقق.', options: [
    { id: 'acl', label: 'Dropped until an ARP ACL or design exception is added', correct: true, detail: 'صح: الأجهزة الثابتة غالباً محتاجة ARP ACL أو استثناء مدروس.' },
    { id: 'auto', label: 'Automatically allowed', correct: false, detail: 'راجع: DAI ما يعرفش يتحقق من غير binding.' },
  ] },
]
export function L2LabDaiDiagram() {
  return <ScenarioLab title="LAB 3 - DETECT ARP SPOOFING WITH DAI" scenarios={labDaiScenarios} ariaLabel="Dynamic ARP inspection lab with valid and forged ARP packet decisions" />
}

/* ---------- 29. Verification commands ---------- */
const verifyItems: InfoItem[] = [
  { id: 'ps', label: 'show port-security', sub: 'global port-security summary', detail: 'ملخص عام لحالة Port Security والمنافذ اللي عليها سياسة.', color: '#38bdf8' },
  { id: 'psi', label: 'show port-security interface Gi0/1', sub: 'per-interface detail', detail: 'بيعرض الـ maximum والـ secure MAC addresses والـ violation counter وحالة المنفذ.', color: '#34d399' },
  { id: 'psa', label: 'show port-security address', sub: 'secure MAC table', detail: 'بيعرض الـ secure MAC addresses ونوعها static/dynamic/sticky والمنافذ المرتبطة بيها.', color: '#a78bfa' },
  { id: 'snoop', label: 'show ip dhcp snooping', sub: 'global + VLAN + trust', detail: 'بيأكد تفعيل Snooping والـ VLANs والمنافذ trusted. التوفر والإخراج بيختلفوا حسب المنصة.', color: '#f59e0b' },
  { id: 'binding', label: 'show ip dhcp snooping binding', sub: 'binding database', detail: 'بيعرض IP,MAC,VLAN,port,lease — وده اللي DAI بيستخدمه.', color: '#22d3ee' },
  { id: 'dai', label: 'show ip arp inspection', sub: 'DAI state + stats', detail: 'بيعرض حالة DAI والـ VLANs والإحصائيات. راجع show ip arp inspection interfaces وstatistics كمان حيث مدعوم.', color: '#fb7185' },
]

export function L2VerifyCommandsDiagram() {
  const [selected, setSelected] = useState('binding')
  const item = verifyItems.find((entry) => entry.id === selected) ?? verifyItems[0]
  const controls = <ChoiceButtons items={verifyItems.map((entry) => ({ id: entry.id, label: entry.label }))} selected={selected} onSelect={setSelected} />
  return (
    <ChoiceShell title="LAYER 2 SECURITY VERIFICATION COMMANDS" controls={controls} legend={`**${item.label}** — ${item.detail}`}>
      <SelectorBoard items={verifyItems} selected={selected} onSelect={setSelected} focusTitle="VERIFICATION COMMANDS" />
    </ChoiceShell>
  )
}

/* ---------- 30. Summary ---------- */
const summaryStages = [
  'Layer 2 threats: MAC flooding, DHCP starvation, rogue DHCP, ARP spoofing, unauthorized devices.',
  'Port Security بيقيد secure MACs على access port وبيطبّق violation modes.',
  'Sticky MAC بيتعلم ديناميكياً ويتكتب في الـ running config؛ لازم تحفظه.',
  'DHCP Snooping بيمنع rogue DHCP وبيبني binding database.',
  'Trusted للبنية الشرعية، وuntrusted لمنافذ العملاء؛ التصنيف بيتبع الطوبولوجيا.',
  'DAI بيستخدم الـ bindings عشان يتحقق من ARP على منافذ untrusted.',
  'الأجهزة الثابتة محتاجة ARP ACL أو استثناء مدروس.',
  'الميزات دي defense in depth، مش حماية كاملة ضد كل هجوم.',
  'التحقق بالأوامر وباختبار الترافيك قبل وبعد التطبيق.',
]

export function L2SummaryDiagram() {
  const playback = useStepPlayback(summaryStages.length)
  const s = playback.stage
  return (
    <StepShell title="LAYER 2 SECURITY CCNA REVISION MAP" playback={playback} legend={summaryStages[s]}>
      <StageBoard stages={['Threats','Port Security','Sticky','DHCP Snooping','Trust','DAI','Static hosts','Defense in depth','Verify']} stage={s} ariaLabel="Layer 2 security CCNA revision map with threats and mitigations" />
    </StepShell>
  )
}
