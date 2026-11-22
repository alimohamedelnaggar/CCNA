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

function Device({
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
      <rect x={x} y={y} width={w} height={h} rx="11" fill="#0b1224" stroke={color} strokeWidth={active ? 2.4 : 1.2} />
      <SvgText x={x + w / 2} y={y + 25} color={color} size={11} bold>
        {title}
      </SvgText>
      <SvgText x={x + w / 2} y={y + 45} color="#cbd5e1" size={9}>
        {sub}
      </SvgText>
    </g>
  )
}

function Badge({
  x,
  y,
  text,
  color = '#38bdf8',
  active = true,
  w = 130,
}: {
  x: number
  y: number
  text: string
  color?: string
  active?: boolean
  w?: number
}) {
  return (
    <g opacity={active ? 1 : 0.4}>
      <rect x={x} y={y} width={w} height={26} rx="7" fill="#0a1730" stroke={color} strokeWidth={active ? 2 : 1} />
      <SvgText x={x + w / 2} y={y + 17} color={color} size={8.7} bold>
        {text}
      </SvgText>
    </g>
  )
}

function CheckMark({ x, y, color = '#34d399' }: { x: number; y: number; color?: string }) {
  return (
    <g stroke={color} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" fill="none">
      <path d={`M ${x - 8} ${y} l 5 5 l 10 -12`} />
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

function TableRow({
  y,
  values,
  widths,
  x = 70,
  color = '#38bdf8',
  active = true,
  size = 8.8,
}: {
  y: number
  values: string[]
  widths: number[]
  x?: number
  color?: string
  active?: boolean
  size?: number
}) {
  let cursor = x
  return (
    <g opacity={active ? 1 : 0.35}>
      {values.map((value, index) => {
        const center = cursor + widths[index] / 2
        cursor += widths[index]
        return (
          <SvgText key={index} x={center} y={y} color={index === 0 ? color : '#cbd5e1'} size={size} bold={index === 0}>
            {value}
          </SvgText>
        )
      })}
    </g>
  )
}

const physicalLinksStages = [
  'سويتشان بينهم أربع كابلات Ethernet فيزيائية منفصلة.',
  'كل كابل متصل بمنفذ فيزيائي مختلف على كل سويتش.',
  'لو كل link اعتبرناه مستقل، STP ممكن يحظر بعض المسارات.',
  'الهدف إننا نجمع الأربع روابط في مجموعة واحدة منطقية.',
  'المجموعة المنطقية تسمى Port-Channel أو EtherChannel.',
]

export function MultiplePhysicalLinksDiagram() {
  const playback = useStepPlayback(physicalLinksStages.length)
  const s = playback.stage
  const ys = [105, 155, 205, 255]
  return (
    <StepShell title="MULTIPLE PHYSICAL LINKS BETWEEN SWITCHES" playback={playback} legend={physicalLinksStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Two switches connected by four physical Ethernet links">
        <Note x={460} y={24} text="FOUR SEPARATE LAYER 2 LINKS BETWEEN THE SAME SWITCHES" color="#94a3b8" size={9.6} />
        <Device x={90} y={128} w={180} h={110} title="SW1" sub="Gi0/1 - Gi0/4" color="#38bdf8" active />
        <Device x={650} y={128} w={180} h={110} title="SW2" sub="Gi0/1 - Gi0/4" color="#a78bfa" active={s >= 1} />
        {ys.map((y, index) => (
          <g key={y}>
            <LinkLine x1={270} y1={y + 18} x2={650} y2={y + 18} color={s >= 1 ? '#f59e0b' : '#64748b'} active={s >= 1} />
            <Badge x={420} y={y + 1} text={`LINK ${index + 1}`} color="#f59e0b" active={s >= 1} w={90} />
          </g>
        ))}
        {s === 2 && <CrossMark x={460} y={290} color="#fb7185" />}
        {s === 2 && <Note x={460} y={315} text="WITHOUT AGGREGATION: MULTIPLE INDEPENDENT PATHS" color="#fb7185" size={9} />}
        <Panel
          x={55}
          y={345}
          w={810}
          h={55}
          title={s >= 3 ? 'THE GOAL' : 'OBSERVATION'}
          lines={[
            s >= 3
              ? 'Bundle the four physical links into one logical Port-Channel.'
              : 'Four cables connect the same two switches on four different physical interfaces.',
          ]}
          color={s >= 3 ? '#34d399' : '#38bdf8'}
          active
          size={8.9}
        />
      </svg>
    </StepShell>
  )
}

const portChannelStages = [
  'الأربع منافذ الفيزيائية Gi0/1 إلى Gi0/4 تدخل في نفس الـ channel-group.',
  'المنافذ تبقى physical interfaces، بس يتعاملوا كأعضاء في مجموعة واحدة.',
  'Cisco ينشئ logical interface اسمه Port-channel 1.',
  'الإعداد مثل VLANs وtrunk mode يُطبّق على الـ Port-channel ويُطبّق على الأعضاء بشكل متوافق.',
  'من وجهة STP والـ forwarding، الـ Port-channel link واحد منطقي.',
]

export function PortChannelDiagram() {
  const playback = useStepPlayback(portChannelStages.length)
  const s = playback.stage
  const bundled = s >= 2
  return (
    <StepShell title="ETHERCHANNEL LOGICAL PORT-CHANNEL" playback={playback} legend={portChannelStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Four physical member links bundled into one logical Port-channel">
        <Note x={460} y={24} text="PHYSICAL MEMBERS BECOME ONE LOGICAL INTERFACE" color="#94a3b8" size={9.6} />
        <Device x={60} y={110} w={170} h={150} title="SW1" sub="physical members" color="#38bdf8" active />
        <Device x={690} y={110} w={170} h={150} title="SW2" sub="physical members" color="#a78bfa" active={s >= 1} />
        {[0, 1, 2, 3].map((index) => {
          const y = 125 + index * 34
          return (
            <g key={index} opacity={s >= 3 ? 0.5 : 1}>
              <LinkLine x1={230} y1={y} x2={690} y2={y} color="#f59e0b" active={s >= 1} />
              <SvgText x={460} y={y - 7} color="#f59e0b" size={8.4}>{`Gi0/${index + 1}`}</SvgText>
            </g>
          )
        })}
        {bundled && <Badge x={365} y={105} text="PORT-CHANNEL 1" color="#34d399" active w={190} />}
        {s >= 3 && <Node x={375} y={245} w={170} h={58} label="Po1" sub="logical interface" color="#34d399" tooltip="Port-channel interface" active />}
        <Panel
          x={55}
          y={330}
          w={810}
          h={70}
          title={s === 4 ? 'STP VIEW' : 'CONFIGURATION VIEW'}
          lines={
            s === 4
              ? ['STP treats the correctly formed bundle as one logical link, not four independent paths.']
              : ['Member interfaces must have compatible configuration before they can join the bundle.']
          }
          color={s === 4 ? '#34d399' : '#f59e0b'}
          active
          size={8.9}
        />
      </svg>
    </StepShell>
  )
}

const bandwidthStages = [
  'كل link فيزيائي له سعة منفذة؛ في المثال 1 Gbps لكل link.',
  'عند وجود أربع links، إجمالي السعة النظرية يصل إلى 4 Gbps في الحالة المثالية.',
  'الإطارات تُوزّع عبر الأعضاء حسب خوارزمية hash.',
  'التوزيع ليس بالضرورة متساوياً packet by packet.',
  'flow واحد غالباً يستخدم عضواً واحداً للحفاظ على ترتيب الحزم.',
  'الإنتاجية الفعلية تعتمد على نمط الحركة والـ hash وعدد التدفقات وقدرات المنصة.',
]

export function BandwidthAggregationDiagram() {
  const playback = useStepPlayback(bandwidthStages.length)
  const s = playback.stage
  const bars = [
    { label: 'Gi0/1', w: 150, color: '#38bdf8' },
    { label: 'Gi0/2', w: 150, color: '#a78bfa' },
    { label: 'Gi0/3', w: 150, color: '#f59e0b' },
    { label: 'Gi0/4', w: 150, color: '#34d399' },
  ]
  return (
    <StepShell title="BANDWIDTH AGGREGATION" playback={playback} legend={bandwidthStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Four one-gigabit links contributing to an aggregate port-channel">
        <Note x={460} y={24} text="4 x 1 Gbps CAN PROVIDE UP TO 4 Gbps AGGREGATE CAPACITY" color="#94a3b8" size={9.4} />
        {bars.map((bar, index) => {
          const x = 70 + index * 205
          return (
            <g key={bar.label} opacity={s >= 1 ? 1 : 0.45}>
              <rect x={x} y={130} width={bar.w} height={70} rx="10" fill="#0b1224" stroke={bar.color} strokeWidth="2" />
              <SvgText x={x + bar.w / 2} y={160} color={bar.color} size={11} bold>{bar.label}</SvgText>
              <SvgText x={x + bar.w / 2} y={182} color="#cbd5e1" size={9}>1 Gbps member</SvgText>
              {s >= 2 && <Badge x={x + 25} y={220} text={`FLOW ${index + 1}`} color={bar.color} active w={100} />}
            </g>
          )
        })}
        {s >= 1 && <Badge x={330} y={280} text="AGGREGATE: IDEAL 4 Gbps" color="#34d399" active w={260} />}
        {s === 3 && <CrossMark x={460} y={310} color="#fb7185" />}
        {s === 3 && <Note x={460} y={335} text="NOT EQUAL PER-PACKET SPLITTING" color="#fb7185" size={9.2} />}
        <Panel
          x={55}
          y={350}
          w={810}
          h={55}
          title={s >= 4 ? 'SINGLE FLOW RULE' : 'REAL-WORLD THROUGHPUT'}
          lines={[
            s >= 4
              ? 'One flow generally stays on one member link; it does not automatically get all aggregate bandwidth.'
              : 'Actual throughput depends on traffic patterns, hashing, link use, and platform capabilities.',
          ]}
          color={s >= 4 ? '#f59e0b' : '#38bdf8'}
          active
          size={8.8}
        />
      </svg>
    </StepShell>
  )
}

const failureStages = [
  'الـ Port-channel يعمل بأربع أعضاء نشطة.',
  'member link واحد يفشل فيزيائياً أو ينزل.',
  'العضو الفاشل يخرج من الحزمة، والباقي يستمر في حمل الحركة.',
  'الـ logical Port-channel يبقى up طالما فيه أعضاء صالحون كافون.',
  'لو قلّت الأعضاء الصالحة عن الحد المطلوب، الحالة تعتمد على المنصة والإعداد.',
]

export function MemberLinkFailureDiagram() {
  const playback = useStepPlayback(failureStages.length)
  const s = playback.stage
  const failed = s >= 1
  const ys = [110, 160, 210, 260]
  return (
    <StepShell title="MEMBER LINK FAILURE AND REDUNDANCY" playback={playback} legend={failureStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="A failed EtherChannel member link with remaining links carrying traffic">
        <Note x={460} y={24} text="PORT-CHANNEL SURVIVES A SINGLE MEMBER FAILURE" color="#94a3b8" size={9.6} />
        <Device x={80} y={130} w={170} h={110} title="SW1" sub="Port-channel 1" color="#38bdf8" active />
        <Device x={670} y={130} w={170} h={110} title="SW2" sub="Port-channel 1" color="#a78bfa" active />
        {ys.map((y, index) => {
          const isFailed = failed && index === 1
          return (
            <g key={y}>
              <LinkLine x1={250} y1={y} x2={670} y2={y} color={isFailed ? '#fb7185' : '#34d399'} active={!isFailed} dashed={isFailed} />
              <SvgText x={460} y={y - 7} color={isFailed ? '#fb7185' : '#34d399'} size={8.5}>
                {isFailed ? 'Gi0/2 FAILED' : `Gi0/${index + 1} ACTIVE`}
              </SvgText>
              {isFailed && <CrossMark x={460} y={y} color="#fb7185" />}
            </g>
          )
        })}
        {s >= 2 && <Badge x={350} y={290} text="REMAINING LINKS CARRY TRAFFIC" color="#34d399" active w={225} />}
        {s >= 3 && <CheckMark x={825} y={185} color="#34d399" />}
        {s >= 3 && <Note x={820} y={270} text="Po1 STILL UP" color="#34d399" size={9} />}
        <Panel
          x={55}
          y={340}
          w={810}
          h={60}
          title={s >= 4 ? 'PLATFORM DEPENDENCE' : 'REDUNDANCY RESULT'}
          lines={[
            s >= 4
              ? 'Minimum active members and standby behavior vary by platform and implementation.'
              : 'A failed member is removed from the bundle while the logical interface can stay operational.',
          ]}
          color={s >= 4 ? '#fb7185' : '#34d399'}
          active
          size={8.9}
        />
      </svg>
    </StepShell>
  )
}

const stpStages = [
  'بدون EtherChannel، STP يشوف أربع مسارات فيزيائية منفصلة بين السويتشين.',
  'في الحالة دي ممكن STP يحظر بعض المنافذ لمنع الحلقات.',
  'بعد تهيئة EtherChannel بشكل صحيح، الأعضاء ينتموا لنفس الـ Port-channel.',
  'STP يتعامل مع Port-channel كـ link واحد منطقي.',
  'ما فيش حظر لأعضاء individual داخل نفس الحزمة بسبب وجود أربع روابط موازية.',
]

export function StpOneLogicalLinkDiagram() {
  const playback = useStepPlayback(stpStages.length)
  const s = playback.stage
  const bundled = s >= 2
  return (
    <StepShell title="STP SEEING ONE LOGICAL LINK" playback={playback} legend={stpStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="STP treats a correctly formed EtherChannel as one logical link">
        <Note x={460} y={24} text="ONE STP INSTANCE FOR THE BUNDLE, NOT ONE PER MEMBER" color="#94a3b8" size={9.2} />
        <Device x={80} y={125} w={170} h={110} title="SW1" sub="root or designated" color="#38bdf8" active />
        <Device x={670} y={125} w={170} h={110} title="SW2" sub="downstream switch" color="#a78bfa" active />
        {[0, 1, 2, 3].map((index) => {
          const y = 120 + index * 30
          const blocked = !bundled && index > 0
          return (
            <g key={index}>
              <LinkLine x1={250} y1={y} x2={670} y2={y} color={blocked ? '#64748b' : '#34d399'} active={!blocked} dashed={blocked} />
              <SvgText x={460} y={y - 6} color={blocked ? '#fb7185' : '#34d399'} size={8.4}>
                {blocked ? 'BLOCKED BY STP' : bundled ? 'MEMBER OF Po1' : 'FORWARDING'}
              </SvgText>
              {blocked && <CrossMark x={460} y={y} color="#fb7185" />}
            </g>
          )
        })}
        {bundled && <Badge x={360} y={265} text="STP SEES ONE LOGICAL LINK" color="#34d399" active w={210} />}
        <Panel
          x={55}
          y={320}
          w={810}
          h={80}
          title={bundled ? 'SIMPLER TOPOLOGY' : 'WITHOUT AGGREGATION'}
          lines={
            bundled
              ? ['The Port-channel is represented as one path in the spanning-tree topology.']
              : ['STP may block redundant physical paths to keep a loop-free Layer 2 topology.']
          }
          color={bundled ? '#34d399' : '#f59e0b'}
          active
          size={9}
        />
      </svg>
    </StepShell>
  )
}

const consistencyStages = [
  'كل member interfaces لازم يكونوا متوافقين قبل ما ينضموا للحزمة.',
  'راجع السرعة والـ duplex: كل الأعضاء لازم يتفقوا.',
  'راجع Layer 2 أو Layer 3 mode وaccess أو trunk configuration.',
  'راجع Access VLAN وNative VLAN وAllowed VLAN list.',
  'راجع trunk encapsulation حيث ينطبق ذلك على المنصة.',
  'الاختلاف في أي إعداد مهم ممكن يخلي المنفذ suspended أو مش bundled.',
]

export function ConsistencyDiagram() {
  const playback = useStepPlayback(consistencyStages.length)
  const s = playback.stage
  const widths = [190, 300, 300]
  const headers = ['REQUIREMENT', 'MATCHING EXAMPLE', 'MISMATCH EXAMPLE']
  const rows = [
    ['Speed / Duplex', '1000 Mbps / full on all', '1 Gbps and 100 Mbps mixed'],
    ['L2 / L3 mode', 'All switchports or all routed', 'Switchport mixed with routed port'],
    ['Access / Trunk', 'All trunk on members', 'Access on one, trunk on another'],
    ['Access VLAN', 'VLAN 10 on all access ports', 'VLAN 10 and VLAN 20 mixed'],
    ['Native VLAN', 'VLAN 99 on all trunks', 'VLAN 99 and VLAN 100 mixed'],
    ['Allowed VLANs', '10,20,99 on all trunks', 'Different allowed lists'],
    ['Encapsulation', 'dot1q where applicable', 'Different encapsulation where supported'],
  ]
  return (
    <StepShell title="ETHERCHANNEL CONFIGURATION CONSISTENCY" playback={playback} legend={consistencyStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="EtherChannel member configuration consistency checklist">
        <Note x={460} y={24} text="MEMBER INTERFACES MUST LOOK THE SAME TO THE CHANNEL" color="#94a3b8" size={9.3} />
        <rect x={55} y={60} width={810} height={270} rx="12" fill="#0b1224" stroke="#334155" strokeWidth="1.4" />
        <TableRow y={88} values={headers} widths={widths} color="#f59e0b" size={8.6} />
        <line x1={70} y1={100} x2={850} y2={100} stroke="#334155" />
        {rows.map((row, index) => (
          <TableRow
            key={row[0]}
            y={122 + index * 30}
            values={row}
            widths={widths}
            active={s >= 1 + Math.min(index, 5)}
            color={index === 6 ? '#34d399' : '#38bdf8'}
            size={8.1}
          />
        ))}
        <Panel
          x={55}
          y={345}
          w={810}
          h={60}
          title={s >= 6 ? 'POSSIBLE RESULT' : 'PLATFORM NOTE'}
          lines={
            s >= 6
              ? ['Inconsistent members may stay suspended, stand-alone, or fail to join the bundle.']
              : ['Some platforms perform automatic checks or support a subset of these settings; verify local behavior.']
          }
          color={s >= 6 ? '#fb7185' : '#38bdf8'}
          active
          size={8.8}
        />
      </svg>
    </StepShell>
  )
}

const pagpStages = [
  'PAgP هو Cisco proprietary ويتفاوض على تكوين EtherChannel.',
  'auto ينتظر الطرف التاني ويستجيب فقط.',
  'desirable يبادر بمحاولة التفاوض.',
  'desirable + desirable أو desirable + auto غالباً بيكوّنوا channel.',
  'auto + auto مفيش طرف يبادر، فغالباً ما بيكوّنوش channel.',
  'mode on مش PAgP negotiation mode؛ ده static EtherChannel.',
]

export function PagpAutoDesirableDiagram() {
  const playback = useStepPlayback(pagpStages.length)
  const s = playback.stage
  const widths = [160, 160, 250, 230]
  const headers = ['SIDE A', 'SIDE B', 'NEGOTIATION', 'RESULT']
  const rows = [
    ['desirable', 'desirable', 'Both active', 'Forms'],
    ['desirable', 'auto', 'A initiates', 'Forms'],
    ['auto', 'auto', 'Both passive', 'Does not form'],
    ['on', 'on', 'No PAgP', 'Static, no negotiation'],
  ]
  return (
    <StepShell title="PAGP AUTO vs DESIRABLE" playback={playback} legend={pagpStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="PAgP mode compatibility matrix">
        <Note x={460} y={24} text="PAGP = CISCO PROPRIETARY NEGOTIATION" color="#94a3b8" size={9.6} />
        <rect x={55} y={65} width={810} height={230} rx="12" fill="#0b1224" stroke="#334155" strokeWidth="1.4" />
        <TableRow y={95} values={headers} widths={widths} color="#f59e0b" size={8.8} />
        <line x1={70} y1={108} x2={850} y2={108} stroke="#334155" />
        {rows.map((row, index) => (
          <TableRow key={row[0] + row[1]} y={145 + index * 38} values={row} widths={widths} active={s >= 2} size={8.8} />
        ))}
        {s === 4 && <CrossMark x={820} y={221} color="#fb7185" />}
        <Panel
          x={55}
          y={315}
          w={810}
          h={85}
          title={s >= 5 ? 'ON IS NOT PAGP' : 'REMEMBER'}
          lines={[
            s >= 5
              ? '`mode on` does not send PAgP messages. Both sides must be statically configured.'
              : 'At least one side must be desirable for PAgP negotiation to form a channel.',
          ]}
          color={s >= 5 ? '#fb7185' : '#34d399'}
          active
          size={9}
        />
      </svg>
    </StepShell>
  )
}

const lacpModesStages = [
  'LACP هو معيار IEEE 802.1AX، كان يُعرف بـ IEEE 802.3ad، ومتعدد البائعين.',
  'active يرسل رسائل LACP ويبادر بالتفاوض.',
  'passive يستجيب لرسائل LACP لكنه لا يبدأ التفاوض.',
  'active + active أو active + passive غالباً بيكوّنوا channel.',
  'passive + passive مفيش تفاوض، فغالباً ما بيكوّنوش channel.',
  'mode on مش LACP؛ ده static EtherChannel بدون negotiation.',
]

export function LacpActivePassiveDiagram() {
  const playback = useStepPlayback(lacpModesStages.length)
  const s = playback.stage
  const widths = [160, 160, 250, 230]
  const headers = ['SIDE A', 'SIDE B', 'NEGOTIATION', 'RESULT']
  const rows = [
    ['active', 'active', 'Both send LACPDUs', 'Forms'],
    ['active', 'passive', 'A initiates', 'Forms'],
    ['passive', 'passive', 'Both wait', 'Does not form'],
    ['on', 'on', 'No LACP', 'Static, no negotiation'],
  ]
  return (
    <StepShell title="LACP ACTIVE vs PASSIVE" playback={playback} legend={lacpModesStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="LACP active and passive mode compatibility matrix">
        <Note x={460} y={24} text="LACP = IEEE 802.1AX, VENDOR-NEUTRAL NEGOTIATION" color="#94a3b8" size={9.2} />
        <rect x={55} y={65} width={810} height={230} rx="12" fill="#0b1224" stroke="#334155" strokeWidth="1.4" />
        <TableRow y={95} values={headers} widths={widths} color="#34d399" size={8.8} />
        <line x1={70} y1={108} x2={850} y2={108} stroke="#334155" />
        {rows.map((row, index) => (
          <TableRow key={row[0] + row[1]} y={145 + index * 38} values={row} widths={widths} active={s >= 2} size={8.8} />
        ))}
        {s === 4 && <CrossMark x={820} y={221} color="#fb7185" />}
        <Panel
          x={55}
          y={315}
          w={810}
          h={85}
          title={s >= 5 ? 'ON IS NOT LACP' : 'REMEMBER'}
          lines={
            s >= 5
              ? ['`mode on` does not exchange LACPDUs. It is a static channel, not an LACP channel.']
              : ['At least one side must be active for LACP negotiation to form a channel.']
          }
          color={s >= 5 ? '#fb7185' : '#34d399'}
          active
          size={9}
        />
      </svg>
    </StepShell>
  )
}

const lacpNegotiationStages = [
  'SW1 والـ SW2 بيبعتوا LACPDU على المنافذ المرشحة للانضمام.',
  'الـ LACPDU بيحمل System ID وPort ID وinfo عن الشريك.',
  'كل طرف بيقارن الـ actor والـ partner information.',
  'الأعضاء المتوافقين بيتم اختيارهم كـ active members.',
  'في بعض المنصات فيه standby links لو عدد الأعضاء أكبر من الحد المسموح.',
  'عدد الأعضاء النشطة والـ standby يعتمد على المنصة والتنفيذ.',
]

export function LacpNegotiationDiagram() {
  const playback = useStepPlayback(lacpNegotiationStages.length)
  const s = playback.stage
  const sent = s >= 0
  const info = s >= 1
  const selected = s >= 3
  return (
    <StepShell title="LACP NEGOTIATION PROCESS" playback={playback} legend={lacpNegotiationStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="LACPDU exchange with system ID and port ID information">
        <Note x={460} y={24} text="LACPDU EXCHANGE BUILDS THE AGGREGATOR" color="#94a3b8" size={9.5} />
        <Device x={70} y={120} w={200} h={100} title="SW1" sub="actor: Gi0/1" color="#38bdf8" active />
        <Device x={650} y={120} w={200} h={100} title="SW2" sub="partner: Gi0/1" color="#a78bfa" active={s >= 1} />
        <LinkLine x1={270} y1={170} x2={650} y2={170} color="#34d399" active={sent} />
        {sent && <Packet point={{ x: 460, y: 170 }} color="#34d399" label="LACPDU" />}
        {sent && <Badge x={350} y={105} text="LACPDU EXCHANGE" color="#34d399" active w={220} />}
        {info && (
          <g>
            <Badge x={75} y={245} text="SYSTEM ID + PORT ID" color="#f59e0b" active w={190} />
            <Badge x={655} y={245} text="SYSTEM ID + PORT ID" color="#f59e0b" active w={190} />
          </g>
        )}
        {s === 2 && <Note x={460} y={255} text="COMPARE ACTOR AND PARTNER INFORMATION" color="#38bdf8" size={9} />}
        {selected && <Badge x={350} y={290} text="SELECTED ACTIVE MEMBERS" color="#34d399" active w={230} />}
        {s >= 4 && <Badge x={350} y={330} text="STANDBY LINKS WHERE SUPPORTED" color="#a78bfa" active w={230} />}
        <Panel
          x={55}
          y={370}
          w={810}
          h={40}
          title="PLATFORM DEPENDENCE"
          lines={['Maximum active members and standby support are not universal across switches.']}
          color="#fb7185"
          active
          size={8.6}
        />
      </svg>
    </StepShell>
  )
}

const staticStages = [
  'Static EtherChannel يستخدم `channel-group ... mode on`.',
  'مفيش PAgP ولا LACP negotiation بين الطرفين.',
  'لازم إعداد متوافق ومتطابق على الجانبين عشان الحزمة تتكوّن صح.',
  'لو إعداد الطرفين مختلف، ممكن تحصل forwarding problems أو loops.',
  'LACP أفضل غالباً لما يكون مدعوم، لأنه بيتحقق من التوافق بشكل ديناميكي.',
]

export function StaticModeOnDiagram() {
  const playback = useStepPlayback(staticStages.length)
  const s = playback.stage
  return (
    <StepShell title="STATIC ETHERCHANNEL (MODE ON)" playback={playback} legend={staticStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Static EtherChannel using mode on without negotiation">
        <Note x={460} y={24} text="NO NEGOTIATION PROTOCOL IS RUNNING" color="#94a3b8" size={9.6} />
        <Device x={80} y={125} w={190} h={110} title="SW1" sub="mode on" color="#f59e0b" active />
        <Device x={650} y={125} w={190} h={110} title="SW2" sub="mode on" color="#f59e0b" active={s >= 2} />
        {[0, 1].map((index) => {
          const y = 145 + index * 45
          return <LinkLine key={index} x1={270} y1={y} x2={650} y2={y} color="#f59e0b" active={s >= 2} />
        })}
        {s >= 1 && <CrossMark x={460} y={110} color="#fb7185" />}
        {s >= 1 && <Note x={460} y={100} text="NO PAgP / LACP MESSAGES" color="#fb7185" size={9} />}
        {s === 3 && <Note x={460} y={275} text="MISMATCH CAN CAUSE LOOPS" color="#fb7185" size={10} />}
        <Panel
          x={55}
          y={320}
          w={810}
          h={80}
          title={s >= 4 ? 'PREFERRED APPROACH' : 'CONFIGURATION RULE'}
          lines={
            s >= 4
              ? ['Use LACP when supported: it validates the partner and reduces static misconfiguration risk.']
              : ['Both sides must be configured consistently because no protocol negotiates the bundle.']
          }
          color={s >= 4 ? '#34d399' : '#f59e0b'}
          active
          size={9}
        />
      </svg>
    </StepShell>
  )
}

const hashStages = [
  'EtherChannel يختار member link باستخدام hash لعدد من حقول الحزمة.',
  'حقول الـ hash ممكن تشمل source/destination MAC أو IP ومنافذ Layer 4 حيث مدعوم.',
  'كل flow له نتيجة hash، وبكده ممكن يروح لعضو مختلف.',
  'حزم نفس الـ flow غالباً تستخدم نفس العضو عشان ما يتغيرش ترتيب الحزم.',
  'شوف `show etherchannel load-balance` لمعرفة الخوارزمية المفعّلة على المنصة.',
  'الخوارزمية والخيارات المتاحة تعتمد على المنصة والإصدار.',
]

export function LoadBalancingHashDiagram() {
  const playback = useStepPlayback(hashStages.length)
  const s = playback.stage
  const members = [
    { label: 'Gi0/1', color: '#38bdf8' },
    { label: 'Gi0/2', color: '#a78bfa' },
    { label: 'Gi0/3', color: '#f59e0b' },
    { label: 'Gi0/4', color: '#34d399' },
  ]
  const flows = [
    { label: 'FLOW A', target: 0, color: '#38bdf8' },
    { label: 'FLOW B', target: 2, color: '#f59e0b' },
    { label: 'FLOW C', target: 1, color: '#a78bfa' },
  ]
  return (
    <StepShell title="LOAD-BALANCING HASH DISTRIBUTION" playback={playback} legend={hashStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="EtherChannel hash distributing multiple flows across member links">
        <Note x={460} y={24} text="HASH SELECTS A MEMBER LINK PER FLOW" color="#94a3b8" size={9.6} />
        <Device x={55} y={115} w={170} h={120} title="HASH INPUT" sub="MAC / IP / L4 ports" color="#38bdf8" active />
        {members.map((member, index) => {
          const x = 380 + index * 125
          return (
            <g key={member.label} opacity={s >= 2 ? 1 : 0.45}>
              <rect x={x} y={100} width={105} height={55} rx="10" fill="#0b1224" stroke={member.color} strokeWidth="2" />
              <SvgText x={x + 52} y={130} color={member.color} size={9.5} bold>{member.label}</SvgText>
            </g>
          )
        })}
        {s >= 2 && flows.map((flow, index) => (
          <g key={flow.label}>
            <Badge x={250} y={210 + index * 35} text={flow.label} color={flow.color} active w={100} />
            <LinkLine
              x1={350}
              y1={223 + index * 35}
              x2={430 + members.findIndex((m) => m.color === flow.color) * 125}
              y2={130}
              color={flow.color}
              active
            />
          </g>
        ))}
        {s >= 3 && <Badge x={330} y={320} text="ONE FLOW STAYS ON ONE MEMBER" color="#34d399" active w={260} />}
        <Panel
          x={55}
          y={355}
          w={810}
          h={50}
          title="FORWARDING DECISION"
          lines={['Different flows may use different members; a single flow is not split packet by packet.']}
          color="#f59e0b"
          active
          size={8.8}
        />
      </svg>
    </StepShell>
  )
}

const l2L3Stages = [
  'EtherChannel ممكن يكون Layer 2 أو Layer 3 حسب نوع الـ member interfaces.',
  'في Layer 2 EtherChannel، الـ members switchports والـ Port-channel يحمل VLAN traffic.',
  'في Layer 3 EtherChannel، الـ members routed interfaces والـ Port-channel عليه IP address.',
  'الـ channel-group number لازم يتطابق على كل الأعضاء في نفس الحزمة.',
  'التركيز في CCNA هنا على الفهم؛ إعداد L3 المتقدم خارج نطاق هذا الدرس.',
]

export function L2VsL3EtherChannelDiagram() {
  const playback = useStepPlayback(l2L3Stages.length)
  const s = playback.stage
  const l2 = s <= 2
  return (
    <StepShell title="LAYER 2 vs LAYER 3 ETHERCHANNEL" playback={playback} legend={l2L3Stages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Layer 2 compared with Layer 3 EtherChannel">
        <Note x={460} y={24} text="THE PORT-CHANNEL TYPE FOLLOWS THE MEMBER INTERFACE TYPE" color="#94a3b8" size={9.1} />
        <g opacity={l2 ? 1 : 0.45}>
          <Device x={70} y={95} w={350} h={230} title="LAYER 2 ETHERCHANNEL" sub="switchports in a bundle" color="#38bdf8" active={l2} />
          <SvgText x={245} y={175} color="#cbd5e1" size={9}>Physical members: switchports</SvgText>
          <SvgText x={245} y={205} color="#cbd5e1" size={9}>Port-channel carries VLANs</SvgText>
          <SvgText x={245} y={235} color="#cbd5e1" size={9}>Trunk / access config must match</SvgText>
          {l2 && <CheckMark x={390} y={285} color="#34d399" />}
        </g>
        <g opacity={!l2 ? 1 : 0.45}>
          <Device x={500} y={95} w={350} h={230} title="LAYER 3 ETHERCHANNEL" sub="routed ports in a bundle" color="#a78bfa" active={!l2} />
          <SvgText x={675} y={175} color="#cbd5e1" size={9}>Physical members: routed interfaces</SvgText>
          <SvgText x={675} y={205} color="#cbd5e1" size={9}>Port-channel has Layer 3 address</SvgText>
          <SvgText x={675} y={235} color="#cbd5e1" size={9}>Routed link, not switchport VLANs</SvgText>
          {!l2 && <CheckMark x={820} y={285} color="#34d399" />}
        </g>
        <Panel
          x={55}
          y={345}
          w={810}
          h={60}
          title={s >= 4 ? 'SCOPE NOTE' : 'SAME CHANNEL GROUP'}
          lines={
            s >= 4
              ? ['CCNA focuses on the concept; advanced Layer 3 routing configuration is covered later.']
              : ['All members in one bundle use the same channel-group number and compatible mode.']
          }
          color={s >= 4 ? '#fb7185' : '#34d399'}
          active
          size={8.9}
        />
      </svg>
    </StepShell>
  )
}

const troubleshootStages = [
  'ابدأ بحالة المنافذ الفيزيائية: up/up ولا لا.',
  'افحص `show etherchannel summary` وشوف هل الأعضاء P وU ولا suspended.',
  'حدد البروتوكول: LACP أو PAgP أو static mode on.',
  'راجع توافق المود: active/passive أو desirable/auto أو on/on.',
  'قارن إعدادات الأعضاء: speed وduplex وVLANs وtrunk settings.',
  'افحص Port-channel interface نفسه وتأكد إنه مكوّن صح.',
  'راجع load-balance واختبر الاتصال وسلوك فشل عضو واحد.',
]

export function EtherchannelTroubleshootingDiagram() {
  const playback = useStepPlayback(troubleshootStages.length)
  const s = playback.stage
  const steps = [
    'PHYSICAL STATUS',
    'SHOW SUMMARY',
    'PROTOCOL',
    'MODE COMPATIBILITY',
    'MEMBER SETTINGS',
    'PORT-CHANNEL CONFIG',
    'LOAD BALANCE + TEST',
  ]
  return (
    <StepShell title="ETHERCHANNEL TROUBLESHOOTING" playback={playback} legend={troubleshootStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Structured EtherChannel troubleshooting workflow">
        <Note x={460} y={24} text="WORK FROM PHYSICAL LAYER TO LOGICAL BUNDLE" color="#94a3b8" size={9.4} />
        {steps.map((step, index) => {
          const col = index % 4
          const row = Math.floor(index / 4)
          const x = 60 + col * 215
          const y = 85 + row * 110
          const active = s >= index
          return (
            <g key={step} opacity={active ? 1 : 0.35}>
              <rect x={x} y={y} width={190} height={70} rx="11" fill="#0b1224" stroke={active ? '#34d399' : '#475569'} strokeWidth={active ? 2.2 : 1.2} />
              <SvgText x={x + 95} y={y + 28} color={active ? '#34d399' : '#94a3b8'} size={9.5} bold>{`${index + 1}. ${step}`}</SvgText>
              <SvgText x={x + 95} y={y + 50} color="#cbd5e1" size={8.2}>{active ? 'CHECKED' : 'PENDING'}</SvgText>
            </g>
          )
        })}
        {s >= 6 && <Badge x={300} y={320} text="BUNDLE VERIFIED" color="#34d399" active w={300} />}
        <Panel
          x={55}
          y={360}
          w={810}
          h={45}
          title="FINAL CHECK"
          lines={['Confirm connectivity and that one member failure does not break the Port-channel.']}
          color="#38bdf8"
          active
          size={8.7}
        />
      </svg>
    </StepShell>
  )
}
