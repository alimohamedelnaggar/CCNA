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
      <SvgText x={x + w / 2} y={y + 24} color={selected ? '#fbbf24' : color} size={9} bold>{title}</SvgText>
      <SvgText x={x + w / 2} y={y + h - 11} color="#cbd5e1" size={7.5}>{sub}</SvgText>
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

function SelectorBoard({ items, selected, onSelect, focusTitle, columns = 4 }: {
  items: InfoItem[]
  selected: string
  onSelect: (id: string) => void
  focusTitle: string
  columns?: number
}) {
  const item = items.find((entry) => entry.id === selected) ?? items[0]
  const gapX = columns === 4 ? 225 : 420
  const width = columns === 4 ? 200 : 300
  const startX = columns === 4 ? 20 : 110
  return (
    <svg viewBox="0 0 920 400" className="h-auto w-full min-w-[880px]" role="img" aria-label={`${focusTitle} interactive selector`}>
      <Badge x={210} y={18} text={focusTitle} color="#a78bfa" active w={500} />
      {items.map((entry, index) => {
        const col = index % columns
        const row = Math.floor(index / columns)
        const x = startX + col * gapX
        const y = 105 + row * 82
        return (
          <ClickNode
            key={entry.id}
            x={x}
            y={y}
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
      <Badge x={110} y={350} text={`SELECTED: ${item.label} - ${item.sub}`} color={item.color} active w={700} />
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
        const y = 95 + row * 85
        const done = index < stage
        const active = index === stage
        return (
          <motion.g key={label} animate={{ opacity: active ? 1 : done ? 0.78 : 0.4 }} transition={{ duration: 0.3 }}>
            <rect x={x} y={y} width={width} height={62} rx="9" fill="#0b1224" stroke={active ? '#f59e0b' : done ? '#34d399' : '#475569'} strokeWidth={active ? 2.4 : 1.2} />
            <SvgText x={x + width / 2} y={y + 25} color={active ? '#fbbf24' : done ? '#6ee7b7' : '#cbd5e1'} size={8.8} bold>{`${index + 1}. ${label}`}</SvgText>
            <SvgText x={x + width / 2} y={y + 46} color="#94a3b8" size={7.4}>{active ? 'current stage' : done ? 'completed' : 'upcoming'}</SvgText>
          </motion.g>
        )
      })}
      <Badge x={190} y={350} text="Educational simulation - no attack is executed" color="#fb7185" active w={540} />
    </svg>
  )
}

const overviewStages = [
  'Network Security يحمي الأصول والمعلومات والخدمات من الوصول غير المصرح والتلاعب والانقطاع.',
  'الأصول تشمل Network Devices وServers وEndpoints وCredentials وNetwork Traffic وConfiguration Files.',
  'التهديدات والضعف والمخاطر تلتقي عند نقطة Must be managed؛ لا يوجد نظام آمن بنسبة 100%.',
  'Data Security تركز على البيانات نفسها؛ Network Security تركز على المسارات والأجهزة والوصول.',
  'الحماية تعتمد على طبقات: Policies وAccess Control وEndpoint وNetwork وData.',
]

export function SecurityOverviewDiagram() {
  const playback = useStepPlayback(overviewStages.length)
  const s = playback.stage
  return (
    <StepShell title="NETWORK SECURITY OVERVIEW" playback={playback} legend={overviewStages[s]}>
      <svg viewBox="0 0 920 400" className="h-auto w-full min-w-[880px]" role="img" aria-label="Network security overview connecting internet security controls and protected assets">
        <Box x={40} y={150} w={180} h={90} title="Internet" sub="untrusted networks" color="#fb7185" active />
        <Box x={290} y={150} w={220} h={90} title="Security Controls" sub="firewall, ACL, auth" color="#a78bfa" active={s >= 2} />
        <Box x={590} y={150} w={280} h={90} title="Protected Assets" sub="devices, data, services" color="#34d399" active={s >= 1} />
        <LinkLine x1={220} y1={195} x2={290} y2={195} color="#fb7185" active />
        <LinkLine x1={510} y1={195} x2={590} y2={195} color="#34d399" active={s >= 2} />
        <FlowDot x1={220} y1={195} x2={590} y2={195} color="#f59e0b" active={s >= 3} />
        {s >= 4 && <Badge x={190} y={320} text="Defense in Depth: no single control is enough" color="#38bdf8" active w={540} />}
      </svg>
    </StepShell>
  )
}

const assetItems: InfoItem[] = [
  { id: 'devices', label: 'Network Devices', sub: 'routers, switches', detail: 'الأجهزة التي توجه الشبكة؛ حمايتها تمنع تعطيل المسارات أو تغيير الإعدادات.', color: '#38bdf8' },
  { id: 'servers', label: 'Servers', sub: 'apps and storage', detail: 'الخوادم التي تستضيف التطبيقات والبيانات؛ غالباً هدف ذو قيمة عالية.', color: '#34d399' },
  { id: 'endpoints', label: 'Endpoints', sub: 'PCs, phones', detail: 'أجهزة المستخدمين؛ قد تكون نقطة دخول إلى الشبكة الداخلية.', color: '#a78bfa' },
  { id: 'credentials', label: 'Credentials', sub: 'users, admins', detail: 'كلمات المرور والمفاتيح؛ تسريبها قد يمنح وصولاً غير مصرح به.', color: '#fb7185' },
  { id: 'data', label: 'Sensitive Data', sub: 'customer records', detail: 'المعلومات السرية أو الشخصية التي تتطلب حماية من الإفشاء والتعديل.', color: '#f59e0b' },
  { id: 'traffic', label: 'Network Traffic', sub: 'packets, sessions', detail: 'التدفق نفسه قد يُراقَب أو يُعترض؛ يهمه السرية والسلامة والتوفر.', color: '#22d3ee' },
  { id: 'configs', label: 'Config Files', sub: 'device configs', detail: 'ملفات الإعداد؛ تغييرها غير المصرح يؤثر على سلوك الشبكة بالكامل.', color: '#818cf8' },
  { id: 'apps', label: 'Business Apps', sub: 'critical services', detail: 'التطبيقات التي يحتاجها العمل؛ توقفها يؤثر مباشرة على الاستمرارية.', color: '#4ade80' },
]

export function SecurityAssetsExplorerDiagram() {
  const [selected, setSelected] = useState('devices')
  const item = assetItems.find((entry) => entry.id === selected) ?? assetItems[0]
  const controls = <ChoiceButtons items={assetItems.map((entry) => ({ id: entry.id, label: entry.label }))} selected={selected} onSelect={setSelected} />
  return (
    <ChoiceShell title="SECURITY ASSETS EXPLORER" controls={controls} legend={`**${item.label}** — ${item.detail}`}>
      <SelectorBoard items={assetItems} selected={selected} onSelect={setSelected} focusTitle="WHAT ARE WE PROTECTING?" />
    </ChoiceShell>
  )
}

const threatItems: InfoItem[] = [
  { id: 'internal', label: 'Internal', sub: 'inside the organization', detail: 'موظف ضار أو وصول داخلي غير مصرح أو إفشاء بالخطأ أو إساءة استخدام صلاحيات.', color: '#fb7185' },
  { id: 'external', label: 'External', sub: 'outside the organization', detail: 'مهاجمون خارجيون أو مجرمون إلكترونيون أو هجمات آلية أو وصول عن بُعد غير مصرح.', color: '#38bdf8' },
  { id: 'human', label: 'Human', sub: 'people and behavior', detail: 'Social Engineering وPhishing وسرقة Credentials والتهديد الداخلي.', color: '#a78bfa' },
  { id: 'technical', label: 'Technical', sub: 'systems and software', detail: 'DoS وMalware واستغلال ثغرات الشبكة والوصول غير المصرح.', color: '#f59e0b' },
  { id: 'physical', label: 'Physical', sub: 'real-world access', detail: 'سرقة الأجهزة أو الوصول المادي غير المصرح أو تلف العتاد أو أضرار بيئية.', color: '#34d399' },
  { id: 'accidental', label: 'Accidental', sub: 'no malicious intent', detail: 'حذف ملف بالخطأ أو إرسال بيانات لجهة خاطئة أو إعداد خاطئ؛ الضرر يقع دون قصد.', color: '#22d3ee' },
  { id: 'intentional', label: 'Intentional', sub: 'deliberate action', detail: 'فعل مقصود لإحداث ضرر أو سرقة معلومات أو تعطيل خدمة.', color: '#fb7185' },
  { id: 'natural', label: 'Natural / Environmental', sub: 'events outside control', detail: 'كوارث طبيعية أو انقطاع كهرباء أو حريق أو ظروف بيئية تهدد التوفر.', color: '#818cf8' },
]

export function ThreatCategoriesDiagram() {
  const [selected, setSelected] = useState('external')
  const item = threatItems.find((entry) => entry.id === selected) ?? threatItems[0]
  const controls = <ChoiceButtons items={threatItems.map((entry) => ({ id: entry.id, label: entry.label }))} selected={selected} onSelect={setSelected} />
  return (
    <ChoiceShell title="THREAT CATEGORIES" controls={controls} legend={`**${item.label}** — ${item.detail}`}>
      <SelectorBoard items={threatItems} selected={selected} onSelect={setSelected} focusTitle="THREAT CATEGORY EXPLORER" />
    </ChoiceShell>
  )
}

const boundaryItems: InfoItem[] = [
  { id: 'internal', label: 'Internal Threat', sub: 'origin inside', detail: 'يبدأ من داخل المؤسسة: موظف، حساب مخترق، أو مستخدم لديه صلاحيات فعلية. قد يكون مقصوداً أو بالخطأ.', color: '#fb7185' },
  { id: 'external', label: 'External Threat', sub: 'origin outside', detail: 'يبدأ من خارج الحدود الموثوقة: شبكة عامة أو شريك غير موثوق أو جهاز بعيد. الهدف غالباً وصول غير مصرح أو تعطيل خدمة.', color: '#38bdf8' },
]

export function InternalExternalThreatsDiagram() {
  const [selected, setSelected] = useState('internal')
  const item = boundaryItems.find((entry) => entry.id === selected) ?? boundaryItems[0]
  const controls = <ChoiceButtons items={boundaryItems.map((entry) => ({ id: entry.id, label: entry.label }))} selected={selected} onSelect={setSelected} />
  return (
    <ChoiceShell title="INTERNAL vs EXTERNAL THREATS" controls={controls} legend={`**${item.label}** — ${item.detail}`}>
      <svg viewBox="0 0 920 400" className="h-auto w-full min-w-[880px]" role="img" aria-label="Internal and external threat origins relative to the organization boundary">
        <Box x={55} y={110} w={350} h={140} title="ORGANIZATION" sub="trusted internal users and assets" color="#34d399" active />
        <Box x={515} y={110} w={350} h={140} title="OUTSIDE" sub="untrusted networks" color="#fb7185" active />
        <rect x={420} y={95} width={12} height={170} rx="4" fill="#f59e0b" opacity="0.7" />
        <SvgText x={426} y={285} color="#fbbf24" size={8.5} bold>SECURITY BOUNDARY</SvgText>
        {selected === 'internal' && <FlowDot x1={300} y1={180} x2={180} y2={180} color="#fb7185" active />}
        {selected === 'external' && <FlowDot x1={690} y1={180} x2={430} y2={180} color="#38bdf8" active />}
        <Badge x={200} y={330} text={selected === 'internal' ? 'Internal: source is inside the trust boundary' : 'External: source crosses the trust boundary'} color={item.color} active w={520} />
      </svg>
    </ChoiceShell>
  )
}

const termItems: InfoItem[] = [
  { id: 'threat', label: 'Threat', sub: 'possible danger', detail: 'مصدر أو احتمال خطر قد يؤثر على أصل. قد يكون مقصوداً أو عرضياً أو بيئياً.', color: '#fb7185' },
  { id: 'vulnerability', label: 'Vulnerability', sub: 'weakness', detail: 'ضعف موجود فعلاً في أصل أو إعداد أو عملية؛ يزيد احتمال تحول التهديد إلى ضرر.', color: '#f59e0b' },
  { id: 'risk', label: 'Risk', sub: 'likelihood x impact', detail: 'احتمال أن يستغل تهديدٌ ضعفاً وينتج أثراً سلبياً؛ يُستخدم لتحديد الأولويات.', color: '#a78bfa' },
  { id: 'exploit', label: 'Exploit', sub: 'means of using weakness', detail: 'الطريقة أو الكود الذي يستغل ضعفاً معروفاً. في هذا الدرس يُذكر تعريفياً فقط.', color: '#38bdf8' },
]

export function ThreatVulnerabilityRiskDiagram() {
  const [selected, setSelected] = useState('threat')
  const item = termItems.find((entry) => entry.id === selected) ?? termItems[0]
  const controls = <ChoiceButtons items={termItems.map((entry) => ({ id: entry.id, label: entry.label }))} selected={selected} onSelect={setSelected} />
  return (
    <ChoiceShell title="THREAT vs VULNERABILITY vs RISK" controls={controls} legend={`**${item.label}** — ${item.detail}`}>
      <SelectorBoard items={termItems} selected={selected} onSelect={setSelected} focusTitle="SECURITY TERMS" />
    </ChoiceShell>
  )
}

const lifecycleStages = [
  'Outdated Software: برنامج قديم غير محدث.',
  'Vulnerability Exists: الضعف موجود في النظام حتى لو لم يحدث ضرر بعد.',
  'Attacker Uses Exploit: محاولة استغلال تعليمية مفاهيمية فقط.',
  'Unauthorized Access: قد يحدث وصول غير مصرح أو تغيير غير مسموح.',
  'Security Impact: أثر على السرية أو السلامة أو التوفر.',
  'Mitigation: تصحيح الضعف وتقليل الاحتمال والأثر.',
]

export function VulnerabilityExploitLifecycleDiagram() {
  const playback = useStepPlayback(lifecycleStages.length)
  const s = playback.stage
  return (
    <StepShell title="VULNERABILITY TO EXPLOIT LIFECYCLE" playback={playback} legend={lifecycleStages[s]}>
      <StageBoard stages={['Outdated software', 'Vulnerability', 'Exploit used', 'Unauthorized access', 'Impact', 'Mitigation']} stage={s} ariaLabel="Vulnerability to exploit lifecycle animated stages" />
    </StepShell>
  )
}

const exploitImpactItems: InfoItem[] = [
  { id: 'access', label: 'Unauthorized Access', sub: 'account or system', detail: 'قد يسمح الضعف المستغل بدخول حساب أو نظام دون تصريح؛ تهديد للسرية والتحكم.', color: '#fb7185' },
  { id: 'data', label: 'Data Exposure', sub: 'read sensitive data', detail: 'قد تخرج معلومات حساسة؛ الأثر الأساسي على Confidentiality.', color: '#f59e0b' },
  { id: 'change', label: 'Data Modification', sub: 'alter records', detail: 'قد تتغير بيانات أو إعدادات دون علم؛ الأثر الأساسي على Integrity.', color: '#a78bfa' },
  { id: 'outage', label: 'Service Disruption', sub: 'service unavailable', detail: 'قد تتوقف خدمة أو يتدهور أداؤها؛ الأثر الأساسي على Availability.', color: '#38bdf8' },
]

export function ExploitImpactDiagram() {
  const [selected, setSelected] = useState('access')
  const item = exploitImpactItems.find((entry) => entry.id === selected) ?? exploitImpactItems[0]
  const controls = <ChoiceButtons items={exploitImpactItems.map((entry) => ({ id: entry.id, label: entry.label }))} selected={selected} onSelect={setSelected} />
  return (
    <ChoiceShell title="EXPLOIT IMPACT" controls={controls} legend={`**${item.label}** — ${item.detail}`}>
      <SelectorBoard items={exploitImpactItems} selected={selected} onSelect={setSelected} focusTitle="POSSIBLE RESULT OF EXPLOITATION" />
    </ChoiceShell>
  )
}

const malwareItems: InfoItem[] = [
  { id: 'virus', label: 'Virus', sub: 'infects files', detail: 'يرتبط عادةً بملف أو برنامج مضيف وينتشر عند تشغيل أو مشاركة الملف المصاب؛ قد يفسد الملفات.', color: '#f59e0b' },
  { id: 'worm', label: 'Worm', sub: 'self-propagates', detail: 'ينتشر ذاتياً بين الأجهزة مستغلاً الشبكة أو ضعفاً في البرمجيات؛ قد يسبب ازدحام الشبكة.', color: '#38bdf8' },
  { id: 'trojan', label: 'Trojan', sub: 'disguised software', detail: 'يظهر كبرنامج شرعي ليخدع المستخدم بتشغيله، ثم ينفذ وظيفة ضارة في الخلفية.', color: '#a78bfa' },
  { id: 'ransomware', label: 'Ransomware', sub: 'blocks or encrypts', detail: 'يمنع الوصول للبيانات أو يشفرها ويطلب فدية؛ يضرب Availability وغالباً السرية.', color: '#fb7185' },
  { id: 'spyware', label: 'Spyware', sub: 'secret collection', detail: 'يجمع معلومات عن المستخدم أو نشاطه دون موافقة مناسبة؛ يهدد الخصوصية والسرية.', color: '#22d3ee' },
  { id: 'adware', label: 'Adware', sub: 'unwanted ads', detail: 'يعرض إعلانات غير مرغوب فيها وقد يتتبع النشاط حسب نوعه؛ يسبب إزعاجاً ومخاطر خصوصية.', color: '#818cf8' },
  { id: 'rootkit', label: 'Rootkit', sub: 'hides activity', detail: 'يحاول إخفاء مكونات ضارة وقد يوفر وصولاً غير مصرح به؛ يجعل الاكتشاف أصعب.', color: '#4ade80' },
]

export function MalwareExplorerDiagram() {
  const [selected, setSelected] = useState('virus')
  const item = malwareItems.find((entry) => entry.id === selected) ?? malwareItems[0]
  const controls = <ChoiceButtons items={malwareItems.map((entry) => ({ id: entry.id, label: entry.label }))} selected={selected} onSelect={setSelected} />
  return (
    <ChoiceShell title="MALWARE EXPLORER" controls={controls} legend={`**${item.label}** — ${item.detail}`}>
      <SelectorBoard items={malwareItems} selected={selected} onSelect={setSelected} focusTitle="MALICIOUS SOFTWARE TYPES" />
    </ChoiceShell>
  )
}

const confusionItems: InfoItem[] = [
  { id: 'virus', label: 'Virus', sub: 'needs a host file', detail: 'لا ينتشر وحده؛ يرتبط بملف أو برنامج ويحتاج تفاعلاً مثل تشغيل الملف المصاب.', color: '#f59e0b' },
  { id: 'worm', label: 'Worm', sub: 'standalone spread', detail: 'ينتشر ذاتياً عبر الشبكة دون حاجة إلى ملف مضيف؛ قد يسبب congestion واستهلاك موارد.', color: '#38bdf8' },
  { id: 'trojan', label: 'Trojan', sub: 'looks legitimate', detail: 'يعتمد على الخداع؛ المستخدم يشغله ظناً أنه برنامج مفيد ثم تظهر الوظيفة الضارة.', color: '#a78bfa' },
]

export function VirusWormTrojanDiagram() {
  const [selected, setSelected] = useState('worm')
  const item = confusionItems.find((entry) => entry.id === selected) ?? confusionItems[0]
  const controls = <ChoiceButtons items={confusionItems.map((entry) => ({ id: entry.id, label: entry.label }))} selected={selected} onSelect={setSelected} />
  return (
    <ChoiceShell title="VIRUS vs WORM vs TROJAN" controls={controls} legend={`**${item.label}** — ${item.detail}`}>
      <SelectorBoard items={confusionItems} selected={selected} onSelect={setSelected} focusTitle="COMMONLY CONFUSED MALWARE" columns={3} />
    </ChoiceShell>
  )
}

const ransomwareStages = [
  'Entry: دخول غير مصرح أو ملف خبيث يصل إلى جهاز أو حساب.',
  'Encryption: تشفر الملفات أو يحجب الوصول إليها.',
  'Demand: يُطلب فدية مقابل الاستعادة المزعومة.',
  'Impact: البيانات والخدمات تصبح غير متاحة؛ Availability وغالباً Confidentiality.',
  'Response: عزل affected systems وإبلاغ الفريق المختص.',
  'Recovery: استعادة من نسخة نظيفة والتحقق قبل العودة للخدمة.',
]

export function RansomwareLifecycleDiagram() {
  const playback = useStepPlayback(ransomwareStages.length)
  const s = playback.stage
  return (
    <StepShell title="RANSOMWARE LIFECYCLE (CONCEPTUAL)" playback={playback} legend={ransomwareStages[s]}>
      <StageBoard stages={['Entry', 'Encryption', 'Demand', 'Impact', 'Response', 'Recovery']} stage={s} ariaLabel="Ransomware lifecycle conceptual animated stages" />
    </StepShell>
  )
}

const dosItems: InfoItem[] = [
  { id: 'dos', label: 'DoS', sub: 'limited sources', detail: 'مصدر واحد أو عدد محدود من المصادر يحاول إغراق خدمة أو استهلاك مواردها؛ الأثر الأساسي Availability.', color: '#fb7185' },
  { id: 'ddos', label: 'DDoS', sub: 'distributed sources', detail: 'مصادر متعددة موزعة تغمر الهدف؛ أصعب في التخفيف لأن الطلب يأتي من أماكن كثيرة.', color: '#38bdf8' },
]

export function DosVsDdosDiagram() {
  const [selected, setSelected] = useState('ddos')
  const item = dosItems.find((entry) => entry.id === selected) ?? dosItems[0]
  const controls = <ChoiceButtons items={dosItems.map((entry) => ({ id: entry.id, label: entry.label }))} selected={selected} onSelect={setSelected} />
  return (
    <ChoiceShell title="DoS vs DDoS" controls={controls} legend={`**${item.label}** — ${item.detail}`}>
      <svg viewBox="0 0 920 400" className="h-auto w-full min-w-[880px]" role="img" aria-label="Comparison of single-source denial of service and distributed denial of service">
        <Box x={60} y={155} w={220} h={90} title={selected === 'dos' ? 'One source' : 'Many sources'} sub={selected === 'dos' ? 'limited origins' : 'distributed origins'} color={item.color} active />
        <Box x={390} y={155} w={180} h={90} title="Network" sub="traffic path" color="#a78bfa" active />
        <Box x={650} y={155} w={210} h={90} title="Target service" sub="availability at risk" color="#fb7185" active />
        <LinkLine x1={280} y1={200} x2={390} y2={200} color={item.color} active />
        <LinkLine x1={570} y1={200} x2={650} y2={200} color="#fb7185" active />
        <FlowDot x1={280} y1={200} x2={650} y2={200} color={item.color} active />
        <Badge x={210} y={320} text="Defensive goal: filtering, rate limiting and resilience" color="#34d399" active w={500} />
      </svg>
    </ChoiceShell>
  )
}

const mitmStages = [
  'Client يرسل طلباً إلى Server عبر الشبكة.',
  'في نموذج MitM، يظهر طرف وسيط غير مصرح في المسار.',
  'قد يُراقَب جزء من Traffic أو يُعدَّل بشكل مفاهيمي فقط، دون أي خطوات تنفيذية.',
  'الهدف الدفاعي: تشفير الاتصال والتحقق من الهوية واكتشاف التلاعب.',
]

export function ManInTheMiddleDiagram() {
  const playback = useStepPlayback(mitmStages.length)
  const s = playback.stage
  return (
    <StepShell title="MAN-IN-THE-MIDDLE (CONCEPTUAL)" playback={playback} legend={mitmStages[s]}>
      <svg viewBox="0 0 920 400" className="h-auto w-full min-w-[880px]" role="img" aria-label="Conceptual man-in-the-middle position between client and server with defensive controls">
        <Box x={40} y={160} w={200} h={90} title="Client" sub="legitimate user" color="#38bdf8" active />
        <Box x={360} y={160} w={200} h={90} title="Unauthorized intermediary" sub="conceptual only" color={s >= 1 ? '#fb7185' : '#475569'} active={s >= 1} />
        <Box x={680} y={160} w={200} h={90} title="Server" sub="legitimate service" color="#34d399" active />
        <LinkLine x1={240} y1={205} x2={360} y2={205} color="#38bdf8" active />
        <LinkLine x1={560} y1={205} x2={680} y2={205} color="#34d399" active={s >= 1} />
        {s >= 2 && <FlowDot x1={240} y1={240} x2={680} y2={240} color="#f59e0b" active />}
        {s >= 3 && <Badge x={180} y={315} text="Defense: encryption, identity checks, integrity verification" color="#34d399" active w={560} />}
      </svg>
    </StepShell>
  )
}

const ciaItems: InfoItem[] = [
  { id: 'confidentiality', label: 'Confidentiality', sub: 'no unauthorized disclosure', detail: 'حماية المعلومات من القراءة أو الوصول غير المصرح. الضوابط: Authentication وAuthorization وEncryption وAccess Control.', color: '#38bdf8' },
  { id: 'integrity', label: 'Integrity', sub: 'no unauthorized change', detail: 'ضمان دقة البيانات وعدم تعديلها دون تصريح. الضوابط: Hashing وDigital Signatures وChange Control وAudit Logs.', color: '#a78bfa' },
  { id: 'availability', label: 'Availability', sub: 'services ready when needed', detail: 'إتاحة الأنظمة والبيانات عند الحاجة. الضوابط: Redundancy وBackups وFailover وDoS Protection.', color: '#34d399' },
]

export function CiaTriadDiagram() {
  const [selected, setSelected] = useState('confidentiality')
  const item = ciaItems.find((entry) => entry.id === selected) ?? ciaItems[0]
  const controls = <ChoiceButtons items={ciaItems.map((entry) => ({ id: entry.id, label: entry.label }))} selected={selected} onSelect={setSelected} />
  return (
    <ChoiceShell title="CIA TRIAD" controls={controls} legend={`**${item.label}** — ${item.detail}`}>
      <svg viewBox="0 0 920 400" className="h-auto w-full min-w-[880px]" role="img" aria-label="Interactive CIA triad showing confidentiality integrity and availability">
        <LinkLine x1={460} y1={92} x2={220} y2={210} color="#475569" active />
        <LinkLine x1={460} y1={92} x2={700} y2={210} color="#475569" active />
        <LinkLine x1={220} y1={210} x2={700} y2={210} color="#475569" active />
        <ClickNode x={320} y={40} w={280} h={62} title="CIA TRIAD" sub="three security goals" color="#f59e0b" selected={false} onClick={() => setSelected('confidentiality')} />
        {ciaItems.map((entry, index) => (
          <ClickNode
            key={entry.id}
            x={80 + index * 290}
            y={195}
            w={260}
            h={100}
            title={entry.label}
            sub={entry.sub}
            color={entry.color}
            selected={selected === entry.id}
            onClick={() => setSelected(entry.id)}
          />
        ))}
        <Badge x={130} y={335} text={`SELECTED GOAL: ${item.label}`} color={item.color} active w={660} />
      </svg>
    </ChoiceShell>
  )
}

const confidentialityControls: InfoItem[] = [
  { id: 'authn', label: 'Authentication', sub: 'verify identity', detail: 'يتحقق من هوية المستخدم أو الجهاز قبل السماح بالوصول؛ يمنع انتحال الهوية.', color: '#38bdf8' },
  { id: 'authz', label: 'Authorization', sub: 'grant permissions', detail: 'يحدد ما الذي يُسمح به لكل هوية بعد التحقق؛ يمنع صلاحيات زائدة.', color: '#a78bfa' },
  { id: 'encryption', label: 'Encryption', sub: 'protect data', detail: 'يحول البيانات إلى صيغة غير قابلة للقراءة لمن لا يملك المفتاح؛ مهم أثناء النقل والتخزين.', color: '#34d399' },
  { id: 'acl', label: 'Access Control', sub: 'restrict resources', detail: 'قواعد وسياسات تمنع الوصول غير المصرح إلى ملفات أو خدمات أو أجهزة.', color: '#f59e0b' },
]

export function ConfidentialityControlsDiagram() {
  const [selected, setSelected] = useState('encryption')
  const item = confidentialityControls.find((entry) => entry.id === selected) ?? confidentialityControls[0]
  const controls = <ChoiceButtons items={confidentialityControls.map((entry) => ({ id: entry.id, label: entry.label }))} selected={selected} onSelect={setSelected} />
  return (
    <ChoiceShell title="CONFIDENTIALITY CONTROLS" controls={controls} legend={`**${item.label}** — ${item.detail}`}>
      <SelectorBoard items={confidentialityControls} selected={selected} onSelect={setSelected} focusTitle="PREVENT UNAUTHORIZED DISCLOSURE" />
    </ChoiceShell>
  )
}

const integrityControls: InfoItem[] = [
  { id: 'hash', label: 'Hashing', sub: 'detect changes', detail: 'قيمة مختصرة تمثل البيانات؛ مقارنتها بالقيمة الموثوقة تكشف تغييراً غير متوقع.', color: '#a78bfa' },
  { id: 'signature', label: 'Digital Signatures', sub: 'verify origin', detail: 'تعريفاً: تساعد في التحقق من مصدر البيانات واكتشاف التعديل باستخدام مفاتيح مشفرة.', color: '#38bdf8' },
  { id: 'change', label: 'Change Control', sub: 'approved changes', detail: 'تسجيل التغييرات ومراجعتها يقلل التعديل غير المصرح ويوضح من فعل ماذا.', color: '#f59e0b' },
  { id: 'logs', label: 'Audit Logs', sub: 'trace activity', detail: 'السجلات تساعد على اكتشاف التعديلات وربطها بحسابات أو أجهزة.', color: '#34d399' },
]

export function IntegrityControlsDiagram() {
  const [selected, setSelected] = useState('hash')
  const item = integrityControls.find((entry) => entry.id === selected) ?? integrityControls[0]
  const controls = <ChoiceButtons items={integrityControls.map((entry) => ({ id: entry.id, label: entry.label }))} selected={selected} onSelect={setSelected} />
  return (
    <ChoiceShell title="INTEGRITY CONTROLS" controls={controls} legend={`**${item.label}** — ${item.detail}`}>
      <SelectorBoard items={integrityControls} selected={selected} onSelect={setSelected} focusTitle="DETECT UNAUTHORIZED MODIFICATION" />
    </ChoiceShell>
  )
}

const availabilityControls: InfoItem[] = [
  { id: 'redundancy', label: 'Redundancy', sub: 'duplicate paths', detail: 'وجود مسارات أو أجهزة بديلة يقلل أثر فشل مكوّن واحد على الخدمة.', color: '#38bdf8' },
  { id: 'backups', label: 'Backups', sub: 'recover data', detail: 'نسخة نظيفة ومختبرة تسمح بالعودة بعد حذف أو تشفير أو فشل.', color: '#34d399' },
  { id: 'failover', label: 'Failover', sub: 'automatic switch', detail: 'تحويل الخدمة إلى مورد بديل عند تعطل الأساسي لتقليل زمن الانقطاع.', color: '#a78bfa' },
  { id: 'dos', label: 'DoS Protection', sub: 'keep service up', detail: 'تصفية وحدود معدل وتوزيع حمل تحافظ على توفر الخدمة تحت ضغط غير طبيعي.', color: '#f59e0b' },
]

export function AvailabilityControlsDiagram() {
  const [selected, setSelected] = useState('backups')
  const item = availabilityControls.find((entry) => entry.id === selected) ?? availabilityControls[0]
  const controls = <ChoiceButtons items={availabilityControls.map((entry) => ({ id: entry.id, label: entry.label }))} selected={selected} onSelect={setSelected} />
  return (
    <ChoiceShell title="AVAILABILITY CONTROLS" controls={controls} legend={`**${item.label}** — ${item.detail}`}>
      <SelectorBoard items={availabilityControls} selected={selected} onSelect={setSelected} focusTitle="KEEP SERVICES ACCESSIBLE" />
    </ChoiceShell>
  )
}

const defenseStages = [
  'Security Policies: القواعد والمسؤوليات والتدريب.',
  'Physical Security: حماية الأجهزة والغرف والوصول المادي.',
  'Network Security: تقسيم الشبكة ومراقبة الحركة.',
  'Firewalls: التحكم في تدفق الشبكة والمنافذ.',
  'Access Control: هوية وصلاحيات وأقل امتياز.',
  'Endpoint Protection: تحديثات ومكافحة برمجيات ضارة.',
  'Data Security: تشفير ونسخ احتياطي وفحص سلامة.',
]

export function DefenseInDepthDiagram() {
  const playback = useStepPlayback(defenseStages.length)
  const s = playback.stage
  return (
    <StepShell title="DEFENSE IN DEPTH" playback={playback} legend={defenseStages[s]}>
      <StageBoard stages={['Policies', 'Physical', 'Network', 'Firewalls', 'Access control', 'Endpoint', 'Data']} stage={s} ariaLabel="Defense in depth layered security animated stages" />
    </StepShell>
  )
}

const mitigationItems: InfoItem[] = [
  { id: 'phishing', label: 'Phishing', sub: 'human threat', detail: 'Awareness + MFA + reporting procedures + verification before entering credentials.', color: '#fb7185' },
  { id: 'malware', label: 'Malware', sub: 'technical threat', detail: 'Endpoint protection + patch management + application control + safe backups.', color: '#f59e0b' },
  { id: 'access', label: 'Unauthorized Access', sub: 'credential threat', detail: 'Strong authentication + least privilege + ACLs + review of administrative accounts.', color: '#38bdf8' },
  { id: 'dos', label: 'DoS / DDoS', sub: 'availability threat', detail: 'Filtering + rate limiting + resilience and capacity planning.', color: '#a78bfa' },
  { id: 'theft', label: 'Data Theft', sub: 'confidentiality threat', detail: 'Encryption + access restrictions + monitoring and data loss prevention where available.', color: '#34d399' },
  { id: 'tamper', label: 'Data Tampering', sub: 'integrity threat', detail: 'Hashing + digital signatures + audit logs and change control.', color: '#22d3ee' },
  { id: 'device', label: 'Device Theft', sub: 'physical threat', detail: 'Physical security + device encryption + inventory and remote wipe where supported.', color: '#818cf8' },
]

export function ThreatMitigationMappingDiagram() {
  const [selected, setSelected] = useState('malware')
  const item = mitigationItems.find((entry) => entry.id === selected) ?? mitigationItems[0]
  const controls = <ChoiceButtons items={mitigationItems.map((entry) => ({ id: entry.id, label: entry.label }))} selected={selected} onSelect={setSelected} />
  return (
    <ChoiceShell title="THREAT TO MITIGATION MAPPING" controls={controls} legend={`**${item.label}** — ${item.detail}`}>
      <SelectorBoard items={mitigationItems} selected={selected} onSelect={setSelected} focusTitle="MATCH THE DEFENSIVE CONTROLS" />
    </ChoiceShell>
  )
}

const incidentStages = [
  'Identify: اكتشاف الأصل والمشكلة وتصنيفها.',
  'Protect: تطبيق الضوابط الوقائية قبل وقوع الضرر.',
  'Detect: مراقبة السجلات والتنبيهات لاكتشاف الشذوذ.',
  'Respond: احتواء الحادث وفق خطة الاستجابة.',
  'Recover: استعادة الخدمة والتحقق من النظافة.',
  'Lessons Learned: مراجعة ما حدث وتحسين الضوابط.',
]

export function SecurityIncidentLifecycleDiagram() {
  const playback = useStepPlayback(incidentStages.length)
  const s = playback.stage
  return (
    <StepShell title="SECURITY INCIDENT LIFECYCLE" playback={playback} legend={incidentStages[s]}>
      <StageBoard stages={['Identify', 'Protect', 'Detect', 'Respond', 'Recover', 'Improve']} stage={s} ariaLabel="Security incident lifecycle animated stages" />
    </StepShell>
  )
}

const ciaScenarios: InfoItem[] = [
  { id: 'theft', label: 'Data Theft', sub: 'confidential files read', detail: 'Primary: Confidentiality. Additional: Integrity may be questioned if data was copied or accessed through altered permissions.', color: '#38bdf8' },
  { id: 'tamper', label: 'Data Tampering', sub: 'config changed', detail: 'Primary: Integrity. Additional: Availability may suffer if the changed configuration breaks a service.', color: '#a78bfa' },
  { id: 'ddos', label: 'DDoS', sub: 'website unavailable', detail: 'Primary: Availability. Additional: Confidentiality and Integrity are usually not the main impact in this scenario.', color: '#34d399' },
  { id: 'ransom', label: 'Ransomware', sub: 'documents encrypted', detail: 'Primary: Availability. Additional: Confidentiality may also be affected if data is threatened or exposed.', color: '#fb7185' },
  { id: 'delete', label: 'Accidental Deletion', sub: 'important data lost', detail: 'Primary: Availability. Additional: Integrity can matter if remaining records are incomplete or inconsistent.', color: '#f59e0b' },
]

export function CiaImpactAnalyzerDiagram() {
  const [selected, setSelected] = useState('ddos')
  const item = ciaScenarios.find((entry) => entry.id === selected) ?? ciaScenarios[0]
  const controls = <ChoiceButtons items={ciaScenarios.map((entry) => ({ id: entry.id, label: entry.label }))} selected={selected} onSelect={setSelected} />
  return (
    <ChoiceShell title="CIA IMPACT ANALYZER" controls={controls} legend={`**${item.label}** — ${item.detail}`}>
      <SelectorBoard items={ciaScenarios} selected={selected} onSelect={setSelected} focusTitle="WHICH CIA PRINCIPLE IS AFFECTED?" />
    </ChoiceShell>
  )
}
