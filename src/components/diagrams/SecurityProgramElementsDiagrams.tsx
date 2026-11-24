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
      <Badge x={190} y={350} text="Educational model - adapt to local policy" color="#fb7185" active w={540} />
    </svg>
  )
}

const programStages = [
  'Security Program هو إطار متكامل من Policies وPeople وProcesses وTechnologies لحماية الأصول.',
  'بدون Program واضح، تبقى الحلول التقنية معزولة ولا تعالج السلوك البشري أو الإجراءات.',
  'Management يضع السياسات، وIT وSecurity Teams ينفذان الضوابط، والموظفون يلتزمون ويبلغون.',
  'العناصر الأساسية: Policies، Awareness، Training، Physical Security، Logical Access Control، Monitoring، Reporting.',
  'نجاح البرنامج يُقاس بالامتثال والتدريب والحوادث المبلغ عنها والإجراءات التصحيحية.',
]

export function SecurityProgramOverviewDiagram() {
  const playback = useStepPlayback(programStages.length)
  const s = playback.stage
  return (
    <StepShell title="SECURITY PROGRAM OVERVIEW" playback={playback} legend={programStages[s]}>
      <svg viewBox="0 0 920 400" className="h-auto w-full min-w-[880px]" role="img" aria-label="Security program overview connecting management policies controls and reporting">
        <Box x={45} y={150} w={200} h={90} title="Management" sub="sets policy" color="#a78bfa" active />
        <Box x={320} y={150} w={230} h={90} title="Security Program" sub="people + process + technology" color="#38bdf8" active={s >= 1} />
        <Box x={640} y={150} w={230} h={90} title="Protected Assets" sub="data, systems, services" color="#34d399" active={s >= 2} />
        <LinkLine x1={245} y1={195} x2={320} y2={195} color="#a78bfa" active />
        <LinkLine x1={550} y1={195} x2={640} y2={195} color="#34d399" active={s >= 2} />
        <FlowDot x1={245} y1={195} x2={640} y2={195} color="#f59e0b" active={s >= 3} />
        {s >= 4 && <Badge x={190} y={320} text="Measure → improve → repeat" color="#fb7185" active w={540} />}
      </svg>
    </StepShell>
  )
}

const pptItems: InfoItem[] = [
  { id: 'people', label: 'People', sub: 'users and teams', detail: 'الموظفون والإدارة وفرق IT والأمان؛ الوعي والالتزام والإبلاغ يقلل المخاطر البشرية.', color: '#38bdf8' },
  { id: 'process', label: 'Process', sub: 'policies and steps', detail: 'السياسات والإجراءات والموافقات والمراجعات؛ تحدد ما الذي يجب فعله وكيف يُقاس.', color: '#a78bfa' },
  { id: 'technology', label: 'Technology', sub: 'tools and controls', detail: 'Firewalls وAccess Control وEncryption وMonitoring؛ ضرورية لكنها غير كافية وحدها.', color: '#34d399' },
]

export function PeopleProcessTechnologyDiagram() {
  const [selected, setSelected] = useState('people')
  const item = pptItems.find((entry) => entry.id === selected) ?? pptItems[0]
  const controls = <ChoiceButtons items={pptItems.map((entry) => ({ id: entry.id, label: entry.label }))} selected={selected} onSelect={setSelected} />
  return (
    <ChoiceShell title="PEOPLE + PROCESS + TECHNOLOGY" controls={controls} legend={`**${item.label}** — ${item.detail}`}>
      <svg viewBox="0 0 920 400" className="h-auto w-full min-w-[880px]" role="img" aria-label="People process and technology as three connected elements of a security program">
        <LinkLine x1={460} y1={100} x2={220} y2={220} color="#475569" active />
        <LinkLine x1={460} y1={100} x2={700} y2={220} color="#475569" active />
        <LinkLine x1={220} y1={220} x2={700} y2={220} color="#475569" active />
        <Badge x={330} y={35} text="SECURITY PROGRAM" color="#f59e0b" active w={260} />
        {pptItems.map((entry, index) => (
          <ClickNode
            key={entry.id}
            x={80 + index * 290}
            y={205}
            w={260}
            h={95}
            title={entry.label}
            sub={entry.sub}
            color={entry.color}
            selected={selected === entry.id}
            onClick={() => setSelected(entry.id)}
          />
        ))}
        <Badge x={190} y={340} text="Strong technology cannot compensate for unclear policy or low awareness" color="#fb7185" active w={540} />
      </svg>
    </ChoiceShell>
  )
}

