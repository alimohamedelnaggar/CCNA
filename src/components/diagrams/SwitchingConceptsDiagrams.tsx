import { Pause, Play, RotateCcw, SkipBack, SkipForward } from 'lucide-react'
import { useEffect, useState, type ReactNode } from 'react'
import { RichText } from '../ui/RichText'
import { LinkLine, Node, Packet } from './ArchitectureDiagrams'
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
      <button
        type="button"
        onClick={playback.toggle}
        className={`${base} border-accent-400/30 bg-accent-500/10 font-bold text-accent-300 hover:bg-accent-500/20`}
      >
        {playback.playing ? <Pause size={13} /> : <Play size={13} />}
        {playback.playing ? 'إيقاف' : 'شغّل'}
      </button>
      <button type="button" onClick={playback.previous} className={`${base} border-sky-400/15 text-slate-300 hover:border-accent-400/40`}>
        <SkipBack size={13} /> السابق
      </button>
      <button type="button" onClick={playback.next} className={`${base} border-sky-400/15 text-slate-300 hover:border-accent-400/40`}>
        <SkipForward size={13} /> التالي
      </button>
      <button type="button" onClick={playback.reset} className={`${base} border-sky-400/15 text-slate-300 hover:border-accent-400/40`}>
        <RotateCcw size={13} /> إعادة
      </button>
    </div>
  )
}

function StepShell({
  title,
  playback,
  legend,
  children,
}: {
  title: string
  playback: StepPlayback
  legend: string
  children: ReactNode
}) {
  return (
    <div className="my-6 overflow-hidden rounded-2xl border border-sky-400/12 bg-navy-950/70">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-sky-400/10 px-4 py-3">
        <span className="font-display text-[0.78rem] font-bold text-slate-300" dir="ltr">
          {title}
        </span>
        <StepControls playback={playback} />
      </div>
      <div className="diagram-grid overflow-x-auto px-2 py-4" dir="ltr">
        {children}
      </div>
      <div className="border-t border-sky-400/10 bg-sky-400/[0.03] px-4 py-3 text-[0.85rem] leading-[1.9] text-slate-300" dir="rtl">
        <span className="ml-2 rounded bg-accent-500/15 px-1.5 py-0.5 font-display text-[0.7rem] font-bold text-accent-300" dir="ltr">
          {playback.stage + 1}
        </span>
        <RichText>{legend}</RichText>
      </div>
    </div>
  )
}

function Panel({
  x,
  y,
  w,
  h,
  title,
  lines,
  color = '#38bdf8',
  active = false,
  size = 9,
}: {
  x: number
  y: number
  w: number
  h: number
  title: string
  lines: string[]
  color?: string
  active?: boolean
  size?: number
}) {
  return (
    <g opacity={active ? 1 : 0.45}>
      <rect x={x} y={y} width={w} height={h} rx="12" fill="#0b1224" stroke={color} strokeWidth={active ? 2.2 : 1.1} />
      <SvgText x={x + w / 2} y={y + 21} color={color} size={10} bold>
        {title}
      </SvgText>
      {lines.map((line, index) => (
        <SvgText key={index} x={x + w / 2} y={y + 40 + index * 15} color="#cbd5e1" size={size}>
          {line}
        </SvgText>
      ))}
    </g>
  )
}

function Note({ x, y, text, color = '#64748b', size = 9.5 }: { x: number; y: number; text: string; color?: string; size?: number }) {
  return (
    <SvgText x={x} y={y} color={color} size={size}>
      {text}
    </SvgText>
  )
}

function Layer({
  x,
  y,
  w,
  h,
  title,
  sub,
  color,
  active = false,
}: {
  x: number
  y: number
  w: number
  h: number
  title: string
  sub: string
  color: string
  active?: boolean
}) {
  return (
    <g opacity={active ? 1 : 0.45}>
      <rect x={x} y={y} width={w} height={h} rx="10" fill="#0b1224" stroke={color} strokeWidth={active ? 2.4 : 1.2} />
      <SvgText x={x + w / 2} y={y + 24} color={color} size={11} bold>
        {title}
      </SvgText>
      <SvgText x={x + w / 2} y={y + 43} color="#cbd5e1" size={9}>
        {sub}
      </SvgText>
    </g>
  )
}

function CrossMark({ x, y, color = '#fb7185' }: { x: number; y: number; color?: string }) {
  return (
    <g stroke={color} strokeWidth="2.6" strokeLinecap="round">
      <line x1={x - 8} y1={y - 8} x2={x + 8} y2={y + 8} />
      <line x1={x + 8} y1={y - 8} x2={x - 8} y2={y + 8} />
    </g>
  )
}

function FrameCard({
  x,
  y,
  w = 150,
  src,
  dst,
  color = '#38bdf8',
  active = false,
}: {
  x: number
  y: number
  w?: number
  src: string
  dst: string
  color?: string
  active?: boolean
}) {
  return (
    <g opacity={active ? 1 : 0.4}>
      <rect x={x} y={y} width={w} height={62} rx="9" fill="#0b1224" stroke={color} strokeWidth={active ? 2.2 : 1.2} />
      <SvgText x={x + w / 2} y={y + 18} color={color} size={9.5} bold>
        ETHERNET FRAME
      </SvgText>
      <SvgText x={x + w / 2} y={y + 37} color="#cbd5e1" size={8.5}>
        {`SRC ${src}`}
      </SvgText>
      <SvgText x={x + w / 2} y={y + 52} color="#cbd5e1" size={8.5}>
        {`DST ${dst}`}
      </SvgText>
    </g>
  )
}

