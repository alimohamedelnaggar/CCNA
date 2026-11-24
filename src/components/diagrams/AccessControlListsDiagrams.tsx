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

interface AceRow {
  seq: string
  text: string
  action: 'permit' | 'deny'
}

function RuleSequenceBoard({ rules, highlight, counts, ariaLabel, note }: {
  rules: AceRow[]
  highlight: number
  counts?: number[]
  ariaLabel: string
  note?: string
}) {
  return (
    <svg viewBox="0 0 920 400" className="h-auto w-full min-w-[880px]" role="img" aria-label={ariaLabel}>
      <Badge x={230} y={16} text={note ?? 'ACE LIST - EVALUATED TOP TO BOTTOM'} color="#a78bfa" active w={460} />
      {rules.map((rule, index) => {
        const y = 76 + index * 48
        const isHighlight = index === highlight
        const color = isHighlight ? (rule.action === 'permit' ? '#34d399' : '#fb7185') : '#475569'
        return (
          <motion.g key={rule.seq} animate={{ opacity: isHighlight ? 1 : 0.72 }} transition={{ duration: 0.25 }}>
            <rect x={40} y={y} width={840} height={40} rx="8" fill="#0b1224" stroke={color} strokeWidth={isHighlight ? 2.4 : 1.1} />
            <SvgText x={62} y={y + 25} color={isHighlight ? color : '#94a3b8'} size={8.8} bold anchor="start">{rule.seq}</SvgText>
            <SvgText x={128} y={y + 25} color={isHighlight ? '#e2e8f0' : '#cbd5e1'} size={8.2} anchor="start">{rule.text}</SvgText>
            {counts && <SvgText x={780} y={y + 25} color="#fbbf24" size={8} anchor="end">{`hits ${counts[index] ?? 0}`}</SvgText>}
            <SvgText x={858} y={y + 25} color={color} size={8.6} bold anchor="end">{rule.action.toUpperCase()}</SvgText>
          </motion.g>
        )
      })}
      <Badge x={150} y={350} text="FIRST MATCH WINS - implicit deny applies if no ACE matches" color="#f59e0b" active w={620} />
    </svg>
  )
}

interface PacketCase {
  id: string
  label: string
  detail: string
  match: number | null
  verdict: 'PERMIT' | 'DENY' | 'NOT FILTERED'
}

function RuleEvalBoard({ rules, packets, selected, onSelect, ariaLabel }: {
  rules: AceRow[]
  packets: PacketCase[]
  selected: string
  onSelect: (id: string) => void
  ariaLabel: string
}) {
  const packet = packets.find((entry) => entry.id === selected) ?? packets[0]
  const result = packet.verdict === 'NOT FILTERED'
    ? 'NOT FILTERED BY THIS ACL'
    : `${packet.verdict}${packet.match === null ? ' - IMPLICIT DENY' : ` - ACE ${rules[packet.match].seq}`}`
  const resultColor = packet.verdict === 'PERMIT' ? '#34d399' : packet.verdict === 'DENY' ? '#fb7185' : '#a78bfa'
  const controls = <ChoiceButtons items={packets.map((entry) => ({ id: entry.id, label: entry.label }))} selected={selected} onSelect={onSelect} />
  const legend = `**${packet.label}** — ${packet.detail}`

  return (
    <ChoiceShell title="ACE EVALUATOR" controls={controls} legend={legend}>
      <svg viewBox="0 0 920 400" className="h-auto w-full min-w-[880px]" role="img" aria-label={ariaLabel}>
        <Badge x={110} y={16} text={`PACKET: ${packet.label}`} color="#38bdf8" active w={700} />
        <SvgText x={460} y={54} color="#94a3b8" size={8}>{packet.detail}</SvgText>
        {rules.map((rule, index) => {
          const y = 78 + index * 42
          const isMatch = index === packet.match
          const skipped = packet.match !== null && index < packet.match
          const color = isMatch ? (rule.action === 'permit' ? '#34d399' : '#fb7185') : skipped ? '#334155' : '#475569'
          return (
            <motion.g key={rule.seq} animate={{ opacity: isMatch ? 1 : skipped ? 0.45 : 0.78 }} transition={{ duration: 0.25 }}>
              <rect x={40} y={y} width={840} height={36} rx="8" fill="#0b1224" stroke={color} strokeWidth={isMatch ? 2.4 : 1.1} />
              <SvgText x={62} y={y + 23} color={isMatch ? color : '#94a3b8'} size={8.6} bold anchor="start">{rule.seq}</SvgText>
              <SvgText x={126} y={y + 23} color={isMatch ? '#e2e8f0' : '#cbd5e1'} size={8} anchor="start">{rule.text}</SvgText>
              <SvgText x={858} y={y + 23} color={color} size={8.4} bold anchor="end">{rule.action.toUpperCase()}</SvgText>
              {isMatch && <Badge x={690} y={y + 5} text="MATCH" color={color} active w={96} />}
            </motion.g>
          )
        })}
        <Badge x={110} y={352} text={result} color={resultColor} active w={700} />
      </svg>
    </ChoiceShell>
  )
}

interface BitExample {
  id: string
  label: string
  acl: number
  wildcard: number
  packet: number
  result: string
  note: string
}

function toBits(value: number): string[] {
  return Array.from({ length: 8 }, (_, index) => ((value >> (7 - index)) & 1).toString())
}

function BitBoard({ example, ariaLabel }: { example: BitExample; ariaLabel: string }) {
  const aclBits = toBits(example.acl)
  const wildcardBits = toBits(example.wildcard)
  const packetBits = toBits(example.packet)
  const rows = [
    { label: 'ACL', bits: aclBits, color: '#38bdf8' },
    { label: 'WILD', bits: wildcardBits, color: '#a78bfa' },
    { label: 'PKT', bits: packetBits, color: '#34d399' },
  ]
  return (
    <svg viewBox="0 0 920 400" className="h-auto w-full min-w-[880px]" role="img" aria-label={ariaLabel}>
      <Badge x={230} y={16} text="LAST OCTET BIT COMPARISON" color="#a78bfa" active w={460} />
      <SvgText x={460} y={58} color="#94a3b8" size={8}>bit position: 7 6 5 4 3 2 1 0</SvgText>
      {rows.map((row, rowIndex) => (
        <g key={row.label}>
          <SvgText x={80} y={108 + rowIndex * 62} color={row.color} size={9} bold anchor="start">{row.label}</SvgText>
          {row.bits.map((bit, index) => {
            const x = 130 + index * 92
            const y = 82 + rowIndex * 62
            const ignored = rowIndex === 1 && bit === '1'
            const mustMatch = rowIndex === 1 && bit === '0'
            const stroke = ignored ? '#f59e0b' : mustMatch ? '#34d399' : row.color
            return (
              <g key={`${row.label}-${index}`}>
                <rect x={x} y={y} width={76} height={42} rx="8" fill="#0b1224" stroke={stroke} strokeWidth={mustMatch || ignored ? 2 : 1} />
                <SvgText x={x + 38} y={y + 28} color={stroke} size={13} bold>{bit}</SvgText>
              </g>
            )
          })}
        </g>
      ))}
      <Badge x={80} y={290} text="WILD bit 0 = this bit MUST match    |    WILD bit 1 = this bit is IGNORED" color="#22d3ee" active w={760} />
      <Badge x={80} y={330} text={`RESULT: ${example.result}`} color={example.result.includes('MATCH') && !example.result.includes('NO') ? '#34d399' : '#fb7185'} active w={760} />
    </svg>
  )
}