const awarenessStages = [
  'الموظفون قد يسببون حوادث دون قصد عبر رسالة Phishing أو مشاركة بيانات أو جهاز غير مؤمن.',
  'Awareness يبني الفهم العام للمخاطر والسلوك الآمن.',
  'Training يبني مهارات عملية حسب كل دور، وهو أعمق من Awareness.',
  'تطبيق السلوك الآمن: فحص المرسل، حماية Passwords، قفل الجهاز، وتأكيد المستلم.',
  'الإبلاغ السريع يسمح للفريق المختص بالتحقق والاحتواء.',
  'قياس الفعالية يظهر الفجوات ويوجه التدريب القادم.',
]

export function UserAwarenessLifecycleDiagram() {
  const playback = useStepPlayback(awarenessStages.length)
  const s = playback.stage
  return (
    <StepShell title="USER AWARENESS LIFECYCLE" playback={playback} legend={awarenessStages[s]}>
      <StageBoard stages={['Risk', 'Awareness', 'Training', 'Safe behavior', 'Reporting', 'Measure']} stage={s} ariaLabel="User security awareness lifecycle animated stages" />
    </StepShell>
  )
}

interface EmailItem {
  id: string
  subject: string
  sender: string
  indicators: string
  verdict: 'Legitimate' | 'Suspicious' | 'Phishing'
  explanation: string
}

const emails: EmailItem[] = [
  { id: 'e1', subject: 'Team meeting agenda', sender: 'announcements@examplecorp.test', indicators: 'Internal sender · no credential request', verdict: 'Legitimate', explanation: 'رسالة داخلية واضحة ولا تطلب بيانات دخول أو تحويلاً مالياً.' },
  { id: 'e2', subject: 'Verify your password now', sender: 'support@paypaI-example.test', indicators: 'Urgency · misspelled domain · link', verdict: 'Phishing', explanation: 'الاستعجال ونطاق مشابه للخداع وطلب التحقق من كلمة المرور كلها مؤشرات Phishing.' },
  { id: 'e3', subject: 'Invoice attachment', sender: 'vendor-unknown@external.test', indicators: 'Unknown sender · unexpected attachment', verdict: 'Suspicious', explanation: 'المرسل غير متوقع والمرفق غير معروف؛ يجب التحقق عبر قناة معتمدة قبل الفتح.' },
  { id: 'e4', subject: 'CEO: buy gift cards', sender: 'executive.assistant@freemail.test', indicators: 'Impersonation · unusual request', verdict: 'Phishing', explanation: 'انتحال هوية مسؤول وطلب غير معتاد عبر بريد عام؛ يجب تأكيد الطلب بقناة أخرى.' },
  { id: 'e5', subject: 'Urgent payment change', sender: 'finance-team@external.test', indicators: 'Urgency · changed payment details', verdict: 'Phishing', explanation: 'تغيير بيانات الدفع تحت ضغط الوقت يحتاج تحققاً مستقلاً قبل أي إجراء.' },
  { id: 'e6', subject: 'Scheduled IT maintenance', sender: 'it-helpdesk@examplecorp.test', indicators: 'Known sender · ticket number · no links', verdict: 'Legitimate', explanation: 'رسالة صيانة داخلية بمصدر معروف ورقم تذكرة ولا تطلب بيانات حساسة.' },
]

const verdictChoices: Choice[] = [
  { id: 'Legitimate', label: 'Legitimate' },
  { id: 'Suspicious', label: 'Suspicious' },
  { id: 'Phishing', label: 'Phishing' },
]

