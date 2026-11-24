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

const overviewStages = [
  'Remote Device Management يعني الوصول إلى Router أو Switch من جهاز بعيد بدل الجلوس أمامه.',
  'Console Access يحتاج اتصالاً فعلياً بالمنفذ؛ Remote Access يعتمد على الشبكة.',
  'المسؤول يحتاج الوصول البعيد للصيانة والتكوين ومراجعة الحالة دون التواجد بالموقع.',
  'Telnet وSSH كلاهما يوفران وصولاً عن بُعد، لكن SSH هو الآمن.',
  'SSH يوفر تشفيراً ومصادقة وسلامة بيانات، ويستخدم TCP Port 22.',
]

export function RemoteManagementOverviewDiagram() {
  const playback = useStepPlayback(overviewStages.length)
  const s = playback.stage
  return (
    <StepShell title="REMOTE MANAGEMENT OVERVIEW" playback={playback} legend={overviewStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Remote device management overview comparing console and network access">
        <Box x={60} y={90} w={200} h={85} title="Console" sub="Physical access" color="#64748b" active={s >= 1} />
        <Box x={60} y={235} w={200} h={85} title="Administrator PC" sub="Remote workstation" color="#38bdf8" active={s >= 2} />
        <Box x={380} y={160} w={180} h={100} title="IP Network" sub="TCP / IP path" color="#a78bfa" active={s >= 2} />
        <Box x={680} y={160} w={200} h={100} title="Cisco Device" sub="Router / Switch" color="#34d399" active={s >= 2} />
        <LinkLine x1={260} y1={277} x2={380} y2={210} color="#38bdf8" active={s >= 2} />
        <LinkLine x1={560} y1={210} x2={680} y2={210} color="#34d399" active={s >= 2} />
        <FlowDot x1={260} y1={277} x2={680} y2={210} color="#f59e0b" active={s >= 4} />
        {s >= 4 && <Badge x={300} y={340} text="SSH = encrypted remote management over TCP 22" color="#f59e0b" active w={410} />}
      </svg>
    </StepShell>
  )
}

interface ProtocolMode {
  id: string
  label: string
  port: string
  detail: string
  color: string
}

const protocols: ProtocolMode[] = [
  { id: 'telnet', label: 'Telnet', port: 'TCP 23', detail: 'ينقل البيانات **بدون تشفير**؛ قد تُقرأ أسماء المستخدمين وكلمات المرور إذا تم اعتراض المسار. لا يوفر Confidentiality مناسب.', color: '#fb7185' },
  { id: 'ssh', label: 'SSH', port: 'TCP 22', detail: 'Secure Shell يوفر **Encrypted Communication** وAuthentication وIntegrity وConfidentiality؛ الخيار المفضل للإدارة الآمنة.', color: '#34d399' },
]

export function SshVsTelnetDiagram() {
  const [selected, setSelected] = useState('ssh')
  const item = protocols.find((entry) => entry.id === selected) ?? protocols[1]
  const controls = <ChoiceButtons items={protocols.map((entry) => ({ id: entry.id, label: entry.label }))} selected={selected} onSelect={setSelected} />
  return (
    <ChoiceShell title="SSH vs TELNET" controls={controls} legend={`**${item.label}** — \`${item.port}\`. ${item.detail}`}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Interactive SSH versus Telnet connection comparison">
        <Box x={60} y={90} w={340} h={120} title="TELNET" sub="TCP 23 · plaintext" color="#fb7185" active={selected === 'telnet'} />
        <Box x={520} y={90} w={340} h={120} title="SSH" sub="TCP 22 · encrypted" color="#34d399" active={selected === 'ssh'} />
        <Box x={60} y={250} w={340} h={90} title="Visible credentials" sub={selected === 'telnet' ? 'Username / password can be read' : 'Not applicable'} color={selected === 'telnet' ? '#fb7185' : '#475569'} active={selected === 'telnet'} />
        <Box x={520} y={250} w={340} h={90} title="Encrypted session" sub={selected === 'ssh' ? 'Confidentiality + integrity' : 'Not applicable'} color={selected === 'ssh' ? '#34d399' : '#475569'} active={selected === 'ssh'} />
        <Badge x={250} y={380} text="Use SSH for secure management" color="#f59e0b" active w={420} />
      </svg>
    </ChoiceShell>
  )
}

const architectureStages = [
  'SSH Client هو البرنامج أو الجهاز الذي يبدأ الاتصال، مثل SSH client على PC المسؤول.',
  'SSH Server هو الجهاز الذي يستقبل الاتصال ويقدم خدمة SSH، مثل Cisco Router.',
  'Client يتصل بعنوان IP الخاص بالخادم على TCP Port 22.',
  'الخادم يقدم هوية (Host Key) والعميل يتحقق منها قبل إكمال الاتصال.',
  'بعد إنشاء الجلسة المشفرة تتم المصادقة ثم فتح جلسة تفاعلية آمنة.',
]

export function SshClientServerDiagram() {
  const playback = useStepPlayback(architectureStages.length)
  const s = playback.stage
  return (
    <StepShell title="SSH CLIENT / SERVER ARCHITECTURE" playback={playback} legend={architectureStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="SSH client and server architecture with administrator PC and Cisco router">
        <Box x={60} y={150} w={250} h={100} title="Administrator PC" sub="192.168.1.10 · SSH client" color="#38bdf8" active />
        <Box x={620} y={150} w={240} h={100} title="Cisco Router" sub="192.168.1.1 · SSH server" color="#34d399" active={s >= 1} />
        <LinkLine x1={310} y1={200} x2={620} y2={200} color="#f59e0b" active={s >= 2} />
        {s >= 2 && <FlowDot x1={310} y1={200} x2={620} y2={200} color="#f59e0b" active />}
        {s >= 3 && <Badge x={260} y={100} text="SSH · TCP Port 22" color="#a78bfa" active w={300} />}
        {s >= 4 && <Badge x={270} y={320} text="Host identity → encrypted session → authentication" color="#f59e0b" active w={430} />}
      </svg>
    </StepShell>
  )
}

const lifecycleStages = [
  '1 — TCP Connection Establishment: اتصال TCP إلى المنفذ 22.',
  '2 — SSH Protocol Version Exchange: تبادل إصدار البروتوكول.',
  '3 — Key Exchange: اتفاق على مفاتيح الجلسة.',
  '4 — Server Authentication: العميل يتحقق من هوية الخادم عبر Host Key.',
  '5 — Encryption Setup: تفعيل خوارزميات التشفير للجلسة.',
  '6 — User Authentication: التحقق من المستخدم وكلمة المرور.',
  '7 — Secure Interactive Session: جلسة أوامر مشفرة.',
]

export function SshConnectionLifecycleDiagram() {
  const playback = useStepPlayback(lifecycleStages.length)
  const s = playback.stage
  const labels = ['TCP connect', 'Version exchange', 'Key exchange', 'Server auth', 'Encryption', 'User auth', 'Secure session']
  return (
    <StepShell title="SSH CONNECTION LIFECYCLE" playback={playback} legend={lifecycleStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Animated SSH connection lifecycle through seven steps">
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
            </g>
          )
        })}
        <Badge x={190} y={375} text="Simplified educational flow — details vary by implementation" color="#a78bfa" active w={540} />
      </svg>
    </StepShell>
  )
}