function BitSelector({ examples, selected, onSelect, title, ariaLabel }: {
  examples: BitExample[]
  selected: string
  onSelect: (id: string) => void
  title: string
  ariaLabel: string
}) {
  const example = examples.find((entry) => entry.id === selected) ?? examples[0]
  const controls = <ChoiceButtons items={examples.map((entry) => ({ id: entry.id, label: entry.label }))} selected={selected} onSelect={onSelect} />
  return (
    <ChoiceShell title={title} controls={controls} legend={`**${example.label}** — ${example.note}`}>
      <BitBoard example={example} ariaLabel={ariaLabel} />
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
        <StageBoard stages={scenarios.map((_, index) => `Packet ${index + 1}`)} stage={stage} ariaLabel={ariaLabel} />
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
  'ACL يعني Access Control List: قائمة قواعد على جهاز Layer 3 بتفحص الحزم وتقرر permit أو deny.',
  'كل قاعدة بتتسمى ACE، والفحص بيبدأ من أول سطر وينزل لآخر سطر.',
  'أول ACE بيطابق الحزمة بيحدد القرار، وبعدين الـ processing بيوقف.',
  'لو مفيش ACE طابق الحزمة، الـ implicit deny بيرفضها في الآخر.',
  'الـ ACL بيستخدم في الأمان عشان يسمح أو يمنع ترافيك بين الشبكات وبين الموارد.',
  'الـ ACL stateless packet filter؛ مش stateful firewall، ومش بيتبع حالة الاتصال.',
  'ما يكفيش تعمل ACL بس؛ لازم تطبّقها على interface أو feature مناسب.',
]

export function AclOverviewDiagram() {
  const playback = useStepPlayback(overviewStages.length)
  const s = playback.stage
  return (
    <StepShell title="ACL NETWORK SECURITY OVERVIEW" playback={playback} legend={overviewStages[s]}>
      <svg viewBox="0 0 920 400" className="h-auto w-full min-w-[880px]" role="img" aria-label="ACL network security overview from packet filtering to traffic policy">
        <Box x={25} y={150} w={170} h={90} title="Source LAN" sub="packets arrive" color="#38bdf8" active />
        <Box x={255} y={150} w={190} h={90} title="Router ACL" sub="ACE list + first match" color="#a78bfa" active={s >= 1} />
        <Box x={505} y={150} w={170} h={90} title={s >= 5 ? 'Stateless filter' : "Routing decision"} sub={s >= 5 ? 'not a stateful firewall' : 'next hop lookup'} color={s >= 5 ? '#f59e0b' : '#34d399'} active={s >= 3} />
        <Box x={735} y={150} w={160} h={90} title="Destination" sub="permit or drop" color="#34d399" active={s >= 4} />
        <LinkLine x1={195} y1={195} x2={255} y2={195} color="#38bdf8" active />
        <LinkLine x1={445} y1={195} x2={505} y2={195} color="#a78bfa" active={s >= 2} />
        <LinkLine x1={675} y1={195} x2={735} y2={195} color="#34d399" active={s >= 4} />
        <FlowDot x1={195} y1={195} x2={735} y2={195} color="#f59e0b" active={s >= 2} />
        <Badge x={145} y={312} text="An ACL must be applied to an interface or relevant feature to take effect" color="#fb7185" active={s >= 6} w={630} />
      </svg>
    </StepShell>
  )
}

const packetEntryStages = [
  'حزمة بتوصل ل interfaces الراوتر.',
  'الراوتر بيسأل: هل فيه ACL مطبّق على الـ interface ده في الاتجاه ده؟',
  'لو مفيش ACL، الحزمة تكمل المعالجة الطبيعية.',
  'لو فيه ACL، الحزمة بتدخل فحص الـ ACEs من الأعلى.',
  'القرار بيكون permit أو deny حسب أول ACE مطابق.',
  'الحزمة المرفوضة ما بتكملش؛ والمسموح بيكمل خطوة التوجيه.',
]

export function AclPacketEntryDiagram() {
  const playback = useStepPlayback(packetEntryStages.length)
  const s = playback.stage
  return (
    <StepShell title="PACKET ARRIVING AT AN INTERFACE" playback={playback} legend={packetEntryStages[s]}>
      <svg viewBox="0 0 920 400" className="h-auto w-full min-w-[880px]" role="img" aria-label="Packet arriving at a router interface with ACL direction check">
        <Box x={25} y={145} w={175} h={95} title="Packet" sub="src + dst + protocol" color="#38bdf8" active />
        <Box x={255} y={145} w={180} h={95} title="Gi0/0" sub="inbound ACL check" color="#a78bfa" active={s >= 1} />
        <Box x={490} y={145} w={180} h={95} title={s >= 4 ? 'ACL decision' : 'ACE list'} sub={s >= 4 ? 'permit or deny' : 'top-down evaluation'} color={s >= 4 ? '#f59e0b' : '#34d399'} active={s >= 3} />
        <Box x={725} y={145} w={170} h={95} title="Forwarding" sub="routing lookup" color="#34d399" active={s >= 5} />
        <LinkLine x1={200} y1={192} x2={255} y2={192} color="#38bdf8" active />
        <LinkLine x1={435} y1={192} x2={490} y2={192} color="#a78bfa" active={s >= 2} />
        <LinkLine x1={670} y1={192} x2={725} y2={192} color="#34d399" active={s >= 5} />
        <FlowDot x1={200} y1={192} x2={725} y2={192} color="#f59e0b" active={s >= 5} />
        <Badge x={150} y={312} text="ACL is checked only if it is applied in the relevant direction on that interface" color="#22d3ee" active={s >= 1} w={620} />
      </svg>
    </StepShell>
  )
}

const processingStages = [
  'الحزمة وصلت ل_point الفحص.',
  'الراوتر بيقرأ أول ACE.',
  'لو الحزمة طابقت الـ ACE، القرار يتحدد فوراً.',
  'لو ما طابقتش، الراوتر يروح للسطر اللي بعده.',
  'بيفضل ينزل لحد ما يلاقي أول match.',
  'لو خلصت كل الـ ACEs من غير match، الـ implicit deny بيرفض.',
]

export function AclProcessingFlowDiagram() {
  const playback = useStepPlayback(processingStages.length)
  const s = playback.stage
  return (
    <StepShell title="ACL TOP-DOWN PROCESSING FLOW" playback={playback} legend={processingStages[s]}>
      <StageBoard stages={['Packet arrives','Read ACE 1','Match?','Read next ACE','First match','Implicit deny']} stage={s} ariaLabel="ACL top-down processing flow from packet arrival to action" />
    </StepShell>
  )
}

const firstMatchPackets: PacketCase[] = [
  { id: 'https', label: 'TCP 443 to server', detail: 'src 192.168.10.20 -> host 192.168.20.10, TCP port 443', match: 0, verdict: 'PERMIT' },
  { id: 'http', label: 'TCP 80 to server', detail: 'src 192.168.10.20 -> host 192.168.20.10, TCP port 80', match: 1, verdict: 'DENY' },
  { id: 'icmp', label: 'ICMP to LAN3', detail: 'src 192.168.10.20 -> 192.168.30.10, ICMP', match: 2, verdict: 'PERMIT' },
]
const firstMatchRules: AceRow[] = [
  { seq: '10', text: 'permit tcp 192.168.10.0 0.0.0.255 host 192.168.20.10 eq 443', action: 'permit' },
  { seq: '20', text: 'deny ip 192.168.10.0 0.0.0.255 host 192.168.20.10', action: 'deny' },
  { seq: '30', text: 'permit ip 192.168.10.0 0.0.0.255 192.168.30.0 0.0.0.255', action: 'permit' },
  { seq: '40', text: 'deny ip any any', action: 'deny' },
]

export function AclFirstMatchDiagram() {
  const [selected, setSelected] = useState('https')
  return <RuleEvalBoard rules={firstMatchRules} packets={firstMatchPackets} selected={selected} onSelect={setSelected} ariaLabel="Interactive ACL first-match evaluator with selectable packets" />
}

const orderRules: Record<string, AceRow[]> = {
  bad: [
    { seq: '10', text: 'deny ip 192.168.10.0 0.0.0.255 any', action: 'deny' },
    { seq: '20', text: 'permit tcp 192.168.10.0 0.0.0.255 host 192.168.20.10 eq 443', action: 'permit' },
    { seq: '30', text: 'permit ip any any', action: 'permit' },
  ],
  good: [
    { seq: '10', text: 'permit tcp 192.168.10.0 0.0.0.255 host 192.168.20.10 eq 443', action: 'permit' },
    { seq: '20', text: 'deny ip 192.168.10.0 0.0.0.255 any', action: 'deny' },
    { seq: '30', text: 'permit ip any any', action: 'permit' },
  ],
}

export function AclOrderMistakeDiagram() {
  const [order, setOrder] = useState('bad')
  const rules = orderRules[order]
  const packets: PacketCase[] = [{
    id: 'https',
    label: 'HTTPS from LAN1',
    detail: 'TCP 443 from 192.168.10.20 to 192.168.20.10',
    match: 0,
    verdict: order === 'bad' ? 'DENY' : 'PERMIT',
  }]
  const controls = <ChoiceButtons items={[{ id: 'bad', label: 'Deny first' }, { id: 'good', label: 'Permit first' }]} selected={order} onSelect={setOrder} />
  const legend = order === 'bad'
    ? '**ترتيب غلط:** الـ deny العام في السطر 10 بيطابق HTTPS أولاً، فالـ permit المحدد في السطر 20 ما يتفحصش. النتيجة إن ترافيك مسموح اترفض.'
    : '**ترتيب صح:** الـ permit المحدد جاي أولاً، فـ HTTPS يوصل للسطر 10 ويسمح. الـ deny العام بعدين بيطبّق على الباقي بس.'
  return (
    <ChoiceShell title="ACL RULE ORDER MATTERS" controls={controls} legend={legend}>
      <svg viewBox="0 0 920 400" className="h-auto w-full min-w-[880px]" role="img" aria-label="ACL rule order comparison showing broad deny before specific permit">
        <Badge x={110} y={16} text="PACKET: TCP 443 from 192.168.10.20 to host 192.168.20.10" color="#38bdf8" active w={700} />
        {rules.map((rule, index) => {
          const y = 88 + index * 62
          const isMatch = index === 0
          const color = isMatch ? (rule.action === 'permit' ? '#34d399' : '#fb7185') : '#475569'
          return (
            <motion.g key={rule.seq} animate={{ opacity: isMatch ? 1 : 0.62 }} transition={{ duration: 0.25 }}>
              <rect x={40} y={y} width={840} height={48} rx="8" fill="#0b1224" stroke={color} strokeWidth={isMatch ? 2.6 : 1.1} />
              <SvgText x={62} y={y + 30} color={isMatch ? color : '#94a3b8'} size={9} bold anchor="start">{rule.seq}</SvgText>
              <SvgText x={126} y={y + 30} color="#e2e8f0" size={8.4} anchor="start">{rule.text}</SvgText>
              <SvgText x={858} y={y + 30} color={color} size={9} bold anchor="end">{rule.action.toUpperCase()}</SvgText>
              {isMatch && <Badge x={690} y={y + 13} text="FIRST MATCH" color={color} w={130} />}
            </motion.g>
          )
        })}
        <Badge x={110} y={352} text={packets[0].verdict === 'PERMIT' ? 'RESULT: PERMIT - specific permit was evaluated first' : 'RESULT: DENY - broad deny stopped further evaluation'} color={packets[0].verdict === 'PERMIT' ? '#34d399' : '#fb7185'} active w={700} />
      </svg>
    </ChoiceShell>
  )
}

const implicitRules: AceRow[] = [
  { seq: '10', text: 'permit 192.168.10.0 0.0.0.255', action: 'permit' },
  { seq: 'implicit', text: 'deny any (not configured - always last)', action: 'deny' },
]
const implicitPackets: PacketCase[] = [
  { id: 'lan1', label: 'From LAN1', detail: 'source 192.168.10.20 matches the configured permit', match: 0, verdict: 'PERMIT' },
  { id: 'lan2', label: 'From LAN2', detail: 'source 192.168.20.10 matches no configured ACE', match: 1, verdict: 'DENY' },
]

export function AclImplicitDenyDiagram() {
  const [selected, setSelected] = useState('lan1')
  return <RuleEvalBoard rules={implicitRules} packets={implicitPackets} selected={selected} onSelect={setSelected} ariaLabel="ACL implicit deny visualization when no ACE matches" />
}

const standardRules: AceRow[] = [
  { seq: '10', text: 'permit 192.168.10.0 0.0.0.255', action: 'permit' },
  { seq: '20', text: 'deny any', action: 'deny' },
]
const standardPackets: PacketCase[] = [
  { id: 's1', label: 'LAN1 to server', detail: 'source 192.168.10.20, destination 192.168.20.10, TCP 443', match: 0, verdict: 'PERMIT' },
  { id: 's2', label: 'LAN1 to LAN3', detail: 'source 192.168.10.20, destination 192.168.30.10, ICMP', match: 0, verdict: 'PERMIT' },
  { id: 's3', label: 'LAN2 to server', detail: 'source 192.168.20.10, destination 192.168.20.10, TCP 443', match: 1, verdict: 'DENY' },
]

export function AclStandardMatchDiagram() {
  const [selected, setSelected] = useState('s1')
  return <RuleEvalBoard rules={standardRules} packets={standardPackets} selected={selected} onSelect={setSelected} ariaLabel="Standard ACL matching process using source IPv4 address only" />
}

const extendedRules: AceRow[] = [
  { seq: '10', text: 'permit tcp 192.168.10.0 0.0.0.255 host 192.168.20.10 eq 443', action: 'permit' },
  { seq: '20', text: 'permit ip 192.168.10.0 0.0.0.255 192.168.30.0 0.0.0.255', action: 'permit' },
  { seq: '30', text: 'deny ip any any', action: 'deny' },
]
const extendedPackets: PacketCase[] = [
  { id: 'e1', label: 'HTTPS to server', detail: 'src 192.168.10.20, dst 192.168.20.10, TCP 443', match: 0, verdict: 'PERMIT' },
  { id: 'e2', label: 'HTTP to server', detail: 'src 192.168.10.20, dst 192.168.20.10, TCP 80', match: 2, verdict: 'DENY' },
  { id: 'e3', label: 'ICMP to LAN3', detail: 'src 192.168.10.20, dst 192.168.30.10, ICMP', match: 1, verdict: 'PERMIT' },
  { id: 'e4', label: 'HTTPS from LAN3', detail: 'src 192.168.30.20, dst 192.168.20.10, TCP 443', match: 2, verdict: 'DENY' },
]

export function AclExtendedMatchDiagram() {
  const [selected, setSelected] = useState('e1')
  return <RuleEvalBoard rules={extendedRules} packets={extendedPackets} selected={selected} onSelect={setSelected} ariaLabel="Extended ACL matching process using source destination protocol and port" />
}

const typeItems: InfoItem[] = [
  { id: 'standard', label: 'Standard ACL', sub: 'source IPv4 only', detail: 'Standard IPv4 ACL بيطابق source address غالباً. ما بيفرقش بين destination أو protocol أو port، فـ granularity محدودة.', color: '#38bdf8' },
  { id: 'extended', label: 'Extended ACL', sub: 'source + destination + protocol', detail: 'Extended ACL بيطابق source وdestination وIP protocol وTCP/UDP ports وICMP حسب السياسة، فبيسمح بفحص أدق.', color: '#34d399' },
  { id: 'placement', label: 'Placement tendency', sub: 'guideline not a law', detail: 'Standard غالباً قرب الـ destination، وExtended غالباً قرب الـ source. ده guideline عام؛ التطبيق الفعلي بيتبع السياسة والطوبولوجيا.', color: '#a78bfa' },
  { id: 'numbers', label: 'Number / name', sub: 'both styles exist', detail: 'النوعين ممكن يكونوا numbered أو named على IOS الحديث. الرقم نفسه بيدل على النوع في النطاقات التقليدية.', color: '#f59e0b' },
]

export function AclTypeCompareDiagram() {
  const [selected, setSelected] = useState('standard')
  const item = typeItems.find((entry) => entry.id === selected) ?? typeItems[0]
  const controls = <ChoiceButtons items={typeItems.map((entry) => ({ id: entry.id, label: entry.label }))} selected={selected} onSelect={setSelected} />
  return (
    <ChoiceShell title="STANDARD vs EXTENDED ACL" controls={controls} legend={`**${item.label}** — ${item.detail}`}>
      <SelectorBoard items={typeItems} selected={selected} onSelect={setSelected} focusTitle="STANDARD vs EXTENDED ACL" />
    </ChoiceShell>
  )
}

const numberItems: InfoItem[] = [
  { id: 'std-low', label: '1 - 99', sub: 'standard IPv4 range', detail: 'مثال: access-list 10 permit 192.168.10.0 0.0.0.255. الرقم 10 يعرف الـ ACL إنها Standard IPv4.', color: '#38bdf8' },
  { id: 'ext-low', label: '100 - 199', sub: 'extended IPv4 range', detail: 'مثال: access-list 101 permit tcp ... eq 443. الرقم 101 يعرف الـ ACL إنها Extended IPv4.', color: '#34d399' },
  { id: 'std-high', label: '1300 - 1999', sub: 'standard expanded range', detail: 'نطاق تقليدي إضافي لـ Standard IPv4 ACLs على IOS. التوفر بيختلف حسب المنصة والإصدار.', color: '#a78bfa' },
  { id: 'ext-high', label: '2000 - 2699', sub: 'extended expanded range', detail: 'نطاق تقليدي إضافي لـ Extended IPv4 ACLs على IOS. راجع دائماً دعم المنصة قبل الاختيار.', color: '#f59e0b' },
]

export function AclNumberedIdDiagram() {
  const [selected, setSelected] = useState('ext-low')
  const item = numberItems.find((entry) => entry.id === selected) ?? numberItems[0]
  const controls = <ChoiceButtons items={numberItems.map((entry) => ({ id: entry.id, label: entry.label }))} selected={selected} onSelect={setSelected} />
  return (
    <ChoiceShell title="NUMBERED ACL IDENTIFICATION" controls={controls} legend={`**${item.label}** — ${item.detail}`}>
      <SelectorBoard items={numberItems} selected={selected} onSelect={setSelected} focusTitle="NUMBERED ACL RANGES" columns={2} />
    </ChoiceShell>
  )
}

const namedRules: AceRow[] = [
  { seq: '10', text: 'permit 192.168.10.0 0.0.0.255', action: 'permit' },
  { seq: '20', text: 'deny any', action: 'deny' },
]

export function AclNamedSequenceDiagram() {
  const [selected, setSelected] = useState('10')
  const highlight = Math.max(0, namedRules.findIndex((rule) => rule.seq === selected))
  const detail = selected === '10'
    ? 'السطر 10 يسمح بشبكة المكتب 192.168.10.0/24 بالـ wildcard 0.0.0.255.'
    : 'السطر 20 يرفض الباقي صراحة، وبيوضّح نية السياسة حتى مع وجود implicit deny.'
  const controls = <ChoiceButtons items={namedRules.map((rule) => ({ id: rule.seq, label: `ACE ${rule.seq}` }))} selected={selected} onSelect={setSelected} />
  return (
    <ChoiceShell title="NAMED ACL WITH SEQUENCE NUMBERS" controls={controls} legend={detail}>
      <RuleSequenceBoard rules={namedRules} highlight={highlight} ariaLabel="Named ACL with sequence numbers interactive rule list" note="ip access-list standard OFFICE-FILTER" />
    </ChoiceShell>
  )
}

const editSteps: Record<string, { rules: AceRow[]; highlight: number; detail: string }> = {
  insert: {
    rules: [
      { seq: '10', text: 'permit 192.168.10.0 0.0.0.255', action: 'permit' },
      { seq: '15', text: 'permit 192.168.11.0 0.0.0.255', action: 'permit' },
      { seq: '20', text: 'deny any', action: 'deny' },
    ],
    highlight: 1,
    detail: 'إدراج ACE رقم 15 بيخلي السطر الجديد يتفحص قبل deny any، فبيسمح للشبكة الإضافية من غير حذف السطر 20.',
  },
  remove: {
    rules: [
      { seq: '10', text: 'permit 192.168.10.0 0.0.0.255', action: 'permit' },
      { seq: '20', text: 'deny any', action: 'deny' },
    ],
    highlight: 1,
    detail: 'حذف سطر قديم بيغيّر ترتيب الفحص؛ لازم تراجع القائمة النهائية بعد كل تعديل.',
  },
  verify: {
    rules: [
      { seq: '10', text: 'permit 192.168.10.0 0.0.0.255', action: 'permit' },
      { seq: '15', text: 'permit 192.168.11.0 0.0.0.255', action: 'permit' },
      { seq: '20', text: 'deny any', action: 'deny' },
    ],
    highlight: 2,
    detail: 'بعد التعديل استخدم show access-lists أو show ip access-lists عشان تتأكد من الترتيب النهائي ومن hit counters.',
  },
}

export function AclEditingSequenceDiagram() {
  const [selected, setSelected] = useState('insert')
  const step = editSteps[selected]
  const controls = <ChoiceButtons items={[{ id: 'insert', label: 'Insert 15' }, { id: 'remove', label: 'Remove ACE' }, { id: 'verify', label: 'Verify order' }]} selected={selected} onSelect={setSelected} />
  return (
    <ChoiceShell title="EDITING A NAMED ACL" controls={controls} legend={step.detail}>
      <RuleSequenceBoard rules={step.rules} highlight={step.highlight} ariaLabel="Editing a named ACL by inserting and removing sequence numbers" note="SEQUENCE NUMBERS CONTROL ORDER" />
    </ChoiceShell>
  )
}

const maskItems: InfoItem[] = [
  { id: 'subnet', label: 'Subnet mask', sub: 'network / host bits', detail: 'Subnet mask بيقول إيه الجزء network وإيه الجزء host في عنوان IP. بيستخدم في تعريف الشبكة نفسها.', color: '#38bdf8' },
  { id: 'wildcard', label: 'Wildcard mask', sub: 'match / ignore bits', detail: 'Wildcard mask بيقول للـ ACL إيه البتات اللي لازم تطابق وإيه البتات اللي يتجاهلها وقت المقارنة.', color: '#34d399' },
  { id: 'zero', label: 'Wildcard bit 0', sub: 'must match', detail: 'البت المقابل في الـ wildcard بصفر معناة بت العنوان لازم يتطابق بالظبط مع عنوان الـ ACL.', color: '#a78bfa' },
  { id: 'one', label: 'Wildcard bit 1', sub: 'ignore', detail: 'البت المقابل بواحد معناة تجاهل البت ده، فأي قيمة فيه مقبولة.', color: '#f59e0b' },
]

export function AclMaskVsWildcardDiagram() {
  const [selected, setSelected] = useState('wildcard')
  const item = maskItems.find((entry) => entry.id === selected) ?? maskItems[0]
  const controls = <ChoiceButtons items={maskItems.map((entry) => ({ id: entry.id, label: entry.label }))} selected={selected} onSelect={setSelected} />
  return (
    <ChoiceShell title="SUBNET MASK vs WILDCARD MASK" controls={controls} legend={`**${item.label}** — ${item.detail}`}>
      <SelectorBoard items={maskItems} selected={selected} onSelect={setSelected} focusTitle="SUBNET MASK vs WILDCARD MASK" columns={2} />
    </ChoiceShell>
  )
}

const bitExamples: BitExample[] = [
  { id: 'b24', label: '/24 match', acl: 0, wildcard: 255, packet: 20, result: 'MATCH - all 8 bits ignored', note: 'في /24 الـ wildcard 0.0.0.255؛ كل بتات الأوكتت الأخير متجاهلة، فـ 192.168.10.20 تطابق 192.168.10.0.' },
  { id: 'b25ok', label: '/25 match', acl: 0, wildcard: 127, packet: 100, result: 'MATCH - first bit is 0', note: 'wildcard 0.0.0.127 يعني أول بت لازم يساوي 0 والباقي متجاهل؛ 100 في binary يبدأ بـ 0.' },
  { id: 'b25bad', label: '/25 mismatch', acl: 0, wildcard: 127, packet: 140, result: 'NO MATCH - first bit is 1', note: '140 في binary يبدأ بـ 1، فبيخالف أول بت في 192.168.10.0/25.' },
  { id: 'b26bad', label: '/26 mismatch', acl: 0, wildcard: 63, packet: 100, result: 'NO MATCH - first two bits differ', note: 'في /26 أول بتين لازم يساوا 00؛ 100 يبدأ بـ 01 فما بيطابقش.' },
]

export function AclWildcardBitsDiagram() {
  const [selected, setSelected] = useState('b25ok')
  return <BitSelector examples={bitExamples} selected={selected} onSelect={setSelected} title="WILDCARD BIT COMPARISON" ariaLabel="Wildcard mask bit-by-bit comparison of ACL address wildcard and packet" />
}

const wildcard24Stages = [
  'الشبكة 192.168.10.0/24 ليها subnet mask 255.255.255.0.',
  'في ACL بنكتب الـ network مع wildcard مش الـ subnet mask.',
  'الـ /24 بيخلي أول 24 بت ثابتة وآخر 8 بت متجاهلة.',
  'الـ wildcard الناتج 0.0.0.255.',
  `الأمر: access-list 10 permit 192.168.10.0 0.0.0.255`,
  'أي source داخل 192.168.10.x بيطابق، و192.168.11.x ما بيطابقش.',
]

export function AclWildcard24Diagram() {
  const playback = useStepPlayback(wildcard24Stages.length)
  const s = playback.stage
  return (
    <StepShell title="SLASH 24 WILDCARD CALCULATION" playback={playback} legend={wildcard24Stages[s]}>
      <BitBoard example={bitExamples[0]} ariaLabel="Slash 24 wildcard mask calculation 0.0.0.255" />
    </StepShell>
  )
}

const wildcard2526Examples: BitExample[] = [
  { id: 'w25', label: '/25 -> 0.0.0.127', acl: 0, wildcard: 127, packet: 100, result: 'MATCH - range .0 to .127', note: '192.168.10.0/25 يغطي 192.168.10.0 حتى 192.168.10.127، والـ wildcard 0.0.0.127.' },
  { id: 'w26', label: '/26 -> 0.0.0.63', acl: 0, wildcard: 63, packet: 100, result: 'NO MATCH - .100 outside .0 to .63', note: '192.168.10.0/26 يغطي .0 حتى .63، والـ wildcard 0.0.0.63؛ العنوان .100 خارج النطاق.' },
  { id: 'w26ok', label: '/26 within range', acl: 0, wildcard: 63, packet: 40, result: 'MATCH - .40 inside .0 to .63', note: 'نفس الـ wildcard 0.0.0.63، والعنوان .40 جوه النطاق فبيطابق.' },
]

export function AclWildcard2526Diagram() {
  const [selected, setSelected] = useState('w25')
  return <BitSelector examples={wildcard2526Examples} selected={selected} onSelect={setSelected} title="SLASH 25 and SLASH 26 WILDCARDS" ariaLabel="Slash 25 and slash 26 wildcard mask comparison interactive" />
}

const hostAnyItems: InfoItem[] = [
  { id: 'host', label: 'host 192.168.10.5', sub: 'single IPv4 host', detail: 'اختصار لـ wildcard 0.0.0.0؛ يعني كل البتات لازم تطابق بالظبط، فـ حزمة واحدة بس.', color: '#38bdf8' },
  { id: 'any', label: 'any', sub: 'all addresses', detail: 'اختصار لـ 0.0.0.0 255.255.255.255؛ كل البتات متجاهلة، فبيطابق أي عنوان.', color: '#34d399' },
  { id: 'slash24', label: '0.0.0.255', sub: 'common /24 wildcard', detail: 'أول 24 بت لازم يتطابقوا وآخر 8 بت يتجاهلوا. ده الشكل المعتاد لـ /24 في أمثلة CCNA.', color: '#a78bfa' },
]

export function AclHostAnyDiagram() {
  const [selected, setSelected] = useState('slash24')
  const item = hostAnyItems.find((entry) => entry.id === selected) ?? hostAnyItems[0]
  const controls = <ChoiceButtons items={hostAnyItems.map((entry) => ({ id: entry.id, label: entry.label }))} selected={selected} onSelect={setSelected} />
  return (
    <ChoiceShell title="HOST vs ANY vs 0.0.0.255" controls={controls} legend={`**${item.label}** — ${item.detail}`}>
      <SelectorBoard items={hostAnyItems} selected={selected} onSelect={setSelected} focusTitle="HOST ANY WILDCARD KEYWORDS" columns={2} />
    </ChoiceShell>
  )
}

const wildcardMatchRules: AceRow[] = [
  { seq: '10', text: 'permit 192.168.10.0 0.0.0.255', action: 'permit' },
  { seq: '20', text: 'deny any', action: 'deny' },
]
const wildcardMatchPackets: PacketCase[] = [
  { id: 'w1', label: '192.168.10.20', detail: 'first three octets match, last octet ignored', match: 0, verdict: 'PERMIT' },
  { id: 'w2', label: '192.168.10.200', detail: 'still inside 192.168.10.0/24', match: 0, verdict: 'PERMIT' },
  { id: 'w3', label: '192.168.11.20', detail: 'third octet differs from 10', match: 1, verdict: 'DENY' },
]

export function AclWildcardMatchDiagram() {
  const [selected, setSelected] = useState('w1')
  return <RuleEvalBoard rules={wildcardMatchRules} packets={wildcardMatchPackets} selected={selected} onSelect={setSelected} ariaLabel="Packet source matching against ACL address and wildcard mask" />
}

const inboundStages = [
  'حزمة جاية من LAN1 بتوصل على Gi0/0.',
  'الراوتر يشوف إن فيه ACL مطبّق in على Gi0/0.',
  'الـ ACEs تتقيم قبل أي قرار توجيه.',
  'لو permit، الراوتر يكمل ويعمل routing lookup.',
  'لو deny، الحزمة تترمي هنا.',
  'المسموح بيخرج من Gi0/1 ناحية الوجهة.',
]

export function AclInboundFlowDiagram() {
  const playback = useStepPlayback(inboundStages.length)
  const s = playback.stage
  return (
    <StepShell title="INBOUND ACL PACKET FLOW" playback={playback} legend={inboundStages[s]}>
      <svg viewBox="0 0 920 400" className="h-auto w-full min-w-[880px]" role="img" aria-label="Inbound ACL packet flow before router routing decision">
        <Box x={15} y={145} w={160} h={95} title="LAN1" sub="source network" color="#38bdf8" active />
        <Box x={225} y={145} w={180} h={95} title="Gi0/0 - in" sub="ACL before routing" color="#fb7185" active={s >= 1} />
        <Box x={455} y={145} w={180} h={95} title="Routing table" sub="next hop decision" color="#a78bfa" active={s >= 3} />
        <Box x={685} y={145} w={210} h={95} title="Gi0/1 - out" sub="forward to destination" color="#34d399" active={s >= 5} />
        <LinkLine x1={175} y1={192} x2={225} y2={192} color="#38bdf8" active />
        <LinkLine x1={405} y1={192} x2={455} y2={192} color="#fb7185" active={s >= 3} />
        <LinkLine x1={635} y1={192} x2={685} y2={192} color="#a78bfa" active={s >= 5} />
        <FlowDot x1={175} y1={192} x2={685} y2={192} color="#f59e0b" active={s >= 5} />
        <Badge x={160} y={312} text="in means packets ENTERING this interface - before the routing decision" color="#22d3ee" active={s >= 1} w={600} />
      </svg>
    </StepShell>
  )
}

const outboundStages = [
  'حزمة وصلت الراوتر من LAN1.',
  'الراوتر بيعمل routing lookup ويحدد Gi0/1 كخروج.',
  'قبل الخروج من Gi0/1 بيلاقي ACL مطبّق out.',
  'الـ ACEs تتقيم على الحزمة في اتجاه الخروج.',
  'permit بيسمح بالخروج، وdeny بيمنعه.',
  'الحزمة المسموحة توصل للوجهة.',
]

export function AclOutboundFlowDiagram() {
  const playback = useStepPlayback(outboundStages.length)
  const s = playback.stage
  return (
    <StepShell title="OUTBOUND ACL PACKET FLOW" playback={playback} legend={outboundStages[s]}>
      <svg viewBox="0 0 920 400" className="h-auto w-full min-w-[880px]" role="img" aria-label="Outbound ACL packet flow after routing decision before exit">
        <Box x={15} y={145} w={160} h={95} title="LAN1" sub="source network" color="#38bdf8" active />
        <Box x={225} y={145} w={180} h={95} title="Routing table" sub="choose Gi0/1" color="#a78bfa" active={s >= 1} />
        <Box x={455} y={145} w={180} h={95} title="Gi0/1 - out" sub="ACL after routing" color="#fb7185" active={s >= 2} />
        <Box x={685} y={145} w={210} h={95} title="Server LAN" sub="destination network" color="#34d399" active={s >= 5} />
        <LinkLine x1={175} y1={192} x2={225} y2={192} color="#38bdf8" active />
        <LinkLine x1={405} y1={192} x2={455} y2={192} color="#a78bfa" active={s >= 2} />
        <LinkLine x1={635} y1={192} x2={685} y2={192} color="#fb7185" active={s >= 4} />
        <FlowDot x1={175} y1={192} x2={685} y2={192} color="#f59e0b" active={s >= 5} />
        <Badge x={160} y={312} text="out means packets LEAVING this interface - after the routing decision" color="#22d3ee" active={s >= 2} w={600} />
      </svg>
    </StepShell>
  )
}

const directionItems: InfoItem[] = [
  { id: 'in', label: 'in', sub: 'entering the interface', detail: 'الفحص بيحصل على الحزمة وهي داخلة للـ interface، وقبل الراوتر يحدد المسار النهائي. مثال: ip access-group 101 in على Gi0/0.', color: '#fb7185' },
  { id: 'out', label: 'out', sub: 'leaving the interface', detail: 'الفحص بيحصل بعد الـ routing lookup، وقبل الحزمة تخرج من الـ interface. مثال: ip access-group 101 out على Gi0/1.', color: '#34d399' },
  { id: 'relative', label: 'Router perspective', sub: 'not user perspective', detail: 'in وout نسبيين للراوتر والـ interface، مش نسبيين لمستخدم أو لاتجاه الشبكة بشكل عام.', color: '#a78bfa' },
]

export function AclDirectionCompareDiagram() {
  const [selected, setSelected] = useState('in')
  const item = directionItems.find((entry) => entry.id === selected) ?? directionItems[0]
  const controls = <ChoiceButtons items={directionItems.map((entry) => ({ id: entry.id, label: entry.label }))} selected={selected} onSelect={setSelected} />
  return (
    <ChoiceShell title="INBOUND vs OUTBOUND" controls={controls} legend={`**${item.label}** — ${item.detail}`}>
      <SelectorBoard items={directionItems} selected={selected} onSelect={setSelected} focusTitle="INBOUND vs OUTBOUND ACL" columns={2} />
    </ChoiceShell>
  )
}

const standardPlacementStages = [
  'Standard ACL بيشوف source address بس.',
  'لو حطيناه قرب المصدر، ممكن يمنع ترافيك مسموح لوجهات تانية.',
  'ال guideline العام: حط الـ Standard ACL أقرب للـ destination.',
  'في المثال ده بنطبّقها out على Gi0/2 ناحية LAN3 المحمية.',
  'كده بنتحكم فيمن يوصل لـ LAN3 من غير تأثير على بقية الوجهات.',
  'ال guideline مش قانون؛ السياسة والطوبولوجيا هما اللي بيحددوا.',
]

export function AclStandardPlacementDiagram() {
  const playback = useStepPlayback(standardPlacementStages.length)
  const s = playback.stage
  return (
    <StepShell title="STANDARD ACL PLACEMENT" playback={playback} legend={standardPlacementStages[s]}>
      <svg viewBox="0 0 920 400" className="h-auto w-full min-w-[880px]" role="img" aria-label="Standard ACL placement near destination design guideline">
        <Box x={20} y={150} w={160} h={90} title="LAN1" sub="192.168.10.0/24" color="#38bdf8" active />
        <Box x={220} y={150} w={160} h={90} title="LAN2" sub="192.168.20.0/24" color="#a78bfa" active={s >= 1} />
        <Box x={430} y={150} w={190} h={90} title="R1" sub="Layer 3 device" color="#f59e0b" active={s >= 2} />
        <Box x={670} y={150} w={210} h={90} title="LAN3 protected" sub="192.168.30.0/24" color="#34d399" active={s >= 3} />
        <LinkLine x1={180} y1={195} x2={430} y2={195} color="#38bdf8" active />
        <LinkLine x1={380} y1={195} x2={430} y2={195} color="#a78bfa" active={s >= 1} />
        <LinkLine x1={620} y1={195} x2={670} y2={195} color="#34d399" active={s >= 3} />
        {s >= 3 && <Badge x={620} y={262} text="Standard ACL - out toward LAN3" color="#fb7185" active w={260} />}
        <FlowDot x1={180} y1={195} x2={670} y2={195} color="#f59e0b" active={s >= 4} />
      </svg>
    </StepShell>
  )
}

const extendedPlacementStages = [
  'Extended ACL بيشوف source وdestination والبروتوكول والمنفذ.',
  'ممكن يفرّق بدقة بين خدمة وخدمة من أول لحظة.',
  'ال guideline العام: حط الـ Extended ACL أقرب للمصدر.',
  'في المثال ده بنطبّقها in على Gi0/0 ناحية LAN1.',
  'كده بنمنع الترافيك غير المسموح قبل ما يستهلك موارد الشبكة.',
  'لو السياسة محتاجة فحص قرب الوجهة، ممكن يتطبّق في مكان تاني.',
]

export function AclExtendedPlacementDiagram() {
  const playback = useStepPlayback(extendedPlacementStages.length)
  const s = playback.stage
  return (
    <StepShell title="EXTENDED ACL PLACEMENT" playback={playback} legend={extendedPlacementStages[s]}>
      <svg viewBox="0 0 920 400" className="h-auto w-full min-w-[880px]" role="img" aria-label="Extended ACL placement near source design guideline">
        <Box x={20} y={150} w={160} h={90} title="LAN1" sub="192.168.10.0/24" color="#38bdf8" active />
        <Box x={220} y={150} w={190} h={90} title="R1 Gi0/0" sub="source-facing" color="#a78bfa" active={s >= 2} />
        <Box x={455} y={150} w={180} h={90} title="Core" sub="shared network" color="#f59e0b" active={s >= 3} />
        <Box x={680} y={150} w={200} h={90} title="Server LAN" sub="192.168.20.0/24" color="#34d399" active={s >= 4} />
        <LinkLine x1={180} y1={195} x2={220} y2={195} color="#38bdf8" active />
        <LinkLine x1={410} y1={195} x2={455} y2={195} color="#a78bfa" active={s >= 3} />
        <LinkLine x1={635} y1={195} x2={680} y2={195} color="#f59e0b" active={s >= 4} />
        {s >= 3 && <Badge x={195} y={262} text="Extended ACL - in on Gi0/0" color="#fb7185" active w={220} />}
        <FlowDot x1={180} y1={195} x2={680} y2={195} color="#f59e0b" active={s >= 5} />
      </svg>
    </StepShell>
  )
}

const workflowStages = [
  'حدد الترافيك المطلوب التحكم فيه.',
  'حدد source وdestination networks.',
  'حدد البروتوكول والمنفذ لو محتاج.',
  'قرر Standard ولا Extended.',
  'اكتب الـ ACEs بالترتيب الصح.',
  'احسب الـ implicit deny.',
  'اختار الـ interface.',
  'اختار in ولا out.',
  'طبّق بـ ip access-group.',
  'تحقق بالأوامر وباختبار الترافيك.',
]

export function AclConfigWorkflowDiagram() {
  const playback = useStepPlayback(workflowStages.length)
  const s = playback.stage
  return (
    <StepShell title="ACL CONFIGURATION WORKFLOW" playback={playback} legend={workflowStages[s]}>
      <StageBoard stages={['Identify traffic','Source / destination','Protocol / port','Choose type','Write ACEs','Implicit deny','Interface','Direction','Apply ACL','Verify']} stage={s} ariaLabel="ACL configuration workflow from traffic identification to verification" />
    </StepShell>
  )
}

const hitRules: AceRow[] = [
  { seq: '10', text: 'permit tcp 192.168.10.0 0.0.0.255 host 192.168.20.10 eq 443', action: 'permit' },
  { seq: '20', text: 'permit icmp 192.168.10.0 0.0.0.255 host 192.168.20.10', action: 'permit' },
  { seq: '30', text: 'deny ip any any', action: 'deny' },
]
const hitCounts = [14, 3, 27]

export function AclHitCounterDiagram() {
  const [selected, setSelected] = useState('10')
  const highlight = Math.max(0, hitRules.findIndex((rule) => rule.seq === selected))
  const detail = selected === '10'
    ? 'ACE 10 سجل 14 hit؛ يعني 14 حزمة HTTPS طابقتها. الـ counters بتساعد تعرف أي سطر شغال.'
    : selected === '20'
      ? 'ACE 20 سجل 3 hits؛ يعني 3 حزم ICMP طابقتها.'
      : 'ACE 30 سجل 27 hit؛ يعني 27 حزمة ما طابقتش السطور اللي قبلها ووصلت للـ deny الصريح.'
  const controls = <ChoiceButtons items={hitRules.map((rule) => ({ id: rule.seq, label: `ACE ${rule.seq}` }))} selected={selected} onSelect={setSelected} />
  return (
    <ChoiceShell title="ACL HIT COUNTER VISUALIZATION" controls={controls} legend={detail}>
      <RuleSequenceBoard rules={hitRules} highlight={highlight} counts={hitCounts} ariaLabel="ACL hit counter visualization showing which ACE matched traffic" note="HIT COUNTERS - SUPPORT DEPENDS ON PLATFORM" />
    </ChoiceShell>
  )
}

const troubleItems: InfoItem[] = [
  { id: 'wildcard', label: 'Wrong wildcard', sub: 'no expected match', detail: 'لو الـ wildcard غلط، الحزمة ما بتطابقش الـ ACE المتوقع. راجع الـ address والـ wildcard بـ show ip access-lists.', color: '#fb7185' },
  { id: 'order', label: 'Wrong ACE order', sub: 'broad deny first', detail: 'Deny عام قبل permit محدد بيحجب الترافيك المسموح. راجع ترتيب السطور من الأعلى.', color: '#f59e0b' },
  { id: 'implicit', label: 'Forgot implicit deny', sub: 'traffic dropped', detail: 'غياب permit للحزمة معناة إنها هتقع في الـ implicit deny في الآخر. أضف permit صريح للترافيك المطلوب.', color: '#a78bfa' },
  { id: 'interface', label: 'Wrong interface / direction', sub: 'ACL has no effect', detail: 'ACL متطبّقش على المسار الصح أو بالاتجاه الصح. راجع ip access-group في الـ interface بـ show ip interface.', color: '#38bdf8' },
  { id: 'fields', label: 'Wrong fields', sub: 'protocol / port / host', detail: 'عنوان source أو destination أو رقم المنفذ غلط بيخلي الحزمة تروح لسطر deny. راجع كل حقل في الـ ACE.', color: '#34d399' },
  { id: 'management', label: 'Management access affected', sub: 'remote session drops', detail: 'ACL على ترافيك الإدارة ممكن يقطع SSH أو Telnet. خطّط لاستثناءات ووصول بديل قبل التطبيق.', color: '#f472b6' },
]

export function AclTroubleshootingTreeDiagram() {
  const [selected, setSelected] = useState('order')
  const item = troubleItems.find((entry) => entry.id === selected) ?? troubleItems[0]
  const controls = <ChoiceButtons items={troubleItems.map((entry) => ({ id: entry.id, label: entry.label }))} selected={selected} onSelect={setSelected} />
  return (
    <ChoiceShell title="ACL TROUBLESHOOTING DECISION TREE" controls={controls} legend={`**${item.label}** — ${item.detail}`}>
      <SelectorBoard items={troubleItems} selected={selected} onSelect={setSelected} focusTitle="ACL TROUBLESHOOTING DECISIONS" />
    </ChoiceShell>
  )
}

const labStandardScenarios: LabScenario[] = [
  {
    prompt: 'Standard ACL 10: permit 192.168.10.0 0.0.0.255، مطبّقة out على Gi0/2 ناحية LAN3. حزمة من 192.168.10.25 لـ 192.168.30.10 — إيه القرار؟',
    hint: 'الـ Standard ACL بيشوف source address بس، والترافيك داخل Gi0/2.',
    options: [
      { id: 'permit', label: 'Permit', correct: true, detail: 'صح: الـ source 192.168.10.25 داخل 192.168.10.0/24 فبيطابق ACE 10 ويسمح.' },
      { id: 'deny', label: 'Deny', correct: false, detail: 'غلط: الـ source مطابق للسطر permit.' },
      { id: 'not', label: 'Not filtered', correct: false, detail: 'غلط: الحزمة بتخرج فعلاً من Gi0/2، فالـ ACL مطبّقة عليها.' },
    ],
  },
  {
    prompt: 'نفس الـ ACL. حزمة من 192.168.20.10 لـ 192.168.30.10 — إيه القرار؟',
    hint: 'مفيش ACE بيطابق 192.168.20.0/24.',
    options: [
      { id: 'deny', label: 'Deny', correct: true, detail: 'صح: ما طابقتش الـ permit، فالـ implicit deny بيرفضها.' },
      { id: 'permit', label: 'Permit', correct: false, detail: 'غلط: الـ source مش 192.168.10.x.' },
      { id: 'not', label: 'Not filtered', correct: false, detail: 'غلط: الحزمة داخل Gi0/2 والـ ACL مطبّقة.' },
    ],
  },
  {
    prompt: 'نفس الـ ACL. حزمة من 192.168.30.5 لـ 192.168.10.20 — إيه القرار؟',
    hint: 'دور على الـ interface اللي الحزمة هتخرج منه.',
    options: [
      { id: 'not', label: 'Not filtered', correct: true, detail: 'صح: الحزمة بتخرج من Gi0/0 ناحية LAN1، مش Gi0/2، فالـ ACL ده مش بيشوفها.' },
      { id: 'deny', label: 'Deny', correct: false, detail: 'غلط: الـ ACL مش مطبّق على الخروج من Gi0/0.' },
      { id: 'permit', label: 'Permit', correct: false, detail: 'غلط: الـ ACL ما اتطبّقش أصلاً على المسار ده.' },
    ],
  },
  {
    prompt: 'نفس الـ ACL. حزمة من 192.168.10.25 لـ 192.168.20.10 — إيه القرار؟',
    hint: 'الوجهة LAN2 مش LAN3.',
    options: [
      { id: 'not', label: 'Not filtered', correct: true, detail: 'صح: الحزمة بتخرج من Gi0/1، والـ ACL مطبّق بس على Gi0/2.' },
      { id: 'permit', label: 'Permit', correct: false, detail: 'غلط: الـ ACL ما اتطبّقش على Gi0/1.' },
      { id: 'deny', label: 'Deny', correct: false, detail: 'غلط: مفيش فحص أصلاً على الخروج لـ LAN2.' },
    ],
  },
]

export function AclLabStandardDiagram() {
  return <ScenarioLab title="LAB 1 - BUILD A STANDARD ACL" scenarios={labStandardScenarios} ariaLabel="Standard ACL configuration lab with interactive traffic decision controls" />
}

const labExtendedScenarios: LabScenario[] = [
  {
    prompt: 'ACL 101 مطبّق in على Gi0/0: 10 permit tcp 192.168.10.0 0.0.0.255 host 192.168.20.10 eq 443؛ 20 permit ip 192.168.10.0 0.0.0.255 192.168.30.0 0.0.0.255؛ 30 deny ip any any. حزمة TCP 443 من LAN1 للسيرفر — إيه القرار؟',
    hint: 'قارن الـ source والـ destination والمنفذ بـ ACE 10.',
    options: [
      { id: 'permit', label: 'Permit', correct: true, detail: 'صح: ACE 10 يطابق TCP 443 من 192.168.10.x إلى host 192.168.20.10.' },
      { id: 'deny', label: 'Deny', correct: false, detail: 'غلط: كل الحقول مطابقة للسطر permit الأول.' },
      { id: 'not', label: 'Not filtered', correct: false, detail: 'غلط: الحزمة داخلة من Gi0/0 والـ ACL مطبّق in.' },
    ],
  },
  {
    prompt: 'نفس الـ ACL. حزمة TCP 80 من LAN1 للسيرفر — إيه القرار؟',
    hint: 'المنفذ 80 مش 443، والوجهة مش LAN3.',
    options: [
      { id: 'deny', label: 'Deny', correct: true, detail: 'صح: ما طابقتش ACE 10 ولا ACE 20، فوصلت لـ deny ip any any.' },
      { id: 'permit', label: 'Permit', correct: false, detail: 'غلط: eq 443 معناة إن TCP 80 مش مسموح هنا.' },
      { id: 'not', label: 'Not filtered', correct: false, detail: 'غلط: الـ ACL مطبّق على دخول Gi0/0.' },
    ],
  },
  {
    prompt: 'نفس الـ ACL. حزمة ICMP من 192.168.10.20 لـ 192.168.30.10 — إيه القرار؟',
    hint: 'ACE 20 بيسمح IP من LAN1 إلى LAN3.',
    options: [
      { id: 'permit', label: 'Permit', correct: true, detail: 'صح: ACE 20 يسمح أي IP من 192.168.10.0/24 إلى 192.168.30.0/24.' },
      { id: 'deny', label: 'Deny', correct: false, detail: 'غلط: الوجهة LAN3 مطابقة للسطر 20.' },
      { id: 'not', label: 'Not filtered', correct: false, detail: 'غلط: الحزمة داخلة من Gi0/0.' },
    ],
  },
  {
    prompt: 'نفس الـ ACL. حزمة TCP 443 من 192.168.30.20 للسيرفر 192.168.20.10 — إيه القرار؟',
    hint: 'الـ ACL مطبّق على دخول Gi0/0 فقط.',
    options: [
      { id: 'not', label: 'Not filtered', correct: true, detail: 'صح: الحزمة جاية من LAN3 عبر Gi0/2، فالـ ACL بتاع Gi0/0 ما بيشوفهاش.' },
      { id: 'deny', label: 'Deny', correct: false, detail: 'غلط: الـ ACL مش مطبّق على Gi0/2.' },
      { id: 'permit', label: 'Permit', correct: false, detail: 'غلط: الـ ACL ما اتطبّقش على المسار ده.' },
    ],
  },
]

export function AclLabExtendedDiagram() {
  return <ScenarioLab title="LAB 2 - BUILD AN EXTENDED ACL" scenarios={labExtendedScenarios} ariaLabel="Extended ACL configuration lab with interactive packet decisions" />
}

const labTroubleScenarios: LabScenario[] = [
  {
    prompt: 'HTTPS من LAN1 للسيرفر مرفوض رغم وجود permit tcp eq 443. أول سطر في الـ ACL هو deny ip 192.168.10.0 0.0.0.255 any. إيه المشكلة؟',
    hint: 'فكر في ترتيب الـ ACEs.',
    options: [
      { id: 'order', label: 'Broad deny first', correct: true, detail: 'صح: الـ deny العام بيطابق الحزمة أولاً، فالـ permit اللي بعده ما بيوصلش.' },
      { id: 'wildcard', label: 'Wrong wildcard', correct: false, detail: 'غلط: الـ wildcard 0.0.0.255 صحيح لـ /24؛ المشكلة في الترتيب.' },
    ],
  },
  {
    prompt: 'الـ ACL فيه permit tcp eq 443 بس، والمستخدمين بيشتكوا إن DNS وICMP كمان مرفوضين. إيه المشكلة؟',
    hint: 'مفيش سطر بيطابق الترافيك الإضافي.',
    options: [
      { id: 'implicit', label: 'Implicit deny', correct: true, detail: 'صح: أي ترافيك مفيش له permit بيقع في الـ implicit deny في الآخر.' },
      { id: 'port', label: 'Wrong port', correct: false, detail: 'غلط: المنفذ 443 صح للـ HTTPS؛ المشكلة إن مفيش permit لخدمات تانية.' },
    ],
  },
  {
    prompt: 'ACL مكتوب صح بس مفيش تأثير خالص على الترافيك، وshow ip interface ما بيعرضش ip access-group. إيه المشكلة؟',
    hint: 'هل الـ ACL اتطبّق على interface؟',
    options: [
      { id: 'apply', label: 'Missing ip access-group', correct: true, detail: 'صح: إنشاء الـ ACL لوحده ما بيفعّلهوش؛ لازم ip access-group على interface.' },
      { id: 'order', label: 'Broad deny first', correct: false, detail: 'غلط: مفيش أثر أصلاً يعني الـ ACL مش مطبّق، مش ترتيبه غلط.' },
    ],
  },
  {
    prompt: 'عايز تسمح 192.168.10.0/24 بس، بس كتبت access-list 10 permit 192.168.10.0 0.0.0.0. إيه المشكلة؟',
    hint: 'قارن الـ wildcard بـ /24.',
    options: [
      { id: 'wildcard', label: 'Wrong wildcard', correct: true, detail: 'صح: 0.0.0.0 معناة host واحدة فقط؛ الصحيح للـ /24 هو 0.0.0.255.' },
      { id: 'implicit', label: 'Implicit deny', correct: false, detail: 'غلط: الـ implicit deny موجود دايماً، لكن المشكلة هنا في الـ wildcard.' },
    ],
  },
  {
    prompt: 'ACE مكتوب permit tcp ... eq 80 والسياسة بتطلب HTTPS فقط. إيه المشكلة؟',
    hint: 'HTTPS بيستخدم رقم منفذ معروف.',
    options: [
      { id: 'port', label: 'Wrong port', correct: true, detail: 'صح: HTTPS بيستخدم TCP 443؛ eq 80 بيسمح HTTP بدل منه.' },
      { id: 'direction', label: 'Wrong direction', correct: false, detail: 'غلط: المشكلة في رقم المنفذ مش في اتجاه التطبيق.' },
    ],
  },
  {
    prompt: 'الـ ACL مطبّق in على Gi0/1 بينما الترافيك المطلوب بيخرج من Gi0/0. إيه المشكلة؟',
    hint: 'in وout نسبيين للـ interface.',
    options: [
      { id: 'direction', label: 'Wrong direction', correct: true, detail: 'صح: لازم تطبّق على Gi0/0 بالاتجاه اللي بيشوف الحزمة، أو Gi0/1 بـ out لو ده المسار.' },
      { id: 'apply', label: 'Missing ip access-group', correct: false, detail: 'غلط: الـ ACL مطبّق فعلاً، بس على interface واتجاه غلط.' },
    ],
  },
]

export function AclLabTroubleshootDiagram() {
  return <ScenarioLab title="LAB 3 - ACL TROUBLESHOOTING CHALLENGE" scenarios={labTroubleScenarios} ariaLabel="ACL troubleshooting lab with interactive mistake diagnosis" />
}

const summaryStages = [
  'ACL قائمة ACEs بيفحصوا الحزم في Layer 3.',
  'الفحص من الأعلى، وأول match يحدد القرار ويوقف.',
  'لو مفيش match، الـ implicit deny يرفض الحزمة.',
  'Standard يطابق source؛ Extended يطابق source وdestination وبروتوكول ومنفذ.',
  'Numbered بالأرقام، Named بالاسم وsequence numbers أسهل في التعديل.',
  'Wildcard: 0 لازم يتطابق، 1 يتجاهل؛ /24 بـ 0.0.0.255.',
  'in يعني دخول الـ interface، وout يعني خروجها.',
  'Standard غالباً قرب الوجهة، وExtended غالباً قرب المصدر.',
  'التحقق بـ show access-lists وshow ip access-lists وshow ip interface.',
]

export function AclSummaryDiagram() {
  const playback = useStepPlayback(summaryStages.length)
  const s = playback.stage
  return (
    <StepShell title="ACL CCNA REVISION MAP" playback={playback} legend={summaryStages[s]}>
      <StageBoard stages={['ACL idea','Top-down','First match','Implicit deny','Standard vs Extended','Number / name','Wildcards','In / out','Verify']} stage={s} ariaLabel="ACL CCNA revision map covering processing types wildcards direction and troubleshooting" />
    </StepShell>
  )
}