export function PhishingSimulatorDiagram() {
  const [selected, setSelected] = useState(emails[1].id)
  const [verdict, setVerdict] = useState('Phishing')
  const email = emails.find((entry) => entry.id === selected) ?? emails[1]
  const correct = verdict === email.verdict
  const safeAction = email.verdict === 'Legitimate'
    ? 'Follow normal process; still verify sensitive requests.'
    : 'Do not click or reply; report through the approved channel.'
  const controls = <ChoiceButtons items={verdictChoices} selected={verdict} onSelect={setVerdict} />
  const result = correct ? 'Classification matches the educational scenario' : 'Reconsider the indicators'
  const legend = `**${email.subject}** — ${email.indicators}. Your classification: **${verdict}**. ${result}: ${email.explanation} Safe action: ${safeAction}`
  return (
    <ChoiceShell title="PHISHING AWARENESS SIMULATOR" controls={controls} legend={legend}>
      <svg viewBox="0 0 920 400" className="h-auto w-full min-w-[880px]" role="img" aria-label="Interactive phishing email simulator with six fictional example messages">
        <Badge x={230} y={12} text="FICTIONAL EXAMPLES - NO REAL LINKS OR CREDENTIALS" color="#fb7185" active w={460} />
        {emails.map((entry, index) => {
          const x = 20 + (index % 3) * 300
          const y = 70 + Math.floor(index / 3) * 105
          return (
            <ClickNode
              key={entry.id}
              x={x}
              y={y}
              w={280}
              h={88}
              title={entry.subject}
              sub={entry.sender}
              color={entry.verdict === 'Legitimate' ? '#34d399' : '#fb7185'}
              selected={entry.id === selected}
              onClick={() => setSelected(entry.id)}
            />
          )
        })}
        <Box x={150} y={295} w={620} h={55} title="SELECTED MESSAGE" sub={`${email.indicators}`} color={correct ? '#34d399' : '#f59e0b'} active />
      </svg>
    </ChoiceShell>
  )
}

const socialItems: InfoItem[] = [
  { id: 'impersonation', label: 'Impersonation', sub: 'fake identity', detail: 'انتحال هوية موظف أو مسؤول لإقناع المستخدم بتسليم معلومات أو تنفيذ إجراء.', color: '#fb7185' },
  { id: 'phone', label: 'Phone Request', sub: 'secret information', detail: 'طلب معلومات سرية عبر الهاتف؛ التحقق المستقل عبر دليل داخلي موثوق.', color: '#f59e0b' },
  { id: 'urgency', label: 'Urgency', sub: 'pressure tactic', detail: 'استعجال القرار لتقليل التفكير؛ إبطاء الاستجابة والتحقق جزء من الدفاع.', color: '#a78bfa' },
  { id: 'tailgating', label: 'Tailgating', sub: 'follow through door', detail: 'دخول شخص غير مصرح خلف موظف عبر باب مؤمن؛ لا تفتح الباب لشخص غير معروف.', color: '#38bdf8' },
  { id: 'pretexting', label: 'Pretexting', sub: 'invented scenario', detail: 'اختلاق قصة مقنعة للحصول على ثقة المستخدم أو بياناته.', color: '#818cf8' },
]

export function SocialEngineeringDiagram() {
  const [selected, setSelected] = useState('tailgating')
  const item = socialItems.find((entry) => entry.id === selected) ?? socialItems[0]
  const controls = <ChoiceButtons items={socialItems.map((entry) => ({ id: entry.id, label: entry.label }))} selected={selected} onSelect={setSelected} />
  return (
    <ChoiceShell title="SOCIAL ENGINEERING EXAMPLES" controls={controls} legend={`**${item.label}** — ${item.detail}`}>
      <SelectorBoard items={socialItems} selected={selected} onSelect={setSelected} focusTitle="HUMAN-CENTERED THREATS" columns={3} />
    </ChoiceShell>
  )
}

const trainingStages = [
  'General Employee Training: Phishing وPassword Safety وData Handling وReporting.',
  'IT Staff Training: Secure Configuration وPatch Management وNetwork Security وLog Monitoring.',
  'Privileged User Training: حماية الحسابات الإدارية وLeast Privilege وChange Management.',
  'Specialized Training: Incident Response Exercises وTabletop وPhishing Simulations وDR Drills.',
  'قياس الفعالية: Completion Rate وSimulation Failure Rate وReporting Rate وCompliance.',
]

export function TrainingFrameworkDiagram() {
  const playback = useStepPlayback(trainingStages.length)
  const s = playback.stage
  return (
    <StepShell title="SECURITY TRAINING FRAMEWORK" playback={playback} legend={trainingStages[s]}>
      <StageBoard stages={['Employees', 'IT staff', 'Privileged', 'Specialized', 'Metrics']} stage={s} ariaLabel="Security training framework animated stages" />
    </StepShell>
  )
}

const trainingRoles: InfoItem[] = [
  { id: 'employee', label: 'General Employee', sub: 'awareness basics', detail: 'Phishing recognition, password security, safe internet usage, data handling, incident reporting.', color: '#38bdf8' },
  { id: 'it', label: 'IT Staff', sub: 'technical controls', detail: 'Secure configuration, patch management, access management, network security, log monitoring, incident response.', color: '#34d399' },
  { id: 'privileged', label: 'Privileged User', sub: 'higher risk account', detail: 'Administrative account protection, least privilege, secure remote access, change management.', color: '#fb7185' },
  { id: 'responder', label: 'Incident Responder', sub: 'specialized drills', detail: 'Tabletop exercises, containment workflow, evidence handling, recovery coordination and lessons learned.', color: '#a78bfa' },
  { id: 'manager', label: 'Manager', sub: 'policy ownership', detail: 'Policy approval, access review, compliance tracking, training oversight and exception decisions.', color: '#f59e0b' },
]

