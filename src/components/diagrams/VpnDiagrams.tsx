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
      <Badge x={160} y={350} text={note ?? 'Educational simulation - fictional topology, no real peers or secrets'} color="#fb7185" active w={600} />
    </svg>
  )
}

interface PacketSegment {
  text: string
  sub: string
  w: number
  kind: 'plain' | 'protected' | 'new' | 'inner'
}

interface PacketMode {
  id: string
  label: string
  detail: string
  visible: string
  protectedText: string
  segments: PacketSegment[]
}

const segmentColor: Record<PacketSegment['kind'], string> = {
  plain: '#64748b',
  protected: '#34d399',
  new: '#38bdf8',
  inner: '#a78bfa',
}

function PacketBoard({ mode, ariaLabel }: { mode: PacketMode; ariaLabel: string }) {
  const total = mode.segments.reduce((sum, segment) => sum + segment.w, 0)
  const scale = 820 / total
  let cursor = 50
  return (
    <svg viewBox="0 0 920 400" className="h-auto w-full min-w-[880px]" role="img" aria-label={ariaLabel}>
      <Badge x={160} y={20} text={`PACKET VIEW: ${mode.label}`} color="#a78bfa" active w={600} />
      <SvgText x={460} y={92} color="#94a3b8" size={9}>frame format - conceptual, not byte-accurate</SvgText>
      {mode.segments.map((segment, index) => {
        const width = segment.w * scale
        const x = cursor
        cursor += width
        const color = segmentColor[segment.kind]
        return (
          <motion.g key={`${mode.id}-${index}`} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: index * 0.05 }}>
            <rect x={x} y={130} width={Math.max(width - 5, 8)} height={92} rx="9" fill="#0b1224" stroke={color} strokeWidth={2} />
            <SvgText x={x + (width - 5) / 2} y={160} color={color} size={8.4} bold>{segment.text}</SvgText>
            <SvgText x={x + (width - 5) / 2} y={180} color="#cbd5e1" size={7.2}>{segment.sub}</SvgText>
            <SvgText x={x + (width - 5) / 2} y={206} color="#94a3b8" size={6.8}>{segment.kind}</SvgText>
          </motion.g>
        )
      })}
      <Badge x={50} y={272} text={`VISIBLE ON WIRE: ${mode.visible}`} color="#fb7185" active w={820} />
      <Badge x={50} y={310} text={`PROTECTED: ${mode.protectedText}`} color="#34d399" active w={820} />
      <SvgText x={460} y={368} color="#94a3b8" size={7.5}>"protected" may mean encrypted, authenticated, or both - depends on the selected algorithms</SvgText>
    </svg>
  )
}