const portModes: ProtocolMode[] = [
  { id: '22', label: 'TCP 22', port: 'SSH', detail: 'المنفذ الافتراضي لـ SSH. الاتصال مشفر، ويُستخدم للإدارة الآمنة للجهاز.', color: '#34d399' },
  { id: '23', label: 'TCP 23', port: 'Telnet', detail: 'المنفذ الافتراضي لـ Telnet. البيانات تنتقل بدون تشفير، لذلك لا يُفضل للإدارة الآمنة.', color: '#fb7185' },
]

export function TcpPort22Diagram() {
  const [selected, setSelected] = useState('22')
  const item = portModes.find((entry) => entry.id === selected) ?? portModes[0]
  const controls = <ChoiceButtons items={portModes.map((entry) => ({ id: entry.id, label: entry.label }))} selected={selected} onSelect={setSelected} />
  return (
    <ChoiceShell title="TCP PORT 22 CONNECTION" controls={controls} legend={`**${item.port}** — \`${item.label}\`. ${item.detail}`}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="TCP port 22 versus TCP port 23 connection selector">
        <Box x={60} y={160} w={220} h={95} title="Client" sub="Initiates connection" color="#38bdf8" active />
        <Box x={370} y={160} w={180} h={95} title={item.label} sub={item.label === 'SSH' ? 'Encrypted' : 'Plaintext'} color={item.color} active />
        <Box x={620} y={160} w={230} h={95} title="Cisco Device" sub="VTY line listener" color="#34d399" active />
        <LinkLine x1={280} y1={207} x2={370} y2={207} color={item.color} active />
        <LinkLine x1={550} y1={207} x2={620} y2={207} color={item.color} active />
        <FlowDot x1={280} y1={207} x2={620} y2={207} color={item.color} active />
        <Badge x={260} y={320} text={`Destination port: ${item.label === 'SSH' ? '22' : '23'}`} color={item.color} active w={360} />
      </svg>
    </ChoiceShell>
  )
}

const keyExchangeStages = [
  'العميل والخادم يبدآن اتصالاً ويتبادلان إصدارات SSH.',
  'تتم عملية Key Exchange لاتفاق على مفاتيح الجلسة.',
  'الخادم يقدم هويته (Host Key) ليساعد العميل على التحقق منه.',
  'تُفعّل خوارزميات التشفير لحماية البيانات.',
  'بعدها فقط تتم مصادقة المستخدم داخل الجلسة المشفرة.',
]