export function TrainingPlannerDiagram() {
  const [selected, setSelected] = useState('employee')
  const item = trainingRoles.find((entry) => entry.id === selected) ?? trainingRoles[0]
  const controls = <ChoiceButtons items={trainingRoles.map((entry) => ({ id: entry.id, label: entry.label }))} selected={selected} onSelect={setSelected} />
  return (
    <ChoiceShell title="INTERACTIVE TRAINING PLANNER" controls={controls} legend={`**${item.label}** — ${item.detail}`}>
      <SelectorBoard items={trainingRoles} selected={selected} onSelect={setSelected} focusTitle="CHOOSE TRAINING BY ROLE" columns={3} />
    </ChoiceShell>
  )
}

const physicalStages = [
  'Physical Security يمنع الوصول المادي غير المصرح إلى الأجهزة والغرف والكابلات.',
  'Preventive Controls: Door Locks وAccess Cards وBiometrics وLocked Racks.',
  'Detective Controls: CCTV وSecurity Guards وAccess Logs.',
  'Environmental Protection: Fire Suppression وUPS وTemperature وWater Leak Detection.',
  'الهدف حماية Confidentiality وIntegrity وAvailability من مخاطر مادية وبيئية.',
]

export function PhysicalSecurityLayersDiagram() {
  const playback = useStepPlayback(physicalStages.length)
  const s = playback.stage
  return (
    <StepShell title="PHYSICAL SECURITY LAYERS" playback={playback} legend={physicalStages[s]}>
      <StageBoard stages={['Perimeter', 'Preventive', 'Detective', 'Environmental', 'Asset goal']} stage={s} ariaLabel="Physical security layers animated stages" />
    </StepShell>
  )
}

const physicalControls: InfoItem[] = [
  { id: 'locks', label: 'Door Locks', sub: 'preventive', detail: 'تقييد الدخول إلى غرف الخوادم والمكاتب الحساسة.', color: '#38bdf8' },
  { id: 'cards', label: 'Access Cards', sub: 'preventive', detail: 'بطاقات تعريف تتحقق من هوية الداخل وتسجل الوقت والمنطقة.', color: '#34d399' },
  { id: 'biometrics', label: 'Biometrics', sub: 'preventive', detail: 'التحقق ببصمة الإصبع أو خاصية بيومترية أخرى لجهة محددة.', color: '#a78bfa' },
  { id: 'cctv', label: 'CCTV', sub: 'detective', detail: 'مراقبة المناطق الحساسة وتسجيل الأحداث للمراجعة.', color: '#f59e0b' },
  { id: 'guards', label: 'Security Guards', sub: 'detective', detail: 'مراقبة المنشأة والتحقق من الزوار والتعامل مع الملاحظات.', color: '#fb7185' },
  { id: 'mantrap', label: 'Mantraps', sub: 'preventive', detail: 'أبواب متتابعة تمنع دخول أكثر من شخص بتصريح واحد.', color: '#22d3ee' },
  { id: 'racks', label: 'Locked Racks', sub: 'preventive', detail: 'حماية أجهزة الشبكة والخوادم داخل Racks مؤمنة.', color: '#818cf8' },
  { id: 'ups', label: 'UPS / Environment', sub: 'environmental', detail: 'Fire Suppression وUPS وTemperature وWater Leak Detection تحمي التوفر.', color: '#4ade80' },
]

export function DataCenterSecurityDiagram() {
  const [selected, setSelected] = useState('cards')
  const item = physicalControls.find((entry) => entry.id === selected) ?? physicalControls[0]
  const controls = <ChoiceButtons items={physicalControls.map((entry) => ({ id: entry.id, label: entry.label }))} selected={selected} onSelect={setSelected} />
  return (
    <ChoiceShell title="DATA CENTER PHYSICAL SECURITY" controls={controls} legend={`**${item.label}** — ${item.detail}`}>
      <SelectorBoard items={physicalControls} selected={selected} onSelect={setSelected} focusTitle="SELECT A PHYSICAL CONTROL" />
    </ChoiceShell>
  )
}

