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
  'SNMP (Simple Network Management Protocol) بروتوكول إدارة ومراقبة للأجهزة، وليس بروتوكولاً لنقل بيانات المستخدم.',
  'SNMP Manager هو النظام المركزي الذي يرسل Requests ويستقبل المعلومات ويعرضها.',
  'SNMP Agent عملية برمجية تعمل على Managed Device وتقرأ القيم المطلوبة من MIB.',
  'MIB تعرّف Managed Objects؛ وOID هو المعرّف الرقمي الفريد لكل object.',
  'المدير يحوّل القيم المستلمة إلى معلومات مفهومة على Monitoring Dashboard.',
]

export function SnmpArchitectureDiagram() {
  const playback = useStepPlayback(architectureStages.length)
  const s = playback.stage
  return (
    <StepShell title="SNMP ARCHITECTURE" playback={playback} legend={architectureStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="SNMP manager agents managed devices and MIB architecture">
        <Box x={350} y={45} w={220} h={80} title="SNMP Manager" sub="Monitoring / Requests" color="#38bdf8" active={s >= 1} />
        <LinkLine x1={460} y1={125} x2={460} y2={180} color="#38bdf8" active={s >= 1} />
        <LinkLine x1={210} y1={180} x2={710} y2={180} color="#475569" active={s >= 2} />
        <LinkLine x1={210} y1={180} x2={210} y2={225} color="#f59e0b" active={s >= 2} />
        <LinkLine x1={710} y1={180} x2={710} y2={225} color="#f59e0b" active={s >= 2} />
        <Box x={100} y={225} w={220} h={80} title="Router Agent" sub="Managed Device" color="#34d399" active={s >= 2} />
        <Box x={600} y={225} w={220} h={80} title="Switch Agent" sub="Managed Device" color="#34d399" active={s >= 2} />
        <Box x={100} y={330} w={220} h={60} title="MIB" sub="Objects + OIDs" color="#a78bfa" active={s >= 3} />
        <Box x={600} y={330} w={220} h={60} title="MIB" sub="Objects + OIDs" color="#a78bfa" active={s >= 3} />
        <FlowDot x1={460} y1={125} x2={210} y2={225} color="#38bdf8" active={s === 1 || s === 4} />
        <FlowDot x1={210} y1={225} x2={460} y2={125} color="#34d399" active={s >= 3} />
        {s >= 4 && <Badge x={330} y={370} text="Dashboard: status, traffic, CPU, alerts" color="#f59e0b" active w={280} />}
      </svg>
    </StepShell>
  )
}

const managerAgentStages = [
  'Manager يبدأ typically بطلبات مثل GET وGET-NEXT وGET-BULK وSET إلى Agent على UDP 161.',
  'Agent يستقبل الطلب ويفحص القيم المتاحة في MIB/instrumentation الجهاز.',
  'Agent يرسل Response إلى Manager بالقيمة أو بحالة الخطأ.',
  'Agent قد يبدأ إشعار Trap أو Inform إلى Manager على UDP 162 عند حدوث event.',
  'Manager هو النظام المركزي؛ Agent هو عملية على الجهاز، وليس بالضرورة الجهاز كاملاً.',
]

export function ManagerVsAgentDiagram() {
  const playback = useStepPlayback(managerAgentStages.length)
  const s = playback.stage
  return (
    <StepShell title="MANAGER vs AGENT" playback={playback} legend={managerAgentStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="SNMP manager versus agent responsibilities">
        <Box x={70} y={165} w={230} h={100} title="SNMP Manager" sub="Central monitoring system" color="#38bdf8" active />
        <Box x={620} y={165} w={230} h={100} title="SNMP Agent" sub="Process on network device" color="#34d399" active={s >= 1} />
        <LinkLine x1={300} y1={190} x2={620} y2={190} color="#38bdf8" active={s >= 0} />
        <LinkLine x1={620} y1={240} x2={300} y2={240} color="#34d399" active={s >= 2} />
        <LinkLine x1={620} y1={300} x2={300} y2={300} color="#f59e0b" active={s >= 3} />
        <FlowDot x1={300} y1={190} x2={620} y2={190} color="#38bdf8" active={s === 0} />
        <FlowDot x1={620} y1={240} x2={300} y2={240} color="#34d399" active={s === 2} />
        <FlowDot x1={620} y1={300} x2={300} y2={300} color="#f59e0b" active={s === 3} />
        {s >= 0 && <Badge x={330} y={150} text="GET / GET-NEXT / GET-BULK / SET" color="#38bdf8" active w={280} />}
        {s >= 3 && <Badge x={340} y={330} text="Trap / Inform → UDP 162" color="#f59e0b" active w={250} />}
      </svg>
    </StepShell>
  )
}

const requestResponseStages = [
  'SNMP Manager يرسل Request (مثال: GET) إلى Agent.',
  'SNMP Agent يستقبل الطلب على UDP 161 ويحدد الـ OID المطلوب.',
  'Agent يقرأ القيمة من MIB/instrumentation الجهاز.',
  'Agent يبني Response يحمل القيمة أو رمز خطأ.',
  'Manager يستلم Response ويعرض النتيجة على Dashboard.',
]

export function SnmpRequestResponseDiagram() {
  const playback = useStepPlayback(requestResponseStages.length)
  const s = playback.stage
  const labels = ['Manager: GET Request', 'Agent: receive request', 'Read OID from MIB', 'Agent: Response', 'Manager: display value']
  const colors = ['#38bdf8', '#34d399', '#a78bfa', '#34d399', '#f59e0b']
  return (
    <StepShell title="SNMP REQUEST / RESPONSE FLOW" playback={playback} legend={requestResponseStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="SNMP request response cycle with MIB read">
        {labels.map((label, index) => (
          <g key={label} opacity={s >= index ? 1 : 0.32}>
            <rect x={280} y={25 + index * 76} width={360} height={54} rx="10" fill="#0b1224" stroke={s === index ? '#f59e0b' : colors[index]} strokeWidth={s === index ? 2.4 : 1.3} />
            <SvgText x={460} y={58 + index * 76} color={s === index ? '#fbbf24' : colors[index]} size={9.5} bold>{label}</SvgText>
            {index < labels.length - 1 && <LinkLine x1={460} y1={79 + index * 76} x2={460} y2={101 + index * 76} color={colors[index]} active={s > index} />}
          </g>
        ))}
      </svg>
    </StepShell>
  )
}

const pollingStages = [
  'Polling يعني أن Manager يبدأ الطلبات بشكل دوري وفق فترة زمنية محددة.',
  'مثال تعليمي: استعلام كل 30 ثانية عن sysUpTime أو حالة الواجهة أو عدّاد الحزم.',
  'كل استعلام GET يتبعه Response من Agent بالقيمة الحالية.',
  'تكرار Polling يسمح ببناء Trends وGraphs على Dashboard.',
  'Polling المفرط يستهلك bandwidth ومعالجة على الأجهزة؛ Trap/Inform يساعد في الأحداث الفورية.',
]

export function SnmpPollingDiagram() {
  const playback = useStepPlayback(pollingStages.length)
  const s = playback.stage
  return (
    <StepShell title="SNMP POLLING" playback={playback} legend={pollingStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Periodic SNMP polling timeline">
        <Box x={70} y={165} w={200} h={90} title="Manager" sub="Timer / Poll interval" color="#38bdf8" active />
        <Box x={650} y={165} w={200} h={90} title="Agent" sub="Current MIB value" color="#34d399" active={s >= 1} />
        {[0, 1, 2].map((i) => {
          const y = 80 + i * 100
          const on = s >= i + 1
          return (
            <g key={i} opacity={on ? 1 : 0.3}>
              <LinkLine x1={270} y1={y} x2={650} y2={y} color="#38bdf8" active={on} />
              <FlowDot x1={270} y1={y} x2={650} y2={y} color="#38bdf8" active={s === i + 1} />
              <Badge x={330} y={y + 14} text={`GET ${i + 1}  →  Response ${i + 1}`} color={on ? '#34d399' : '#64748b'} active={on} w={260} />
            </g>
          )
        })}
      </svg>
    </StepShell>
  )
}

const trapStages = [
  'Trap إشعار يبدأه Agent عند حدث مثل link down أو ارتفاع CPU.',
  'يُرسل إلى Manager على UDP 162 دون أن يطلب Manager رسالة مسبقة.',
  'Trap لا يتطلب acknowledgment؛ Agent لا ينتظر رداً لتأكيد الاستلام.',
  'هذا يجعله خفيفاً وسريعاً، لكنه لا يضمن تأكيد وصول الإشعار داخل SNMP نفسه.',
  'إذا كانت MIB Definitions مفقودة على Manager قد لا يفهم معنى Trap بشكل كامل.',
]

export function SnmpTrapDiagram() {
  const playback = useStepPlayback(trapStages.length)
  const s = playback.stage
  return (
    <StepShell title="SNMP TRAP" playback={playback} legend={trapStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="SNMP trap from agent to manager without acknowledgment">
        <Box x={90} y={165} w={220} h={100} title="SNMP Agent" sub="Event detected" color="#34d399" active />
        <Box x={610} y={165} w={220} h={100} title="SNMP Manager" sub="Trap receiver :162" color="#38bdf8" active={s >= 1} />
        <LinkLine x1={310} y1={215} x2={610} y2={215} color="#f59e0b" active={s >= 1} />
        <FlowDot x1={310} y1={215} x2={610} y2={215} color="#f59e0b" active={s >= 1} />
        {s >= 2 && <Badge x={330} y={150} text="Trap → UDP 162" color="#f59e0b" active w={260} />}
        {s >= 2 && <Badge x={360} y={285} text="No ACK expected" color="#fb7185" active w={220} />}
      </svg>
    </StepShell>
  )
}

const informStages = [
  'Inform إشعار يبدأه Agent أيضاً، ويُرسل إلى Manager على UDP 162.',
  'الفرق المهم: Manager يرسل acknowledgment/response إلى Agent.',
  'وجود الرد يجعل Inform أكثر موثوقية نسبياً من Trap.',
  'قد يعيد Agent الإرسال إذا لم يصل acknowledgment حسب التنفيذ والسياسة.',
  'المقابل هو overhead أكبر؛ لا تقل إن Trap يحتاج acknowledgment.',
]

export function SnmpInformDiagram() {
  const playback = useStepPlayback(informStages.length)
  const s = playback.stage
  return (
    <StepShell title="SNMP INFORM" playback={playback} legend={informStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="SNMP inform with acknowledgment from manager">
        <Box x={90} y={165} w={220} h={100} title="SNMP Agent" sub="Inform source" color="#34d399" active />
        <Box x={610} y={165} w={220} h={100} title="SNMP Manager" sub="Inform receiver :162" color="#38bdf8" active={s >= 1} />
        <LinkLine x1={310} y1={195} x2={610} y2={195} color="#f59e0b" active={s >= 1} />
        <LinkLine x1={610} y1={245} x2={310} y2={245} color="#34d399" active={s >= 2} />
        <FlowDot x1={310} y1={195} x2={610} y2={195} color="#f59e0b" active={s === 1} />
        <FlowDot x1={610} y1={245} x2={310} y2={245} color="#34d399" active={s >= 2} />
        {s >= 2 && <Badge x={340} y={300} text="ACK / Response from Manager" color="#34d399" active w={260} />}
      </svg>
    </StepShell>
  )
}

const mibStages = [
  'MIB (Management Information Base) مجموعة تعريفات منظمة للـ Managed Objects داخل شجرة.',
  'التعريف يحدد اسم الكائن، OID، النوع، الصلاحية (read-only/read-write) والوصف.',
  'القيم الفعلية موجودة داخل الجهاز/instrumentation؛ MIB ليست بالضرورة Database تقليدية.',
  'المجموعات مثل system وinterfaces تنظم الكائنات حسب الموضوع.',
  'Manager يستخدم MIB لترجمة OID إلى اسم مفهوم ووحدة قياس واضحة.',
]

export function MibStructureDiagram() {
  const playback = useStepPlayback(mibStages.length)
  const s = playback.stage
  return (
    <StepShell title="MIB STRUCTURE" playback={playback} legend={mibStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="MIB tree definitions and actual values">
        <Box x={350} y={30} w={220} h={60} title="MIB tree" sub="Definitions / Namespaces" color="#a78bfa" active />
        <LinkLine x1={460} y1={90} x2={250} y2={140} color="#a78bfa" active={s >= 3} />
        <LinkLine x1={460} y1={90} x2={670} y2={140} color="#a78bfa" active={s >= 3} />
        <Box x={120} y={140} w={260} h={70} title="system group" sub="sysDescr, sysUpTime, sysName" color="#38bdf8" active={s >= 3} />
        <Box x={540} y={140} w={260} h={70} title="interfaces group" sub="ifDescr, ifInOctets, ifOperStatus" color="#34d399" active={s >= 3} />
        <Box x={120} y={260} w={260} h={70} title="Definition" sub="name · OID · type · access" color="#a78bfa" active={s >= 1} />
        <Box x={540} y={260} w={260} h={70} title="Actual value" sub="Device instrumentation" color="#f59e0b" active={s >= 2} />
        {s >= 4 && <Badge x={300} y={365} text="Manager maps OID → name → meaningful value" color="#f59e0b" active w={340} />}
      </svg>
    </StepShell>
  )
}

const oidHierarchyStages = [
  'OID (Object Identifier) معرّف رقمي فريد لكل كائن إدارة داخل شجرة SNMP.',
  'تُقرأ الأرقام من اليسار إلى اليمين من الجذر إلى الفرع الأكثر تحديداً.',
  '`1.3.6.1.2.1` يقابل iso.org.dod.internet.mgmt.mib-2.',
  'إضافة `.1.1` تصل إلى `sysDescr`؛ وإضافة `.2.1` تصل إلى عدّاد الواجهات.',
  'الاسم الرمزي مثل `sysUpTime` أسهل للبشر، بينما OID هو الهوية الرقمية الدقيقة.',
]

export function OidHierarchyDiagram() {
  const playback = useStepPlayback(oidHierarchyStages.length)
  const s = playback.stage
  const levels = [
    ['iso (1)', '1'],
    ['org (3)', '1.3'],
    ['dod (6)', '1.3.6'],
    ['internet (1)', '1.3.6.1'],
    ['mgmt (2)', '1.3.6.1.2'],
    ['mib-2 (1)', '1.3.6.1.2.1'],
    ['system (1)', '1.3.6.1.2.1.1'],
    ['sysDescr (1)', '1.3.6.1.2.1.1.1'],
  ]
  return (
    <StepShell title="OID HIERARCHY" playback={playback} legend={oidHierarchyStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Numeric OID hierarchy from iso to sysDescr">
        {levels.map((level, index) => {
          const width = 300 + index * 14
          const x = (920 - width) / 2
          const y = 10 + index * 49
          const on = s >= Math.min(index, 6)
          return (
            <g key={level[1]} opacity={on ? 1 : 0.28}>
              <rect x={x} y={y} width={width} height={38} rx="8" fill="#0b1224" stroke={s === index ? '#f59e0b' : '#38bdf8'} strokeWidth={s === index ? 2.4 : 1.2} />
              <SvgText x={x + width / 2} y={y + 16} color={s === index ? '#fbbf24' : '#cbd5e1'} size={8.5} bold>{level[0]}</SvgText>
              <SvgText x={x + width / 2} y={y + 30} color="#94a3b8" size={7.5}>{level[1]}</SvgText>
            </g>
          )
        })}
      </svg>
    </StepShell>
  )
}

interface OidNode {
  id: string
  label: string
  oid: string
  meaning: string
  example: string
  x: number
  y: number
  w: number
  color: string
}

const oidNodes: OidNode[] = [
  { id: 'iso', label: 'iso', oid: '1', meaning: 'أعلى فرع في شجرة OID حسب ISO.', example: 'جذر الشجرة', x: 35, y: 55, w: 110, color: '#64748b' },
  { id: 'org', label: 'org', oid: '1.3', meaning: 'فرع المنظمات داخل iso.', example: 'تنظيم الشجرة', x: 160, y: 55, w: 110, color: '#64748b' },
  { id: 'dod', label: 'dod', oid: '1.3.6', meaning: 'فرع تاريخي مرتبط بـ DoD داخل الشجرة.', example: 'جزء من المسار القياسي', x: 285, y: 55, w: 110, color: '#64748b' },
  { id: 'internet', label: 'internet', oid: '1.3.6.1', meaning: 'الفرع الذي يحتوي mgmt وprivate.', example: 'Internet branch', x: 410, y: 55, w: 110, color: '#38bdf8' },
  { id: 'mgmt', label: 'mgmt', oid: '1.3.6.1.2', meaning: 'كائنات الإدارة القياسية.', example: 'Management branch', x: 535, y: 55, w: 110, color: '#38bdf8' },
  { id: 'mib2', label: 'mib-2', oid: '1.3.6.1.2.1', meaning: 'Internet Standard MIB-II tree، وتحتها مجموعات مثل system وinterfaces.', example: 'الشجرة القياسية التي يستخدمها CCNA', x: 660, y: 55, w: 110, color: '#a78bfa' },
  { id: 'system', label: 'system', oid: '1.3.6.1.2.1.1', meaning: 'مجموعة معلومات عامة عن الجهاز.', example: 'sysDescr · sysUpTime · sysName', x: 785, y: 55, w: 110, color: '#34d399' },
  { id: 'sysDescr', label: 'sysDescr', oid: '1.3.6.1.2.1.1.1', meaning: 'وصف نصي للنظام والبرمجيات؛ كائن للقراءة غالباً.', example: 'Cisco IOS Software, ... (مثال تعليمي)', x: 30, y: 225, w: 130, color: '#34d399' },
  { id: 'sysObjectID', label: 'sysObjectID', oid: '1.3.6.1.2.1.1.2', meaning: 'معرّف يشير إلى نوع الجهاز/المنصة في الشجرة.', example: 'enterprise-specific OID', x: 175, y: 225, w: 130, color: '#34d399' },
  { id: 'sysUpTime', label: 'sysUpTime', oid: '1.3.6.1.2.1.1.3', meaning: 'زمن التشغيل منذ آخر إعادة تشغيل، ويُقاس بـ centiseconds في MIB-II.', example: '12345600 → 123456.00 ثانية (مثال)', x: 320, y: 225, w: 130, color: '#f59e0b' },
  { id: 'sysName', label: 'sysName', oid: '1.3.6.1.2.1.1.5', meaning: 'اسم الجهاز المكوّن إدارياً.', example: 'R1-CORE (مثال تعليمي)', x: 465, y: 225, w: 130, color: '#38bdf8' },
  { id: 'ifNumber', label: 'ifNumber', oid: '1.3.6.1.2.1.2.1', meaning: 'عدد الواجهات التي يبلغ عنها الجهاز.', example: '5 (مثال تعليمي)', x: 610, y: 225, w: 130, color: '#a78bfa' },
  { id: 'ifDescr', label: 'ifDescr', oid: '1.3.6.1.2.1.2.2.1.2', meaning: 'وصف كل واجهة داخل ifTable؛ يظهر مع INDEX الخاص بالواجهة.', example: 'GigabitEthernet0/0 (مثال)', x: 755, y: 225, w: 130, color: '#a78bfa' },
]

export function OidExplorerDiagram() {
  const [selected, setSelected] = useState('sysDescr')
  const node = oidNodes.find((item) => item.id === selected) ?? oidNodes[0]
  const legend = `**${node.label}** · \`${node.oid}\` — ${node.meaning} القيمة/المثال: ${node.example}. اضغط أي مستوى في الشجرة لتتبع مسار الـ OID.`
  const controls = <ChoiceButtons items={oidNodes.map((item) => ({ id: item.id, label: item.label }))} selected={selected} onSelect={setSelected} />
  return (
    <ChoiceShell title="INTERACTIVE OID EXPLORER" controls={controls} legend={legend}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Interactive OID tree explorer">
        <SvgText x={460} y={30} color="#94a3b8" size={9} bold>NUMERIC OID TREE — CLICK A NODE</SvgText>
        {oidNodes.slice(0, 7).map((item, index) => {
          const next = oidNodes[index + 1]
          if (next && next.x > item.x) {
            return <LinkLine key={`oid-link-${item.id}`} x1={item.x + item.w} y1={95} x2={next.x} y2={95} color="#475569" active={selected === item.id || selected === next.id} />
          }
          return null
        })}
        {oidNodes.slice(0, 7).map((item) => (
          <ClickNode key={item.id} x={item.x} y={item.y} w={item.w} h={64} title={item.label} sub={item.oid} color={item.color} selected={selected === item.id} onClick={() => setSelected(item.id)} />
        ))}
        <LinkLine x1={840} y1={145} x2={840} y2={215} color="#a78bfa" active />
        <LinkLine x1={95} y1={215} x2={840} y2={215} color="#a78bfa" active />
        {oidNodes.slice(7).map((item) => (
          <ClickNode key={item.id} x={item.x} y={item.y} w={item.w} h={64} title={item.label} sub={item.oid} color={item.color} selected={selected === item.id} onClick={() => setSelected(item.id)} />
        ))}
        <Badge x={300} y={340} text={`Selected: ${node.label}  ·  ${node.oid}`} color="#f59e0b" active w={340} />
      </svg>
    </ChoiceShell>
  )
}

const getStages = [
  'GET طلب من Manager لقراءة قيمة OID واحد محدد عند Agent.',
  'الطلب يُرسل إلى UDP 161 ويحمل OID المطلوب ورقم الطلب/المجتمع أو بيانات v3.',
  'Agent يفحص الصلاحيات ثم يقرأ القيمة من MIB/instrumentation.',
  'Agent يرسل Response يحمل القيمة أو error-status.',
  'GET مفيد لقيمة دقيقة، لكنه غير عملي لقراءة جدول كامل حزمة حزمة.',
]

export function SnmpGetOperationDiagram() {
  const playback = useStepPlayback(getStages.length)
  const s = playback.stage
  return (
    <StepShell title="SNMP GET OPERATION" playback={playback} legend={getStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="SNMP GET request and response">
        <Box x={60} y={160} w={220} h={100} title="Manager" sub="GET OID value" color="#38bdf8" active />
        <Box x={640} y={160} w={220} h={100} title="Agent" sub="Read + respond" color="#34d399" active={s >= 1} />
        <Box x={640} y={300} w={220} h={60} title="MIB Object" sub="Requested OID" color="#a78bfa" active={s >= 2} />
        <LinkLine x1={280} y1={190} x2={640} y2={190} color="#38bdf8" active={s >= 0} />
        <LinkLine x1={640} y1={230} x2={280} y2={230} color="#34d399" active={s >= 3} />
        <FlowDot x1={280} y1={190} x2={640} y2={190} color="#38bdf8" active={s === 0} />
        <FlowDot x1={640} y1={230} x2={280} y2={230} color="#34d399" active={s >= 3} />
        {s >= 4 && <Badge x={300} y={100} text="One OID per focused GET" color="#f59e0b" active w={300} />}
      </svg>
    </StepShell>
  )
}

const getNextBulkStages = [
  'GET-NEXT يطلب الكائن التالي بعد OID معطى داخل ترتيب MIB.',
  'بتكرار GET-NEXT يمكن استكشاف جدول مثل ifTable حزمة بعد حزمة.',
  'GET-BULK يطلب عدة كائنات/صفوف في تبادل واحد.',
  'GET-BULK متاح في SNMPv2c وSNMPv3، وليس في SNMPv1.',
  'GET-BULK أكثر كفاءة عند جمع بيانات كثيرة مثل جدول الواجهات.',
]

export function GetNextVsGetBulkDiagram() {
  const playback = useStepPlayback(getNextBulkStages.length)
  const s = playback.stage
  return (
    <StepShell title="GET-NEXT vs GET-BULK" playback={playback} legend={getNextBulkStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="GET-NEXT compared with GET-BULK">
        <Box x={60} y={150} w={230} h={100} title="Manager" sub="Discovery / Collection" color="#38bdf8" active />
        <Box x={630} y={150} w={230} h={100} title="Agent + MIB" sub="Ordered objects" color="#34d399" active />
        <LinkLine x1={290} y1={180} x2={630} y2={180} color="#a78bfa" active={s >= 0} />
        <LinkLine x1={290} y1={230} x2={630} y2={230} color="#f59e0b" active={s >= 2} />
        {[0, 1, 2].map((i) => (
          <Badge key={i} x={310 + i * 100} y={125} text={`Next ${i + 1}`} color={s >= 1 ? '#a78bfa' : '#64748b'} active={s >= 1} w={85} />
        ))}
        {[0, 1, 2, 3].map((i) => (
          <Badge key={i} x={305 + i * 78} y={265} text={`Row ${i + 1}`} color={s >= 2 ? '#f59e0b' : '#64748b'} active={s >= 2} w={68} />
        ))}
        {s >= 3 && <Badge x={320} y={335} text="GET-BULK: v2c / v3 only" color="#f59e0b" active w={280} />}
      </svg>
    </StepShell>
  )
}

const setStages = [
  'SET يطلب تعديل قيمة كائن يدعم الكتابة (writable object).',
  'Agent يفحص access rights: RO/RW، ACL، وسياسة v3 إن وُجدت.',
  'إذا كان التعديل مسموحاً يحدّث Agent القيمة في instrumentation الجهاز.',
  'Agent يرسل Response إما بنجاح التعديل أو بخطأ مثل read-only/noSuchName حسب الإصدار.',
  'للمراقبة يُفضّل RO؛ وRW فقط عند الحاجة الواضحة ومع تقييد الوصول.',
]

export function SnmpSetOperationDiagram() {
  const playback = useStepPlayback(setStages.length)
  const s = playback.stage
  return (
    <StepShell title="SNMP SET OPERATION" playback={playback} legend={setStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="SNMP SET with access rights check">
        <Box x={60} y={160} w={220} h={100} title="Manager" sub="SET request" color="#38bdf8" active />
        <Box x={640} y={160} w={220} h={100} title="Agent" sub="Check access" color="#34d399" active={s >= 1} />
        <Box x={640} y={300} w={220} h={60} title="Writable Object" sub="Value change" color="#f59e0b" active={s >= 2} />
        <LinkLine x1={280} y1={190} x2={640} y2={190} color="#38bdf8" active={s >= 0} />
        <LinkLine x1={640} y1={230} x2={280} y2={230} color={s === 3 ? '#fb7185' : '#34d399'} active={s >= 3} />
        <FlowDot x1={280} y1={190} x2={640} y2={190} color="#38bdf8" active={s === 0} />
        {s >= 4 && <Badge x={300} y={100} text="Prefer RO for monitoring" color="#f59e0b" active w={300} />}
      </svg>
    </StepShell>
  )
}

interface VersionInfo {
  id: string
  label: string
  detail: string
}

const versionInfo: Record<string, VersionInfo> = {
  v1: {
    id: 'v1',
    label: 'SNMPv1',
    detail: 'أول إصدار أساسي: community strings، عمليات محدودة (GET/GET-NEXT/SET/Response/Trap)، لا يوجد GET-BULK، ولا authentication أو encryption قوية. مناسب للمراقبة الأساسية فقط.',
  },
  v2c: {
    id: 'v2c',
    label: 'SNMPv2c',
    detail: 'لا يزال يعتمد community strings، لكنه يضيف GET-BULK وInform وتحسيناً في معالجة الأخطاء والأداء. COMMUNITY ليس encryption ولا مصادقة قوية.',
  },
  v3: {
    id: 'v3',
    label: 'SNMPv3',
    detail: 'يستخدم USM/VACM بدلاً من community strings، ويدعم authentication وmessage integrity وprivacy/encryption وaccess control. مستويات الأمان: noAuthNoPriv وauthNoPriv وauthPriv.',
  },
}

const versionRows = [
  ['Community strings', 'Yes', 'Yes', 'No — USM security'],
  ['GET-BULK', 'No', 'Yes', 'Yes'],
  ['Authentication', 'Community-based', 'Community-based', 'Yes (configurable)'],
  ['Encryption', 'No', 'No', 'Optional'],
  ['Overall security', 'Weak', 'Weak', 'Stronger'],
]

export function VersionsComparisonDiagram() {
  const [selected, setSelected] = useState('v2c')
  const info = versionInfo[selected]
  const controls = <ChoiceButtons items={Object.values(versionInfo).map((item) => ({ id: item.id, label: item.label }))} selected={selected} onSelect={setSelected} />
  return (
    <ChoiceShell title="SNMP VERSIONS COMPARISON" controls={controls} legend={`**${info.label}** — ${info.detail}`}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="SNMPv1 SNMPv2c SNMPv3 comparison">
        {['v1', 'v2c', 'v3'].map((id, index) => (
          <ClickNode
            key={id}
            x={55 + index * 290}
            y={70}
            w={260}
            h={110}
            title={versionInfo[id].label}
            sub={id === 'v1' ? 'Community · no bulk' : id === 'v2c' ? 'Community · GET-BULK' : 'USM · auth / priv'}
            color={['#64748b', '#38bdf8', '#34d399'][index]}
            selected={selected === id}
            onClick={() => setSelected(id)}
          />
        ))}
        {versionRows.map((row, index) => (
          <g key={row[0]} opacity={index === 0 ? 0.95 : 0.78}>
            <rect x={55} y={220 + index * 35} width={805} height={28} rx="6" fill="#0b1224" stroke="#1e3a5f" strokeWidth="1" />
            <SvgText x={100} y={239 + index * 35} color="#cbd5e1" size={8.5} bold anchor="start">{row[0]}</SvgText>
            <SvgText x={340} y={239 + index * 35} color="#94a3b8" size={8}>{row[1]}</SvgText>
            <SvgText x={590} y={239 + index * 35} color="#94a3b8" size={8}>{row[2]}</SvgText>
            <SvgText x={800} y={239 + index * 35} color={selected === 'v3' ? '#fbbf24' : '#94a3b8'} size={8} bold>{row[3]}</SvgText>
          </g>
        ))}
      </svg>
    </ChoiceShell>
  )
}

interface SecurityInfo {
  id: string
  label: string
  detail: string
}

const securityInfo: Record<string, SecurityInfo> = {
  noAuthNoPriv: {
    id: 'noAuthNoPriv',
    label: 'noAuthNoPriv',
    detail: 'بدون authentication وبدون encryption. قد يستخدم username/context، لكنه لا يوفر integrity أو privacy قوية. الأضعف بين مستويات v3.',
  },
  authNoPriv: {
    id: 'authNoPriv',
    label: 'authNoPriv',
    detail: 'Authentication وmessage integrity مفعّلان، لكن الرسائل غير مشفّرة. يؤكد هوية المصدر وسلامة الرسالة دون إخفاء المحتوى.',
  },
  authPriv: {
    id: 'authPriv',
    label: 'authPriv',
    detail: 'Authentication + Privacy/encryption. أقوى مستويات SNMPv3: يتحقق من المصدر والرسالة ويشفّر الحمولة. دعم الخوارزميات يعتمد على IOS والمنصة.',
  },
}

export function SecurityLevelsDiagram() {
  const [selected, setSelected] = useState('authPriv')
  const info = securityInfo[selected]
  const controls = <ChoiceButtons items={Object.values(securityInfo).map((item) => ({ id: item.id, label: item.label }))} selected={selected} onSelect={setSelected} />
  return (
    <ChoiceShell title="SNMPv3 SECURITY LEVELS" controls={controls} legend={`**${info.label}** — ${info.detail}`}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="SNMPv3 noAuthNoPriv authNoPriv authPriv security levels">
        {Object.values(securityInfo).map((item, index) => (
          <ClickNode
            key={item.id}
            x={45 + index * 295}
            y={75}
            w={265}
            h={150}
            title={item.label}
            sub={index === 0 ? 'No auth · No privacy' : index === 1 ? 'Auth · No privacy' : 'Auth · Privacy'}
            color={['#fb7185', '#38bdf8', '#34d399'][index]}
            selected={selected === item.id}
            onClick={() => setSelected(item.id)}
          />
        ))}
        <Badge x={250} y={280} text="Auth = identity + integrity" color="#38bdf8" active={selected !== 'noAuthNoPriv'} w={260} />
        <Badge x={520} y={330} text="Privacy = encryption" color="#34d399" active={selected === 'authPriv'} w={220} />
      </svg>
    </ChoiceShell>
  )
}

const authPrivacyStages = [
  'Authentication في SNMPv3 يتحقق من هوية المصدر وسلامة الرسالة (message integrity).',
  'Authentication وحده لا يعني أن محتوى الرسالة مخفي؛ هذا مستوى authNoPriv.',
  'Privacy/encryption يشفّر الحمولة حتى لا تقرأها أطراف أخرى؛ هذا الجزء موجود في authPriv.',
  'noAuthNoPriv لا يوفر authentication ولا encryption.',
  'أسماء الخوارزميات مثل SHA/AES/DES ودعمها تختلف حسب إصدار IOS والمنصة.',
]

export function AuthenticationVsPrivacyDiagram() {
  const playback = useStepPlayback(authPrivacyStages.length)
  const s = playback.stage
  return (
    <StepShell title="AUTHENTICATION vs PRIVACY" playback={playback} legend={authPrivacyStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Authentication and privacy in SNMPv3">
        <Box x={110} y={150} w={280} h={120} title="Authentication" sub="Who sent it + integrity" color="#38bdf8" active={s >= 0} />
        <Box x={530} y={150} w={280} h={120} title="Privacy / Encryption" sub="Hide the payload" color="#34d399" active={s >= 2} />
        <LinkLine x1={390} y1={210} x2={530} y2={210} color="#f59e0b" active={s >= 3} />
        {s >= 3 && <Badge x={350} y={310} text="authPriv = both together" color="#f59e0b" active w={250} />}
        {s === 1 && <Badge x={360} y={310} text="authNoPriv = auth only" color="#38bdf8" active w={250} />}
      </svg>
    </StepShell>
  )
}

const portsStages = [
  'UDP 161: Manager يرسل استعلامات مثل GET وGET-NEXT وGET-BULK وSET إلى Agent.',
  'Agent يرسل Response للطلبات المعتادة ضمن تبادل SNMP على الجانب الخاص بـ port 161.',
  'UDP 162: Agent يرسل Trap وInform إلى Manager كإشعارات agent-initiated.',
  'Inform يتطلب acknowledgment/response من Manager؛ Trap لا يتطلب ACK.',
  'Firewall/ACL يجب أن يسمح المسارات المطلوبة؛ حجب port 161 يمنع Polling وحجب 162 يمنع الإشعارات.',
]

export function SnmpUdpPortsDiagram() {
  const playback = useStepPlayback(portsStages.length)
  const s = playback.stage
  return (
    <StepShell title="SNMP UDP PORTS 161 / 162" playback={playback} legend={portsStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="SNMP UDP ports 161 and 162">
        <Box x={70} y={165} w={220} h={100} title="SNMP Manager" sub="Polling / Receiver" color="#38bdf8" active />
        <Box x={630} y={165} w={220} h={100} title="SNMP Agent" sub="Device process" color="#34d399" active />
        <LinkLine x1={290} y1={190} x2={630} y2={190} color="#38bdf8" active={s >= 0} />
        <LinkLine x1={630} y1={240} x2={290} y2={240} color="#34d399" active={s >= 1} />
        <LinkLine x1={630} y1={310} x2={290} y2={310} color="#f59e0b" active={s >= 2} />
        <FlowDot x1={290} y1={190} x2={630} y2={190} color="#38bdf8" active={s === 0} />
        <FlowDot x1={630} y1={240} x2={290} y2={240} color="#34d399" active={s === 1} />
        <FlowDot x1={630} y1={310} x2={290} y2={310} color="#f59e0b" active={s >= 2} />
        <Badge x={350} y={145} text="Requests → UDP 161" color="#38bdf8" active={s >= 0} w={230} />
        <Badge x={350} y={335} text="Trap / Inform → UDP 162" color="#f59e0b" active={s >= 2} w={250} />
      </svg>
    </StepShell>
  )
}

const dashboardStages = [
  'Dashboard يجمع القيم من عدة Agents عبر Polling الدوري.',
  'Interface card يعرض الحالة مثل up/down واسم الواجهة من كائنات المجموعة interfaces.',
  'Traffic graph يستخدم عدّادات مثل ifInOctets/ifOutOctets ويحسب معدل التدفق خلال الزمن.',
  'CPU/memory/uptime تظهر حسب توفر الكائنات على المنصة؛ ليست كل القيم متاحة على كل جهاز.',
  'Trap أو Inform قد يحدّث تنبيهاً فورياً بين دورات Polling.',
]

export function MonitoringDashboardDiagram() {
  const playback = useStepPlayback(dashboardStages.length)
  const s = playback.stage
  return (
    <StepShell title="MONITORING DASHBOARD SIMULATION" playback={playback} legend={dashboardStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="SNMP monitoring dashboard simulation">
        <SvgText x={460} y={35} color="#cbd5e1" size={11} bold>NETWORK MONITORING DASHBOARD — EDUCATIONAL VALUES</SvgText>
        <Box x={55} y={70} w={240} h={110} title="Interface Status" sub={s >= 1 ? 'Gi0/0: up · Gi0/1: down' : 'Waiting for poll'} color={s >= 1 ? '#34d399' : '#64748b'} active={s >= 1} />
        <Box x={340} y={70} w={240} h={110} title="Traffic Trend" sub={s >= 2 ? 'ifInOctets → rate graph' : 'Counters not collected'} color={s >= 2 ? '#38bdf8' : '#64748b'} active={s >= 2} />
        <Box x={625} y={70} w={240} h={110} title="Device Health" sub={s >= 3 ? 'CPU · memory · uptime' : 'Platform dependent'} color={s >= 3 ? '#a78bfa' : '#64748b'} active={s >= 3} />
        <Box x={180} y={250} w={560} h={100} title="Alert Panel" sub={s >= 4 ? 'Trap/Inform: link down on SW1' : 'No event received'} color={s >= 4 ? '#fb7185' : '#64748b'} active={s >= 4} />
        <FlowDot x1={460} y1={180} x2={460} y2={250} color="#f59e0b" active={s >= 4} />
      </svg>
    </StepShell>
  )
}

interface TroubleInfo {
  id: string
  label: string
  detail: string
}

const troubleInfo: Record<string, TroubleInfo> = {
  connectivity: {
    id: 'connectivity',
    label: 'Connectivity',
    detail: '**Network category.** الأعراض: Manager لا يصل إلى Agent إطلاقاً. تحقق IP connectivity وrouting وping/ traceroute حسب السياسات، ثم UDP 161 في firewall. النتيجة المتوقعة: وصول الطلب إلى Agent.',
  },
  version: {
    id: 'version',
    label: 'Version',
    detail: '**SNMP configuration category.** الأعراض: الجهاز يرد أو لا يفهم الرسالة. طابق SNMP version بين Manager وAgent؛ v1/v2c community مقابل v3 user/group. النتيجة: قبول الطلب أو رسالة خطأ واضحة.',
  },
  community: {
    id: 'community',
    label: 'Community',
    detail: '**SNMP configuration category.** الأعراض: authentication failure أو timeout مع v1/v2c. راجع Community String وطريقة إرسالها؛ تذكّر أنها ليست encryption. النتيجة: Response صالح.',
  },
  acl: {
    id: 'acl',
    label: 'ACL / Firewall',
    detail: '**Network/Config category.** الأعراض: ping ينجح لكن SNMP fails. افحص access-list المرتبطة بـ SNMP والـ firewall على UDP 161/162. النتيجة: السماح لمصدر Manager المصرح به.',
  },
  oid: {
    id: 'oid',
    label: 'OID / MIB',
    detail: '**MIB/OID category.** الأعراض: يوجد Response لكن القيمة غير مفهومة أو noSuchObject. تحقق OID تحميل مجموعة MIB المناسبة على Manager. النتيجة: عرض الاسم والقيمة بشكل صحيح.',
  },
  v3auth: {
    id: 'v3auth',
    label: 'v3 Auth',
    detail: '**SNMPv3 category.** الأعراض: authentication failure. راجع username/group/auth protocol/password وSecurity Level على الطرفين. النتيجة: قبول الرسائل الموقّعة.',
  },
  v3priv: {
    id: 'v3priv',
    label: 'v3 Privacy',
    detail: '**SNMPv3 category.** الأعراض: فشل عند authPriv فقط. راجع privacy protocol/_password ودعم الخوارزمية على IOS/Platform. النتيجة: فك تشفير الرسائل بنجاح.',
  },
  access: {
    id: 'access',
    label: 'RO vs RW',
    detail: '**SNMP configuration category.** الأعراض: GET يعمل وSET مرفوض. راجع RO/RW community أو v3 access policy؛ SET يحتاج writable object وصلاحية. النتيجة: نجاح SET فقط عند وجود صلاحية واضحة.',
  },
}

export function SnmpTroubleshootingFlowDiagram() {
  const [selected, setSelected] = useState('connectivity')
  const info = troubleInfo[selected]
  const controls = <ChoiceButtons items={Object.values(troubleInfo).map((item) => ({ id: item.id, label: item.label }))} selected={selected} onSelect={setSelected} />
  const branches = Object.values(troubleInfo)
  return (
    <ChoiceShell title="SNMP TROUBLESHOOTING DECISION TREE" controls={controls} legend={`${info.detail} ابدأ دائماً بالتمييز بين connectivity و SNMP configuration ومشكلة MIB/OID.`}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Interactive SNMP troubleshooting decision tree">
        <Box x={350} y={20} w={220} h={60} title="SNMP fails?" sub="Choose a branch" color="#f59e0b" active />
        <LinkLine x1={460} y1={80} x2={460} y2={120} color="#f59e0b" active />
        <LinkLine x1={115} y1={120} x2={805} y2={120} color="#475569" active />
        {branches.map((item, index) => {
          const x = 20 + (index % 4) * 225
          const y = index < 4 ? 145 : 285
          const cx = x + 100
          return (
            <g key={item.id}>
              <LinkLine x1={cx} y1={120} x2={cx} y2={y} color="#475569" active={selected === item.id} />
              <ClickNode x={x} y={y} w={200} h={85} title={item.label} sub={index < 4 ? 'Branch A' : 'Branch B'} color={index < 4 ? '#38bdf8' : '#a78bfa'} selected={selected === item.id} onClick={() => setSelected(item.id)} />
            </g>
          )
        })}
      </svg>
    </ChoiceShell>
  )
}

interface OperationInfo {
  id: string
  label: string
  sender: string
  receiver: string
  message: string
  ack: string
  detail: string
}

const operations: OperationInfo[] = [
  { id: 'GET', label: 'GET', sender: 'Manager', receiver: 'Agent', message: 'GetRequest → Response', ack: 'Response from Agent', detail: 'يقرأ قيمة OID واحد. يُرسل إلى Agent على UDP 161 ويرجع Response بالقيمة أو خطأ.' },
  { id: 'GET-NEXT', label: 'GET-NEXT', sender: 'Manager', receiver: 'Agent', message: 'GetNextRequest → Response', ack: 'Response from Agent', detail: 'يطلب الكائن التالي في ترتيب MIB؛ مفيد لاستكشاف الجداول خطوة بخطوة.' },
  { id: 'GET-BULK', label: 'GET-BULK', sender: 'Manager', receiver: 'Agent', message: 'GetBulkRequest → Response', ack: 'Response from Agent', detail: 'يجمع عدة كائنات/صفوف في تبادل واحد. متاح في v2c وv3، وليس v1.' },
  { id: 'SET', label: 'SET', sender: 'Manager', receiver: 'Agent', message: 'SetRequest → Response', ack: 'Response from Agent', detail: 'يعدّل كائناً writable فقط، بشرط السماح بالصلاحية وACL/v3 policy.' },
  { id: 'RESPONSE', label: 'RESPONSE', sender: 'Agent', receiver: 'Manager', message: 'GetResponse', ack: 'It is the reply itself', detail: 'رسالة Agent التي تحمل القيمة أو error-status رداً على طلب Manager.' },
  { id: 'TRAP', label: 'TRAP', sender: 'Agent', receiver: 'Manager', message: 'Trap → UDP 162', ack: 'No ACK', detail: 'إشعار agent-initiated إلى Manager؛ لا ينتظر acknowledgment.' },
  { id: 'INFORM', label: 'INFORM', sender: 'Agent', receiver: 'Manager', message: 'InformRequest → ACK', ack: 'ACK from Manager', detail: 'إشعار agent-initiated يتطلب acknowledgment؛ أكثر موثوقية نسبياً من Trap.' },
]

export function SnmpOperationsExplorerDiagram() {
  const [selected, setSelected] = useState('GET')
  const operation = operations.find((item) => item.id === selected) ?? operations[0]
  const managerInitiated = ['GET', 'GET-NEXT', 'GET-BULK', 'SET'].includes(operation.id)
  const x1 = managerInitiated ? 280 : 640
  const x2 = managerInitiated ? 640 : 280
  const controls = <ChoiceButtons items={operations.map((item) => ({ id: item.id, label: item.label }))} selected={selected} onSelect={setSelected} />
  const legend = `**${operation.label}** — Sender: \`${operation.sender}\` · Receiver: \`${operation.receiver}\` · Message: \`${operation.message}\` · ${operation.ack}. ${operation.detail}`
  return (
    <ChoiceShell title="INTERACTIVE SNMP OPERATIONS EXPLORER" controls={controls} legend={legend}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Interactive SNMP operations flow explorer">
        <Box x={60} y={160} w={220} h={100} title="SNMP Manager" sub={operation.receiver === 'Manager' ? 'Receiver' : 'Request source'} color="#38bdf8" active />
        <Box x={640} y={160} w={220} h={100} title="SNMP Agent" sub={operation.sender === 'Agent' ? 'Notification source' : 'Request target'} color="#34d399" active />
        <LinkLine x1={x1} y1={210} x2={x2} y2={210} color={operation.id === 'TRAP' || operation.id === 'INFORM' ? '#f59e0b' : '#38bdf8'} active />
        <FlowDot x1={x1} y1={210} x2={x2} y2={210} color={operation.id === 'TRAP' || operation.id === 'INFORM' ? '#f59e0b' : '#38bdf8'} active />
        {operation.id === 'INFORM' && <LinkLine x1={640} y1={285} x2={280} y2={285} color="#34d399" active />}
        {operation.id === 'INFORM' && <FlowDot x1={640} y1={285} x2={280} y2={285} color="#34d399" active />}
        <Badge x={300} y={100} text={operation.message} color="#f59e0b" active w={320} />
        <Badge x={320} y={335} text={operation.ack} color={operation.ack === 'No ACK' ? '#fb7185' : '#34d399'} active w={280} />
      </svg>
    </ChoiceShell>
  )
}
