import { Pause, Play, RotateCcw, SkipBack, SkipForward } from 'lucide-react'
import { useEffect, useState, type ReactNode } from 'react'
import { RichText } from '../ui/RichText'
import { LinkLine, Packet } from './ArchitectureDiagrams'
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

function CrossMark({ x, y, color = '#fb7185' }: { x: number; y: number; color?: string }) {
  return (
    <g stroke={color} strokeWidth="2.6" strokeLinecap="round">
      <line x1={x - 8} y1={y - 8} x2={x + 8} y2={y + 8} />
      <line x1={x + 8} y1={y - 8} x2={x - 8} y2={y + 8} />
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

function StateBox({
  x,
  y,
  label,
  detail,
  color,
  active,
}: {
  x: number
  y: number
  label: string
  detail: string
  color: string
  active: boolean
}) {
  return (
    <g opacity={active ? 1 : 0.4}>
      <rect x={x} y={y} width={155} height={74} rx="11" fill="#0b1224" stroke={color} strokeWidth={active ? 2.4 : 1.2} />
      <SvgText x={x + 77} y={y + 28} color={color} size={10} bold>
        {label}
      </SvgText>
      <SvgText x={x + 77} y={y + 50} color="#cbd5e1" size={8.4}>
        {detail}
      </SvgText>
    </g>
  )
}

const loopStages = [
  'ثلاثة سويتشات متصلين ببعضهم في طوبولوجيا مثلثة.',
  'بدون STP كل المنافذ في حالة forwarding.',
  'إطار يدخل SW1 ويُغمر على كل المسارات المتاحة.',
  'الإطار يرجع عبر مسار آخر ويستمر في الدوران.',
  'ما فيش منفذ ممنوع، فتحدث حلقة Layer 2.',
]

export function LayerTwoLoopDiagram() {
  const playback = useStepPlayback(loopStages.length)
  const s = playback.stage
  const forwarding = s >= 1
  return (
    <StepShell title="LAYER 2 LOOP WITHOUT STP" playback={playback} legend={loopStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Three switches in a triangle all forwarding without STP">
        <Note x={460} y={24} text="THREE PHYSICAL PATHS, NO LOGICAL BLOCKING" color="#94a3b8" size={9.6} />
        <Device x={80} y={95} w={180} h={90} title="SW1" sub="all ports FWD" color="#38bdf8" active />
        <Device x={660} y={95} w={180} h={90} title="SW2" sub="all ports FWD" color="#a78bfa" active={forwarding} />
        <Device x={370} y={255} w={180} h={85} title="SW3" sub="all ports FWD" color="#f59e0b" active={forwarding} />
        <LinkLine x1={260} y1={140} x2={660} y2={140} color={forwarding ? '#34d399' : '#64748b'} active={forwarding} />
        <LinkLine x1={200} y1={185} x2={435} y2={255} color={forwarding ? '#34d399' : '#64748b'} active={forwarding} />
        <LinkLine x1={720} y1={185} x2={485} y2={255} color={forwarding ? '#34d399' : '#64748b'} active={forwarding} />
        {s >= 2 && <Packet point={{ x: 460, y: 140 }} color="#fb7185" label="FRAME" />}
        {s >= 3 && <Packet point={{ x: 310, y: 220 }} color="#fb7185" label="LOOP" />}
        {s >= 3 && <Packet point={{ x: 610, y: 220 }} color="#fb7185" label="LOOP" />}
        {s === 4 && <Badge x={350} y={210} text="LOOP ACTIVE" color="#fb7185" active w={220} />}
        <Panel
          x={55}
          y={355}
          w={810}
          h={50}
          title={s >= 4 ? 'RESULT' : 'OBSERVATION'}
          lines={[
            s >= 4
              ? 'Without STP, redundant Layer 2 paths create a forwarding loop.'
              : 'Physical redundancy is useful, but every path forwarding at once is the problem.',
          ]}
          color={s >= 4 ? '#fb7185' : '#38bdf8'}
          active
          size={8.8}
        />
      </svg>
    </StepShell>
  )
}

const stormStages = [
  'PC يرسل broadcast frame إلى SW1 على منفذ access.',
  'SW1 يغمر الـ broadcast على كل المنافذ في نفس VLAN.',
  'SW2 وSW3 يستلموا الإطار ويعيدوا غمره.',
  'الإطار يرجع لـ SW1 ويستمر في الدوران بلا نهاية.',
  'الـ broadcast storm يستهلك bandwidth وCPU ويعطل الشبكة.',
]

export function BroadcastStormDiagram() {
  const playback = useStepPlayback(stormStages.length)
  const s = playback.stage
  return (
    <StepShell title="BROADCAST STORM" playback={playback} legend={stormStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="A broadcast frame looping through three switches">
        <Note x={460} y={24} text="BROADCAST FRAMES HAVE NO TTL AND ARE FLOODED" color="#94a3b8" size={9.2} />
        <Device x={25} y={225} w={130} h={80} title="PC" sub="broadcast" color="#94a3b8" active />
        <Device x={190} y={95} w={170} h={90} title="SW1" sub="flood" color="#38bdf8" active />
        <Device x={680} y={95} w={170} h={90} title="SW2" sub="flood" color="#a78bfa" active={s >= 1} />
        <Device x={420} y={255} w={170} h={85} title="SW3" sub="flood" color="#f59e0b" active={s >= 2} />
        <LinkLine x1={155} y1={265} x2={190} y2={150} color="#64748b" active />
        <LinkLine x1={360} y1={140} x2={680} y2={140} color={s >= 1 ? '#fb7185' : '#64748b'} active />
        <LinkLine x1={250} y1={185} x2={460} y2={255} color={s >= 1 ? '#fb7185' : '#64748b'} active={s >= 1} />
        <LinkLine x1={750} y1={185} x2={540} y2={255} color={s >= 2 ? '#fb7185' : '#64748b'} active={s >= 2} />
        {s >= 0 && <Packet point={{ x: 172, y: 208 }} color="#fb7185" label="BCAST" />}
        {s >= 1 && <Packet point={{ x: 520, y: 140 }} color="#fb7185" label="BCAST" />}
        {s >= 2 && <Packet point={{ x: 650, y: 220 }} color="#fb7185" label="BCAST" />}
        {s >= 3 && <Packet point={{ x: 350, y: 220 }} color="#fb7185" label="BCAST" />}
        {s >= 3 && <Badge x={340} y={205} text="REPEATED FLOODING" color="#fb7185" active w={230} />}
        <Panel
          x={55}
          y={355}
          w={810}
          h={50}
          title={s >= 4 ? 'IMPACT' : 'WHY IT REPEATS'}
          lines={[
            s >= 4
              ? 'High bandwidth use, high CPU load, and possible network outage.'
              : 'Switches keep flooding the same broadcast around the loop.',
          ]}
          color={s >= 4 ? '#fb7185' : '#f59e0b'}
          active
          size={8.8}
        />
      </svg>
    </StepShell>
  )
}

const macStages = [
  'PC بمصدر MAC 00:11:22:33:44:55 يرسل إطاراً.',
  'SW1 يتعلم العنوان على المنفذ Gi0/1.',
  'الإطار يمر في الحلقة ويرجع لنفس SW1 من منفذ آخر.',
  'SW1 يحدّث نفس MAC entry إلى Gi0/2.',
  'تغيّر متكرر في جدول MAC = MAC address table instability.',
]

export function MacTableInstabilityDiagram() {
  const playback = useStepPlayback(macStages.length)
  const s = playback.stage
  const widths = [150, 110, 110]
  return (
    <StepShell title="MAC ADDRESS TABLE INSTABILITY" playback={playback} legend={macStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="The same source MAC learned on different switch ports">
        <Note x={460} y={24} text="SAME SOURCE MAC SEEN ON DIFFERENT PORTS" color="#94a3b8" size={9.2} />
        <Device x={35} y={180} w={130} h={80} title="PC" sub="SRC 00:11..." color="#94a3b8" active />
        <Device x={200} y={110} w={150} h={90} title="SW1" sub="MAC table" color="#38bdf8" active />
        <Device x={200} y={255} w={150} h={80} title="SW2" sub="loop path" color="#a78bfa" active={s >= 2} />
        <LinkLine x1={165} y1={220} x2={200} y2={150} color="#64748b" active />
        <LinkLine x1={275} y1={200} x2={275} y2={255} color={s >= 2 ? '#fb7185' : '#64748b'} active={s >= 2} />
        <LinkLine x1={350} y1={150} x2={450} y2={255} color={s >= 2 ? '#fb7185' : '#64748b'} active={s >= 2} />
        <rect x={500} y={85} width={370} height={235} rx="12" fill="#0b1224" stroke="#334155" strokeWidth="1.4" />
        <TableRow x={515} y={115} values={['SOURCE MAC', 'LEARNED PORT', 'STATUS']} widths={widths} color="#f59e0b" size={8.4} />
        <line x1={515} y1={127} x2={860} y2={127} stroke="#334155" />
        <TableRow
          x={515}
          y={160}
          values={['00:11:22:33:44:55', s >= 3 ? 'Gi0/2' : s >= 1 ? 'Gi0/1' : '---', s >= 3 ? 'RE-LEARNED' : s >= 1 ? 'LEARNED' : 'EMPTY']}
          widths={widths}
          color={s >= 3 ? '#fb7185' : '#34d399'}
          active={s >= 1}
          size={8.1}
        />
        <TableRow x={515} y={205} values={['Next loop', 'Gi0/1 again', 'FLAP']} widths={widths} color="#fb7185" active={s >= 4} size={8.1} />
        <Badge x={520} y={250} text={s >= 3 ? 'TABLE CHANGING' : 'TABLE STABLE'} color={s >= 3 ? '#fb7185' : '#34d399'} active w={230} />
        <Panel
          x={55}
          y={350}
          w={810}
          h={55}
          title={s >= 4 ? 'INSTABILITY' : 'FRAME PATH'}
          lines={[
            s >= 4
              ? 'Repeated re-learning can cause wrong forwarding decisions and duplicate frames.'
              : 'The switch updates the MAC entry each time the same source appears on another port.',
          ]}
          color={s >= 4 ? '#fb7185' : '#38bdf8'}
          active
          size={8.7}
        />
      </svg>
    </StepShell>
  )
}

const triangleStages = [
  'الطوبولوجيا الفيزيائية مثلث بين SW1 وSW2 وSW3.',
  'STP يحسب طوبولوجيا منطقية خالية من الحلقات.',
  'مسار واحد احتياطي يصبح discarding منطقياً.',
  'الكابل فيزيائياً موجود لكنه لا يحمل حركة مستخدم.',
  'عند تغيير طوبولوجيا يمكن تنشيط المسار الاحتياطي.',
]

export function ThreeSwitchStpTriangleDiagram() {
  const playback = useStepPlayback(triangleStages.length)
  const s = playback.stage
  const blocked = s >= 2
  return (
    <StepShell title="THREE-SWITCH STP TRIANGLE" playback={playback} legend={triangleStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="A three-switch triangle with one logically blocked link">
        <Note x={460} y={24} text="PHYSICAL TRIANGLE, LOGICAL TREE" color="#94a3b8" size={9.4} />
        <Device x={80} y={105} w={180} h={90} title="SW1" sub="ROOT" color="#34d399" active />
        <Device x={660} y={105} w={180} h={90} title="SW2" sub="non-root" color="#a78bfa" active />
        <Device x={370} y={255} w={180} h={85} title="SW3" sub="non-root" color="#f59e0b" active />
        <LinkLine x1={260} y1={150} x2={660} y2={150} color="#34d399" active />
        <LinkLine x1={200} y1={195} x2={435} y2={255} color={blocked ? '#fb7185' : '#34d399'} active={!blocked} dashed={blocked} />
        <LinkLine x1={720} y1={195} x2={485} y2={255} color="#34d399" active />
        {s >= 2 && <Badge x={300} y={205} text="ALT / DISCARDING" color="#fb7185" active w={180} />}
        {s >= 2 && <Badge x={430} y={120} text="DP - RP" color="#34d399" active w={120} />}
        {s >= 2 && <Badge x={545} y={225} text="DP - RP" color="#34d399" active w={120} />}
        {blocked && <CrossMark x={320} y={220} color="#fb7185" />}
        <Panel
          x={55}
          y={355}
          w={810}
          h={50}
          title={s >= 4 ? 'REDUNDANCY PRESERVED' : 'LOGICAL BLOCKING'}
          lines={[
            s >= 4
              ? 'The blocked path can become active after a topology change.'
              : 'STP prevents normal data forwarding on selected ports; it does not cut the cable.',
          ]}
          color={s >= 4 ? '#34d399' : '#f59e0b'}
          active
          size={8.8}
        />
      </svg>
    </StepShell>
  )
}

const bpduStages = [
  'Root Bridge يرسل configuration BPDU على منافذه.',
  'BPDU يصل إلى SW2 وSW3 عبر الروابط المباشرة.',
  'SW2 يعيد إرسال المعلومة إلى الجار التالي.',
  'كل BPDU يحمل Root Bridge ID وCost ومعلومات المرسل.',
  'السويتشات تقارن المعلومات وتختار أفضل مسار.',
]

export function BpduExchangeDiagram() {
  const playback = useStepPlayback(bpduStages.length)
  const s = playback.stage
  return (
    <StepShell title="BPDU EXCHANGE" playback={playback} legend={bpduStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="BPDUs flowing from the root bridge to other switches">
        <Note x={460} y={24} text="SWITCHES EXCHANGE BPDUs TO BUILD A LOOP-FREE TREE" color="#94a3b8" size={8.9} />
        <Device x={70} y={115} w={180} h={90} title="SW1" sub="ROOT - sends BPDU" color="#34d399" active />
        <Device x={670} y={115} w={180} h={90} title="SW2" sub="receives BPDU" color="#a78bfa" active={s >= 1} />
        <Device x={380} y={265} w={170} h={80} title="SW3" sub="receives BPDU" color="#f59e0b" active={s >= 1} />
        <LinkLine x1={250} y1={160} x2={670} y2={160} color="#34d399" active={s >= 0} />
        <LinkLine x1={180} y1={205} x2={430} y2={265} color="#34d399" active={s >= 1} />
        <LinkLine x1={750} y1={205} x2={500} y2={265} color="#34d399" active={s >= 2} />
        {s >= 0 && <Packet point={{ x: 470, y: 160 }} color="#34d399" label="BPDU" />}
        {s >= 1 && <Packet point={{ x: 310, y: 235 }} color="#34d399" label="BPDU" />}
        {s >= 2 && <Packet point={{ x: 625, y: 235 }} color="#34d399" label="BPDU" />}
        {s >= 3 && (
          <g>
            <Badge x={55} y={305} text="ROOT BRIDGE ID" color="#38bdf8" active w={160} />
            <Badge x={235} y={305} text="ROOT PATH COST" color="#38bdf8" active w={170} />
            <Badge x={425} y={305} text="SENDER BRIDGE ID" color="#38bdf8" active w={180} />
            <Badge x={625} y={305} text="SENDER PORT ID" color="#38bdf8" active w={180} />
          </g>
        )}
        <Panel
          x={55}
          y={355}
          w={810}
          h={50}
          title={s >= 4 ? "BEST PATH DECISION" : "INFORMATION IN BPDU"}
          lines={[
            s >= 4
              ? 'Lower cost and better sender information win the path comparison.'
              : 'Field names and formats can differ between 802.1D, 802.1w, and vendor implementations.',
          ]}
          color={s >= 4 ? '#34d399' : '#f59e0b'}
          active
          size={8.7}
        />
      </svg>
    </StepShell>
  )
}

const bridgeIdStages = [
  'Bridge ID يعرّف السويتش أو instance داخل spanning tree.',
  'أول جزء هو Bridge Priority؛ القيمة الأقل أفضل.',
  'في PVST+ يظهر Extended System ID الذي يحمل VLAN ID.',
  'الجزء الأخير هو MAC Address ويُستخدم لكسر التعادل.',
  'Effective Bridge ID = Priority + Extended ID + MAC.',
]

export function BridgeIdStructureDiagram() {
  const playback = useStepPlayback(bridgeIdStages.length)
  const s = playback.stage
  return (
    <StepShell title="BRIDGE ID STRUCTURE" playback={playback} legend={bridgeIdStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Bridge ID fields: priority, extended system ID, and MAC address">
        <Note x={460} y={24} text="LOWER BRIDGE ID WINS THE ROOT ELECTION" color="#94a3b8" size={9.5} />
        <g opacity={s >= 1 ? 1 : 0.4}>
          <rect x={70} y={110} width={220} height={110} rx="12" fill="#0b1224" stroke="#38bdf8" strokeWidth={s >= 1 ? 2.4 : 1.2} />
          <SvgText x={180} y={145} color="#38bdf8" size={10} bold>BRIDGE PRIORITY</SvgText>
          <SvgText x={180} y={175} color="#cbd5e1" size={9}>24576</SvgText>
          <SvgText x={180} y={198} color="#94a3b8" size={8}>configurable, lower is better</SvgText>
        </g>
        <g opacity={s >= 2 ? 1 : 0.4}>
          <rect x={315} y={110} width={250} height={110} rx="12" fill="#0b1224" stroke="#a78bfa" strokeWidth={s >= 2 ? 2.4 : 1.2} />
          <SvgText x={440} y={145} color="#a78bfa" size={10} bold>EXTENDED SYSTEM ID</SvgText>
          <SvgText x={440} y={175} color="#cbd5e1" size={9}>VLAN 10</SvgText>
          <SvgText x={440} y={198} color="#94a3b8" size={8}>part of effective Bridge ID</SvgText>
        </g>
        <g opacity={s >= 3 ? 1 : 0.4}>
          <rect x={590} y={110} width={260} height={110} rx="12" fill="#0b1224" stroke="#f59e0b" strokeWidth={s >= 3 ? 2.4 : 1.2} />
          <SvgText x={720} y={145} color="#f59e0b" size={10} bold>MAC ADDRESS</SvgText>
          <SvgText x={720} y={175} color="#cbd5e1" size={9}>00:00:00:00:00:03</SvgText>
          <SvgText x={720} y={198} color="#94a3b8" size={8}>tie-breaker when priority ties</SvgText>
        </g>
        {s >= 4 && <Badge x={250} y={260} text="EFFECTIVE BRIDGE ID: 24576 + VLAN 10 + MAC" color="#34d399" active w={430} />}
        <Panel
          x={55}
          y={330}
          w={810}
          h={75}
          title="IMPORTANT DETAIL"
          lines={[
            'Priority increments and extended ID behavior depend on platform and IOS version.',
            'Do not treat one numeric priority table as universal across all switches.',
          ]}
          color="#fb7185"
          active
          size={8.9}
        />
      </svg>
    </StepShell>
  )
}

const electionStages = [
  'ثلاثة سويتشات بمعلومات Bridge ID مختلفة.',
  'نقارن الـ Bridge Priority أولاً.',
  'SW3 عنده 24576، أقل من 32768 الموجود على SW1 وSW2.',
  'SW3 يفوز بالroot رغم أن MAC الخاص به أعلى رقمياً.',
  'لو تساوت الأولويات، أقل MAC يكسر التعادل.',
]

export function RootBridgeElectionDiagram() {
  const playback = useStepPlayback(electionStages.length)
  const s = playback.stage
  const widths = [140, 190, 250, 170]
  return (
    <StepShell title="ROOT BRIDGE ELECTION" playback={playback} legend={electionStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Practical root bridge election with three switches">
        <Note x={460} y={24} text="LOWEST BRIDGE ID BECOMES THE ROOT BRIDGE" color="#94a3b8" size={9.3} />
        <rect x={55} y={65} width={810} height={225} rx="12" fill="#0b1224" stroke="#334155" strokeWidth="1.4" />
        <TableRow x={70} y={95} values={['SWITCH', 'PRIORITY', 'MAC ADDRESS', 'RESULT']} widths={widths} color="#f59e0b" size={8.7} />
        <line x1={70} y1={108} x2={850} y2={108} stroke="#334155" />
        <TableRow x={70} y={145} values={['SW1', '32768', '00:00:00:00:00:01', 'non-root']} widths={widths} active={s >= 1} size={8.6} />
        <TableRow x={70} y={190} values={['SW2', '32768', '00:00:00:00:00:02', 'non-root']} widths={widths} active={s >= 1} size={8.6} />
        <TableRow x={70} y={235} values={['SW3', '24576', '00:00:00:00:00:03', s >= 2 ? 'ROOT' : 'candidate']} widths={widths} color={s >= 2 ? '#34d399' : '#38bdf8'} active size={8.6} />
        {s >= 3 && <CheckMark x={810} y={235} color="#34d399" />}
        {s >= 3 && <Badge x={330} y={305} text="ROOT BRIDGE = SW3" color="#34d399" active w={260} />}
        <Panel
          x={55}
          y={350}
          w={810}
          h={55}
          title={s >= 4 ? 'TIE-BREAK RULE' : 'WHY SW3 WINS'}
          lines={[
            s >= 4
              ? 'If priorities are equal, the lowest MAC address breaks the tie.'
              : 'Priority is compared before MAC: 24576 is lower than 32768.',
          ]}
          color={s >= 4 ? '#f59e0b' : '#34d399'}
          active
          size={8.9}
        />
      </svg>
    </StepShell>
  )
}

const rootPortStages = [
  'كل سويتش غير root يختار root port واحد لكل instance.',
  'المقارنة تعتمد على أقل Root Path Cost.',
  'SW2 يوصل لـ SW1 مباشرة بتكلفة 4.',
  'SW3 عبر SW2 بتكلفة 4+4=8، وأفضل من 19 المباشرة.',
  'SW3 يختار المسار عبر SW2؛ والـ Root Bridge نفسه ما عنده root port.',
]

export function RootPortSelectionDiagram() {
  const playback = useStepPlayback(rootPortStages.length)
  const s = playback.stage
  return (
    <StepShell title="ROOT PORT SELECTION" playback={playback} legend={rootPortStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Root port selection based on root path cost">
        <Note x={460} y={24} text="ROOT PORT = BEST PATH TOWARD THE ROOT BRIDGE" color="#94a3b8" size={9} />
        <Device x={70} y={145} w={190} h={100} title="SW1" sub="ROOT - cost 0" color="#34d399" active />
        <Device x={660} y={95} w={180} h={90} title="SW2" sub="cost 4" color="#a78bfa" active={s >= 2} />
        <Device x={660} y={265} w={180} h={90} title="SW3" sub="cost 8 via SW2" color="#f59e0b" active={s >= 3} />
        <LinkLine x1={260} y1={175} x2={660} y2={140} color={s >= 2 ? '#34d399' : '#64748b'} active={s >= 2} />
        <LinkLine x1={260} y1={220} x2={660} y2={310} color={s >= 3 ? '#fb7185' : '#64748b'} active={s >= 3} dashed={s >= 3 && s < 4} />
        <LinkLine x1={750} y1={185} x2={750} y2={265} color={s >= 3 ? '#34d399' : '#64748b'} active={s >= 3} />
        <Badge x={400} y={120} text="COST 4" color="#38bdf8" active={s >= 2} w={100} />
        <Badge x={395} y={255} text="COST 19" color="#fb7185" active={s >= 3} w={110} />
        {s >= 2 && <Badge x={500} y={95} text="RP / FWD" color="#34d399" active w={120} />}
        {s >= 4 && <Badge x={770} y={220} text="RP / FWD" color="#34d399" active w={120} />}
        <Panel
          x={55}
          y={370}
          w={810}
          h={40}
          title="TIE-BREAKERS"
          lines={['Root ID, advertised cost, sender Bridge ID, sender Port ID, then local Port ID when needed.']}
          color="#38bdf8"
          active
          size={8.6}
        />
      </svg>
    </StepShell>
  )
}

const designatedStages = [
  'كل segment له designated port واحد لكل spanning-tree instance.',
  'منافذ الـ Root Bridge المتصلة غالباً designated.',
  'على segment بين SW2 وSW3 تُقارن أفضل BPDU.',
  'السويتش صاحب BPDU الأفضل يصبح designated على ذلك الـ segment.',
  'Root port يواجه الـ root؛ designated port يعلن BPDU للأسفل.',
]

export function DesignatedPortSelectionDiagram() {
  const playback = useStepPlayback(designatedStages.length)
  const s = playback.stage
  return (
    <StepShell title="DESIGNATED PORT SELECTION" playback={playback} legend={designatedStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Designated port selection on each network segment">
        <Note x={460} y={24} text="ONE DESIGNATED PORT PER SEGMENT PER INSTANCE" color="#94a3b8" size={9.2} />
        <Device x={80} y={120} w={180} h={90} title="SW1" sub="ROOT" color="#34d399" active />
        <Device x={670} y={120} w={180} h={90} title="SW2" sub="RP toward root" color="#a78bfa" active={s >= 1} />
        <Device x={375} y={270} w={180} h={85} title="SW3" sub="RP toward SW2" color="#f59e0b" active={s >= 2} />
        <LinkLine x1={260} y1={165} x2={670} y2={165} color="#34d399" active />
        <LinkLine x1={200} y1={210} x2={425} y2={270} color="#34d399" active />
        <LinkLine x1={720} y1={210} x2={495} y2={270} color="#34d399" active={s >= 2} />
        <Badge x={400} y={135} text="DP - DP" color="#34d399" active w={120} />
        {s >= 1 && <Badge x={255} y={225} text="DP - RP" color="#34d399" active w={120} />}
        {s >= 3 && <Badge x={545} y={230} text="DP - RP" color="#34d399" active w={120} />}
        <Panel
          x={55}
          y={370}
          w={810}
          h={40}
          title="RELATIONSHIP"
          lines={['A port can be a Root Port on one switch and a Designated Port on the other end of the same segment.']}
          color="#38bdf8"
          active
          size={8.6}
        />
      </svg>
    </StepShell>
  )
}

const alternateStages = [
  'SW3 عنده مساران فيزيائيان نحو الـ Root Bridge.',
  'أفضل مسار يصبح Root Port في حالة forwarding.',
  'المسار الآخر يصبح Alternate Port.',
  'في Rapid PVST+ الـ Alternate غالباً discarding.',
  'لو فشل الـ Root Port، الـ Alternate يمكن أن يتحول لـ forwarding.',
]

export function AlternatePortDiagram() {
  const playback = useStepPlayback(alternateStages.length)
  const s = playback.stage
  return (
    <StepShell title="ALTERNATE PORT AND REDUNDANT PATH" playback={playback} legend={alternateStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Alternate port providing a redundant path toward the root bridge">
        <Note x={460} y={24} text="PORT ROLE IS NOT THE SAME AS PORT STATE" color="#94a3b8" size={9.3} />
        <Device x={70} y={140} w={190} h={100} title="SW1" sub="ROOT" color="#34d399" active />
        <Device x={670} y={100} w={180} h={90} title="SW2" sub="intermediate" color="#a78bfa" active />
        <Device x={670} y={270} w={180} h={90} title="SW3" sub="two paths" color="#f59e0b" active={s >= 1} />
        <LinkLine x1={260} y1={170} x2={670} y2={145} color="#34d399" active={s >= 1} />
        <LinkLine x1={750} y1={190} x2={750} y2={270} color="#34d399" active={s >= 1} />
        <LinkLine x1={260} y1={215} x2={670} y2={310} color={s >= 3 ? '#fb7185' : '#64748b'} active={s >= 2} dashed={s >= 3} />
        {s >= 1 && <Badge x={500} y={100} text="RP / FORWARDING" color="#34d399" active w={160} />}
        {s >= 3 && <Badge x={385} y={285} text="ALT / DISCARDING" color="#fb7185" active w={175} />}
        {s === 4 && <Badge x={370} y={325} text="CAN BECOME FORWARDING" color="#34d399" active w={230} />}
        <Panel
          x={55}
          y={370}
          w={810}
          h={40}
          title="ROLE vs STATE"
          lines={['Role describes the job (Root, Designated, Alternate); state describes forwarding behavior (Discarding, Learning, Forwarding).']}
          color="#38bdf8"
          active
          size={8.5}
        />
      </svg>
    </StepShell>
  )
}

const classicStateStages = [
  'Classic STP حسب IEEE 802.1D يستخدم خمس حالات.',
  'Blocking: لا forwarding، لكن يستقبل BPDUs.',
  'Listening: يعالج BPDUs ويبني الطوبولوجيا.',
  'Learning: يتعلم عناوين MAC بدون إرسال حركة مستخدم.',
  'Forwarding: يرسل ويستقبل إطارات المستخدم.',
  'Disabled: المنفذ معطل إدارياً أو غير متاح.',
]

export function ClassicStpStatesDiagram() {
  const playback = useStepPlayback(classicStateStages.length)
  const s = playback.stage
  const states = [
    { label: 'BLOCKING', detail: 'listen only', color: '#fb7185' },
    { label: 'LISTENING', detail: 'build topology', color: '#f59e0b' },
    { label: 'LEARNING', detail: 'learn MACs', color: '#38bdf8' },
    { label: 'FORWARDING', detail: 'user frames', color: '#34d399' },
    { label: 'DISABLED', detail: 'unavailable', color: '#64748b' },
  ]
  return (
    <StepShell title="CLASSIC STP PORT STATES (802.1D)" playback={playback} legend={classicStateStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Five classic STP port states">
        <Note x={460} y={24} text="IEEE 802.1D USES FIVE PORT STATES" color="#94a3b8" size={9.5} />
        {states.map((state, index) => (
          <g key={state.label}>
            <StateBox x={35 + index * 175} y={130} label={state.label} detail={state.detail} color={state.color} active={s >= index} />
            {index < states.length - 1 && (
              <SvgText x={35 + index * 175 + 165} y={170} color="#64748b" size={14} bold>
                ›
              </SvgText>
            )}
          </g>
        ))}
        <Panel
          x={55}
          y={260}
          w={810}
          h={130}
          title="PURPOSE OF EACH STATE"
          lines={[
            'Blocking prevents loops; Listening and Learning prepare a safe transition.',
            'Learning populates the MAC table before user traffic is allowed.',
            'Forwarding carries normal frames; Disabled is not operational.',
            'Timers such as forward delay are part of classic 802.1D behavior.',
          ]}
          color={s >= 3 ? '#34d399' : '#38bdf8'}
          active
          size={9}
        />
      </svg>
    </StepShell>
  )
}

const rapidStateStages = [
  'Rapid STP يقلل الحالات إلى ثلاث حالات فقط.',
  'Discarding: لا تعلم MAC ولا إرسال حركة مستخدم.',
  'Learning: يتعلم MAC بدون إرسال حركة مستخدم.',
  'Forwarding: إرسال واستقبال كامل.',
  'Discarding يجمع سلوك Blocking وListening وDisabled القديمة.',
  'Proposal/Agreement وEdge Ports يسرّعان الانتقال.',
]

export function RapidStpStatesDiagram() {
  const playback = useStepPlayback(rapidStateStages.length)
  const s = playback.stage
  const states = [
    { label: 'DISCARDING', detail: 'no learn, no forward', color: '#fb7185' },
    { label: 'LEARNING', detail: 'learn MACs only', color: '#f59e0b' },
    { label: 'FORWARDING', detail: 'full data forwarding', color: '#34d399' },
  ]
  return (
    <StepShell title="RAPID STP PORT STATES" playback={playback} legend={rapidStateStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Three Rapid STP port states">
        <Note x={460} y={24} text="RAPID STP USES THREE STATES, NOT FIVE" color="#94a3b8" size={9.5} />
        {states.map((state, index) => (
          <g key={state.label}>
            <StateBox x={95 + index * 250} y={120} label={state.label} detail={state.detail} color={state.color} active={s >= index + 1} />
            {index < states.length - 1 && (
              <SvgText x={95 + index * 250 + 235} y={158} color="#64748b" size={14} bold>
                ›
              </SvgText>
            )}
          </g>
        ))}
        <Panel
          x={55}
          y={250}
          w={810}
          h={150}
          title={s >= 5 ? 'FASTER CONVERGENCE' : 'CLASSIC TO RAPID MAPPING'}
          lines={[
            s >= 5
              ? 'Proposal/Agreement handshake and edge ports reduce the time to reach forwarding.'
              : 'Blocking, Listening, and Disabled collapse into the Discarding state.',
            'Learning remains a separate state, and Forwarding remains the active state.',
            'Do not describe 802.1D five-state behavior as the Rapid PVST+ state model.',
          ]}
          color={s >= 5 ? '#34d399' : '#38bdf8'}
          active
          size={9}
        />
      </svg>
    </StepShell>
  )
}

const perVlanStages = [
  'Rapid PVST+ يشغّل instance مستقل لكل VLAN.',
  'VLAN 10 يمكن أن يكون له Root Bridge مختلف عن VLAN 20.',
  'كل VLAN له Root Port وDesignated وAlternate خاصون به.',
  'حالة المنفذ تتحدد لكل VLAN على حدة.',
  'هذا سلوك per-VLAN وليس Multiple Spanning Tree.',
]

export function RapidPvstPerVlanDiagram() {
  const playback = useStepPlayback(perVlanStages.length)
  const s = playback.stage
  return (
    <StepShell title="RAPID PVST+ PER-VLAN TOPOLOGY" playback={playback} legend={perVlanStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Separate Rapid PVST+ spanning tree instances for VLAN 10 and VLAN 20">
        <Note x={460} y={24} text="ONE INSTANCE PER VLAN, NOT MST" color="#94a3b8" size={9.5} />
        <g opacity={s >= 1 ? 1 : 0.4}>
          <rect x={55} y={70} width={390} height={250} rx="12" fill="#0b1224" stroke="#38bdf8" strokeWidth="2" />
          <SvgText x={250} y={100} color="#38bdf8" size={11} bold>VLAN 10 INSTANCE</SvgText>
          <Device x={90} y={125} w={120} h={65} title="SW1" sub="ROOT" color="#34d399" active />
          <Device x={290} y={125} w={120} h={65} title="SW2" sub="RP" color="#a78bfa" active={s >= 2} />
          <Device x={190} y={235} w={120} h={60} title="SW3" sub="ALT" color="#fb7185" active={s >= 3} />
          <LinkLine x1={210} y1={155} x2={290} y2={155} color="#34d399" active />
          <LinkLine x1={140} y1={190} x2={230} y2={235} color="#34d399" active />
          <LinkLine x1={340} y1={190} x2={250} y2={235} color="#fb7185" active={s >= 3} dashed={s >= 3} />
        </g>
        <g opacity={s >= 2 ? 1 : 0.4}>
          <rect x={475} y={70} width={390} height={250} rx="12" fill="#0b1224" stroke="#a78bfa" strokeWidth="2" />
          <SvgText x={670} y={100} color="#a78bfa" size={11} bold>VLAN 20 INSTANCE</SvgText>
          <Device x={510} y={125} w={120} h={65} title="SW1" sub="RP" color="#38bdf8" active />
          <Device x={710} y={125} w={120} h={65} title="SW2" sub="ROOT" color="#34d399" active />
          <Device x={610} y={235} w={120} h={60} title="SW3" sub="RP" color="#38bdf8" active={s >= 3} />
          <LinkLine x1={630} y1={155} x2={710} y2={155} color="#34d399" active />
          <LinkLine x1={560} y1={190} x2={650} y2={235} color="#fb7185" active={s >= 3} dashed={s >= 3} />
          <LinkLine x1={760} y1={190} x2={670} y2={235} color="#34d399" active />
        </g>
        <Panel
          x={55}
          y={340}
          w={810}
          h={65}
          title={s >= 4 ? 'PER-VLAN DECISION' : 'PER-VLAN VIEW'}
          lines={[
            s >= 4
              ? 'Rapid PVST+ is Cisco per-VLAN Rapid STP; MST groups VLANs into instances instead.'
              : 'The root bridge and blocked link can differ for VLAN 10 and VLAN 20.',
          ]}
          color={s >= 4 ? '#f59e0b' : '#34d399'}
          active
          size={8.9}
        />
      </svg>
    </StepShell>
  )
}

const failureStages = [
  'SW3 يستخدم root port عبر SW2 في حالة forwarding.',
  'الرابط بين SW2 وSW3 يفشل.',
  'SW3 يكتشف تغيير الطوبولوجيا ويختار المسار البديل.',
  'Alternate port ينتقل إلى forwarding.',
  'الطوبولوجيا المنطقية تعمل من جديد باستخدام التكرار الفيزيائي.',
]

export function RootPortFailureDiagram() {
  const playback = useStepPlayback(failureStages.length)
  const s = playback.stage
  const failed = s >= 1
  const recovered = s >= 3
  return (
    <StepShell title="ROOT PORT FAILURE AND ALTERNATE PATH ACTIVATION" playback={playback} legend={failureStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Root port failure and alternate path activation">
        <Note x={460} y={24} text="RAPID CONVERGENCE USES THE ALTERNATE PATH" color="#94a3b8" size={9.2} />
        <Device x={70} y={145} w={190} h={100} title="SW1" sub="ROOT" color="#34d399" active />
        <Device x={670} y={100} w={180} h={90} title="SW2" sub="intermediate" color="#a78bfa" active />
        <Device x={670} y={270} w={180} h={90} title="SW3" sub="dual path" color="#f59e0b" active />
        <LinkLine x1={260} y1={175} x2={670} y2={145} color="#34d399" active />
        <LinkLine x1={750} y1={190} x2={750} y2={270} color={failed ? '#fb7185' : '#34d399'} active={!failed} dashed={failed} />
        <LinkLine x1={260} y1={215} x2={670} y2={310} color={recovered ? '#34d399' : '#fb7185'} active={recovered} dashed={!recovered} />
        {failed && <CrossMark x={750} y={230} color="#fb7185" />}
        {!failed && <Badge x={775} y={205} text="RP / FWD" color="#34d399" active w={110} />}
        {s >= 2 && <Badge x={335} y={265} text="ALT SELECTED" color="#f59e0b" active w={150} />}
        {recovered && <Badge x={330} y={300} text="NOW FORWARDING" color="#34d399" active w={170} />}
        <Panel
          x={55}
          y={370}
          w={810}
          h={40}
          title={s >= 4 ? 'RESULT' : 'TOPOLOGY CHANGE'}
          lines={[s >= 4 ? 'Physical redundancy is used without creating a permanent loop.' : 'Failure removes the active root port and triggers spanning-tree reconvergence.']}
          color={s >= 4 ? '#34d399' : '#fb7185'}
          active
          size={8.7}
        />
      </svg>
    </StepShell>
  )
}

const portFastStages = [
  'منفذ access متصل بـ PC يُعتبر edge port.',
  'PortFast يسمح للمنفذ بالانتقال السريع إلى forwarding.',
  'PortFast لا يلغي عمل STP.',
  'سويتش غير متوقع يتصل بالمنفذ ويرسل BPDU.',
  'BPDU Guard يضع المنفذ غالباً في err-disabled.',
  'لا تُفعّل PortFast على رابط switch-to-switch عادي.',
]

export function PortFastBpduGuardDiagram() {
  const playback = useStepPlayback(portFastStages.length)
  const s = playback.stage
  const unexpected = s >= 3
  const errDisabled = s >= 4
  return (
    <StepShell title="PORTFAST AND BPDU GUARD" playback={playback} legend={portFastStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="PortFast edge port protected by BPDU Guard">
        <Note x={460} y={24} text="EDGE PORTS SHOULD NOT RECEIVE BPDUS" color="#94a3b8" size={9} />
        <Device x={70} y={130} w={230} h={150} title="ACCESS SWITCH" sub="Gi0/1 edge port" color="#38bdf8" active />
        <Device x={640} y={145} w={170} h={90} title="PC" sub="end device" color="#34d399" active={!unexpected} />
        <Device x={640} y={145} w={170} h={90} title="SWITCH?" sub="unexpected device" color="#fb7185" active={unexpected} />
        <LinkLine x1={300} y1={205} x2={640} y2={190} color={errDisabled ? '#fb7185' : '#34d399'} active={!errDisabled} dashed={errDisabled} />
        {!unexpected && <Packet point={{ x: 470, y: 197 }} color="#34d399" label="FRAME" />}
        {unexpected && <Packet point={{ x: 470, y: 197 }} color="#fb7185" label="BPDU" />}
        {s >= 1 && <Badge x={90} y={300} text="PORTFAST: FAST FWD" color="#34d399" active w={190} />}
        {unexpected && <Badge x={350} y={300} text="BPDU RECEIVED" color="#fb7185" active w={180} />}
        {errDisabled && <Badge x={560} y={300} text="ERR-DISABLED" color="#fb7185" active w={180} />}
        {errDisabled && <CrossMark x={470} y={205} color="#fb7185" />}
        <Panel
          x={55}
          y={355}
          w={810}
          h={55}
          title={s >= 5 ? 'RULE' : 'PROTECTION'}
          lines={[
            s >= 5
              ? 'Use PortFast only on true edge ports; use normal STP behavior on switch-to-switch links.'
              : 'BPDU Guard protects PortFast ports from unexpected switches and topology changes.',
          ]}
          color={s >= 5 ? '#f59e0b' : '#34d399'}
          active
          size={8.9}
        />
      </svg>
    </StepShell>
  )
}
