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
  x,
  y,
  w,
  h,
  title,
  sub,
  color,
  selected,
  onClick,
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

const architectureStages = [
  'Syslog يوفّر طريقة قياسية لتسجيل الأحداث وإرسالها من الأجهزة إلى خادم مركزي.',
  'Syslog Client/Sender: الجهاز الذي يولّد الرسائل مثل router أو switch أو firewall.',
  'Syslog Message: حدث نصي يحملtimestamp وhostname وPRI ومحتوى الرسالة.',
  'Syslog Server/Receiver يستقبل الرسائل ويخزنها في Log Storage.',
  'Log Analysis والمonitoring Dashboard يحوّلان الرسائل إلى تنبيهات وتقارير وتتبع زمني.',
]

export function SyslogArchitectureDiagram() {
  const playback = useStepPlayback(architectureStages.length)
  const s = playback.stage
  return (
    <StepShell title="SYSLOG ARCHITECTURE" playback={playback} legend={architectureStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Syslog sender receiver storage and analysis architecture">
        <Box x={60} y={165} w={190} h={90} title="Sender" sub="Router / Switch" color="#38bdf8" active={s >= 1} />
        <Box x={330} y={165} w={190} h={90} title="Message" sub="PRI + time + text" color="#a78bfa" active={s >= 2} />
        <Box x={600} y={165} w={190} h={90} title="Receiver" sub="Syslog Server" color="#34d399" active={s >= 3} />
        <LinkLine x1={250} y1={210} x2={330} y2={210} color="#38bdf8" active={s >= 1} />
        <LinkLine x1={520} y1={210} x2={600} y2={210} color="#34d399" active={s >= 2} />
        <FlowDot x1={250} y1={210} x2={330} y2={210} color="#38bdf8" active={s === 1} />
        <FlowDot x1={520} y1={210} x2={600} y2={210} color="#a78bfa" active={s === 2} />
        <LinkLine x1={695} y1={255} x2={695} y2={315} color="#34d399" active={s >= 3} />
        <Box x={560} y={315} w={270} h={70} title="Log Storage" sub="Centralized retention" color="#34d399" active={s >= 3} />
        {s >= 4 && <Badge x={220} y={350} text="Analysis → Dashboard / Alerts" color="#f59e0b" active w={300} />}
      </svg>
    </StepShell>
  )
}

interface DestinationInfo {
  id: string
  label: string
  where: string
  purpose: string
  note: string
}

const destinations: DestinationInfo[] = [
  { id: 'console', label: 'Console', where: 'Physical console display', purpose: 'Immediate operator output during direct console access.', note: 'Usually not retained after the console scrolls unless captured externally.' },
  { id: 'buffered', label: 'Buffered', where: 'Device RAM buffer', purpose: 'Local review of recent events with `show logging`.', note: 'Volatile: normally lost after reload; size and severity threshold are configurable.' },
  { id: 'terminal', label: 'Terminal / Monitor', where: 'Current VTY terminal session', purpose: 'Live messages while connected remotely.', note: 'Usually needs `terminal monitor` in addition to `logging monitor`.' },
  { id: 'remote', label: 'Remote Syslog Server', where: 'External server disk/database', purpose: 'Centralized long-term storage, correlation and analysis.', note: 'Depends on IP connectivity and server-side configuration.' },
]

export function LocalVsRemoteLoggingDiagram() {
  const [selected, setSelected] = useState('buffered')
  const item = destinations.find((entry) => entry.id === selected) ?? destinations[0]
  const controls = <ChoiceButtons items={destinations.map((entry) => ({ id: entry.id, label: entry.label }))} selected={selected} onSelect={setSelected} />
  const legend = `**${item.label}** — المكان: \`${item.where}\`; الهدف: ${item.purpose} ${item.note}`
  return (
    <ChoiceShell title="LOCAL vs REMOTE LOGGING" controls={controls} legend={legend}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Local console buffered terminal and remote syslog destinations">
        <Box x={70} y={150} w={200} h={100} title="Device" sub="Generates event" color="#38bdf8" active />
        {destinations.map((entry, index) => {
          const x = 340 + (index % 2) * 260
          const y = 80 + Math.floor(index / 2) * 180
          return (
            <ClickNode
              key={entry.id}
              x={x}
              y={y}
              w={230}
              h={100}
              title={entry.label}
              sub={entry.id === 'remote' ? 'External server' : 'On device'}
              color={index === 3 ? '#34d399' : '#a78bfa'}
              selected={selected === entry.id}
              onClick={() => setSelected(entry.id)}
            />
          )
        })}
        <LinkLine x1={270} y1={200} x2={340} y2={130} color="#38bdf8" active />
        <LinkLine x1={270} y1={200} x2={340} y2={310} color="#38bdf8" active />
        <LinkLine x1={270} y1={200} x2={600} y2={130} color="#a78bfa" active />
        <LinkLine x1={270} y1={200} x2={600} y2={310} color="#34d399" active />
      </svg>
    </ChoiceShell>
  )
}

const messageFlowStages = [
  'Router يكتشف event مثل link down أو configuration change.',
  'Router يبني Syslog message ويرسلها عبر Network/Switch.',
  'Syslog Server يستقبل الرسالة على UDP 514 في الاستخدام التقليدي الشائع.',
  'Server يخزّن الرسالة في Centralized Log Storage.',
  'Monitoring Dashboard يقرأ الرسائل ويعرضها للـ analysis والتنبيهات.',
]

export function SyslogMessageFlowDiagram() {
  const playback = useStepPlayback(messageFlowStages.length)
  const s = playback.stage
  return (
    <StepShell title="SYSLOG MESSAGE FLOW" playback={playback} legend={messageFlowStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Syslog message flow from router through switch to server and dashboard">
        <Box x={40} y={165} w={150} h={90} title="Router" sub="Event source" color="#38bdf8" active />
        <Box x={250} y={165} w={150} h={90} title="Switch" sub="Network path" color="#64748b" active={s >= 1} />
        <Box x={460} y={165} w={180} h={90} title="Syslog Server" sub="Receiver" color="#34d399" active={s >= 2} />
        <Box x={710} y={165} w={170} h={90} title="Dashboard" sub="Analysis" color="#f59e0b" active={s >= 4} />
        <LinkLine x1={190} y1={210} x2={250} y2={210} color="#38bdf8" active={s >= 1} />
        <LinkLine x1={400} y1={210} x2={460} y2={210} color="#a78bfa" active={s >= 1} />
        <LinkLine x1={640} y1={210} x2={710} y2={210} color="#34d399" active={s >= 3} />
        <FlowDot x1={190} y1={210} x2={710} y2={210} color="#f59e0b" active={s >= 1} />
        <Box x={460} y={300} w={180} h={60} title="Log Storage" sub="Centralized" color="#a78bfa" active={s >= 3} />
        <LinkLine x1={550} y1={255} x2={550} y2={300} color="#a78bfa" active={s >= 3} />
      </svg>
    </StepShell>
  )
}

interface TransportInfo {
  id: string
  label: string
  detail: string
}

const transports: Record<string, TransportInfo> = {
  udp: { id: 'udp', label: 'UDP 514', detail: 'الاستخدام التقليدي الشائع لـ Syslog. خفيف وسريع لكنه لا يضمن وصول كل message، وقد تُفقد الرسائل تحت الازدحام.' },
  tcp: { id: 'tcp', label: 'TCP', detail: 'TCP-based Syslog يوفّر reliable transport مقارنةً بـ UDP، ويساعد في تقليل فقدان الرسائل لكنه يستهلك موارد أكثر.' },
  tls: { id: 'tls', label: 'TLS', detail: 'Syslog over TLS يحمي الاتصال من خلال confidentiality/integrity حسب إعداد الشهادات والتشفير؛ لا تفترض أن كل Syslog مشفر تلقائياً.' },
}

export function SyslogTransportDiagram() {
  const [selected, setSelected] = useState('udp')
  const item = transports[selected]
  const controls = <ChoiceButtons items={Object.values(transports).map((entry) => ({ id: entry.id, label: entry.label }))} selected={selected} onSelect={setSelected} />
  return (
    <ChoiceShell title="SYSLOG TRANSPORT PROTOCOLS" controls={controls} legend={`**${item.label}** — ${item.detail} Syslog هو بروتوكول application؛ UDP/TCP/TLS هي طبقة النقل أو الحماية.`}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Syslog transport over UDP TCP and TLS">
        <Box x={70} y={165} w={220} h={100} title="Syslog Sender" sub="Application messages" color="#38bdf8" active />
        <Box x={630} y={165} w={220} h={100} title="Syslog Receiver" sub="Server :514 traditional" color="#34d399" active />
        <LinkLine x1={290} y1={215} x2={630} y2={215} color={selected === 'udp' ? '#f59e0b' : selected === 'tcp' ? '#38bdf8' : '#a78bfa'} active />
        <FlowDot x1={290} y1={215} x2={630} y2={215} color={selected === 'udp' ? '#f59e0b' : selected === 'tcp' ? '#38bdf8' : '#a78bfa'} active />
        <Badge x={310} y={145} text={selected === 'udp' ? 'UDP 514 - no delivery guarantee' : selected === 'tcp' ? 'TCP - reliable stream' : 'TLS - protected connection'} color="#f59e0b" active w={320} />
        {selected === 'tls' && <Badge x={350} y={290} text="Certificates / trust required" color="#a78bfa" active w={280} />}
      </svg>
    </ChoiceShell>
  )
}

const formatStages = [
  'PRI: رقم يرمّز Facility وSeverity، ويظهر داخل أقواس مثل `<134>`.',
  'Timestamp: تاريخ ووقت الحدث، ويساعد في ترتيب الأحداث عبر أجهزة متعددة.',
  'Hostname: اسم الجهاز الذي أنشأ الرسالة مثل `Router1`.',
  'Application / Process: اسم العملية أو النظام مثل `%LINK-3-UPDOWN` أو `sshd`.',
  'Message Content: نص الحدث نفسه مثل تغيير حالة واجهة أو محاولة دخول.',
]

export function SyslogMessageFormatDiagram() {
  const playback = useStepPlayback(formatStages.length)
  const s = playback.stage
  const parts = [
    ['PRI', '<134>'],
    ['Timestamp', 'Nov 24 17:00:00'],
    ['Hostname', 'Router1'],
    ['Application', '%LINK-3-UPDOWN:'],
    ['Message', 'Interface Gi0/1 changed state to down'],
  ]
  return (
    <StepShell title="SYSLOG MESSAGE FORMAT" playback={playback} legend={formatStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Syslog message parts PRI timestamp hostname application and content">
        {parts.map((part, index) => (
          <g key={part[0]} opacity={s >= index ? 1 : 0.32}>
            <Badge x={60 + index * 170} y={80} text={part[0]} color={s === index ? '#f59e0b' : '#38bdf8'} active={s >= index} w={140} />
            <SvgText x={130 + index * 170} y={170} color={s === index ? '#fbbf24' : '#cbd5e1'} size={8} bold>{part[1].slice(0, 22)}</SvgText>
            {index < parts.length - 1 && <LinkLine x1={200 + index * 170} y1={95} x2={230 + index * 170} y2={95} color="#475569" active={s > index} />}
          </g>
        ))}
        <Badge x={190} y={280} text="Format varies by platform and syslog format" color="#a78bfa" active w={420} />
      </svg>
    </StepShell>
  )
}

const priStructureStages = [
  'PRI = (Facility × 8) + Severity.',
  'Facility يحدد نوع المصدر؛ Severity يحدد خطورة الرسالة (0 أشد خطورة، 7 أقلها).',
  'مثال: Facility = 16 وSeverity = 6 إذن PRI = (16 × 8) + 6 = 134.',
  'لاستخراج Facility من PRI نستخدم Integer Division: Facility = PRI / 8.',
  'لاستخراج Severity نستخدم modulus: Severity = PRI % 8. مثال: 134 / 8 = 16 و134 % 8 = 6.',
]

export function PriStructureDiagram() {
  const playback = useStepPlayback(priStructureStages.length)
  const s = playback.stage
  return (
    <StepShell title="PRI STRUCTURE & CALCULATION" playback={playback} legend={priStructureStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="PRI equals facility times 8 plus severity">
        <Box x={70} y={130} w={220} h={100} title="Facility" sub="16 → local0" color="#a78bfa" active={s >= 1} />
        <SvgText x={350} y={190} color="#f59e0b" size={16} bold>×</SvgText>
        <Box x={390} y={130} w={140} h={100} title="8" sub="multiplier" color="#f59e0b" active={s >= 0} />
        <SvgText x={570} y={190} color="#f59e0b" size={16} bold>+</SvgText>
        <Box x={610} y={130} w={220} h={100} title="Severity" sub="6 → Informational" color="#38bdf8" active={s >= 1} />
        <Badge x={330} y={285} text={s >= 2 ? 'PRI = 134' : 'PRI = (F × 8) + S'} color="#34d399" active w={260} />
        {s >= 3 && <Badge x={250} y={335} text="F = floor(134 / 8) = 16    S = 134 % 8 = 6" color="#a78bfa" active w={420} />}
      </svg>
    </StepShell>
  )
}

interface FacilityInfo {
  id: string
  name: string
  code: number
  purpose: string
  example: string
}

const facilities: FacilityInfo[] = [
  { id: 'kern', name: 'kern', code: 0, purpose: 'Kernel-generated messages.', example: 'Kernel panic / hardware driver event' },
  { id: 'user', name: 'user', code: 1, purpose: 'User-level process messages.', example: 'Application notice from a user process' },
  { id: 'mail', name: 'mail', code: 2, purpose: 'Mail system messages.', example: 'Mail delivery warning' },
  { id: 'daemon', name: 'daemon', code: 3, purpose: 'System daemon/background service messages.', example: 'Service started or failed' },
  { id: 'auth', name: 'auth', code: 4, purpose: 'Authorization/authentication messages on many Unix-like systems.', example: 'Login attempt result' },
  { id: 'syslog', name: 'syslog', code: 5, purpose: 'Messages generated by the syslog service itself.', example: 'Syslog daemon restart' },
  { id: 'lpr', name: 'lpr', code: 6, purpose: 'Printing subsystem messages.', example: 'Print queue event' },
  { id: 'news', name: 'news', code: 7, purpose: 'News/NNTP subsystem messages.', example: 'News feed status' },
  { id: 'uucp', name: 'uucp', code: 8, purpose: 'Legacy UUCP subsystem messages.', example: 'Legacy transfer event' },
  { id: 'cron', name: 'cron', code: 9, purpose: 'Scheduled job messages.', example: 'Cron job completed' },
  { id: 'authpriv', name: 'authpriv', code: 10, purpose: 'Private authorization messages on many systems.', example: 'Privileged authentication event' },
  { id: 'ftp', name: 'ftp', code: 11, purpose: 'FTP service messages.', example: 'FTP session opened' },
  { id: 'local0', name: 'local0', code: 16, purpose: 'Locally defined facility, commonly used by network devices.', example: 'Cisco IOS event sent to syslog server' },
  { id: 'local1', name: 'local1', code: 17, purpose: 'Locally defined facility.', example: 'Custom application group' },
  { id: 'local2', name: 'local2', code: 18, purpose: 'Locally defined facility.', example: 'Custom application group' },
  { id: 'local3', name: 'local3', code: 19, purpose: 'Locally defined facility.', example: 'Custom application group' },
  { id: 'local4', name: 'local4', code: 20, purpose: 'Locally defined facility.', example: 'Cisco IOS default/example in some platforms' },
  { id: 'local5', name: 'local5', code: 21, purpose: 'Locally defined facility.', example: 'Custom network device group' },
  { id: 'local6', name: 'local6', code: 22, purpose: 'Locally defined facility.', example: 'Custom network device group' },
  { id: 'local7', name: 'local7', code: 23, purpose: 'Locally defined facility.', example: 'Custom network device group' },
]

export function PriCalculatorDiagram() {
  const [facilityCode, setFacilityCode] = useState(16)
  const [severity, setSeverity] = useState(6)
  const [priInput, setPriInput] = useState('134')
  const facility = facilities.find((item) => item.code === facilityCode) ?? facilities[12]
  const forwardPri = facilityCode * 8 + severity
  const parsed = Number(priInput)
  const safePri = Number.isFinite(parsed) ? Math.max(0, Math.min(191, Math.round(parsed))) : 0
  const reverseFacility = Math.floor(safePri / 8)
  const reverseSeverity = safePri % 8
  const selectClass = 'rounded-lg border border-sky-400/20 bg-navy-900 px-2 py-1.5 text-[0.75rem] text-slate-200'
  const controls = (
    <div className="flex flex-wrap items-center justify-end gap-2">
      <select value={facilityCode} onChange={(event) => setFacilityCode(Number(event.target.value))} className={selectClass} aria-label="Facility">
        {facilities.map((item) => <option key={item.id} value={item.code}>{item.name} ({item.code})</option>)}
      </select>
      <ChoiceButtons items={Array.from({ length: 8 }, (_, index) => ({ id: String(index), label: String(index) }))} selected={String(severity)} onSelect={(id) => setSeverity(Number(id))} />
      <label className="flex items-center gap-1 text-[0.75rem] text-slate-300">
        PRI
        <input type="number" min={0} max={191} value={priInput} onChange={(event) => setPriInput(event.target.value)} className={`${selectClass} w-20`} aria-label="PRI value" />
      </label>
    </div>
  )
  const legend = `**Forward:** Facility \`${facility.name}=${facilityCode}\` وSeverity \`${severity}\` ⇒ PRI = \`(${facilityCode} × 8) + ${severity} = ${forwardPri}\`. **Reverse:** PRI \`${safePri}\` ⇒ Facility = \`floor(${safePri}/8)=${reverseFacility}\` وSeverity = \`${safePri}%8=${reverseSeverity}\`.`
  return (
    <ChoiceShell title="INTERACTIVE PRI CALCULATOR" controls={controls} legend={legend}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Interactive PRI calculator with forward and reverse calculation">
        <Box x={45} y={90} w={380} h={220} title="Forward Calculation" sub="Facility + Severity → PRI" color="#38bdf8" active />
        <SvgText x={235} y={180} color="#cbd5e1" size={11} bold>{`${facilityCode} × 8 + ${severity}`}</SvgText>
        <SvgText x={235} y={235} color="#fbbf24" size={20} bold>{`PRI = ${forwardPri}`}</SvgText>
        <Box x={495} y={90} w={380} h={220} title="Reverse Calculation" sub="PRI → Facility + Severity" color="#a78bfa" active />
        <SvgText x={685} y={180} color="#cbd5e1" size={10} bold>{`floor(${safePri}/8) = ${reverseFacility}`}</SvgText>
        <SvgText x={685} y={235} color="#fbbf24" size={10} bold>{`${safePri} % 8 = ${reverseSeverity}`}</SvgText>
        <Badge x={260} y={345} text="Facility codes 0–23 are common; PRI range shown 0–191" color="#34d399" active w={420} />
      </svg>
    </ChoiceShell>
  )
}

interface SeverityInfo {
  level: number
  name: string
  meaning: string
  example: string
}

const severities: SeverityInfo[] = [
  { level: 0, name: 'Emergency', meaning: 'System is unusable', example: 'System crash / kernel panic' },
  { level: 1, name: 'Alert', meaning: 'Immediate action required', example: 'Critical hardware failure' },
  { level: 2, name: 'Critical', meaning: 'Critical conditions', example: 'Power supply failure' },
  { level: 3, name: 'Error', meaning: 'Error conditions', example: 'Interface protocol down' },
  { level: 4, name: 'Warning', meaning: 'Warning conditions', example: 'High CPU utilization' },
  { level: 5, name: 'Notification', meaning: 'Normal but significant conditions', example: 'Configuration change' },
  { level: 6, name: 'Informational', meaning: 'Informational messages', example: 'Link up / normal event' },
  { level: 7, name: 'Debugging', meaning: 'Debug-level messages', example: 'Detailed debug trace' },
]

export function SeverityScaleDiagram() {
  const [selected, setSelected] = useState('3')
  const info = severities.find((item) => item.level === Number(selected)) ?? severities[0]
  const controls = <ChoiceButtons items={severities.map((item) => ({ id: String(item.level), label: String(item.level) }))} selected={selected} onSelect={setSelected} />
  const legend = `**Level ${info.level} — ${info.name}:** ${info.meaning}. مثال: ${info.example}. Level 0 هو الأشد خطورة وLevel 7 هو الأقل؛ كلما قل الرقم زادت الخطورة.`
  return (
    <ChoiceShell title="SEVERITY LEVELS SCALE" controls={controls} legend={legend}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Interactive syslog severity levels zero to seven">
        {severities.map((item) => {
          const active = selected === String(item.level)
          const width = 160 + (7 - item.level) * 16
          return (
            <g key={item.level} opacity={active ? 1 : 0.55}>
              <rect x={60} y={40 + item.level * 42} width={width} height={32} rx="8" fill="#0b1224" stroke={active ? '#f59e0b' : item.level <= 2 ? '#fb7185' : '#38bdf8'} strokeWidth={active ? 2.4 : 1.2} />
              <SvgText x={75} y={61 + item.level * 42} color={active ? '#fbbf24' : '#cbd5e1'} size={9} bold anchor="start">{`${item.level}  ${item.name}`}</SvgText>
              <ClickNode x={620} y={40 + item.level * 42} w={180} h={32} title={`Level ${item.level}`} sub={item.name} color="#38bdf8" selected={active} onClick={() => setSelected(String(item.level))} />
            </g>
          )
        })}
      </svg>
    </ChoiceShell>
  )
}

export function SeverityThresholdDiagram() {
  const [threshold, setThreshold] = useState('4')
  const t = Number(threshold)
  const controls = <ChoiceButtons items={severities.map((item) => ({ id: String(item.level), label: `T${item.level}` }))} selected={threshold} onSelect={setThreshold} />
  const legend = `عند ضبط Threshold عند **Level ${t}** تُرسل/تُعرض عادةً الرسائل من المستويات **0 إلى ${t}** فقط. أي أن الخيار يشمل الأشد خطورة، وليس النطاق ${t} إلى 7. مثال: T4 يشمل 0,1,2,3,4 ويستثني 5,6,7.`
  return (
    <ChoiceShell title="SEVERITY THRESHOLD SELECTOR" controls={controls} legend={legend}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Severity threshold includes levels zero through selected level">
        {severities.map((item) => {
          const included = item.level <= t
          return (
            <g key={item.level} opacity={included ? 1 : 0.3}>
              <rect x={80 + item.level * 105} y={120} width={90} height={150} rx="10" fill="#0b1224" stroke={included ? '#34d399' : '#475569'} strokeWidth={included ? 2.2 : 1} />
              <SvgText x={125 + item.level * 105} y={160} color={included ? '#fbbf24' : '#64748b'} size={14} bold>{String(item.level)}</SvgText>
              <SvgText x={125 + item.level * 105} y={205} color="#cbd5e1" size={7.5}>{item.name}</SvgText>
              <SvgText x={125 + item.level * 105} y={235} color={included ? '#34d399' : '#64748b'} size={7} bold>{included ? 'INCLUDED' : 'EXCLUDED'}</SvgText>
            </g>
          )
        })}
        <Badge x={230} y={320} text={`Threshold ${t} → include levels 0..${t}`} color="#f59e0b" active w={420} />
      </svg>
    </ChoiceShell>
  )
}

export function FacilityExplorerDiagram() {
  const [selected, setSelected] = useState('local0')
  const item = facilities.find((entry) => entry.id === selected) ?? facilities[12]
  const controls = <ChoiceButtons items={facilities.map((entry) => ({ id: entry.id, label: `${entry.name} (${entry.code})` }))} selected={selected} onSelect={setSelected} />
  const legend = `**${item.name}** — Code: \`${item.code}\`; Purpose: ${item.purpose} Example: ${item.example}. Facility يصنّف مصدر الرسالة؛ Severity يصنّف خطورتها. أسماء Cisco IOS قد لا تطابق كل أسماء Unix/Linux.`
  return (
    <ChoiceShell title="INTERACTIVE FACILITY EXPLORER" controls={controls} legend={legend}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Interactive syslog facility explorer">
        <Box x={60} y={90} w={330} h={140} title={`${item.name} (${item.code})`} sub="Selected facility" color="#a78bfa" active />
        <Box x={430} y={90} w={430} h={140} title="Purpose" sub={item.purpose.slice(0, 52)} color="#38bdf8" active />
        <SvgText x={225} y={300} color="#fbbf24" size={10} bold>{`Example: ${item.example}`}</SvgText>
        <SvgText x={225} y={345} color="#cbd5e1" size={8}>{`PRI example with severity 6 = ${item.code * 8 + 6}`}</SvgText>
        <Badge x={470} y={320} text="local0–local7 are common for network devices" color="#34d399" active w={390} />
      </svg>
    </ChoiceShell>
  )
}

const facilitySeverityStages = [
  'Facility يجيب على سؤال: من أين جاءت الرسالة أو أي subsystem أنشأها؟',
  'Severity تجيب على سؤال: ما مدى خطورة الرسالة؟',
  'نفس الـ Facility قد يرسل رسائل بـ Severity مختلفة like local0 مع Error وInformational.',
  'نفس الـ Severity قد تظهر من Facilities مختلفة like auth وlocal0 كلاهما Warning.',
  'PRI يجمع الاثنين: (Facility × 8) + Severity، لذلك لا نخلط بين المصدر والخطورة.',
]

export function FacilityVsSeverityDiagram() {
  const playback = useStepPlayback(facilitySeverityStages.length)
  const s = playback.stage
  return (
    <StepShell title="FACILITY vs SEVERITY" playback={playback} legend={facilitySeverityStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Facility source category compared with severity seriousness">
        <Box x={90} y={110} w={300} h={120} title="Facility" sub="Source / subsystem" color="#a78bfa" active={s >= 0} />
        <Box x={530} y={110} w={300} h={120} title="Severity" sub="Seriousness 0–7" color="#38bdf8" active={s >= 1} />
        <LinkLine x1={390} y1={170} x2={530} y2={170} color="#f59e0b" active={s >= 4} />
        {s >= 2 && <Badge x={100} y={280} text="local0 + Error / Informational" color="#a78bfa" active w={300} />}
        {s >= 3 && <Badge x={520} y={280} text="auth / local0 + Warning" color="#38bdf8" active w={300} />}
        {s >= 4 && <Badge x={300} y={350} text="PRI = (Facility × 8) + Severity" color="#f59e0b" active w={340} />}
      </svg>
    </StepShell>
  )
}

const centralizedStages = [
  'Routers وSwitches وFirewalls وServers ترسل Syslog messages إلى خادم مركزي.',
  'الخادم يستقبل الرسائل ويخزنها مركزياً بدلاً من البحث في كل جهاز على حدة.',
  'Log Analysis يربط الأحداث زمنياً ويكشف الأنماط المتكررة.',
  'Dashboard يعرض تنبيهات وتقارير وخطوط زمنية للـ troubleshooting.',
  'Syslog يرسل event messages نصية؛ SNMP Trap/Inform يرسل notifications مرتبطة بـ MIB/OID —كلاهما مفيد لكنهما ليسا نفس الآلية.',
]

export function CentralizedMonitoringDiagram() {
  const playback = useStepPlayback(centralizedStages.length)
  const s = playback.stage
  return (
    <StepShell title="SYSLOG CENTRALIZED MONITORING" playback={playback} legend={centralizedStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Centralized syslog monitoring from many devices to a dashboard">
        {['Router', 'Switch', 'Firewall', 'Server'].map((label, index) => (
          <g key={label} opacity={s >= 0 ? 1 : 0.4}>
            <Box x={40 + index * 110} y={70} w={100} h={70} title={label} sub="Sender" color="#38bdf8" active />
            <LinkLine x1={90 + index * 110} y1={140} x2={350} y2={210} color="#38bdf8" active={s >= 0} />
          </g>
        ))}
        <Box x={350} y={210} w={220} h={90} title="Syslog Server" sub="Receive + store" color="#34d399" active={s >= 1} />
        <LinkLine x1={570} y1={255} x2={660} y2={255} color="#a78bfa" active={s >= 2} />
        <Box x={660} y={210} w={200} h={90} title="Dashboard" sub="Alerts + reports" color="#f59e0b" active={s >= 3} />
        {s >= 4 && <Badge x={270} y={350} text="Syslog events ≠ SNMP Traps/Informs" color="#fb7185" active w={380} />}
      </svg>
    </StepShell>
  )
}

const bufferedStages = [
  'Buffered Logging يخزّن الرسائل في RAM buffer داخل الجهاز.',
  '`logging buffered 16384 informational` يحدد حجم الـ buffer وSeverity Threshold.',
  'التخزين دائري تقريباً: عند امتلاء الـ buffer تُستبدل الرسائل القديمة بأحدثها.',
  '`show logging` يعرض محتوى الـ buffer والـ thresholds الحالية.',
  'الـ buffer volatile؛ قد تُفقد الرسائل بعد reload، لذلك Remote Server أفضل للاحتفاظ الطويل.',
]

export function BufferedLoggingDiagram() {
  const playback = useStepPlayback(bufferedStages.length)
  const s = playback.stage
  return (
    <StepShell title="BUFFERED LOGGING" playback={playback} legend={bufferedStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Buffered logging RAM buffer size and severity threshold">
        <Box x={70} y={160} w={220} h={100} title="Device Events" sub="Generated locally" color="#38bdf8" active />
        <Box x={360} y={120} w={320} h={180} title="RAM Buffer" sub="16384 bytes · informational" color="#a78bfa" active={s >= 1} />
        {Array.from({ length: 6 }, (_, index) => (
          <rect key={index} x={390 + index * 45} y={190} width={35} height={45} rx="5" fill="#0a1730" stroke={index < Math.min(s + 2, 6) ? '#34d399' : '#475569'} strokeWidth="1.4" opacity={index < Math.min(s + 2, 6) ? 1 : 0.4} />
        ))}
        <LinkLine x1={290} y1={210} x2={360} y2={210} color="#38bdf8" active={s >= 0} />
        <FlowDot x1={290} y1={210} x2={360} y2={210} color="#38bdf8" active={s === 0} />
        {s >= 3 && <Badge x={360} y={330} text="show logging → buffer + thresholds" color="#f59e0b" active w={320} />}
      </svg>
    </StepShell>
  )
}

interface DestinationChoice {
  id: string
  label: string
  detail: string
}

const consoleMonitor: Record<string, DestinationChoice> = {
  console: { id: 'console', label: 'Console', detail: '`logging console warnings` يحدد الرسائل التي تظهر على Console. مفهوم أساسي للمهندس الجالس أمام الجهاز، لكنه يعتمد على اتصال فعلي بالمنفذ.' },
  monitor: { id: 'monitor', label: 'Monitor / VTY', detail: '`logging monitor debugging` يرسل الرسائل إلى terminal lines؛ يحتاج عادةً `terminal monitor` داخل الجلسة حتى تظهر الرسائل على الشاشة.' },
}

export function ConsoleVsMonitorDiagram() {
  const [selected, setSelected] = useState('console')
  const item = consoleMonitor[selected]
  const controls = <ChoiceButtons items={Object.values(consoleMonitor).map((entry) => ({ id: entry.id, label: entry.label }))} selected={selected} onSelect={setSelected} />
  return (
    <ChoiceShell title="CONSOLE vs MONITOR LOGGING" controls={controls} legend={`**${item.label}** — ${item.detail}`}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Console logging compared with terminal monitor logging">
        <Box x={60} y={160} w={220} h={100} title="Device" sub="Log generator" color="#38bdf8" active />
        <Box x={380} y={100} w={220} h={100} title="Console" sub="Physical console port" color={selected === 'console' ? '#f59e0b' : '#64748b'} active={selected === 'console'} />
        <Box x={380} y={240} w={220} h={100} title="VTY Terminal" sub="Remote session + terminal monitor" color={selected === 'monitor' ? '#34d399' : '#64748b'} active={selected === 'monitor'} />
        <LinkLine x1={280} y1={200} x2={380} y2={150} color="#f59e0b" active={selected === 'console'} />
        <LinkLine x1={280} y1={220} x2={380} y2={290} color="#34d399" active={selected === 'monitor'} />
        <FlowDot x1={280} y1={200} x2={380} y2={150} color="#f59e0b" active={selected === 'console'} />
        <FlowDot x1={280} y1={220} x2={380} y2={290} color="#34d399" active={selected === 'monitor'} />
      </svg>
    </ChoiceShell>
  )
}

const remoteFlowStages = [
  '`logging on` يفعّل عملية logging على الجهاز إن لم تكن مفعّلة.',
  '`logging host 192.168.1.100` يحدد عنوان Syslog Server.',
  '`logging trap informational` يحدد Threshold للرسائل المرسلة إلى Remote Server (0–6).',
  '`service timestamps log datetime msec` يضيف تاريخاً ووقتاً بدقة miliseconds للتتبع الزمني.',
  '`show logging` و`show running-config` يتحققان من الحالة والوجهة والـ threshold؛ `logging trap` ليس SNMP Trap.',
]

export function RemoteSyslogConfigFlowDiagram() {
  const playback = useStepPlayback(remoteFlowStages.length)
  const s = playback.stage
  const commands = ['logging on', 'logging host 192.168.1.100', 'logging trap informational', 'service timestamps log datetime msec', 'show logging / show running-config']
  return (
    <StepShell title="REMOTE SYSLOG CONFIGURATION FLOW" playback={playback} legend={remoteFlowStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Cisco IOS remote syslog configuration flow">
        <Box x={60} y={160} w={200} h={100} title="Router1" sub="IOS device" color="#38bdf8" active />
        <Box x={670} y={160} w={200} h={100} title="Syslog Server" sub="192.168.1.100" color="#34d399" active={s >= 1} />
        <LinkLine x1={260} y1={210} x2={670} y2={210} color="#f59e0b" active={s >= 1} />
        <FlowDot x1={260} y1={210} x2={670} y2={210} color="#f59e0b" active={s >= 1} />
        {commands.map((command, index) => (
          <g key={command} opacity={s >= index ? 1 : 0.3}>
            <rect x={290} y={40 + index * 68} width={340} height={46} rx="8" fill="#0b1224" stroke={s === index ? '#f59e0b' : '#475569'} strokeWidth={s === index ? 2.2 : 1} />
            <SvgText x={460} y={68 + index * 68} color={s === index ? '#fbbf24' : '#cbd5e1'} size={8} bold>{command}</SvgText>
          </g>
        ))}
      </svg>
    </StepShell>
  )
}

const timestampStages = [
  'بدون timestamps قد تظهر الرسائل بزمن غير كامل أو غير متسق حسب المنصة.',
  '`service timestamps log datetime msec` يضيف date/time وملي ثانية إلى الرسائل.',
  '`show clock` يتحقق من ساعة الجهاز؛ تزامنها مهم لترتيب أحداث أجهزة متعددة.',
  'Timestamps الدقيقة تساعد في ربط حدث على Router بحدث على Server أو Firewall.',
  'NTP يوفّر مزامنة مستمرة؛ لا نعيد شرحه هنا، لكنه يدعم جودة التحليل الزمني.',
]

export function SyslogTimestampTimelineDiagram() {
  const playback = useStepPlayback(timestampStages.length)
  const s = playback.stage
  return (
    <StepShell title="SYSLOG TIMESTAMP TIMELINE" playback={playback} legend={timestampStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Syslog timestamp timeline and clock synchronization">
        <rect x={80} y={200} width={760} height={8} rx="4" fill="#1e3a5f" />
        {['Router1', 'Switch1', 'FW1', 'Server'].map((label, index) => {
          const x = 130 + index * 190
          const on = s >= 2
          return (
            <g key={label} opacity={on ? 1 : 0.4}>
              <circle cx={x} cy={204} r={on ? 8 : 5} fill={on ? '#34d399' : '#64748b'} />
              <SvgText x={x} y={245} color="#cbd5e1" size={8.5} bold>{label}</SvgText>
              <SvgText x={x} y={265} color={on ? '#fbbf24' : '#64748b'} size={7}>{on ? '17:00:0' + index + '.123' : 'no timestamp'}</SvgText>
            </g>
          )
        })}
        {s >= 1 && <Badge x={250} y={110} text="datetime + msec enabled" color="#f59e0b" active w={300} />}
        {s >= 4 && <Badge x={280} y={330} text="Correlate events across devices" color="#a78bfa" active w={340} />}
      </svg>
    </StepShell>
  )
}

interface TroubleChoice {
  id: string
  label: string
  detail: string
}

const syslogTrouble: Record<string, TroubleChoice> = {
  generate: { id: 'generate', label: 'No local logs', detail: '**Device not generating logs.** تحقق `show logging` و`logging on`؛ قد يكون الـ logging معطّلاً أو لا يوجد event أصلاً. النتيجة المتوقعة: ظهور أحداث محلية أولاً.' },
  config: { id: 'config', label: 'Logging config', detail: '**Generating but not sending.** راجع `logging host` و`logging trap` والـ threshold؛ قد تكون الرسائل أقل خطورة من الحد المسموح.' },
  host: { id: 'host', label: 'Wrong host IP', detail: '**Remote host wrong.** قارن `logging host` بعنوان الخادم الفعلي في `show running-config`. النتيجة: وصول الرسائل إلى الخادم الصحيح.' },
  threshold: { id: 'threshold', label: 'Threshold', detail: '**Severity mismatch.** Threshold 4 يمرر 0–4 فقط؛ رسائل 5–7 لا تُرسل. اضبط Threshold مناسباً وتأكد من معنى المستويات.' },
  path: { id: 'path', label: 'Network path', detail: '**Connectivity.** تحقق IP reachability وrouting من الجهاز إلى Syslog Server؛ ping وحده لا يكفي لكنه نقطة بداية.' },
  firewall: { id: 'firewall', label: 'Firewall / UDP 514', detail: '**Transport blocked.** افحص firewall rules للسماح بـ UDP 514 في الاستخدام التقليدي، أو المنفذ/البروتوكول المكوّن إن استُخدم TCP/TLS.' },
  server: { id: 'server', label: 'Server side', detail: '**Server receiving but not storing.** افحص خدمة Syslog و مساحة التخزين وقواعد الاستقبال على السيرفر؛ ليست كل المشاكل من Cisco IOS.' },
  debug: { id: 'debug', label: 'Debug storm', detail: '**Too many debug messages.** مستوى 7 قد يغرق الـ buffer والشبكة؛ قلّل Debug أو ارفع الـ threshold بعد انتهاء التشخيص.' },
}

export function SyslogTroubleshootingFlowDiagram() {
  const [selected, setSelected] = useState('config')
  const item = syslogTrouble[selected]
  const controls = <ChoiceButtons items={Object.values(syslogTrouble).map((entry) => ({ id: entry.id, label: entry.label }))} selected={selected} onSelect={setSelected} />
  return (
    <ChoiceShell title="SYSLOG TROUBLESHOOTING DECISION TREE" controls={controls} legend={item.detail}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Interactive syslog troubleshooting decision tree">
        <Box x={350} y={15} w={220} h={60} title="Syslog issue?" sub="Choose a branch" color="#f59e0b" active />
        <LinkLine x1={460} y1={75} x2={460} y2={115} color="#f59e0b" active />
        <LinkLine x1={115} y1={115} x2={805} y2={115} color="#475569" active />
        {Object.values(syslogTrouble).map((entry, index) => {
          const x = 20 + (index % 4) * 225
          const y = index < 4 ? 145 : 285
          const cx = x + 100
          return (
            <g key={entry.id}>
              <LinkLine x1={cx} y1={115} x2={cx} y2={y} color="#475569" active={selected === entry.id} />
              <ClickNode x={x} y={y} w={200} h={85} title={entry.label} sub={index < 4 ? 'Check A' : 'Check B'} color={index < 4 ? '#38bdf8' : '#a78bfa'} selected={selected === entry.id} onClick={() => setSelected(entry.id)} />
            </g>
          )
        })}
      </svg>
    </ChoiceShell>
  )
}

const lifecycleStages = [
  'Event يحدث على جهاز مثلRouter أو Switch أو Firewall.',
  'الجهاز يبني Syslog message بـ PRI وtimestamp وhostname ومحتوى.',
  'الجهاز يقرر الوجهة: console، buffer، terminal، أو remote server حسب الإعداد.',
  'الرسالة تنتقل عبر transport مناسب؛ UDP 514 هو الاستخدام التقليدي الشائع.',
  'Syslog Server يستقبل ويخزّن الرسائل مركزياً.',
  'Log Analysis وDashboard يحوّلان الرسائل إلى تنبيهات وتقارير.',
  'المهندس يستخدم السجلات في troubleshooting وAudit وربط الأحداث زمنياً.',
]

export function CompleteLoggingLifecycleDiagram() {
  const playback = useStepPlayback(lifecycleStages.length)
  const s = playback.stage
  const labels = ['Event', 'Format', 'Choose dest', 'Transport', 'Store', 'Analyze', 'Troubleshoot']
  return (
    <StepShell title="COMPLETE LOGGING LIFECYCLE" playback={playback} legend={lifecycleStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Complete syslog logging lifecycle from event to troubleshooting">
        {labels.map((label, index) => (
          <g key={label} opacity={s >= index ? 1 : 0.3}>
            <rect x={25 + index * 128} y={170} width={110} height={70} rx="9" fill="#0b1224" stroke={s === index ? '#f59e0b' : '#38bdf8'} strokeWidth={s === index ? 2.3 : 1.2} />
            <SvgText x={80 + index * 128} y={210} color={s === index ? '#fbbf24' : '#cbd5e1'} size={8} bold>{label}</SvgText>
            {index < labels.length - 1 && <LinkLine x1={135 + index * 128} y1={205} x2={153 + index * 128} y2={205} color="#475569" active={s > index} />}
          </g>
        ))}
        {s >= 6 && <Badge x={260} y={310} text="Centralized logs → faster troubleshooting" color="#34d399" active w={380} />}
      </svg>
    </StepShell>
  )
}

interface SampleMessage {
  id: string
  label: string
  raw: string
  pri: number
  facility: string
  severity: string
  timestamp: string
  hostname: string
  app: string
  content: string
}

const sampleMessages: SampleMessage[] = [
  { id: 'linkdown', label: 'LINK-3-UPDOWN', raw: '<131>Nov 24 17:00:00 Router1 %LINK-3-UPDOWN: Interface GigabitEthernet0/1 changed state to down', pri: 131, facility: 'local0 (16)', severity: 'Error (3)', timestamp: 'Nov 24 17:00:00', hostname: 'Router1', app: '%LINK-3-UPDOWN:', content: 'Interface GigabitEthernet0/1 changed state to down' },
  { id: 'config', label: 'SYS-5-CONFIG_I', raw: '<133>Nov 24 17:00:05 Router1 %SYS-5-CONFIG_I: Configured from console by admin', pri: 133, facility: 'local0 (16)', severity: 'Notification (5)', timestamp: 'Nov 24 17:00:05', hostname: 'Router1', app: '%SYS-5-CONFIG_I:', content: 'Configured from console by admin' },
  { id: 'ssh', label: 'sshd accepted', raw: '<134>Nov 24 17:00:07 fw1 sshd[2210]: Accepted password for admin from 192.168.1.10', pri: 134, facility: 'local0 (16)', severity: 'Informational (6)', timestamp: 'Nov 24 17:00:07', hostname: 'fw1', app: 'sshd[2210]:', content: 'Accepted password for admin from 192.168.1.10' },
  { id: 'kernel', label: 'kernel panic', raw: '<0>Nov 24 17:00:09 kernel: Kernel panic - not syncing', pri: 0, facility: 'kern (0)', severity: 'Emergency (0)', timestamp: 'Nov 24 17:00:09', hostname: 'kernel', app: 'kernel:', content: 'Kernel panic - not syncing' },
]

export function SyslogMessageInspectorDiagram() {
  const [selected, setSelected] = useState('linkdown')
  const message = sampleMessages.find((item) => item.id === selected) ?? sampleMessages[0]
  const controls = <ChoiceButtons items={sampleMessages.map((item) => ({ id: item.id, label: item.label }))} selected={selected} onSelect={setSelected} />
  const legend = `**${message.label}** — PRI \`${message.pri}\` ⇒ Facility \`${message.facility}\`, Severity \`${message.severity}\`. Timestamp: \`${message.timestamp}\`; Hostname: \`${message.hostname}\`; Application: \`${message.app}\`; Content: ${message.content}. التنسيق الفعلي قد يختلف حسب المنصة والـ syslog format.`
  const parts = [
    ['PRI', `<${message.pri}>`],
    ['Timestamp', message.timestamp],
    ['Hostname', message.hostname],
    ['Application / Process', message.app],
    ['Message Content', message.content.slice(0, 38)],
  ]
  return (
    <ChoiceShell title="SYSLOG MESSAGE INSPECTOR" controls={controls} legend={legend}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Interactive syslog message inspector">
        <Badge x={40} y={35} text={message.raw.slice(0, 95)} color="#f59e0b" active w={840} />
        {parts.map((part, index) => (
          <g key={part[0]}>
            <Badge x={60} y={110 + index * 55} text={part[0]} color="#38bdf8" active w={180} />
            <Badge x={260} y={110 + index * 55} text={part[1]} color={index === 0 ? '#fbbf24' : '#a78bfa'} active w={580} />
          </g>
        ))}
      </svg>
    </ChoiceShell>
  )
}