const hubSwitchStages = [
  'الـ Hub بيكرر أي إشارة لكل المنافذ. كل الأجهزة في نفس الـ collision domain، فمفيش تصفية ولا اختيار للمنفذ.',
  'الـ Switch بيقرأ عنوان الـ destination MAC ويرسل الـ frame للمنفذ المرتبط بيه فقط.',
  'الـ Hub غالباً half-duplex: جهاز واحد بيتكلم في مرة، ولو اتنين بعتوا هيحصل collision.',
  'في الـ Switch كل منفذ collision domain مستقل، والوضع الطبيعي full-duplex.',
  'النتيجة: الـ switch بيقلل الـ collisions ويحسن استخدام الـ bandwidth مقارنة بالـ hub.',
]

export function HubVsSwitchDiagram() {
  const playback = useStepPlayback(hubSwitchStages.length)
  const s = playback.stage
  const hubActive = s <= 1
  const switchActive = s >= 1
  return (
    <StepShell title="HUB vs SWITCH" playback={playback} legend={hubSwitchStages[s]}>
      <svg viewBox="0 0 920 410" className="h-auto w-full min-w-[880px]" role="img" aria-label="Hub compared with a Layer 2 switch">
        <Note x={460} y={24} text="REPEATING HARDWARE vs INTELLIGENT LAYER 2 FORWARDING" color="#94a3b8" size={10} />
        <g opacity={hubActive ? 1 : 0.4}>
          <Layer x={40} y={60} w={410} h={270} title="HUB" sub="one shared collision domain" color="#f59e0b" active={hubActive} />
          <Node x={190} y={170} w={140} h={60} label="HUB" sub="repeats all" color="#f59e0b" tooltip="Hub" active={hubActive} />
          <Node x={55} y={85} w={95} h={48} label="PC1" sub="NIC" color="#64748b" tooltip="PC1" />
          <Node x={55} y={250} w={95} h={48} label="PC2" sub="NIC" color="#64748b" tooltip="PC2" />
          <Node x={330} y={85} w={95} h={48} label="PC3" sub="NIC" color="#64748b" tooltip="PC3" />
          <Node x={330} y={250} w={95} h={48} label="PC4" sub="NIC" color="#64748b" tooltip="PC4" />
          <LinkLine x1={190} y1={200} x2={150} y2={109} color="#f59e0b" active={hubActive} />
          <LinkLine x1={190} y1={200} x2={150} y2={274} color="#f59e0b" active={hubActive} />
          <LinkLine x1={330} y1={200} x2={330} y2={109} color="#f59e0b" active={hubActive} />
          <LinkLine x1={330} y1={200} x2={330} y2={274} color="#f59e0b" active={hubActive} />
          {s === 2 && <Packet point={{ x: 260, y: 200 }} color="#fb7185" label="collision" />}
        </g>
        <g opacity={switchActive ? 1 : 0.4}>
          <Layer x={470} y={60} w={410} h={270} title="SWITCH" sub="separate collision domain per port" color="#34d399" active={switchActive} />
          <Node x={620} y={170} w={140} h={60} label="SWITCH" sub="L2 forwarding" color="#34d399" tooltip="Switch" active={switchActive} />
          <Node x={485} y={85} w={95} h={48} label="PC1" sub="Gi0/1" color="#64748b" tooltip="PC1 Gi0/1" />
          <Node x={485} y={250} w={95} h={48} label="PC2" sub="Gi0/2" color="#64748b" tooltip="PC2 Gi0/2" />
          <Node x={795} y={85} w={95} h={48} label="PC3" sub="Gi0/3" color="#64748b" tooltip="PC3 Gi0/3" />
          <Node x={795} y={250} w={95} h={48} label="PC4" sub="Gi0/4" color="#34d399" tooltip="PC4 Gi0/4" active={s >= 1} />
          <LinkLine x1={620} y1={200} x2={580} y2={109} color="#64748b" active={false} />
          <LinkLine x1={620} y1={200} x2={580} y2={274} color="#64748b" active={false} />
          <LinkLine x1={760} y1={200} x2={795} y2={109} color="#64748b" active={false} />
          <LinkLine x1={760} y1={200} x2={795} y2={274} color="#34d399" active={s >= 1} />
          {s >= 1 && <Packet point={{ x: 778, y: 237 }} color="#34d399" label="only port" />}
        </g>
        <Panel
          x={40}
          y={345}
          w={840}
          h={50}
          title="CCNA TAKEAWAY"
          lines={['A hub repeats to every port. A switch uses the destination MAC to choose one outgoing port.']}
          color="#38bdf8"
          active
        />
      </svg>
    </StepShell>
  )
}

const frameStages = [
  'الـ Ethernet frame هو وحدة البيانات على Layer 2. الـ switch بيقرأ جوّه الـ frame عناوين MAC مش عناوين IP.',
  'Preamble وSFD بيستخدموا للمزامنةphysical synchronization؛ مش جزء من بيانات التطبيق.',
  'Destination MAC وSource MAC: الـ switch يتعلم من Source ويتخذ قرار الإرسال من Destination.',
  'Type/Length بيحدد نوع الـ payload، و_data بيحمل الرسالة نفسها.',
  'FCS(checksum) بيسمح للـ switch في Store-and-Forward إنه يتأكد إن الـ frame سليم قبل إرساله.',
]