const cardStages = [
  'الموظف يمرر Access Card عند قارئ الباب.',
  'القارئ يرسل معرّف البطاقة إلى نظام التحقق.',
  'النظام يقارن الصلاحية بالسياسة والوقت والمنطقة.',
  'يُسمح بالدخول أو يُرفض، ويُسجّل الحدث في Access Log.',
]

export function AccessCardAuthenticationDiagram() {
  const playback = useStepPlayback(cardStages.length)
  const s = playback.stage
  return (
    <StepShell title="ACCESS CARD AUTHENTICATION" playback={playback} legend={cardStages[s]}>
      <svg viewBox="0 0 920 400" className="h-auto w-full min-w-[880px]" role="img" aria-label="Access card authentication flow from card reader to policy check and access log">
        <Box x={50} y={150} w={200} h={90} title="User + Card" sub="badge presented" color="#38bdf8" active />
        <Box x={320} y={150} w={210} h={90} title="Card Reader" sub="reads identifier" color="#a78bfa" active={s >= 1} />
        <Box x={600} y={150} w={260} h={90} title="Access System" sub="policy + logs" color={s >= 3 ? '#34d399' : '#f59e0b'} active={s >= 2} />
        <LinkLine x1={250} y1={195} x2={320} y2={195} color="#38bdf8" active />
        <LinkLine x1={530} y1={195} x2={600} y2={195} color="#f59e0b" active={s >= 2} />
        <FlowDot x1={250} y1={195} x2={600} y2={195} color="#f59e0b" active={s >= 3} />
        <Badge x={250} y={310} text={s >= 3 ? 'Allow / deny + audit record' : 'Check role, area and time'} color="#34d399" active w={430} />
      </svg>
    </StepShell>
  )
}

const accessScopeItems: InfoItem[] = [
  { id: 'physical', label: 'Physical Access Control', sub: 'doors and rooms', detail: 'يتحكم في الوصول المادي إلى المبنى والغرف والـ Racks عبر الأقفال والبطاقات والحراس.', color: '#f59e0b' },
  { id: 'logical', label: 'Logical Access Control', sub: 'systems and data', detail: 'يتحكم في الوصول إلى الحسابات والملفات والشبكة عبر Authentication وAuthorization وACLs.', color: '#38bdf8' },
]

export function PhysicalVsLogicalAccessDiagram() {
  const [selected, setSelected] = useState('logical')
  const item = accessScopeItems.find((entry) => entry.id === selected) ?? accessScopeItems[0]
  const controls = <ChoiceButtons items={accessScopeItems.map((entry) => ({ id: entry.id, label: entry.label }))} selected={selected} onSelect={setSelected} />
  return (
    <ChoiceShell title="PHYSICAL vs LOGICAL ACCESS CONTROL" controls={controls} legend={`**${item.label}** — ${item.detail}`}>
      <SelectorBoard items={accessScopeItems} selected={selected} onSelect={setSelected} focusTitle="TWO ACCESS CONTROL SCOPES" columns={2} />
    </ChoiceShell>
  )
}

const tripleItems: InfoItem[] = [
  { id: 'authn', label: 'Authentication', sub: 'Who are you?', detail: 'التحقق من هوية المستخدم أو الجهاز؛ مثال: Username/Password أو Smart Card أو MFA.', color: '#38bdf8' },
  { id: 'authz', label: 'Authorization', sub: 'What can you do?', detail: 'تحديد الموارد والعمليات المسموح بها بعد التحقق من الهوية؛ مثال: السماح بقراءة ملف دون تعديله.', color: '#34d399' },
  { id: 'accounting', label: 'Accounting', sub: 'What did you do?', detail: 'تسجيل النشاط للمراجعة والتتبع؛ التفاصيل المتقدمة لـ AAA ستأتي في Topic لاحق.', color: '#a78bfa' },
]

export function AuthenticationVsAuthorizationDiagram() {
  const [selected, setSelected] = useState('authn')
  const item = tripleItems.find((entry) => entry.id === selected) ?? tripleItems[0]
  const controls = <ChoiceButtons items={tripleItems.map((entry) => ({ id: entry.id, label: entry.label }))} selected={selected} onSelect={setSelected} />
  return (
    <ChoiceShell title="AUTHENTICATION vs AUTHORIZATION vs ACCOUNTING" controls={controls} legend={`**${item.label}** — ${item.detail}`}>
      <SelectorBoard items={tripleItems} selected={selected} onSelect={setSelected} focusTitle="CORE ACCESS CONTROL QUESTIONS" columns={3} />
    </ChoiceShell>
  )
}