function PacketSelector({ title, modes, selected, onSelect, ariaLabel }: {
  title: string
  modes: PacketMode[]
  selected: string
  onSelect: (id: string) => void
  ariaLabel: string
}) {
  const mode = modes.find((entry) => entry.id === selected) ?? modes[0]
  const controls = <ChoiceButtons items={modes.map((entry) => ({ id: entry.id, label: entry.label }))} selected={selected} onSelect={onSelect} />
  return (
    <ChoiceShell title={title} controls={controls} legend={`**${mode.label}** — ${mode.detail}`}>
      <PacketBoard mode={mode} ariaLabel={ariaLabel} />
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
  'الشبكة الخاصة physical يعني ملكيتها وعتادها بتاع مؤسسة واحدة، والوصول فيها محكوم.',
  'الإنترنت شبكة مشتركة وغير موثوقة؛ أي حزمة ممكن تتقرا أو تتعدل لو مفيش حماية.',
  'الـ VPN بيعمل اتصال منطقي خاص فوق الشبكة المشتركة بين نقطتين متعرفتين.',
  'داخل الـ tunnel البيانات بتتحزم وتتحمي، فالطرف اللي في النص يشوف حاجات مش مفهومة.',
  'الـ VPN بيحمي المسار بين الـ endpoints المشتركة؛ مش بيحمي كل جهاز أو كل تطبيق لوحده.',
  'من الاستخدامات: موظف من البيت، فرعين بيتكلموا، ومسؤول بيدخل شبكة الشركة.',
]

export function VpnOverviewDiagram() {
  const playback = useStepPlayback(overviewStages.length)
  const s = playback.stage
  return (
    <StepShell title="VPN OVERVIEW" playback={playback} legend={overviewStages[s]}>
      <svg viewBox="0 0 920 400" className="h-auto w-full min-w-[880px]" role="img" aria-label="VPN overview from private physical network to logical protected connection over a shared network">
        <Box x={25} y={150} w={185} h={90} title="Private LAN" sub="owned physical network" color="#38bdf8" active />
        <Box x={265} y={150} w={185} h={90} title="Public network" sub="untrusted shared path" color="#fb7185" active={s >= 1} />
        <Box x={505} y={150} w={185} h={90} title="VPN tunnel" sub="logical protected path" color="#34d399" active={s >= 2} />
        <Box x={745} y={150} w={150} h={90} title="Remote site" sub="private destination" color="#a78bfa" active={s >= 4} />
        <LinkLine x1={210} y1={195} x2={265} y2={195} color="#38bdf8" active />
        <LinkLine x1={450} y1={195} x2={505} y2={195} color="#fb7185" active={s >= 1} />
        <LinkLine x1={690} y1={195} x2={745} y2={195} color="#34d399" active={s >= 3} />
        <FlowDot x1={210} y1={195} x2={745} y2={195} color="#f59e0b" active={s >= 3} />
        <Badge x={160} y={312} text="A VPN protects traffic between defined endpoints - not every device or application" color="#f59e0b" active={s >= 4} w={600} />
      </svg>
    </StepShell>
  )
}

const tunnelPathStages = [
  'المستخدم أو الشبكة بتبعت حزمة أصلية جوه الشبكة الخاصة.',
  'الـ VPN endpoint بيحزم الحزمة ويحميها حسب إعدادات الـ tunnel.',
  'الحزمة المحمية بتمر على الشبكة العامة زي الإنترنت.',
  'أي طرف في النص يقدر يشوف العنوان الخارجي بس، مش المحتوى المحمي.',
  'الـ endpoint المستقبل بيتحقق ويفك الحماية ويطلع الحزمة الأصلية.',
  'الحزمة الأصلية توصل لوجهتها داخل الشبكة الخاصة التانية.',
]

export function VpnTunnelPathDiagram() {
  const playback = useStepPlayback(tunnelPathStages.length)
  const s = playback.stage
  return (
    <StepShell title="PROTECTED PATH ACROSS AN UNTRUSTED NETWORK" playback={playback} legend={tunnelPathStages[s]}>
      <svg viewBox="0 0 920 400" className="h-auto w-full min-w-[880px]" role="img" aria-label="VPN tunnel carrying protected traffic across an untrusted public network">
        <Box x={20} y={145} w={175} h={95} title="Source LAN" sub="original packet" color="#38bdf8" active />
        <Box x={250} y={145} w={175} h={95} title="VPN endpoint A" sub="encapsulate + protect" color="#a78bfa" active={s >= 1} />
        <Box x={485} y={145} w={175} h={95} title={s >= 3 ? 'Public network' : 'Secure tunnel'} sub={s >= 3 ? 'only outer header visible' : 'protected payload inside'} color={s >= 3 ? '#fb7185' : '#34d399'} active={s >= 2} />
        <Box x={715} y={145} w={180} h={95} title="VPN endpoint B" sub="validate + restore" color="#f59e0b" active={s >= 4} />
        <LinkLine x1={195} y1={192} x2={250} y2={192} color="#38bdf8" active />
        <LinkLine x1={425} y1={192} x2={485} y2={192} color="#a78bfa" active={s >= 1} />
        <LinkLine x1={660} y1={192} x2={715} y2={192} color="#34d399" active={s >= 3} />
        <FlowDot x1={195} y1={192} x2={715} y2={192} color="#f59e0b" active={s >= 4} />
        <Badge x={175} y={310} text="The untrusted network carries protected packets - it is not made trustworthy" color="#22d3ee" active={s >= 3} w={570} />
      </svg>
    </StepShell>
  )
}

const endpointItems: InfoItem[] = [
  { id: 'endpoint', label: 'VPN Endpoint', sub: 'one end of the tunnel', detail: 'الطرف اللي بيبدأ أو يستقبل الـ tunnel. ممكن يكون جهاز مستخدم أو VPN gateway في الشبكة.', color: '#38bdf8' },
  { id: 'gateway', label: 'VPN Gateway', sub: 'network-side device', detail: 'جهاز أو خدمة على حافة الشبكة بيتولى إنشاء الـ tunnel ويمثل شبكة كاملة أو أكثر.', color: '#34d399' },
  { id: 'client', label: 'VPN Client', sub: 'user-side software', detail: 'البرنامج اللي بيستخدمه المستخدم البعيد عشان يتصل بـ VPN gateway ويعمل tunnel.', color: '#a78bfa' },
  { id: 'public', label: 'Public Network', sub: 'untrusted transport', detail: 'الإنترنت أو أي شبكة مشتركة مش موثوقة؛ بنفترض إن اللي يمر عليها ممكن يتقرا أو يتعدل.', color: '#fb7185' },
  { id: 'private', label: 'Private Network', sub: 'protected LAN', detail: 'الشبكة الداخلية للمؤسسة والموارد اللي بنحمي الوصول لها.', color: '#f59e0b' },
]

export function VpnEndpointsDiagram() {
  const [selected, setSelected] = useState('gateway')
  const item = endpointItems.find((entry) => entry.id === selected) ?? endpointItems[0]
  const controls = <ChoiceButtons items={endpointItems.map((entry) => ({ id: entry.id, label: entry.label }))} selected={selected} onSelect={setSelected} />
  return (
    <ChoiceShell title="VPN TERMS AND PARTICIPANTS" controls={controls} legend={`**${item.label}** — ${item.detail}`}>
      <SelectorBoard items={endpointItems} selected={selected} onSelect={setSelected} focusTitle="VPN ENDPOINTS GATEWAYS CLIENTS" />
    </ChoiceShell>
  )
}

const workflowStages = [
  'جهاز أو شبكة بيبدأ اتصال VPN.',
  'الـ endpoints بيتفقوا على إعدادات أمنية متوافقة.',
  'كل طرف بيتحقق من هوية الطرف التاني.',
  'بيتم إنشاء مفاتيح وبارامترات التشفير.',
  'الترافيك يتحزم ويتحمي حسب تصميم الـ VPN.',
  'الترافيك يمر على الشبكة غير الموثوقة.',
  'الـ endpoint المستقبل بيتحقق من الحزمة ويفك التغليف.',
  'الحزمة الأصلية تتحول لوجهتها النهائية.',
]

export function VpnTunnelWorkflowDiagram() {
  const playback = useStepPlayback(workflowStages.length)
  const s = playback.stage
  return (
    <StepShell title="VPN CONNECTION WORKFLOW" playback={playback} legend={workflowStages[s]}>
      <StageBoard stages={['Initiate','Agree policy','Authenticate peers','Establish keys','Protect traffic','Cross network','Validate + decap','Deliver original']} stage={s} ariaLabel="VPN connection workflow from initiation to delivery of original traffic" />
    </StepShell>
  )
}

const protectItems: InfoItem[] = [
  { id: 'encap', label: 'Encapsulation', sub: 'wrap the packet', detail: 'حزمة جوه حزمة. الغلاف الخارجي بيسمح للحزمة إنها تمر trên الشبكة العامة، والداخل هو البيانات الأصلية.', color: '#38bdf8' },
  { id: 'encrypt', label: 'Encryption', sub: 'plaintext to ciphertext', detail: 'تحويل البيانات المقروءة لصيغة غير مفهومة غير بال مفتاح. بيدعم الـ confidentiality.', color: '#34d399' },
  { id: 'auth', label: 'Authentication', sub: 'prove peer identity', detail: 'إثبات هوية الأطراف المتصلة. ده مختلف عن تشفير البيانات؛ ممكن تشفر من غير ما تعرف مين الطرف التاني.', color: '#a78bfa' },
  { id: 'integrity', label: 'Integrity', sub: 'detect modification', detail: 'التأكد إن البيانات ما اتغيرتش في الطريق. بنستخدم hash أو توقيع ضمن الرسالة.', color: '#f59e0b' },
  { id: 'keys', label: 'Key exchange', sub: 'agree session keys', detail: 'الأطراف بيتفقوا على مفاتيح جلسة من غير ما يشاركوها في الوضوح على الشبكة.', color: '#22d3ee' },
]

export function VpnEncapsulationEncryptionDiagram() {
  const [selected, setSelected] = useState('encrypt')
  const item = protectItems.find((entry) => entry.id === selected) ?? protectItems[0]
  const controls = <ChoiceButtons items={protectItems.map((entry) => ({ id: entry.id, label: entry.label }))} selected={selected} onSelect={setSelected} />
  return (
    <ChoiceShell title="ENCAPSULATION / ENCRYPTION / AUTHENTICATION" controls={controls} legend={`**${item.label}** — ${item.detail}`}>
      <SelectorBoard items={protectItems} selected={selected} onSelect={setSelected} focusTitle="VPN PROTECTION FUNCTIONS" />
    </ChoiceShell>
  )
}

const remoteTopologyStages = [
  'الموظف بعيد عن المكتب ومعه VPN client على الجهاز.',
  'العميل بيتصل بـ VPN gateway على الإنترنت.',
  'الـ client والـ gateway بيتحققوا من بعض وينشئوا tunnel.',
  'الجلسة بتمثل المستخدم داخل الشبكة الداخلية.',
  'المستخدم يقدر يوصل للموارد المسموحة زي البريد والملفات.',
]

export function VpnRemoteTopologyDiagram() {
  const playback = useStepPlayback(remoteTopologyStages.length)
  const s = playback.stage
  return (
    <StepShell title="REMOTE ACCESS VPN TOPOLOGY" playback={playback} legend={remoteTopologyStages[s]}>
      <svg viewBox="0 0 920 400" className="h-auto w-full min-w-[880px]" role="img" aria-label="Remote Access VPN topology from remote user through internet to VPN gateway and corporate network">
        <Box x={20} y={150} w={180} h={90} title="Remote user" sub="VPN client software" color="#38bdf8" active />
        <Box x={260} y={150} w={175} h={90} title="Internet" sub="untrusted path" color="#fb7185" active={s >= 1} />
        <Box x={495} y={150} w={175} h={90} title="VPN gateway" sub="remote access headend" color="#a78bfa" active={s >= 2} />
        <Box x={730} y={150} w={170} h={90} title="Corporate LAN" sub="internal resources" color="#34d399" active={s >= 3} />
        <LinkLine x1={200} y1={195} x2={260} y2={195} color="#38bdf8" active />
        <LinkLine x1={435} y1={195} x2={495} y2={195} color="#fb7185" active={s >= 1} />
        <LinkLine x1={670} y1={195} x2={730} y2={195} color="#a78bfa" active={s >= 3} />
        <FlowDot x1={200} y1={195} x2={730} y2={195} color="#f59e0b" active={s >= 4} />
        <Badge x={185} y={312} text="Remote User -> Internet -> VPN Gateway -> Corporate Network" color="#22d3ee" active w={550} />
      </svg>
    </StepShell>
  )
}

const remoteAuthStages = [
  'المستخدم بيفتح VPN client ويكتب بيانات الدخول.',
  'الـ gateway بيتحقق من هوية المستخدم أو الجهاز.',
  'الطرفين بيتفقوا على إعدادات الـ IKE وبينشئوا SA.',
  'بيتم اشتقاق مفاتيح الجلسة.',
  'العميل بيبني tunnel ويبدأ يرسل ترافيك محمي.',
  'الـ gateway يسمح بالوصول للموارد حسب السياسة.',
]

export function VpnRemoteAuthFlowDiagram() {
  const playback = useStepPlayback(remoteAuthStages.length)
  const s = playback.stage
  return (
    <StepShell title="REMOTE ACCESS AUTHENTICATION FLOW" playback={playback} legend={remoteAuthStages[s]}>
      <StageBoard stages={['Client starts','User / device auth','IKE + SA','Session keys','Tunnel up','Policy access']} stage={s} ariaLabel="Remote access VPN user authentication and tunnel establishment flow" />
    </StepShell>
  )
}

const tunnelPolicyItems: InfoItem[] = [
  { id: 'full', label: 'Full tunnel', sub: 'all traffic via VPN', detail: 'كل ترافيك المستخدم يمر على الـ VPN gateway، فالسياسة والمراقبة المركزية تنطبق عليه. بيحتاج سعة أكبر في الـ gateway.', color: '#38bdf8' },
  { id: 'split', label: 'Split tunnel', sub: 'only corporate traffic', detail: 'ترافيك الشركة بس يمر على الـ VPN، والباقي يخرج مباشرة. بيقلل الحمل بس لازم ضبط سياسات الأمان على الجهاز.', color: '#a78bfa' },
]

export function VpnTunnelSplitDiagram() {
  const [selected, setSelected] = useState('full')
  const item = tunnelPolicyItems.find((entry) => entry.id === selected) ?? tunnelPolicyItems[0]
  const controls = <ChoiceButtons items={tunnelPolicyItems.map((entry) => ({ id: entry.id, label: entry.label }))} selected={selected} onSelect={setSelected} />
  return (
    <ChoiceShell title="FULL TUNNEL vs SPLIT TUNNEL" controls={controls} legend={`**${item.label}** — ${item.detail}`}>
      <SelectorBoard items={tunnelPolicyItems} selected={selected} onSelect={setSelected} focusTitle="FULL TUNNEL SPLIT TUNNEL" columns={2} />
    </ChoiceShell>
  )
}

const siteTopologyStages = [
  'كل فرع عنده VPN gateway على حافة الشبكة.',
  'الـ gateway في الفرع بيمثل شبكة الفرع كلها.',
  'الـ gatewayات بيتحققوا من بعض وينشئوا IPsec tunnel.',
  'أجهزة الفرع ما بتبعتش VPN session منفصلة لكل جهاز.',
  'الترافيك بين الـ LANs يمر محمي جوه الـ tunnel.',
]

export function VpnSiteTopologyDiagram() {
  const playback = useStepPlayback(siteTopologyStages.length)
  const s = playback.stage
  return (
    <StepShell title="SITE-TO-SITE VPN TOPOLOGY" playback={playback} legend={siteTopologyStages[s]}>
      <svg viewBox="0 0 920 400" className="h-auto w-full min-w-[880px]" role="img" aria-label="Site-to-Site VPN topology connecting branch LAN through gateways to headquarters LAN">
        <Box x={15} y={150} w={150} h={90} title="Branch LAN" sub="hosts" color="#38bdf8" active />
        <Box x={215} y={150} w={165} h={90} title="Branch gateway" sub="VPN endpoint" color="#a78bfa" active={s >= 1} />
        <Box x={430} y={150} w={140} h={90} title="Internet" sub="untrusted" color="#fb7185" active={s >= 2} />
        <Box x={620} y={150} w={165} h={90} title="HQ gateway" sub="VPN endpoint" color="#f59e0b" active={s >= 2} />
        <Box x={835} y={150} w={70} h={90} title="HQ LAN" sub="hosts" color="#34d399" active={s >= 4} />
        <LinkLine x1={165} y1={195} x2={215} y2={195} color="#38bdf8" active />
        <LinkLine x1={380} y1={195} x2={430} y2={195} color="#a78bfa" active={s >= 2} />
        <LinkLine x1={570} y1={195} x2={620} y2={195} color="#fb7185" active={s >= 3} />
        <LinkLine x1={785} y1={195} x2={835} y2={195} color="#34d399" active={s >= 4} />
        <FlowDot x1={165} y1={195} x2={835} y2={195} color="#f59e0b" active={s >= 4} />
        <Badge x={130} y={312} text="Branch LAN -> Branch VPN Gateway -> Internet -> HQ VPN Gateway -> HQ LAN" color="#22d3ee" active w={660} />
      </svg>
    </StepShell>
  )
}

const siteFlowStages = [
  'جهاز في الفرع بيرسل حزمة لعنوان في المقر.',
  'Gateway الفرع يشوف إن الوجهة داخل نطاق الشبكة المحمية.',
  'الحزمة تتغلف وتتحمي وتدخل الـ tunnel.',
  'Gateway المقر يتحقق ويفك التغليف.',
  'الحزمة الأصلية توصل للخادم في المقر.',
  'الرد يرجع بنفس المسار المحمي في الاتجاه العكسي.',
]

export function VpnSiteFlowDiagram() {
  const playback = useStepPlayback(siteFlowStages.length)
  const s = playback.stage
  return (
    <StepShell title="TWO-BRANCH VPN COMMUNICATION FLOW" playback={playback} legend={siteFlowStages[s]}>
      <StageBoard stages={['Host sends','Match protected net','Encapsulate','Peer validates','Original delivered','Return path']} stage={s} ariaLabel="Site-to-Site VPN packet flow between branch LANs and return traffic" />
    </StepShell>
  )
}

const architectureItems: InfoItem[] = [
  { id: 'remote', label: 'Remote Access VPN', sub: 'single user to network', detail: 'مستخدم واحد من بره بيتصل بشبكة المؤسسة. الـ endpoints هما VPN client وVPN gateway، والـ authentication غالباً user/device.', color: '#38bdf8' },
  { id: 'site', label: 'Site-to-Site VPN', sub: 'network to network', detail: 'شبكتان أو أكتر عبر gateways. الـ endpoints هما الـ gateways، والـ authentication بين الأجهزة (peer authentication).', color: '#34d399' },
]

export function VpnArchitectureCompareDiagram() {
  const [selected, setSelected] = useState('remote')
  const item = architectureItems.find((entry) => entry.id === selected) ?? architectureItems[0]
  const controls = <ChoiceButtons items={architectureItems.map((entry) => ({ id: entry.id, label: entry.label }))} selected={selected} onSelect={setSelected} />
  return (
    <ChoiceShell title="REMOTE ACCESS vs SITE-TO-SITE" controls={controls} legend={`**${item.label}** — ${item.detail}`}>
      <SelectorBoard items={architectureItems} selected={selected} onSelect={setSelected} focusTitle="REMOTE ACCESS SITE TO SITE" columns={2} />
    </ChoiceShell>
  )
}

const goalsItems: InfoItem[] = [
  { id: 'conf', label: 'Confidentiality', sub: 'keep data secret', detail: 'منع أي طرف غير مخول من قراءة البيانات. بنستخدم التشفير زي AES.', color: '#38bdf8' },
  { id: 'integ', label: 'Integrity', sub: 'detect changes', detail: 'التأكد إن الرسالة ما اتغيرتش في الطريق. أي تعديل بيخلي فحص الـ hash يفشل.', color: '#34d399' },
  { id: 'origin', label: 'Data origin auth', sub: 'verify the sender', detail: 'إثبات إن الرسالة جت فعلاً من الـ peer المتوقع، مش من حد تاني.', color: '#a78bfa' },
  { id: 'replay', label: 'Anti-replay', sub: 'reject old packets', detail: 'منع المهاجم من إعادة إرسال حزمة قديمة صالحة. بنستخدم sequence numbers.', color: '#f59e0b' },
]

export function VpnIpsecGoalsDiagram() {
  const [selected, setSelected] = useState('conf')
  const item = goalsItems.find((entry) => entry.id === selected) ?? goalsItems[0]
  const controls = <ChoiceButtons items={goalsItems.map((entry) => ({ id: entry.id, label: entry.label }))} selected={selected} onSelect={setSelected} />
  return (
    <ChoiceShell title="IPSEC SECURITY GOALS" controls={controls} legend={`**${item.label}** — ${item.detail}`}>
      <SelectorBoard items={goalsItems} selected={selected} onSelect={setSelected} focusTitle="IPSEC SECURITY GOALS" />
    </ChoiceShell>
  )
}

const componentItems: InfoItem[] = [
  { id: 'ah', label: 'AH', sub: 'Authentication Header', detail: 'بيدي integrity وdata origin authentication. ما بيشفّرش الحمولة.', color: '#fb7185' },
  { id: 'esp', label: 'ESP', sub: 'Encapsulating Security Payload', detail: 'بيوفر confidentiality بالتشفير، ومع اختيار خوارزميات مناسبة بيوفر كمان integrity وorigin auth.', color: '#34d399' },
  { id: 'ike', label: 'IKE', sub: 'Internet Key Exchange', detail: 'بيتفاوض على البارامترات ويتحقق من الـ peers وينشئ ويدير الـ Security Associations.', color: '#a78bfa' },
  { id: 'sa', label: 'Security Association', sub: 'agreed security context', detail: 'مجموعة الاتفاقيات بين طرفين: الخوارزميات والمفاتيح والـ SPI واتجاه الرحلة.', color: '#38bdf8' },
  { id: 'spi', label: 'SPI', sub: 'identifies the SA', detail: 'رقم بيعرّف أي SA لازم يستخدمه الـ peer عند فك الحماية.', color: '#f59e0b' },
  { id: 'seq', label: 'Sequence Number', sub: 'anti-replay aid', detail: 'رقم متسلسل لكل حزمة عشان يتكشف تكرار الحزم القديمة.', color: '#22d3ee' },
]

export function VpnIpsecComponentsDiagram() {
  const [selected, setSelected] = useState('esp')
  const item = componentItems.find((entry) => entry.id === selected) ?? componentItems[0]
  const controls = <ChoiceButtons items={componentItems.map((entry) => ({ id: entry.id, label: entry.label }))} selected={selected} onSelect={setSelected} />
  return (
    <ChoiceShell title="IPSEC COMPONENTS" controls={controls} legend={`**${item.label}** — ${item.detail}`}>
      <SelectorBoard items={componentItems} selected={selected} onSelect={setSelected} focusTitle="IPSEC COMPONENTS" columns={3} />
    </ChoiceShell>
  )
}

const ahModes: PacketMode[] = [
  {
    id: 'plain', label: 'Without AH', detail: 'الحزمة الأصلية بس؛ مفيش حماية للـ integrity أو هوية المصدر على مستوى IPsec.',
    visible: 'Original IP header + payload', protectedText: 'Nothing',
    segments: [
      { text: 'Original IP Header', sub: 'src + dst', w: 2.2, kind: 'plain' },
      { text: 'Payload', sub: 'TCP/UDP + data', w: 3.4, kind: 'plain' },
    ],
  },
  {
    id: 'ah', label: 'With AH', detail: 'ـAH بيضيف ترويسة بتتحقق منها الهوية والـ integrity لكل الحزمة، لكنه ما بيشفّرش الحمولة.',
    visible: 'Original IP header + payload + AH fields', protectedText: 'Integrity + origin authentication (no encryption)',
    segments: [
      { text: 'Original IP Header', sub: 'still visible', w: 2.2, kind: 'plain' },
      { text: 'AH', sub: 'SPI + seq + ICV', w: 1.5, kind: 'protected' },
      { text: 'Payload', sub: 'not encrypted', w: 3.4, kind: 'plain' },
    ],
  },
]

export function VpnAhProtectionDiagram() {
  const [selected, setSelected] = useState('ah')
  return <PacketSelector title="AH PACKET PROTECTION" modes={ahModes} selected={selected} onSelect={setSelected} ariaLabel="AH packet protection showing integrity without encryption" />
}

const espModes: PacketMode[] = [
  {
    id: 'plain', label: 'Without ESP', detail: 'الحمولة مقروءة على الشبكة العامة.',
    visible: 'Original IP header + payload', protectedText: 'Nothing',
    segments: [
      { text: 'Original IP Header', sub: 'src + dst', w: 2.2, kind: 'plain' },
      { text: 'Payload', sub: 'cleartext data', w: 3.4, kind: 'plain' },
    ],
  },
  {
    id: 'esp', label: 'With ESP', detail: 'ESP بيشفّر الحمولة، ومع خوارزميات مناسبة بيضيف كمان integrity وتحقق من مصدر البيانات.',
    visible: 'Outer IP header + ESP header/trailer', protectedText: 'Confidentiality + integrity + origin auth (algorithm-dependent)',
    segments: [
      { text: 'IP Header', sub: 'outer or original', w: 2, kind: 'plain' },
      { text: 'ESP Hdr', sub: 'SPI + seq', w: 1.4, kind: 'new' },
      { text: 'Encrypted payload', sub: 'ciphertext', w: 3, kind: 'protected' },
      { text: 'ESP Trailer', sub: 'ICV', w: 1.2, kind: 'protected' },
    ],
  },
]

export function VpnEspProtectionDiagram() {
  const [selected, setSelected] = useState('esp')
  return <PacketSelector title="ESP PACKET PROTECTION" modes={espModes} selected={selected} onSelect={setSelected} ariaLabel="ESP packet protection showing encryption and optional integrity" />
}

const ahEspItems: InfoItem[] = [
  { id: 'ah-auth', label: 'AH authentication', sub: 'yes', detail: 'AH بيدعم data origin authentication وintegrity.', color: '#34d399' },
  { id: 'ah-encrypt', label: 'AH encryption', sub: 'no', detail: 'AH ما بيشفّرش البيانات أبداً. لو محتاج confidentiality استخدم ESP.', color: '#fb7185' },
  { id: 'ah-nat', label: 'AH with NAT', sub: 'problematic', detail: 'لأن AH بيحمي ترويسة IP نفسها، تعديل الـ NAT للعناوين بيكسر فحص الـ integrity. غالباً بيستخدم ESP في الشبكات اللي فيها NAT.', color: '#f59e0b' },
  { id: 'esp-main', label: 'ESP modern use', sub: 'common choice', detail: 'ESP هو المعتاد في IPsec الحديث لأنه بيجمع تشفير وintegrity حسب الخوارزميات المختارة.', color: '#38bdf8' },
]

export function VpnAhVsEspDiagram() {
  const [selected, setSelected] = useState('esp-main')
  const item = ahEspItems.find((entry) => entry.id === selected) ?? ahEspItems[0]
  const controls = <ChoiceButtons items={ahEspItems.map((entry) => ({ id: entry.id, label: entry.label }))} selected={selected} onSelect={setSelected} />
  return (
    <ChoiceShell title="AH vs ESP" controls={controls} legend={`**${item.label}** — ${item.detail}`}>
      <SelectorBoard items={ahEspItems} selected={selected} onSelect={setSelected} focusTitle="AH vs ESP COMPARISON" />
    </ChoiceShell>
  )
}

const ikeStages = [
  'كل طرف بيعرف البارامترات المقبولة عنده.',
  'IKE بيتفاوض مع الـ peer على خوارزميات التشفير والـ integrity والمجموعة.',
  'الطرفين بيتحققوا من هوية بعض بـ PSK أو certificates.',
  'IKE بينشئ مفاتيح الجلسة من غير إرسالها في الوضوح.',
  'IKE بينشئ ويدير الـ Security Associations للاتجاهين.',
  'بعد كده بيانات المستخدم تمر محمية بـ IPsec SA.',
]

export function VpnIkeNegotiationDiagram() {
  const playback = useStepPlayback(ikeStages.length)
  const s = playback.stage
  return (
    <StepShell title="IKE NEGOTIATION AND PEER AUTHENTICATION" playback={playback} legend={ikeStages[s]}>
      <StageBoard stages={['Local policy','Negotiate algorithms','Authenticate peer','Derive keys','Create SAs','Protected data']} stage={s} ariaLabel="IKE negotiation authenticating peers and establishing IPsec security associations" />
    </StepShell>
  )
}

const saItems: InfoItem[] = [
  { id: 'sa', label: 'Security Association', sub: 'one-way context', detail: 'اتفاقية أحادية الاتجاه بتحدد الخوارزمية والمفاتيح والـ SPI ومدة الصلاحية. غالباً محتاج SA لكل اتجاه.', color: '#38bdf8' },
  { id: 'spi', label: 'SPI', sub: 'SA identifier', detail: 'رقم وارد في ترويسة IPsec بيعرف الـ peer أي اتفاقية يستخدمها لفك الحماية.', color: '#34d399' },
  { id: 'seq', label: 'Sequence Number', sub: 'per-packet counter', detail: 'بيزيد مع كل حزمة، وبيستخدم في كشف إعادة الإرسال (anti-replay).', color: '#a78bfa' },
  { id: 'ikev', label: 'IKEv1 vs IKEv2', sub: 'version matters', detail: 'IKEv2 هو الأحدث والأكثر استخداماً. أوامر التحقق مختلفة: show crypto isakmp sa مرتبط بـ IKEv1، وshow crypto ikev2 sa بـ IKEv2.', color: '#f59e0b' },
]

export function VpnSaConceptDiagram() {
  const [selected, setSelected] = useState('sa')
  const item = saItems.find((entry) => entry.id === selected) ?? saItems[0]
  const controls = <ChoiceButtons items={saItems.map((entry) => ({ id: entry.id, label: entry.label }))} selected={selected} onSelect={setSelected} />
  return (
    <ChoiceShell title="SECURITY ASSOCIATION CONCEPT" controls={controls} legend={`**${item.label}** — ${item.detail}`}>
      <SelectorBoard items={saItems} selected={selected} onSelect={setSelected} focusTitle="SECURITY ASSOCIATION SPI SEQUENCE" />
    </ChoiceShell>
  )
}

const packetModes: PacketMode[] = [
  {
    id: 'original', label: 'Original IP Packet', detail: 'الحزمة قبل أي حماية: ترويسة IP أصلية وحمولة مقروءة.',
    visible: 'Original IP header + payload', protectedText: 'Nothing',
    segments: [
      { text: 'Original IP Header', sub: 'src + dst', w: 2.4, kind: 'plain' },
      { text: 'Original Payload', sub: 'TCP/UDP + data', w: 3.6, kind: 'plain' },
    ],
  },
  {
    id: 'tunnel', label: 'Tunnel Mode', detail: 'الحزمة الأصلية كلها تتحزم جوه حزمة جديدة بترويسة IP خارجية. العنوان الأصلي موجود داخل الجزء المحمي.',
    visible: 'New outer IP header only', protectedText: 'Entire original IP packet (header + payload)',
    segments: [
      { text: 'New Outer IP Header', sub: 'VPN gateways', w: 2.2, kind: 'new' },
      { text: 'IPsec Hdr', sub: 'SPI + seq', w: 1.2, kind: 'protected' },
      { text: 'Original IP Header', sub: 'hidden inside', w: 1.8, kind: 'inner' },
      { text: 'Original Payload', sub: 'protected', w: 2.6, kind: 'inner' },
    ],
  },
  {
    id: 'transport', label: 'Transport Mode', detail: 'الترويسة الأصلية تفضل ظاهرة، والحمولة بس اللي تت protect. مناسبة غالباً لـ host-to-host.',
    visible: 'Original IP header remains visible', protectedText: 'Payload only (not the original IP header)',
    segments: [
      { text: 'Original IP Header', sub: 'still visible', w: 2.2, kind: 'plain' },
      { text: 'IPsec Hdr', sub: 'SPI + seq', w: 1.2, kind: 'protected' },
      { text: 'Original Payload', sub: 'protected', w: 3.4, kind: 'protected' },
    ],
  },
]

export function VpnPacketModesDiagram() {
  const [selected, setSelected] = useState('tunnel')
  return <PacketSelector title="TUNNEL MODE vs TRANSPORT MODE - PACKET STRUCTURE" modes={packetModes} selected={selected} onSelect={setSelected} ariaLabel="Interactive packet structure comparison of original tunnel and transport modes" />
}

const modeItems: InfoItem[] = [
  { id: 'header', label: 'Original IP header', sub: 'visibility', detail: 'في Tunnel Mode بيكون داخل الحزمة المحمية. في Transport Mode يفضل ظاهر على الشبكة.', color: '#fb7185' },
  { id: 'encap', label: 'Encapsulation', sub: 'new outer header', detail: 'Tunnel Mode بيضيف ترويسة IP خارجية جديدة. Transport Mode ما بيضيفش ترويسة IP جديدة.', color: '#38bdf8' },
  { id: 'boundary', label: 'Protection boundary', sub: 'what is protected', detail: 'Tunnel Mode يحمي الحزمة الأصلية كلها. Transport Mode يحمي الحمولة بس.', color: '#34d399' },
  { id: 'deploy', label: 'Typical deployment', sub: 'where it is used', detail: 'Tunnel Mode شائع في Site-to-Site بين gateways. Transport Mode غالباً host-to-host.', color: '#a78bfa' },
]

export function VpnModeCompareDiagram() {
  const [selected, setSelected] = useState('boundary')
  const item = modeItems.find((entry) => entry.id === selected) ?? modeItems[0]
  const controls = <ChoiceButtons items={modeItems.map((entry) => ({ id: entry.id, label: entry.label }))} selected={selected} onSelect={setSelected} />
  return (
    <ChoiceShell title="TUNNEL MODE vs TRANSPORT MODE" controls={controls} legend={`**${item.label}** — ${item.detail}`}>
      <SelectorBoard items={modeItems} selected={selected} onSelect={setSelected} focusTitle="TUNNEL vs TRANSPORT COMPARISON" />
    </ChoiceShell>
  )
}

const encryptionStages = [
  'البيانات الأصلية مقروءة (plaintext).',
  'الـ endpoints يتفقوا على خوارزمية ومفتاح متوافقين.',
  'خوارزمية التشفير بتحوّل البيانات لـ ciphertext.',
  'الحزمة المشفّرة تمر على الشبكة غير الموثوقة.',
  'الطرف التاني يستخدم المفتاح نفسه لفك التشفير.',
  'البيانات ترجع plaintext في الطرف المستقبل.',
]

export function VpnEncryptionFlowDiagram() {
  const playback = useStepPlayback(encryptionStages.length)
  const s = playback.stage
  return (
    <StepShell title="ENCRYPTION AND DECRYPTION FLOW" playback={playback} legend={encryptionStages[s]}>
      <svg viewBox="0 0 920 400" className="h-auto w-full min-w-[880px]" role="img" aria-label="VPN encryption flow from plaintext to ciphertext and back at the receiving endpoint">
        <Box x={25} y={150} w={175} h={90} title="Plaintext" sub="readable data" color="#34d399" active />
        <Box x={255} y={150} w={175} h={90} title="Encrypt" sub="AES + session key" color="#38bdf8" active={s >= 1} />
        <Box x={485} y={150} w={175} h={90} title="Ciphertext" sub="unreadable on wire" color="#fb7185" active={s >= 3} />
        <Box x={715} y={150} w={175} h={90} title="Decrypt" sub="matching key" color="#a78bfa" active={s >= 4} />
        <LinkLine x1={200} y1={195} x2={255} y2={195} color="#34d399" active />
        <LinkLine x1={430} y1={195} x2={485} y2={195} color="#38bdf8" active={s >= 2} />
        <LinkLine x1={660} y1={195} x2={715} y2={195} color="#fb7185" active={s >= 4} />
        <FlowDot x1={200} y1={195} x2={715} y2={195} color="#f59e0b" active={s >= 5} />
        <Badge x={175} y={312} text="Symmetric encryption needs compatible algorithms and keys at both endpoints" color="#22d3ee" active w={570} />
      </svg>
    </StepShell>
  )
}

const pskStages = [
  'الإداري بيضبط Pre-Shared Key متطابقة على الطرفين.',
  'كل طرف بيرسل دليل على إنه عارف الـ PSK من غير إرسالها كنص واضح.',
  'الطرف التاني بيتحقق من الدليل.',
  'لو الـ PSK مختلفة أو مكتوبة غلط، الـ authentication يفشل.',
  'نجاح التحقق بيساعد على إنشاء الـ SA والـ tunnel.',
  'لازم حماية الـ PSK ومفيش مشاركة أو تخزين في أماكن مكشوفة.',
]

export function VpnPskAuthDiagram() {
  const playback = useStepPlayback(pskStages.length)
  const s = playback.stage
  return (
    <StepShell title="PRE-SHARED KEY PEER AUTHENTICATION" playback={playback} legend={pskStages[s]}>
      <StageBoard stages={['Configure PSK','Prove knowledge','Verify peer','Mismatch fails','Build SA','Protect the secret']} stage={s} ariaLabel="Pre-shared key peer authentication flow for IPsec VPNs" />
    </StepShell>
  )
}

const certStages = [
  'كل peer عنده digital certificate ومفتاح خاص.',
  'الـ CA وقّع على الشهادات في إطار PKI.',
  'الطرف بيقدّم شهادته للطرف التاني.',
  'الطرف المستقبل بيتحقق من السلسلة والتاريخ والاسم.',
  'نجاح التحقق بيثبت هوية الـ peer.',
  'بعد كده بيتم إنشاء الـ SA والـ tunnel.',
]

export function VpnCertAuthDiagram() {
  const playback = useStepPlayback(certStages.length)
  const s = playback.stage
  return (
    <StepShell title="CERTIFICATE-BASED PEER AUTHENTICATION" playback={playback} legend={certStages[s]}>
      <StageBoard stages={['Cert + private key','Signed by CA','Present certificate','Validate chain','Peer identity proven','Build SA']} stage={s} ariaLabel="Certificate based peer authentication using PKI validation for IPsec VPNs" />
    </StepShell>
  )
}

const replayStages = [
  'كل حزمة IPsec ليها Sequence Number متسلسل.',
  'الـ peer بيتتبع آخر رقم وصل.',
  'لو حزمة وصلها رقم أقدم أو مكرر، بيتم رفضها.',
  'كده المهاجم ما يقدرش يعيد إرسال حزمة قديمة صالحة.',
  'الـ anti-replay بيحمي من إعادة التشغيل مش من التنصت.',
]

export function VpnAntiReplayDiagram() {
  const playback = useStepPlayback(replayStages.length)
  const s = playback.stage
  return (
    <StepShell title="ANTI-REPLAY AND SEQUENCE NUMBERS" playback={playback} legend={replayStages[s]}>
      <svg viewBox="0 0 920 400" className="h-auto w-full min-w-[880px]" role="img" aria-label="Anti-replay sequence number visualization rejecting duplicated old IPsec packets">
        <Box x={30} y={155} w={175} h={90} title="Packet #10" sub="sent" color="#38bdf8" active />
        <Box x={260} y={155} w={175} h={90} title="Packet #11" sub="sent" color="#34d399" active={s >= 1} />
        <Box x={490} y={155} w={175} h={90} title={s >= 2 ? 'Replay #10' : 'Packet #12'} sub={s >= 2 ? 'duplicate old' : 'new'} color={s >= 2 ? '#fb7185' : '#a78bfa'} active={s >= 2} />
        <Box x={720} y={155} w={175} h={90} title={s >= 3 ? 'Rejected' : 'Accepted'} sub={s >= 3 ? 'old sequence' : 'in order'} color={s >= 3 ? '#fb7185' : '#34d399'} active={s >= 4} />
        <LinkLine x1={205} y1={200} x2={260} y2={200} color="#38bdf8" active />
        <LinkLine x1={435} y1={200} x2={490} y2={200} color="#34d399" active={s >= 1} />
        <LinkLine x1={665} y1={200} x2={720} y2={200} color="#fb7185" active={s >= 3} />
        <FlowDot x1={205} y1={200} x2={720} y2={200} color="#f59e0b" active={s >= 4} />
        <Badge x={180} y={312} text="Anti-replay stops repeated old packets - it is not encryption" color="#22d3ee" active w={560} />
      </svg>
    </StepShell>
  )
}

const troubleshootItems: InfoItem[] = [
  { id: 'ike', label: 'IKE SA problem', sub: 'no phase 1', detail: 'لو مفيش IKE SA، راجع الـ PSK أو الشهادات واتفاق الخوارزميات والوصول لمنفذ IKE على الـ firewall.', color: '#fb7185' },
  { id: 'ipsec', label: 'IPsec SA problem', sub: 'no phase 2', detail: 'لو الـ IKE SA تمام بس مفيش IPsec SA، راجع الـ proxy IDs/protected networks وبارامترات الـ IPsec.', color: '#f59e0b' },
  { id: 'counters', label: 'Counters not moving', sub: 'SA up, no data', detail: 'الـ SA موجود بس العدادات ما بيزيدوش: غالباً routing أو protected network غلط أو ترافيك مش داخل السياسة.', color: '#a78bfa' },
  { id: 'oneway', label: 'One-way traffic', sub: 'return path issue', detail: 'اتجاه واحد شغال والرد مش راجع: راجع الـ routes والـ firewall والـ NAT في الاتجاه العكسي.', color: '#38bdf8' },
]

export function VpnTroubleshootingTreeDiagram() {
  const [selected, setSelected] = useState('counters')
  const item = troubleshootItems.find((entry) => entry.id === selected) ?? troubleshootItems[0]
  const controls = <ChoiceButtons items={troubleshootItems.map((entry) => ({ id: entry.id, label: entry.label }))} selected={selected} onSelect={setSelected} />
  return (
    <ChoiceShell title="VPN TROUBLESHOOTING DECISION TREE" controls={controls} legend={`**${item.label}** — ${item.detail}`}>
      <SelectorBoard items={troubleshootItems} selected={selected} onSelect={setSelected} focusTitle="VPN TROUBLESHOOTING DECISIONS" />
    </ChoiceShell>
  )
}

const labArchitectureScenarios: LabScenario[] = [
  {
    prompt: 'موظف بيعمل من البيت عشان يوصل لبريد الشركة والملفات. إيه أنسب معمارية؟',
    hint: 'مستخدم واحد من بره الشبكة.',
    options: [
      { id: 'ra', label: 'Remote Access VPN', correct: true, detail: 'صح: مستخدم واحد بـ VPN client بيتصل بـ VPN gateway للوصول لموارد الشركة.' },
      { id: 's2s', label: 'Site-to-Site VPN', correct: false, detail: 'غلط: Site-to-Site بيربط شبكتين عبر gateways، مش مستخدم فردي.' },
    ],
  },
  {
    prompt: 'فرعان بعيدان عندهم LANs منفصلة وعايزين يتواصلوا عبر الإنترنت. إيه أنسب معمارية؟',
    hint: 'شبكة لشبكة.',
    options: [
      { id: 's2s', label: 'Site-to-Site VPN', correct: true, detail: 'صح: VPN gateway في كل فرع بيمثل شبكته، والـ tunnel بين الـ gateways.' },
      { id: 'ra', label: 'Remote Access VPN', correct: false, detail: 'غلط: Remote Access مصمم لمستخدمين أفراد مش لربط شبكتين.' },
    ],
  },
  {
    prompt: 'مسؤول شبكة بيتصل من بره عشان يدير أجهزة الشركة. إيه أنسب معمارية؟',
    hint: 'فرد واحد محتاج وصول إداري.',
    options: [
      { id: 'ra', label: 'Remote Access VPN', correct: true, detail: 'صح: المسؤول يقدر يوصل كـ remote user، ويفضل يكمل MFA وإدارة صلاحيات.' },
      { id: 's2s', label: 'Site-to-Site VPN', correct: false, detail: 'غلط: مفيش شبكتين هنا؛ الحالة مستخدم واحد.' },
    ],
  },
  {
    prompt: 'شركتان عندهم LANs وعايزين يتبادلوا ترافيك عبر الإنترنت. إيه أنسب معمارية؟',
    hint: 'الاتنين شبكات كاملة.',
    options: [
      { id: 's2s', label: 'Site-to-Site VPN', correct: true, detail: 'صح: الـ endpoints هما gateway في كل موقع، والـ tunnel يحمي الترافيك بين الـ LANs.' },
      { id: 'ra', label: 'Remote Access VPN', correct: false, detail: 'غلط: Remote Access مش الحل لربط شبكتين كاملتين.' },
    ],
  },
]

export function VpnLabArchitectureDiagram() {
  return <ScenarioLab title="LAB 1 - CHOOSE THE RIGHT VPN ARCHITECTURE" scenarios={labArchitectureScenarios} ariaLabel="VPN architecture selection lab with interactive remote access and site to site decisions" />
}

const labModeScenarios: LabScenario[] = [
  {
    prompt: 'Site-to-Site بين فرعين: عايزين العنوان الأصلي يتخبى جوه الحزمة المحمية. إيه المود؟',
    hint: 'في أي مود بنضيف ترويسة IP خارجية جديدة؟',
    options: [
      { id: 'tunnel', label: 'Tunnel Mode', correct: true, detail: 'صح: Tunnel Mode بيضيف outer header ويحمي الحزمة الأصلية كلها.' },
      { id: 'transport', label: 'Transport Mode', correct: false, detail: 'غلط: Transport Mode يسيب الترويسة الأصلية ظاهرة.' },
    ],
  },
  {
    prompt: 'Host-to-host: الترويسة الأصلية لازم تفضل ظاهرة والحمولة بس تتحمي. إيه المود؟',
    hint: 'مين اللي بيظهر على الشبكة؟',
    options: [
      { id: 'transport', label: 'Transport Mode', correct: true, detail: 'صح: الترويسة الأصلية تفضل ظاهرة والحمولة تت protect.' },
      { id: 'tunnel', label: 'Tunnel Mode', correct: false, detail: 'غلط: Tunnel Mode بيخبي الحزمة الأصلية داخل غلاف جديد.' },
    ],
  },
  {
    prompt: 'في Tunnel Mode، إيه اللي بيظهر على الشبكة العامة؟',
    hint: 'افحص الـ outer header.',
    options: [
      { id: 'outer', label: 'New outer IP header', correct: true, detail: 'صح: العنوان الخارجي للـ gateway يظهر، والعنوان الأصلي جوه الجزء المحمي.' },
      { id: 'original', label: 'Original IP header', correct: false, detail: 'غلط: الترويسة الأصلية محمية جوه الحزمة.' },
    ],
  },
  {
    prompt: 'في Transport Mode، إيه الجزء اللي ما بيتحميش؟',
    hint: 'قارن حدود الحماية.',
    options: [
      { id: 'header', label: 'Original IP header', correct: true, detail: 'صح: الترويسة الأصلية تفضل ظاهرة؛ الحمولة بس اللي تت protect.' },
      { id: 'payload', label: 'Payload', correct: false, detail: 'غلط: الحمولة هي اللي بتتحمي في Transport Mode.' },
    ],
  },
]

export function VpnLabModesDiagram() {
  return <ScenarioLab title="LAB 2 - TUNNEL MODE vs TRANSPORT MODE" scenarios={labModeScenarios} ariaLabel="IPsec mode selection lab with interactive packet protection scenarios" />
}

const labTroubleScenarios: LabScenario[] = [
  {
    prompt: 'مفيش IKE SA خالص، والـ debug بيقول authentication failed. إيه أقرب سبب؟',
    hint: 'فحص هوية الـ peer.',
    options: [
      { id: 'psk', label: 'Incorrect PSK', correct: true, detail: 'صح: اختلاف الـ PSK بين الطرفين بيفشّل الـ peer authentication في IKE.' },
      { id: 'route', label: 'Missing route', correct: false, detail: 'غلط: الـ routing بيأثر بعد ما الـ SA يتعمل، مش في الـ authentication.' },
    ],
  },
  {
    prompt: 'الطرفين بيستخدموا خوارزميات مختلفة في IKE. إيه النتيجة المتوقعة؟',
    hint: 'الاتفاق على البارامترات.',
    options: [
      { id: 'mismatch', label: 'Mismatched IKE settings', correct: true, detail: 'صح: عدم توافق الخوارزميات يمنع إنشاء الـ IKE SA.' },
      { id: 'counters', label: 'Counters increase normally', correct: false, detail: 'غلط: قبل الاتفاق مفيش SA أصلاً، فمفيش عدادات شغالة.' },
    ],
  },
  {
    prompt: 'الـ IKE SA وIPsec SA موجودين، بس الترافيك مش بيوصل. إيه أول حاجة تراجعها؟',
    hint: 'إيه الشبكات اللي الـ tunnel بيحميها؟',
    options: [
      { id: 'net', label: 'Incorrect protected network', correct: true, detail: 'صح: لو تعريف الشبكة المحمية غلط، الترافيك ما بيدخلش الـ tunnel.' },
      { id: 'psk', label: 'Incorrect PSK', correct: false, detail: 'غلط: الـ SA اتعمل بالفعل، فالـ PSK على الأقل نجحت.' },
    ],
  },
  {
    prompt: 'الحزم بتدخل الـ tunnel بس مفيش رد من الطرف التاني. إيه السبب المحتمل؟',
    hint: 'فكر في الرجوع.',
    options: [
      { id: 'route', label: 'Missing return route', correct: true, detail: 'صح: لازم يبقى فيه route للشبكة البعيدة وreturn path سليم.' },
      { id: 'esp', label: 'ESP not configured', correct: false, detail: 'غلط: لو مفيش ESP ما كانش الـ IPsec SA اتعمل أصلاً.' },
    ],
  },
  {
    prompt: 'منفذ IKE مسدود على الـ firewall بين الـ peers. إيه اللي هيحصل؟',
    hint: 'أول مرحلة من التفاوض.',
    options: [
      { id: 'fw', label: 'IKE negotiation fails', correct: true, detail: 'صح: من غير وصول رسائل IKE ما بيحصلش تفاوض ولا SA.' },
      { id: 'nat', label: 'Traffic is encrypted twice', correct: false, detail: 'غلط: المشكلة في الوصول مش في التشفير المزدوج.' },
    ],
  },
  {
    prompt: 'الـ SA موجود وعدادات الـ encapsulation بتزيد، بس المستخدمين بيشتكوا من إن مفيش تطبيق شغال. إيه التفسير؟',
    hint: 'نجاح الـ tunnel مش معناه كل حاجة تمام.',
    options: [
      { id: 'sa-traffic', label: 'SA is up but application traffic still needs checking', correct: true, detail: 'صح: الـ SA الناجح مش دليل على وصول التطبيق؛ راجع الـ routing والـ ACLs والـ DNS والتطبيق نفسه.' },
      { id: 'no-sa', label: 'There is no SA at all', correct: false, detail: 'غلط: العدادات بتزيد يعني فيه SA شغال بالفعل.' },
    ],
  },
]

export function VpnLabTroubleshootDiagram() {
  return <ScenarioLab title="LAB 3 - IPSEC VPN TROUBLESHOOTING" scenarios={labTroubleScenarios} ariaLabel="IPsec VPN troubleshooting lab with interactive diagnosis and corrective decisions" />
}

const summaryStages = [
  'VPN يعني اتصال منطقي محمي فوق شبكة مشتركة غير موثوقة.',
  'Remote Access لمستخدم فردي، وSite-to-Site لربط شبكات عبر gateways.',
  'IPsec بيهدف لـ confidentiality وintegrity وorigin auth وanti-replay.',
  'ESP هو المعتاد للتشفير، وAH بيدي integrity من غير تشفير.',
  'IKE بيتفاوض ويتحقق من الـ peers وينشئ الـ SAs.',
  'Tunnel Mode يحمي الحزمة الأصلية كلها، وTransport Mode يحمي الحمولة بس.',
  'التشفير غير المصادقة: لازم نعرف مين الطرف التاني كمان.',
  'التحقق بيبدأ من IKE SA وبعدين IPsec SA وبعدين العدادات والـ routing.',
]

export function VpnSummaryDiagram() {
  const playback = useStepPlayback(summaryStages.length)
  const s = playback.stage
  return (
    <StepShell title="VPN CCNA REVISION MAP" playback={playback} legend={summaryStages[s]}>
      <StageBoard stages={['VPN idea','Two architectures','IPsec goals','AH vs ESP','IKE + SA','Modes','Crypto vs auth','Troubleshoot']} stage={s} ariaLabel="VPN CCNA revision map covering architectures IPsec modes authentication and troubleshooting" />
    </StepShell>
  )
}