export function SshKeyExchangeDiagram() {
  const playback = useStepPlayback(keyExchangeStages.length)
  const s = playback.stage
  return (
    <StepShell title="SSH KEY EXCHANGE (CONCEPTUAL)" playback={playback} legend={keyExchangeStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Conceptual SSH key exchange between client and server">
        <Box x={60} y={160} w={220} h={95} title="SSH Client" sub="Verifies host" color="#38bdf8" active />
        <Box x={640} y={160} w={220} h={95} title="SSH Server" sub="Presents host key" color="#34d399" active={s >= 2} />
        <LinkLine x1={280} y1={207} x2={640} y2={207} color="#f59e0b" active={s >= 1} />
        {s >= 1 && <FlowDot x1={280} y1={207} x2={640} y2={207} color="#f59e0b" active />}
        {s >= 2 && <Badge x={270} y={100} text="Host key = server identity" color="#a78bfa" active w={370} />}
        {s >= 3 && <Badge x={270} y={320} text="Session keys → encrypted channel" color="#f59e0b" active w={370} />}
      </svg>
    </StepShell>
  )
}

interface KeyPart {
  id: string
  label: string
  detail: string
  color: string
}

const keyParts: KeyPart[] = [
  { id: 'public', label: 'Public Key', detail: 'جزء يمكن مشاركته؛ يُستخدم في التحقق من هوية الخادم وضمن تبادل المفاتيح. لا يمثل سراً.', color: '#34d399' },
  { id: 'private', label: 'Private Key', detail: 'جزء سري يجب ألا يخرج من الجهاز ولا يُعرض في الأمثلة. فقدانه أو تسريبه يضعف أمن الجهاز.', color: '#fb7185' },
]

export function RsaKeyPairDiagram() {
  const [selected, setSelected] = useState('public')
  const item = keyParts.find((entry) => entry.id === selected) ?? keyParts[0]
  const controls = <ChoiceButtons items={keyParts.map((entry) => ({ id: entry.id, label: entry.label }))} selected={selected} onSelect={setSelected} />
  return (
    <ChoiceShell title="RSA PUBLIC / PRIVATE KEY EXPLORER" controls={controls} legend={`**${item.label}** — ${item.detail}`}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="RSA public and private key pair explorer without real key material">
        <Box x={60} y={100} w={340} h={120} title="PUBLIC KEY" sub="Shareable · symbolic only" color="#34d399" active={selected === 'public'} />
        <Box x={520} y={100} w={340} h={120} title="PRIVATE KEY" sub="Secret · never displayed" color="#fb7185" active={selected === 'private'} />
        <Box x={330} y={270} w={260} h={85} title="RSA key pair" sub="Generated together on device" color="#a78bfa" active />
        <LinkLine x1={230} y1={220} x2={420} y2={270} color="#34d399" active />
        <LinkLine x1={690} y1={220} x2={500} y2={270} color="#fb7185" active />
        <Badge x={210} y={385} text="No real key material is shown in this lesson" color="#f59e0b" active w={500} />
      </svg>
    </ChoiceShell>
  )
}

const keySizes = [
  { id: '512', label: '512', detail: 'موجود في بعض البيئات القديمة لكنه غير موصى به للأمان الحديث.', color: '#fb7185' },
  { id: '1024', label: '1024', detail: 'كان شائعاً قديماً؛ الدعم والتوصية يعتمدان على IOS والسياسة.', color: '#f59e0b' },
  { id: '2048', label: '2048', detail: 'اختيار تعليمي شائع عند دعم المنصة له؛ يوازن بين الأمان والأداء.', color: '#34d399' },
  { id: '4096', label: '4096', detail: 'أقوى แต่ أثقل؛ الدعم يعتمد على IOS Version والمنصة.', color: '#a78bfa' },
]

export function RsaKeySizeExplorerDiagram() {
  const [selected, setSelected] = useState('2048')
  const item = keySizes.find((entry) => entry.id === selected) ?? keySizes[2]
  const controls = <ChoiceButtons items={keySizes.map((entry) => ({ id: entry.id, label: `${entry.label}-bit` }))} selected={selected} onSelect={setSelected} />
  return (
    <ChoiceShell title="RSA KEY SIZE EXPLORER" controls={controls} legend={`**${item.label}-bit** — ${item.detail} المدعوم والموصى به يعتمد على IOS Version والمنصة وسياسات الأمان.`}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="RSA key size explorer for 512 1024 2048 and 4096 bits">
        {keySizes.map((entry, index) => {
          const x = 40 + index * 220
          const active = entry.id === selected
          return (
            <g key={entry.id}>
              <rect x={x} y={130} width={200} height={160} rx="10" fill="#0b1224" stroke={active ? '#f59e0b' : '#334155'} strokeWidth={active ? 2.4 : 1.2} opacity={active ? 1 : 0.5} />
              <SvgText x={x + 100} y={190} color={active ? '#fbbf24' : '#94a3b8'} size={18} bold>{entry.label}</SvgText>
              <SvgText x={x + 100} y={220} color={active ? '#fbbf24' : '#64748b'} size={9}>bits</SvgText>
              <rect x={x + 30} y={250} width={140} height={14} rx="6" fill="#0f2338" />
              <rect x={x + 30} y={250} width={20 + index * 40} height={14} rx="6" fill={entry.color} opacity={active ? 0.95 : 0.4} />
            </g>
          )
        })}
        <Badge x={230} y={350} text="Example: crypto key generate rsa modulus 2048" color="#38bdf8" active w={470} />
      </svg>
    </ChoiceShell>
  )
}

interface AuthState {
  id: string
  label: string
  detail: string
  color: string
}

const authStates: AuthState[] = [
  { id: 'success', label: 'Successful login', detail: 'اسم المستخدم وكلمة المرور يطابقان Local User Database؛ يُمنح الوصول حسب الصلاحيات.', color: '#34d399' },
  { id: 'fail', label: 'Failed login', detail: 'بيانات الدخول غير صحيحة؛ يُرفض الوصول وتُسجَّل محاولة فاشلة حسب المنصة.', color: '#fb7185' },
]

export function LocalAuthenticationFlowDiagram() {
  const [selected, setSelected] = useState('success')
  const item = authStates.find((entry) => entry.id === selected) ?? authStates[0]
  const controls = <ChoiceButtons items={authStates.map((entry) => ({ id: entry.id, label: entry.label }))} selected={selected} onSelect={setSelected} />
  return (
    <ChoiceShell title="LOCAL AUTHENTICATION FLOW" controls={controls} legend={`**${item.label}** — ${item.detail}`}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Interactive SSH local authentication flow for success and failure">
        <Box x={50} y={160} w={170} h={90} title="SSH client" sub="Connect" color="#38bdf8" active />
        <Box x={270} y={160} w={170} h={90} title="Host identity" sub="Server auth" color="#a78bfa" active />
        <Box x={490} y={160} w={170} h={90} title="Credentials" sub="User + password" color="#f59e0b" active />
        <Box x={710} y={160} w={170} h={90} title={item.label} sub="Local DB check" color={item.color} active />
        <LinkLine x1={220} y1={205} x2={270} y2={205} color="#38bdf8" active />
        <LinkLine x1={440} y1={205} x2={490} y2={205} color="#a78bfa" active />
        <LinkLine x1={660} y1={205} x2={710} y2={205} color={item.color} active />
        <FlowDot x1={220} y1={205} x2={710} y2={205} color={item.color} active />
        <Badge x={250} y={320} text={selected === 'success' ? 'Access granted — secure session opens' : 'Access denied — retry or block'} color={item.color} active w={430} />
      </svg>
    </ChoiceShell>
  )
}

const authRoles: AuthState[] = [
  { id: 'server', label: 'Server authentication', detail: 'العميل يتحقق من هوية خادم SSH عبر Host Key؛ يساعد على منع الاتصال بخادم مزيف.', color: '#a78bfa' },
  { id: 'user', label: 'User authentication', detail: 'الجهاز يتحقق من اسم المستخدم وكلمة المرور عبر Local Database أو AAA؛ يحدد من يُسمح له بالدخول.', color: '#f59e0b' },
]

export function SshServerVsUserAuthDiagram() {
  const [selected, setSelected] = useState('server')
  const item = authRoles.find((entry) => entry.id === selected) ?? authRoles[0]
  const controls = <ChoiceButtons items={authRoles.map((entry) => ({ id: entry.id, label: entry.label }))} selected={selected} onSelect={setSelected} />
  return (
    <ChoiceShell title="SERVER AUTH vs USER AUTH" controls={controls} legend={`**${item.label}** — ${item.detail}`}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="SSH server authentication compared with user authentication">
        <Box x={60} y={110} w={350} h={160} title="Server Authentication" sub="Host key · server identity" color="#a78bfa" active={selected === 'server'} />
        <Box x={510} y={110} w={350} h={160} title="User Authentication" sub="Username · password · local DB" color="#f59e0b" active={selected === 'user'} />
        <Box x={60} y={310} w={350} h={65} title={selected === 'server' ? 'Client verifies server' : 'Not the same step'} sub={selected === 'server' ? 'Occurs before encryption is used' : 'Do not confuse with host keys'} color="#38bdf8" active />
        <Box x={510} y={310} w={350} h={65} title={selected === 'user' ? 'Device verifies user' : 'Not the same step'} sub={selected === 'user' ? 'login local checks credentials' : 'Do not confuse with RSA keys'} color="#34d399" active />
      </svg>
    </ChoiceShell>
  )
}

const vtyStages = [
  'VTY Lines هي خطوط افتراضية (Virtual Terminal Lines) تستخدمها الاتصالات عن بُعد.',
  'Console Line مختلف: اتصال فعلي بالجهاز ولا يعتمد على الشبكة.',
  '`line vty 0 4` يضبط مجموعة من خمسة خطوط افتراضية في مثال شائع.',
  'عدد VTY Lines يختلف حسب الجهاز والمنصة؛ الرقم 0 4 ليس قاعدة ثابتة.',
  'عند وصول اتصال SSH يختار الجهاز خط VTY متاحاً ويطبق عليه أوامر مثل `login local`.',
]

export function VtyLinesArchitectureDiagram() {
  const playback = useStepPlayback(vtyStages.length)
  const s = playback.stage
  return (
    <StepShell title="VTY LINES ARCHITECTURE" playback={playback} legend={vtyStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="VTY lines architecture for remote SSH access">
        <Box x={60} y={160} w={190} h={90} title="Remote user" sub="SSH client" color="#38bdf8" active />
        <Box x={330} y={160} w={200} h={90} title="VTY pool" sub="line vty 0 4 (example)" color="#f59e0b" active={s >= 2} />
        <Box x={610} y={160} w={240} h={90} title="Device" sub="IOS CLI" color="#34d399" active={s >= 4} />
        <LinkLine x1={250} y1={205} x2={330} y2={205} color="#38bdf8" active />
        <LinkLine x1={530} y1={205} x2={610} y2={205} color="#f59e0b" active={s >= 4} />
        {[0,1,2,3,4].map((line) => (
          <rect key={line} x={350 + line * 34} y={285} width={26} height={38} rx="5" fill="#0f2338" stroke={s >= 2 ? '#f59e0b' : '#334155'} opacity={0.9} />
        ))}
        {s >= 4 && <FlowDot x1={250} y1={205} x2={610} y2={205} color="#f59e0b" active />}
        <Badge x={200} y={370} text="One available VTY line is used per remote session" color="#a78bfa" active w={500} />
      </svg>
    </StepShell>
  )
}

const vtyConfigStages = [
  'Step 1 — اضبط hostname وdomain name؛ يحتاجهما توليد RSA key.',
  'Step 2 — أنشئ local user بصلاحية وكلمة مرور قوية.',
  'Step 3 — ولّد RSA key pair وفعّل SSH version 2.',
  'Step 4 — ادخل `line vty 0 4` واضبط `login local`.',
  'Step 5 — اضبط `transport input ssh` للسماح بـ SSH فقط.',
  'Step 6 — تحقق بـ `show ip ssh` و`show ssh` و`show users`.',
]

export function VtyConfigFlowDiagram() {
  const playback = useStepPlayback(vtyConfigStages.length)
  const s = playback.stage
  const commands = [
    'hostname R1 · ip domain-name ccna.local',
    'username admin privilege 15 secret ...',
    'crypto key generate rsa modulus 2048 · ip ssh version 2',
    'line vty 0 4 · login local',
    'transport input ssh',
    'show ip ssh · show ssh · show users',
  ]
  return (
    <StepShell title="VTY CONFIGURATION FLOW" playback={playback} legend={vtyConfigStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="SSH VTY configuration flow on Cisco IOS">
        {commands.map((command, index) => {
          const y = 40 + index * 60
          const active = s === index
          const done = s > index
          return (
            <g key={command} opacity={active || done ? 1 : 0.38}>
              <rect x={120} y={y} width={680} height={42} rx="8" fill="#0b1224" stroke={active ? '#f59e0b' : done ? '#34d399' : '#334155'} strokeWidth={active ? 2.3 : 1.2} />
              <SvgText x={460} y={y + 26} color={active ? '#fbbf24' : done ? '#6ee7b7' : '#cbd5e1'} size={8.2} bold>{command}</SvgText>
            </g>
          )
        })}
      </svg>
    </StepShell>
  )
}

const sshVersions: AuthState[] = [
  { id: 'v1', label: 'SSHv1', detail: 'إصدار أقدم؛ يعتبر أضعف أمنياً ولا يُفضل للإدارة الحديثة.', color: '#fb7185' },
  { id: 'v2', label: 'SSHv2', detail: 'الإصدار المطلوب؛ تحسينات في المصادقة والتشفير وسلامة البيانات. استخدم `ip ssh version 2`.', color: '#34d399' },
]

export function SshVersionComparisonDiagram() {
  const [selected, setSelected] = useState('v2')
  const item = sshVersions.find((entry) => entry.id === selected) ?? sshVersions[1]
  const controls = <ChoiceButtons items={sshVersions.map((entry) => ({ id: entry.id, label: entry.label }))} selected={selected} onSelect={setSelected} />
  return (
    <ChoiceShell title="SSH VERSION COMPARISON" controls={controls} legend={`**${item.label}** — ${item.detail}`}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="SSH version 1 versus version 2 comparison">
        <Box x={60} y={100} w={360} h={170} title="SSHv1" sub="Older · weaker" color="#fb7185" active={selected === 'v1'} />
        <Box x={500} y={100} w={360} h={170} title="SSHv2" sub="Preferred · stronger" color="#34d399" active={selected === 'v2'} />
        <Badge x={240} y={320} text="Verify with: show ip ssh" color="#f59e0b" active w={380} />
      </svg>
    </ChoiceShell>
  )
}

interface VerifyInfo {
  id: string
  label: string
  detail: string
}

const verifyCommands: VerifyInfo[] = [
  { id: 'ipssh', label: 'show ip ssh', detail: 'يؤكد أن SSH مُفعّل ويعرض الإصدار ومهلة المصادقة وعدد المحاولات حسب المنصة.' },
  { id: 'ssh', label: 'show ssh', detail: 'يعرض جلسات SSH الحالية وحالاتها.' },
  { id: 'key', label: 'show crypto key mypubkey rsa', detail: 'يعرض معلومات مفتاح RSA العام؛ لا يعرض المفتاح الخاص.' },
  { id: 'users', label: 'show users', detail: 'يعرض المستخدمين المتصلين والخطوط التي يستخدمونها.' },
  { id: 'line', label: 'show line', detail: 'يعرض حالة VTY Lines والخطوط الأخرى.' },
]

export function SshVerificationDashboardDiagram() {
  const [selected, setSelected] = useState('ipssh')
  const item = verifyCommands.find((entry) => entry.id === selected) ?? verifyCommands[0]
  const controls = <ChoiceButtons items={verifyCommands.map((entry) => ({ id: entry.id, label: entry.label }))} selected={selected} onSelect={setSelected} />
  return (
    <ChoiceShell title="SSH VERIFICATION DASHBOARD" controls={controls} legend={`**\`${item.label}\`** — ${item.detail} القيم المعروضة تعليمية وقد تختلف حسب IOS Version والإعدادات.`}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Interactive SSH verification command dashboard">
        <Box x={60} y={90} w={380} h={130} title="Command" sub={item.label} color="#38bdf8" active />
        <Box x={500} y={90} w={360} h={130} title="What to look for" sub={item.id === 'ipssh' ? 'SSH Enabled - version 2.0' : item.id === 'ssh' ? 'Active sessions' : item.id === 'key' ? 'Public key info only' : item.id === 'users' ? 'Connected users + lines' : 'VTY line status'} color="#34d399" active />
        <Badge x={120} y={280} text="show ip ssh → SSH Enabled - version 2.0 (educational)" color="#f59e0b" active w={520} />
        <Badge x={240} y={345} text="Output values vary by platform and configuration" color="#a78bfa" active w={440} />
      </svg>
    </ChoiceShell>
  )
}

interface AclHost {
  id: string
  label: string
  ip: string
  allowed: boolean
  detail: string
}

const aclHosts: AclHost[] = [
  { id: 'mgmt', label: 'Management PC', ip: '192.168.1.10', allowed: true, detail: 'مطابق لـ `access-list 10 permit 192.168.1.10`؛ يُسمح باتصال SSH عبر `access-class 10 in`.' },
  { id: 'other', label: 'Other host', ip: '192.168.1.50', allowed: false, detail: 'غير مسموح به في ACL؛ يُرفض اتصال SSH رغم صحة كلمة المرور.' },
]

export function VtyAclRestrictionDiagram() {
  const [selected, setSelected] = useState('mgmt')
  const item = aclHosts.find((entry) => entry.id === selected) ?? aclHosts[0]
  const controls = <ChoiceButtons items={aclHosts.map((entry) => ({ id: entry.id, label: entry.label }))} selected={selected} onSelect={setSelected} />
  return (
    <ChoiceShell title="VTY ACCESS RESTRICTION USING ACL" controls={controls} legend={`**${item.ip}** — ${item.detail} الصيغة والدعم قد يختلفان حسب IOS Platform.`}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="VTY access restriction with ACL allow and deny">
        <Box x={60} y={160} w={210} h={90} title={item.label} sub={item.ip} color="#38bdf8" active />
        <Box x={350} y={160} w={210} h={90} title="ACL 10" sub="access-class 10 in" color="#a78bfa" active />
        <Box x={650} y={160} w={210} h={90} title={item.allowed ? 'Permitted' : 'Denied'} sub="VTY + SSH" color={item.allowed ? '#34d399' : '#fb7185'} active />
        <LinkLine x1={270} y1={205} x2={350} y2={205} color="#38bdf8" active />
        <LinkLine x1={560} y1={205} x2={650} y2={205} color={item.allowed ? '#34d399' : '#fb7185'} active />
        {item.allowed && <FlowDot x1={270} y1={205} x2={650} y2={205} color="#34d399" active />}
        <Badge x={230} y={320} text="ACL limits which management hosts may reach VTY" color="#f59e0b" active w={480} />
      </svg>
    </ChoiceShell>
  )
}

interface SshIssue {
  id: string
  label: string
  detail: string
}

const sshIssues: SshIssue[] = [
  { id: 'connect', label: 'IP connectivity', detail: 'افحص `show ip interface brief` و`show ip route`؛ تأكد من عنوان IP صحيح ومسار إلى العميل.' },
  { id: 'server', label: 'SSH server', detail: 'تحقق بـ `show ip ssh`؛ إذا لم يكن SSH مُفعّلاً راجع المتطلبات والأوامر.' },
  { id: 'keys', label: 'RSA keys', detail: 'استخدم `show crypto key mypubkey rsa`؛ غياب المفتاح يعني أنه لم يُولَّد.' },
  { id: 'version', label: 'SSH version', detail: 'تأكد من `ip ssh version 2`؛ SSHv1 غير مفضل.' },
  { id: 'creds', label: 'Credentials', detail: 'راجع `username ... secret` و`login local`؛ خطأ الاسم أو كلمة المرور يمنع الدخول.' },
  { id: 'vty', label: 'VTY lines', detail: 'افحص `show line`؛ تأكد من ضبط `line vty` وعدم استنفاد الخطوط.' },
  { id: 'transport', label: 'Transport input', detail: 'تأكد من `transport input ssh`؛ وجود Telnet أو `all` يفتح وصولاً غير آمن.' },
  { id: 'acl', label: 'ACL', detail: 'راجع `access-class`؛ قد تكون ACL تمنع عنوان Management PC.' },
  { id: 'port', label: 'TCP 22', detail: 'تأكد من السماح بـ TCP 22 عبر المسار والـ firewall.' },
]

export function SshTroubleshootingFlowDiagram() {
  const [selected, setSelected] = useState('keys')
  const item = sshIssues.find((entry) => entry.id === selected) ?? sshIssues[1]
  const controls = <ChoiceButtons items={sshIssues.map((entry) => ({ id: entry.id, label: entry.label }))} selected={selected} onSelect={setSelected} />
  return (
    <ChoiceShell title="SSH TROUBLESHOOTING DECISION TREE" controls={controls} legend={`**SSH Connection Failed** → ${item.detail}`}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Interactive SSH troubleshooting decision tree">
        <Box x={340} y={20} w={240} h={60} title="SSH Failed" sub="Start here" color="#f59e0b" active />
        <LinkLine x1={460} y1={80} x2={460} y2={118} color="#f59e0b" active />
        <LinkLine x1={110} y1={118} x2={810} y2={118} color="#475569" active />
        {sshIssues.map((entry, index) => {
          const x = 15 + (index % 3) * 300
          const y = 150 + Math.floor(index / 3) * 85
          const cx = x + 100
          return (
            <g key={entry.id}>
              <LinkLine x1={cx} y1={118} x2={cx} y2={y} color={selected === entry.id ? '#f59e0b' : '#475569'} active={selected === entry.id} />
              <ClickNode x={x} y={y} w={200} h={65} title={entry.label} sub="Check" color="#38bdf8" selected={selected === entry.id} onClick={() => setSelected(entry.id)} />
            </g>
          )
        })}
      </svg>
    </ChoiceShell>
  )
}

const topologyStages = [
  'Administrator PC بعنوان 192.168.1.10 يبدأ اتصال SSH.',
  'الاتصال يمر عبر Switch إلى الراوتر 192.168.1.1.',
  'الوجهة هي TCP Port 22 على جهاز يعمل كـ SSH Server.',
  'الراوتر يستقبل الاتصال على VTY Line متاح.',
  'بعد نجاح المصادقة يُفتح جلسة CLI مشفرة للإدارة.',
]

export function SecureManagementTopologyDiagram() {
  const playback = useStepPlayback(topologyStages.length)
  const s = playback.stage
  return (
    <StepShell title="SECURE REMOTE MANAGEMENT TOPOLOGY" playback={playback} legend={topologyStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Secure remote management topology with administrator PC switch and router">
        <Box x={50} y={160} w={210} h={90} title="Admin PC" sub="192.168.1.10" color="#38bdf8" active />
        <Box x={380} y={160} w={150} h={90} title="Switch" sub="L2 path" color="#64748b" active={s >= 1} />
        <Box x={650} y={160} w={220} h={90} title="Router" sub="192.168.1.1 · SSH server" color="#34d399" active={s >= 2} />
        <LinkLine x1={260} y1={205} x2={380} y2={205} color="#38bdf8" active={s >= 1} />
        <LinkLine x1={530} y1={205} x2={650} y2={205} color="#f59e0b" active={s >= 2} />
        {s >= 2 && <FlowDot x1={260} y1={205} x2={650} y2={205} color="#f59e0b" active />}
        {s >= 3 && <Badge x={280} y={310} text="VTY line → login local → transport input ssh" color="#a78bfa" active w={420} />}
      </svg>
    </StepShell>
  )
}

const configLifecycleStages = [
  '1 — Hostname وdomain name: متطلبان لتوليد RSA key.',
  '2 — Local user بكلمة مرور قوية داخل الجهاز.',
  '3 — RSA key pair وSSH version 2.',
  '4 — VTY lines مع `login local` و`transport input ssh`.',
  '5 — ACL اختيارية لتقييد عناوين الإدارة.',
  '6 — تحقق بـ `show ip ssh` واختبار تسجيل دخول من العميل.',
]

export function SshConfigLifecycleDiagram() {
  const playback = useStepPlayback(configLifecycleStages.length)
  const s = playback.stage
  const labels = ['Identity', 'Local user', 'RSA + v2', 'VTY lines', 'ACL', 'Verify']
  return (
    <StepShell title="COMPLETE SSH CONFIGURATION LIFECYCLE" playback={playback} legend={configLifecycleStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Complete SSH configuration lifecycle on Cisco IOS">
        {labels.map((label, index) => (
          <g key={label}>
            <motion.g animate={{ opacity: s >= index ? 1 : 0.32 }} transition={{ duration: 0.3 }}>
              <rect x={30 + index * 150} y={170} width={130} height={72} rx="9" fill="#0b1224" stroke={s === index ? '#f59e0b' : s > index ? '#34d399' : '#475569'} strokeWidth={s === index ? 2.4 : 1.2} />
              <SvgText x={95 + index * 150} y={212} color={s === index ? '#fbbf24' : s > index ? '#6ee7b7' : '#cbd5e1'} size={8.4} bold>{label}</SvgText>
            </motion.g>
            {index < labels.length - 1 && <LinkLine x1={160 + index * 150} y1={206} x2={180 + index * 150} y2={206} color="#475569" active={s > index} />}
          </g>
        ))}
        {s >= 5 && <Badge x={210} y={320} text="SSHv2 + keys + local auth + SSH-only VTY = secure management" color="#34d399" active w={510} />}
      </svg>
    </StepShell>
  )
}

interface BuilderState {
  id: string
  label: string
  ok: boolean
  detail: string
}

const transportChoices: BuilderState[] = [
  { id: 'ssh', label: 'transport input ssh', ok: true, detail: 'صحيح: يسمح بـ SSH فقط على VTY Lines.' },
  { id: 'telnet', label: 'transport input telnet', ok: false, detail: 'غير آمن: يسمح بـ Telnet فقط؛ البيانات بدون تشفير.' },
  { id: 'all', label: 'transport input all', ok: false, detail: 'غير آمن للإدارة: يسمح بـ Telnet وSSH معاً.' },
]

export function SshConfigBuilderDiagram() {
  const [transport, setTransport] = useState('telnet')
  const [auth, setAuth] = useState('local')
  const item = transportChoices.find((entry) => entry.id === transport) ?? transportChoices[1]
  const valid = item.ok && auth === 'local'
  const controls = (
    <div className="flex flex-wrap items-center justify-end gap-2">
      <ChoiceButtons items={transportChoices.map((entry) => ({ id: entry.id, label: entry.label }))} selected={transport} onSelect={setTransport} />
      <ChoiceButtons items={[{ id: 'local', label: 'login local' }, { id: 'none', label: 'no login local' }]} selected={auth} onSelect={setAuth} />
    </div>
  )
  const legend = valid
    ? '**SECURE:** `transport input ssh` مع `login local` يوفران وصولاً مشفراً بمصادقة محلية.'
    : `**INSECURE:** ${item.ok ? '' : `${item.detail} `}${auth === 'local' ? '' : 'بدون `login local` لا تتحقق الجهاز من هوية المستخدم عبر قاعدة Local.'}`
  return (
    <ChoiceShell title="SSH CONFIGURATION BUILDER" controls={controls} legend={legend}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Interactive SSH configuration builder for VTY transport and authentication">
        <Box x={60} y={90} w={390} h={200} title="Current VTY Config" sub={`line vty 0 4 → ${item.label}`} color="#38bdf8" active />
        <SvgText x={255} y={185} color={auth === 'local' ? '#34d399' : '#fb7185'} size={9} bold>{auth === 'local' ? 'login local' : 'no login local'}</SvgText>
        <Box x={500} y={90} w={360} h={200} title={valid ? 'SECURE CONFIG' : 'INSECURE CONFIG'} sub={valid ? 'SSH-only + local auth' : 'Fix highlighted fields'} color={valid ? '#34d399' : '#fb7185'} active />
        <Badge x={210} y={345} text={valid ? 'Encrypted session with local credentials' : 'Telnet or missing login local weakens management'} color={valid ? '#34d399' : '#fb7185'} active w={500} />
      </svg>
    </ChoiceShell>
  )
}