const modelItems: InfoItem[] = [
  { id: 'dac', label: 'DAC', sub: 'owner decides', detail: 'Discretionary Access Control: مالك المورد يحدد من له الوصول. مرن لكنه يعتمد على قرارات المالك.', color: '#f59e0b' },
  { id: 'mac', label: 'MAC', sub: 'central labels', detail: 'Mandatory Access Control: الوصول يتحدد من Security Labels وسياسات مركزية صارمة.', color: '#fb7185' },
  { id: 'rbac', label: 'RBAC', sub: 'role decides', detail: 'Role-Based Access Control: الصلاحيات تُمنح حسب دور الوظيفة؛ الأسهل إدارة في المؤسسات.', color: '#34d399' },
]

export function AccessControlModelsDiagram() {
  const [selected, setSelected] = useState('rbac')
  const item = modelItems.find((entry) => entry.id === selected) ?? modelItems[0]
  const controls = <ChoiceButtons items={modelItems.map((entry) => ({ id: entry.id, label: entry.label }))} selected={selected} onSelect={setSelected} />
  return (
    <ChoiceShell title="DAC vs MAC vs RBAC" controls={controls} legend={`**${item.label}** — ${item.detail}`}>
      <SelectorBoard items={modelItems} selected={selected} onSelect={setSelected} focusTitle="ACCESS CONTROL MODELS" columns={3} />
    </ChoiceShell>
  )
}

const privilegeItems: InfoItem[] = [
  { id: 'need', label: 'Need to know', sub: 'limited scope', detail: 'المستخدم يحصل على المعلومات المطلوبة لعمله فقط.', color: '#38bdf8' },
  { id: 'minimum', label: 'Minimum rights', sub: 'few permissions', detail: 'صلاحيات محدودة تكفي لأداء المهمة، لا صلاحيات إدارية شاملة.', color: '#34d399' },
  { id: 'time', label: 'Time-bound', sub: 'temporary access', detail: 'الصلاحية المؤقتة تُزال عند انتهاء الحاجة.', color: '#f59e0b' },
  { id: 'review', label: 'Regular review', sub: 'access recertification', detail: 'مراجعة دورية للتأكد من أن كل صلاحية ما زالت مبررة.', color: '#a78bfa' },
]

export function LeastPrivilegeDiagram() {
  const [selected, setSelected] = useState('minimum')
  const item = privilegeItems.find((entry) => entry.id === selected) ?? privilegeItems[0]
  const controls = <ChoiceButtons items={privilegeItems.map((entry) => ({ id: entry.id, label: entry.label }))} selected={selected} onSelect={setSelected} />
  return (
    <ChoiceShell title="LEAST PRIVILEGE" controls={controls} legend={`**${item.label}** — ${item.detail}`}>
      <SelectorBoard items={privilegeItems} selected={selected} onSelect={setSelected} focusTitle="GIVE ONLY WHAT IS REQUIRED" />
    </ChoiceShell>
  )
}

interface MatrixRow {
  id: string
  role: string
  permissions: string[]
  color: string
}

const matrixRows: MatrixRow[] = [
  { id: 'employee', role: 'Employee', permissions: ['Office: Yes', 'Server room: No', 'Devices: No', 'Records: Limited'], color: '#38bdf8' },
  { id: 'it', role: 'IT Support', permissions: ['Office: Yes', 'Server room: Limited', 'Devices: Limited', 'Records: No'], color: '#34d399' },
  { id: 'netadmin', role: 'Network Admin', permissions: ['Office: Yes', 'Server room: Yes', 'Devices: Yes', 'Records: No'], color: '#f59e0b' },
  { id: 'secadmin', role: 'Security Admin', permissions: ['Office: Yes', 'Server room: Controlled', 'Devices: Controlled', 'Records: Authorized'], color: '#a78bfa' },
  { id: 'visitor', role: 'Visitor', permissions: ['Office: Restricted', 'Server room: No', 'Devices: No', 'Records: No'], color: '#fb7185' },
]