export function EthernetFrameStructureDiagram() {
  const playback = useStepPlayback(frameStages.length)
  const s = playback.stage
  const fields = [
    { x: 45, w: 115, label: 'PREAMBLE', detail: '7B + SFD 1B', color: '#64748b', stage: 1 },
    { x: 160, w: 140, label: 'DEST MAC', detail: '6 bytes', color: '#38bdf8', stage: 2 },
    { x: 300, w: 140, label: 'SOURCE MAC', detail: '6 bytes', color: '#a78bfa', stage: 2 },
    { x: 440, w: 115, label: 'TYPE', detail: '2 bytes', color: '#f59e0b', stage: 3 },
    { x: 555, w: 215, label: 'DATA / PAYLOAD', detail: '46-1500 bytes', color: '#34d399', stage: 3 },
    { x: 770, w: 105, label: 'FCS', detail: '4 bytes', color: '#fb7185', stage: 4 },
  ]
  return (
    <StepShell title="ETHERNET FRAME STRUCTURE" playback={playback} legend={frameStages[s]}>
      <svg viewBox="0 0 920 400" className="h-auto w-full min-w-[880px]" role="img" aria-label="Ethernet frame fields">
        <Note x={460} y={30} text="LAYER 2 ENCAPSULATION - FIELDS IN ORDER" color="#94a3b8" size={10.5} />
        <SvgText x={45} y={78} color="#94a3b8" size={9} anchor="start">frame begins</SvgText>
        <SvgText x={875} y={78} color="#94a3b8" size={9} anchor="end">frame ends</SvgText>
        {fields.map((field) => {
          const active = s === 0 || s === field.stage
          return (
            <g key={field.label} opacity={active ? 1 : 0.35}>
              <rect x={field.x} y={105} width={field.w} height={92} rx="8" fill="#0b1224" stroke={field.color} strokeWidth={active ? 2.4 : 1.1} />
              <SvgText x={field.x + field.w / 2} y={140} color={field.color} size={9.5} bold>{field.label}</SvgText>
              <SvgText x={field.x + field.w / 2} y={166} color="#cbd5e1" size={8.5}>{field.detail}</SvgText>
            </g>
          )
        })}
        <Panel
          x={45}
          y={235}
          w={830}
          h={140}
          title={s === 4 ? 'STORE-AND-FORWARD' : 'WHERE THE SWITCH LOOKS'}
          lines={
            s === 4
              ? ['Store-and-Forward receives the whole frame, checks FCS, then forwards.', 'A bad FCS frame is discarded instead of being sent onward.']
              : ['Source MAC is learned. Destination MAC is used for the forwarding decision.', 'IP addresses stay inside the payload from the switch point of view.']
          }
          color={s === 4 ? '#fb7185' : '#38bdf8'}
          active
          size={9.5}
        />
      </svg>
    </StepShell>
  )
}

const macStructureStages = [
  'MAC address طولها 48 bit يعني 6 bytes، وبتكتب hexadecimal زي 00:11:22:33:44:55.',
  'أول 3 bytes اسمهم OUI وبيحددوا الشركة المصنّعة.',
  'آخر 3 bytes بيحددوا بطاقة الشبكة أو الجهاز داخل الشركة.',
  'أول bit في أول byte بيسمّى I/G: صفر unicast، وواحد multicast.',
  'Broadcast MAC هو FF:FF:FF:FF:FF:FF: كل الـ bits فيه 1.',
]

export function MacAddressStructureDiagram() {
  const playback = useStepPlayback(macStructureStages.length)
  const s = playback.stage
  const bytes = s === 4 ? ['FF', 'FF', 'FF', 'FF', 'FF', 'FF'] : ['00', '11', '22', '33', '44', '55']
  return (
    <StepShell title="MAC ADDRESS STRUCTURE" playback={playback} legend={macStructureStages[s]}>
      <svg viewBox="0 0 920 410" className="h-auto w-full min-w-[880px]" role="img" aria-label="48 bit MAC address structure">
        <Note x={460} y={26} text="48 BITS = 6 OCTETS = 12 HEX DIGITS" color="#94a3b8" size={10.5} />
        <SvgText x={340} y={72} color="#38bdf8" size={11} bold>OUI - VENDOR</SvgText>
        <SvgText x={680} y={72} color="#a78bfa" size={11} bold>DEVICE IDENTIFIER</SvgText>
        <rect x={65} y={88} width={390} height={8} rx="4" fill="#38bdf8" opacity={s === 0 || s === 1 ? 0.8 : 0.25} />
        <rect x={465} y={88} width={390} height={8} rx="4" fill="#a78bfa" opacity={s === 0 || s === 2 ? 0.8 : 0.25} />
        {bytes.map((byte, index) => {
          const color = index < 3 ? '#38bdf8' : '#a78bfa'
          const active = s === 0 || s === 4 || (s === 1 && index < 3) || (s === 2 && index >= 3) || (s === 3 && index === 0)
          return (
            <g key={index} opacity={active ? 1 : 0.35}>
              <rect x={70 + index * 135} y={125} width={115} height={78} rx="10" fill="#0b1224" stroke={color} strokeWidth={active ? 2.4 : 1.1} />
              <SvgText x={127 + index * 135} y={164} color={color} size={16} bold>{byte}</SvgText>
              <SvgText x={127 + index * 135} y={188} color="#64748b" size={8}>{`BYTE ${index + 1}`}</SvgText>
            </g>
          )
        })}
        {s === 3 && (
          <>
            <CrossMark x={92} y={230} color="#34d399" />
            <Note x={460} y={234} text="I/G BIT = 0 -> UNICAST    |    I/G BIT = 1 -> MULTICAST" color="#34d399" size={10.5} />
          </>
        )}
        <Panel
          x={55}
          y={280}
          w={810}
          h={105}
          title={s === 4 ? 'BROADCAST MAC' : 'MAC vs IP'}
          lines={
            s === 4
              ? ['FF:FF:FF:FF:FF:FF is the Layer 2 broadcast destination.', 'A switch floods it to other eligible ports in the same VLAN.']
              : ['MAC = Layer 2 local delivery. IP = Layer 3 logical end-to-end address.', 'The switch learns source MAC and forwards using destination MAC.']
          }
          color={s === 4 ? '#fb7185' : '#38bdf8'}
          active
          size={9.5}
        />
      </svg>
    </StepShell>
  )
}

