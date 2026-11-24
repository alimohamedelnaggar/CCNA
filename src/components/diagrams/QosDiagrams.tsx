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
    const timer = window.setInterval(() => setStage((current) => (current + 1) % length), 2300)
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
    <g opacity={active ? 1 : 0.42}>
      <rect x={x} y={y} width={w} height={h} rx="11" fill="#0b1224" stroke={color} strokeWidth={active ? 2.2 : 1.2} />
      <SvgText x={x + w / 2} y={y + 24} color={color} size={10} bold>{title}</SvgText>
      <SvgText x={x + w / 2} y={y + 43} color="#cbd5e1" size={8.5}>{sub}</SvgText>
    </g>
  )
}

function Badge({ x, y, text, color = '#38bdf8', active = true, w = 220 }: { x: number; y: number; text: string; color?: string; active?: boolean; w?: number }) {
  return (
    <g opacity={active ? 1 : 0.38}>
      <rect x={x} y={y} width={w} height={24} rx="7" fill="#0a1730" stroke={color} strokeWidth={active ? 1.8 : 1} />
      <SvgText x={x + w / 2} y={y + 16} color={color} size={8.2} bold>{text}</SvgText>
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
      transition={{ duration: 1.8, repeat: active ? Infinity : 0, ease: 'easeInOut' }}
    />
  )
}

function ClickNode({
  x, y, w, h, title, sub, color, selected, onClick,
}: {
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
      animate={{ opacity: selected ? 1 : 0.58 }}
      transition={{ duration: 0.25 }}
    >
      <rect x={x} y={y} width={w} height={h} rx="9" fill="#0b1224" stroke={selected ? '#f59e0b' : color} strokeWidth={selected ? 2.5 : 1.2} />
      {selected && <rect x={x - 3} y={y - 3} width={w + 6} height={h + 6} rx="11" fill="none" stroke="#f59e0b" strokeOpacity="0.35" strokeWidth="1.5" />}
      <SvgText x={x + w / 2} y={y + 24} color={selected ? '#fbbf24' : color} size={9} bold>{title}</SvgText>
      <SvgText x={x + w / 2} y={y + h - 10} color="#cbd5e1" size={7.5}>{sub}</SvgText>
    </motion.g>
  )
}

const fundamentalsStages = [
  'QoS يعني إدارة Traffic بشكل مختلف حسب أهميته وحساسيته، وليس معاملة كل الحزم بالتساوي.',
  'Voice وVideo حساسان للتأخير والتذبذب والفقد؛ تحميل الملفات يتحمل تأخيراً أكبر.',
  'عند الـ Congestion تزداد الطوابير ويزداد Latency وJitter وقد تضيع الحزم.',
  'QoS يقرر أي Traffic يُرسل أولاً وأي Traffic يُقيد أو يُؤخر عند ضيق الموارد.',
  'مهم: QoS لا يخلق Bandwidth إضافية؛ هو يدير الموارد الموجودة بشكل أفضل.',
]