export function RoleBasedAccessMatrixDiagram() {
  const [selected, setSelected] = useState('it')
  const row = matrixRows.find((entry) => entry.id === selected) ?? matrixRows[1]
  const controls = <ChoiceButtons items={matrixRows.map((entry) => ({ id: entry.id, label: entry.role }))} selected={selected} onSelect={setSelected} />
  return (
    <ChoiceShell title="ROLE-BASED ACCESS MATRIX" controls={controls} legend={`**${row.role}** — ${row.permissions.join(' · ')}. This is an educational example; real permissions follow organizational policy.`}>
      <svg viewBox="0 0 920 400" className="h-auto w-full min-w-[880px]" role="img" aria-label="Interactive role based access control matrix for five organizational roles">
        <Badge x={205} y={15} text="ROLE / RESOURCE MATRIX" color="#a78bfa" active w={510} />
        {['Office', 'Server room', 'Network devices', 'Employee records'].map((label, index) => (
          <SvgText key={label} x={420 + index * 120} y={78} color="#cbd5e1" size={7.6} bold>{label}</SvgText>
        ))}
        {matrixRows.map((entry, rowIndex) => {
          const y = 100 + rowIndex * 54
          const active = entry.id === selected
          return (
            <motion.g key={entry.id} animate={{ opacity: active ? 1 : 0.55 }} transition={{ duration: 0.25 }}>
              <rect x={25} y={y} width={870} height={44} rx="8" fill="#0b1224" stroke={active ? '#f59e0b' : entry.color} strokeWidth={active ? 2.3 : 1.1} />
              <ClickNode x={35} y={y + 5} w={180} h={34} title={entry.role} sub="select role" color={entry.color} selected={active} onClick={() => setSelected(entry.id)} />
              {entry.permissions.map((permission, colIndex) => (
                <SvgText key={permission} x={480 + colIndex * 120} y={y + 26} color={permission.includes('No') ? '#fb7185' : permission.includes('Limited') || permission.includes('Restricted') ? '#f59e0b' : '#6ee7b7'} size={7.4} bold>{permission.split(': ')[1]}</SvgText>
              ))}
            </motion.g>
          )
        })}
        <Badge x={170} y={370} text="Assign minimum required permissions; review and revoke when no longer needed" color="#34d399" active w={580} />
      </svg>
    </ChoiceShell>
  )
}

const policyItems: InfoItem[] = [
  { id: 'aus', label: 'Acceptable Use', sub: 'AUP', detail: 'يحدد الاستخدام المسموح لأجهزة وخدمات المؤسسة.', color: '#38bdf8' },
  { id: 'password', label: 'Password Policy', sub: 'credential rules', detail: 'يحدد متطلبات كلمات المرور وتغييرها وحمايتها.', color: '#34d399' },
  { id: 'data', label: 'Data Handling', sub: 'classification', detail: 'يحدد كيفية تخزين البيانات ومشاركتها ونقلها.', color: '#a78bfa' },
  { id: 'physical', label: 'Physical Access', sub: 'facilities', detail: 'يحدد من يدخل المناطق الحساسة وكيف يُسجّل ذلك.', color: '#f59e0b' },
  { id: 'remote', label: 'Remote Access', sub: 'off-site', detail: 'يحدد شروط الوصول عن بُعد والأجهزة المسموحة.', color: '#fb7185' },
  { id: 'incident', label: 'Incident Reporting', sub: 'reporting path', detail: 'يوضح ما الذي يُبلَّغ عنه ولمن وخلال أي قناة معتمدة.', color: '#22d3ee' },
]

export function SecurityPolicyFrameworkDiagram() {
  const [selected, setSelected] = useState('incident')
  const item = policyItems.find((entry) => entry.id === selected) ?? policyItems[0]
  const controls = <ChoiceButtons items={policyItems.map((entry) => ({ id: entry.id, label: entry.label }))} selected={selected} onSelect={setSelected} />
  return (
    <ChoiceShell title="SECURITY POLICY FRAMEWORK" controls={controls} legend={`**${item.label}** — ${item.detail}`}>
      <SelectorBoard items={policyItems} selected={selected} onSelect={setSelected} focusTitle="POLICIES AND PROCEDURES" columns={3} />
    </ChoiceShell>
  )
}

const incidentStages = [
  'Identify Suspicious Activity: رسالة أو سلوك غير معتاد.',
  'Avoid Further Interaction: لا تنقر ولا ترد ولا تنفذ الطلب.',
  'Preserve Relevant Information: احتفظ بالرسالة أو التفاصيل دون تعديلها.',
  'Report Through Approved Channel: أبلغ عبر القناة المعتمدة.',
  'Security Team Investigates: يراجع الفريق المختص البلاغ.',
  'Containment and Remediation: تُطبق الإجراءات المناسبة.',
  'Document Lessons Learned: تُسجل النتائج لتحسين السياسات والتدريب.',
]