const learningStages = [
  'خطوة 1: الـ frame بيوصل على Gi0/1 من PC-A.',
  'خطوة 2: السويتش بيقرأ Source MAC: 00:11:22:33:44:55.',
  'خطوة 3: بيربط الـ Source MAC بالمنفذ الداخل Gi0/1.',
  'خطوة 4: بيحدّث الـ MAC address table.',
  'خطوة 5: بعدين بيفحص Destination MAC ويقرر forward / filter / flood.',
]

export function MacLearningProcessDiagram() {
  const playback = useStepPlayback(learningStages.length)
  const s = playback.stage
  const steps = ['1 ARRIVE', '2 READ SRC MAC', '3 MAP TO PORT', '4 UPDATE TABLE', '5 CHECK DST MAC']
  return (
    <StepShell title="MAC LEARNING PROCESS" playback={playback} legend={learningStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Step by step MAC address learning">
        <Note x={460} y={24} text="THE SWITCH LEARNS FROM THE SOURCE MAC ADDRESS" color="#94a3b8" size={10} />
        <Node x={45} y={150} w={155} h={72} label="PC-A" sub="00:11:22:33:44:55" color="#38bdf8" tooltip="PC-A source MAC" active={s <= 1} />
        <LinkLine x1={200} y1={186} x2={320} y2={186} color="#38bdf8" active={s <= 1} />
        <FrameCard x={220} y={112} src="00:11:22:33:44:55" dst="AA:BB:CC:DD:EE:FF" color="#38bdf8" active={s <= 1} />
        <Layer x={320} y={130} w={250} h={165} title="SWITCH" sub="learning + forwarding logic" color="#34d399" active />
        {steps.map((step, index) => (
          <SvgText
            key={step}
            x={445}
            y={180 + index * 22}
            color={index === s ? '#34d399' : '#64748b'}
            size={index === s ? 10.5 : 9}
            bold={index === s}
          >
            {step}
          </SvgText>
        ))}
        <Panel
          x={600}
          y={120}
          w={270}
          h={175}
          title="MAC ADDRESS TABLE"
          lines={
            s >= 3
              ? ['MAC              VLAN  PORT', '0011.2233.4455    1    Gi0/1', 'Type: Dynamic', 'Aging timer started']
              : ['No matching entry yet.', 'The source MAC will be added after the mapping step.']
          }
          color={s >= 3 ? '#34d399' : '#64748b'}
          active
          size={8.5}
        />
        <Panel
          x={45}
          y={335}
          w={825}
          h={65}
          title="IMPORTANT"
          lines={['Learning uses the SOURCE MAC. The DESTINATION MAC is used later for the forwarding decision.']}
          color="#f59e0b"
          active
        />
      </svg>
    </StepShell>
  )
}

const tableStages = [
  'الـ MAC address table (CAM table) بيربط MAC بـ VLAN وinterface ونوع الإدخال وعمر الإدخال.',
  'مثال: PC-A جوّه VLAN 1 على Gi0/1 وPC-B جوّه VLAN 1 على Gi0/2.',
  'الإدخالاتDynamic بتتعمل تلقائياً لما السويتش يشوف source MAC جديد.',
  'Aging timer بيشيل الإدخال القديم لو مفيش حركة؛ لو الجهاز بعت حزمة جديدة يتم تجديد timer.',
  'Static entries بيدخلها المسؤول، وبتفضل ثابتة غالباً ومش بتمشي بالـ aging.',
]

export function MacAddressTableDiagram() {
  const playback = useStepPlayback(tableStages.length)
  const s = playback.stage
  const rows = [
    { mac: '00:11:22:33:44:55', vlan: '1', port: 'Gi0/1', type: 'Dynamic', age: '280 sec', color: '#38bdf8' },
    { mac: 'AA:BB:CC:DD:EE:FF', vlan: '1', port: 'Gi0/2', type: 'Dynamic', age: '120 sec', color: '#a78bfa' },
    { mac: '12:34:56:78:9A:BC', vlan: '1', port: 'Gi0/3', type: 'Static', age: '-', color: '#f59e0b' },
  ]
  const columns = [
    { x: 75, label: 'MAC ADDRESS', w: 190 },
    { x: 275, label: 'VLAN', w: 70 },
    { x: 355, label: 'INTERFACE', w: 130 },
    { x: 495, label: 'TYPE', w: 120 },
    { x: 625, label: 'AGING', w: 190 },
  ]
  return (
    <StepShell title="MAC ADDRESS TABLE (CAM TABLE)" playback={playback} legend={tableStages[s]}>
      <svg viewBox="0 0 920 410" className="h-auto w-full min-w-[880px]" role="img" aria-label="MAC address table columns and example entries">
        <Note x={460} y={24} text="DESTINATION MAC LOOKUP HAPPENS IN THIS TABLE" color="#94a3b8" size={10} />
        <rect x={55} y={60} width={810} height={250} rx="12" fill="#0b1224" stroke="#334155" strokeWidth={1.5} />
        {columns.map((column) => (
          <SvgText key={column.label} x={column.x} y={92} color="#94a3b8" size={9.5} anchor="start" bold>
            {column.label}
          </SvgText>
        ))}
        <line x1={70} y1={104} x2={850} y2={104} stroke="#334155" strokeWidth={1.4} />
        {rows.map((row, index) => {
          const active =
            s === 0 || (s === 1 && index < 2) || (s === 2 && row.type === 'Dynamic') || (s === 3 && index < 2) || (s === 4 && row.type === 'Static')
          const values = [row.mac, row.vlan, row.port, row.type, row.age]
          return (
            <g key={row.mac} opacity={active ? 1 : 0.35}>
              <rect x={70} y={116 + index * 60} width={780} height={50} rx="8" fill="#0a1730" stroke={row.color} strokeWidth={active ? 1.8 : 1} />
              {values.map((value, colIndex) => (
                <SvgText
                  key={`${row.mac}-${columns[colIndex].label}`}
                  x={columns[colIndex].x}
                  y={147 + index * 60}
                  color={colIndex === 0 ? row.color : '#cbd5e1'}
                  size={9.3}
                  anchor="start"
                  bold={colIndex === 0}
                >
                  {value}
                </SvgText>
              ))}
            </g>
          )
        })}
        <Panel
          x={55}
          y={330}
          w={810}
          h={62}
          title={s === 4 ? 'STATIC ENTRY' : 'HOW THE SWITCH USES IT'}
          lines={
            s === 4
              ? ['A static MAC-to-port mapping is configured manually and normally does not age out.']
              : ['Destination MAC + VLAN are matched to an interface, so the frame is sent to the right port.']
          }
          color={s === 4 ? '#f59e0b' : '#34d399'}
          active
        />
      </svg>
    </StepShell>
  )
}

const forwardingStages = [
  'PC-A عايز يبعت لـ PC-B. الـ frame داخل من Gi0/1 والـ Destination MAC هو AA:BB:CC:DD:EE:FF.',
  'السويتش بيعمل lookup للـ destination MAC في الجدول.',
  'الجدول بيقول إن AA:BB:CC:DD:EE:FF على Gi0/2.',
  'الـ frame بيتsend فقط من Gi0/2 لو PC-B.',
  'المنفذ الداخل Gi0/1 مستبعد، وباقي المنافذ مبتستخدمش. معروف يبقى flooding.',
]

export function KnownUnicastForwardingDiagram() {
  const playback = useStepPlayback(forwardingStages.length)
  const s = playback.stage
  const incoming = s <= 1
  const outgoing = s >= 2
  return (
    <StepShell title="KNOWN UNICAST FORWARDING" playback={playback} legend={forwardingStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Known unicast frame forwarded only to the destination port">
        <Note x={460} y={24} text="DESTINATION MAC IS IN THE TABLE - SEND TO ONE PORT" color="#94a3b8" size={10} />
        <Node x={55} y={80} w={145} h={58} label="PC-A" sub="Gi0/1 IN" color="#38bdf8" tooltip="Incoming PC" active={incoming} />
        <Node x={720} y={80} w={145} h={58} label="PC-B" sub="Gi0/2 OUT" color="#34d399" tooltip="Destination PC" active={outgoing} />
        <Node x={55} y={255} w={145} h={58} label="PC-C" sub="Gi0/3" color="#64748b" tooltip="Not used" active={false} />
        <Node x={720} y={255} w={145} h={58} label="PC-D" sub="Gi0/4" color="#64748b" tooltip="Not used" active={false} />
        <Layer x={350} y={130} w={220} h={145} title="SWITCH" sub="MAC table lookup" color="#34d399" active />
        <LinkLine x1={350} y1={165} x2={200} y2={109} color="#38bdf8" active={incoming} />
        <LinkLine x1={570} y1={165} x2={720} y2={109} color="#34d399" active={outgoing} />
        <LinkLine x1={350} y1={245} x2={200} y2={284} color="#475569" active={false} />
        <LinkLine x1={570} y1={245} x2={720} y2={284} color="#475569" active={false} />
        {incoming && <Packet point={{ x: 275, y: 137 }} color="#38bdf8" label="arrives" />}
        {outgoing && <Packet point={{ x: 645, y: 137 }} color="#34d399" label="one copy" />}
        {s >= 3 && <CrossMark x={350} y={165} color="#fb7185" />}
        {s >= 3 && <Note x={470} y={300} text="INCOMING PORT EXCLUDED" color="#fb7185" size={9.5} />}
        <Panel
          x={55}
          y={340}
          w={810}
          h={62}
          title={s === 4 ? 'NO FLOODING' : 'TABLE RESULT'}
          lines={
            s >= 2
              ? ['AA:BB:CC:DD:EE:FF -> Gi0/2. Forward only there.',
                 'The switch does not send the frame back out Gi0/1.']
              : ['The switch compares the destination MAC with its MAC address table.']
          }
          color={s >= 2 ? '#34d399' : '#38bdf8'}
          active
        />
      </svg>
    </StepShell>
  )
}

const unknownStages = [
  'الـ Destination MAC مش موجود في الجدول. ده اسمه unknown unicast، مش broadcast.',
  'الـ frame بيدخل من Gi0/1.',
  'السويتش بيبعت نسخة لكل منفذ مؤهل تاني في نفس الـ VLAN: Gi0/2 وGi0/3 وGi0/4.',
  'المنفذ الداخل Gi0/1 مستبعد من الـ flooding.',
  'لما الـ device يرد، السويتش هيتعلم عنوانه من Source MAC ويبقى الإرسال الجاي known unicast.',
]

export function UnknownUnicastFloodingDiagram() {
  const playback = useStepPlayback(unknownStages.length)
  const s = playback.stage
  const incoming = s === 1
  const flood = s >= 2
  return (
    <StepShell title="UNKNOWN UNICAST FLOODING" playback={playback} legend={unknownStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Unknown unicast flooded to all other eligible ports">
        <Note x={460} y={24} text="DESTINATION MAC NOT FOUND - FLOOD TO OTHER PORTS IN SAME VLAN" color="#94a3b8" size={9.5} />
        <Node x={55} y={80} w={145} h={58} label="PC-A" sub="Gi0/1 IN" color="#38bdf8" tooltip="Incoming PC" active />
        <Node x={720} y={80} w={145} h={58} label="PC-B" sub="Gi0/2" color="#34d399" tooltip="Eligible port" active={flood} />
        <Node x={55} y={255} w={145} h={58} label="PC-C" sub="Gi0/3" color="#34d399" tooltip="Eligible port" active={flood} />
        <Node x={720} y={255} w={145} h={58} label="PC-D" sub="Gi0/4" color="#34d399" tooltip="Eligible port" active={flood} />
        <Layer x={350} y={130} w={220} h={145} title="SWITCH" sub="lookup MISS" color="#f59e0b" active />
        <LinkLine x1={350} y1={165} x2={200} y2={109} color="#38bdf8" active />
        <LinkLine x1={570} y1={165} x2={720} y2={109} color="#34d399" active={flood} />
        <LinkLine x1={350} y1={245} x2={200} y2={284} color="#34d399" active={flood} />
        <LinkLine x1={570} y1={245} x2={720} y2={284} color="#34d399" active={flood} />
        {incoming && <Packet point={{ x: 275, y: 137 }} color="#38bdf8" label="arrives" />}
        {flood && <Packet point={{ x: 645, y: 137 }} color="#34d399" label="copy" />}
        {flood && <Packet point={{ x: 275, y: 264 }} color="#34d399" label="copy" />}
        {flood && <Packet point={{ x: 645, y: 264 }} color="#34d399" label="copy" />}
        {s >= 3 && <CrossMark x={350} y={165} color="#fb7185" />}
        {s >= 3 && <Note x={470} y={300} text="Gi0/1 EXCLUDED" color="#fb7185" size={9.5} />}
        <Panel
          x={55}
          y={340}
          w={810}
          h={62}
          title={s === 4 ? 'NEXT: LEARN FROM REPLY' : 'FLOODING RULE'}
          lines={
            s === 4
              ? ['The reply has a source MAC; the switch learns it and future unicast is direct.']
              : ['Flood means copies to every other eligible port in the same VLAN, not back to the incoming port.']
          }
          color={s === 4 ? '#38bdf8' : '#f59e0b'}
          active
        />
      </svg>
    </StepShell>
  )
}

const broadcastStages = [
  'Broadcast Ethernet frame ليها Destination MAC = FF:FF:FF:FF:FF:FF.',
  'PC-A بعت ARP request كـ broadcast جوّه VLAN 1.',
  'السويتش بيبعت نسخ من الـ broadcast لكل المنافذ التانية المؤهلة في نفس الـ VLAN.',
  'زي الـ unknown unicast، المنفذ الداخل مستبعد.',
  'كل الـ ports اللي وصلها الـ broadcast داخل نفس broadcast domain.',
]

export function BroadcastFloodingDiagram() {
  const playback = useStepPlayback(broadcastStages.length)
  const s = playback.stage
  const flood = s >= 2
  return (
    <StepShell title="BROADCAST FLOODING" playback={playback} legend={broadcastStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Broadcast frame flooded to all other ports in the VLAN">
        <Note x={460} y={24} text="DST MAC FF:FF:FF:FF:FF:FF -> FLOOD IN THE VLAN" color="#94a3b8" size={10} />
        <rect x={35} y={55} width={850} height={270} rx="16" fill="none" stroke="#38bdf8" strokeOpacity={0.25} strokeDasharray="7 6" />
        <Note x={460} y={75} text="VLAN 1 / SAME BROADCAST DOMAIN" color="#38bdf8" size={9.5} />
        <Node x={55} y={100} w={145} h={58} label="PC-A" sub="Gi0/1 IN" color="#38bdf8" tooltip="Sender" active />
        <Node x={720} y={100} w={145} h={58} label="PC-B" sub="Gi0/2" color="#a78bfa" tooltip="Receives broadcast" active={flood} />
        <Node x={55} y={245} w={145} h={58} label="PC-C" sub="Gi0/3" color="#a78bfa" tooltip="Receives broadcast" active={flood} />
        <Node x={720} y={245} w={145} h={58} label="PC-D" sub="Gi0/4" color="#a78bfa" tooltip="Receives broadcast" active={flood} />
        <Layer x={350} y={145} w={220} h={120} title="SWITCH" sub="broadcast frame" color="#a78bfa" active />
        <LinkLine x1={350} y1={175} x2={200} y2={129} color="#38bdf8" active />
        <LinkLine x1={570} y1={175} x2={720} y2={129} color="#a78bfa" active={flood} />
        <LinkLine x1={350} y1={240} x2={200} y2={274} color="#a78bfa" active={flood} />
        <LinkLine x1={570} y1={240} x2={720} y2={274} color="#a78bfa" active={flood} />
        {s === 1 && <Packet point={{ x: 275, y: 152 }} color="#38bdf8" label="ARP" />}
        {flood && <Packet point={{ x: 645, y: 152 }} color="#a78bfa" label="flood" />}
        {flood && <Packet point={{ x: 275, y: 257 }} color="#a78bfa" label="flood" />}
        {flood && <Packet point={{ x: 645, y: 257 }} color="#a78bfa" label="flood" />}
        {s >= 3 && <CrossMark x={350} y={175} color="#fb7185" />}
        {s >= 3 && <Note x={465} y={292} text="INCOMING PORT EXCLUDED" color="#fb7185" size={9.5} />}
        <Panel
          x={55}
          y={345}
          w={810}
          h={58}
          title="KNOWN UNICAST vs FLOOD"
          lines={['Known unicast goes to one port. Unknown unicast and broadcast go to other eligible ports in the VLAN.']}
          color="#f59e0b"
          active
        />
      </svg>
    </StepShell>
  )
}

const collisionStages = [
  'Collision domain هو منطقة لو اتنين أجهزة بعتوا في نفس الوقت هيحصل تصادم.',
  'في الـ hub كل الأجهزة في domain واحد، ولذلك بيحصل collisions. الوضع غالباً half-duplex.',
  'في الـ Switch كل منفذ collision domain مستقل.',
  'مع full-duplex، فيه مسار إرسال ومسار استقبال منفصلين فمفيش collision على الـ link.',
  'لازم نفرق: الـ switch يفصل collision domains، بس مش بالضرورة يفصل broadcast domains.',
]

export function CollisionDomainsDiagram() {
  const playback = useStepPlayback(collisionStages.length)
  const s = playback.stage
  return (
    <StepShell title="COLLISION DOMAINS" playback={playback} legend={collisionStages[s]}>
      <svg viewBox="0 0 920 410" className="h-auto w-full min-w-[880px]" role="img" aria-label="Hub one collision domain compared with switch per port collision domains">
        <Note x={460} y={24} text="COLLISION DOMAIN = WHERE SIMULTANEOUS SENDS CAN COLLIDE" color="#94a3b8" size={9.5} />
        <g opacity={s <= 1 ? 1 : 0.4}>
          <Layer x={35} y={60} w={410} h={265} title="HUB NETWORK" sub="ONE shared collision domain" color="#f59e0b" active={s <= 1} />
          <Node x={180} y={165} w={130} h={58} label="HUB" sub="repeater" color="#f59e0b" tooltip="Hub" active />
          <Node x={55} y={90} w={95} h={46} label="PC1" sub="NIC" color="#64748b" tooltip="PC1" />
          <Node x={55} y={250} w={95} h={46} label="PC2" sub="NIC" color="#64748b" tooltip="PC2" />
          <Node x={330} y={90} w={95} h={46} label="PC3" sub="NIC" color="#64748b" tooltip="PC3" />
          <LinkLine x1={180} y1={194} x2={150} y2={113} color="#f59e0b" active={s <= 1} />
          <LinkLine x1={180} y1={194} x2={150} y2={273} color="#f59e0b" active={s <= 1} />
          <LinkLine x1={310} y1={194} x2={330} y2={113} color="#f59e0b" active={s <= 1} />
          {s === 1 && <Packet point={{ x: 245, y: 194 }} color="#fb7185" label="COLLISION" />}
        </g>
        <g opacity={s >= 2 ? 1 : 0.4}>
          <Layer x={475} y={60} w={410} h={265} title="SWITCHED NETWORK" sub="separate domain on each port" color="#34d399" active={s >= 2} />
          <Node x={620} y={165} w={130} h={58} label="SWITCH" sub="L2 ports" color="#34d399" tooltip="Switch" active={s >= 2} />
          <Node x={495} y={90} w={95} h={46} label="PC1" sub="D1" color="#38bdf8" tooltip="Domain 1" active={s >= 2} />
          <Node x={495} y={250} w={95} h={46} label="PC2" sub="D2" color="#a78bfa" tooltip="Domain 2" active={s >= 2} />
          <Node x={790} y={90} w={95} h={46} label="PC3" sub="D3" color="#f59e0b" tooltip="Domain 3" active={s >= 2} />
          <LinkLine x1={620} y1={194} x2={590} y2={113} color="#38bdf8" active={s >= 2} />
          <LinkLine x1={620} y1={194} x2={590} y2={273} color="#a78bfa" active={s >= 2} />
          <LinkLine x1={750} y1={194} x2={790} y2={113} color="#f59e0b" active={s >= 2} />
        </g>
        <Panel
          x={35}
          y={345}
          w={850}
          h={50}
          title="REMEMBER"
          lines={['Switch separates collision domains. Routers or VLAN boundaries separate broadcast domains.']}
          color="#38bdf8"
          active
        />
      </svg>
    </StepShell>
  )
}

const broadcastDomainStages = [
  'Broadcast domain هو مجموعة منافذ لو واحد بعت broadcast كل الباقيين هيوصلهم.',
  'في الصورة دي PC-A وPC-B وPC-C كلهم في VLAN 1 على نفس السويتش.',
  'لما PC-A يبعت broadcast، السويتش بيبعت نسخ لكل منفذ تاني في نفس الـ VLAN.',
  'الـ Router حد Layer 3؛ افتراضياً مش بيمرر Ethernet broadcast لشبكة تانية.',
  'د مقدمة بس: VLAN وإعداداتها بالتفصيل في Domain 2. هنا المطلوب تعريف الـ broadcast domain فقط.',
]

export function BroadcastDomainsDiagram() {
  const playback = useStepPlayback(broadcastDomainStages.length)
  const s = playback.stage
  const flood = s >= 2 && s <= 3
  return (
    <StepShell title="BROADCAST DOMAINS" playback={playback} legend={broadcastDomainStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Broadcast domain bounded by a router">
        <Note x={460} y={24} text="LAYER 2 SWITCH DOES NOT SEPARATE BROADCAST DOMAINS BY DEFAULT" color="#94a3b8" size={9.5} />
        <rect x={35} y={55} width={500} height={265} rx="16" fill="none" stroke="#38bdf8" strokeOpacity={0.28} strokeDasharray="7 6" />
        <Note x={285} y={78} text="BROADCAST DOMAIN A - VLAN 1" color="#38bdf8" size={9.5} />
        <rect x={720} y={95} width={165} height={185} rx="16" fill="none" stroke="#a78bfa" strokeOpacity={0.28} strokeDasharray="7 6" />
        <Note x={802} y={118} text="DOMAIN B" color="#a78bfa" size={9.5} />
        <Node x={60} y={110} w={125} h={52} label="PC-A" sub="Gi0/1" color="#38bdf8" tooltip="Sender" active />
        <Node x={60} y={235} w={125} h={52} label="PC-B" sub="Gi0/2" color="#a78bfa" tooltip="VLAN 1 member" active={flood} />
        <Node x={420} y={110} w={100} h={52} label="PC-C" sub="Gi0/3" color="#a78bfa" tooltip="VLAN 1 member" active={flood} />
        <Layer x={250} y={160} w={140} h={105} title="SWITCH" sub="VLAN 1" color="#34d399" active />
        <LinkLine x1={250} y1={185} x2={185} y2={136} color="#38bdf8" active />
        <LinkLine x1={250} y1={240} x2={185} y2={261} color="#a78bfa" active={flood} />
        <LinkLine x1={390} y1={185} x2={420} y2={136} color="#a78bfa" active={flood} />
        <LinkLine x1={390} y1={235} x2={550} y2={215} color="#64748b" active={s >= 3} />
        <Layer x={550} y={185} w={140} h={62} title="ROUTER R1" sub="Layer 3 boundary" color="#f59e0b" active={s >= 3} />
        <LinkLine x1={690} y1={216} x2={750} y2={190} color="#a78bfa" active={false} />
        {s >= 3 && <CrossMark x={690} y={216} color="#fb7185" />}
        {flood && <Packet point={{ x: 220, y: 160 }} color="#a78bfa" label="broadcast" />}
        {s >= 3 && <Note x={800} y={245} text="NOT FORWARDED" color="#fb7185" size={9.5} />}
        <Panel
          x={35}
          y={345}
          w={850}
          h={58}
          title="DOMAIN BOUNDARY"
          lines={['Switch ports in the same VLAN share a broadcast domain. A router separates broadcast domains.']}
          color="#f59e0b"
          active
        />
      </svg>
    </StepShell>
  )
}

const duplexStages = [
  'Half-duplex يعني الإرسال والاستقبال على نفس المسار؛ لازم device يسمع قبل ما يبعت.',
  'لو اتنين بعتوا في نفس اللحظة هيحصل collision، وبعدين CSMA/CD وbackoff.',
  'Full-duplex يعني مسار منفصل للإرسال ومسار منفصل للاستقبال، فمفيش collision.',
  'منافذ السويتش الحديثة غالباً بتتفاوض تلقائياً على full-duplex.',
  'لو فيه duplex mismatch هيظهر collisions أو errors؛ افحص بـ show interfaces.',
]

export function DuplexModesDiagram() {
  const playback = useStepPlayback(duplexStages.length)
  const s = playback.stage
  return (
    <StepShell title="FULL-DUPLEX vs HALF-DUPLEX" playback={playback} legend={duplexStages[s]}>
      <svg viewBox="0 0 920 400" className="h-auto w-full min-w-[880px]" role="img" aria-label="Half duplex shared path compared with full duplex separate paths">
        <Note x={460} y={24} text="DUPLEX DESCRIBES HOW A LINK SENDS AND RECEIVES" color="#94a3b8" size={10} />
        <g opacity={s <= 1 ? 1 : 0.4}>
          <Layer x={40} y={60} w={400} h={245} title="HALF-DUPLEX" sub="shared path - collisions possible" color="#f59e0b" active={s <= 1} />
          <Node x={70} y={155} w={120} h={60} label="NIC" sub="send / receive" color="#64748b" tooltip="NIC" active />
          <Node x={290} y={155} w={120} h={60} label="HUB PORT" sub="shared" color="#f59e0b" tooltip="Half-duplex port" active />
          <LinkLine x1={190} y1={185} x2={290} y2={185} color="#f59e0b" active={s <= 1} />
          <SvgText x={240} y={172} color="#f59e0b" size={9} bold>TX / RX</SvgText>
          {s === 1 && <Packet point={{ x: 240, y: 185 }} color="#fb7185" label="collision" />}
        </g>
        <g opacity={s >= 2 ? 1 : 0.4}>
          <Layer x={480} y={60} w={400} h={245} title="FULL-DUPLEX" sub="separate Tx and Rx paths" color="#34d399" active={s >= 2} />
          <Node x={510} y={155} w={120} h={60} label="NIC" sub="Tx + Rx" color="#64748b" tooltip="NIC" active={s >= 2} />
          <Node x={730} y={155} w={120} h={60} label="SW PORT" sub="full-duplex" color="#34d399" tooltip="Switch port" active={s >= 2} />
          <LinkLine x1={630} y1={172} x2={730} y2={172} color="#38bdf8" active={s >= 2} />
          <LinkLine x1={630} y1={200} x2={730} y2={200} color="#a78bfa" active={s >= 2} />
          <SvgText x={680} y={160} color="#38bdf8" size={8.5} bold>TX →</SvgText>
          <SvgText x={680} y={218} color="#a78bfa" size={8.5} bold>← RX</SvgText>
        </g>
        <Panel
          x={40}
          y={325}
          w={840}
          h={60}
          title="VERIFY"
          lines={['`show interfaces` shows duplex, speed, and error counters. A speed or duplex mismatch needs investigation.']}
          color="#38bdf8"
          active
        />
      </svg>
    </StepShell>
  )
}