export function QosFundamentalsDiagram() {
  const playback = useStepPlayback(fundamentalsStages.length)
  const s = playback.stage
  return (
    <StepShell title="QOS FUNDAMENTALS" playback={playback} legend={fundamentalsStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="QoS fundamentals comparing equal treatment with prioritized treatment">
        <Box x={60} y={60} w={250} h={80} title="Voice / Video" sub="Delay-sensitive" color="#f59e0b" active={s >= 1} />
        <Box x={60} y={160} w={250} h={80} title="Web / Data" sub="Browsing, downloads" color="#38bdf8" active={s >= 1} />
        <Box x={60} y={260} w={250} h={80} title="Management" sub="SNMP / Syslog" color="#a78bfa" active={s >= 1} />
        <Box x={370} y={150} w={180} h={100} title={s >= 3 ? 'QoS Policy' : 'Best Effort'} sub={s >= 3 ? 'Priority + limits' : 'All traffic equal'} color={s >= 3 ? '#34d399' : '#64748b'} active />
        <LinkLine x1={310} y1={100} x2={370} y2={180} color="#f59e0b" active={s >= 1} />
        <LinkLine x1={310} y1={200} x2={370} y2={200} color="#38bdf8" active={s >= 1} />
        <LinkLine x1={310} y1={300} x2={370} y2={220} color="#a78bfa" active={s >= 1} />
        <Box x={620} y={150} w={230} h={100} title="Output Interface" sub="Limited bandwidth" color="#38bdf8" active={s >= 2} />
        <LinkLine x1={550} y1={200} x2={620} y2={200} color="#f59e0b" active={s >= 2} />
        <FlowDot x1={310} y1={200} x2={620} y2={200} color="#f59e0b" active={s >= 3} />
        {s >= 4 && <Badge x={230} y={365} text="QoS manages resources — it does not create bandwidth" color="#34d399" active w={460} />}
      </svg>
    </StepShell>
  )
}

interface MetricInfo {
  id: string
  label: string
  definition: string
  impact: string
}

const metrics: MetricInfo[] = [
  { id: 'bandwidth', label: 'Bandwidth', definition: 'مقدار البيانات المنقولة خلال فترة زمنية، مثل bps أو Mbps.', impact: 'تؤثر بشكل أكبر على Downloads والنسخ الاحتياطي أكثر من تأثيرها على مكالمة صوتية صغيرة.' },
  { id: 'latency', label: 'Latency', definition: 'الوقت الذي تحتاجه الحزمة للوصول من Source إلى Destination.', impact: 'ارتفاعه يضر Voice وVideo التفاعلي؛ أقل أهمية لتحميل ملف كبير.' },
  { id: 'jitter', label: 'Jitter', definition: 'التغير في زمن الوصول بين حزمة وأخرى.', impact: 'يسبب تقطيعاً في الصوت والفيديو؛ يحتاج إلى معالجة خاصة.' },
  { id: 'loss', label: 'Packet Loss', definition: 'نسبة الحزم التي تضيع أثناء النقل.', impact: 'فقد بسيط قد لا يظهر في الملفات، لكنه واضح جداً في Voice وVideo.' },
]

export function QosMetricsDiagram() {
  const [selected, setSelected] = useState('latency')
  const metric = metrics.find((item) => item.id === selected) ?? metrics[1]
  const controls = <ChoiceButtons items={metrics.map((item) => ({ id: item.id, label: item.label }))} selected={selected} onSelect={setSelected} />
  const legend = `**${metric.label}** — ${metric.definition} ${metric.impact}`
  const levels = [3, 5, 7, 4]
  return (
    <ChoiceShell title="QOS PERFORMANCE METRICS" controls={controls} legend={legend}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Interactive QoS metrics impact comparison">
        {metrics.map((item, index) => {
          const y = 70 + index * 78
          const active = item.id === selected
          return (
            <g key={item.id} opacity={active ? 1 : 0.5}>
              <SvgText x={40} y={y + 22} color={active ? '#fbbf24' : '#cbd5e1'} size={10} bold anchor="start">{item.label}</SvgText>
              <rect x={210} y={y} width={560} height={30} rx="7" fill="#0b1224" stroke={active ? '#f59e0b' : '#1e3a5f'} />
              <rect x={210} y={y} width={levels[index] * 70} height={30} rx="7" fill={active ? '#f59e0b' : '#38bdf8'} opacity={active ? 0.85 : 0.35} />
              <SvgText x={830} y={y + 21} color={active ? '#fbbf24' : '#64748b'} size={8}>{item.id === 'bandwidth' ? 'Mbps' : item.id === 'loss' ? '%' : 'ms'}</SvgText>
            </g>
          )
        })}
        <Badge x={210} y={370} text="Voice + Video: jitter and loss matter most" color="#f59e0b" active w={470} />
      </svg>
    </ChoiceShell>
  )
}

const pipelineStages = [
  '1 — Traffic enters the network device on an incoming interface.',
  '2 — Classification identifies the traffic type using attributes or ACLs.',
  '3 — Marking writes priority information such as DSCP or CoS.',
  '4 — Queuing places packets into queues while waiting for transmission.',
  '5 — Scheduling decides which queue is served next.',
  '6 — Policing or Shaping controls the rate where configured.',
  '7 — Packets leave the outgoing interface.',
]

export function QosPipelineDiagram() {
  const playback = useStepPlayback(pipelineStages.length)
  const s = playback.stage
  const labels = ['Traffic enters', 'Classification', 'Marking', 'Queuing', 'Scheduling', 'Policing / Shaping', 'Outgoing interface']
  return (
    <StepShell title="QOS PROCESSING PIPELINE" playback={playback} legend={pipelineStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="General educational QoS processing pipeline">
        {labels.map((label, index) => {
          const x = 30 + (index % 4) * 225
          const y = index < 4 ? 90 : 250
          const active = s === index
          const done = s > index
          return (
            <g key={label}>
              <motion.g animate={{ opacity: active || done ? 1 : 0.35 }} transition={{ duration: 0.3 }}>
                <rect x={x} y={y} width={190} height={72} rx="9" fill="#0b1224" stroke={active ? '#f59e0b' : done ? '#34d399' : '#475569'} strokeWidth={active ? 2.4 : 1.2} />
                <SvgText x={x + 95} y={y + 28} color={active ? '#fbbf24' : done ? '#6ee7b7' : '#cbd5e1'} size={8.6} bold>{String(index + 1)}</SvgText>
                <SvgText x={x + 95} y={y + 50} color={active ? '#fbbf24' : '#cbd5e1'} size={8.4}>{label}</SvgText>
              </motion.g>
              {index === 3 && <LinkLine x1={x + 190} y1={y + 36} x2={30} y2={250 + 36} color="#475569" active={s > 3} />}
            </g>
          )
        })}
        <Badge x={180} y={370} text="General model — actual order and location vary by platform" color="#a78bfa" active w={540} />
      </svg>
    </StepShell>
  )
}

interface TrafficSample {
  id: string
  label: string
  attributes: string
  classified: string
  color: string
}

const trafficSamples: TrafficSample[] = [
  { id: 'voice', label: 'Voice RTP', attributes: 'UDP / RTP port range / EF mark', classified: 'Voice class → EF treatment', color: '#f59e0b' },
  { id: 'video', label: 'Video conf', attributes: 'UDP + known signaling / AF4x', classified: 'Video class → AF treatment', color: '#34d399' },
  { id: 'web', label: 'Web browse', attributes: 'TCP 80 / 443', classified: 'Best-effort data class', color: '#38bdf8' },
  { id: 'mgmt', label: 'SNMP', attributes: 'UDP 161 / management ACL', classified: 'Network management class', color: '#a78bfa' },
]

export function TrafficClassifierDiagram() {
  const [selected, setSelected] = useState('voice')
  const item = trafficSamples.find((entry) => entry.id === selected) ?? trafficSamples[0]
  const controls = <ChoiceButtons items={trafficSamples.map((entry) => ({ id: entry.id, label: entry.label }))} selected={selected} onSelect={setSelected} />
  const legend = `**${item.label}** — Attributes: \`${item.attributes}\`. النتيجة: ${item.classified}. التصنيف يستخدم Source/Destination IP وProtocol وPort وACLs وقد يستخدم تعريفاً بالتطبيق حسب المنصة.`
  return (
    <ChoiceShell title="INTERACTIVE TRAFFIC CLASSIFIER" controls={controls} legend={legend}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Interactive packet classification by attributes">
        <Box x={50} y={100} w={260} h={180} title="Packet Attributes" sub="L3 / L4 fields" color="#38bdf8" active />
        <SvgText x={180} y={180} color="#cbd5e1" size={8.4}>{item.attributes}</SvgText>
        <Box x={360} y={150} w={190} h={90} title="Classifier" sub="ACL / class-map" color="#f59e0b" active />
        <LinkLine x1={310} y1={190} x2={360} y2={190} color="#38bdf8" active />
        <Box x={610} y={150} w={260} h={90} title="Result" sub={item.classified} color={item.color} active />
        <LinkLine x1={550} y1={190} x2={610} y2={190} color="#f59e0b" active />
        <FlowDot x1={310} y1={190} x2={610} y2={190} color="#f59e0b" active />
        {trafficSamples.map((entry, index) => (
          <ClickNode key={entry.id} x={50 + index * 210} y={330} w={190} h={55} title={entry.label} sub="Select" color={entry.color} selected={selected === entry.id} onClick={() => setSelected(entry.id)} />
        ))}
      </svg>
    </ChoiceShell>
  )
}

const markingStages = [
  'Classification يحدد نوع الحزمة؛ Marking يكتب علامة داخل الحزمة نفسها.',
  'العلامة تسمح لأجهزة أخرى اتخاذ قرار QoS سريع دون إعادة تصنيف كاملة.',
  'Layer 2 Marking: حقل CoS داخل 802.1Q VLAN Tag.',
  'Layer 3 Marking: حقل DSCP داخل IP Header.',
  'Marking وحده لا يضمن أولوية؛ كل جهاز لازم يكون مُعدّاً للتعامل مع العلامة.',
]

export function PacketMarkingDiagram() {
  const playback = useStepPlayback(markingStages.length)
  const s = playback.stage
  return (
    <StepShell title="PACKET MARKING CONCEPT" playback={playback} legend={markingStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Classification versus marking with Layer 2 and Layer 3 locations">
        <Box x={60} y={170} w={200} h={90} title="Classify" sub="Identify traffic" color="#38bdf8" active />
        <Box x={330} y={170} w={200} h={90} title="Mark" sub="Write DSCP / CoS" color="#f59e0b" active={s >= 1} />
        <Box x={600} y={90} w={260} h={85} title="Layer 2 — CoS" sub="802.1Q VLAN tag · 3 bits" color="#a78bfa" active={s >= 2} />
        <Box x={600} y={205} w={260} h={85} title="Layer 3 — DSCP" sub="IP header · 6 bits" color="#34d399" active={s >= 3} />
        <LinkLine x1={260} y1={215} x2={330} y2={215} color="#f59e0b" active />
        <LinkLine x1={530} y1={200} x2={600} y2={132} color="#a78bfa" active={s >= 2} />
        <LinkLine x1={530} y1={230} x2={600} y2={247} color="#34d399" active={s >= 3} />
        {s >= 4 && <Badge x={200} y={345} text="Marking is a request for treatment — policy must be applied" color="#fb7185" active w={500} />}
      </svg>
    </StepShell>
  )
}

const dscpHeaderStages = [
  'DSCP يعني Differentiated Services Code Point ويوجد داخل IP Header.',
  'الحقل يتكون من 6 bits، لذلك قيمه من 0 إلى 63.',
  'القيمة تُرجم إلى Per-Hop Behavior مثل Default أو EF أو AF.',
  'العلامة تسافر مع الحزمة، لكن كل Router يطبق سياسته المحلية.',
]

export function DscpIpHeaderDiagram() {
  const playback = useStepPlayback(dscpHeaderStages.length)
  const s = playback.stage
  return (
    <StepShell title="DSCP IN THE IP HEADER" playback={playback} legend={dscpHeaderStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="DSCP six bit field inside IPv4 header">
        <SvgText x={460} y={60} color="#cbd5e1" size={11} bold>IPv4 Header — first bytes</SvgText>
        {['Version / IHL', 'TOS / DSCP', 'Total Length', 'Identification', 'Flags / Offset', 'TTL', 'Protocol', 'Checksum'].map((field, index) => {
          const x = 40 + index * 110
          const activeField = index === 1
          return (
            <g key={field}>
              <rect x={x} y={100} width={100} height={60} rx="7" fill={activeField && s >= 1 ? '#3b2f13' : '#0b1224'} stroke={activeField && s >= 1 ? '#f59e0b' : '#334155'} strokeWidth={activeField && s >= 1 ? 2.3 : 1} />
              <SvgText x={x + 50} y={137} color={activeField && s >= 1 ? '#fbbf24' : '#94a3b8'} size={7.4} bold>{field}</SvgText>
            </g>
          )
        })}
        <Box x={300} y={220} w={320} h={85} title="DSCP = 6 bits" sub="Values 0–63 · EF = 46" color="#34d399" active={s >= 1} />
        <LinkLine x1={150} y1={160} x2={460} y2={220} color="#f59e0b" active={s >= 1} />
        {s >= 2 && <Badge x={120} y={345} text="DSCP → PHB (Default / EF / AF)" color="#a78bfa" active w={330} />}
        {s >= 3 && <Badge x={470} y={345} text="Each hop applies local policy" color="#38bdf8" active w={340} />}
      </svg>
    </StepShell>
  )
}

const cosStages = [
  'CoS يعني Class of Service ويوجد في إطار Ethernet وليس في IP Header.',
  'يظهر داخل 802.1Q VLAN Tag في حقل PCP المكون من 3 bits.',
  'القيم من 0 إلى 7، وتُستخدم غالباً داخل Broadcast Domain.',
  'CoS يختلف عن DSCP؛ ترجمة العلامات بين L2 وL3 تعتمد على السياسة والمنصة.',
]

export function Cos8021qFieldDiagram() {
  const playback = useStepPlayback(cosStages.length)
  const s = playback.stage
  return (
    <StepShell title="CoS IN THE 802.1Q TAG" playback={playback} legend={cosStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="CoS three bit PCP field inside 802.1Q VLAN tag">
        <SvgText x={460} y={60} color="#cbd5e1" size={11} bold>Ethernet Frame with 802.1Q Tag</SvgText>
        {['Preamble', 'Dest MAC', 'Src MAC', '802.1Q Tag', 'EtherType', 'Payload', 'FCS'].map((field, index) => {
          const x = 25 + index * 125
          const activeField = index === 3
          return (
            <g key={field}>
              <rect x={x} y={100} width={115} height={60} rx="7" fill={activeField && s >= 1 ? '#3b2f13' : '#0b1224'} stroke={activeField && s >= 1 ? '#f59e0b' : '#334155'} strokeWidth={activeField && s >= 1 ? 2.3 : 1} />
              <SvgText x={x + 57} y={137} color={activeField && s >= 1 ? '#fbbf24' : '#94a3b8'} size={7.6} bold>{field}</SvgText>
            </g>
          )
        })}
        <Box x={280} y={220} w={360} h={85} title="PCP = 3 bits (CoS)" sub="Values 0–7 inside the VLAN tag" color="#a78bfa" active={s >= 1} />
        <LinkLine x1={420} y1={160} x2={460} y2={220} color="#f59e0b" active={s >= 1} />
        {s >= 2 && <Badge x={160} y={345} text="Layer 2 scope — VLAN-tagged frames" color="#38bdf8" active w={300} />}
        {s >= 3 && <Badge x={490} y={345} text="Different field from DSCP" color="#fb7185" active w={290} />}
      </svg>
    </StepShell>
  )
}

interface MarkingLayer {
  id: string
  label: string
  detail: string
}

const markingLayers: MarkingLayer[] = [
  { id: 'dscp', label: 'DSCP', detail: 'Layer 3 — 6-bit field in the IP Header; values 0–63; used across routed IP networks.' },
  { id: 'cos', label: 'CoS', detail: 'Layer 2 — 3-bit PCP field in the 802.1Q VLAN Tag; values 0–7; scoped to the tagged Ethernet frame.' },
]

export function DscpVsCosDiagram() {
  const [selected, setSelected] = useState('dscp')
  const item = markingLayers.find((entry) => entry.id === selected) ?? markingLayers[0]
  const controls = <ChoiceButtons items={markingLayers.map((entry) => ({ id: entry.id, label: entry.label }))} selected={selected} onSelect={setSelected} />
  return (
    <ChoiceShell title="DSCP vs CoS" controls={controls} legend={`**${item.label}** — ${item.detail}`}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="DSCP versus CoS comparison">
        <Box x={60} y={80} w={360} h={130} title="DSCP · Layer 3" sub="IP Header · 6 bits · 0–63" color="#34d399" active={selected === 'dscp'} />
        <Box x={500} y={80} w={360} h={130} title="CoS · Layer 2" sub="802.1Q tag · 3 bits · 0–7" color="#a78bfa" active={selected === 'cos'} />
        <Box x={60} y={250} w={360} h={100} title={selected === 'dscp' ? 'Routed IP networks' : 'Tagged Ethernet frames'} sub={selected === 'dscp' ? 'Survives routing hops' : 'May be rewritten at L3 boundaries'} color="#38bdf8" active />
        <Box x={500} y={250} w={360} h={100} title={selected === 'dscp' ? 'Example: EF = 46' : 'Example: voice often CoS 5'} sub="Common values — policy dependent" color="#f59e0b" active />
        <Badge x={230} y={380} text="Different fields — mapping between them is policy dependent" color="#f59e0b" active w={470} />
      </svg>
    </ChoiceShell>
  )
}

interface DscpValue {
  id: string
  label: string
  decimal: string
  binary: string
  meaning: string
  phb: string
}

const dscpValues: DscpValue[] = [
  { id: 'default', label: 'Default', decimal: '0', binary: '000000', meaning: 'Best Effort', phb: 'Default PHB' },
  { id: 'af11', label: 'AF11', decimal: '10', binary: '001010', meaning: 'Class 1 · low drop', phb: 'AF PHB' },
  { id: 'af43', label: 'AF43', decimal: '38', binary: '100110', meaning: 'Class 4 · high drop', phb: 'AF PHB' },
  { id: 'ef', label: 'EF', decimal: '46', binary: '101110', meaning: 'Commonly voice', phb: 'EF PHB' },
]

export function DscpExplorerDiagram() {
  const [selected, setSelected] = useState('ef')
  const item = dscpValues.find((entry) => entry.id === selected) ?? dscpValues[3]
  const controls = <ChoiceButtons items={dscpValues.map((entry) => ({ id: entry.id, label: entry.label }))} selected={selected} onSelect={setSelected} />
  const legend = `**${item.label}** — DSCP \`${item.decimal}\`; binary \`${item.binary}\`; ${item.meaning}; ${item.phb}. DSCP range is 0–63 (6 bits).`
  return (
    <ChoiceShell title="INTERACTIVE DSCP VALUE EXPLORER" controls={controls} legend={legend}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Interactive DSCP value explorer with binary encoding">
        <SvgText x={460} y={55} color="#cbd5e1" size={11} bold>6-bit DSCP field</SvgText>
        {item.binary.split('').map((bit, index) => (
          <g key={index}>
            <rect x={250 + index * 62} y={90} width={50} height={60} rx="8" fill={bit === '1' ? '#3b2f13' : '#0b1224'} stroke={bit === '1' ? '#f59e0b' : '#334155'} strokeWidth={bit === '1' ? 2.2 : 1} />
            <SvgText x={275 + index * 62} y={128} color={bit === '1' ? '#fbbf24' : '#64748b'} size={16} bold>{bit}</SvgText>
          </g>
        ))}
        <Box x={120} y={205} w={300} h={100} title={item.label} sub={`Decimal ${item.decimal}`} color="#34d399" active />
        <Box x={500} y={205} w={300} h={100} title={item.phb} sub={item.meaning} color="#a78bfa" active />
        <Badge x={220} y={355} text="EF = 46 · Default = 0 · AF classes 1–4" color="#38bdf8" active w={480} />
      </svg>
    </ChoiceShell>
  )
}

const afClasses = [
  { id: 'AF11', d: '10', cls: 1, drop: 1 },
  { id: 'AF12', d: '12', cls: 1, drop: 2 },
  { id: 'AF13', d: '14', cls: 1, drop: 3 },
  { id: 'AF21', d: '18', cls: 2, drop: 1 },
  { id: 'AF22', d: '20', cls: 2, drop: 2 },
  { id: 'AF23', d: '22', cls: 2, drop: 3 },
  { id: 'AF31', d: '26', cls: 3, drop: 1 },
  { id: 'AF32', d: '28', cls: 3, drop: 2 },
  { id: 'AF33', d: '30', cls: 3, drop: 3 },
  { id: 'AF41', d: '34', cls: 4, drop: 1 },
  { id: 'AF42', d: '36', cls: 4, drop: 2 },
  { id: 'AF43', d: '38', cls: 4, drop: 3 },
]

export function AfDropPrecedenceDiagram() {
  const [selected, setSelected] = useState('AF11')
  const item = afClasses.find((entry) => entry.id === selected) ?? afClasses[0]
  const controls = <ChoiceButtons items={['AF11','AF12','AF13','AF21','AF22','AF23','AF31','AF32','AF33','AF41','AF42','AF43'].map((label) => ({ id: label, label }))} selected={selected} onSelect={setSelected} />
  const legend = `**${item.id}** = DSCP \`${item.d}\`: AF class **${item.cls}**, drop precedence **${item.drop}**. رقم الـ Class الأكبر لا يعني أولوية مطلقة تلقائياً؛ التفسير يعتمد على سياسة QoS.`
  return (
    <ChoiceShell title="AF CLASS AND DROP PRECEDENCE" controls={controls} legend={legend}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Assured Forwarding class and drop precedence matrix">
        <SvgText x={460} y={45} color="#cbd5e1" size={10} bold>AF classes 1–4 × drop precedence 1–3</SvgText>
        {afClasses.map((entry, index) => {
          const col = Math.floor(index / 3)
          const row = index % 3
          const x = 50 + col * 215
          const y = 80 + row * 85
          const active = entry.id === selected
          return (
            <ClickNode key={entry.id} x={x} y={y} w={190} h={68} title={`${entry.id} (${entry.d})`} sub={`class ${entry.cls} · drop ${entry.drop}`} color={active ? '#f59e0b' : '#38bdf8'} selected={active} onClick={() => setSelected(entry.id)} />
          )
        })}
        <Badge x={210} y={365} text="Drop precedence guides which packets are dropped first" color="#a78bfa" active w={500} />
      </svg>
    </ChoiceShell>
  )
}

interface CongestionLevel {
  id: string
  label: string
  ratio: string
  effect: string
  color: string
}

const congestionLevels: CongestionLevel[] = [
  { id: 'low', label: 'Low load', ratio: '50 Mbps / 100 Mbps', effect: 'No queue buildup; low latency and negligible loss.', color: '#34d399' },
  { id: 'near', label: 'Near capacity', ratio: '95 Mbps / 100 Mbps', effect: 'Queue starts to grow; jitter increases for all traffic.', color: '#f59e0b' },
  { id: 'over', label: 'Congested', ratio: '130 Mbps / 100 Mbps', effect: 'Queue saturates; delay spikes and packets are dropped.', color: '#fb7185' },
]

export function CongestionSimulationDiagram() {
  const [selected, setSelected] = useState('near')
  const item = congestionLevels.find((entry) => entry.id === selected) ?? congestionLevels[1]
  const controls = <ChoiceButtons items={congestionLevels.map((entry) => ({ id: entry.id, label: entry.label }))} selected={selected} onSelect={setSelected} />
  return (
    <ChoiceShell title="CONGESTION SIMULATION" controls={controls} legend={`**${item.label}** — \`${item.ratio}\`. ${item.effect}`}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Interface congestion simulation with queue growth">
        <Box x={60} y={120} w={210} h={90} title="Traffic in" sub={item.ratio.split(' / ')[0]} color="#38bdf8" active />
        <Box x={650} y={120} w={210} h={90} title="Interface" sub={item.ratio.split(' / ')[1]} color="#34d399" active />
        <LinkLine x1={270} y1={165} x2={650} y2={165} color="#f59e0b" active />
        <FlowDot x1={270} y1={165} x2={650} y2={165} color="#f59e0b" active={selected !== 'low'} />
        <SvgText x={460} y={95} color={item.color} size={11} bold>{item.label}</SvgText>
        <rect x={330} y={230} width={260} height={70} rx="9" fill="#0b1224" stroke={item.color} strokeWidth={selected === 'over' ? 2.4 : 1.4} />
        {Array.from({ length: 8 }, (_, index) => (
          <rect key={index} x={345 + index * 30} y={248} width={22} height={34} rx="4" fill={item.color} opacity={index < (selected === 'low' ? 1 : selected === 'near' ? 4 : 8) ? 0.95 : 0.15} />
        ))}
        <SvgText x={460} y={330} color={item.color} size={9} bold>{selected === 'low' ? 'Queue almost empty' : selected === 'near' ? 'Queue building · jitter rising' : 'Queue full · drops occur'}</SvgText>
      </svg>
    </ChoiceShell>
  )
}

const fifoStages = [
  'FIFO = First In, First Out: الحزم تخرج بنفس ترتيب وصولها.',
  'لا يوجد تمييز بين Voice وData؛ كل الحزم في طابور واحد.',
  'عند الـ Congestion تنتظر حزمة Voice خلف ملف كبير.',
  'النتيجة: Latency وJitter مرتفعان للتطبيقات الحساسة.',
]

export function FifoQueueDiagram() {
  const playback = useStepPlayback(fifoStages.length)
  const s = playback.stage
  const packets = ['DATA', 'VOICE', 'DATA', 'VOICE']
  return (
    <StepShell title="FIFO QUEUE" playback={playback} legend={fifoStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="FIFO queue showing packets leaving in arrival order">
        <Box x={60} y={170} w={170} h={90} title="Incoming" sub="Mixed packets" color="#38bdf8" active />
        <rect x={280} y={150} width={360} height={120} rx="10" fill="#0b1224" stroke="#475569" />
        <SvgText x={460} y={135} color="#cbd5e1" size={10} bold>Single FIFO queue</SvgText>
        {packets.map((label, index) => (
          <motion.g key={index} animate={{ opacity: s >= 2 && index === 1 ? 0.45 : 1 }} transition={{ duration: 0.3 }}>
            <rect x={300 + index * 85} y={185} width={72} height={52} rx="7" fill={label === 'VOICE' ? '#3b2f13' : '#0f2338'} stroke={label === 'VOICE' ? '#f59e0b' : '#38bdf8'} />
            <SvgText x={336 + index * 85} y={217} color={label === 'VOICE' ? '#fbbf24' : '#7dd3fc'} size={8} bold>{label}</SvgText>
          </motion.g>
        ))}
        <Box x={700} y={170} w={170} h={90} title="Output" sub="Arrival order" color="#34d399" active />
        <LinkLine x1={640} y1={210} x2={700} y2={210} color="#34d399" active />
        <FlowDot x1={230} y1={210} x2={700} y2={210} color="#f59e0b" active={s >= 2} />
        {s >= 3 && <Badge x={230} y={345} text="Voice waits behind data → jitter and delay" color="#fb7185" active w={460} />}
      </svg>
    </StepShell>
  )
}

const priorityStages = [
  'Priority Queuing يضع بعض الفئات في طابور له أولوية أعلى.',
  'عند الإرسال تُخدم الحزمة من الطابور ذي الأولوية أولاً.',
  'Voice يمكن أن يتجاوز البيانات العادية لتقليل Latency وJitter.',
  'لازم وجود حدود وحماية؛ وإلا قد تتجوّع بقية الفئات (Starvation).',
]

export function PriorityQueueDiagram() {
  const playback = useStepPlayback(priorityStages.length)
  const s = playback.stage
  return (
    <StepShell title="PRIORITY QUEUE" playback={playback} legend={priorityStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Priority queue serving voice before data">
        <Box x={60} y={90} w={200} h={85} title="Priority Queue" sub="VOICE · EF" color="#f59e0b" active={s >= 1} />
        <Box x={60} y={230} w={200} h={85} title="Normal Queue" sub="DATA · default" color="#38bdf8" active={s >= 1} />
        <Box x={400} y={155} w={180} h={90} title="Scheduler" sub="Serve highest first" color="#a78bfa" active={s >= 1} />
        <Box x={700} y={155} w={170} h={90} title="Output" sub="Link" color="#34d399" active />
        <LinkLine x1={260} y1={132} x2={400} y2={180} color="#f59e0b" active={s >= 1} />
        <LinkLine x1={260} y1={272} x2={400} y2={220} color="#38bdf8" active={s >= 1} />
        <LinkLine x1={580} y1={200} x2={700} y2={200} color="#34d399" active />
        {s >= 2 && <FlowDot x1={260} y1={132} x2={700} y2={200} color="#f59e0b" active />}
        {s >= 3 && <Badge x={200} y={365} text="Limit the priority queue to avoid starving other classes" color="#fb7185" active w={510} />}
      </svg>
    </StepShell>
  )
}

interface QueuingMode {
  id: string
  label: string
  detail: string
}

const queuingModes: QueuingMode[] = [
  { id: 'wfq', label: 'WFQ', detail: 'Weighted Fair Queuing يوزّع زمن الإرسال بين Flows حسب أوزان، ويمنع تدفقاً واحداً من الاستيلاء على الرابط.' },
  { id: 'llq', label: 'LLQ', detail: 'Low Latency Queuing يوفر طابور أولوية للتطبيقات الحساسة مع حدود تمنع Starvation لباقي الفئات.' },
]

export function WfqLlqDiagram() {
  const [selected, setSelected] = useState('llq')
  const item = queuingModes.find((entry) => entry.id === selected) ?? queuingModes[1]
  const controls = <ChoiceButtons items={queuingModes.map((entry) => ({ id: entry.id, label: entry.label }))} selected={selected} onSelect={setSelected} />
  return (
    <ChoiceShell title="WFQ AND LLQ" controls={controls} legend={`**${item.label}** — ${item.detail} الأسماء والآليات المتاحة تختلف حسب Cisco Platform.`}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Weighted fair queuing versus low latency queuing">
        <Box x={70} y={100} w={350} h={200} title="WFQ" sub="Weighted flows" color="#38bdf8" active={selected === 'wfq'} />
        <Box x={500} y={100} w={350} h={200} title="LLQ" sub="Priority + limit" color="#f59e0b" active={selected === 'llq'} />
        {[1,2,3].map((row) => (
          <g key={row}>
            <rect x={110} y={150 + row * 40} width={270} height={24} rx="5" fill="#0f2338" stroke="#38bdf8" opacity={selected === 'wfq' ? 0.9 : 0.35} />
            <SvgText x={245} y={167 + row * 40} color="#7dd3fc" size={7.5}>{`Flow ${row} · weight ${row}`}</SvgText>
          </g>
        ))}
        {[1,2].map((row) => (
          <g key={row}>
            <rect x={540} y={150 + row * 45} width={270} height={24} rx="5" fill={row === 1 ? '#3b2f13' : '#0f2338'} stroke={row === 1 ? '#f59e0b' : '#38bdf8'} opacity={selected === 'llq' ? 0.95 : 0.35} />
            <SvgText x={675} y={167 + row * 45} color={row === 1 ? '#fbbf24' : '#7dd3fc'} size={7.5}>{row === 1 ? 'Priority: voice' : 'Other classes'}</SvgText>
          </g>
        ))}
        <Badge x={230} y={355} text="LLQ needs a bound to protect other traffic" color="#a78bfa" active w={460} />
      </svg>
    </ChoiceShell>
  )
}

interface PoliceAction {
  id: string
  label: string
  result: string
  detail: string
  color: string
}

const policeActions: PoliceAction[] = [
  { id: 'conform', label: 'Conforming', result: 'Forward', detail: 'الحزمة داخل المعدل المسموح CIR؛ تُمرّر كما هي.', color: '#34d399' },
  { id: 'drop', label: 'Exceed → Drop', result: 'Drop', detail: 'الحزمة فوق المعدل؛ Policing عادةً يسقطها فوراً دون تخزين.', color: '#fb7185' },
  { id: 'remark', label: 'Exceed → Remark', result: 'Remark', detail: 'بدلاً من الإسقاط يمكن إعادة تعليم الحزمة إلى فئة أقل حسب السياسة.', color: '#f59e0b' },
]

export function PolicingSimulationDiagram() {
  const [selected, setSelected] = useState('drop')
  const item = policeActions.find((entry) => entry.id === selected) ?? policeActions[1]
  const controls = <ChoiceButtons items={policeActions.map((entry) => ({ id: entry.id, label: entry.label }))} selected={selected} onSelect={setSelected} />
  return (
    <ChoiceShell title="TRAFFIC POLICING SIMULATION" controls={controls} legend={`**${item.label}** → \`${item.result}\`. ${item.detail}`}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Policing conform exceed drop and remark simulation">
        <Box x={60} y={160} w={190} h={90} title="Traffic" sub="Rate measured" color="#38bdf8" active />
        <Box x={350} y={160} w={200} h={90} title="Policer" sub="CIR comparison" color="#f59e0b" active />
        <Box x={680} y={160} w={180} h={90} title={item.result} sub="Action taken" color={item.color} active />
        <LinkLine x1={250} y1={205} x2={350} y2={205} color="#38bdf8" active />
        <LinkLine x1={550} y1={205} x2={680} y2={205} color={item.color} active />
        <FlowDot x1={250} y1={205} x2={680} y2={205} color={item.color} active />
        <Badge x={210} y={320} text="No buffering-based delay — action is immediate" color={item.color} active w={490} />
      </svg>
    </ChoiceShell>
  )
}

interface ShapingState {
  id: string
  label: string
  detail: string
}

const shapingStates: ShapingState[] = [
  { id: 'burst', label: 'Burst arrives', detail: 'حزم كثيرة تصل دفعة واحدة أسرع من معدل الإرسال المسموح.' },
  { id: 'buffer', label: 'Buffered', detail: 'Shaping يخزّن الحزم مؤقتاً في Buffer بدلاً من إسقاطها فوراً.' },
  { id: 'smooth', label: 'Smoothed output', detail: 'الحزم تُرسل بمعدل منتظم؛ النتيجة تأخير أقل حدة من الإسقاط.' },
  { id: 'overflow', label: 'Buffer overflow', detail: 'إذا امتلأ الـ Buffer قد تُسقط الحزم رغم Shaping.' },
]

export function ShapingSimulationDiagram() {
  const [selected, setSelected] = useState('buffer')
  const item = shapingStates.find((entry) => entry.id === selected) ?? shapingStates[1]
  const controls = <ChoiceButtons items={shapingStates.map((entry) => ({ id: entry.id, label: entry.label }))} selected={selected} onSelect={setSelected} />
  return (
    <ChoiceShell title="TRAFFIC SHAPING SIMULATION" controls={controls} legend={`**${item.label}** — ${item.detail}`}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Traffic shaping buffering and smoothing bursts">
        <Box x={60} y={160} w={180} h={90} title="Burst in" sub="Irregular arrivals" color="#38bdf8" active />
        <rect x={300} y={130} width={260} height={150} rx="10" fill="#0b1224" stroke={selected === 'overflow' ? '#fb7185' : '#f59e0b'} strokeWidth={selected === 'overflow' ? 2.4 : 1.5} />
        <SvgText x={430} y={160} color="#fbbf24" size={10} bold>Shaping Buffer</SvgText>
        {Array.from({ length: 6 }, (_, index) => (
          <rect key={index} x={325 + index * 38} y={190} width={28} height={55} rx="5" fill={selected === 'burst' || selected === 'buffer' || selected === 'overflow' ? '#f59e0b' : '#34d399'} opacity={index < (selected === 'burst' ? 2 : selected === 'overflow' ? 6 : 4) ? 0.95 : 0.15} />
        ))}
        <Box x={640} y={160} w={210} h={90} title="Smooth output" sub="Regulated rate" color="#34d399" active={selected === 'smooth'} />
        <LinkLine x1={240} y1={205} x2={300} y2={205} color="#38bdf8" active />
        <LinkLine x1={560} y1={205} x2={640} y2={205} color="#34d399" active={selected === 'smooth'} />
        {selected === 'smooth' && <FlowDot x1={240} y1={205} x2={640} y2={205} color="#34d399" active />}
      </svg>
    </ChoiceShell>
  )
}

interface ControlMode {
  id: string
  label: string
  detail: string
}

const controlModes: ControlMode[] = [
  { id: 'police', label: 'Policing', detail: 'يقيس المعدل ويتخذ إجراءً فورياً غالباً Drop أو Remark؛ عادةً بدون Buffer.' },
  { id: 'shape', label: 'Shaping', detail: 'يخزّن ويؤخر الحزم لتنعيم الـ Bursts؛ قد تُسقط الحزم عند امتلاء الـ Buffer.' },
]

export function PolicingVsShapingDiagram() {
  const [selected, setSelected] = useState('police')
  const item = controlModes.find((entry) => entry.id === selected) ?? controlModes[0]
  const controls = <ChoiceButtons items={controlModes.map((entry) => ({ id: entry.id, label: entry.label }))} selected={selected} onSelect={setSelected} />
  return (
    <ChoiceShell title="POLICING vs SHAPING" controls={controls} legend={`**${item.label}** — ${item.detail} كلاهما يتحكم في المعدل، لكن التخزين والتأخير مختلفان.`}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Policing versus shaping side by side comparison">
        <Box x={60} y={90} w={370} h={230} title="POLICING" sub="Measure → immediate action" color="#fb7185" active={selected === 'police'} />
        <Box x={490} y={90} w={370} h={230} title="SHAPING" sub="Buffer → delay → smooth" color="#34d399" active={selected === 'shape'} />
        <SvgText x={245} y={190} color="#cbd5e1" size={8.6}>Rate control: yes</SvgText>
        <SvgText x={245} y={225} color="#cbd5e1" size={8.6}>Buffering: usually no</SvgText>
        <SvgText x={245} y={260} color="#cbd5e1" size={8.6}>Drops: can drop</SvgText>
        <SvgText x={675} y={190} color="#cbd5e1" size={8.6}>Rate control: yes</SvgText>
        <SvgText x={675} y={225} color="#cbd5e1" size={8.6}>Buffering: yes</SvgText>
        <SvgText x={675} y={260} color="#cbd5e1" size={8.6}>Drops: if buffer overflows</SvgText>
        <Badge x={230} y={365} text="Policing enforces · Shaping smooths" color="#a78bfa" active w={460} />
      </svg>
    </ChoiceShell>
  )
}

const phbStages = [
  'PHB = Per-Hop Behavior: معالجة الحزمة في كل جهاز على حدة بناءً على العلامة والسياسة المحلية.',
  'Default PHB يعامل الحزم كـ Best Effort، وغالباً يرتبط بـ DSCP 0.',
  'EF PHB يُستخدم عادةً لـ DSCP 46 ويوفر معالجة ذات أولوية منخفضة التأخير.',
  'AF PHB يوفر فئات ومستويات إسقاط مختلفة؛ التفسير يعتمد على السياسة.',
  'نفس DSCP عبر عدة Routers لا يفرض سلوكاً موحداً؛ كل Hop لازم يطبق Policy مناسبة.',
]

export function PerHopBehaviorDiagram() {
  const playback = useStepPlayback(phbStages.length)
  const s = playback.stage
  return (
    <StepShell title="PER-HOP BEHAVIOR (PHB)" playback={playback} legend={phbStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Per-hop behavior applied at each router based on DSCP">
        <Box x={50} y={160} w={160} h={90} title="Packet" sub="DSCP 46 (EF)" color="#f59e0b" active />
        {[0,1,2].map((index) => (
          <g key={index}>
            <Box x={270 + index * 210} y={160} w={150} h={90} title={`Router ${index + 1}`} sub={index === 0 ? 'Local policy' : index === 1 ? 'Local policy' : 'Local policy'} color="#38bdf8" active={s >= index + 1} />
            <LinkLine x1={210 + index * 210} y1={205} x2={270 + index * 210} y2={205} color="#f59e0b" active={s >= index} />
            {s === index + 1 && <FlowDot x1={210 + index * 210} y1={205} x2={420 + index * 210} y2={205} color="#f59e0b" active />}
          </g>
        ))}
        <Box x={750} y={160} w={140} h={90} title="Destination" sub="End host" color="#34d399" active={s >= 4} />
        <LinkLine x1={690} y1={205} x2={750} y2={205} color="#34d399" active={s >= 4} />
        {s >= 4 && <Badge x={170} y={330} text="DSCP is preserved — treatment is decided per hop" color="#a78bfa" active w={560} />}
      </svg>
    </StepShell>
  )
}

const endToEndStages = [
  'Host يرسل حزمة Voice بعلامة DSCP 46 (EF) ويتصفح عبر الشبكة.',
  'الراوتر الأول يصنّف ويطبّق Policy محلية ويرسل الحزمة.',
  'الراوتر الثاني يقرأ نفس العلامة ويطبّق سياسته هو أيضاً.',
  'الراوتر الثالث قد يطبّق Policing أو Shaping حسب سياسة الحافة.',
  'الوجهة تستقبل الحزمة؛ جودة المسار تعتمد على كل Hop وليس على العلامة وحدها.',
]

export function EndToEndQosDiagram() {
  const playback = useStepPlayback(endToEndStages.length)
  const s = playback.stage
  return (
    <StepShell title="END-TO-END QoS JOURNEY" playback={playback} legend={endToEndStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="End to end QoS packet journey across multiple routers">
        <Box x={40} y={160} w={150} h={90} title="Voice host" sub="DSCP 46 EF" color="#f59e0b" active />
        {[0,1,2].map((index) => (
          <g key={index}>
            <Box x={240 + index * 200} y={160} w={150} h={90} title={`R${index + 1}`} sub={index === 2 ? 'Policing / Shaping' : 'Class + queue'} color="#38bdf8" active={s >= index + 1} />
            <LinkLine x1={190 + index * 200} y1={205} x2={240 + index * 200} y2={205} color="#f59e0b" active={s >= index} />
          </g>
        ))}
        <Box x={780} y={160} w={120} h={90} title="Receiver" sub="Remote host" color="#34d399" active={s >= 4} />
        <LinkLine x1={740} y1={205} x2={780} y2={205} color="#34d399" active={s >= 4} />
        {s >= 1 && s <= 3 && <FlowDot x1={190 + (s - 1) * 200} y1={205} x2={390 + (s - 1) * 200} y2={205} color="#f59e0b" active />}
        <Badge x={180} y={330} text="Every hop must honor the marking for consistent treatment" color="#a78bfa" active w={560} />
      </svg>
    </StepShell>
  )
}

interface QosIssue {
  id: string
  label: string
  detail: string
}

const qosIssues: QosIssue[] = [
  { id: 'noclass', label: 'No matches', detail: 'لا توجد Packet Matches؛ راجع الـ ACL والـ class-map وتأكد من أن الترافيك يمر عبر الواجهة الصحيحة.' },
  { id: 'wrongmark', label: 'Wrong marking', detail: 'العلامة ليست كما تتوقع؛ راجع سياسة Marking وأين تُطبّق، وتأكد من ضبط Trust بشكل صحيح.' },
  { id: 'drops', label: 'Unexpected drops', detail: 'Drops مرتفعة؛ راجع Policing والـ Buffer والـ Queue limits وعدّل السياسة أو المعدل.' },
  { id: 'counters', label: 'No counters', detail: 'عدّامات Policy لا تظهر؛ قد يكون السبب Platform أو Hardware أو نوع QoS Configuration.' },
  { id: 'starve', label: 'Starvation', detail: 'فئات أخرى لا تُرسل؛ قلّل حدّ الطابور ذي الأولوية وتحقق من إعدادات LLQ.' },
  { id: 'nohonor', label: 'Marking ignored', detail: 'العلامة موجودة لكن المعالجة لا تختلف؛ تأكد أن كل Hop يطبّق Policy مناسبة.' },
]

export function QosTroubleshootingFlowDiagram() {
  const [selected, setSelected] = useState('noclass')
  const item = qosIssues.find((entry) => entry.id === selected) ?? qosIssues[0]
  const controls = <ChoiceButtons items={qosIssues.map((entry) => ({ id: entry.id, label: entry.label }))} selected={selected} onSelect={setSelected} />
  return (
    <ChoiceShell title="QOS TROUBLESHOOTING FLOW" controls={controls} legend={item.detail}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Interactive QoS troubleshooting decision flow">
        <Box x={340} y={20} w={240} h={60} title="QoS Not Working" sub="Start here" color="#f59e0b" active />
        <LinkLine x1={460} y1={80} x2={460} y2={118} color="#f59e0b" active />
        <LinkLine x1={110} y1={118} x2={810} y2={118} color="#475569" active />
        {qosIssues.map((entry, index) => {
          const x = 15 + (index % 3) * 300
          const y = 150 + Math.floor(index / 3) * 125
          const cx = x + 100
          return (
            <g key={entry.id}>
              <LinkLine x1={cx} y1={118} x2={cx} y2={y} color={selected === entry.id ? '#f59e0b' : '#475569'} active={selected === entry.id} />
              <ClickNode x={x} y={y} w={200} h={85} title={entry.label} sub="Check" color="#38bdf8" selected={selected === entry.id} onClick={() => setSelected(entry.id)} />
            </g>
          )
        })}
      </svg>
    </ChoiceShell>
  )
}