export function IncidentReportingWorkflowDiagram() {
  const playback = useStepPlayback(incidentStages.length)
  const s = playback.stage
  return (
    <StepShell title="INCIDENT REPORTING WORKFLOW" playback={playback} legend={incidentStages[s]}>
      <StageBoard stages={['Identify', 'Avoid', 'Preserve', 'Report', 'Investigate', 'Contain', 'Learn']} stage={s} ariaLabel="Incident reporting workflow animated stages" />
    </StepShell>
  )
}

const metricItems: InfoItem[] = [
  { id: 'training', label: 'Training Completion', sub: 'coverage', detail: 'نسبة الموظفين الذين أكملوا التدريب المطلوب.', color: '#38bdf8' },
  { id: 'phishing', label: 'Simulation Failure', sub: 'behavior', detail: 'نسبة من وقع في رسائل المحاكاة؛ ترتفع الفجوة كلما احتاج التدريب تحسيناً.', color: '#fb7185' },
  { id: 'reporting', label: 'Reporting Rate', sub: 'speed', detail: 'عدد وسرعة البلاغات؛ ارتفاعها المبكر علامة وعي جيد.', color: '#34d399' },
  { id: 'compliance', label: 'Policy Compliance', sub: 'adherence', detail: 'مدى الالتزام بالسياسات مثل كلمات المرور والوصول المادي.', color: '#a78bfa' },
  { id: 'logs', label: 'Physical Access Logs', sub: 'facilities', detail: 'مراجعة سجلات الدخول والخروج والمناطق الحساسة.', color: '#f59e0b' },
  { id: 'audit', label: 'Audit Findings', sub: 'improvement', detail: 'النتائج والإجراءات التصحيحية التي تثبت تحسن البرنامج.', color: '#22d3ee' },
]

export function SecurityProgramMetricsDiagram() {
  const [selected, setSelected] = useState('phishing')
  const item = metricItems.find((entry) => entry.id === selected) ?? metricItems[0]
  const controls = <ChoiceButtons items={metricItems.map((entry) => ({ id: entry.id, label: entry.label }))} selected={selected} onSelect={setSelected} />
  return (
    <ChoiceShell title="SECURITY PROGRAM METRICS" controls={controls} legend={`**${item.label}** — ${item.detail}`}>
      <SelectorBoard items={metricItems} selected={selected} onSelect={setSelected} focusTitle="MEASURE PROGRAM EFFECTIVENESS" columns={3} />
    </ChoiceShell>
  )
}

const visitorStages = [
  'Visitor يسجل بياناته عند الاستقبال ويحصل على تصريح مؤقت.',
  'يُمنح وصولاً محدوداً للمنطقة المطلوبة فقط.',
  'مرافق داخلي يرافق الزائر في المناطق الحساسة.',
  'يُسجّل الدخول والخروج، ويُلغى التصريح بعد الزيارة.',
]

export function VisitorAccessControlDiagram() {
  const playback = useStepPlayback(visitorStages.length)
  const s = playback.stage
  return (
    <StepShell title="VISITOR ACCESS CONTROL" playback={playback} legend={visitorStages[s]}>
      <StageBoard stages={['Register', 'Limited access', 'Escort', 'Log + revoke']} stage={s} ariaLabel="Visitor access control animated stages" />
    </StepShell>
  )
}

const completeStages = [
  '1 — Management يضع السياسات ويحدد المسؤوليات.',
  '2 — Awareness وTraining يبنيان سلوكاً آمناً لدى الموظفين.',
  '3 — Physical Security يحمي الغرف والأجهزة والبيئة.',
  '4 — Logical Access Control ينفذ Authentication وAuthorization وLeast Privilege.',
  '5 — Monitoring وCompliance يكشفان الانحراف عن السياسات.',
  '6 — Incident Reporting والتحسين المستمر يغلقان الدائرة.',
]

export function CompleteSecurityProgramDiagram() {
  const playback = useStepPlayback(completeStages.length)
  const s = playback.stage
  return (
    <StepShell title="COMPLETE ORGANIZATIONAL SECURITY PROGRAM" playback={playback} legend={completeStages[s]}>
      <StageBoard stages={['Policy', 'Awareness', 'Physical', 'Logical', 'Monitoring', 'Reporting']} stage={s} ariaLabel="Complete organizational security program animated stages" />
    </StepShell>
  )
}
